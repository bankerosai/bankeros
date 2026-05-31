import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';
import { TransactionType } from '@bankeros/shared-types';
import { createEvent, generateId } from '@bankeros/shared-utils';
import { publishEvent, TOPICS } from '@bankeros/shared-utils/src/kafka';

export interface SweepResult {
  memberId: string;
  accountId: string;
  direction: 'UP' | 'DOWN';
  amount: string;
  currency: string;
}

export class CashPoolService {
  // Execute automated sweeping for all pools — Module 7 core operation
  async executeSweep(poolId: string): Promise<SweepResult[]> {
    const pool = await prisma.cashPool.findUnique({
      where: { id: poolId },
      include: { members: true },
    });
    if (!pool) throw new Error('Cash pool not found');

    const master = await prisma.account.findUnique({ where: { id: pool.masterAccountId } });
    if (!master) throw new Error('Master account not found');

    const results: SweepResult[] = [];

    for (const member of pool.members) {
      if (!member.isActive || member.accountId === pool.masterAccountId) continue;

      const account = await prisma.account.findUnique({ where: { id: member.accountId } });
      if (!account) continue;

      const balance = new Decimal(account.balance.toString());
      const minBalance = new Decimal(member.minBalance.toString());
      const target = member.targetBalance ? new Decimal(member.targetBalance.toString()) : null;

      let sweepAmount = new Decimal(0);
      let direction: 'UP' | 'DOWN' = 'UP';

      if (target) {
        // Target-balance sweep: bring balance to target
        const diff = balance.minus(target);
        if (diff.abs().lt('0.01')) continue; // Ignore sub-cent differences
        sweepAmount = diff.abs();
        direction = diff.gt(0) ? 'UP' : 'DOWN';
      } else {
        // Excess-only sweep: sweep everything above min balance up to master
        const excess = balance.minus(minBalance);
        if (excess.lte(0)) continue;
        sweepAmount = excess;
        direction = 'UP';
      }

      await prisma.$transaction(async (tx) => {
        if (direction === 'UP') {
          // Move funds from member → master
          await tx.account.update({
            where: { id: member.accountId },
            data: { balance: { decrement: sweepAmount.toFixed(8) }, availableBalance: { decrement: sweepAmount.toFixed(8) } },
          });
          await tx.account.update({
            where: { id: pool.masterAccountId },
            data: { balance: { increment: sweepAmount.toFixed(8) }, availableBalance: { increment: sweepAmount.toFixed(8) } },
          });
        } else {
          // Move funds from master → member (top-up)
          await tx.account.update({
            where: { id: pool.masterAccountId },
            data: { balance: { decrement: sweepAmount.toFixed(8) }, availableBalance: { decrement: sweepAmount.toFixed(8) } },
          });
          await tx.account.update({
            where: { id: member.accountId },
            data: { balance: { increment: sweepAmount.toFixed(8) }, availableBalance: { increment: sweepAmount.toFixed(8) } },
          });
        }

        const refId = generateId();
        await tx.accountTransaction.createMany({
          data: [
            {
              accountId: direction === 'UP' ? member.accountId : pool.masterAccountId,
              type: TransactionType.DEBIT,
              amount: sweepAmount.toFixed(8),
              currency: account.currency,
              balanceBefore: 0, balanceAfter: 0,
              description: `Cash pool sweep ${direction}: pool ${pool.id}`,
              referenceId: refId, referenceType: 'CASH_POOL_SWEEP',
              valueDate: new Date(),
            },
            {
              accountId: direction === 'UP' ? pool.masterAccountId : member.accountId,
              type: TransactionType.CREDIT,
              amount: sweepAmount.toFixed(8),
              currency: account.currency,
              balanceBefore: 0, balanceAfter: 0,
              description: `Cash pool sweep ${direction}: pool ${pool.id}`,
              referenceId: refId, referenceType: 'CASH_POOL_SWEEP',
              valueDate: new Date(),
            },
          ],
        });
      });

      results.push({ memberId: member.id, accountId: member.accountId, direction, amount: sweepAmount.toFixed(2), currency: account.currency });
    }

    await publishEvent(TOPICS.ACCOUNT_EVENTS, createEvent(
      'CASH_POOL_SWEPT', poolId, 'CashPool',
      { poolId, sweepCount: results.length, totalSwept: results.reduce((s, r) => s.plus(r.amount), new Decimal(0)).toFixed(2) },
      { serviceId: 'liquidity-service' },
    ));

    return results;
  }

  // Notional pooling — calculates net interest without physical movement (Module 7)
  async calculateNotionalPoolInterest(poolId: string, annualRate: string, businessDate: Date) {
    const pool = await prisma.cashPool.findUnique({ where: { id: poolId }, include: { members: true } });
    if (!pool || !pool.isNotional) throw new Error('Pool not found or is not a notional pool');

    const dailyRate = new Decimal(annualRate).dividedBy(365);
    const memberDetails = [];
    let netPosition = new Decimal(0);

    for (const member of pool.members) {
      const account = await prisma.account.findUnique({ where: { id: member.accountId } });
      if (!account) continue;

      const balance = new Decimal(account.balance.toString());
      netPosition = netPosition.plus(balance);
      memberDetails.push({
        accountId: member.accountId,
        balance: balance.toFixed(2),
        currency: account.currency,
        notionalInterest: balance.times(dailyRate).toFixed(8),
      });
    }

    const poolInterest = netPosition.gt(0) ? netPosition.times(dailyRate) : new Decimal(0);
    const poolCharge = netPosition.lt(0) ? netPosition.abs().times(dailyRate) : new Decimal(0);

    return {
      poolId,
      businessDate: businessDate.toISOString().split('T')[0],
      netPosition: netPosition.toFixed(2),
      grossInterestEarned: poolInterest.toFixed(8),
      grossInterestCharged: poolCharge.toFixed(8),
      memberDetails,
    };
  }

  async forecastCashPosition(accountId: string, days: number = 30) {
    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) throw new Error('Account not found');

    const currentBalance = new Decimal(account.balance.toString());

    // Pull scheduled loan repayments (inflows for bank)
    const upcomingSchedule = await prisma.loanSchedule.findMany({
      where: {
        isPaid: false,
        dueDate: { gte: new Date(), lte: new Date(Date.now() + days * 86400 * 1000) },
        loan: { accountId },
      },
      orderBy: { dueDate: 'asc' },
    });

    // Build forecast timeline
    const forecast: Array<{ date: string; projectedBalance: string; events: string[] }> = [];
    let runningBalance = currentBalance;

    for (let i = 1; i <= days; i++) {
      const date = new Date(Date.now() + i * 86400 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents: string[] = [];

      const dueToday = upcomingSchedule.filter((s) => s.dueDate.toISOString().split('T')[0] === dateStr);
      for (const s of dueToday) {
        runningBalance = runningBalance.plus(s.totalDue.toString());
        dayEvents.push(`Loan repayment due: +${s.totalDue}`);
      }

      forecast.push({ date: dateStr, projectedBalance: runningBalance.toFixed(2), events: dayEvents });
    }

    return { accountId, currentBalance: currentBalance.toFixed(2), forecastDays: days, forecast };
  }
}
