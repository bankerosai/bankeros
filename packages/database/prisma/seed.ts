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

  // ---- Demo customers used by Banker Copilot tools ----
  // These CIFs match the IDs in apps/demo-backend/src/fixtures.ts so a
  // banker can ask Copilot about CIF-884109 either through the real
  // Prisma-backed services OR via the standalone demo-backend.
  const demoCustomers = [
    {
      cifNumber: 'CIF-884109',
      fullName: '浙江华盾包装有限公司',
      email: 'finance@huadun.example.cn',
      phone: '+86-571-8800-1024',
      type: 'CORPORATE' as const,
      nationality: 'CN',
      kycStatus: 'APPROVED' as const,
      riskScore: 35, // LOW
    },
    {
      cifNumber: 'CIF-220184',
      fullName: '上海钢联材料股份有限公司',
      email: 'treasury@gangliansh.example.cn',
      phone: '+86-21-6420-0184',
      type: 'CORPORATE' as const,
      nationality: 'CN',
      kycStatus: 'APPROVED' as const,
      riskScore: 55, // MEDIUM
    },
    {
      cifNumber: 'CIF-330042',
      fullName: '招商局港口控股有限公司',
      email: 'group.treasury@cmport.example.hk',
      phone: '+852-2820-0042',
      type: 'CORPORATE' as const,
      nationality: 'HK',
      kycStatus: 'APPROVED' as const,
      riskScore: 82, // HIGH (group customer = enhanced due diligence)
    },
    {
      cifNumber: 'CIF-440022',
      fullName: '深圳易达供应链有限公司',
      email: 'ar@yidasc.example.cn',
      phone: '+86-755-8888-0022',
      type: 'CORPORATE' as const,
      nationality: 'CN',
      kycStatus: 'APPROVED' as const,
      riskScore: 42,
    },
    {
      cifNumber: 'CIF-550088',
      fullName: '广东智造科技股份有限公司',
      email: 'finance@gdzhizao.example.cn',
      phone: '+86-755-8800-5588',
      type: 'CORPORATE' as const,
      nationality: 'CN',
      kycStatus: 'APPROVED' as const,
      riskScore: 65,
    },
  ];
  for (const c of demoCustomers) {
    await prisma.customer.upsert({
      where: { cifNumber: c.cifNumber },
      update: { fullName: c.fullName, kycStatus: c.kycStatus, riskScore: c.riskScore },
      create: c,
    });
  }
  console.log(`Seeded ${demoCustomers.length} demo customers for Copilot.`);

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
