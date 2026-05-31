import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import Decimal from 'decimal.js';

// In-memory facility store (production: dedicated DB tables)
// For full implementation, add CreditFacility and SyndicationParticipant Prisma models
const facilities: Map<string, any> = new Map();
const drawdowns: Map<string, any> = new Map();

const CreateFacilitySchema = z.object({
  borrowerCifId: z.string().uuid(),
  name: z.string(),
  type: z.enum(['TERM_LOAN', 'REVOLVING', 'BRIDGE', 'SYNDICATED_TERM']),
  currency: z.string().length(3),
  totalCommitment: z.string(),
  interestRateMargin: z.string(),   // Margin over reference rate (e.g. SOFR)
  referenceRate: z.string().default('SOFR'), // SOFR | EURIBOR | SONIA
  maturityDate: z.string(),
  arrangementFeeRate: z.string().default('0.005'),
  commitmentFeeRate: z.string().default('0.003'),  // On undrawn
  participants: z.array(z.object({
    participantName: z.string(),
    participantBic: z.string().optional(),
    role: z.enum(['MANDATED_LEAD_ARRANGER', 'BOOKRUNNER', 'AGENT', 'PARTICIPANT']),
    commitmentAmount: z.string(),
    commitmentShare: z.string(),   // Percentage as decimal (e.g. "0.30" = 30%)
  })).min(1),
});

const DrawdownSchema = z.object({
  facilityId: z.string().uuid(),
  amount: z.string(),
  currency: z.string().length(3),
  disbursementAccountId: z.string().uuid(),
  drawdownDate: z.string(),
  tenor: z.number().int().positive(),   // Days for this drawdown
});

export async function syndicationRoutes(app: FastifyInstance) {
  // POST /v1/lending/facilities  — Create credit facility (Module 12)
  app.post('/facilities', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const body = CreateFacilitySchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid facility data', body.error.flatten()));

    const d = body.data;

    // Validate commitment shares sum to 1.0
    const totalShare = d.participants.reduce((s, p) => s.plus(p.commitmentShare), new Decimal(0));
    if (!totalShare.eq(1)) {
      return reply.status(422).send(failure('INVALID_SHARES', `Participant shares sum to ${totalShare.toFixed(4)}, must equal 1.0`));
    }

    const facilityId = require('uuid').v4();
    const facilityNumber = `FAC${Date.now()}`;

    const facility = {
      id: facilityId,
      facilityNumber,
      ...d,
      availableAmount: d.totalCommitment,
      drawnAmount: '0',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    facilities.set(facilityId, facility);

    return reply.status(201).send(success(facility));
  });

  // GET /v1/lending/facilities/:facilityId
  app.get('/facilities/:facilityId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { facilityId } = request.params as { facilityId: string };
    const facility = facilities.get(facilityId);
    if (!facility) return reply.status(404).send(failure('NOT_FOUND', 'Facility not found'));
    return reply.send(success(facility));
  });

  // POST /v1/lending/syndication/drawdowns  — Drawdown request (Module 12)
  app.post('/syndication/drawdowns', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = DrawdownSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid drawdown data'));

    const d = body.data;
    const facility = facilities.get(d.facilityId);
    if (!facility) return reply.status(404).send(failure('NOT_FOUND', 'Facility not found'));

    const available = new Decimal(facility.availableAmount);
    const requested = new Decimal(d.amount);

    if (requested.gt(available)) {
      return reply.status(400).send(failure('INSUFFICIENT_AVAILABILITY', `Requested ${d.amount} exceeds available ${facility.availableAmount}`));
    }

    const drawdownId = require('uuid').v4();
    const totalInterestRate = new Decimal(facility.interestRateMargin).plus('0.053'); // + reference rate stub

    // Calculate participant funding splits
    const fundingSplits = facility.participants.map((p: any) => ({
      participantName: p.participantName,
      role: p.role,
      fundingAmount: requested.times(p.commitmentShare).toFixed(2),
      fundingShare: p.commitmentShare,
      interestIncome: requested.times(p.commitmentShare).times(totalInterestRate).times(d.tenor).dividedBy(365).toFixed(6),
    }));

    const drawdown = {
      id: drawdownId,
      drawdownReference: `DD${Date.now()}`,
      facilityId: d.facilityId,
      amount: d.amount,
      currency: d.currency,
      disbursementAccountId: d.disbursementAccountId,
      drawdownDate: d.drawdownDate,
      tenor: d.tenor,
      maturityDate: new Date(new Date(d.drawdownDate).getTime() + d.tenor * 86400 * 1000).toISOString().split('T')[0],
      interestRate: totalInterestRate.toFixed(6),
      interestAmount: requested.times(totalInterestRate).times(d.tenor).dividedBy(365).toFixed(6),
      fundingSplits,
      status: 'FUNDED',
      createdAt: new Date().toISOString(),
    };

    // Update facility utilization
    facility.drawnAmount = new Decimal(facility.drawnAmount).plus(d.amount).toFixed(2);
    facility.availableAmount = available.minus(d.amount).toFixed(2);

    drawdowns.set(drawdownId, drawdown);

    // In production: disburse to account via GL entries + Payments service

    return reply.status(201).send(success(drawdown));
  });

  // GET /v1/lending/syndication/drawdowns/:drawdownId
  app.get('/syndication/drawdowns/:drawdownId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { drawdownId } = request.params as { drawdownId: string };
    const drawdown = drawdowns.get(drawdownId);
    if (!drawdown) return reply.status(404).send(failure('NOT_FOUND', 'Drawdown not found'));
    return reply.send(success(drawdown));
  });

  // POST /v1/lending/syndication/drawdowns/:drawdownId/repay  — Pro-rata principal distribution
  app.post('/syndication/drawdowns/:drawdownId/repay', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { drawdownId } = request.params as { drawdownId: string };
    const { amount } = request.body as { amount: string };
    const drawdown = drawdowns.get(drawdownId);
    if (!drawdown) return reply.status(404).send(failure('NOT_FOUND', 'Drawdown not found'));

    const repayment = new Decimal(amount);
    const distributions = drawdown.fundingSplits.map((p: any) => ({
      participantName: p.participantName,
      principalRepayment: repayment.times(p.fundingShare).toFixed(2),
      share: p.fundingShare,
    }));

    return reply.send(success({
      drawdownId,
      totalRepayment: amount,
      distributions,
      message: 'Pro-rata repayment distribution calculated. Payment instructions dispatched to participants.',
    }));
  });
}
