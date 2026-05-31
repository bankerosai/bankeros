/**
 * Payment service tests — network routing and fraud scoring logic.
 */

import Decimal from 'decimal.js';

// ── Network routing logic (extracted from PaymentService) ──────────────────

type PaymentNetwork = 'INTERNAL' | 'ACH' | 'RTGS' | 'SWIFT' | 'SEPA' | 'FASTER_PAYMENTS';

function selectNetwork(amount: string, currency: string, creditorBankBic?: string): PaymentNetwork {
  if (!creditorBankBic) return 'INTERNAL';
  const amtDecimal = new Decimal(amount);
  if (currency === 'GBP' && amtDecimal.gte(250000)) return 'RTGS';
  if (creditorBankBic && creditorBankBic.length >= 8) return 'SWIFT';
  return 'ACH';
}

// ── Simplified fraud scoring ───────────────────────────────────────────────

function computeFraudScore(input: {
  amount: string;
  creditorCountry?: string;
  recentPaymentCount: number;
}): number {
  let score = 0;
  const amt = parseFloat(input.amount);
  if (amt > 10000) score += 0.15;
  if (amt > 100000) score += 0.25;
  const highRisk = ['IR', 'KP', 'SY', 'CU', 'AF'];
  if (input.creditorCountry && highRisk.includes(input.creditorCountry)) score += 0.30;
  if (input.recentPaymentCount > 5) score += 0.20;
  if (input.recentPaymentCount > 10) score += 0.25;
  return Math.min(score, 1.0);
}

// ── ISO 20022 status mapping ───────────────────────────────────────────────

function mapToIso20022(status: string): string {
  const map: Record<string, string> = {
    INITIATED: 'RCVD', PENDING: 'PDNG', PROCESSING: 'ACCP',
    COMPLETED: 'ACSC', FAILED: 'RJCT', CANCELLED: 'CANC', REVERSED: 'REVD',
  };
  return map[status] ?? 'UNKN';
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Payment network routing', () => {
  test('routes internal payment when no BIC provided', () => {
    expect(selectNetwork('50000', 'USD', undefined)).toBe('INTERNAL');
  });

  test('routes to RTGS for large GBP payments (≥250,000)', () => {
    expect(selectNetwork('250000', 'GBP', 'BARCGB22')).toBe('RTGS');
    expect(selectNetwork('1000000', 'GBP', 'BARCGB22')).toBe('RTGS');
  });

  test('routes to ACH for small GBP payments', () => {
    expect(selectNetwork('249999', 'GBP', 'BARCGB22')).toBe('SWIFT');
  });

  test('routes to SWIFT for cross-border with BIC', () => {
    expect(selectNetwork('5000', 'USD', 'DEUTDEDB')).toBe('SWIFT');
    expect(selectNetwork('100000', 'EUR', 'BNPAFRPP')).toBe('SWIFT');
  });

  test('routes to INTERNAL for small domestic without BIC', () => {
    expect(selectNetwork('1000', 'USD')).toBe('INTERNAL');
  });
});

describe('Fraud scoring', () => {
  test('low-risk domestic small payment scores near zero', () => {
    const score = computeFraudScore({ amount: '500', recentPaymentCount: 1 });
    expect(score).toBe(0);
  });

  test('high-value payment triggers uplift', () => {
    const score = computeFraudScore({ amount: '150000', recentPaymentCount: 0 });
    expect(score).toBeGreaterThanOrEqual(0.40); // 0.15 + 0.25
  });

  test('high-risk country adds significant score', () => {
    const score = computeFraudScore({ amount: '1000', creditorCountry: 'KP', recentPaymentCount: 0 });
    expect(score).toBeGreaterThanOrEqual(0.30);
  });

  test('velocity breach is detected', () => {
    const score = computeFraudScore({ amount: '100', recentPaymentCount: 11 });
    expect(score).toBeGreaterThanOrEqual(0.45); // 0.20 + 0.25
  });

  test('combined high-risk factors are capped at 1.0', () => {
    const score = computeFraudScore({ amount: '500000', creditorCountry: 'IR', recentPaymentCount: 15 });
    expect(score).toBe(1.0);
  });

  test('score above 0.9 should trigger block', () => {
    const score = computeFraudScore({ amount: '500000', creditorCountry: 'KP', recentPaymentCount: 12 });
    expect(score).toBeGreaterThan(0.9);
  });

  test('score below 0.3 should pass without review', () => {
    const score = computeFraudScore({ amount: '5000', recentPaymentCount: 0 });
    expect(score).toBeLessThan(0.3);
  });
});

describe('ISO 20022 status mapping', () => {
  const cases: [string, string][] = [
    ['INITIATED',  'RCVD'],
    ['PENDING',    'PDNG'],
    ['PROCESSING', 'ACCP'],
    ['COMPLETED',  'ACSC'],
    ['FAILED',     'RJCT'],
    ['CANCELLED',  'CANC'],
    ['REVERSED',   'REVD'],
  ];

  test.each(cases)('%s maps to ISO 20022 %s', (input, expected) => {
    expect(mapToIso20022(input)).toBe(expected);
  });

  test('unknown status maps to UNKN', () => {
    expect(mapToIso20022('INVALID_STATUS')).toBe('UNKN');
  });
});

describe('Payment amount validation', () => {
  function isValidAmount(amount: string): boolean {
    return /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0;
  }

  test('accepts valid amounts', () => {
    expect(isValidAmount('100')).toBe(true);
    expect(isValidAmount('1.50')).toBe(true);
    expect(isValidAmount('1000000.99')).toBe(true);
  });

  test('rejects negative amounts', () => {
    expect(isValidAmount('-100')).toBe(false);
  });

  test('rejects zero', () => {
    expect(isValidAmount('0')).toBe(false);
  });

  test('rejects more than 2 decimal places', () => {
    expect(isValidAmount('1.234')).toBe(false);
  });

  test('rejects non-numeric', () => {
    expect(isValidAmount('abc')).toBe(false);
  });
});
