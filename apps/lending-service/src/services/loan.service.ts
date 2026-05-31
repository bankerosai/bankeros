import { prisma } from '@bankeros/database';
import Decimal from 'decimal.js';
import { generateLoanNumber, generateAmortizationSchedule, createEvent } from '@bankeros/shared-utils';
import { publishEvent, TOPICS } from '@bankeros/shared-utils/src/kafka';
import { LoanStatus, TransactionType } from '@bankeros/shared-types';

export class LoanService {
  async applyForLoan(input: {
    customerId: string;
    productId: string;
    principalAmount: string;
    termMonths: number;
    notes?: string;
  }) {
    const product = await prisma.loanProduct.findUnique({ where: { id: input.productId, isActive: true } });
    if (!product) throw new Error('Loan product not found or inactive');

    const principal = new Decimal(input.principalAmount);
    if (principal.lt(product.minAmount.toString()) || principal.gt(product.maxAmount.toString())) {
      throw new Error(`Principal must be between ${product.minAmount} and ${product.maxAmount} ${product.currency}`);
    }
    if (input.termMonths < product.minTermMonths || input.termMonths > product.maxTermMonths) {
      throw new Error(`Term must be between ${product.minTermMonths} and ${product.maxTermMonths} months`);
    }

    const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) throw new Error('Customer not found');
    if (customer.kycStatus !== 'APPROVED') throw new Error('Customer KYC must be approved before applying for a loan');

    const loan = await prisma.loan.create({
      data: {
        loanNumber: generateLoanNumber(),
        customerId: input.customerId,
        productId: input.productId,
        currency: product.currency,
        principalAmount: input.principalAmount,
        outstandingBalance: input.principalAmount,
        interestRate: product.nominalInterestRate.toString(),
        termMonths: input.termMonths,
        status: 'SUBMITTED',
        notes: input.notes,
      },
      include: { product: true },
    });

    await publishEvent(TOPICS.LOAN_EVENTS, createEvent(
      'LOAN_APPLIED', loan.id, 'Loan',
      { loanId: loan.id, customerId: input.customerId, amount: input.principalAmount, currency: product.currency },
      { serviceId: 'lending-service' },
    ));

