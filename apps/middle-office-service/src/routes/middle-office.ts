import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, generateId, paginate } from '@bankeros/shared-utils';
import Decimal from 'decimal.js';

// In-memory reconciliation store (production: dedicated DB tables)
const reconciliations: Map<string, any> = new Map();
const exceptions: Map<string, any> = new Map();
const oauthConsents: Map<string, any> = new Map();      // Open Banking consent store

const ReconFileSchema = z.object({
  source: z.string(),
  businessDate: z.string(),
  records: z.array(z.object({
    externalRef: z.string(),
    amount: z.string(),
    currency: z.string().length(3),
    valueDate: z.string(),
    description: z.string().optional(),
  })),
});

const ConsentSchema = z.object({           // BaaS / Open Banking (Module 17)
  customerId: z.string().uuid(),
  tppClientId: z.string(),
  tppName: z.string(),
  permissions: z.array(z.enum(['ReadAccountsBasic', 'ReadAccountsDetail', 'ReadBalances', 'ReadTransactions', 'ReadPayments'])),
  expirationDateTime: z.string(),
  transactionFromDateTime: z.string().optional(),
  transactionToDateTime: z.string().optional(),
});

const DocumentUploadSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  checksum: z.string(),
  storageKey: z.string(),    // S3 key or equivalent
  sizeBytes: z.number().int().positive(),
});

