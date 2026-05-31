# BankerOS — Open Source Digital Banking Platform

## Architecture Overview

**Monorepo** with pnpm workspaces. All services are independent Node.js/TypeScript microservices.

## Service Map

| Port | Service | Module |
|------|---------|--------|
| 3000 | API Gateway | Routing, JWT validation, Swagger UI |
| 3001 | IAM Service | Module 10 — Auth, Users, MFA, Audit logs |
| 3002 | GL Service | Module 5 — Double-entry accounting, Trial balance |
| 3003 | Onboarding Service | Module 1 — KYC, Customer CIF, Open Banking AIS |
| 3004 | Lending Service | Module 2 — Loans, Amortization (Fineract API) |
| 3005 | Payments Service | Module 3 — ISO 20022, Fraud scoring, PIS |
| 3006 | Compliance Service | Module 9 — AML, Sanctions screening, STR |
| 3007 | Trade Finance Service | Module 4 — LC, Bank Guarantees |
| 3008 | Wealth Service | Module 6 — Portfolios, Robo-advisor |
| 3009 | Liquidity Service | Module 7 — Cash pools, Sweeping |
| 3010 | Batch Service | Module 14 — EOD, Interest accrual, Cron |

## Shared Packages

- `@bankeros/shared-types` — All domain enums and interfaces
- `@bankeros/shared-utils` — Decimal math, amortization engine, ID generators, Kafka helpers
- `@bankeros/database` — Prisma client + schema (single source of truth)

## Key Conventions

- **Never use floating point for money** — always `Decimal.js` and `Decimal(28,8)` in Postgres
- **Double-entry is enforced** — `assertDebitsEqualCredits()` must pass before any GL post
- **All amounts stored as strings** in API payloads, numeric in DB
- JWT validation happens at API Gateway; downstream services trust `x-user-id` / `x-user-role` headers
- Kafka topics: `bankeros.{domain}.events` for all cross-service event publishing
- Correlation ID flows from API Gateway through all services via `x-correlation-id` header

## Development Setup

```bash
# 1. Start infrastructure
docker-compose up -d postgres redis zookeeper kafka

# 2. Install dependencies
pnpm install

# 3. Set up database
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 4. Start all services
pnpm dev
```

## API Documentation

Swagger UI available at: `http://localhost:3000/documentation`

## Standards Compliance

- Open Banking: `/open-banking/v3.1/aisp/*` and `/open-banking/v3.1/pisp/*`
- ISO 20022: pain.001, pain.002, camt.053 mappings in Payments Service
- Apache Fineract: `/fineract-provider/api/v1/loans` compatible API
- BIAN: Service domains aligned with BIAN v12 service landscape
