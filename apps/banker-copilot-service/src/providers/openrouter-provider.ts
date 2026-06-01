/**
 * OpenRouter provider via OpenAI-compatible API.
 * Works with any model on OpenRouter (Anthropic, OpenAI, Mistral, Llama, etc.).
 * No prompt caching at this layer — we concatenate static + dynamic into a single system message.
 */
import OpenAI from 'openai';
import type {
  ChatMessage,
  ChatToolCall,
  GenerateOptions,
  GenerateResult,
  LlmProvider,
} from './types';

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterProvider implements LlmProvider {
  readonly name = 'openrouter' as const;
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required for openrouter provider');
    }
    this.client = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL || DEFAULT_BASE_URL,
      apiKey,
      defaultHeaders: {
        'HTTP-Referer': process.env.OPENROUTER_REFERER || 'https://github.com/bankerosai/bankeros',
        'X-Title': 'BankerOS Banker Copilot',
      },
    });
  }

  async generate(opts: GenerateOptions): Promise<GenerateResult> {
    // OpenAI-format system message: static + dynamic concatenated
    const systemMsg = {
      role: 'system' as const,
      content: `${opts.systemStatic}\n\n${opts.systemDynamic}`,
    };

    const openAiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemMsg,
      ...this.toOpenAIMessages(opts.messages),
    ];

    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = opts.tools.map((t) => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters as any,
      },
    }));

    const response = await this.client.chat.completions.create({
      model: opts.model,
      max_tokens: opts.maxTokens,
      messages: openAiMessages,
      tools: tools.length ? tools : undefined,
      tool_choice: tools.length ? 'auto' : undefined,
    });

    const choice = response.choices[0];
    if (!choice) {
      return {
        text: '',
        toolCalls: [],
        stopReason: 'end',
        usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      };
    }

    const toolCalls: ChatToolCall[] = (choice.message.tool_calls ?? []).map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: safeJson(tc.function.arguments),
    }));

    const stopReason: GenerateResult['stopReason'] =
      choice.finish_reason === 'tool_calls'
        ? 'tool_use'
        : choice.finish_reason === 'length'
          ? 'max_tokens'
          : 'end';

    return {
      text: choice.message.content ?? '',
      toolCalls,
      stopReason,
      usage: {
        inputTokens: response.usage?.prompt_tokens ?? 0,
        outputTokens: response.usage?.completion_tokens ?? 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
    };
  }

  private toOpenAIMessages(
    messages: ChatMessage[],
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const out: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    for (const m of messages) {
      if (m.role === 'user') {
        out.push({ role: 'user', content: m.content });
      } else if (m.role === 'assistant') {
        if (m.toolCalls && m.toolCalls.length) {
          out.push({
            role: 'assistant',
            content: m.content || null,
            tool_calls: m.toolCalls.map((tc) => ({
              id: tc.id,
              type: 'function' as const,
              function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
            })),
          });
        } else {
          out.push({ role: 'assistant', content: m.content });
        }
      } else if (m.role === 'tool') {
        out.push({
          role: 'tool',
          tool_call_id: m.toolCallId ?? '',
          content: m.content,
        });
      }
    }
    return out;
  }
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
