import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';
import { assertDebitsEqualCredits, generateId } from '@bankeros/shared-utils';
import { TransactionType, JournalLine as JournalLineInput } from '@bankeros/shared-types';

export interface PostJournalInput {
  referenceId: string;
  referenceType: string;
  description?: string;
  businessDate: Date;
  lines: JournalLineInput[];
  createdById?: string;
}

export class LedgerService {
  async postJournal(input: PostJournalInput) {
    // Enforce double-entry invariant before any DB write
    assertDebitsEqualCredits(input.lines);

    // Validate all GL accounts exist
    const codes = [...new Set(input.lines.map((l) => l.accountCode))];
    const glAccounts = await prisma.glAccount.findMany({ where: { code: { in: codes }, isActive: true } });
    if (glAccounts.length !== codes.length) {
      const missing = codes.filter((c) => !glAccounts.find((a) => a.code === c));
      throw new Error(`GL account(s) not found or inactive: ${missing.join(', ')}`);
    }

    return prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          referenceId: input.referenceId,
          referenceType: input.referenceType,
          description: input.description,
          status: 'POSTED',
          businessDate: input.businessDate,
          postedAt: new Date(),
          createdById: input.createdById,
          lines: {
            create: input.lines.map((l) => ({
              glAccountCode: l.accountCode,
              type: l.type,
              amount: new Decimal(l.amount).toFixed(8),
              currency: l.currency,
              description: l.description,
            })),
          },
        },
        include: { lines: true },
      });

      return entry;
    });
  }

  async getGlBalance(accountCode: string, asOf?: Date) {
    const dateFilter = asOf ? { lte: asOf } : undefined;

    const lines = await prisma.journalLine.findMany({
      where: {
        glAccountCode: accountCode,
        journalEntry: {
          status: 'POSTED',
          ...(dateFilter ? { businessDate: dateFilter } : {}),
        },
      },
      select: { type: true, amount: true, currency: true },
    });

    const summary = lines.reduce(
      (acc, line) => {
        const amt = new Decimal(line.amount.toString());
        if (line.type === TransactionType.DEBIT) acc.debits = acc.debits.plus(amt);
        else acc.credits = acc.credits.plus(amt);
        return acc;
      },
      { debits: new Decimal(0), credits: new Decimal(0) },
    );

    return {
      accountCode,
      debitTotal: summary.debits.toFixed(2),
      creditTotal: summary.credits.toFixed(2),
      netBalance: summary.debits.minus(summary.credits).toFixed(2),
      asOf: asOf?.toISOString() ?? new Date().toISOString(),
    };
  }

  async reverseJournal(journalEntryId: string, reason: string, createdById?: string) {
    const original = await prisma.journalEntry.findUnique({
      where: { id: journalEntryId },
      include: { lines: true },
    });

    if (!original) throw new Error(`Journal entry ${journalEntryId} not found`);
    if (original.status !== 'POSTED') throw new Error('Only POSTED journal entries can be reversed');

    const reversalLines: JournalLineInput[] = original.lines.map((l) => ({
      accountCode: l.glAccountCode,
      type: l.type === 'DEBIT' ? TransactionType.CREDIT : TransactionType.DEBIT,
      amount: l.amount.toString(),
      currency: l.currency,
      description: `REVERSAL: ${l.description ?? ''}`,
    }));

    return prisma.$transaction(async (tx) => {
      await tx.journalEntry.update({
        where: { id: journalEntryId },
        data: { status: 'REVERSED' },
      });

      const reversal = await tx.journalEntry.create({
        data: {
          referenceId: original.referenceId,
          referenceType: original.referenceType,
          description: `REVERSAL of ${journalEntryId}: ${reason}`,
          status: 'POSTED',
          businessDate: new Date(),
          postedAt: new Date(),
          reversedById: journalEntryId,
          createdById,
          lines: {
            create: reversalLines.map((l) => ({
              glAccountCode: l.accountCode,
              type: l.type,
              amount: new Decimal(l.amount).toFixed(8),
              currency: l.currency,
              description: l.description,
            })),
          },
        },
        include: { lines: true },
      });

      return reversal;
    });
  }

  async generateTrialBalance(businessDate: Date) {
    const accounts = await prisma.glAccount.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } });

    const rows = await Promise.all(
      accounts.map(async (acct) => {
        const bal = await this.getGlBalance(acct.code, businessDate);
        return { ...acct, ...bal };
      }),
    );

    const totalDebits = rows.reduce((s, r) => s.plus(r.debitTotal), new Decimal(0));
    const totalCredits = rows.reduce((s, r) => s.plus(r.creditTotal), new Decimal(0));

    return {
      businessDate: businessDate.toISOString().split('T')[0],
      rows,
      totals: {
        debits: totalDebits.toFixed(2),
        credits: totalCredits.toFixed(2),
        isBalanced: totalDebits.equals(totalCredits),
      },
    };
  }
}
