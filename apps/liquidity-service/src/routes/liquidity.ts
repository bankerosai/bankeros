import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import { CashPoolService } from '../services/cash-pool.service';

const poolSvc = new CashPoolService();

const CreatePoolSchema = z.object({
  name: z.string().min(2),
  masterAccountId: z.string().uuid(),
  currency: z.string().length(3),
  isNotional: z.boolean().default(false),
  members: z.array(z.object({
    accountId: z.string().uuid(),
    targetBalance: z.string().optional(),
    minBalance: z.string().default('0'),
  })).min(1),
});

export async function liquidityRoutes(app: FastifyInstance) {
  // POST /v1/liquidity/cash-pools/structures  — Build pool (Module 7)
  app.post('/cash-pools/structures', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const body = CreatePoolSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid pool configuration', body.error.flatten()));

    const { name, masterAccountId, currency, isNotional, members } = body.data;

    const master = await prisma.account.findUnique({ where: { id: masterAccountId } });
    if (!master) return reply.status(404).send(failure('NOT_FOUND', 'Master account not found'));

    const pool = await prisma.cashPool.create({
      data: {
        name, masterAccountId, currency, isNotional,
        members: {
          create: [
            { accountId: masterAccountId, minBalance: '0', isActive: true },
            ...members.map((m) => ({ accountId: m.accountId, targetBalance: m.targetBalance, minBalance: m.minBalance, isActive: true })),
          ],
        },
      },
      include: { members: true },
    });

    return reply.status(201).send(success(pool));
  });

  // GET /v1/liquidity/cash-pools/:poolId
  app.get('/cash-pools/:poolId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { poolId } = request.params as { poolId: string };
    const pool = await prisma.cashPool.findUnique({ where: { id: poolId }, include: { members: true } });
    if (!pool) return reply.status(404).send(failure('NOT_FOUND', 'Cash pool not found'));
    return reply.send(success(pool));
  });

  // POST /v1/liquidity/cash-pools/:poolId/sweep  — Trigger sweep (Module 7)
  app.post('/cash-pools/:poolId/sweep', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { poolId } = request.params as { poolId: string };
    try {
      const results = await poolSvc.executeSweep(poolId);
      return reply.send(success({ poolId, swept: results.length, results }));
    } catch (err: any) {
      return reply.status(400).send(failure('SWEEP_ERROR', err.message));
    }
  });

  // GET /v1/liquidity/accounts/:accountId/sweeps  — Sweep history (Module 7)
  app.get('/accounts/:accountId/sweeps', { preHandler: [requireAuth] }, async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const { page = 1, pageSize = 20 } = request.query as { page?: number; pageSize?: number };
    const skip = (page - 1) * pageSize;

    const [sweeps, total] = await Promise.all([
      prisma.accountTransaction.findMany({
        where: { accountId, referenceType: 'CASH_POOL_SWEEP' },
        skip, take: pageSize, orderBy: { bookingDate: 'desc' },
      }),
      prisma.accountTransaction.count({ where: { accountId, referenceType: 'CASH_POOL_SWEEP' } }),
    ]);

    return reply.send(paginate(sweeps, total, page, pageSize));
  });

  // GET /v1/liquidity/positions/forecast  — Cash forecast (Module 7)
  app.get('/positions/forecast', { preHandler: [requireAuth] }, async (request, reply) => {
    const { accountId, days = 30 } = request.query as { accountId: string; days?: number };
    if (!accountId) return reply.status(400).send(failure('MISSING_PARAM', 'accountId is required'));

    try {
      const forecast = await poolSvc.forecastCashPosition(accountId, Number(days));
      return reply.send(success(forecast));
    } catch (err: any) {
      return reply.status(404).send(failure('NOT_FOUND', err.message));
    }
  });

  // GET /v1/liquidity/cash-pools/:poolId/notional-interest  — Notional pooling (Module 7)
  app.get('/cash-pools/:poolId/notional-interest', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { poolId } = request.params as { poolId: string };
    const { rate = '0.03', date } = request.query as { rate?: string; date?: string };
    try {
      const result = await poolSvc.calculateNotionalPoolInterest(poolId, rate, date ? new Date(date) : new Date());
      return reply.send(success(result));
    } catch (err: any) {
      return reply.status(400).send(failure('POOL_ERROR', err.message));
    }
  });

  // GET /v1/liquidity/fx-rates  — Current FX rates (Module 7 + Module 8)
  app.get('/fx-rates', { preHandler: [requireAuth] }, async (request, reply) => {
    const { base = 'USD', date } = request.query as { base?: string; date?: string };
    const rateDate = date ? new Date(date) : new Date();

    const rates = await prisma.fxRate.findMany({
      where: {
        baseCurrency: base,
        rateDate: { gte: new Date(rateDate.getTime() - 86400 * 1000), lte: rateDate },
      },
      orderBy: { rateDate: 'desc' },
    });

    return reply.send(success({ baseCurrency: base, asOf: rateDate.toISOString(), rates }));
  });

  // POST /v1/liquidity/fx-rates  — Ingest FX rate (from ECB feed)
  app.post('/fx-rates', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { baseCurrency, quoteCurrency, rate, source = 'ECB', rateDate } = request.body as {
      baseCurrency: string; quoteCurrency: string; rate: string; source?: string; rateDate?: string;
    };

    const fxRate = await prisma.fxRate.upsert({
      where: { baseCurrency_quoteCurrency_rateDate: { baseCurrency, quoteCurrency, rateDate: rateDate ? new Date(rateDate) : new Date() } },
      create: { baseCurrency, quoteCurrency, rate, source, rateDate: rateDate ? new Date(rateDate) : new Date() },
      update: { rate, source },
    });

    return reply.status(201).send(success(fxRate));
  });
}
