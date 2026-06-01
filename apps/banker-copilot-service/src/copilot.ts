/**
 * Copilot turn orchestrator — provider-agnostic.
 * Drives one round of conversation including the tool-use loop.
 * Persists session messages + final artefacts.
 *
 *   getProvider() picks Anthropic (default) or OpenRouter from env.
 *   The orchestrator never touches provider-specific SDK shapes.
 */
import {
  ALL_TOOLS,
  filterToolsForRole,
  toAnthropicSchema,
  executeTool,
  type ToolContext,
} from '@bankeros/mcp-bankeros';
import { buildSystemPrompt, PromptContext } from './system-prompt';
import { findCommand, type CommandFile, type SkillFile } from './skill-loader';
import {
  getProvider,
  getDefaultModel,
  type ChatMessage,
  type ChatToolCall,
} from './providers';
import { getStore } from './store';

const MAX_TOKENS = parseInt(process.env.COPILOT_MAX_TOKENS || '4096');
const MAX_TOOL_ROUNDS = parseInt(process.env.COPILOT_MAX_TOOL_ROUNDS || '8');

// Per-1M-token prices. Defaults match Sonnet 4.5; override per-provider as needed.
const PRICE_INPUT_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_INPUT || '3');
const PRICE_OUTPUT_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_OUTPUT || '15');
const PRICE_CACHE_READ_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_CACHE_READ || '0.3');
const PRICE_CACHE_WRITE_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_CACHE_WRITE || '3.75');

export interface RunTurnInput {
  sessionId: string;
  userMessage: string;
  promptCtx: PromptContext;
  toolCtx: Omit<ToolContext, 'role' | 'userId'>;
  skills: SkillFile[];
  commands: CommandFile[];
}

export interface RunTurnOutput {
  assistantText: string;
  toolCallCount: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  costUsd: number;
  provider: string;
  artefact?: { id: string; skill: string; subject: string };
}

function computeCost(usage: {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}): number {
  return (
    (usage.inputTokens / 1_000_000) * PRICE_INPUT_PER_MTOK +
    (usage.outputTokens / 1_000_000) * PRICE_OUTPUT_PER_MTOK +
    (usage.cacheReadTokens / 1_000_000) * PRICE_CACHE_READ_PER_MTOK +
    (usage.cacheWriteTokens / 1_000_000) * PRICE_CACHE_WRITE_PER_MTOK
  );
}

/** Convert persisted DB messages into the provider-agnostic ChatMessage shape. */
async function loadHistory(sessionId: string): Promise<ChatMessage[]> {
  const store = await getStore();
  const rows = await store.listMessages(sessionId, 40);
  const out: ChatMessage[] = [];
  for (const r of rows) {
    if (r.role === 'USER') {
      out.push({ role: 'user', content: r.content });
    } else if (r.role === 'ASSISTANT') {
      const tc = (r.toolCalls as any)?.toolCalls as ChatToolCall[] | undefined;
      out.push({ role: 'assistant', content: r.content, toolCalls: tc });
    } else if (r.role === 'TOOL') {
      const toolCallId = (r.toolCalls as any)?.tool_use_id as string | undefined;
      out.push({ role: 'tool', content: r.content, toolCallId });
    }
  }
  return out;
}

