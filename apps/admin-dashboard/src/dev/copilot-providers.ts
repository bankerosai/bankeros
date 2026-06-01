/**
 * Provider abstraction for the Copilot dev plugin.
 *
 * Two implementations:
 *   · openrouter   OpenAI-compatible API; works with any model OpenRouter
 *                  hosts. No prompt caching.
 *   · anthropic    Native Anthropic Messages API with `cache_control` —
 *                  the *static* system block (banker rules + skill body)
 *                  is marked ephemeral, giving ~90% input-token discount
 *                  on cache hits within the 5-minute TTL.
 *
 * Env switches:
 *   COPILOT_PROVIDER=openrouter     (default — uses OPENROUTER_API_KEY)
 *   COPILOT_PROVIDER=anthropic      (uses ANTHROPIC_API_KEY)
 *   COPILOT_MODEL=…                 (provider-appropriate model id)
 *
 * Anthropic model defaults:
 *   COPILOT_MODEL not set → claude-sonnet-4-5
 */

export interface ToolDef {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  argsJson: string;
}

export interface ChatMsg {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export interface GenerateOpts {
  /** Static identity + behavioural rules — cached on Anthropic. */
  systemStatic: string;
  /** Per-call context (role, page, active skill name) — not cached. */
  systemDynamic: string;
  messages: ChatMsg[];
  tools: ToolDef[];
  maxTokens: number;
}

export interface ProviderUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

export interface GenerateResult {
  text: string;
  toolCalls: ToolCall[];
  finishReason: string;
  usage: ProviderUsage;
}

export interface Provider {
  readonly name: 'openrouter' | 'anthropic';
  readonly model: string;
  /** Provider-specific routing label shown in /health (e.g. "Anthropic Direct"). */
  readonly route?: string;
  generate(opts: GenerateOpts): Promise<GenerateResult>;
  stream(
    opts: GenerateOpts,
    onDelta: (chunk: string) => void,
    onToolCalls: (calls: ToolCall[]) => void,
  ): Promise<GenerateResult>;
}

// ────────────────────────────────────────────────────────────
// Shared fetch helper (Vite plugin sets the proxy dispatcher).
// ────────────────────────────────────────────────────────────
let undiciDispatcher: any = null;
export function setProviderDispatcher(d: any) {
  undiciDispatcher = d;
}
function fetchInit(extra: RequestInit = {}): RequestInit {
  if (!undiciDispatcher) return extra;
  return { ...extra, ...({ dispatcher: undiciDispatcher } as any) };
}

// ────────────────────────────────────────────────────────────
// OpenRouter (OpenAI-compatible)
// ────────────────────────────────────────────────────────────
function providerHint(model: string): Record<string, unknown> | undefined {
  const envOrder = process.env.OPENROUTER_PROVIDER_ORDER;
  if (envOrder) {
    return {
      order: envOrder.split(',').map((s) => s.trim()).filter(Boolean),
      allow_fallbacks: process.env.OPENROUTER_ALLOW_FALLBACKS !== 'false',
    };
  }
  if (model.startsWith('anthropic/')) {
    return { order: ['Anthropic'], allow_fallbacks: false };
  }
  return undefined;
}

function toOpenAIMessages(systemStatic: string, systemDynamic: string, messages: ChatMsg[]): any[] {
  const out: any[] = [
    { role: 'system', content: systemStatic + (systemDynamic ? '\n\n' + systemDynamic : '') },
  ];
  for (const m of messages) {
    if (m.role === 'tool') {
      out.push({ role: 'tool', tool_call_id: m.toolCallId, content: m.content });
    } else if (m.role === 'assistant' && m.toolCalls?.length) {
      out.push({
        role: 'assistant',
        content: m.content || null,
        tool_calls: m.toolCalls.map((tc) => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.name, arguments: tc.argsJson },
        })),
      });
    } else if (m.role !== 'system') {
      out.push({ role: m.role, content: m.content });
    }
  }
  return out;
}

