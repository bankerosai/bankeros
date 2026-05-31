import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure } from '@bankeros/shared-utils';
import Decimal from 'decimal.js';

const EventSchema = z.object({
  customerId: z.string().optional(),
  sessionId: z.string(),
  eventType: z.string(),
  properties: z.record(z.unknown()),
  timestamp: z.string().optional(),
  channel: z.enum(['MOBILE', 'WEB', 'ATM', 'BRANCH', 'API']),
});

export async function cdpRoutes(app: FastifyInstance) {
  // GET /v1/insights/customers/:customerId/profile  — 360° view (Module 15)
  app.get('/customers/:customerId/profile', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER', 'CUSTOMER_SERVICE', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { customerId } = request.params as { customerId: string };

    const [customer, accounts, loans, portfolios, complianceCases, recentPayments] = await Promise.all([
      prisma.customer.findUnique({ where: { id: customerId } }),
      prisma.account.findMany({ where: { customerId } }),
      prisma.loan.findMany({ where: { customerId }, include: { product: { select: { name: true } } } }),
      prisma.portfolio.findMany({ where: { customerId }, include: { holdings: true } }),
      prisma.complianceCase.count({ where: { customerId, status: { notIn: ['CLOSED_NO_ACTION'] } } }),
      prisma.payment.findMany({
        where: { debtorAccount: { customerId } },
        take: 10, orderBy: { instructedAt: 'desc' },
      }),
    ]);

    if (!customer) return reply.status(404).send(failure('NOT_FOUND', 'Customer not found'));

    // Financial health metrics
    const totalDeposits = accounts.filter((a) => ['CURRENT', 'SAVINGS'].includes(a.type))
      .reduce((s, a) => s.plus(a.balance.toString()), new Decimal(0));
    const totalLoanExposure = loans.filter((l) => ['ACTIVE', 'OVERDUE'].includes(l.status))
      .reduce((s, l) => s.plus(l.outstandingBalance.toString()), new Decimal(0));
    const totalAum = portfolios.reduce((s, p) => s.plus(p.totalValue.toString()), new Decimal(0));

    // ML-simulated scores (production: replace with model service calls)
    const churnRiskScore = computeChurnRisk(customer, accounts, recentPayments);
    const creditScore = computeCreditScore(customer, loans, accounts);
    const crossSellScore = computeCrossSellPropensity(customer, accounts, loans, portfolios);

    return reply.send(success({
      customerId,
      cifNumber: customer.cifNumber,
      fullName: customer.fullName,
      kycStatus: customer.kycStatus,
      riskLevel: customer.riskLevel,
      pepFlag: customer.pepFlag,

      financial: {
        totalDeposits: totalDeposits.toFixed(2),
        totalLoanExposure: totalLoanExposure.toFixed(2),
        totalAum: totalAum.toFixed(2),
        netWorth: totalDeposits.plus(totalAum).minus(totalLoanExposure).toFixed(2),
        accountCount: accounts.length,
        activeLoans: loans.filter((l) => l.status === 'ACTIVE').length,
        overdueLoans: loans.filter((l) => l.status === 'OVERDUE').length,
      },

      intelligence: {
        churnRiskScore: churnRiskScore.toFixed(4),
        churnRiskLabel: churnRiskScore > 0.7 ? 'HIGH' : churnRiskScore > 0.4 ? 'MEDIUM' : 'LOW',
        creditScore,
        crossSellPropensity: {
          score: crossSellScore.score.toFixed(4),
          topOpportunities: crossSellScore.opportunities,
        },
      },

      compliance: {
        openCases: complianceCases,
        lastScreenedAt: customer.updatedAt,
      },

      recentActivity: recentPayments.map((p) => ({
        type: 'PAYMENT',
        amount: p.amount.toString(),
        currency: p.currency,
        status: p.status,
        date: p.instructedAt,
      })),
    }));
  });

  // POST /v1/analytics/events/stream  — Behavioral event ingestion (Module 15)
  app.post('/events/stream', async (request, reply) => {
    const body = EventSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid event data'));

    // In production: publish to Kafka for real-time feature extraction pipeline
    // For now: log and acknowledge
    request.log.info({ event: body.data }, 'Behavioral event received');

    return reply.status(202).send(success({
      accepted: true,
      eventId: require('uuid').v4(),
      message: 'Event accepted for processing',
    }));
  });

  // GET /v1/insights/segments  — Customer segment analytics
  app.get('/segments', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const [
      byRisk, byKyc, totalCustomers,
      highValueCustomers,
    ] = await Promise.all([
      prisma.customer.groupBy({ by: ['riskLevel'], _count: true }),
      prisma.customer.groupBy({ by: ['kycStatus'], _count: true }),
      prisma.customer.count(),
      prisma.account.groupBy({
        by: ['customerId'],
        _sum: { balance: true },
        having: { balance: { _sum: { gt: 100000 } } },
      }),
    ]);

    return reply.send(success({
      totalCustomers,
      highValueCustomers: highValueCustomers.length,
      byRiskLevel: byRisk.map((r) => ({ riskLevel: r.riskLevel, count: r._count })),
      byKycStatus: byKyc.map((k) => ({ kycStatus: k.kycStatus, count: k._count })),
    }));
  });
}

// Simplified ML scoring stubs — production: call Python ML microservice
function computeChurnRisk(customer: any, accounts: any[], payments: any[]): Decimal {
  let score = new Decimal(0);
  const daysSinceOpen = (Date.now() - new Date(customer.createdAt).getTime()) / 86400000;
  if (daysSinceOpen < 30) score = score.plus(0.3);
  if (accounts.every((a) => new Decimal(a.balance.toString()).lt(100))) score = score.plus(0.4);
  if (payments.length === 0) score = score.plus(0.2);
  return Decimal.min(score, 1);
}

function computeCreditScore(customer: any, loans: any[], accounts: any[]): number {
  let score = 700;
  if (customer.kycStatus === 'APPROVED') score += 30;
  if (loans.some((l) => l.status === 'OVERDUE')) score -= 100;
  if (loans.some((l) => l.status === 'SETTLED')) score += 50;
  if (accounts.some((a) => new Decimal(a.balance.toString()).gt(10000))) score += 40;
  return Math.max(300, Math.min(850, score));
}

function computeCrossSellPropensity(customer: any, accounts: any[], loans: any[], portfolios: any[]) {
  const opportunities: string[] = [];
  if (loans.length === 0) opportunities.push('PERSONAL_LOAN');
  if (portfolios.length === 0) opportunities.push('INVESTMENT_PORTFOLIO');
  if (!accounts.some((a) => a.type === 'SAVINGS')) opportunities.push('SAVINGS_ACCOUNT');
  return { score: new Decimal(opportunities.length * 0.25), opportunities };
}
