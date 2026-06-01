import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';

const ScreeningSchema = z.object({
  entityType: z.enum(['CUSTOMER', 'PAYMENT', 'COUNTERPARTY']),
  entityId: z.string(),
  name: z.string().min(2),
  country: z.string().length(2).optional(),
  dateOfBirth: z.string().optional(),
});

const EvaluateTransactionSchema = z.object({
  paymentId: z.string().uuid(),
  amount: z.string(),
  currency: z.string().length(3),
  debtorAccountId: z.string().uuid(),
  creditorBankBic: z.string().optional(),
  creditorCountry: z.string().length(2).optional(),
});

const UpdateCaseSchema = z.object({
  status: z.enum(['OPEN', 'UNDER_REVIEW', 'ESCALATED', 'CLOSED_SAR', 'CLOSED_NO_ACTION']),
  resolution: z.string().optional(),
  findings: z.record(z.unknown()).optional(),
});

export async function complianceRoutes(app: FastifyInstance) {
  // POST /v1/compliance/kyc/screenings  — Sanctions & PEP screening (Module 9)
  app.post('/kyc/screenings', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const body = ScreeningSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid screening request'));

    const { entityType, entityId, name, country } = body.data;

    const HIGH_RISK_COUNTRIES = ['IR', 'KP', 'SY', 'CU', 'SD', 'AF', 'MM'];
    const SANCTIONS_LISTS = ['OFAC_SDN', 'UN_1267', 'EU_CONSOLIDATED', 'HMT_CONSOLIDATED'];

    // Stub: replace with real Dow Jones / Refinitiv / ComplyAdvantage API call
    const screeningResults = await Promise.all(
      SANCTIONS_LISTS.map(async (list) => {
        const isMatch = false; // Real API would check here
        const isPep = false;   // Real PEP screening

        const result = await prisma.sanctionsScreeningResult.create({
          data: {
            entityType,
            entityId,
            name,
            matchScore: isMatch ? 0.97 : 0.01,
            listName: list,
            isPep,
            isMatch,
          },
        });

        return result;
      }),
    );

    const riskScore = country && HIGH_RISK_COUNTRIES.includes(country) ? 0.75 : 0.1;
    const anyMatch = screeningResults.some((r) => r.isMatch);

    if (anyMatch) {
      await prisma.complianceCase.create({
        data: {
          caseNumber: `SANC-${Date.now()}`,
          customerId: entityType === 'CUSTOMER' ? entityId : undefined,
          type: 'SANCTIONS_HIT',
          status: 'OPEN',
          description: `Potential sanctions match for ${name}`,
          riskScore: riskScore.toFixed(4),
        },
      });
    }

    return reply.status(201).send(success({
      screeningId: screeningResults[0].id,
      name,
      riskScore: riskScore.toFixed(4),
      sanctionsMatch: anyMatch,
      pepMatch: screeningResults.some((r) => r.isPep),
      listsChecked: SANCTIONS_LISTS,
      recommendation: anyMatch ? 'BLOCK' : riskScore > 0.5 ? 'REVIEW' : 'PASS',
    }));
  });

  // POST /v1/risk/transactions/evaluate  — Real-time fraud scoring (Module 9)
  app.post('/transactions/evaluate', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = EvaluateTransactionSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid transaction data'));

    const { paymentId, amount, debtorAccountId, creditorBankBic, creditorCountry } = body.data;

    // Multi-factor fraud scoring model (stub — replace with ML model in production)
    const factors: Record<string, number> = {};
    const amountNum = parseFloat(amount);

    if (amountNum > 10000) factors.highValue = 0.15;
    if (amountNum > 100000) factors.veryHighValue = 0.25;

    const HIGH_RISK = ['IR', 'KP', 'SY', 'CU', 'NG', 'VE'];
    if (creditorCountry && HIGH_RISK.includes(creditorCountry)) factors.highRiskCountry = 0.30;

    const recentCount = await prisma.payment.count({
      where: {
        debtorAccountId,
        instructedAt: { gte: new Date(Date.now() - 3600 * 1000) },
        status: { notIn: ['FAILED', 'CANCELLED'] },
      },
    });
    if (recentCount > 5) factors.velocityHigh = 0.20;
    if (recentCount > 10) factors.velocityVeryHigh = 0.30;

    const totalScore = Math.min(Object.values(factors).reduce((a, b) => a + b, 0), 1.0);
    const decision = totalScore > 0.9 ? 'BLOCK' : totalScore > 0.6 ? 'REVIEW' : 'PASS';

    if (decision === 'BLOCK' || decision === 'REVIEW') {
      await prisma.complianceCase.create({
        data: {
          caseNumber: `FRAUD-${Date.now()}`,
          paymentId,
          type: 'SAR',
          status: decision === 'BLOCK' ? 'OPEN' : 'UNDER_REVIEW',
          description: `Automated fraud flag: score=${totalScore.toFixed(4)}`,
          riskScore: totalScore.toFixed(4),
          findings: factors,
        },
      });
    }

    return reply.send(success({
      paymentId,
      fraudScore: totalScore.toFixed(4),
      decision,
      factors,
      blocked: decision === 'BLOCK',
    }));
  });

  // GET /v1/compliance/cases
  app.get('/cases', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { page = 1, pageSize = 20, status, type } = request.query as { page?: number; pageSize?: number; status?: string; type?: string };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const [cases, total] = await Promise.all([
      prisma.complianceCase.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.complianceCase.count({ where }),
    ]);
    return reply.send(paginate(cases, total, page, pageSize));
  });

  // PATCH /v1/compliance/cases/:caseId/status  — Case disposition (Module 9)
  app.patch('/cases/:caseId/status', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { caseId } = request.params as { caseId: string };
    const body = UpdateCaseSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid case update'));

    const updated = await prisma.complianceCase.update({
      where: { id: caseId },
      data: {
        status: body.data.status,
        resolution: body.data.resolution,
        findings: body.data.findings,
        resolvedAt: ['CLOSED_SAR', 'CLOSED_NO_ACTION'].includes(body.data.status) ? new Date() : undefined,
      },
    });

    return reply.send(success(updated));
  });

  // GET /v1/compliance/cases/:caseId
  app.get('/cases/:caseId', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { caseId } = request.params as { caseId: string };
    const complianceCase = await prisma.complianceCase.findUnique({ where: { id: caseId } });
    if (!complianceCase) return reply.status(404).send(failure('NOT_FOUND', 'Compliance case not found'));
    return reply.send(success(complianceCase));
  });

  // ────────────────────────────────────────────────────────────
  // Banker Copilot read-only — credit rating + exposure projections.
  // Both routes are mounted under /v1/risk via index.ts prefix.
  // ────────────────────────────────────────────────────────────
  app.get('/credit-rating/:cif', async (request, reply) => {
    const { cif } = request.params as { cif: string };
    const c = await prisma.customer.findFirst({
      where: { OR: [{ cifNumber: cif }, { id: cif }] },
    });
    if (!c) return reply.status(404).send(failure('NOT_FOUND', `No customer ${cif}`));
    const score = c.riskScore ?? 50;
    const rating = score >= 80 ? 'AA-' : score >= 60 ? 'A' : score >= 40 ? 'BBB+' : 'BB';
    // Coarse IRB approximation — production banks derive these from rating
    // models with model-validation governance. This is a demo projection.
    const pd =
      score >= 80 ? 0.0024 : score >= 60 ? 0.0048 : score >= 40 ? 0.0084 : 0.0200;
    return reply.send(
      success({
        cif: c.cifNumber,
        internalRating: rating,
        ratingScale: 'INTERNAL_18_NOTCH',
        ratingDate: c.updatedAt.toISOString().slice(0, 10),
        irb: { pd, lgd: 0.45, ead: { currency: 'CNY', amount: 0 } },
        ifrs9Stage: score >= 40 ? 'STAGE_1' : 'STAGE_2',
        watchList: score < 40,
        sourceScore: score,
      }),
    );
  });

  app.get('/exposure/:cif', async (request, reply) => {
    const { cif } = request.params as { cif: string };
    const c = await prisma.customer.findFirst({
      where: { OR: [{ cifNumber: cif }, { id: cif }] },
      include: {
        loans: { where: { status: { in: ['DISBURSED', 'ACTIVE'] } } },
      },
    });
    if (!c) return reply.status(404).send(failure('NOT_FOUND', `No customer ${cif}`));
    const totalOutstanding = c.loans.reduce(
      (sum, l) => sum + Number(l.outstandingPrincipal ?? l.principal ?? 0),
      0,
    );
    const totalLimit = c.loans.reduce((sum, l) => sum + Number(l.principal ?? 0), 0);
    return reply.send(
      success({
        cif: c.cifNumber,
        asOf: new Date().toISOString().slice(0, 10),
        totalOutstanding: { currency: 'CNY', amount: totalOutstanding },
        totalLimit: { currency: 'CNY', amount: totalLimit },
        utilisation: totalLimit > 0 ? totalOutstanding / totalLimit : 0,
        loanCount: c.loans.length,
        groupRollupApplied: false,
      }),
    );
  });
}
