/**
 * Lending service — loan state machine & repayment allocation tests.
 * Uses in-memory stubs rather than live DB, verifying pure business logic.
 */

import Decimal from 'decimal.js';

// ── Pure helper extracted for testability ──────────────────────────────────

function allocateRepayment(
  repaymentAmount: string,
  penaltyDue: string,
  interestDue: string,
  principalDue: string,
): { penalty: Decimal; interest: Decimal; principal: Decimal; excess: Decimal } {
  let remaining = new Decimal(repaymentAmount);

  const penalty  = Decimal.min(remaining, new Decimal(penaltyDue));
  remaining = remaining.minus(penalty);

  const interest = Decimal.min(remaining, new Decimal(interestDue));
  remaining = remaining.minus(interest);

  const principal = Decimal.min(remaining, new Decimal(principalDue));
  remaining = remaining.minus(principal);

  return { penalty, interest, principal, excess: remaining };
}

// ── Loan state machine transitions ─────────────────────────────────────────

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT:       ['SUBMITTED'],
  SUBMITTED:   ['APPROVED', 'REJECTED'],
  APPROVED:    ['ACTIVE'],
  ACTIVE:      ['OVERDUE', 'SETTLED'],
  OVERDUE:     ['ACTIVE', 'WRITTEN_OFF', 'SETTLED'],
  WRITTEN_OFF: [],
  SETTLED:     [],
  REJECTED:    [],
};

function canTransition(from: string, to: string): boolean {
  return (VALID_TRANSITIONS[from] ?? []).includes(to);
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Repayment allocation (waterfall)', () => {
  test('allocates to penalty first, then interest, then principal', () => {
    const result = allocateRepayment('1500.00', '100.00', '300.00', '5000.00');
    expect(result.penalty.toFixed(2)).toBe('100.00');
    expect(result.interest.toFixed(2)).toBe('300.00');
    expect(result.principal.toFixed(2)).toBe('1100.00');
    expect(result.excess.toFixed(2)).toBe('0.00');
  });

  test('partial payment covers only penalty and part of interest', () => {
    const result = allocateRepayment('150.00', '100.00', '300.00', '5000.00');
    expect(result.penalty.toFixed(2)).toBe('100.00');
    expect(result.interest.toFixed(2)).toBe('50.00');
    expect(result.principal.toFixed(2)).toBe('0.00');
    expect(result.excess.toFixed(2)).toBe('0.00');
  });

  test('overpayment produces excess', () => {
    const result = allocateRepayment('10000.00', '0.00', '200.00', '5000.00');
    expect(result.excess.toFixed(2)).toBe('4800.00');
  });

  test('exact payment produces zero excess', () => {
    const result = allocateRepayment('5300.00', '100.00', '200.00', '5000.00');
    expect(result.excess.toFixed(2)).toBe('0.00');
    expect(result.penalty.plus(result.interest).plus(result.principal).toFixed(2)).toBe('5300.00');
  });

  test('zero repayment allocates nothing', () => {
    const result = allocateRepayment('0.00', '50.00', '200.00', '10000.00');
    expect(result.penalty.toFixed(2)).toBe('0.00');
    expect(result.interest.toFixed(2)).toBe('0.00');
    expect(result.principal.toFixed(2)).toBe('0.00');
  });
});

describe('Loan state machine', () => {
  test('DRAFT → SUBMITTED is valid', () => {
    expect(canTransition('DRAFT', 'SUBMITTED')).toBe(true);
  });

  test('SUBMITTED → APPROVED is valid', () => {
    expect(canTransition('SUBMITTED', 'APPROVED')).toBe(true);
  });

  test('SUBMITTED → REJECTED is valid', () => {
    expect(canTransition('SUBMITTED', 'REJECTED')).toBe(true);
  });

  test('APPROVED → ACTIVE is valid (disbursement)', () => {
    expect(canTransition('APPROVED', 'ACTIVE')).toBe(true);
  });

  test('ACTIVE → OVERDUE is valid (missed payment)', () => {
    expect(canTransition('ACTIVE', 'OVERDUE')).toBe(true);
  });

  test('OVERDUE → ACTIVE is valid (cured)', () => {
    expect(canTransition('OVERDUE', 'ACTIVE')).toBe(true);
  });

  test('ACTIVE → SETTLED is valid (full repayment)', () => {
    expect(canTransition('ACTIVE', 'SETTLED')).toBe(true);
  });

  test('SETTLED → ACTIVE is invalid (terminal state)', () => {
    expect(canTransition('SETTLED', 'ACTIVE')).toBe(false);
  });

  test('REJECTED → APPROVED is invalid', () => {
    expect(canTransition('REJECTED', 'APPROVED')).toBe(false);
  });

  test('WRITTEN_OFF → anything is invalid (terminal state)', () => {
    expect(canTransition('WRITTEN_OFF', 'ACTIVE')).toBe(false);
    expect(canTransition('WRITTEN_OFF', 'SETTLED')).toBe(false);
  });

  test('DRAFT → ACTIVE is invalid (must go through SUBMITTED → APPROVED)', () => {
    expect(canTransition('DRAFT', 'ACTIVE')).toBe(false);
  });
});

describe('Interest calculation', () => {
  function dailyAccrual(balance: string, annualRateDecimal: string): Decimal {
    return new Decimal(balance).times(annualRateDecimal).dividedBy(365);
  }

  test('daily interest for $50,000 at 8.9% p.a.', () => {
    const daily = dailyAccrual('50000', '0.089');
    // Expected: 50000 * 0.089 / 365 = 12.19...
    expect(daily.toFixed(2)).toBe('12.19');
  });

  test('daily interest is zero for zero balance', () => {
    expect(dailyAccrual('0', '0.089').toFixed(8)).toBe('0.00000000');
  });

  test('monthly EMI for $10,000 at 12% over 12 months', () => {
    const p = new Decimal('10000');
    const r = new Decimal('0.12').dividedBy(12); // 1% monthly
    const n = 12;
    const onePlusR = r.plus(1);
    const onePlusRn = onePlusR.toPower(n);
    const emi = p.times(r).times(onePlusRn).dividedBy(onePlusRn.minus(1));
    // Standard formula: should be ~888.49
    expect(emi.toFixed(2)).toBe('888.49');
  });

  test('penalty accrual is proportional to days overdue', () => {
    function penaltyForDays(principal: string, penaltyRate: string, days: number): Decimal {
      return new Decimal(principal).times(penaltyRate).times(days).dividedBy(365);
    }
    const p30 = penaltyForDays('100000', '0.02', 30);
    const p60 = penaltyForDays('100000', '0.02', 60);
    // 60-day penalty should be exactly double 30-day penalty
    expect(p60.dividedBy(p30).toFixed(4)).toBe('2.0000');
  });
});
