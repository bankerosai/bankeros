import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import { TransactionType } from '@bankeros/shared-types';
import { LedgerService } from '../services/ledger.service';

const ledger = new LedgerService();

const JournalLineSchema = z.object({
  accountCode: z.string(),
  type: z.nativeEnum(TransactionType),
  amount: z.string().regex(/^\d+(\.\d{1,8})?$/),
  currency: z.string().length(3),
  description: z.string().optional(),
});

const PostJournalSchema = z.object({
  referenceId: z.string(),
  referenceType: z.string(),
  description: z.string().optional(),
  businessDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lines: z.array(JournalLineSchema).min(2),
});

export async function journalRoutes(app: FastifyInstance) {
  // POST /v1/gl/journal-entries  — Core double-entry posting (Module 5)
  app.post('/journal-entries', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = PostJournalSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid journal data', body.error.flatten()));

    try {
      const entry = await ledger.postJournal({
        ...body.data,
        businessDate: new Date(body.data.businessDate),
        createdById: (request as any).jwtPayload?.sub,
      });
      return reply.status(201).send(success(entry));
    } catch (err: any) {
      return reply.status(400).send(failure('JOURNAL_ERROR', err.message));
    }
  });

  // GET /v1/gl/journal-entries/:id
  app.get('/journal-entries/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const entry = await prisma.journalEntry.findUnique({ where: { id }, include: { lines: true } });
    if (!entry) return reply.status(404).send(failure('NOT_FOUND', 'Journal entry not found'));
    return reply.send(success(entry));
  });

  // GET /v1/gl/accounts/:accountCode/balances  — Real-time GL balance
  app.get('/accounts/:accountCode/balances', { preHandler: [requireAuth] }, async (request, reply) => {
    const { accountCode } = request.params as { accountCode: string };
    const { asOf } = request.query as { asOf?: string };
    try {
      const balance = await ledger.getGlBalance(accountCode, asOf ? new Date(asOf) : undefined);
      return reply.send(success(balance));
    } catch (err: any) {
      return reply.status(404).send(failure('NOT_FOUND', err.message));
    }
  });

  // POST /v1/gl/journal-entries/:id/reverse  — Reverse a posted entry
  app.post('/journal-entries/:id/reverse', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'AUDITOR')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { reason } = request.body as { reason: string };
    try {
      const reversal = await ledger.reverseJournal(id, reason, (request as any).jwtPayload?.sub);
      return reply.send(success(reversal));
    } catch (err: any) {
      return reply.status(400).send(failure('REVERSAL_ERROR', err.message));
    }
  });

  // GET /v1/gl/trial-balance
  app.get('/trial-balance', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'AUDITOR')] }, async (request, reply) => {
    const { date } = request.query as { date?: string };
    const businessDate = date ? new Date(date) : new Date();
    const trialBalance = await ledger.generateTrialBalance(businessDate);
    return reply.send(success(trialBalance));
  });

  // GET /v1/gl/chart-of-accounts
  app.get('/chart-of-accounts', { preHandler: [requireAuth] }, async (request, reply) => {
    const accounts = await prisma.glAccount.findMany({ orderBy: { code: 'asc' } });
    return reply.send(success(accounts));
  });

  // POST /v1/gl/end-of-day/trigger  — EOD batch trigger (Module 5)
  app.post('/end-of-day/trigger', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { businessDate } = request.body as { businessDate: string };
    const job = await prisma.batchJob.create({
      data: {
        name: 'EOD_JOURNAL_CLOSE',
        type: 'EOD_INTEREST',
        businessDate: new Date(businessDate),
        status: 'PENDING',
      },
    });
    return reply.status(202).send(success({ jobId: job.id, message: 'EOD batch job queued', status: job.status }));
  });
}
