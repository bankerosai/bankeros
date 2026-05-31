import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { Currency, Money, TransactionType, JournalLine, ApiResponse, ApiError, PaginationMeta } from '@bankeros/shared-types';

// ===== Financial Math (Decimal-safe) =====

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export function toDecimal(value: string | number): Decimal {
  return new Decimal(value);
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  return { amount: toDecimal(a.amount).plus(b.amount).toFixed(2), currency: a.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  return { amount: toDecimal(a.amount).minus(b.amount).toFixed(2), currency: a.currency };
}

export function formatMoney(m: Money): string {
  return `${m.currency} ${toDecimal(m.amount).toFixed(2)}`;
}

export function assertDebitsEqualCredits(lines: JournalLine[]): void {
  const totals = lines.reduce(
    (acc, line) => {
      const amt = toDecimal(line.amount);
      if (line.type === TransactionType.DEBIT) acc.debits = acc.debits.plus(amt);
      else acc.credits = acc.credits.plus(amt);
      return acc;
    },
    { debits: new Decimal(0), credits: new Decimal(0) },
  );
  if (!totals.debits.equals(totals.credits)) {
    throw new Error(
      `Journal entry is unbalanced: debits=${totals.debits.toFixed(2)}, credits=${totals.credits.toFixed(2)}`,
    );
  }
}

// ===== Amortization Engine =====

export interface AmortizationSchedule {
  period: number;
  dueDate: string;
  openingBalance: string;
  principal: string;
  interest: string;
  totalPayment: string;
  closingBalance: string;
}

export function generateAmortizationSchedule(
  principal: string,
  annualInterestRate: string,
  termMonths: number,
  startDate: Date,
): AmortizationSchedule[] {
  const p = toDecimal(principal);
  const monthlyRate = toDecimal(annualInterestRate).dividedBy(100).dividedBy(12);
  const schedule: AmortizationSchedule[] = [];

  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const onePlusR = monthlyRate.plus(1);
  const onePlusRn = onePlusR.toPower(termMonths);
  const emi = p.times(monthlyRate).times(onePlusRn).dividedBy(onePlusRn.minus(1));

  let balance = p;
  let current = new Date(startDate);

  for (let i = 1; i <= termMonths; i++) {
    current = new Date(current);
    current.setMonth(current.getMonth() + 1);

    const interestForPeriod = balance.times(monthlyRate);
    const principalForPeriod = emi.minus(interestForPeriod);
    const closingBalance = balance.minus(principalForPeriod).isNegative()
      ? new Decimal(0)
      : balance.minus(principalForPeriod);

    schedule.push({
      period: i,
      dueDate: current.toISOString().split('T')[0],
      openingBalance: balance.toFixed(2),
      principal: principalForPeriod.toFixed(2),
      interest: interestForPeriod.toFixed(2),
      totalPayment: emi.toFixed(2),
      closingBalance: closingBalance.toFixed(2),
    });

    balance = closingBalance;
  }

  return schedule;
}

// ===== ID Generation =====

export const generateId = (): string => uuidv4();

export function generateAccountNumber(prefix: string = 'ACC'): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 9000 + 1000).toString();
  return `${prefix}${timestamp}${random}`;
}

export function generateLoanNumber(): string {
  return `LN${Date.now().toString().slice(-10)}`;
}

export function generatePaymentReference(): string {
  return `PAY${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
}

export function generateCifNumber(): string {
  return `CIF${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
}

// ===== API Response Builders =====

export function success<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

export function failure(code: string, message: string, details?: Record<string, unknown>): ApiResponse<never> {
  const error: ApiError = { code, message, ...(details ? { details } : {}) };
  return { success: false, error };
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): ApiResponse<T[]> {
  return success(items, {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}

// ===== Validation Helpers =====

export function isValidIban(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString());
  let remainder = 0;
  for (const char of numeric) {
    remainder = (remainder * 10 + parseInt(char)) % 97;
  }
  return remainder === 1;
}

export function isValidBic(bic: string): boolean {
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic.toUpperCase());
}

export function sanitizeCurrency(code: string): Currency | null {
  return Object.values(Currency).includes(code as Currency) ? (code as Currency) : null;
}

// ===== Date Utilities =====

export function businessDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

// ===== Kafka Event Factory =====

export function createEvent<T>(
  eventType: string,
  aggregateId: string,
  aggregateType: string,
  payload: T,
  metadata: { correlationId?: string; userId?: string; serviceId: string },
) {
  return {
    eventId: generateId(),
    eventType,
    aggregateId,
    aggregateType,
    occurredAt: new Date().toISOString(),
    version: 1,
    payload,
    metadata: {
      correlationId: metadata.correlationId ?? generateId(),
      userId: metadata.userId,
      serviceId: metadata.serviceId,
    },
  };
}
