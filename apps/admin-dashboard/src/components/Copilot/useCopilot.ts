/**
 * Lightweight pub/sub store for Copilot state.
 * Adds:  · SSE streaming (typewriter effect)
 *        · @ mention picker (entity autocomplete)
 *        · artefacts archive
 */
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface CopilotToolCall {
  name: string;
  args: Record<string, unknown>;
  ok?: boolean;
  summary?: string;
}

export interface CopilotMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'TOOL';
  content: string;
  createdAt: string;
  artefactId?: string;
  streaming?: boolean;
  toolCalls?: CopilotToolCall[];
}

export interface CopilotSkill {
  name: string;
  description: string;
}
export interface CopilotMention {
  id: string;
  label: string;
  kind: 'customer' | 'loan' | 'lc';
  meta?: string;
}
export interface CopilotArtefact {
  id: string;
  sessionId: string;
  skill: string;
  subject: string;
  content: string;
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'DISCARDED';
  createdAt: number;
}

export type CopilotConnection =
  | { status: 'unknown' }
  | { status: 'ok'; provider: string; model: string; keyConfigured: boolean; forcedProviderOrder?: string[] }
  | { status: 'down'; reason: string };

export type CopilotView = 'chat' | 'artefacts';

interface CopilotState {
  isOpen: boolean;
  view: CopilotView;
  sessionId: string | null;
  messages: CopilotMessage[];
  skills: CopilotSkill[];
  commands: { name: string }[];
  busy: boolean;
  error: string | null;
  connection: CopilotConnection;
  modelLabel: string | null;
  artefacts: CopilotArtefact[];
  openArtefactId: string | null;
  /** Count of assistant messages that arrived while the sidebar was closed. */
  unreadCount: number;
}

const initial: CopilotState = {
  isOpen: false,
  view: 'chat',
  sessionId: null,
  messages: [],
  skills: [],
  commands: [],
  busy: false,
  error: null,
  connection: { status: 'unknown' },
  modelLabel: null,
  artefacts: [],
  openArtefactId: null,
  unreadCount: 0,
};

let state: CopilotState = { ...initial };
const subs = new Set<() => void>();
function set(patch: Partial<CopilotState>) {
  state = { ...state, ...patch };
  subs.forEach((s) => s());
}

const API_BASE = (import.meta as any).env?.VITE_COPILOT_BASE ?? '/v1/copilot';

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('bankeros.access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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
      throw new Error(`服务返回 ${res.status} 且响应体为空。多半是后端没起来。`);
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
  return (body?.data ?? body) as T;
}

