import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import Decimal from 'decimal.js';

const CreatePortfolioSchema = z.object({
  customerId: z.string().uuid(),
  name: z.string().min(2),
  currency: z.string().length(3),
  riskProfile: z.enum(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE']),
});

const AddHoldingSchema = z.object({
  assetClass: z.enum(['EQUITY', 'FIXED_INCOME', 'MONEY_MARKET', 'ALTERNATIVE', 'REAL_ESTATE', 'COMMODITY']),
  symbol: z.string().min(1),
  name: z.string(),
  quantity: z.string(),
  avgCostPrice: z.string(),
  currentPrice: z.string(),
  currency: z.string().length(3),
});

const ProposalSchema = z.object({
  customerId: z.string().uuid(),
  riskProfile: z.enum(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE']),
  investmentAmount: z.string(),
  currency: z.string().length(3),
});

const ALLOCATION_MODELS: Record<string, Record<string, number>> = {
  CONSERVATIVE: { FIXED_INCOME: 0.60, MONEY_MARKET: 0.25, EQUITY: 0.10, ALTERNATIVE: 0.05 },
  MODERATE:     { EQUITY: 0.50, FIXED_INCOME: 0.30, MONEY_MARKET: 0.10, ALTERNATIVE: 0.10 },
  AGGRESSIVE:   { EQUITY: 0.75, ALTERNATIVE: 0.15, FIXED_INCOME: 0.08, MONEY_MARKET: 0.02 },
};

export async function wealthRoutes(app: FastifyInstance) {
  // POST /v1/wealth/portfolios  — Create portfolio (Module 6)
  app.post('/portfolios', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = CreatePortfolioSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid portfolio data'));

    const portfolio = await prisma.portfolio.create({ data: body.data });
    return reply.status(201).send(success(portfolio));
  });

  // GET /v1/wealth/portfolios/:portfolioId/holdings  — Portfolio holdings (Module 6)
  app.get('/portfolios/:portfolioId/holdings', { preHandler: [requireAuth] }, async (request, reply) => {
    const { portfolioId } = request.params as { portfolioId: string };
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { holdings: true },
    });
    if (!portfolio) return reply.status(404).send(failure('NOT_FOUND', 'Portfolio not found'));

    const holdings = portfolio.holdings.map((h) => {
      const mktValue = new Decimal(h.quantity.toString()).times(h.currentPrice.toString());
      const costBasis = new Decimal(h.quantity.toString()).times(h.avgCostPrice.toString());
      const pnl = mktValue.minus(costBasis);
      const pnlPct = costBasis.isZero() ? new Decimal(0) : pnl.dividedBy(costBasis).times(100);

      return {
        ...h,
        quantity: h.quantity.toString(),
        avgCostPrice: h.avgCostPrice.toString(),
        currentPrice: h.currentPrice.toString(),
        marketValue: mktValue.toFixed(2),
        costBasis: costBasis.toFixed(2),
        unrealizedPnl: pnl.toFixed(2),
        unrealizedPnlPct: pnlPct.toFixed(2),
      };
    });

    const totalValue = holdings.reduce((s, h) => s.plus(h.marketValue), new Decimal(0));
    const totalPnl = holdings.reduce((s, h) => s.plus(h.unrealizedPnl), new Decimal(0));

    return reply.send(success({
      portfolioId,
      name: portfolio.name,
      currency: portfolio.currency,
      riskProfile: portfolio.riskProfile,
      totalMarketValue: totalValue.toFixed(2),
      totalUnrealizedPnl: totalPnl.toFixed(2),
      holdings,
    }));
  });

  // POST /v1/wealth/portfolios/:portfolioId/holdings  — Add holding
  app.post('/portfolios/:portfolioId/holdings', { preHandler: [requireAuth] }, async (request, reply) => {
    const { portfolioId } = request.params as { portfolioId: string };
    const body = AddHoldingSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid holding data'));

    const holding = await prisma.portfolioHolding.create({
      data: { portfolioId, ...body.data },
    });

    return reply.status(201).send(success(holding));
  });

  // POST /v1/wealth/advisory/proposals  — Robo-advisor proposal (Module 6)
  app.post('/advisory/proposals', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = ProposalSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid proposal request'));

    const { riskProfile, investmentAmount, currency } = body.data;
    const totalAmount = new Decimal(investmentAmount);
    const allocation = ALLOCATION_MODELS[riskProfile];

    const recommendations = Object.entries(allocation).map(([assetClass, weight]) => ({
      assetClass,
      weight: (weight * 100).toFixed(1) + '%',
      allocatedAmount: totalAmount.times(weight).toFixed(2),
      currency,
      rationalNote: getRationale(assetClass, riskProfile),
    }));

    return reply.send(success({
      riskProfile,
      investmentAmount,
      currency,
      generatedAt: new Date().toISOString(),
      recommendations,
      disclaimer: 'This is a model portfolio allocation. Past performance does not guarantee future results. Please consult your financial advisor before investing.',
    }));
  });

  // POST /v1/wealth/orders/execute  — Order execution (Module 6)
  app.post('/orders/execute', { preHandler: [requireAuth] }, async (request, reply) => {
    const { portfolioId, symbol, action, quantity, currency } = request.body as {
      portfolioId: string; symbol: string; action: 'BUY' | 'SELL'; quantity: string; currency: string;
    };

    // Integration point for external broker/fund clearinghouse
    const orderId = `ORD${Date.now()}`;
    return reply.status(201).send(success({
      orderId,
      portfolioId,
      symbol,
      action,
      quantity,
      currency,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      message: 'Order submitted to clearing house. Settlement T+2.',
    }));
  });

  // GET /v1/wealth/portfolios — List customer portfolios
  app.get('/portfolios', { preHandler: [requireAuth] }, async (request, reply) => {
    const { page = 1, pageSize = 20, customerId } = request.query as { page?: number; pageSize?: number; customerId?: string };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (customerId) where.customerId = customerId;

    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({ where, skip, take: pageSize, include: { _count: { select: { holdings: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.portfolio.count({ where }),
    ]);
    return reply.send(paginate(portfolios, total, page, pageSize));
  });
}

function getRationale(assetClass: string, riskProfile: string): string {
  const map: Record<string, Record<string, string>> = {
    EQUITY: { CONSERVATIVE: 'Limited equity for inflation hedging', MODERATE: 'Growth-oriented allocation', AGGRESSIVE: 'High-conviction equity concentration' },
    FIXED_INCOME: { CONSERVATIVE: 'Capital preservation priority', MODERATE: 'Stability ballast', AGGRESSIVE: 'Minimal duration exposure' },
    MONEY_MARKET: { CONSERVATIVE: 'Liquidity reserve', MODERATE: 'Operational buffer', AGGRESSIVE: 'Tactical cash' },
    ALTERNATIVE: { CONSERVATIVE: 'Diversification overlay', MODERATE: 'Alpha generation', AGGRESSIVE: 'High-return alternative strategies' },
  };
  return map[assetClass]?.[riskProfile] ?? 'Asset class allocation per model portfolio';
}
