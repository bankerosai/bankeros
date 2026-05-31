import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BankerOS database...');

  // ---- GL Chart of Accounts (GAAP-compliant structure) ----
  const accounts = [
    // Assets
    { code: '1000', name: 'Cash & Central Bank', type: 'ASSET' },
    { code: '1100', name: 'Loans to Customers', type: 'ASSET' },
    { code: '1200', name: 'Investment Securities', type: 'ASSET' },
    { code: '1300', name: 'Nostro Accounts', type: 'ASSET' },
    { code: '1400', name: 'Accrued Interest Receivable', type: 'ASSET' },
    { code: '1500', name: 'Fixed Assets', type: 'ASSET' },
    // Liabilities
    { code: '2000', name: 'Customer Deposits – Current', type: 'LIABILITY' },
    { code: '2100', name: 'Customer Deposits – Savings', type: 'LIABILITY' },
    { code: '2200', name: 'Interbank Borrowings', type: 'LIABILITY' },
    { code: '2300', name: 'Accrued Interest Payable', type: 'LIABILITY' },
    { code: '2400', name: 'Trade Finance Liabilities', type: 'LIABILITY' },
    // Equity
    { code: '3000', name: 'Share Capital', type: 'EQUITY' },
    { code: '3100', name: 'Retained Earnings', type: 'EQUITY' },
    // Income
    { code: '4000', name: 'Interest Income – Loans', type: 'INCOME' },
    { code: '4100', name: 'Interest Income – Securities', type: 'INCOME' },
    { code: '4200', name: 'Fee Income – Payments', type: 'INCOME' },
    { code: '4300', name: 'Fee Income – Trade Finance', type: 'INCOME' },
    { code: '4400', name: 'FX Trading Income', type: 'INCOME' },
    // Expenses
    { code: '5000', name: 'Interest Expense – Deposits', type: 'EXPENSE' },
    { code: '5100', name: 'Loan Loss Provisions', type: 'EXPENSE' },
    { code: '5200', name: 'Operating Expenses', type: 'EXPENSE' },
  ];

  for (const acct of accounts) {
    await prisma.glAccount.upsert({
      where: { code: acct.code },
      update: {},
      create: acct,
    });
  }

  // ---- Loan Products ----
  await prisma.loanProduct.upsert({
    where: { code: 'PERSONAL_FIXED' },
    update: {},
    create: {
      code: 'PERSONAL_FIXED',
      name: 'Personal Loan – Fixed Rate',
      type: 'PERSONAL',
      currency: 'USD',
      minAmount: '1000',
      maxAmount: '50000',
      minTermMonths: 6,
      maxTermMonths: 60,
      nominalInterestRate: '0.089',  // 8.9% p.a.
      penaltyRate: '0.02',
      gracePeriodDays: 5,
      repaymentFrequency: 'MONTHLY',
    },
  });

  await prisma.loanProduct.upsert({
    where: { code: 'SME_REVOLVING' },
    update: {},
    create: {
      code: 'SME_REVOLVING',
      name: 'SME Revolving Credit Facility',
      type: 'SME',
      currency: 'USD',
      minAmount: '50000',
      maxAmount: '5000000',
      minTermMonths: 12,
      maxTermMonths: 60,
      nominalInterestRate: '0.065',
      penaltyRate: '0.03',
      gracePeriodDays: 10,
      repaymentFrequency: 'MONTHLY',
    },
  });

  // ---- Admin User ----
  const passwordHash = await bcrypt.hash('Admin@BankerOS2024!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@bankeros.io' },
    update: {},
    create: {
      email: 'admin@bankeros.io',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      mfaEnabled: false,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
