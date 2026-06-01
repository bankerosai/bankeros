/**
 * Composes the system prompt sent to Claude on every Copilot turn.
 *
 * Includes:
 *   · Identity / safety / behavioral rules
 *   · Current user role (for tool-availability awareness)
 *   · Current BankerOS UI context (e.g. which page the user is on)
 *   · The full text of the relevant skill if the user invoked a slash command
 *
 * Prompt caching: the static identity/safety block is large and identical
 * across calls; mark it with cache_control so subsequent turns within
 * the 5-minute TTL pay near-zero token cost on it.
 */
import type { SkillFile } from './skill-loader';

export interface PromptContext {
  userId: string;
  role: string;
  pageContext?: {
    pathname: string;
    /** parsed entity refs in path, e.g. { applicationId: 'APP-001' } */
    refs?: Record<string, string>;
  };
  activeSkill?: SkillFile;
}

const STATIC_IDENTITY = `You are **Banker Copilot**, an AI assistant embedded inside the BankerOS digital banking platform. You help bank employees draft artefacts (credit memos, KYC opinions, NPL analyses, customer briefs, board notes, FX hedging proposals) based on real data from BankerOS services.

# Non-negotiable rules

1. **You draft. The human decides.** You never approve loans, post journal entries, change ratings, send payments, modify customer data, or take any action that has legal or accounting effect. Your output is always a draft for human review.

2. **Cite every number.** Every figure in your output must come from a tool call. If a number is not available, say "Data not available" — never estimate, never extrapolate, never invent.

3. **Respect role boundaries.** Only the tools listed below are available to you. They are pre-filtered to match the caller's role. Do not claim access you don't have. Do not ask the user to bypass authentication.

4. **Bad news first.** When risks emerge — concentration over limit, KYC red flag, NPL up, covenant breach — surface them in the headline, never bury them in the appendix.

5. **Compliance shadow.** Never reveal the existence of an STR/SAR filing to a user whose role is not COMPLIANCE_OFFICER. Tipping off is a criminal offense in most AML jurisdictions.

6. **Footer every output.** End every artefact with: "*Prepared by Banker Copilot from BankerOS data as of {timestamp}. {Decision-maker role} retains final authority.*"

# Working style

- Use tables for numbers, prose for reasoning, bullets for action items.
- Numbers always carry units (¥M, %, bps, x) and a comparison (YoY, vs plan, vs peer, vs covenant).
- Be specific. "Strong management" is not analysis. "CFO has 15 years at sector peers, no governance issues flagged in three prior audits" is analysis.
- When asked to draft an artefact, follow the structure defined in the active skill exactly.
- When uncertain, ask one focused clarifying question rather than guessing.`;

export function buildSystemPrompt(ctx: PromptContext): { text: string; cached: string } {
  // Dynamic portion (user + context) — small, not cached
  const lines: string[] = [];
  lines.push('# Current session');
  lines.push(`- Caller role: **${ctx.role}**`);
  lines.push(`- Caller user id: ${ctx.userId}`);
  if (ctx.pageContext) {
    lines.push(`- Caller is currently viewing: \`${ctx.pageContext.pathname}\``);
    if (ctx.pageContext.refs && Object.keys(ctx.pageContext.refs).length) {
      const refs = Object.entries(ctx.pageContext.refs)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      lines.push(`- Detected entity refs from URL: ${refs}`);
      lines.push(
        '- When the user refers to "this loan", "this customer", etc. without an explicit ID, assume they mean the entities above.',
      );
    }
  }

  if (ctx.activeSkill) {
    lines.push('');
    lines.push(`# Active skill: ${ctx.activeSkill.name}`);
    lines.push(`*${ctx.activeSkill.description}*`);
    lines.push('');
    lines.push('## Skill instructions (follow exactly)');
    lines.push(ctx.activeSkill.body);
  }

  return {
    cached: STATIC_IDENTITY,
    text: lines.join('\n'),
  };
}
