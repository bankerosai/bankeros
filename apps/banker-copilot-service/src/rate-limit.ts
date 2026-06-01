/**
 * Tiny in-memory per-user rate limiter. Sliding window with a hard token
 * bucket — refills `tokens` every `windowMs`. For production with multiple
 * instances, swap the Map for Redis (ioredis is already a workspace dep).
 *
 * Defaults: 30 requests per minute per user.
 */
import { rateLimitHits } from './metrics';

const WINDOW_MS = parseInt(process.env.COPILOT_RATE_WINDOW_MS ?? '60000');
const MAX_PER_WINDOW = parseInt(process.env.COPILOT_RATE_MAX ?? '30');

interface Bucket {
  remaining: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function consumeToken(userId: string, role: string): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  let b = buckets.get(userId);
  if (!b || b.resetAt < now) {
    b = { remaining: MAX_PER_WINDOW, resetAt: now + WINDOW_MS };
    buckets.set(userId, b);
  }
  if (b.remaining <= 0) {
    rateLimitHits.inc({ role });
    return { ok: false, retryAfterMs: b.resetAt - now };
  }
  b.remaining -= 1;
  return { ok: true };
}

/** Periodic cleanup so the Map doesn't grow forever in long-running processes. */
export function startRateLimitGc(intervalMs = 5 * 60 * 1000) {
  return setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets.entries()) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }, intervalMs).unref();
}
