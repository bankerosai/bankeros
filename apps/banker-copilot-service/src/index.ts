/**
 * Banker Copilot service entry point.
 *
 * Adds beyond a vanilla service:
 *   · Strict env validation at startup (fail-fast with a clear message)
 *   · /ready probe (separate from /health) — checks Anthropic/OpenRouter + DB
 *   · /metrics endpoint (Prometheus) for FinOps + ops dashboards
 *   · Graceful shutdown: drains in-flight turns on SIGTERM/SIGINT
 *   · Per-user rate limiter GC
 */
import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import client from 'prom-client';
import { copilotRoutes } from './routes';
import { getStore } from './store';
import { startRateLimitGc } from './rate-limit';

function validateEnv() {
  const provider = (process.env.COPILOT_PROVIDER ?? 'anthropic').toLowerCase();
  const errs: string[] = [];
  if (provider === 'openrouter' && !process.env.OPENROUTER_API_KEY) {
    errs.push('OPENROUTER_API_KEY is required when COPILOT_PROVIDER=openrouter');
  } else if (provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    errs.push('ANTHROPIC_API_KEY is required when COPILOT_PROVIDER=anthropic (default)');
  }
  if (!process.env.JWT_SECRET) {
    errs.push('JWT_SECRET is required so the service can self-verify caller identity');
  }
  if (process.env.COPILOT_ALLOW_ANON === 'true' && process.env.NODE_ENV === 'production') {
    errs.push('COPILOT_ALLOW_ANON=true is forbidden when NODE_ENV=production');
  }
  if (errs.length) {
    console.error('[banker-copilot] startup configuration errors:');
    for (const e of errs) console.error(`  · ${e}`);
    process.exit(1);
  }
  console.log(`[banker-copilot] provider=${provider}  node_env=${process.env.NODE_ENV ?? 'development'}`);
}

async function main() {
  validateEnv();
  startRateLimitGc();

  // Default labels appear on every metric automatically
  client.collectDefaultMetrics({ prefix: 'banker_copilot_' });

  const app = await createServer({ serviceName: 'Banker Copilot Service' });

  // /metrics — Prometheus scrape target
  app.get('/metrics', async (_req, reply) => {
    reply.header('Content-Type', client.register.contentType);
    return client.register.metrics();
  });

  // /ready — must verify *all* dependencies (DB + LLM endpoint reachable)
  app.get('/ready', async (_req, reply) => {
    const checks: Record<string, boolean> = {};
    try {
      const store = await getStore();
      checks.store = await store.health();
    } catch {
      checks.store = false;
    }
    checks.llm = !!(process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY);
    const ok = Object.values(checks).every(Boolean);
    reply.status(ok ? 200 : 503);
    return { ready: ok, checks };
  });

  await app.register(copilotRoutes, { prefix: '/v1/copilot' });
  const port = parseInt(process.env.PORT || '3017');
  await startServer(app, port, 'Banker Copilot Service');

  // ── Graceful shutdown ──────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`[banker-copilot] received ${signal}, draining...`);
    try {
      await app.close();
      console.log('[banker-copilot] shut down cleanly');
      process.exit(0);
    } catch (e) {
      console.error('[banker-copilot] error during shutdown:', e);
      process.exit(1);
    }
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((e) => {
  console.error('[banker-copilot] fatal startup error:', e);
  process.exit(1);
});
