/**
 * Provider-agnostic LLM interface used by the Copilot orchestrator.
 * Implementations: anthropic (native SDK + prompt caching) · openrouter (OpenAI SDK).
 *
 * The orchestrator never touches SDK shapes directly — it only sees these types.
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'tool';
  /** For role=user|assistant: plain text. For role=tool: JSON string result. */
  content: string;
  /** For role=tool: the id from the previous assistant tool_call that produced it. */
  toolCallId?: string;
  /** For role=assistant: pending tool calls the model wants to make next. */
  toolCalls?: ChatToolCall[];
}

export interface ChatToolCall {
  id: string;
  name: string;
  /** Already-parsed JSON arguments. */
  arguments: unknown;
}

export interface ToolDef {
  name: string;
  description: string;
  /** JSON Schema describing the parameters. */
  parameters: Record<string, unknown>;
}

export interface GenerateOptions {
  model: string;
  maxTokens: number;
  /** Static identity block — large, cacheable on providers that support it. */
  systemStatic: string;
  /** Dynamic context block (role, page, active skill) — small, not cached. */
  systemDynamic: string;
  messages: ChatMessage[];
  tools: ToolDef[];
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

export interface GenerateResult {
  /** Final text produced this turn (may be '' if the model only emitted tool_calls). */
  text: string;
  /** Tool calls the model wants executed. Empty when stopReason==='end'. */
  toolCalls: ChatToolCall[];
  /** 'tool_use' means we must execute toolCalls + continue; 'end' means we're done. */
  stopReason: 'tool_use' | 'end' | 'max_tokens';
  usage: Usage;
}

export interface LlmProvider {
  readonly name: 'anthropic' | 'openrouter';
  generate(opts: GenerateOptions): Promise<GenerateResult>;
}