export async function middleOfficeRoutes(app: FastifyInstance) {
  // ===== RECONCILIATION MODULE (Module 16) =====

  // POST /v1/middle-office/reconciliations/execute  — Auto-reconciliation (Module 16)
  app.post('/reconciliations/execute', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const body = ReconFileSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid reconciliation file'));

    const { source, businessDate, records } = body.data;
    const reconId = generateId();
    const exceptionList: any[] = [];

    let matched = 0;
    let unmatched = 0;

    for (const record of records) {
      // Attempt to match against internal payment records
      const internalPayment = await prisma.payment.findFirst({
        where: {
          paymentReference: { contains: record.externalRef },
          amount: new Decimal(record.amount),
          currency: record.currency,
          status: 'COMPLETED',
        },
      });

      if (internalPayment) {
        matched++;
      } else {
        unmatched++;
        const exceptionId = generateId();
        const exc = {
          id: exceptionId,
          reconId,
          externalRef: record.externalRef,
          amount: record.amount,
          currency: record.currency,
          description: record.description,
          reason: 'NO_INTERNAL_MATCH',
          status: 'OPEN',
          createdAt: new Date().toISOString(),
        };
        exceptions.set(exceptionId, exc);
        exceptionList.push(exc);
      }
    }

    const recon = {
      id: reconId,
      source,
      businessDate,
      totalRecords: records.length,
      matched,
      unmatched,
      matchRate: records.length ? (matched / records.length * 100).toFixed(2) : '100.00',
      exceptions: exceptionList,
      status: unmatched === 0 ? 'CLEAN' : 'EXCEPTIONS',
      completedAt: new Date().toISOString(),
    };

    reconciliations.set(reconId, recon);
    return reply.status(201).send(success(recon));
  });

  // GET /v1/middle-office/exceptions/:exceptionId  — Get exception detail (Module 16)
  app.get('/exceptions/:exceptionId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { exceptionId } = request.params as { exceptionId: string };
    const exc = exceptions.get(exceptionId);
    if (!exc) return reply.status(404).send(failure('NOT_FOUND', 'Exception not found'));
    return reply.send(success(exc));
  });

  // PATCH /v1/middle-office/exceptions/:exceptionId  — Resolve exception
  app.patch('/exceptions/:exceptionId', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { exceptionId } = request.params as { exceptionId: string };
    const { resolution, status } = request.body as { resolution: string; status: 'RESOLVED' | 'ESCALATED' | 'WRITTEN_OFF' };
    const exc = exceptions.get(exceptionId);
    if (!exc) return reply.status(404).send(failure('NOT_FOUND', 'Exception not found'));

    exc.status = status;
    exc.resolution = resolution;
    exc.resolvedAt = new Date().toISOString();
    exc.resolvedById = (request as any).jwtPayload?.sub;

    return reply.send(success(exc));
  });

  // ===== DOCUMENT MANAGEMENT (Module 10 / Module 16) =====

  // POST /v1/documents/upload  — Encrypted document storage
  app.post('/documents/upload', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = DocumentUploadSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid document metadata'));

    const doc = await prisma.document.create({
      data: {
        fileName: body.data.fileName,
        contentType: body.data.contentType,
        sizeBytes: body.data.sizeBytes,
        storageKey: body.data.storageKey,
        checksum: body.data.checksum,
        entityType: body.data.entityType,
        entityId: body.data.entityId,
        uploadedById: (request as any).jwtPayload?.sub,
      },
    });

    return reply.status(201).send(success({
      documentId: doc.id,
      fileName: doc.fileName,
      entityType: doc.entityType,
      entityId: doc.entityId,
      uploadedAt: doc.createdAt,
      message: 'Document stored and indexed successfully',
    }));
  });

  // GET /v1/documents  — Query documents by entity
  app.get('/documents', { preHandler: [requireAuth] }, async (request, reply) => {
    const { entityType, entityId, page = 1, pageSize = 20 } = request.query as { entityType: string; entityId: string; page?: number; pageSize?: number };
    const skip = (page - 1) * pageSize;

    const [docs, total] = await Promise.all([
      prisma.document.findMany({ where: { entityType, entityId }, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.document.count({ where: { entityType, entityId } }),
    ]);

    return reply.send(paginate(docs, total, page, pageSize));
  });

  // ===== OPEN BANKING / BaaS CONSENT (Module 17) =====

  // POST /open-banking/v3.1/aisp/account-access-consents  — Create AIS consent
  app.post('/consents/account-access', async (request, reply) => {
    const body = ConsentSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid consent request'));

    const consentId = generateId();
    const consent = {
      consentId,
      status: 'AwaitingAuthorisation',
      ...body.data,
      createdAt: new Date().toISOString(),
      authorisedAt: null,
      revokedAt: null,
    };

    oauthConsents.set(consentId, consent);
    return reply.status(201).send(success(consent));
  });

  // GET /open-banking/v3.1/aisp/account-access-consents/:consentId  — Check consent status (Module 13)
  app.get('/consents/account-access/:consentId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { consentId } = request.params as { consentId: string };
    const consent = oauthConsents.get(consentId);
    if (!consent) return reply.status(404).send(failure('NOT_FOUND', 'Consent not found'));
    return reply.send(success(consent));
  });

  // POST /open-banking/v3.1/aisp/account-access-consents/:consentId/authorise  — Customer authorises consent
  app.post('/consents/account-access/:consentId/authorise', { preHandler: [requireAuth] }, async (request, reply) => {
    const { consentId } = request.params as { consentId: string };
    const consent = oauthConsents.get(consentId);
    if (!consent) return reply.status(404).send(failure('NOT_FOUND', 'Consent not found'));
    if (consent.status !== 'AwaitingAuthorisation') return reply.status(400).send(failure('ALREADY_PROCESSED', 'Consent is not pending authorisation'));

    consent.status = 'Authorised';
    consent.authorisedAt = new Date().toISOString();
    consent.authorisedById = (request as any).jwtPayload?.sub;

    return reply.send(success({ consentId, status: 'Authorised', message: 'TPP data access authorised' }));
  });

  // DELETE /open-banking/v3.1/aisp/account-access-consents/:consentId  — Revoke consent
  app.delete('/consents/account-access/:consentId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { consentId } = request.params as { consentId: string };
    const consent = oauthConsents.get(consentId);
    if (!consent) return reply.status(404).send(failure('NOT_FOUND', 'Consent not found'));

    consent.status = 'Revoked';
    consent.revokedAt = new Date().toISOString();

    return reply.send(success({ consentId, status: 'Revoked' }));
  });

  // GET /v1/middle-office/reconciliations/:reconId  — Fetch recon summary
  app.get('/reconciliations/:reconId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { reconId } = request.params as { reconId: string };
    const recon = reconciliations.get(reconId);
    if (!recon) return reply.status(404).send(failure('NOT_FOUND', 'Reconciliation not found'));
    return reply.send(success(recon));
  });
}
