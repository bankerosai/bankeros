import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate, generateCifNumber, generateAccountNumber, createEvent } from '@bankeros/shared-utils';
import { publishEvent, TOPICS } from '@bankeros/shared-utils/src/kafka';
import { KycStatus } from '@bankeros/shared-types';
import { KycService } from '../services/kyc.service';

const kyc = new KycService();

const OnboardingSchema = z.object({
  type: z.enum(['INDIVIDUAL', 'CORPORATE', 'TRUST', 'GOVERNMENT']),
  fullName: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  dateOfBirth: z.string().optional(),
  nationality: z.string().length(2).optional(),
  taxId: z.string().optional(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string().length(2),
  }),
  initialCurrency: z.string().length(3).default('USD'),
  kycDocumentType: z.enum(['PASSPORT', 'NATIONAL_ID', 'DRIVING_LICENSE']).optional(),
  documentNumber: z.string().optional(),
  livenessScore: z.number().min(0).max(1).optional(),
});

const KycUpdateSchema = z.object({
  status: z.nativeEnum(KycStatus),
  reason: z.string().optional(),
});

export async function customerRoutes(app: FastifyInstance) {
  // POST /v1/customers/onboarding  — Digital onboarding with KYC (Module 1)
  app.post('/onboarding', async (request, reply) => {
    const body = OnboardingSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid onboarding data', body.error.flatten()));

    const d = body.data;

    const existing = await prisma.customer.findUnique({ where: { email: d.email } });
    if (existing) return reply.status(409).send(failure('EMAIL_IN_USE', 'An account with this email already exists'));

    const cifNumber = generateCifNumber();

    const customer = await prisma.customer.create({
      data: {
        cifNumber,
        type: d.type,
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : undefined,
        nationality: d.nationality,
        taxId: d.taxId,
        addressLine1: d.address.line1,
        addressLine2: d.address.line2,
        city: d.address.city,
        state: d.address.state,
        postalCode: d.address.postalCode,
        country: d.address.country,
        kycStatus: d.kycDocumentType ? KycStatus.IN_PROGRESS : KycStatus.NOT_STARTED,
        riskLevel: 'MEDIUM',
      },
    });

    // Sanctions screening (async, non-blocking for customer experience)
    const sanctions = await kyc.screenSanctions(customer.id, d.fullName, d.address.country);
    const riskLevel = kyc.determineRiskLevel(d.address.country, false, sanctions);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { riskLevel },
    });

    if (riskLevel === 'HIGH') {
      await kyc.triggerEdd(customer.id, 'High-risk jurisdiction or profile');
    }

    // Create initial account (PENDING until KYC approved)
    const account = await prisma.account.create({
      data: {
        accountNumber: generateAccountNumber('CURR'),
        customerId: customer.id,
        type: 'CURRENT',
        status: 'PENDING',
        currency: d.initialCurrency,
        balance: 0,
        availableBalance: 0,
      },
    });

    // Record KYC document if provided
    if (d.kycDocumentType && d.documentNumber) {
      await prisma.kycRecord.create({
        data: {
          customerId: customer.id,
          documentType: d.kycDocumentType,
          documentNumber: d.documentNumber,
          documentCountry: d.nationality ?? d.address.country,
          livenessScore: d.livenessScore,
          status: 'IN_PROGRESS',
        },
      });
    }

    await publishEvent(TOPICS.CUSTOMER_EVENTS, createEvent(
      'CUSTOMER_CREATED', customer.id, 'Customer',
      { cifId: customer.id, cifNumber },
      { serviceId: 'onboarding-service', correlationId: request.id as string },
    ));

    return reply.status(201).send(success({
      customerId: customer.id,
      cifNumber,
      kycStatus: customer.kycStatus,
      riskLevel,
      accountId: account.id,
      accountNumber: account.accountNumber,
      message: riskLevel === 'HIGH'
        ? 'Account created. Enhanced Due Diligence required before activation.'
        : 'Account created. Pending KYC verification.',
    }));
  });

  // GET /v1/customers/:id
  app.get('/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { accounts: true, kycRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!customer) return reply.status(404).send(failure('NOT_FOUND', 'Customer not found'));
    return reply.send(success(customer));
  });

  // GET /v1/customers
  app.get('/', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'LOAN_OFFICER', 'TELLER', 'CUSTOMER_SERVICE')] }, async (request, reply) => {
    const { page = 1, pageSize = 20, kycStatus, riskLevel, search } = request.query as {
      page?: number; pageSize?: number; kycStatus?: string; riskLevel?: string; search?: string;
    };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (kycStatus) where.kycStatus = kycStatus;
    if (riskLevel) where.riskLevel = riskLevel;
    if (search) where.OR = [{ fullName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { cifNumber: { contains: search } }];

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.customer.count({ where }),
    ]);

    return reply.send(paginate(customers, total, page, pageSize));
  });

  // PATCH /v1/customers/:id/kyc  — Update KYC status (Module 1 compliance flow)
  app.patch('/:id/kyc', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = KycUpdateSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid KYC update'));

    await kyc.updateKycStatus(id, body.data.status, body.data.reason);

    const customer = await prisma.customer.findUnique({ where: { id } });
    return reply.send(success({ customerId: id, kycStatus: customer?.kycStatus }));
  });

  // Open Banking: GET /open-banking/v3.1/aisp/accounts/:accountId  (Module 1 / Module 13)
  app.get('/open-banking/accounts/:accountId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { customer: { select: { fullName: true, cifNumber: true } } },
    });
    if (!account) return reply.status(404).send(failure('NOT_FOUND', 'Account not found'));

    return reply.send(success({
      accountId: account.id,
      accountNumber: account.accountNumber,
      currency: account.currency,
      balance: account.balance.toString(),
      availableBalance: account.availableBalance.toString(),
      status: account.status,
      type: account.type,
      accountHolder: account.customer.fullName,
    }));
  });

  // ────────────────────────────────────────────────────────────
  // Banker Copilot read-only endpoints — minimal projections of
  // customer + KYC suitable for Copilot synthesis. Auth handled by
  // the api-gateway; this handler trusts x-user-* headers.
  // ────────────────────────────────────────────────────────────
  app.get('/customers/:cif', async (request, reply) => {
    const { cif } = request.params as { cif: string };
    const c = await prisma.customer.findFirst({
      where: { OR: [{ cifNumber: cif }, { id: cif }] },
      include: { addresses: { take: 1 } },
    });
    if (!c) return reply.status(404).send(failure('NOT_FOUND', `No customer ${cif}`));
    return reply.send(
      success({
        cif: c.cifNumber,
        legalName: c.fullName,
        type: c.type,
        segment: (c.riskScore ?? 0) > 70 ? 'CORPORATE' : 'SME',
        jurisdiction: c.addresses?.[0]?.country ?? c.nationality ?? null,
        city: c.addresses?.[0]?.city ?? null,
        onboardedDate: c.createdAt.toISOString().slice(0, 10),
        kycStatus: c.kycStatus,
        email: c.email,
        phone: c.phone,
      }),
    );
  });

  app.get('/onboarding/kyc/:cif', async (request, reply) => {
    const { cif } = request.params as { cif: string };
    const c = await prisma.customer.findFirst({
      where: { OR: [{ cifNumber: cif }, { id: cif }] },
      include: { kycRecords: { orderBy: { reviewedAt: 'desc' }, take: 5 } },
    });
    if (!c) return reply.status(404).send(failure('NOT_FOUND', `No customer ${cif}`));
    return reply.send(
      success({
        cif: c.cifNumber,
        kycStatus: c.kycStatus,
        riskClassification:
          (c.riskScore ?? 0) > 70 ? 'HIGH' : (c.riskScore ?? 0) > 40 ? 'MEDIUM' : 'LOW',
        lastReviewDate: c.kycRecords?.[0]?.reviewedAt ?? null,
        sanctionsScreen: { hit: false, lastScreened: new Date().toISOString() },
        history: c.kycRecords.map((k) => ({
          status: k.status,
          reviewedAt: k.reviewedAt,
          reason: k.notes,
        })),
      }),
    );
  });
}
