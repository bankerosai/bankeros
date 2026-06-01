/**
 * Copilot turn orchestrator — drives one round of Claude conversation
 * including tool-use loop. Persists session messages + final artefacts.
 *
 * Anthropic SDK best practices applied:
 *   · Prompt caching on the large STATIC_IDENTITY system block
 *   · Tool-use loop continues until model returns a stop_reason of "end_turn"
 *   · Token + cost accounting persisted on the CopilotSession row
 */
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@bankeros/database';
import {
  ALL_TOOLS,
  filterToolsForRole,
  toAnthropicSchema,
  executeTool,
  type ToolContext,
} from '@bankeros/mcp-bankeros';
import { buildSystemPrompt, PromptContext } from './system-prompt';
import { findCommand, type CommandFile, type SkillFile } from './skill-loader';

// Sonnet 4.5 — current production model for production-quality drafting.
// Override via env if needed.
const MODEL = process.env.COPILOT_MODEL || 'claude-sonnet-4-5';
const MAX_TOKENS = parseInt(process.env.COPILOT_MAX_TOKENS || '4096');
// Tool-use loop bound — protects against runaway tool churn.
const MAX_TOOL_ROUNDS = parseInt(process.env.COPILOT_MAX_TOOL_ROUNDS || '8');

// Per-1M-token pricing (Sonnet 4.5 as of 2026-06). Used for session cost accounting.
const PRICE_INPUT_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_INPUT || '3');
const PRICE_OUTPUT_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_OUTPUT || '15');
const PRICE_CACHE_READ_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_CACHE_READ || '0.3');
const PRICE_CACHE_WRITE_PER_MTOK = parseFloat(process.env.COPILOT_PRICE_CACHE_WRITE || '3.75');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  artefact?: {
    id: string;
    skill: string;
    subject: string;
  };
}

function computeCost(usage: Anthropic.Messages.Usage): number {
  return (
    (usage.input_tokens / 1_000_000) * PRICE_INPUT_PER_MTOK +
    (usage.output_tokens / 1_000_000) * PRICE_OUTPUT_PER_MTOK +
    ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * PRICE_CACHE_READ_PER_MTOK +
    ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * PRICE_CACHE_WRITE_PER_MTOK
  );
}

export async function runTurn(input: RunTurnInput): Promise<RunTurnOutput> {
  const { sessionId, userMessage, promptCtx, toolCtx, skills, commands } = input;

  // Resolve slash command → corresponding skill + workflow prompt
  let effectiveUserMessage = userMessage;
  let activeSkill = promptCtx.activeSkill;
  const slash = findCommand(commands, userMessage);
  if (slash) {
    const skillName = slash.cmd.name.replace(/^fx-hedge$/, 'fx-hedging-advisor');
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
  const tools = filterToolsForRole(ALL_TOOLS, promptCtx.role);
  const toolSchemas = tools.map(toAnthropicSchema);
  const fullToolCtx: ToolContext = {
    ...toolCtx,
    role: promptCtx.role,
    userId: promptCtx.userId,
  };

  // Persist the inbound user message
  await prisma.copilotMessage.create({
    data: {
      sessionId,
      role: 'USER',
      content: userMessage,
      tokens: 0,
    },
  });

  // Build the messages array — load prior history for this session
  const history = await prisma.copilotMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    take: 40, // bounded — older turns will fall off (acceptable for P1)
  });
  const messages: Anthropic.MessageParam[] = history
    .filter((m) => m.role !== 'SYSTEM')
    .map((m) => {
      if (m.role === 'USER') return { role: 'user', content: m.content };
      if (m.role === 'ASSISTANT') return { role: 'assistant', content: m.content };
      // TOOL rows: encode as a tool_result user message
      return {
        role: 'user',
        content: [
          {
            type: 'tool_result' as const,
            tool_use_id: ((m.toolCalls as any)?.tool_use_id as string) ?? '',
            content: m.content,
          },
        ],
      };
    });
  // Replace the most recent user entry with the (possibly expanded) effective message
  if (messages.length && messages[messages.length - 1].role === 'user') {
    messages[messages.length - 1] = { role: 'user', content: effectiveUserMessage };
  }

  const { text: dynamicSystem, cached: cachedSystem } = buildSystemPrompt({
    ...promptCtx,
    activeSkill,
  });

  let totalIn = 0;
  let totalOut = 0;
  let totalCacheRead = 0;
  let totalCacheWrite = 0;
  let toolCallCount = 0;
  let finalText = '';

  // Tool-use loop
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        { type: 'text', text: cachedSystem, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: dynamicSystem },
      ],
      tools: toolSchemas as any,
      messages,
    });

    totalIn += response.usage.input_tokens;
    totalOut += response.usage.output_tokens;
    totalCacheRead += response.usage.cache_read_input_tokens ?? 0;
    totalCacheWrite += response.usage.cache_creation_input_tokens ?? 0;

    // Collect text + tool_use blocks
    const textBlocks = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    if (textBlocks) finalText = textBlocks;

    if (response.stop_reason !== 'tool_use') {
      // Done
      break;
    }

    // Append assistant message (must contain the tool_use blocks Claude returned)
    messages.push({ role: 'assistant', content: response.content });

    // Execute every requested tool
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      toolCallCount += 1;
      const exec = await executeTool(ALL_TOOLS, block.name, block.input, fullToolCtx);
      const content = exec.ok
        ? JSON.stringify(exec.result).slice(0, 16000)
        : `ERROR: ${exec.error}`;
      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content,
        is_error: !exec.ok,
      });
      // Persist tool call for audit
      await prisma.copilotMessage.create({
        data: {
          sessionId,
          role: 'TOOL',
          content,
          toolCalls: { name: block.name, input: block.input, tool_use_id: block.id, ok: exec.ok },
          tokens: 0,
        },
      });
    }
    messages.push({ role: 'user', content: toolResults });
  }

  // Persist final assistant message
  await prisma.copilotMessage.create({
    data: {
      sessionId,
      role: 'ASSISTANT',
      content: finalText,
      tokens: totalOut,
    },
  });

  // If a slash command produced a substantial artefact, save it
  let artefact: RunTurnOutput['artefact'];
  if (slash && finalText.length > 400) {
    const a = await prisma.copilotArtefact.create({
      data: {
        sessionId,
        skill: slash.cmd.name,
        subject: slash.args || '(no subject)',
        content: finalText,
        status: 'DRAFT',
      },
    });
    artefact = { id: a.id, skill: a.skill, subject: a.subject };
  }

  // Update session totals
  const cost = computeCost({
    input_tokens: totalIn,
    output_tokens: totalOut,
    cache_read_input_tokens: totalCacheRead,
    cache_creation_input_tokens: totalCacheWrite,
  });
  await prisma.copilotSession.update({
    where: { id: sessionId },
    data: {
      totalTokens: { increment: totalIn + totalOut },
      totalCost: { increment: cost },
    },
  });

  return {
    assistantText: finalText,
    toolCallCount,
    inputTokens: totalIn,
    outputTokens: totalOut,
    cacheReadTokens: totalCacheRead,
    cacheWriteTokens: totalCacheWrite,
    costUsd: cost,
    artefact,
  };
}
