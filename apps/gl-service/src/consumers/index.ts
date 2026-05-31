/**
 * GL Service Kafka consumers — automatically posts journal entries
 * when business events occur in other services (payments, lending, etc.)
 */

import { EventBus } from '@bankeros/shared-utils/src/event-bus';
import { TOPICS } from '@bankeros/shared-utils/src/kafka';
import { LedgerService } from '../services/ledger.service';
import { TransactionType } from '@bankeros/shared-types';

const ledger = new LedgerService();

export async function startGlConsumers(): Promise<void> {
  const bus = new EventBus('gl-service');

  // PAYMENT_COMPLETED → Auto-post DR Customer Deposit / CR Customer Deposit
  bus.on<{ paymentId: string; amount: string; currency: string; fromAccountCode: string; toAccountCode: string }>(
    'PAYMENT_COMPLETED',
    async (event) => {
      const { paymentId, amount, currency, fromAccountCode, toAccountCode } = event.payload;

      await ledger.postJournal({
        referenceId: paymentId,
        referenceType: 'PAYMENT',
        description: `Auto-journal: payment ${paymentId}`,
        businessDate: new Date(event.occurredAt),
        lines: [
          { accountCode: fromAccountCode ?? '2000', type: TransactionType.DEBIT,  amount, currency: currency as any },
          { accountCode: toAccountCode   ?? '2000', type: TransactionType.CREDIT, amount, currency: currency as any },
        ],
      });
      console.log(`[GL Consumer] Posted journal for payment ${paymentId}`);
    },
  );

  // LOAN_DISBURSED → DR Loans Receivable / CR Cash
  bus.on<{ loanId: string; amount: string; currency: string }>(
    'LOAN_DISBURSED',
    async (event) => {
      const { loanId, amount, currency } = event.payload;
      await ledger.postJournal({
        referenceId: loanId,
        referenceType: 'LOAN_DISBURSEMENT',
        description: `Auto-journal: loan disbursement ${loanId}`,
        businessDate: new Date(event.occurredAt),
        lines: [
          { accountCode: '1100', type: TransactionType.DEBIT,  amount, currency: currency as any },
          { accountCode: '1000', type: TransactionType.CREDIT, amount, currency: currency as any },
        ],
      });
      console.log(`[GL Consumer] Posted journal for loan ${loanId}`);
    },
  );

  // EOD_INTEREST_ACCRUAL → DR Interest Receivable / CR Interest Income
  bus.on<{ accountId: string; interestAmount: string; currency: string }>(
    'INTEREST_ACCRUED',
    async (event) => {
      const { accountId, interestAmount, currency } = event.payload;
      await ledger.postJournal({
        referenceId: accountId,
        referenceType: 'INTEREST_ACCRUAL',
        description: `EOD interest accrual for account ${accountId}`,
        businessDate: new Date(event.occurredAt),
        lines: [
          { accountCode: '1400', type: TransactionType.DEBIT,  amount: interestAmount, currency: currency as any },
          { accountCode: '4000', type: TransactionType.CREDIT, amount: interestAmount, currency: currency as any },
        ],
      });
    },
  );

  await bus.start([TOPICS.PAYMENT_EVENTS, TOPICS.LOAN_EVENTS, TOPICS.BATCH_EVENTS]);
}
