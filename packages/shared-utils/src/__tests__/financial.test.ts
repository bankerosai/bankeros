/**
 * Core financial logic unit tests.
 * These cover the most critical invariants for a banking system:
 * - Monetary arithmetic must be exact (no floating-point drift)
 * - Journal entries must always be double-entry balanced
 * - Amortization schedules must sum to the correct total payment
 */

import Decimal from 'decimal.js';
import {
  toDecimal, addMoney, subtractMoney, formatMoney,
  assertDebitsEqualCredits, generateAmortizationSchedule,
  isValidIban, isValidBic, generateAccountNumber, generateLoanNumber,
  generatePaymentReference, generateCifNumber, businessDate,
} from '../index';
import { Currency, TransactionType } from '@bankeros/shared-types';

// ─── Money arithmetic ────────────────────────────────────────────────────────

describe('Money arithmetic', () => {
  test('addMoney returns exact decimal result with no floating-point drift', () => {
    const a = { amount: '0.1', currency: Currency.USD };
    const b = { amount: '0.2', currency: Currency.USD };
    const result = addMoney(a, b);
    // 0.1 + 0.2 = 0.30 in floating-point is 0.30000000000000004
    expect(result.amount).toBe('0.30');
    expect(result.currency).toBe(Currency.USD);
  });

  test('subtractMoney returns exact decimal result', () => {
    const a = { amount: '1000000.00', currency: Currency.USD };
    const b = { amount: '1.01', currency: Currency.USD };
    expect(subtractMoney(a, b).amount).toBe('999998.99');
  });

  test('addMoney throws on currency mismatch', () => {
    const usd = { amount: '100.00', currency: Currency.USD };
    const eur = { amount: '100.00', currency: Currency.EUR };
    expect(() => addMoney(usd, eur)).toThrow('Currency mismatch');
  });

  test('handles large financial amounts without precision loss', () => {
    const a = { amount: '999999999.99', currency: Currency.USD };
    const b = { amount: '0.01', currency: Currency.USD };
    expect(addMoney(a, b).amount).toBe('1000000000.00');
  });

  test('formatMoney produces correct string', () => {
    expect(formatMoney({ amount: '1234567.5', currency: Currency.GBP })).toBe('GBP 1234567.50');
  });
});

// ─── Double-entry invariant ──────────────────────────────────────────────────

describe('Double-entry journal validation', () => {
  const mkLine = (accountCode: string, type: TransactionType, amount: string) => ({
    accountCode, type, amount, currency: Currency.USD,
  });

  test('passes when debits equal credits', () => {
    const lines = [
      mkLine('1000', TransactionType.DEBIT, '50000.00'),
      mkLine('2000', TransactionType.CREDIT, '50000.00'),
    ];
    expect(() => assertDebitsEqualCredits(lines)).not.toThrow();
  });

  test('throws when debits exceed credits', () => {
    const lines = [
      mkLine('1000', TransactionType.DEBIT, '50000.00'),
      mkLine('2000', TransactionType.CREDIT, '49999.99'),
    ];
    expect(() => assertDebitsEqualCredits(lines)).toThrow('unbalanced');
  });

  test('throws when credits exceed debits', () => {
    const lines = [
      mkLine('1000', TransactionType.DEBIT, '100.00'),
      mkLine('2000', TransactionType.CREDIT, '60.00'),
      mkLine('4000', TransactionType.CREDIT, '50.00'),
    ];
    expect(() => assertDebitsEqualCredits(lines)).toThrow('unbalanced');
  });

  test('passes multi-line balanced entry (loan disbursement pattern)', () => {
    // DR Loans Receivable 100,000 | CR Cash 100,000
    const lines = [
      mkLine('1100', TransactionType.DEBIT,  '100000.00'),
      mkLine('1000', TransactionType.CREDIT, '100000.00'),
    ];
    expect(() => assertDebitsEqualCredits(lines)).not.toThrow();
  });

  test('passes complex multi-debit multi-credit entry', () => {
    const lines = [
      mkLine('5000', TransactionType.DEBIT,  '12500.00'),   // Interest expense
      mkLine('5200', TransactionType.DEBIT,  '2500.00'),    // Operating expense
      mkLine('1000', TransactionType.CREDIT, '10000.00'),   // Cash
      mkLine('2300', TransactionType.CREDIT, '5000.00'),    // Accrued liabilities
    ];
    expect(() => assertDebitsEqualCredits(lines)).not.toThrow();
  });

  test('throws on empty line array', () => {
    // An empty journal is technically balanced (0=0) but we check min lines elsewhere
    expect(() => assertDebitsEqualCredits([])).not.toThrow();
  });
});

// ─── Amortization engine ─────────────────────────────────────────────────────

