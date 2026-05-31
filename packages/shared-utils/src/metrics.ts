/**
 * Prometheus metrics for BankerOS services.
 * Each service registers a unique metrics endpoint at /metrics.
 */

import { FastifyInstance } from 'fastify';
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

export const registry = new Registry();
collectDefaultMetrics({ register: registry, prefix: 'bankeros_' });

// ── HTTP request metrics ─────────────────────────────────────────────────
export const httpRequestDuration = new Histogram({
  name: 'bankeros_http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code', 'service'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [registry],
});

export const httpRequestTotal = new Counter({
  name: 'bankeros_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service'],
  registers: [registry],
});

// ── Business metrics ──────────────────────────────────────────────────────
export const paymentsProcessed = new Counter({
  name: 'bankeros_payments_processed_total',
  help: 'Total payments processed (by status & network)',
  labelNames: ['status', 'network', 'currency'],
  registers: [registry],
});

export const paymentVolume = new Counter({
  name: 'bankeros_payment_volume_total',
  help: 'Total payment volume processed',
  labelNames: ['currency', 'network'],
  registers: [registry],
});

export const fraudBlocks = new Counter({
  name: 'bankeros_fraud_blocks_total',
  help: 'Payments blocked by fraud engine',
  labelNames: ['reason'],
  registers: [registry],
});

export const loansActive = new Gauge({
  name: 'bankeros_loans_active',
  help: 'Number of active loans',
  labelNames: ['product_code', 'status'],
  registers: [registry],
});

export const journalEntries = new Counter({
  name: 'bankeros_journal_entries_total',
  help: 'Journal entries posted',
  labelNames: ['reference_type', 'status'],
  registers: [registry],
});

export const kycScreenings = new Counter({
  name: 'bankeros_kyc_screenings_total',
  help: 'KYC sanctions screenings performed',
  labelNames: ['result', 'list_name'],
  registers: [registry],
});

export const eodJobDuration = new Histogram({
  name: 'bankeros_eod_job_duration_seconds',
  help: 'EOD batch job execution time',
  labelNames: ['job_type'],
  buckets: [10, 30, 60, 120, 300, 600, 1800],
  registers: [registry],
});

/** Register the /metrics endpoint + auto-instrument all HTTP requests. */
export function registerMetrics(app: FastifyInstance, serviceName: string): void {
  app.addHook('onResponse', async (request, reply) => {
    const route = request.routeOptions?.url ?? request.url;
    const labels = {
      method: request.method,
      route,
      status_code: reply.statusCode.toString(),
      service: serviceName,
    };
    httpRequestTotal.inc(labels);
    httpRequestDuration.observe(labels, reply.elapsedTime / 1000);
  });

  app.get('/metrics', async (_request, reply) => {
    reply.header('Content-Type', registry.contentType);
    return registry.metrics();
  });
}
