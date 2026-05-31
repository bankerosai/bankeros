import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';
import { generatePaymentReference, createEvent } from '@bankeros/shared-utils';
import { publishEvent, TOPICS } from '@bankeros/shared-utils/src/kafka';
import { PaymentNetwork, PaymentStatus, TransactionType } from '@bankeros/shared-types';

export interface InitiatePaymentInput {
  debtorAccountId: string;
  creditorAccountNumber: string;
  creditorName: string;
  creditorBankBic?: string;
  amount: string;
  currency: string;
  purposeCode?: string;
  remittanceInfo?: string;
  correlationId?: string;
}

export class PaymentService {
  private selectNetwork(amount: string, currency: string, creditorBankBic?: string): PaymentNetwork {
    if (!creditorBankBic) return PaymentNetwork.INTERNAL;
    const amtDecimal = new Decimal(amount);
    // RTGS for large-value GBP payments
    if (currency === 'GBP' && amtDecimal.gte(250000)) return PaymentNetwork.RTGS;
    // SWIFT for cross-border
    if (creditorBankBic && creditorBankBic.length >= 8) return PaymentNetwork.SWIFT;
    // Default to ACH for domestic
    return PaymentNetwork.ACH;
  }

  async evaluateFraudScore(payment: {
    amount: string;
    currency: string;
    debtorAccountId: string;
    creditorBankBic?: string;
  }): Promise<number> {
    // Stub ML scoring engine — replace with actual model endpoint
    let score = 0.0;
    const amount = new Decimal(payment.amount);

    if (amount.gt(50000)) score += 0.3;
    if (amount.gt(100000)) score += 0.2;
    if (payment.creditorBankBic) score += 0.1;  // Cross-border uplift

    // Velocity check: count payments in last hour
    const recentPayments = await prisma.payment.count({
      where: {
        debtorAccountId: payment.debtorAccountId,
        instructedAt: { gte: new Date(Date.now() - 3600 * 1000) },
        status: { notIn: ['FAILED', 'CANCELLED'] },
      },
    });
    if (recentPayments > 5) score += 0.25;
    if (recentPayments > 10) score += 0.25;

    return Math.min(score, 1.0);
  }

  async initiatePayment(input: InitiatePaymentInput, requestorId?: string) {
    const account = await prisma.account.findUnique({ where: { id: input.debtorAccountId } });
    if (!account) throw new Error('Debtor account not found');
    if (account.status !== 'ACTIVE') throw new Error('Debtor account is not active');
    if (account.currency !== input.currency) throw new Error(`Account currency ${account.currency} does not match payment currency ${input.currency}`);

    const amount = new Decimal(input.amount);
    if (new Decimal(account.availableBalance.toString()).lt(amount)) {
      throw new Error('Insufficient available balance');
    }

    const fraudScore = await this.evaluateFraudScore({
      amount: input.amount,
      currency: input.currency,
      debtorAccountId: input.debtorAccountId,
      creditorBankBic: input.creditorBankBic,
    });

    if (fraudScore > 0.9) {
      const payment = await prisma.payment.create({
        data: {
          paymentReference: generatePaymentReference(),
          debtorAccountId: input.debtorAccountId,
          debtorName: '',
          creditorAccountNumber: input.creditorAccountNumber,
          creditorName: input.creditorName,
          creditorBankBic: input.creditorBankBic,
          amount: input.amount,
          currency: input.currency,
          network: 'INTERNAL',
          status: 'FAILED',
          fraudScore: fraudScore.toFixed(4),
          failureReason: 'BLOCKED_FRAUD_PREVENTION',
          correlationId: input.correlationId,
        },
      });

      await publishEvent(TOPICS.COMPLIANCE_EVENTS, createEvent(
        'FRAUD_ALERT', payment.id, 'Payment',
        { paymentId: payment.id, score: fraudScore, blocked: true },
        { serviceId: 'payments-service', correlationId: input.correlationId },
      ));

      throw new Error('Payment blocked by fraud prevention system');
    }

    const network = this.selectNetwork(input.amount, input.currency, input.creditorBankBic);

    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { id: account.customerId } });

      const payment = await tx.payment.create({
        data: {
          paymentReference: generatePaymentReference(),
          debtorAccountId: input.debtorAccountId,
          debtorName: customer?.fullName ?? '',
          creditorAccountNumber: input.creditorAccountNumber,
          creditorName: input.creditorName,
          creditorBankBic: input.creditorBankBic,
          amount: input.amount,
          currency: input.currency,
          network,
          status: network === PaymentNetwork.INTERNAL ? 'PROCESSING' : 'PENDING',
          fraudScore: fraudScore.toFixed(4),
          purposeCode: input.purposeCode,
          remittanceInfo: input.remittanceInfo,
          correlationId: input.correlationId,
        },
      });

      // Hold the funds immediately
      await tx.account.update({
        where: { id: input.debtorAccountId },
        data: {
          availableBalance: { decrement: input.amount },
          holdAmount: { increment: input.amount },
        },
      });

      return payment;
    });
  }

  async settleInternalPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status !== 'PROCESSING') throw new Error('Payment not found or not in PROCESSING state');

    if (payment.network !== PaymentNetwork.INTERNAL) throw new Error('Only internal payments can be settled directly');

    const creditorAccount = await prisma.account.findFirst({
      where: { accountNumber: payment.creditorAccountNumber },
    });

    await prisma.$transaction(async (tx) => {
      // Debit debtor
      await tx.account.update({
        where: { id: payment.debtorAccountId },
        data: {
          balance: { decrement: payment.amount },
          holdAmount: { decrement: payment.amount },
        },
      });

      await tx.accountTransaction.create({
        data: {
          accountId: payment.debtorAccountId,
          type: TransactionType.DEBIT,
          amount: payment.amount,
          currency: payment.currency,
          balanceBefore: 0,
          balanceAfter: 0,
          description: `Payment to ${payment.creditorName}: ${payment.remittanceInfo ?? payment.paymentReference}`,
          referenceId: payment.id,
          referenceType: 'PAYMENT',
          valueDate: new Date(),
        },
      });

      // Credit creditor (if account exists internally)
      if (creditorAccount) {
        await tx.account.update({
          where: { id: creditorAccount.id },
          data: {
            balance: { increment: payment.amount },
            availableBalance: { increment: payment.amount },
          },
        });

        await tx.accountTransaction.create({
          data: {
            accountId: creditorAccount.id,
            type: TransactionType.CREDIT,
            amount: payment.amount,
            currency: payment.currency,
            balanceBefore: 0,
            balanceAfter: 0,
            description: `Payment from ${payment.debtorName}: ${payment.remittanceInfo ?? payment.paymentReference}`,
            referenceId: payment.id,
            referenceType: 'PAYMENT',
            valueDate: new Date(),
          },
        });
      }

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    });

    await publishEvent(TOPICS.PAYMENT_EVENTS, createEvent(
      'PAYMENT_COMPLETED', paymentId, 'Payment',
      { paymentId },
      { serviceId: 'payments-service' },
    ));

    return prisma.payment.findUnique({ where: { id: paymentId } });
  }
}