/** Pull entity refs from the URL so the LLM sees them as context. */
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

  // Opening the sidebar clears unread; closing leaves count alone.
  const open = useCallback(() => set({ isOpen: true, unreadCount: 0 }), []);
  const close = useCallback(() => set({ isOpen: false }), []);
  const toggle = useCallback(
    () => set({ isOpen: !state.isOpen, unreadCount: state.isOpen ? state.unreadCount : 0 }),
    [],
  );
  const setView = useCallback((v: CopilotView) => set({ view: v }), []);

  const checkConnection = useCallback(async () => {
    try {
      const h = await api<{
        ok: boolean;
        provider: string;
        model: string;
        keyConfigured: boolean;
        forcedProviderOrder?: string[];
      }>('/health');
      set({
        connection: {
          status: 'ok',
          provider: h.provider,
          model: h.model,
          keyConfigured: h.keyConfigured,
          forcedProviderOrder: h.forcedProviderOrder,
        },
        modelLabel: h.model,
      });
    } catch (e: any) {
      set({ connection: { status: 'down', reason: e.message ?? String(e) } });
    }
  }, []);

  const loadCatalog = useCallback(async () => {
    try {
      const data = await api<{ skills: CopilotSkill[]; commands: { name: string }[] }>('/skills');
      set({ skills: data.skills, commands: data.commands, error: null });
    } catch (e: any) {
      set({ error: e.message });
    }
  }, []);

  const loadArtefacts = useCallback(async () => {
    try {
      const data = await api<CopilotArtefact[]>('/artefacts');
      set({ artefacts: data });
    } catch (e: any) {
      set({ error: e.message });
    }
  }, []);

  const searchMentions = useCallback(async (q: string): Promise<CopilotMention[]> => {
    try {
      return await api<CopilotMention[]>(`/mentions?q=${encodeURIComponent(q)}`);
    } catch {
      return [];
    }
  }, []);

  const openArtefact = useCallback((id: string | null) => set({ openArtefactId: id, view: id ? 'artefacts' : state.view }), []);

  const setArtefactStatus = useCallback(
    async (id: string, status: CopilotArtefact['status']) => {
      try {
        const updated = await api<CopilotArtefact>(`/artefacts/${id}/status`, {
          method: 'POST',
          body: JSON.stringify({ status }),
        });
        set({ artefacts: state.artefacts.map((a) => (a.id === id ? updated : a)) });
      } catch (e: any) {
        set({ error: e.message });
      }
    },
    [],
  );

  /** Streaming send via SSE — types each delta into a live ASSISTANT bubble. */
  const send = useCallback(
    async (content: string) => {
      set({ busy: true, error: null });
      const userMsg: CopilotMessage = {
        id: `u-${Date.now()}`,
        role: 'USER',
        content,
        createdAt: new Date().toISOString(),
      };
      const assistantId = `a-${Date.now() + 1}`;
      const assistantStub: CopilotMessage = {
        id: assistantId,
        role: 'ASSISTANT',
        content: '',
        createdAt: new Date().toISOString(),
        streaming: true,
      };
      set({ messages: [...state.messages, userMsg, assistantStub] });

      const pageContext = { pathname: loc.pathname, refs: parseRefs(loc.pathname) };

      try {
        // Ensure a session exists
        let sessionId = state.sessionId;
        if (!sessionId) {
          const data = await api<{ session: { id: string } }>('/sessions', {
            method: 'POST',
            body: JSON.stringify({ pageContext }),
          });
          sessionId = data.session.id;
          set({ sessionId });
        }

        // Stream the reply (text deltas + tool events)
        await streamMessage(
          sessionId,
          content,
          pageContext,
          (delta) => {
            state.messages = state.messages.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + delta } : m,
            );
            set({ messages: state.messages });
          },
          (toolCall) => {
            state.messages = state.messages.map((m) =>
              m.id === assistantId
                ? { ...m, toolCalls: [...(m.toolCalls ?? []), toolCall] }
                : m,
            );
            set({ messages: state.messages });
          },
        );

        // Finalize bubble + refresh artefacts (in case the model produced one)
        state.messages = state.messages.map((m) =>
          m.id === assistantId ? { ...m, streaming: false } : m,
        );
        set({
          messages: state.messages,
          busy: false,
          unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
        });
        void loadArtefacts();
      } catch (e: any) {
        state.messages = state.messages.map((m) =>
          m.id === assistantId
            ? { ...m, streaming: false, content: m.content || '（无回复）' }
            : m,
        );
        set({ messages: state.messages, busy: false, error: e.message ?? String(e) });
      }
    },
    [loc.pathname, loadArtefacts],
  );

  const reset = useCallback(
    () =>
      set({
        sessionId: null,
        messages: [],
        error: null,
        view: 'chat',
        openArtefactId: null,
      }),
    [],
  );

  const retry = useCallback(() => {
    void checkConnection();
    void loadCatalog();
    void loadArtefacts();
  }, [checkConnection, loadCatalog, loadArtefacts]);

  return {
    ...state,
    pathname: loc.pathname,
    open,
    close,
    toggle,
    setView,
    loadCatalog,
    loadArtefacts,
    searchMentions,
    openArtefact,
    setArtefactStatus,
    checkConnection,
    send,
    reset,
    retry,
  };
}

// ──────────────────────────────────────────────────────────
// SSE streaming helper
// ──────────────────────────────────────────────────────────
async function streamMessage(
  sessionId: string,
  content: string,
  pageContext: { pathname: string; refs: Record<string, string> },
  onDelta: (delta: string) => void,
  onToolResult: (call: CopilotToolCall) => void,
): Promise<void> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/stream`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, pageContext }),
  });
  if (!res.ok || !res.body) {
    let msg = `HTTP ${res.status}`;
    try {
      const t = await res.text();
      const j = JSON.parse(t);
      msg = j?.error?.message ?? msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const events = buf.split('\n\n');
    buf = events.pop() ?? '';
    for (const ev of events) {
      const lines = ev.split('\n');
      let eventName = 'message';
      let data = '';
      for (const line of lines) {
        if (line.startsWith('event:')) eventName = line.slice(6).trim();
        else if (line.startsWith('data:')) data = line.slice(5).trim();
      }
      if (!data) continue;
      try {
        const json = JSON.parse(data);
        if (eventName === 'delta' && typeof json.text === 'string') {
          onDelta(json.text);
        } else if (eventName === 'tool_result') {
          onToolResult({
            name: String(json.name ?? '?'),
            args: (json.args as Record<string, unknown>) ?? {},
            ok: !!json.ok,
            summary: typeof json.summary === 'string' ? json.summary : undefined,
          });
        } else if (eventName === 'error') {
          throw new Error(json.message ?? '流式响应失败');
        }
      } catch (e: any) {
        if (eventName === 'error') throw e;
        /* skip malformed */
      }
    }
  }
}
