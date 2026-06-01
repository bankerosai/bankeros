import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import httpProxy from '@fastify/http-proxy';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jwtVerify } from 'jose';
import { openApiSpec } from './openapi';

const app = Fastify({
  logger: { level: 'info', transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined },
  requestIdHeader: 'x-correlation-id',
  genReqId: () => require('uuid').v4(),
});

const SERVICES = {
  iam:            process.env.IAM_SERVICE_URL              || 'http://localhost:3001',
  gl:             process.env.GL_SERVICE_URL               || 'http://localhost:3002',
  onboarding:     process.env.ONBOARDING_SERVICE_URL       || 'http://localhost:3003',
  lending:        process.env.LENDING_SERVICE_URL          || 'http://localhost:3004',
  payments:       process.env.PAYMENTS_SERVICE_URL          || 'http://localhost:3005',
  compliance:     process.env.COMPLIANCE_SERVICE_URL        || 'http://localhost:3006',
  tradeFinance:   process.env.TRADE_FINANCE_SERVICE_URL     || 'http://localhost:3007',
  wealth:         process.env.WEALTH_SERVICE_URL            || 'http://localhost:3008',
  liquidity:      process.env.LIQUIDITY_SERVICE_URL         || 'http://localhost:3009',
  batch:          process.env.BATCH_SERVICE_URL             || 'http://localhost:3010',
  markets:        process.env.MARKETS_SERVICE_URL           || 'http://localhost:3011',
  productFactory: process.env.PRODUCT_FACTORY_SERVICE_URL   || 'http://localhost:3012',
  syndication:    process.env.SYNDICATION_SERVICE_URL       || 'http://localhost:3013',
  cdp:            process.env.CDP_SERVICE_URL               || 'http://localhost:3014',
  digitalAssets:  process.env.DIGITAL_ASSETS_SERVICE_URL   || 'http://localhost:3015',
  middleOffice:   process.env.MIDDLE_OFFICE_SERVICE_URL     || 'http://localhost:3016',
  bankerCopilot:  process.env.BANKER_COPILOT_SERVICE_URL    || 'http://localhost:3017',
};

// Public routes that don't require JWT validation at the gateway level
const PUBLIC_PATHS = [
  '/v1/iam/auth/tokens',
  '/v1/iam/auth/refresh',
  '/health',
  '/documentation',
];

async function validateJwt(request: any, reply: any) {
  const isPublic = PUBLIC_PATHS.some((p) => request.url.startsWith(p));
  if (isPublic) return;

  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Bearer token required' } });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'change_me');
    const { payload } = await jwtVerify(header.slice(7), secret);
    request.jwtPayload = payload;
    // Forward user context to downstream services
    request.headers['x-user-id'] = payload.sub as string;
    request.headers['x-user-role'] = payload.role as string;
    request.headers['x-correlation-id'] = request.id;
  } catch {
    return reply.status(401).send({ success: false, error: { code: 'TOKEN_INVALID', message: 'Invalid or expired token' } });
  }
}

async function main() {
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, { origin: process.env.CORS_ORIGIN || '*' });
  await app.register(rateLimit, { max: 200, timeWindow: '1 minute', keyGenerator: (req) => (req as any).jwtPayload?.sub ?? req.ip });

  await app.register(swagger, { mode: 'static', specification: { document: openApiSpec as any } });
  await app.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      tryItOutEnabled: true,
      filter: true,
      persistAuthorization: true,
    },
  });

  app.addHook('preHandler', validateJwt);

  // ---- Route Proxies ----
  await app.register(httpProxy, { upstream: SERVICES.iam,          prefix: '/v1/iam',                    http2: false });
  await app.register(httpProxy, { upstream: SERVICES.gl,           prefix: '/v1/gl',                     http2: false });
  await app.register(httpProxy, { upstream: SERVICES.onboarding,   prefix: '/v1/customers',              http2: false });
  await app.register(httpProxy, { upstream: SERVICES.lending,      prefix: '/fineract-provider',         http2: false });
  await app.register(httpProxy, { upstream: SERVICES.payments,     prefix: '/v1/payments',               http2: false });
  await app.register(httpProxy, { upstream: SERVICES.compliance,   prefix: '/v1/compliance',             http2: false });
  await app.register(httpProxy, { upstream: SERVICES.compliance,   prefix: '/v1/risk',                   http2: false });
  await app.register(httpProxy, { upstream: SERVICES.tradeFinance, prefix: '/v3/trade-finance',          http2: false });
  await app.register(httpProxy, { upstream: SERVICES.wealth,       prefix: '/v1/wealth',                 http2: false });
  await app.register(httpProxy, { upstream: SERVICES.batch,          prefix: '/v1/batch-jobs',             http2: false });
  await app.register(httpProxy, { upstream: SERVICES.batch,          prefix: '/v1/reporting',              http2: false });
  await app.register(httpProxy, { upstream: SERVICES.gl,             prefix: '/v1/audit',                  http2: false });
  await app.register(httpProxy, { upstream: SERVICES.liquidity,      prefix: '/v1/liquidity',              http2: false });
  await app.register(httpProxy, { upstream: SERVICES.markets,        prefix: '/v1/markets',                http2: false });
  await app.register(httpProxy, { upstream: SERVICES.productFactory, prefix: '/v1/product-factory',       http2: false });
  await app.register(httpProxy, { upstream: SERVICES.syndication,    prefix: '/v1/lending/facilities',     http2: false });
  await app.register(httpProxy, { upstream: SERVICES.syndication,    prefix: '/v1/lending/syndication',    http2: false });
  await app.register(httpProxy, { upstream: SERVICES.cdp,            prefix: '/v1/insights',               http2: false });
  await app.register(httpProxy, { upstream: SERVICES.cdp,            prefix: '/v1/analytics',              http2: false });
  await app.register(httpProxy, { upstream: SERVICES.digitalAssets,  prefix: '/v1/digital-assets',         http2: false });
  await app.register(httpProxy, { upstream: SERVICES.middleOffice,   prefix: '/v1/middle-office',          http2: false });
  await app.register(httpProxy, { upstream: SERVICES.middleOffice,   prefix: '/v1/documents',              http2: false });

  // Banker Copilot — Claude-powered banker assistant
  await app.register(httpProxy, { upstream: SERVICES.bankerCopilot,   prefix: '/v1/copilot',                http2: false });

  // Open Banking routes (Module 13 / 17)
  await app.register(httpProxy, { upstream: SERVICES.onboarding,     prefix: '/open-banking/v3.1/aisp',   http2: false });
  await app.register(httpProxy, { upstream: SERVICES.payments,        prefix: '/open-banking/v3.1/pisp',   http2: false });
  await app.register(httpProxy, { upstream: SERVICES.middleOffice,    prefix: '/open-banking/v3.1/consents', http2: false });

  app.get('/health', async () => ({
    status: 'ok',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    services: Object.keys(SERVICES),
  }));

  const port = parseInt(process.env.PORT || '3000');
  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`API Gateway running on port ${port}`);
  app.log.info(`Swagger UI: http://localhost:${port}/documentation`);
}

main().catch((err) => { console.error(err); process.exit(1); });
