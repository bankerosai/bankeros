/**
 * Compliance Service consumers — auto-screens new customers and
 * large payments. Creates compliance cases on flags.
 */

import { EventBus } from '@bankeros/shared-utils/src/event-bus';
import { TOPICS } from '@bankeros/shared-utils/src/kafka';
import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';

export async function startComplianceConsumers(): Promise<void> {
  const bus = new EventBus('compliance-service');

  // New customer → automatic sanctions screening
  bus.on<{ cifId: string; cifNumber: string; country?: string; fullName?: string }>(
    'CUSTOMER_CREATED',
    async (event) => {
      const { cifId, cifNumber, country, fullName } = event.payload;

      const HIGH_RISK = ['IR', 'KP', 'SY', 'CU', 'AF', 'MM'];
      const isHighRisk = country && HIGH_RISK.includes(country);

      // Screen against sanctions lists (stub — real impl would call screening API)
      await prisma.sanctionsScreeningResult.create({
        data: {
          entityType: 'CUSTOMER',
          entityId: cifId,
          name: fullName ?? cifNumber,
          matchScore: isHighRisk ? '0.62' : '0.02',
          listName: 'OFAC_AUTO_SCREEN',
          isPep: false,
          isMatch: false,
        },
      });

      if (isHighRisk) {
        await prisma.complianceCase.create({
          data: {
            caseNumber: `EDD-AUTO-${Date.now()}`,
            customerId: cifId,
            type: 'EDD',
            status: 'OPEN',
            description: `Auto-triggered EDD: customer from high-risk jurisdiction (${country})`,
            riskScore: '0.62',
          },
        });
        console.log(`[Compliance Consumer] Created EDD case for ${cifNumber}`);
      }
    },
  );

  // Large payments → automatic fraud re-evaluation
  bus.on<{ paymentId: string; amount: { amount: string; currency: string }; debtorAccountId?: string }>(
    'PAYMENT_INITIATED',
    async (event) => {
      const { paymentId, amount } = event.payload;
      const amt = new Decimal(amount.amount);

      if (amt.gte(50000)) {
        // High-value alert (real impl would call ML model)
        console.log(`[Compliance Consumer] High-value payment ${paymentId}: ${amount.currency} ${amount.amount}`);
      }
    },
  );

  // Fraud alert → escalate
  bus.on<{ paymentId: string; score: number; blocked: boolean }>(
    'FRAUD_ALERT',
    async (event) => {
      const { paymentId, score, blocked } = event.payload;

      const existing = await prisma.complianceCase.findFirst({
        where: { paymentId, type: 'SAR' },
      });
      if (existing) return;

      await prisma.complianceCase.create({
        data: {
          caseNumber: `SAR-AUTO-${Date.now()}`,
          paymentId,
          type: 'SAR',
          status: blocked ? 'OPEN' : 'UNDER_REVIEW',
          riskScore: score.toString(),
          description: `Auto-escalation: fraud score ${score}${blocked ? ' (BLOCKED)' : ''}`,
        },
      });
      console.log(`[Compliance Consumer] Created SAR case for payment ${paymentId}`);
    },
  );

  await bus.start([TOPICS.CUSTOMER_EVENTS, TOPICS.PAYMENT_EVENTS]);
}