class OpenRouterProvider implements Provider {
  readonly name = 'openrouter' as const;
  readonly model: string;
  readonly route: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY ?? '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';
    this.model = process.env.COPILOT_MODEL ?? 'anthropic/claude-sonnet-4.5';
    const hint = providerHint(this.model);
    this.route = hint ? `OpenRouter → ${(hint.order as string[])?.join(',') ?? 'forced'}` : 'OpenRouter';
  }

  async generate(opts: GenerateOpts): Promise<GenerateResult> {
    const hint = providerHint(this.model);
    const res = await fetch(
      `${this.baseUrl.replace(/\/$/, '')}/chat/completions`,
      fetchInit({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/bankerosai/bankeros',
          'X-Title': 'BankerOS Banker Copilot (dev)',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: opts.maxTokens,
          messages: toOpenAIMessages(opts.systemStatic, opts.systemDynamic, opts.messages),
          tools: opts.tools.map((t) => ({ type: 'function', function: t })),
          tool_choice: 'auto',
          ...(hint ? { provider: hint } : {}),
        }),
      }),
    );
    const text = await res.text();
    if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 400)}`);
    const data = JSON.parse(text);
    const choice = data?.choices?.[0];
    const toolCalls: ToolCall[] = (choice?.message?.tool_calls ?? []).map((tc: any) => ({
      id: tc.id,
      name: tc.function?.name,
      argsJson: tc.function?.arguments ?? '{}',
    }));
    return {
      text: String(choice?.message?.content ?? ''),
      toolCalls,
      finishReason: choice?.finish_reason ?? '',
      usage: {
        inputTokens: data?.usage?.prompt_tokens ?? 0,
        outputTokens: data?.usage?.completion_tokens ?? 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
    };
  }

  async stream(
    opts: GenerateOpts,
    onDelta: (chunk: string) => void,
    onToolCalls: (calls: ToolCall[]) => void,
  ): Promise<GenerateResult> {
    const hint = providerHint(this.model);
    const res = await fetch(
      `${this.baseUrl.replace(/\/$/, '')}/chat/completions`,
      fetchInit({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/bankerosai/bankeros',
          'X-Title': 'BankerOS Banker Copilot (dev)',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: opts.maxTokens,
          messages: toOpenAIMessages(opts.systemStatic, opts.systemDynamic, opts.messages),
          stream: true,
          tools: opts.tools.map((t) => ({ type: 'function', function: t })),
          tool_choice: 'auto',
          ...(hint ? { provider: hint } : {}),
        }),
      }),
    );
    if (!res.ok || !res.body) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`OpenRouter ${res.status}: ${errBody.slice(0, 400)}`);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let finishReason = '';
    const pending = new Map<number, { id?: string; name?: string; args: string }>();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += dec.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';
      for (const ev of events) {
        const line = ev.trim();
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const choice = json?.choices?.[0];
          const delta = choice?.delta?.content;
          if (typeof delta === 'string' && delta) {
            fullText += delta;
            onDelta(delta);
          }
          const tcDeltas = choice?.delta?.tool_calls;
          if (Array.isArray(tcDeltas)) {
            for (const tc of tcDeltas) {
              const idx = tc.index ?? 0;
              const slot = pending.get(idx) ?? { args: '' };
              if (tc.id) slot.id = tc.id;
              if (tc.function?.name) slot.name = tc.function.name;
              if (typeof tc.function?.arguments === 'string') slot.args += tc.function.arguments;
              pending.set(idx, slot);
            }
          }
          if (choice?.finish_reason) finishReason = choice.finish_reason;
          if (json?.usage) {
            inputTokens = json.usage.prompt_tokens ?? inputTokens;
            outputTokens = json.usage.completion_tokens ?? outputTokens;
          }
        } catch {
          /* skip */
        }
      }
    }
    const toolCalls: ToolCall[] = [...pending.values()]
      .filter((t) => t.id && t.name)
      .map((t) => ({ id: t.id!, name: t.name!, argsJson: t.args || '{}' }));
    if (toolCalls.length) onToolCalls(toolCalls);
    return {
      text: fullText,
      toolCalls,
      finishReason,
      usage: { inputTokens, outputTokens, cacheReadTokens: 0, cacheWriteTokens: 0 },
    };
  }
}

// ────────────────────────────────────────────────────────────
// Anthropic native (with prompt caching)
// ────────────────────────────────────────────────────────────
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

function toAnthropicMessages(messages: ChatMsg[]): any[] {
  const out: any[] = [];
  for (const m of messages) {
    if (m.role === 'tool') {
      out.push({
        role: 'user',
        content: [
          { type: 'tool_result', tool_use_id: m.toolCallId ?? '', content: m.content },
        ],
      });
    } else if (m.role === 'assistant' && m.toolCalls?.length) {
      const blocks: any[] = [];
      if (m.content) blocks.push({ type: 'text', text: m.content });
      for (const tc of m.toolCalls) {
        let input: any = {};
        try {
          input = JSON.parse(tc.argsJson || '{}');
        } catch {
          /* leave empty */
        }
        blocks.push({ type: 'tool_use', id: tc.id, name: tc.name, input });
      }
      out.push({ role: 'assistant', content: blocks });
    } else if (m.role === 'user' || m.role === 'assistant') {
      out.push({ role: m.role, content: m.content });
    }
  }
  return out;
}

class AnthropicProvider implements Provider {
  readonly name = 'anthropic' as const;
  readonly model: string;
  readonly route = 'Anthropic Direct';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY ?? '';
    this.model = process.env.COPILOT_MODEL ?? 'claude-sonnet-4-5';
  }

  private body(opts: GenerateOpts, stream: boolean): any {
    return {
      model: this.model,
      max_tokens: opts.maxTokens,
      // Split system into two blocks; mark the long static block as ephemeral
      // so subsequent turns within the cache TTL hit the cache (~90% discount).
      system: [
        { type: 'text', text: opts.systemStatic, cache_control: { type: 'ephemeral' } },
        ...(opts.systemDynamic ? [{ type: 'text', text: opts.systemDynamic }] : []),
      ],
      messages: toAnthropicMessages(opts.messages),
      tools: opts.tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      })),
      stream,
    };
  }

  async generate(opts: GenerateOpts): Promise<GenerateResult> {
    const res = await fetch(
      ANTHROPIC_URL,
      fetchInit({
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
          'anthropic-beta': 'prompt-caching-2024-07-31',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.body(opts, false)),
      }),
    );
    const text = await res.text();
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${text.slice(0, 400)}`);
    const data = JSON.parse(text);
    let body = '';
    const toolCalls: ToolCall[] = [];
    for (const b of data?.content ?? []) {
      if (b.type === 'text') body += b.text;
      else if (b.type === 'tool_use') {
        toolCalls.push({ id: b.id, name: b.name, argsJson: JSON.stringify(b.input ?? {}) });
      }
    }
    return {
      text: body,
      toolCalls,
      finishReason: data?.stop_reason ?? '',
      usage: {
        inputTokens: data?.usage?.input_tokens ?? 0,
        outputTokens: data?.usage?.output_tokens ?? 0,
        cacheReadTokens: data?.usage?.cache_read_input_tokens ?? 0,
        cacheWriteTokens: data?.usage?.cache_creation_input_tokens ?? 0,
      },
    };
  }

  async stream(
    opts: GenerateOpts,
    onDelta: (chunk: string) => void,
    onToolCalls: (calls: ToolCall[]) => void,
  ): Promise<GenerateResult> {
    const res = await fetch(
      ANTHROPIC_URL,
      fetchInit({
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
          'anthropic-beta': 'prompt-caching-2024-07-31',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.body(opts, true)),
      }),
    );
    if (!res.ok || !res.body) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`Anthropic ${res.status}: ${errBody.slice(0, 400)}`);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let cacheReadTokens = 0;
    let cacheWriteTokens = 0;
    let finishReason = '';
    /** Index → accumulator for tool_use blocks Claude emits via input_json_delta. */
    const pendingTools = new Map<number, { id?: string; name?: string; args: string }>();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += dec.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';
      for (const raw of events) {
        const lines = raw.split('\n');
        let dataLine = '';
        for (const ln of lines) if (ln.startsWith('data:')) dataLine = ln.slice(5).trim();
        if (!dataLine) continue;
        try {
          const evt = JSON.parse(dataLine);
          if (evt.type === 'content_block_start') {
            const block = evt.content_block;
            if (block?.type === 'tool_use') {
              pendingTools.set(evt.index, {
                id: block.id,
                name: block.name,
                args: '',
              });
            }
          } else if (evt.type === 'content_block_delta') {
            const d = evt.delta;
            if (d?.type === 'text_delta' && typeof d.text === 'string') {
              fullText += d.text;
              onDelta(d.text);
            } else if (d?.type === 'input_json_delta' && typeof d.partial_json === 'string') {
              const slot = pendingTools.get(evt.index);
              if (slot) slot.args += d.partial_json;
            }
          } else if (evt.type === 'message_delta') {
            if (evt.delta?.stop_reason) finishReason = evt.delta.stop_reason;
            if (evt.usage) {
              outputTokens = evt.usage.output_tokens ?? outputTokens;
            }
          } else if (evt.type === 'message_start' && evt.message?.usage) {
            inputTokens = evt.message.usage.input_tokens ?? 0;
            cacheReadTokens = evt.message.usage.cache_read_input_tokens ?? 0;
            cacheWriteTokens = evt.message.usage.cache_creation_input_tokens ?? 0;
          }
        } catch {
          /* skip malformed */
        }
      }
    }
    const toolCalls: ToolCall[] = [...pendingTools.values()]
      .filter((t) => t.id && t.name)
      .map((t) => ({ id: t.id!, name: t.name!, argsJson: t.args || '{}' }));
    if (toolCalls.length) onToolCalls(toolCalls);
    return {
      text: fullText,
      toolCalls,
      finishReason,
      usage: { inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens },
    };
  }
}

// ────────────────────────────────────────────────────────────
// Factory
// ────────────────────────────────────────────────────────────
let cached: Provider | null = null;
export function getProvider(): Provider {
  if (cached) return cached;
  const name = (process.env.COPILOT_PROVIDER ?? 'openrouter').toLowerCase();
  if (name === 'anthropic') {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('COPILOT_PROVIDER=anthropic requires ANTHROPIC_API_KEY');
    }
    cached = new AnthropicProvider();
  } else {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('COPILOT_PROVIDER=openrouter requires OPENROUTER_API_KEY');
    }
    cached = new OpenRouterProvider();
  }
  return cached;
}

export function resetProviderForTests() {
  cached = null;
}
