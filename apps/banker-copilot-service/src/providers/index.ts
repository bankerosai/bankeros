/**
 * Provider factory. Picks the implementation from COPILOT_PROVIDER env var.
 *
 *   COPILOT_PROVIDER=anthropic   (default) — direct Anthropic SDK, prompt caching
 *   COPILOT_PROVIDER=openrouter           — OpenAI SDK pointed at OpenRouter
 */
import type { LlmProvider } from './types';
import { AnthropicProvider } from './anthropic-provider';
import { OpenRouterProvider } from './openrouter-provider';

export type { LlmProvider, GenerateOptions, GenerateResult, ChatMessage, ChatToolCall, ToolDef, Usage } from './types';

let cached: LlmProvider | null = null;

export function getProvider(): LlmProvider {
  if (cached) return cached;
  const name = (process.env.COPILOT_PROVIDER ?? 'anthropic').toLowerCase();
  switch (name) {
    case 'openrouter':
      cached = new OpenRouterProvider();
      break;
    case 'anthropic':
    default:
      cached = new AnthropicProvider();
      break;
  }
  return cached;
}

/** Sensible default model per provider — overridden by COPILOT_MODEL env. */
export function getDefaultModel(provider: LlmProvider): string {
  if (process.env.COPILOT_MODEL) return process.env.COPILOT_MODEL;
  if (provider.name === 'openrouter') return 'anthropic/claude-sonnet-4.5';
  return 'claude-sonnet-4-5';
}
