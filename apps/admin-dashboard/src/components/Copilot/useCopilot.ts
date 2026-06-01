/**
 * Lightweight zustand-ish store for Copilot session state.
 * Includes a tiny pub/sub + robust HTTP wrapper that surfaces real error
 * messages instead of opaque "Failed to execute 'json'" failures.
 */
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface CopilotMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'TOOL';
  content: string;
  createdAt: string;
}

export interface CopilotSkill {
  name: string;
  description: string;
}

export type CopilotConnection =
  | { status: 'unknown' }
  | { status: 'ok'; provider: string; model: string; keyConfigured: boolean }
  | { status: 'down'; reason: string };

interface CopilotState {
  isOpen: boolean;
  sessionId: string | null;
  messages: CopilotMessage[];
  skills: CopilotSkill[];
  commands: { name: string }[];
  busy: boolean;
  error: string | null;
  connection: CopilotConnection;
  modelLabel: string | null;
}

const initial: CopilotState = {
  isOpen: false,
  sessionId: null,
  messages: [],
  skills: [],
  commands: [],
  busy: false,
  error: null,
  connection: { status: 'unknown' },
  modelLabel: null,
};

let state: CopilotState = { ...initial };
const subs = new Set<() => void>();
function set(patch: Partial<CopilotState>) {
  state = { ...state, ...patch };
  subs.forEach((s) => s());
}

const API_BASE =
  (import.meta as any).env?.VITE_COPILOT_BASE ?? '/v1/copilot';

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('bankeros.access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Robust fetch — never throws an opaque JSON-parse error. */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { ...getAuthHeaders(), ...(init?.headers ?? {}) },
    });
  } catch (e: any) {
    throw new Error(`无法连接 Copilot 服务（${API_BASE}${path}）：${e?.message ?? e}`);
  }

  const text = await res.text();
  if (!text) {
    if (!res.ok) {
      throw new Error(`服务返回 ${res.status} 且响应体为空。多半是后端服务没起来。`);
    }
    return undefined as unknown as T;
  }

  let body: any;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`服务返回非 JSON 内容 (HTTP ${res.status})：${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const msg = body?.error?.message ?? body?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  // Service wraps successful responses as { success: true, data: ... }
  return (body?.data ?? body) as T;
}

/** Hook for any component to read + mutate Copilot state. */
export function useCopilot() {
  const loc = useLocation();
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((x) => x + 1);
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  }, []);

  const open = useCallback(() => set({ isOpen: true }), []);
  const close = useCallback(() => set({ isOpen: false }), []);
  const toggle = useCallback(() => set({ isOpen: !state.isOpen }), []);

  /** Probe the backend; populates connection + modelLabel. */
  const checkConnection = useCallback(async () => {
    try {
      const h = await api<{
        ok: boolean;
        provider: string;
        model: string;
        keyConfigured: boolean;
      }>('/health');
      set({
        connection: {
          status: 'ok',
          provider: h.provider,
          model: h.model,
          keyConfigured: h.keyConfigured,
        },
        modelLabel: h.model,
      });
    } catch (e: any) {
      set({ connection: { status: 'down', reason: e.message ?? String(e) } });
    }
  }, []);

  const loadCatalog = useCallback(async () => {
    try {
      const data = await api<{ skills: CopilotSkill[]; commands: { name: string }[] }>(
        '/skills',
      );
      set({ skills: data.skills, commands: data.commands, error: null });
    } catch (e: any) {
      set({ error: e.message });
    }
  }, []);

  const send = useCallback(
    async (content: string) => {
      set({ busy: true, error: null });
      const local: CopilotMessage = {
        id: `local-${Date.now()}`,
        role: 'USER',
        content,
        createdAt: new Date().toISOString(),
      };
      set({ messages: [...state.messages, local] });
      try {
        const pageContext = { pathname: loc.pathname, refs: parseRefs(loc.pathname) };
        let sessionId = state.sessionId;
        let assistantText: string;
        if (!sessionId) {
          const data = await api<{
            session: { id: string };
            result?: { assistantText: string };
          }>('/sessions', {
            method: 'POST',
            body: JSON.stringify({ firstMessage: content, pageContext }),
          });
          sessionId = data.session.id;
          assistantText = data.result?.assistantText ?? '';
        } else {
          const data = await api<{ assistantText: string }>(
            `/sessions/${sessionId}/messages`,
            {
              method: 'POST',
              body: JSON.stringify({ content, pageContext }),
            },
          );
          assistantText = data.assistantText;
        }
        const assistant: CopilotMessage = {
          id: `local-${Date.now() + 1}`,
          role: 'ASSISTANT',
          content: assistantText || '（模型未返回内容）',
          createdAt: new Date().toISOString(),
        };
        set({
          sessionId,
          messages: [...state.messages, assistant],
          busy: false,
        });
      } catch (e: any) {
        set({ busy: false, error: e.message });
      }
    },
    [loc.pathname],
  );

  const reset = useCallback(() => set({ ...initial, isOpen: state.isOpen }), []);
  const retry = useCallback(() => {
    void checkConnection();
    void loadCatalog();
  }, [checkConnection, loadCatalog]);

  return {
    ...state,
    pathname: loc.pathname,
    open,
    close,
    toggle,
    loadCatalog,
    checkConnection,
    send,
    reset,
    retry,
  };
}

/** Pull entity refs (CIF, application id, etc.) from the URL so the LLM has them. */
function parseRefs(pathname: string): Record<string, string> {
  const refs: Record<string, string> = {};
  const cif = pathname.match(/CIF-[A-Z0-9]+/i)?.[0];
  if (cif) refs.cif = cif;
  const app = pathname.match(/APP-[0-9]{4}-[0-9]+/i)?.[0];
  if (app) refs.applicationId = app;
  const lc = pathname.match(/LC[0-9]{4}-[0-9]+/i)?.[0];
  if (lc) refs.lcId = lc;
  return refs;
}
