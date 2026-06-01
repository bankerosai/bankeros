# BankerOS

> Open Source Digital Banking Platform — covers Open Banking v3.1, ISO 20022, Apache Fineract, BIAN v12.

[![CI](https://img.shields.io/badge/CI-passing-success)](.github/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-20-green)](https://nodejs.org/)

BankerOS 是一个生产级的开源数字银行核心平台，覆盖 PRD 中 20 个核心模块，由 17 个独立 Fastify 微服务 + React 管理后台组成。所有金融计算严格遵循 Decimal.js（绝不使用浮点），双记账强制校验。

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  React Admin Dashboard (port 5200)  ◄──── nginx + Vite + Recharts   │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  API Gateway (port 3000)  ─  JWT validation, Swagger UI, rate limit │
└──────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────┬─────────────────┬─────────────────┬───────────────┐
│  IAM (3001)     │  GL (3002)      │  Onboarding     │  Lending      │
│  Payments (3005)│  Compliance     │  Trade Finance  │  Wealth       │
│  Liquidity      │  Batch          │  Markets        │  Product Fac. │
│  Syndication    │  CDP            │  Digital Assets │  Middle Office│
└────────┬────────┴────────┬────────┴────────┬────────┴───────┬───────┘
         │                 │                 │                │
    ┌────▼─────────────────▼─────────────────▼────┐  ┌────────▼───────┐
    │  PostgreSQL 16 (Prisma) — single source     │  │  Kafka 3-node  │
    │  Tables: customers, accounts, loans, gl,    │  │  Event bus     │
    │          payments, lc, portfolios, etc.     │  │  (bankeros.*)  │
    └────────────────────────┬────────────────────┘  └────────────────┘
                             │
                        ┌────▼────┐
                        │ Redis   │  Session, BullMQ queues, cache
                        └─────────┘
```

## 🚀 Quick Start

```bash
# 1. Bring up infrastructure (postgres, redis, kafka)
make db-up

# 2. Install deps + migrate + seed
make install
make db-migrate
make db-seed

# 3. Start all services
make dev

# Then open:
#   http://localhost:5200          (Admin Dashboard)
#   http://localhost:3000/documentation  (Swagger UI)
```

### Demo credentials

| Field | Value |
|-------|-------|
| Email | `admin@bankeros.io` |
| Password | `Admin@BankerOS2024!` |

## 📦 Service Map

| Port | Service | Module | Description |
|------|---------|--------|-------------|
| 3000 | API Gateway | — | JWT routing, Swagger UI, rate-limit |
| 3001 | IAM | 10 | Auth, MFA TOTP, RBAC, audit logs |
| 3002 | GL | 5 | Double-entry, trial balance, EOD trigger |
| 3003 | Onboarding | 1 | KYC, sanctions screening, Open Banking AIS |
| 3004 | Lending | 2 | Loans (Fineract-compatible), amortization |
| 3005 | Payments | 3 | ISO 20022 pain.001/002/camt.053, fraud scoring |
| 3006 | Compliance | 9 | AML, sanctions, fraud ML, SAR workflow |
| 3007 | Trade Finance | 4 | L/C lifecycle, bank guarantees, SWIFT MT700 |
| 3008 | Wealth | 6 | Portfolios, robo-advisor, order execution |
| 3009 | Liquidity | 7 | Cash pools, sweeping, notional pooling |
| 3010 | Batch | 14 | EOD cron, interest accrual, regulatory reports |
| 3011 | Markets | 8 | FX WebSocket streaming, spot/forward trades |
| 3012 | Product Factory | 11 | No-code loan product configuration |
| 3013 | Syndication | 12 | Syndicated lending, pro-rata distribution |
| 3014 | CDP | 15 | Customer 360°, ML scoring, event ingestion |
| 3015 | Digital Assets | 18 | HSM wallets, tokenization, mBridge CBDC |
| 3016 | Middle Office | 16 | Reconciliation, exception workflow, documents |
| 5200 | Admin Dashboard | UI | React + Recharts + Zustand |

## 🎯 Standards Compliance

| Standard | Coverage |
|----------|----------|
| **Open Banking UK v3.1 / PSD2** | `/open-banking/v3.1/aisp/*` and `/open-banking/v3.1/pisp/*` |
| **ISO 20022** | `pain.001`, `pain.002`, `camt.053` in Payments Service |
| **Apache Fineract API** | `/fineract-provider/api/v1/loans` compatibility |
| **BIAN v12** | Service domains aligned to BIAN landscape |
| **Basel III / BCBS239** | LCR, Capital Adequacy, regulatory reporting |
| **FATF Travel Rule** | Digital Assets cross-border transfers |
| **FAPI 1.0 Advanced** | API security profile for Open Banking |

## 🤖 Banker Copilot (Claude plugin)

A companion Claude plugin lives at [`apps/banker-copilot/`](apps/banker-copilot/). Modeled on Anthropic's [`financial-services`](https://github.com/anthropics/financial-services) plugin format, but inverted: instead of analyst tools for external research, it gives **bank employees** skills that draft the artefacts they actually produce — credit memos, KYC opinions, NPL explainers, CEO board briefs, customer 360 views, FX hedging proposals.

| Skill | Audience | Slash command |
|-------|----------|---------------|
| credit-memo | Credit Officer / RM | `/credit-memo <APP-ID>` |
| kyc-review | Compliance Officer | `/kyc-review <CIF>` |
| npl-explain | CRO / Risk Analyst | `/npl-explain --period <range>` |
| ceo-brief | CEO / Board | `/ceo-brief --audience board` |
| customer-360 | RM / CRO / Service | `/customer-360 <CIF>` |
| fx-hedging-advisor | Treasury Sales | `/fx-hedge <CIF> --horizon <range>` |

All skills are read-only and human-decides-final. See [`apps/banker-copilot/README.md`](apps/banker-copilot/README.md) for install + worked examples.

## 🧪 Testing

```bash
make test                # All unit tests
make test-coverage       # With coverage report
make e2e                 # Playwright end-to-end
```

**Coverage highlights:**
- `shared-utils/financial.test.ts` — 52 tests for money arithmetic, double-entry, amortization
- `lending-service/loan.service.test.ts` — Repayment waterfall, state machine, EMI formula
- `payments-service/payment.service.test.ts` — Network routing, fraud scoring, ISO 20022 mapping
- `iam-service/auth.integration.test.ts` — Full Fastify integration with mocked Prisma
- `admin-dashboard/e2e/login.spec.ts` — Playwright: login + cross-module navigation

## 🛡 Key Conventions (DO NOT BREAK)

| Rule | Why |
|------|-----|
| **Never use float for money** — always `Decimal.js` and `Decimal(28,8)` in Postgres | Floating-point causes rounding errors (e.g., 0.1+0.2=0.30000000000000004) that compound to real losses |
| **Double-entry is enforced** — `assertDebitsEqualCredits()` must pass before any GL post | A bank that lets debits ≠ credits is not a bank |
| **All amounts stored as strings** in API payloads, numeric in DB | JSON numbers lose precision past 53 bits |
| **JWT validated at gateway only** — downstream services trust `x-user-id` / `x-user-role` headers | Single source of truth for auth |
| **Correlation ID flows everywhere** via `x-correlation-id` header | Mandatory for distributed tracing & SOX/BSA audits |
| **Kafka topics use namespaced format** — `bankeros.{domain}.events` | Schema versioning, consumer group isolation |

## 🐳 Docker / Kubernetes

```bash
make docker-up           # Full stack via docker-compose
make docker-down

# Kubernetes (Helm)
make helm-install        # Production deploy
make helm-install-staging
make helm-upgrade
make helm-uninstall
```

## 🤝 Contributing

Contributions welcome. Please ensure:

1. All financial logic has dedicated tests (target: 100% coverage on money/journal code)
2. Run `make typecheck && make test && make lint` before opening a PR
3. Add Kafka events for cross-service state changes (don't make direct HTTP calls between services unless absolutely necessary)
4. Add OpenAPI spec entries in `apps/api-gateway/src/openapi.ts` for new endpoints
5. Sign your commits

## 📜 License

Apache License 2.0
