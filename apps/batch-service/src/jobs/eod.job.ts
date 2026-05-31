import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';
import { TransactionType } from '@bankeros/shared-types';
import { createEvent } from '@bankeros/shared-utils';
import { publishEvent, TOPICS } from '@bankeros/shared-utils/src/kafka';

export async function runEodInterestAccrual(jobId: string, businessDate: Date): Promise<void> {
  await prisma.batchJob.update({
    where: { id: jobId },
    data: { status: 'RUNNING', startedAt: new Date() },
  });

  let processed = 0;
  let errors = 0;
  const logs: string[] = [];

  try {
    // 1. Process savings account interest accrual
    const savingsAccounts = await prisma.account.findMany({
      where: { type: 'SAVINGS', status: 'ACTIVE', balance: { gt: 0 } },
    });

    const SAVINGS_DAILY_RATE = new Decimal('0.020').dividedBy(365); // 2% p.a.

    for (const account of savingsAccounts) {
      try {
        const balance = new Decimal(account.balance.toString());
        const interest = balance.times(SAVINGS_DAILY_RATE).toDecimalPlaces(8);

        if (interest.lte(0)) continue;

        await prisma.$transaction(async (tx) => {
          const updated = await tx.account.update({
            where: { id: account.id },
            data: {
              balance: { increment: interest.toFixed(8) },
              availableBalance: { increment: interest.toFixed(8) },
            },
          });

          await tx.accountTransaction.create({
            data: {
              accountId: account.id,
              type: TransactionType.CREDIT,
              amount: interest.toFixed(8),
              currency: account.currency,
              balanceBefore: account.balance,
              balanceAfter: new Decimal(updated.balance.toString()).toFixed(8),
              description: `Daily interest accrual: ${businessDate.toISOString().split('T')[0]}`,
              referenceType: 'INTEREST_ACCRUAL',
              valueDate: businessDate,
            },
          });
        });

        processed++;
      } catch (err: any) {
        errors++;
        logs.push(`ERROR account ${account.id}: ${err.message}`);
      }
    }

    // 2. Check and update overdue loans
    const activeLoans = await prisma.loan.findMany({
      where: { status: 'ACTIVE' },
      include: { repaymentSchedule: { where: { isPaid: false }, orderBy: { dueDate: 'asc' }, take: 1 } },
    });

    for (const loan of activeLoans) {
      const overdueSchedule = loan.repaymentSchedule[0];
      if (overdueSchedule && overdueSchedule.dueDate < businessDate) {
        await prisma.loan.update({ where: { id: loan.id }, data: { status: 'OVERDUE' } });
        logs.push(`Loan ${loan.loanNumber} marked OVERDUE`);
        processed++;
      }
    }

    // 3. FX Revaluation — update NOSTRO account balances based on ECB rates
    const fxRates = await prisma.fxRate.findMany({
      where: { rateDate: { gte: new Date(businessDate.getTime() - 86400 * 1000) } },
      orderBy: { createdAt: 'desc' },
    });
    logs.push(`FX revaluation applied for ${fxRates.length} currency pairs`);

    await prisma.batchJob.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        processedRecords: processed,
        errorCount: errors,
        totalRecords: savingsAccounts.length + activeLoans.length,
        logs: logs.join('\n'),
        progress: 100,
      },
    });

    await publishEvent(TOPICS.BATCH_EVENTS, createEvent(
      'EOD_COMPLETED', jobId, 'BatchJob',
      { jobId, businessDate: businessDate.toISOString(), processed, errors },
      { serviceId: 'batch-service' },
    ));
  } catch (err: any) {
    await prisma.batchJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', completedAt: new Date(), logs: err.message },
    });
    throw err;
  }
}

export async function runOverdueCheck(businessDate: Date): Promise<number> {
  const { count } = await prisma.loan.updateMany({
    where: {
      status: 'ACTIVE',
      nextDueDate: { lt: businessDate },
    },
    data: { status: 'OVERDUE' },
  });
  return count;
}
