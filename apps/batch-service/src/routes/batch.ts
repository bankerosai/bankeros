import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import { runEodInterestAccrual } from '../jobs/eod.job';

const TriggerEodSchema = z.object({
  businessDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  jobType: z.enum(['EOD_INTEREST', 'EOD_REVALUATION', 'OVERDUE_CHECK', 'REPORT_GEN']).default('EOD_INTEREST'),
});

export async function batchRoutes(app: FastifyInstance) {
  // POST /v1/batch-jobs/eod/execute  — Trigger EOD batch (Module 14)
  app.post('/eod/execute', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const body = TriggerEodSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid batch request'));

    const { businessDate, jobType } = body.data;
    const bizDate = new Date(businessDate);

    // Idempotency check — prevent double-run
    const existing = await prisma.batchJob.findFirst({
      where: { type: jobType, businessDate: bizDate, status: { in: ['PENDING', 'RUNNING', 'COMPLETED'] } },
    });
    if (existing) {
      return reply.status(409).send(failure('ALREADY_EXISTS', `EOD job for ${businessDate} already ${existing.status}`));
    }

    const job = await prisma.batchJob.create({
      data: { name: `EOD_${jobType}_${businessDate}`, type: jobType, businessDate: bizDate, status: 'PENDING' },
    });

    // Run async (in production: push to BullMQ queue)
    setImmediate(() => {
      runEodInterestAccrual(job.id, bizDate).catch((err) => {
        console.error('EOD job failed:', err);
      });
    });

    return reply.status(202).send(success({
      jobId: job.id,
      type: jobType,
      businessDate,
      status: 'PENDING',
      message: 'EOD batch job queued for execution',
    }));
  });

  // GET /v1/batch-jobs/:jobId/status  — Monitor job (Module 14)
  app.get('/:jobId/status', { preHandler: [requireAuth] }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await prisma.batchJob.findUnique({ where: { id: jobId } });
    if (!job) return reply.status(404).send(failure('NOT_FOUND', 'Batch job not found'));

    return reply.send(success({
      jobId: job.id,
      name: job.name,
      type: job.type,
      businessDate: job.businessDate,
      status: job.status,
      progress: job.progress,
      processedRecords: job.processedRecords,
      totalRecords: job.totalRecords,
      errorCount: job.errorCount,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    }));
  });

  // GET /v1/batch-jobs — List all jobs
  app.get('/', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { page = 1, pageSize = 20, type, status } = request.query as { page?: number; pageSize?: number; type?: string; status?: string };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [jobs, total] = await Promise.all([
      prisma.batchJob.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.batchJob.count({ where }),
    ]);
    return reply.send(paginate(jobs, total, page, pageSize));
  });

  // GET /v1/reporting/regulatory/:reportCode/generate  — Regulatory reports (Module 19)
  app.get('/regulatory/:reportCode/generate', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'AUDITOR', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { reportCode } = request.params as { reportCode: string };
    const { period } = request.query as { period?: string };

    const reportDate = period ? new Date(period) : new Date();
    const fromDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1);

    switch (reportCode) {
      case 'BALANCE_SHEET': {
        const [totalDeposits, totalLoans] = await Promise.all([
          prisma.account.aggregate({ where: { type: { in: ['CURRENT', 'SAVINGS'] }, status: 'ACTIVE' }, _sum: { balance: true } }),
          prisma.loan.aggregate({ where: { status: 'ACTIVE' }, _sum: { outstandingBalance: true } }),
        ]);
        return reply.send(success({
          reportCode,
          period: reportDate.toISOString().split('T')[0],
          generatedAt: new Date().toISOString(),
          data: {
            totalCustomerDeposits: totalDeposits._sum.balance?.toString() ?? '0',
            totalLoanBook: totalLoans._sum.outstandingBalance?.toString() ?? '0',
          },
        }));
      }

      case 'PAYMENT_VOLUME': {
        const [completed, failed, total] = await Promise.all([
          prisma.payment.count({ where: { status: 'COMPLETED', instructedAt: { gte: fromDate, lte: reportDate } } }),
          prisma.payment.count({ where: { status: 'FAILED', instructedAt: { gte: fromDate, lte: reportDate } } }),
          prisma.payment.count({ where: { instructedAt: { gte: fromDate, lte: reportDate } } }),
        ]);
        return reply.send(success({ reportCode, period: fromDate.toISOString().split('T')[0], data: { total, completed, failed, successRate: total ? (completed / total * 100).toFixed(2) : '0' } }));
      }

      default:
        return reply.status(404).send(failure('UNKNOWN_REPORT', `Report code ${reportCode} is not supported`));
    }
  });
}