export async function runTurn(input: RunTurnInput): Promise<RunTurnOutput> {
  const { sessionId, userMessage, promptCtx, toolCtx, skills, commands } = input;

  // Resolve slash command → corresponding skill + workflow prompt
  let effectiveUserMessage = userMessage;
  let activeSkill = promptCtx.activeSkill;
  const slash = findCommand(commands, userMessage);
  if (slash) {
    const skillName = slash.cmd.name === 'fx-hedge' ? 'fx-hedging-advisor' : slash.cmd.name;
    activeSkill = skills.find((s) => s.name === skillName) ?? activeSkill;
    effectiveUserMessage = [
      `User invoked slash command: /${slash.cmd.name}`,
      slash.args ? `Arguments: ${slash.args}` : '',
      '',
      '### Workflow instructions',
      slash.cmd.body,
    ]
      .filter(Boolean)
      .join('\n');
  }

  // Filter tools to those permitted for this role
  const tools = filterToolsForRole(ALL_TOOLS, promptCtx.role).map((t: any) => {
    const schema = toAnthropicSchema(t);
    return {
      name: schema.name,
      description: schema.description,
      parameters: schema.input_schema as Record<string, unknown>,
    };
  });
  const fullToolCtx: ToolContext = {
    ...toolCtx,
    role: promptCtx.role,
    userId: promptCtx.userId,
  };

  const store = await getStore();

  // Persist the inbound user message
  await store.appendMessage({ sessionId, role: 'USER', content: userMessage, tokens: 0 });

  // Build initial messages array from history; replace the most recent USER turn
  // with the (possibly expanded) effective message.
  const messages = await loadHistory(sessionId);
  if (messages.length && messages[messages.length - 1].role === 'user') {
    messages[messages.length - 1] = { role: 'user', content: effectiveUserMessage };
  }

  const { text: systemDynamic, cached: systemStatic } = buildSystemPrompt({
    ...promptCtx,
    activeSkill,
  });

  const provider = getProvider();
  const model = getDefaultModel(provider);

  let totalIn = 0;
  let totalOut = 0;
  let totalCacheRead = 0;
  let totalCacheWrite = 0;
  let toolCallCount = 0;
  let finalText = '';

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const r = await provider.generate({
      model,
      maxTokens: MAX_TOKENS,
      systemStatic,
      systemDynamic,
      messages,
      tools,
    });

    totalIn += r.usage.inputTokens;
    totalOut += r.usage.outputTokens;
    totalCacheRead += r.usage.cacheReadTokens;
    totalCacheWrite += r.usage.cacheWriteTokens;

    if (r.text) finalText = r.text;

    if (r.stopReason !== 'tool_use' || r.toolCalls.length === 0) {
      break;
    }

    // Append the assistant turn (text + pending tool_calls) to history + messages
    messages.push({ role: 'assistant', content: r.text, toolCalls: r.toolCalls });
    await store.appendMessage({
      sessionId,
      role: 'ASSISTANT',
      content: r.text,
      toolCalls: { toolCalls: r.toolCalls },
      tokens: r.usage.outputTokens,
    });

    // Execute each tool the model requested
    for (const tc of r.toolCalls) {
      toolCallCount += 1;
      const exec = await executeTool(ALL_TOOLS, tc.name, tc.arguments, fullToolCtx);
      const content = exec.ok
        ? JSON.stringify(exec.result).slice(0, 16000)
        : `ERROR: ${exec.error}`;
      messages.push({ role: 'tool', content, toolCallId: tc.id });
      await store.appendMessage({
        sessionId,
        role: 'TOOL',
        content,
        toolCalls: { name: tc.name, input: tc.arguments, tool_use_id: tc.id, ok: exec.ok },
        tokens: 0,
      });
    }
  }

  // Persist final assistant message
  await store.appendMessage({
    sessionId,
    role: 'ASSISTANT',
    content: finalText,
    tokens: totalOut,
  });

  // Save substantial slash-command outputs as artefacts
  let artefact: RunTurnOutput['artefact'];
  if (slash && finalText.length > 400) {
    const a = await store.createArtefact({
      sessionId,
      skill: slash.cmd.name,
      subject: slash.args || '(no subject)',
      content: finalText,
    });
    artefact = { id: a.id, skill: a.skill, subject: a.subject };
  }

  const cost = computeCost({
    inputTokens: totalIn,
    outputTokens: totalOut,
    cacheReadTokens: totalCacheRead,
    cacheWriteTokens: totalCacheWrite,
  });
  await store.bumpSessionUsage(sessionId, totalIn + totalOut, cost);

  return {
    assistantText: finalText,
    toolCallCount,
    inputTokens: totalIn,
    outputTokens: totalOut,
    cacheReadTokens: totalCacheRead,
    cacheWriteTokens: totalCacheWrite,
    costUsd: cost,
    provider: provider.name,
    artefact,
  };
}
