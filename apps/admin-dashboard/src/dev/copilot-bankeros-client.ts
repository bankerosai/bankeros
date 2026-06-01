/**
 * HTTP-based BankerOS tool client for the Copilot dev plugin.
 *
 * Replaces (or augments) the mock data layer with real HTTP calls to the
 * BankerOS API Gateway. Same tool name → result contract as copilot-mock-data
 * so the rest of the pipeline (LLM tool_use loop, SSE events, UI chips) is
 * unchanged.
 *
 * Env switches:
 *   COPILOT_TOOL_BACKEND=auto   default — try http, fall back to mock on
 *                               connection error or 5xx
 *   COPILOT_TOOL_BACKEND=http   real-only; surfaces errors to the LLM
 *   COPILOT_TOOL_BACKEND=mock   fixtures only (was the previous behaviour)
 *
 *   BANKEROS_API_BASE=http://localhost:3000   gateway URL
 *   COPILOT_HTTP_TIMEOUT_MS=8000              per-request timeout
 *
 * Each tool declares its HTTP recipe (method, path template, success-shape
 * checker). Adding a new BankerOS endpoint = one entry in HTTP_ROUTES.
 */
import type { MockResult } from './copilot-mock-data';
import { mockExecute } from './copilot-mock-data';

type Backend = 'auto' | 'http' | 'mock';
const BACKEND: Backend = ((process.env.COPILOT_TOOL_BACKEND ?? 'auto').toLowerCase() as Backend);
const BASE_URL =
  process.env.BANKEROS_API_BASE?.replace(/\/$/, '') ||
  'http://localhost:3000';
const TIMEOUT_MS = parseInt(process.env.COPILOT_HTTP_TIMEOUT_MS ?? '8000');

interface HttpRoute {
  method: 'GET' | 'POST';
  /** Path template; `{cif}` etc. are replaced from params. */
  path: (params: any) => string;
  /** Optional query-string builder. */
  query?: (params: any) => Record<string, string | number | boolean | undefined>;
}

const HTTP_ROUTES: Record<string, HttpRoute> = {
  bankeros_get_customer: {
    method: 'GET',
    path: (p) => `/v1/customers/${encodeURIComponent(p.cif)}`,
  },
  bankeros_get_kyc: {
    method: 'GET',
    path: (p) => `/v1/onboarding/kyc/${encodeURIComponent(p.cif)}`,
  },
  bankeros_get_risk_rating: {
    method: 'GET',
    path: (p) => `/v1/risk/credit-rating/${encodeURIComponent(p.cif)}`,
  },
  bankeros_get_loan_application: {
    method: 'GET',
    path: (p) => `/fineract-provider/api/v1/loans/applications/${encodeURIComponent(p.applicationId)}`,
  },
  bankeros_get_exposure: {
    method: 'GET',
    path: (p) => `/v1/risk/exposure/${encodeURIComponent(p.cif)}`,
    query: (p) => ({ group: p.includeGroup ?? true }),
  },
};

/** Set by Vite plugin once we successfully start; we'll reuse the proxy agent. */
let undiciDispatcher: any = null;
export function setUndiciDispatcher(d: any) {
  undiciDispatcher = d;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      ...(undiciDispatcher ? ({ dispatcher: undiciDispatcher } as any) : {}),
    });
  } finally {
    clearTimeout(tid);
  }
}

/** True if the HTTP layer threw on connect / DNS / timeout — i.e. BankerOS unreachable. */
function isConnectivityError(err: any): boolean {
  if (!err) return false;
  if (err.name === 'AbortError') return true;
  const code = (err.cause?.code ?? err.code ?? '').toString();
  return ['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'ECONNRESET'].includes(code);
}

async function callBankerosHttp(name: string, params: any): Promise<MockResult> {
  const route = HTTP_ROUTES[name];
  if (!route) return { ok: false, error: `No HTTP route mapped for ${name}`, status: 501 };

  let url = `${BASE_URL}${route.path(params)}`;
  if (route.query) {
    const qs = Object.entries(route.query(params))
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }

  const res = await fetchWithTimeout(
    url,
    {
      method: route.method,
      headers: {
        Accept: 'application/json',
        // Forward demo identity so downstream services see a recognisable caller.
        'x-user-id': 'demo-user',
        'x-user-role': 'SUPER_ADMIN',
      },
    },
    TIMEOUT_MS,
  );

  const text = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: `BankerOS ${name} → HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ''}`,
    };
  }
  try {
    const json = JSON.parse(text);
    // BankerOS wraps successful payloads as { success: true, data: ... }
    return { ok: true, result: json?.data ?? json };
  } catch {
    return { ok: false, status: 502, error: `BankerOS ${name} returned non-JSON` };
  }
}

/**
 * Unified entry point used by the dev plugin.
 *   - mock  → always fixture
 *   - http  → always real; errors propagate
 *   - auto  → try http; on connectivity error fall back to fixture (with a note)
 */
export async function callBankerosTool(name: string, params: any): Promise<MockResult> {
  if (BACKEND === 'mock') {
    return mockExecute(name, params);
  }
  if (BACKEND === 'http') {
    try {
      return await callBankerosHttp(name, params);
    } catch (err: any) {
      return {
        ok: false,
        status: 502,
        error: `${err?.name ?? 'Error'}: ${err?.message ?? String(err)}`,
      };
    }
  }
  // auto
  try {
    const r = await callBankerosHttp(name, params);
    if (r.ok || (r.status && r.status < 500 && r.status !== 404)) return r;
    // 404 / 5xx → fall through to fixture so demos still work
  } catch (err: any) {
    if (!isConnectivityError(err)) {
      // Unexpected error type — surface it rather than masking with mock
      return { ok: false, error: `${err?.name ?? 'Error'}: ${err?.message ?? String(err)}`, status: 500 };
    }
    // Connectivity error → BankerOS not running; fall back silently
  }
  const fallback = mockExecute(name, params);
  if (fallback.ok) {
    return {
      ok: true,
      result: {
        _fallback: 'mock_fixture',
        _hint: 'BankerOS API unreachable; using local demo data',
        ...(fallback.result as Record<string, unknown>),
      },
    };
  }
  return fallback;
}

export function getBackend(): Backend {
  return BACKEND;
}
