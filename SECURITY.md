# Security Policy

BankerOS handles financial data. Security is mandatory, not optional.

## Reporting Vulnerabilities

Email **security@bankeros.io** with:
- Description of the vulnerability
- Steps to reproduce
- Affected components (services / versions)
- Suggested mitigation if known

We aim to respond within 48 hours and patch critical issues within 7 days.

**Do not** open public GitHub issues for security vulnerabilities.

## Threat Model

### In Scope
- Code in this repository
- Configuration files (Dockerfiles, Helm charts)
- Documentation that gives security guidance

### Out of Scope
- Third-party dependencies (report to upstream)
- User-managed deployments (Kubernetes RBAC, network policies)
- Social engineering against operators

## Security Controls

### Authentication & Authorization
- JWT (HS256) with 1-hour expiry + 7-day refresh tokens
- TOTP-based MFA (RFC 6238) for privileged accounts
- All refresh tokens stored hashed in DB with revocation support
- Role-based access control (RBAC) on every privileged endpoint

### Data at Rest
- Passwords hashed with bcrypt cost factor 12+
- Database connection over TLS in production
- Secrets injected via Kubernetes Secret (sealed-secrets recommended)
- All amounts stored as `Decimal(28,8)` — no precision loss

### Data in Transit
- HTTPS only (TLS 1.3) for external traffic
- MTLS for service-to-service communication (production)
- FAPI 1.0 Advanced profile for Open Banking endpoints

### Audit & Compliance
- Every privileged action logged to `audit_logs` table (immutable)
- Correlation ID propagated across all service calls (`x-correlation-id`)
- Audit logs queryable by AUDITOR / COMPLIANCE_OFFICER roles only

### Input Validation
- All API requests validated with Zod schemas at the route level
- SQL injection prevented by Prisma parameterized queries
- XSS mitigated by React's default escaping + CSP headers

### Financial Integrity
- Double-entry posting enforced at the service layer (`assertDebitsEqualCredits`)
- No floating-point for money — `Decimal.js` everywhere
- Account balance updates within `prisma.$transaction` blocks
- Idempotency check on EOD batch jobs (prevents double-run)

### Rate Limiting & DoS Protection
- 200 req/min per user at API Gateway
- Per-IP fallback for unauthenticated traffic
- Fraud scoring throttles high-velocity payment attempts

### Dependency Management
- Dependabot enabled on `package.json` and `Dockerfile`
- `npm audit` runs in CI on every PR
- No `unsafe-eval` or `unsafe-inline` in CSP

## Hardening Checklist (Production)

- [ ] Replace all default secrets (JWT_SECRET, encryption keys)
- [ ] Enable sealed-secrets or external-secrets-operator
- [ ] Configure NetworkPolicies (deny-all default)
- [ ] Enable Pod Security Standards (`restricted` profile)
- [ ] Use a managed PostgreSQL with at-rest encryption
- [ ] Configure log aggregation to immutable storage
- [ ] Set up alerts via Alertmanager → PagerDuty
- [ ] Enable WAF on ingress (CloudFront, Cloudflare, etc.)
- [ ] Schedule penetration testing annually
- [ ] Maintain ISO 27001 / SOC 2 controls evidence
