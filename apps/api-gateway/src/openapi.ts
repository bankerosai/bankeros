/**
 * Complete OpenAPI 3.1 specification for BankerOS.
 * Covers all 17 microservices with request/response schemas,
 * security definitions, and example payloads.
 */

export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'BankerOS API',
    description: 'Open Source Digital Banking Platform — covers Open Banking v3.1, ISO 20022, Apache Fineract, BIAN v12.',
    version: '1.0.0',
    contact: { name: 'BankerOS', url: 'https://github.com/bankeros' },
    license: { name: 'Apache 2.0' },
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local development' },
    { url: 'https://api.staging.bankeros.io', description: 'Staging' },
    { url: 'https://api.bankeros.io', description: 'Production' },
  ],
  tags: [
    { name: 'IAM',           description: 'Module 10 — Auth, MFA, RBAC, audit logs' },
    { name: 'Onboarding',    description: 'Module 1 — Digital onboarding, KYC, Open Banking AIS' },
    { name: 'Lending',       description: 'Module 2 — Loans (Apache Fineract API)' },
    { name: 'Syndication',   description: 'Module 12 — Credit facilities & syndicated lending' },
    { name: 'Products',      description: 'Module 11 — Product factory (no-code configuration)' },
    { name: 'Payments',      description: 'Module 3 — ISO 20022 pain.001/002, camt.053' },
    { name: 'Trade Finance', description: 'Module 4 — L/C, bank guarantees' },
    { name: 'Wealth',        description: 'Module 6 — Portfolios, robo-advisor' },
    { name: 'Markets',       description: 'Module 8 — FX quotes & trading' },
    { name: 'Liquidity',     description: 'Module 7 — Cash pools, sweeping, notional pooling' },
    { name: 'Digital Assets',description: 'Module 18 — Custody, tokenization, CBDC' },
    { name: 'GL',            description: 'Module 5 — Double-entry accounting' },
    { name: 'Compliance',    description: 'Module 9 — AML, sanctions, fraud scoring' },
    { name: 'Batch',         description: 'Module 14 — EOD, regulatory reports' },
    { name: 'Middle Office', description: 'Module 16 — Reconciliation, document management' },
    { name: 'Open Banking',  description: 'Module 13 / 17 — AISP / PISP / BaaS' },
    { name: 'CDP',           description: 'Module 15 — Customer 360° analytics' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Money: {
        type: 'object',
        properties: {
          amount: { type: 'string', pattern: '^\\d+(\\.\\d{1,2})?$', example: '1000.00' },
          currency: { type: 'string', minLength: 3, maxLength: 3, example: 'USD' },
        },
        required: ['amount', 'currency'],
      },
      ApiSuccess: {
        type: 'object',
        properties: { success: { const: true }, data: { type: 'object' } },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { const: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string' },
              details: { type: 'object' },
            },
          },
        },
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          cifNumber: { type: 'string', example: 'CIF2024001' },
          type: { type: 'string', enum: ['INDIVIDUAL', 'CORPORATE'] },
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          kycStatus: { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'] },
          riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'PROHIBITED'] },
        },
      },
      Loan: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          loanNumber: { type: 'string', example: 'LN8834920011' },
          customerId: { type: 'string', format: 'uuid' },
          principalAmount: { type: 'string', example: '50000.00' },
          outstandingBalance: { type: 'string' },
          currency: { type: 'string' },
          interestRate: { type: 'string' },
          termMonths: { type: 'integer' },
          status: { type: 'string', enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ACTIVE', 'OVERDUE', 'WRITTEN_OFF', 'SETTLED'] },
        },
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          paymentReference: { type: 'string' },
          debtorAccountId: { type: 'string', format: 'uuid' },
          creditorAccountNumber: { type: 'string' },
          amount: { type: 'string' },
          currency: { type: 'string' },
          network: { type: 'string', enum: ['INTERNAL', 'ACH', 'RTGS', 'SWIFT', 'SEPA', 'FASTER_PAYMENTS', 'CBDC'] },
          status: { type: 'string', enum: ['INITIATED', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED'] },
          fraudScore: { type: 'string' },
        },
      },
      JournalEntry: {
        type: 'object',
        properties: {
          referenceId: { type: 'string' },
          referenceType: { type: 'string', example: 'PAYMENT' },
          businessDate: { type: 'string', format: 'date', example: '2024-05-30' },
          lines: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                accountCode: { type: 'string', example: '1000' },
                type: { type: 'string', enum: ['DEBIT', 'CREDIT'] },
                amount: { type: 'string', example: '50000.00' },
                currency: { type: 'string', example: 'USD' },
              },
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/v1/iam/auth/tokens': {
      post: {
        tags: ['IAM'],
        summary: 'Login (OAuth 2.0 Password Grant)',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  totpCode: { type: 'string', minLength: 6, maxLength: 6 },
                },
                required: ['email', 'password'],
              },
              example: { email: 'admin@bankeros.io', password: 'Admin@BankerOS2024!' },
            },
          },
        },
        responses: {
          200: {
            description: 'Tokens issued',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } },
          },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
        },
      },
    },
    '/v1/customers/onboarding': {
      post: {
        tags: ['Onboarding'],
        summary: 'Open new customer (KYC) — Module 1',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['INDIVIDUAL', 'CORPORATE'] },
                  fullName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  address: { type: 'object' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Customer created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Customer' } } } } },
      },
    },
    '/fineract-provider/api/v1/loans': {
      post: {
        tags: ['Lending'],
        summary: 'Submit loan application (Module 2)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customerId: { type: 'string', format: 'uuid' },
                  productId: { type: 'string', format: 'uuid' },
                  principalAmount: { type: 'string' },
                  termMonths: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Loan application created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Loan' } } } } },
      },
    },
    '/v1/payments/initiate': {
      post: {
        tags: ['Payments'],
        summary: 'Initiate payment (auto-routes to network)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  debtorAccountId: { type: 'string', format: 'uuid' },
                  creditorAccountNumber: { type: 'string' },
                  creditorName: { type: 'string' },
                  creditorBankBic: { type: 'string' },
                  amount: { type: 'string' },
                  currency: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Payment initiated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Payment' } } } } },
      },
    },
    '/v1/payments/cross-border/initiate': {
      post: {
        tags: ['Payments'],
        summary: 'Cross-border ISO 20022 pain.001',
        responses: { 201: { description: 'Cross-border payment initiated' } },
      },
    },
    '/v1/payments/{paymentId}/status': {
      get: {
        tags: ['Payments'],
        summary: 'Payment status (ISO 20022 pain.002)',
        parameters: [{ name: 'paymentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Payment status' } },
      },
    },
    '/v1/gl/journal-entries': {
      post: {
        tags: ['GL'],
        summary: 'Post double-entry journal (Module 5)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/JournalEntry' } } },
        },
        responses: { 201: { description: 'Journal posted' }, 400: { description: 'Unbalanced journal' } },
      },
    },
    '/v1/gl/trial-balance': {
      get: {
        tags: ['GL'],
        summary: 'Trial balance report',
        parameters: [{ name: 'date', in: 'query', schema: { type: 'string', format: 'date' } }],
        responses: { 200: { description: 'Trial balance with debit/credit totals per account' } },
      },
    },
    '/v3/trade-finance/import-lc/applications': {
      post: {
        tags: ['Trade Finance'],
        summary: 'Open import letter of credit (Module 4)',
        responses: { 201: { description: 'L/C application created' } },
      },
    },
    '/v1/markets/fx/quotes': {
      get: {
        tags: ['Markets'],
        summary: 'Get FX quote (Bid/Ask)',
        parameters: [
          { name: 'base', in: 'query', required: true, schema: { type: 'string', example: 'EUR' } },
          { name: 'quote', in: 'query', required: true, schema: { type: 'string', example: 'USD' } },
        ],
        responses: { 200: { description: 'Live FX quote with 30s validity' } },
      },
    },
    '/v1/markets/fx/trades': {
      post: {
        tags: ['Markets'],
        summary: 'Execute spot/forward FX trade',
        responses: { 201: { description: 'Trade confirmation' } },
      },
    },
    '/v1/wealth/advisory/proposals': {
      post: {
        tags: ['Wealth'],
        summary: 'Generate robo-advisory portfolio proposal',
        responses: { 200: { description: 'Asset allocation recommendation' } },
      },
    },
    '/v1/liquidity/cash-pools/{poolId}/sweep': {
      post: {
        tags: ['Liquidity'],
        summary: 'Trigger cash pool sweep (Module 7)',
        parameters: [{ name: 'poolId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Sweep executed, details of fund movement' } },
      },
    },
    '/v1/digital-assets/wallets/transactions/transfer': {
      post: {
        tags: ['Digital Assets'],
        summary: 'On-chain transfer with Travel Rule compliance',
        responses: { 201: { description: 'Transaction broadcast to DLT' } },
      },
    },
    '/v1/compliance/kyc/screenings': {
      post: {
        tags: ['Compliance'],
        summary: 'Sanctions & PEP screening',
        responses: { 200: { description: 'Screening result with risk score and lists checked' } },
      },
    },
    '/v1/risk/transactions/evaluate': {
      post: {
        tags: ['Compliance'],
        summary: 'Real-time fraud scoring engine',
        responses: { 200: { description: 'Fraud score (0-1), decision (PASS/REVIEW/BLOCK)' } },
      },
    },
    '/v1/batch-jobs/eod/execute': {
      post: {
        tags: ['Batch'],
        summary: 'Trigger EOD batch (interest accrual, overdue, FX revaluation)',
        responses: { 202: { description: 'Batch job queued' } },
      },
    },
    '/v1/reporting/regulatory/{reportCode}/generate': {
      get: {
        tags: ['Batch'],
        summary: 'Generate regulatory report (Basel III, BCBS239)',
        parameters: [{ name: 'reportCode', in: 'path', required: true, schema: { type: 'string', enum: ['BALANCE_SHEET', 'LIQUIDITY_RATIO', 'CAPITAL_ADEQUACY', 'PAYMENT_VOLUME', 'AML_SUMMARY', 'LOAN_PORTFOLIO'] } }],
        responses: { 200: { description: 'Report data' } },
      },
    },
    '/open-banking/v3.1/aisp/accounts/{AccountId}': {
      get: {
        tags: ['Open Banking'],
        summary: 'AISP — Account info (Open Banking v3.1)',
        parameters: [{ name: 'AccountId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Account details per OB spec' } },
      },
    },
    '/open-banking/v3.1/pisp/domestic-payment-consents': {
      post: {
        tags: ['Open Banking'],
        summary: 'PISP — Create domestic payment consent',
        responses: { 201: { description: 'Consent created, awaiting customer authorisation' } },
      },
    },
    '/v1/insights/customers/{customerId}/profile': {
      get: {
        tags: ['CDP'],
        summary: 'Customer 360° view with ML scores',
        parameters: [{ name: 'customerId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Full customer profile + churn/credit/cross-sell scores' } },
      },
    },
    '/v1/audit/logs': {
      get: {
        tags: ['IAM'],
        summary: 'Immutable audit trail query (Module 10)',
        parameters: [
          { name: 'actorId', in: 'query', schema: { type: 'string' } },
          { name: 'resource', in: 'query', schema: { type: 'string' } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: { 200: { description: 'Paginated audit log entries' } },
      },
    },
  },
};