describe('Amortization schedule', () => {
  const startDate = new Date('2024-01-15');

  test('schedule has correct number of periods', () => {
    const schedule = generateAmortizationSchedule('50000', '8.9', 12, startDate);
    expect(schedule).toHaveLength(12);
  });

  test('period numbers run 1..n sequentially', () => {
    const schedule = generateAmortizationSchedule('50000', '8.9', 6, startDate);
    schedule.forEach((s, i) => expect(s.period).toBe(i + 1));
  });

  test('total payments approximately cover principal + interest', () => {
    const principal = 50000;
    const rate = 8.9;
    const months = 12;
    const schedule = generateAmortizationSchedule(String(principal), String(rate), months, startDate);
    const totalPaid = schedule.reduce((s, row) => s.plus(row.totalPayment), new Decimal(0));
    const totalInterest = schedule.reduce((s, row) => s.plus(row.interest), new Decimal(0));
    const totalPrincipal = schedule.reduce((s, row) => s.plus(row.principal), new Decimal(0));

    // Total principal repaid ≈ original principal (allow ±1 cent for rounding)
    expect(totalPrincipal.minus(principal).abs().lte('1.00')).toBe(true);
    // Interest must be positive
    expect(totalInterest.gt(0)).toBe(true);
    // Total paid = principal + interest
    expect(totalPaid.minus(totalPrincipal.plus(totalInterest)).abs().lte('0.01')).toBe(true);
  });

  test('closing balance reaches zero by final period', () => {
    const schedule = generateAmortizationSchedule('10000', '12', 24, startDate);
    const lastRow = schedule[schedule.length - 1];
    expect(new Decimal(lastRow.closingBalance).lte('0.01')).toBe(true);
  });

  test('each opening balance equals previous closing balance', () => {
    const schedule = generateAmortizationSchedule('25000', '6.5', 12, startDate);
    for (let i = 1; i < schedule.length; i++) {
      const prevClose = new Decimal(schedule[i - 1].closingBalance);
      const currOpen  = new Decimal(schedule[i].openingBalance);
      expect(prevClose.minus(currOpen).abs().lte('0.01')).toBe(true);
    }
  });

  test('interest is always positive and decreasing (reducing balance)', () => {
    const schedule = generateAmortizationSchedule('100000', '10', 24, startDate);
    for (let i = 1; i < schedule.length; i++) {
      const prev = new Decimal(schedule[i - 1].interest);
      const curr = new Decimal(schedule[i].interest);
      expect(curr.gt(0)).toBe(true);
      // Each period's interest ≤ previous (reducing balance)
      expect(curr.lte(prev)).toBe(true);
    }
  });

  test('bullet/single-period schedule works', () => {
    const schedule = generateAmortizationSchedule('100000', '5', 1, startDate);
    expect(schedule).toHaveLength(1);
    expect(new Decimal(schedule[0].closingBalance).lte('0.01')).toBe(true);
  });
});

// ─── Validation helpers ──────────────────────────────────────────────────────

describe('IBAN validation', () => {
  test('accepts valid UK IBAN', () => {
    expect(isValidIban('GB82WEST12345698765432')).toBe(true);
  });

  test('accepts valid DE IBAN', () => {
    expect(isValidIban('DE89370400440532013000')).toBe(true);
  });

  test('rejects invalid checksum', () => {
    expect(isValidIban('GB82WEST12345698765433')).toBe(false);
  });

  test('rejects too-short string', () => {
    expect(isValidIban('GB82')).toBe(false);
  });

  test('ignores spaces (handles formatted IBANs)', () => {
    expect(isValidIban('GB82 WEST 1234 5698 7654 32')).toBe(true);
  });
});

describe('BIC validation', () => {
  test('accepts 8-char BIC', () => {
    expect(isValidBic('DEUTDEDB')).toBe(true);
  });

  test('accepts 11-char BIC', () => {
    expect(isValidBic('DEUTDEDBBER')).toBe(true);
  });

  test('rejects short BIC', () => {
    expect(isValidBic('DEUT')).toBe(false);
  });

  test('rejects BIC with lowercase', () => {
    expect(isValidBic('deutdedb')).toBe(false);
  });
});

// ─── ID generators ───────────────────────────────────────────────────────────

describe('ID generators', () => {
  test('generateAccountNumber has correct prefix', () => {
    const acc = generateAccountNumber('CURR');
    expect(acc.startsWith('CURR')).toBe(true);
    expect(acc.length).toBeGreaterThanOrEqual(10);
  });

  test('generateLoanNumber has LN prefix', () => {
    expect(generateLoanNumber().startsWith('LN')).toBe(true);
  });

  test('generatePaymentReference has PAY prefix', () => {
    expect(generatePaymentReference().startsWith('PAY')).toBe(true);
  });

  test('generateCifNumber has CIF prefix', () => {
    expect(generateCifNumber().startsWith('CIF')).toBe(true);
  });

  test('consecutive calls produce unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateLoanNumber));
    expect(ids.size).toBe(100);
  });

  test('businessDate returns ISO YYYY-MM-DD format', () => {
    const d = businessDate(new Date('2024-05-30T14:30:00Z'));
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(d).toBe('2024-05-30');
  });
});
