import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate } from '@bankeros/shared-utils';
import { PaymentService } from '../services/payment.service';

const paymentSvc = new PaymentService();

const InitiatePaymentSchema = z.object({
  debtorAccountId: z.string().uuid(),
  creditorAccountNumber: z.string().min(5),
  creditorName: z.string().min(2),
  creditorBankBic: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3),
  purposeCode: z.string().optional(),
  remittanceInfo: z.string().max(140).optional(),
});

// ISO 20022 pain.001 schema
const CrossBorderPaymentSchema = z.object({
  debtorAccountId: z.string().uuid(),
  creditorIban: z.string().optional(),
  creditorAccountNumber: z.string(),
  creditorName: z.string(),
  creditorBankBic: z.string(),
  amount: z.string(),
  currency: z.string().length(3),
  purposeCode: z.string().optional(),
  remittanceInformation: z.string().optional(),
  // ISO 20022 pain.001 fields
  endToEndId: z.string().optional(),
  categoryPurpose: z.string().optional(),
});

export async function paymentRoutes(app: FastifyInstance) {
  // POST /v1/payments/initiate  — Domestic payment
  app.post('/initiate', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = InitiatePaymentSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid payment data', body.error.flatten()));

    try {
      const payment = await paymentSvc.initiatePayment({
        ...body.data,
        correlationId: request.id as string,
      });

      // Auto-settle internal payments synchronously
      if (payment.network === 'INTERNAL') {
        const settled = await paymentSvc.settleInternalPayment(payment.id);
        return reply.status(201).send(success(settled));
      }

      return reply.status(201).send(success(payment));
    } catch (err: any) {
      const statusCode = err.message.includes('blocked') ? 422 : 400;
      return reply.status(statusCode).send(failure('PAYMENT_ERROR', err.message));
    }
  });

  // POST /v1/payments/cross-border/initiate  — ISO 20022 pain.001 cross-border payment (Module 3)
  app.post('/cross-border/initiate', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = CrossBorderPaymentSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid cross-border payment data'));

    try {
      const payment = await paymentSvc.initiatePayment({
        debtorAccountId: body.data.debtorAccountId,
        creditorAccountNumber: body.data.creditorAccountNumber,
        creditorName: body.data.creditorName,
        creditorBankBic: body.data.creditorBankBic,
        amount: body.data.amount,
        currency: body.data.currency,
        purposeCode: body.data.purposeCode,
        remittanceInfo: body.data.remittanceInformation,
        correlationId: request.id as string,
      });

      return reply.status(201).send(success({
        ...payment,
        iso20022: {
          msgId: `BANKEROS${Date.now()}`,
          creDtTm: new Date().toISOString(),
          nbOfTxs: 1,
          ctrlSum: body.data.amount,
          pmtInfId: payment.paymentReference,
          endToEndId: body.data.endToEndId,
        },
      }));
    } catch (err: any) {
      return reply.status(400).send(failure('PAYMENT_ERROR', err.message));
    }
  });

  // GET /v1/payments/:paymentId/status  — pain.002 status (Module 3)
  app.get('/:paymentId/status', { preHandler: [requireAuth] }, async (request, reply) => {
    const { paymentId } = request.params as { paymentId: string };
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return reply.status(404).send(failure('NOT_FOUND', 'Payment not found'));

    return reply.send(success({
      paymentId: payment.id,
      paymentReference: payment.paymentReference,
      status: payment.status,
      network: payment.network,
      amount: payment.amount.toString(),
      currency: payment.currency,
      instructedAt: payment.instructedAt,
      completedAt: payment.completedAt,
      failureReason: payment.failureReason,
      // pain.002 mapping
      iso20022StatusCode: mapToIso20022Status(payment.status),
    }));
  });

  // GET /v1/payments — List payments
  app.get('/', { preHandler: [requireAuth] }, async (request, reply) => {
    const { page = 1, pageSize = 20, accountId, status } = request.query as {
      page?: number; pageSize?: number; accountId?: string; status?: string;
    };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (accountId) where.debtorAccountId = accountId;
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, skip, take: pageSize, orderBy: { instructedAt: 'desc' } }),
      prisma.payment.count({ where }),
    ]);
    return reply.send(paginate(payments, total, page, pageSize));
  });

  // GET /v1/accounts/:accountId/statements/camt053  — ISO 20022 camt.053 statement (Module 3)
  app.get('/accounts/:accountId/statements/camt053', { preHandler: [requireAuth] }, async (request, reply) => {
    const { accountId } = request.params as { accountId: string };
    const { from, to } = request.query as { from?: string; to?: string };

    const account = await prisma.account.findUnique({ where: { id: accountId } });
    if (!account) return reply.status(404).send(failure('NOT_FOUND', 'Account not found'));

    const transactions = await prisma.accountTransaction.findMany({
      where: {
        accountId,
        bookingDate: {
          gte: from ? new Date(from) : new Date(Date.now() - 30 * 86400 * 1000),
          lte: to ? new Date(to) : new Date(),
        },
      },
      orderBy: { bookingDate: 'desc' },
    });

    // camt.053 Bank-to-Customer Statement mapping
    const statement = {
      msgId: `STMT${Date.now()}`,
      creDtTm: new Date().toISOString(),
      iban: account.accountNumber,
      currency: account.currency,
      openingBalance: transactions.length > 0 ? transactions[transactions.length - 1].balanceBefore.toString() : account.balance.toString(),
      closingBalance: account.balance.toString(),
      transactions: transactions.map((t) => ({
        entryRef: t.id,
        bookingDate: t.bookingDate,
        valueDate: t.valueDate,
        amount: t.amount.toString(),
        creditDebitIndicator: t.type,
        status: 'BOOK',
        remittanceInfo: t.description,
        referenceId: t.referenceId,
        referenceType: t.referenceType,
      })),
    };

    return reply.send(success(statement));
  });

  // Open Banking PIS: POST /open-banking/v3.1/pisp/domestic-payment-consents (Module 13)
  app.post('/open-banking/payment-consents', { preHandler: [requireAuth] }, async (request, reply) => {
    const { debtorAccountId, amount, currency, creditorAccountNumber, creditorName } = request.body as any;
    const consentToken = `CONSENT_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    return reply.status(201).send(success({
      consentId: consentToken,
      status: 'AwaitingAuthorisation',
      expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
      payment: { debtorAccountId, amount, currency, creditorAccountNumber, creditorName },
    }));
  });
}

function mapToIso20022Status(status: string): string {
  const map: Record<string, string> = {
    INITIATED: 'RCVD',
    PENDING: 'PDNG',
    PROCESSING: 'ACCP',
    COMPLETED: 'ACSC',
    FAILED: 'RJCT',
    CANCELLED: 'CANC',
    REVERSED: 'REVD',
  };
  return map[status] ?? 'UNKN';
}