    return loan;
  }

  async approveLoan(loanId: string, approvedById: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId }, include: { product: true } });
    if (!loan) throw new Error('Loan not found');
    if (loan.status !== 'SUBMITTED') throw new Error(`Cannot approve a loan in ${loan.status} status`);

    const disbursementDate = new Date();
    const schedule = generateAmortizationSchedule(
      loan.principalAmount.toString(),
      new Decimal(loan.interestRate.toString()).times(100).toString(),
      loan.termMonths,
      disbursementDate,
    );

    const maturityDate = new Date(schedule[schedule.length - 1].dueDate);

    await prisma.$transaction([
      prisma.loan.update({
        where: { id: loanId },
        data: {
          status: 'APPROVED',
          approvedById,
          approvedAt: new Date(),
          maturityDate,
        },
      }),
      ...schedule.map((s) =>
        prisma.loanSchedule.create({
          data: {
            loanId,
            period: s.period,
            dueDate: new Date(s.dueDate),
            principalDue: s.principal,
            interestDue: s.interest,
            totalDue: s.totalPayment,
          },
        }),
      ),
    ]);

    return prisma.loan.findUnique({ where: { id: loanId }, include: { repaymentSchedule: true } });
  }

  async disburseLoan(loanId: string, disbursementAccountId: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new Error('Loan not found');
    if (loan.status !== 'APPROVED') throw new Error('Loan must be in APPROVED state to disburse');

    const firstDue = await prisma.loanSchedule.findFirst({ where: { loanId }, orderBy: { period: 'asc' } });

    await prisma.$transaction(async (tx) => {
      await tx.loan.update({
        where: { id: loanId },
        data: { status: 'ACTIVE', disbursedAt: new Date(), nextDueDate: firstDue?.dueDate, accountId: disbursementAccountId },
      });

      await tx.account.update({
        where: { id: disbursementAccountId },
        data: {
          balance: { increment: loan.principalAmount },
          availableBalance: { increment: loan.principalAmount },
        },
      });

      await tx.accountTransaction.create({
        data: {
          accountId: disbursementAccountId,
          type: TransactionType.CREDIT,
          amount: loan.principalAmount,
          currency: loan.currency,
          balanceBefore: 0,
          balanceAfter: loan.principalAmount,
          description: `Loan disbursement: ${loan.loanNumber}`,
          referenceId: loan.id,
          referenceType: 'LOAN_DISBURSEMENT',
          valueDate: new Date(),
        },
      });

      await tx.loanTransaction.create({
        data: {
          loanId,
          type: 'DISBURSEMENT',
          amount: loan.principalAmount,
          principalPart: loan.principalAmount,
          transactionDate: new Date(),
        },
      });
    });

    await publishEvent(TOPICS.LOAN_EVENTS, createEvent(
      'LOAN_DISBURSED', loanId, 'Loan',
      { loanId, amount: loan.principalAmount.toString(), currency: loan.currency, customerId: loan.customerId },
      { serviceId: 'lending-service' },
    ));

    return prisma.loan.findUnique({ where: { id: loanId } });
  }

  async processRepayment(loanId: string, amount: string, fromAccountId: string) {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { repaymentSchedule: { where: { isPaid: false }, orderBy: { dueDate: 'asc' }, take: 1 } },
    });
    if (!loan) throw new Error('Loan not found');
    if (!['ACTIVE', 'OVERDUE'].includes(loan.status)) throw new Error('Loan is not active');

    const repayment = new Decimal(amount);
    const outstanding = new Decimal(loan.outstandingBalance.toString());

    let remainingRepayment = repayment;
    let principalPaid = new Decimal(0);
    let interestPaid = new Decimal(0);

    const schedule = loan.repaymentSchedule[0];
    if (schedule) {
      const interestDue = new Decimal(schedule.interestDue.toString()).minus(schedule.paidAmount.toString());
      interestPaid = Decimal.min(remainingRepayment, interestDue);
      remainingRepayment = remainingRepayment.minus(interestPaid);
      principalPaid = Decimal.min(remainingRepayment, outstanding.minus(interestDue));
    } else {
      principalPaid = Decimal.min(repayment, outstanding);
    }

    const newBalance = outstanding.minus(principalPaid);
    const isFullyPaid = newBalance.lte(0);

    await prisma.$transaction(async (tx) => {
      await tx.loan.update({
        where: { id: loanId },
        data: {
          outstandingBalance: isFullyPaid ? 0 : newBalance.toFixed(8),
          status: isFullyPaid ? 'SETTLED' : loan.status,
        },
      });

      if (schedule) {
        await tx.loanSchedule.update({
          where: { id: schedule.id },
          data: {
            paidAmount: { increment: repayment.toFixed(8) },
            isPaid: repayment.gte(schedule.totalDue.toString()),
            paidAt: new Date(),
          },
        });
      }

      await tx.loanTransaction.create({
        data: {
          loanId,
          type: 'REPAYMENT',
          amount: repayment.toFixed(8),
          principalPart: principalPaid.toFixed(8),
          interestPart: interestPaid.toFixed(8),
          transactionDate: new Date(),
        },
      });

      await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: { decrement: repayment.toFixed(8) },
          availableBalance: { decrement: repayment.toFixed(8) },
        },
      });
    });

    return {
      loanId,
      repaymentAmount: amount,
      principalPaid: principalPaid.toFixed(2),
      interestPaid: interestPaid.toFixed(2),
      newOutstandingBalance: newBalance.isNegative() ? '0.00' : newBalance.toFixed(2),
      isFullyPaid,
    };
  }
}
