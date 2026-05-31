import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import { LoanService } from '../services/loan.service';

const loanSvc = new LoanService();

const ApplyLoanSchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string().uuid(),
  principalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  termMonths: z.number().int().positive(),
  notes: z.string().optional(),
});

const RepaymentSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  fromAccountId: z.string().uuid(),
});

export async function loanRoutes(app: FastifyInstance) {
  // POST /fineract-provider/api/v1/loans  — Loan application (Module 2)
  app.post('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = ApplyLoanSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid loan application', body.error.flatten()));

    try {
      const loan = await loanSvc.applyForLoan(body.data);
      return reply.status(201).send(success(loan));
    } catch (err: any) {
      return reply.status(400).send(failure('LOAN_ERROR', err.message));
    }
  });

  // GET /fineract-provider/api/v1/loans/:loanId
  app.get('/:loanId', { preHandler: [requireAuth] }, async (request, reply) => {
    const { loanId } = request.params as { loanId: string };
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { product: true, repaymentSchedule: { orderBy: { period: 'asc' } } },
    });
    if (!loan) return reply.status(404).send(failure('NOT_FOUND', 'Loan not found'));
    return reply.send(success(loan));
  });

  // GET /fineract-provider/api/v1/loans — List loans
  app.get('/', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER', 'COMPLIANCE_OFFICER')] }, async (request, reply) => {
    const { page = 1, pageSize = 20, customerId, status } = request.query as {
      page?: number; pageSize?: number; customerId?: string; status?: string;
    };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({ where, skip, take: pageSize, include: { product: { select: { name: true, code: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.loan.count({ where }),
    ]);
    return reply.send(paginate(loans, total, page, pageSize));
  });

  // POST /fineract-provider/api/v1/loans/:loanId?command=approve  — Loan approval state machine
  app.post('/:loanId/approve', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { loanId } = request.params as { loanId: string };
    try {
      const loan = await loanSvc.approveLoan(loanId, (request as any).jwtPayload.sub);
      return reply.send(success(loan));
    } catch (err: any) {
      return reply.status(400).send(failure('APPROVAL_ERROR', err.message));
    }
  });

  // POST /fineract-provider/api/v1/loans/:loanId?command=reject
  app.post('/:loanId/reject', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { loanId } = request.params as { loanId: string };
    const { reason } = request.body as { reason: string };

    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan || loan.status !== 'SUBMITTED') return reply.status(400).send(failure('INVALID_STATE', 'Loan cannot be rejected in current state'));

    await prisma.loan.update({ where: { id: loanId }, data: { status: 'REJECTED', rejectionReason: reason } });
    return reply.send(success({ loanId, status: 'REJECTED' }));
  });

  // POST /fineract-provider/api/v1/loans/:loanId?command=disburse
  app.post('/:loanId/disburse', { preHandler: [requireAuth, requireRole('SUPER_ADMIN', 'LOAN_OFFICER')] }, async (request, reply) => {
    const { loanId } = request.params as { loanId: string };
    const { disbursementAccountId } = request.body as { disbursementAccountId: string };
    try {
      const loan = await loanSvc.disburseLoan(loanId, disbursementAccountId);
      return reply.send(success(loan));
    } catch (err: any) {
      return reply.status(400).send(failure('DISBURSEMENT_ERROR', err.message));
    }
  });

  // POST /fineract-provider/api/v1/loans/:loanId/transactions?command=repayment
  app.post('/:loanId/transactions', { preHandler: [requireAuth] }, async (request, reply) => {
    const { loanId } = request.params as { loanId: string };
    const body = RepaymentSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid repayment data'));

    try {
      const result = await loanSvc.processRepayment(loanId, body.data.amount, body.data.fromAccountId);
      return reply.send(success(result));
    } catch (err: any) {
      return reply.status(400).send(failure('REPAYMENT_ERROR', err.message));
    }
  });

  // GET /v1/loan-products
  app.get('/products', { preHandler: [requireAuth] }, async (request, reply) => {
    const products = await prisma.loanProduct.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    return reply.send(success(products));
  });
}
