/**
 * BankerOS demo-backend — single-process HTTP server that pretends to be
 * the BankerOS API gateway for the 5 endpoints the Banker Copilot needs.
 *
 * Use case: validate the COPILOT_TOOL_BACKEND=http code path end-to-end
 * without bringing up Postgres + Kafka + 17 microservices. Identical
 * observable behaviour to a real BankerOS stack from Copilot's perspective.
 *
 * Listens on :3000 by default — same port the api-gateway would use.
 * Fixture data lives in `fixtures.ts` and is shared with the dev plugin's
 * mock layer, so dev and demo always agree.
 *
 *   node apps/demo-backend/dist/index.js
 *     or
 *   pnpm --filter @bankeros/demo-backend dev
 */
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';
import { FIXTURES } from './fixtures.js';

const PORT = parseInt(process.env.PORT ?? '3000');

interface Route {
  method: string;
  pattern: RegExp;
  /** Capture-group names in pattern */
  paramNames: string[];
  handle: (params: Record<string, string>, query: URLSearchParams) => any;
}

const ROUTES: Route[] = [
  {
    method: 'GET',
    pattern: /^\/v1\/customers\/([^/]+)\/?$/,
    paramNames: ['cif'],
    handle: ({ cif }) => fixture(FIXTURES.customers, cif),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/onboarding\/kyc\/([^/]+)\/?$/,
    paramNames: ['cif'],
    handle: ({ cif }) => fixture(FIXTURES.kyc, cif),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/risk\/credit-rating\/([^/]+)\/?$/,
    paramNames: ['cif'],
    handle: ({ cif }) => fixture(FIXTURES.ratings, cif),
  },
  {
    method: 'GET',
    pattern: /^\/v1\/risk\/exposure\/([^/]+)\/?$/,
    paramNames: ['cif'],
    handle: ({ cif }) => fixture(FIXTURES.exposures, cif),
  },
  {
    method: 'GET',
    pattern: /^\/fineract-provider\/api\/v1\/loans\/applications\/([^/]+)\/?$/,
    paramNames: ['applicationId'],
    handle: ({ applicationId }) => fixture(FIXTURES.applications, applicationId),
  },
];

function fixture<T>(table: Record<string, T>, key: string): T | null {
  return table[key] ?? null;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Demo-Backend', 'true');
  res.end(JSON.stringify(body));
}

const server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    const path = url.pathname;

    // ── Health probes (so docker / curl can verify) ───────────
    if (req.method === 'GET' && (path === '/health' || path === '/')) {
      send(res, 200, {
        ok: true,
        service: 'demo-backend',
        endpoints: ROUTES.map((r) => `${r.method} ${r.pattern.source}`),
        fixtures: {
          customers: Object.keys(FIXTURES.customers).length,
          kyc: Object.keys(FIXTURES.kyc).length,
          ratings: Object.keys(FIXTURES.ratings).length,
          exposures: Object.keys(FIXTURES.exposures).length,
          applications: Object.keys(FIXTURES.applications).length,
        },
      });
      return;
    }

    // ── Routed lookups ────────────────────────────────────────
    for (const r of ROUTES) {
      if (req.method !== r.method) continue;
      const m = path.match(r.pattern);
      if (!m) continue;
      const params: Record<string, string> = {};
      r.paramNames.forEach((n, i) => (params[n] = decodeURIComponent(m[i + 1])));
      const data = r.handle(params, url.searchParams);
      if (data === null) {
        send(res, 404, {
          success: false,
          error: { code: 'NOT_FOUND', message: `No fixture for ${path}` },
        });
        return;
      }
      // BankerOS wraps successful payloads as { success, data }
      send(res, 200, { success: true, data });
      return;
    }

    // 404
    send(res, 404, {
      success: false,
      error: { code: 'NOT_FOUND', message: `No route for ${req.method} ${path}` },
    });
  },
);

server.listen(PORT, () => {
  console.log(`[demo-backend] listening on :${PORT}`);
  console.log(`[demo-backend] endpoints:`);
  for (const r of ROUTES) console.log(`              ${r.method.padEnd(4)} ${r.pattern.source}`);
});

// Graceful shutdown
for (const sig of ['SIGTERM', 'SIGINT'] as const) {
  process.on(sig, () => {
    console.log(`[demo-backend] ${sig} received, closing.`);
    server.close(() => process.exit(0));
  });
}
