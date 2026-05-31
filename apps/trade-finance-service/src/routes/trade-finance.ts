import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';

const LcApplicationSchema = z.object({
  applicantCifId: z.string().uuid(),
  beneficiaryName: z.string().min(2),
  beneficiaryBank: z.string().min(2),
  advisingBankBic: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiryPlace: z.string(),
  goodsDescription: z.string().min(10),
  documentList: z.array(z.string()),
  portOfLoading: z.string().optional(),
  portOfDischarge: z.string().optional(),
});

const LcAmendmentSchema = z.object({
  changes: z.object({
    amount: z.string().optional(),
    expiryDate: z.string().optional(),
    documentList: z.array(z.string()).optional(),
    goodsDescription: z.string().optional(),
  }),
});

const GuaranteeSchema = z.object({
  applicantCifId: z.string().uuid(),
  beneficiaryName: z.string(),
  type: z.enum(['BID_BOND', 'PERFORMANCE_BOND', 'ADVANCE_PAYMENT', 'FINANCIAL']),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3),
  expiryDate: z.string(),
  terms: z.string(),
});

export async function tradeFinanceRoutes(app: FastifyInstance) {
  // POST /v3/trade-finance/import-lc/applications  — Open L/C (Module 4)
  app.post('/import-lc/applications', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = LcApplicationSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid LC application', body.error.flatten()));

    const d = body.data;
    const lcNumber = `LC${Date.now()}`;

    const lc = await prisma.letterOfCredit.create({
      data: {
        lcNumber,
        applicantCifId: d.applicantCifId,
        beneficiaryName: d.beneficiaryName,
        beneficiaryBank: d.beneficiaryBank,
        advisingBankBic: d.advisingBankBic,
        amount: d.amount,
        currency: d.currency,
        expiryDate: new Date(d.expiryDate),
        expiryPlace: d.expiryPlace,
        goodsDescription: d.goodsDescription,
        documentList: d.documentList,
        portOfLoading: d.portOfLoading,
        portOfDischarge: d.portOfDischarge,
        status: 'APPLIED',
      },
    });

    return reply.status(201).send(success(lc));
  });

  // GET /v3/trade-finance/import-lc/:lcId
  app.get('/import-lc/:lcId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { lcId } = request.params as { lcId: string };
    const lc = await prisma.letterOfCredit.findUnique({ where: { id: lcId }, include: { amendments: true } });
    if (!lc) return reply.status(404).send(failure('NOT_FOUND', 'Letter of Credit not found'));
    return reply.send(success(lc));
  });

  // GET /v3/trade-finance/import-lc
  app.get('/import-lc', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { page = 1, pageSize = 20, applicantCifId, status } = request.query as { page?: number; pageSize?: number; applicantCifId?: string; status?: string };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (applicantCifId) where.applicantCifId = applicantCifId;
    if (status) where.status = status;

    const [lcs, total] = await Promise.all([
      prisma.letterOfCredit.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.letterOfCredit.count({ where }),
    ]);
    return reply.send(paginate(lcs, total, page, pageSize));
  });

  // POST /v3/trade-finance/import-lc/:lcId/amendments  — LC amendment (Module 4)
  app.post('/import-lc/:lcId/amendments', { preHandler: [requireAuth] }, async (request, reply) => {
    const { lcId } = request.params as { lcId: string };
    const body = LcAmendmentSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid amendment data'));

    const lc = await prisma.letterOfCredit.findUnique({ where: { id: lcId }, include: { amendments: true } });
    if (!lc) return reply.status(404).send(failure('NOT_FOUND', 'LC not found'));
    if (!['ISSUED', 'ADVISED'].includes(lc.status)) {
      return reply.status(400).send(failure('INVALID_STATE', `LC in ${lc.status} status cannot be amended`));
    }

    const amendNumber = lc.amendments.length + 1;
    const amendment = await prisma.lcAmendment.create({
      data: { lcId, amendNumber, changes: body.data.changes, requestedAt: new Date() },
    });

    await prisma.letterOfCredit.update({ where: { id: lcId }, data: { status: 'AMENDED' } });

    return reply.status(201).send(success(amendment));
  });

  // POST /v3/trade-finance/import-lc/:lcId/issue  — Issue LC (bank officer action)
  app.post('/import-lc/:lcId/issue', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { lcId } = request.params as { lcId: string };
    const lc = await prisma.letterOfCredit.findUnique({ where: { id: lcId } });
    if (!lc || lc.status !== 'APPLIED') return reply.status(400).send(failure('INVALID_STATE', 'Only APPLIED LCs can be issued'));

    const swiftMsgRef = `MT700${Date.now()}`;
    const updated = await prisma.letterOfCredit.update({
      where: { id: lcId },
      data: { status: 'ISSUED', issuedAt: new Date(), swiftMsgRef },
    });

    return reply.send(success(updated));
  });

  // POST /v3/trade-finance/guarantees  — Issue bank guarantee (Module 4)
  app.post('/guarantees', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = GuaranteeSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid guarantee data'));

    const d = body.data;
    const guarantee = await prisma.bankGuarantee.create({
      data: {
        guaranteeNumber: `BG${Date.now()}`,
        applicantCifId: d.applicantCifId,
        beneficiaryName: d.beneficiaryName,
        type: d.type,
        amount: d.amount,
        currency: d.currency,
        expiryDate: new Date(d.expiryDate),
        terms: d.terms,
      },
    });

    return reply.status(201).send(success(guarantee));
  });

  // GET /v3/trade-finance/guarantees/:guaranteeId  — Fetch guarantee (Module 4)
  app.get('/guarantees/:guaranteeId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { guaranteeId } = request.params as { guaranteeId: string };
    const guarantee = await prisma.bankGuarantee.findUnique({ where: { id: guaranteeId } });
    if (!guarantee) return reply.status(404).send(failure('NOT_FOUND', 'Bank guarantee not found'));
    return reply.send(success(guarantee));
  });
}
