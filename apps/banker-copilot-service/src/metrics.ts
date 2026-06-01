/**
 * Prometheus metrics for the Banker Copilot service.
 * Designed so the CRO / FinOps team can answer:
 *   - How much are we spending per role / per skill / per model?
 *   - Where do tool calls fail most?
 *   - What's our latency P95 on artefact generation?
 *
 * Exposed via the parent server's /metrics endpoint from shared-utils.
 */
import client from 'prom-client';

const PREFIX = 'banker_copilot_';

export const sessionsStarted = new client.Counter({
  name: `${PREFIX}sessions_started_total`,
  help: 'Number of Copilot sessions opened',
  labelNames: ['role'] as const,
});

export const turnsTotal = new client.Counter({
  name: `${PREFIX}turns_total`,
  help: 'Number of turn completions (one user message → assistant reply)',
  labelNames: ['role', 'skill', 'model', 'outcome'] as const,
});

export const turnLatencyMs = new client.Histogram({
  name: `${PREFIX}turn_latency_ms`,
  help: 'End-to-end latency from /messages POST to final assistant text (ms)',
  labelNames: ['role', 'skill', 'model'] as const,
  buckets: [250, 500, 1000, 2500, 5000, 10000, 20000, 40000, 80000],
});

export const tokensTotal = new client.Counter({
  name: `${PREFIX}tokens_total`,
  help: 'LLM tokens consumed',
  labelNames: ['role', 'model', 'direction'] as const, // direction: input|output|cache_read|cache_write
});

export const costUsd = new client.Counter({
  name: `${PREFIX}cost_usd_total`,
  help: 'Estimated LLM spend in USD',
  labelNames: ['role', 'model'] as const,
});

export const toolCallsTotal = new client.Counter({
  name: `${PREFIX}tool_calls_total`,
  help: 'BankerOS tool invocations',
  labelNames: ['tool', 'role', 'outcome'] as const, // outcome: ok|denied|error
});

export const artefactsCreated = new client.Counter({
  name: `${PREFIX}artefacts_created_total`,
  help: 'Artefacts (IC memos, KYC opinions, etc.) generated',
  labelNames: ['skill', 'role'] as const,
});

export const rateLimitHits = new client.Counter({
  name: `${PREFIX}rate_limit_hits_total`,
  help: 'Requests rejected by per-user rate limit',
  labelNames: ['role'] as const,
});

/** Record one completed turn — convenience helper. */
export function recordTurn(opts: {
  role: string;
  skill: string | null;
  model: string;
  outcome: 'ok' | 'error';
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  costUsd: number;
}) {
  const labelSkill = opts.skill ?? 'free_chat';
  turnsTotal.inc({ role: opts.role, skill: labelSkill, model: opts.model, outcome: opts.outcome });
  turnLatencyMs.observe({ role: opts.role, skill: labelSkill, model: opts.model }, opts.latencyMs);
  tokensTotal.inc({ role: opts.role, model: opts.model, direction: 'input' }, opts.inputTokens);
  tokensTotal.inc({ role: opts.role, model: opts.model, direction: 'output' }, opts.outputTokens);
  if (opts.cacheReadTokens) {
    tokensTotal.inc({ role: opts.role, model: opts.model, direction: 'cache_read' }, opts.cacheReadTokens);
  }
  if (opts.cacheWriteTokens) {
    tokensTotal.inc({ role: opts.role, model: opts.model, direction: 'cache_write' }, opts.cacheWriteTokens);
  }
  costUsd.inc({ role: opts.role, model: opts.model }, opts.costUsd);
}
