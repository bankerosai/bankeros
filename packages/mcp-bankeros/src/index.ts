/**
 * @bankeros/mcp-bankeros — BankerOS tools exposed to Claude via Anthropic SDK.
 *
 * Each tool is a thin wrapper over a BankerOS service endpoint with:
 *   · zod-validated parameters
 *   · role-based access control (filtered before tool list reaches Claude)
 *   · transparent JWT forwarding so downstream services see the original user
 *
 * Usage (in banker-copilot-service):
 *
 *   import { ALL_TOOLS, filterToolsForRole, toAnthropicSchema, executeTool } from '@bankeros/mcp-bankeros';
 *
 *   const tools = filterToolsForRole(ALL_TOOLS, user.role);
 *   const result = await anthropic.messages.create({
 *     model: 'claude-sonnet-4-5',
 *     tools: tools.map(toAnthropicSchema),
 *     ...
 *   });
 *   for (const block of result.content) {
 *     if (block.type === 'tool_use') {
 *       const out = await executeTool(ALL_TOOLS, block.name, block.input, ctx);
 *     }
 *   }
 */

import { zodToJsonSchema } from 'zod-to-json-schema';
import type { BankerTool, ToolContext } from './types';
import { BankerosToolError } from './http';

import { getLoanApplication, getExposure } from './tools/loans';
import { getCustomer, getKyc, getRiskRating } from './tools/customers';

export * from './types';
export { BankerosToolError } from './http';

/** Canonical tool registry — extend here when adding new tools. */
export const ALL_TOOLS: BankerTool[] = [
  getCustomer,
  getKyc,
  getRiskRating,
  getLoanApplication,
  getExposure,
];

/** Filter the tool list to only those permitted for the given role. */
export function filterToolsForRole(
  tools: BankerTool[],
  role: string,
): BankerTool[] {
  return tools.filter((t) => t.requiredRoles.includes(role));
}

/** Convert a BankerTool into the schema expected by Anthropic's tool_use API. */
export function toAnthropicSchema(tool: BankerTool) {
  const schema = zodToJsonSchema(tool.parameters, {
    target: 'openApi3',
    $refStrategy: 'none',
  }) as Record<string, unknown>;
  // Anthropic expects `input_schema` at the top level with no $schema/title
  delete (schema as any).$schema;
  delete (schema as any).title;
  return {
    name: tool.name,
    description: tool.description,
    input_schema: schema,
  };
}

/** Execute a tool by name with validated input. */
export async function executeTool(
  tools: BankerTool[],
  name: string,
  rawInput: unknown,
  ctx: ToolContext,
): Promise<{ ok: true; result: unknown } | { ok: false; error: string; status?: number }> {
  const tool = tools.find((t) => t.name === name);
  if (!tool) {
    return { ok: false, error: `Unknown tool: ${name}` };
  }
  if (!tool.requiredRoles.includes(ctx.role)) {
    return {
      ok: false,
      error: `Role "${ctx.role}" is not permitted to invoke ${name}`,
      status: 403,
    };
  }
  const parsed = tool.parameters.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: `Invalid parameters: ${parsed.error.toString()}`,
      status: 422,
    };
  }
  try {
    const result = await tool.handler(parsed.data, ctx);
    return { ok: true, result };
  } catch (e) {
    if (e instanceof BankerosToolError) {
      return { ok: false, error: e.message, status: e.status };
    }
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
