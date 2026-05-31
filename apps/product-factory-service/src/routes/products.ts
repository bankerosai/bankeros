import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@bankeros/database';
import { requireAuth, requireRole } from '@bankeros/shared-utils/src/auth';
import { success, failure, paginate, toDecimal } from '@bankeros/shared-utils';

// Extended loan product schema — the "product factory" allows no-code configuration
const LoanProductSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9_]+$/),
  name: z.string().min(3),
  type: z.enum(['PERSONAL', 'MORTGAGE', 'SME', 'CORPORATE', 'SYNDICATED', 'TRADE_FINANCE']),
  currency: z.string().length(3),
  minAmount: z.string(),
  maxAmount: z.string(),
  minTermMonths: z.number().int().positive(),
  maxTermMonths: z.number().int().positive(),
  nominalInterestRate: z.string(),  // Decimal string e.g. "0.089" = 8.9% p.a.
  penaltyRate: z.string().default('0'),
  gracePeriodDays: z.number().int().min(0).default(0),
  repaymentFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY', 'BULLET']),
  // Product Factory extended fields
  feeStructure: z.object({
    originationFeeRate: z.string().default('0'),    // % of principal
    earlyRepaymentPenaltyRate: z.string().default('0'),
    lateFeeFixed: z.string().default('0'),
    annualManagementFeeRate: z.string().default('0'),
  }).optional(),
  eligibilityCriteria: z.object({
    minKycLevel: z.enum(['SIMPLIFIED', 'STANDARD', 'ENHANCED']).default('STANDARD'),
    minCustomerAgeDays: z.number().default(0),      // Days since account opened
    maxDti: z.string().optional(),                  // Max debt-to-income ratio
    allowedCustomerTypes: z.array(z.string()).default(['INDIVIDUAL', 'CORPORATE']),
  }).optional(),
  isActive: z.boolean().default(true),
});

const UpdateProductSchema = LoanProductSchema.partial().omit({ code: true });

export async function productRoutes(app: FastifyInstance) {
  // POST /v1/product-factory/loan-products  — Create product (Module 11)
  app.post('/loan-products', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const body = LoanProductSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid product configuration', body.error.flatten()));

    const d = body.data;

    const existing = await prisma.loanProduct.findUnique({ where: { code: d.code } });
    if (existing) return reply.status(409).send(failure('DUPLICATE_CODE', `Product code '${d.code}' already exists`));

    // Validate rate logic
    if (toDecimal(d.nominalInterestRate).gte(1)) {
      return reply.status(422).send(failure('INVALID_RATE', 'Nominal interest rate must be expressed as decimal (e.g., 0.089 for 8.9%)'));
    }

    const product = await prisma.loanProduct.create({
      data: {
        code: d.code,
        name: d.name,
        type: d.type,
        currency: d.currency,
        minAmount: d.minAmount,
        maxAmount: d.maxAmount,
        minTermMonths: d.minTermMonths,
        maxTermMonths: d.maxTermMonths,
        nominalInterestRate: d.nominalInterestRate,
        penaltyRate: d.penaltyRate,
        gracePeriodDays: d.gracePeriodDays,
        repaymentFrequency: d.repaymentFrequency,
        isActive: d.isActive,
      },
    });

    return reply.status(201).send(success({
      ...product,
      feeStructure: d.feeStructure,
      eligibilityCriteria: d.eligibilityCriteria,
    }));
  });

  // GET /v1/product-factory/loan-products  — List all products
  app.get('/loan-products', { preHandler: [requireAuth] }, async (request, reply) => {
    const { page = 1, pageSize = 20, type, isActive } = request.query as {
      page?: number; pageSize?: number; type?: string; isActive?: string;
    };
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [products, total] = await Promise.all([
      prisma.loanProduct.findMany({ where, skip, take: pageSize, orderBy: { name: 'asc' } }),
      prisma.loanProduct.count({ where }),
    ]);

    return reply.send(paginate(products, total, page, pageSize));
  });

  // GET /v1/product-factory/products/:productId/formulas  — Fetch calculation formulas (Module 11)
  app.get('/products/:productId/formulas', { preHandler: [requireAuth] }, async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const product = await prisma.loanProduct.findUnique({ where: { id: productId } });
    if (!product) return reply.status(404).send(failure('NOT_FOUND', 'Product not found'));

    const rate = toDecimal(product.nominalInterestRate.toString());
    const monthlyRate = rate.dividedBy(12);

    return reply.send(success({
      productId,
      code: product.code,
      formulas: {
        emiFormula: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1)',
        variables: { P: 'Principal', r: `Monthly rate = ${monthlyRate.toFixed(8)} (${rate.times(100).toFixed(4)}% p.a. ÷ 12)`, n: 'Term in months' },
        interestAccrualMethod: 'ACTUAL/365',
        penaltyCalculation: `Overdue principal × ${product.penaltyRate} × overdue days / 365`,
        gracePeriodDays: product.gracePeriodDays,
        repaymentFrequency: product.repaymentFrequency,
        exampleEmi: {
          description: 'Sample EMI for min principal over min term',
          principal: product.minAmount.toString(),
          termMonths: product.minTermMonths,
          monthlyRate: monthlyRate.toFixed(8),
        },
      },
    }));
  });

  // PATCH /v1/product-factory/loan-products/:productId  — Update product
  app.patch('/loan-products/:productId', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const body = UpdateProductSchema.safeParse(request.body);
    if (!body.success) return reply.status(422).send(failure('VALIDATION_ERROR', 'Invalid update data'));

    const product = await prisma.loanProduct.update({ where: { id: productId }, data: body.data as any });
    return reply.send(success(product));
  });

  // POST /v1/product-factory/loan-products/:productId/deactivate
  app.post('/loan-products/:productId/deactivate', { preHandler: [requireAuth, requireRole('SUPER_ADMIN')] }, async (request, reply) => {
    const { productId } = request.params as { productId: string };
    const product = await prisma.loanProduct.update({ where: { id: productId }, data: { isActive: false } });
    return reply.send(success({ id: product.id, isActive: product.isActive, message: 'Product deactivated. Existing loans are unaffected.' }));
  });
}
