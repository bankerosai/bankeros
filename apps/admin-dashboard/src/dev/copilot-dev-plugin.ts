/**
 * Vite dev plugin that serves /v1/copilot/* directly from the dev server.
 * Eliminates the need to run a separate banker-copilot-service process for
 * local development. Production still uses the proper microservice (see
 * apps/banker-copilot-service).
 *
 * Capabilities (dev mode):
 *   GET  /v1/copilot/health        — readiness + provider + model
 *   GET  /v1/copilot/skills        — list skills + commands (read from disk)
 *   POST /v1/copilot/sessions      — open in-memory session, optionally first message
 *   POST /v1/copilot/sessions/:id/messages — append a message + get assistant reply
 *
 * Storage: in-memory Map<sessionId, ...>. Resets when Vite restarts.
 * Tool use: disabled for dev (chat-only). The full tool-use loop lives in
 * apps/banker-copilot-service for production.
 */
import type { Plugin, Connect, ViteDevServer } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import matter from 'gray-matter';

// Node 18+ ships undici as fetch's transport, but doesn't honour HTTP(S)_PROXY
// env vars by default. We wire up a ProxyAgent so users behind Clash / Surge /
// corporate proxies (common in CN / enterprise networks) can reach OpenRouter.
let undiciProxyAgent: any = null;
let proxyResolved = false;
async function ensureProxyAgent(): Promise<void> {
  if (proxyResolved) return;
  proxyResolved = true;
  const proxy =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy;
  if (!proxy) return;
  try {
    const undici = await import('undici');
    undiciProxyAgent = new undici.ProxyAgent(proxy);
    console.log(`[copilot-dev] using proxy: ${proxy}`);
  } catch (e: any) {
    console.warn('[copilot-dev] proxy requested but undici unavailable:', e?.message ?? e);
  }
}
function getFetchInit(): Partial<RequestInit> {
  return undiciProxyAgent ? ({ dispatcher: undiciProxyAgent } as any) : {};
}

interface ChatMsg {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
interface Session {
  id: string;
  userId: string;
  startedAt: number;
  messages: ChatMsg[];
  totalInputTokens: number;
  totalOutputTokens: number;
}
interface Skill {
  name: string;
  description: string;
  body: string;
}

const SESSIONS = new Map<string, Session>();
let SKILLS_CACHE: Skill[] | null = null;
let COMMANDS_CACHE: { name: string }[] | null = null;

function repoRoot() {
  // dev/copilot-dev-plugin.ts → admin-dashboard/src/dev → back up 4 to repo root
  return path.resolve(process.cwd(), '..', '..');
}

async function loadSkills(): Promise<Skill[]> {
  if (SKILLS_CACHE) return SKILLS_CACHE;
  const dir = path.join(repoRoot(), 'apps', 'banker-copilot', 'skills');
  const out: Skill[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const file = path.join(dir, e.name, 'SKILL.md');
      try {
        const raw = await fs.readFile(file, 'utf8');
        const parsed = matter(raw);
        const fm = parsed.data as Record<string, unknown>;
        out.push({
          name: String(fm.name ?? e.name),
          description: String(fm.description ?? ''),
          body: parsed.content,
        });
      } catch {
        /* skip */
      }
    }
  } catch (err: any) {
    console.warn('[copilot-dev] could not load skills:', err?.message);
  }
  SKILLS_CACHE = out;
  return out;
}

async function loadCommands(): Promise<{ name: string }[]> {
  if (COMMANDS_CACHE) return COMMANDS_CACHE;
  const dir = path.join(repoRoot(), 'apps', 'banker-copilot', 'commands');
  try {
    const files = await fs.readdir(dir);
    COMMANDS_CACHE = files
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ name: f.replace(/\.md$/, '') }));
  } catch {
    COMMANDS_CACHE = [];
  }
  return COMMANDS_CACHE;
}

function buildSystemPrompt(skill?: Skill, pageContext?: { pathname?: string }): string {
  const lines: string[] = [];
  lines.push(
    `You are **Banker Copilot**, embedded inside the BankerOS digital banking platform.`,
    `Help bank employees draft artefacts (credit memos, KYC opinions, NPL analyses, customer briefs, board notes, FX hedging proposals).`,
    ``,
    `Rules:`,
    `1. You draft. The human decides. You never approve loans, post transactions, or take any action with legal effect.`,
    `2. Cite every number to a source. If unavailable, say "Data not available" — never invent.`,
    `3. Bad news first. Surface risks in the headline.`,
    `4. Be specific. Numbers carry units (¥M, %, bps) and comparisons (YoY, vs plan).`,
    ``,
    `Note: this is a development environment without live BankerOS data tools.`,
    `Use realistic-looking placeholder values for any tool data and clearly mark them as illustrative.`,
  );
  if (pageContext?.pathname) {
    lines.push('', `Caller is currently viewing: \`${pageContext.pathname}\``);
  }
  if (skill) {
    lines.push('', `### Active skill: ${skill.name}`, `*${skill.description}*`, '', skill.body);
  }
  return lines.join('\n');
}

async function callOpenRouter(opts: {
  apiKey: string;
  model: string;
  baseUrl: string;
  messages: ChatMsg[];
  maxTokens: number;
}): Promise<{
  text: string;
  inputTokens: number;
  outputTokens: number;
}> {
  await ensureProxyAgent();
  const url = `${opts.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/bankerosai/bankeros',
      'X-Title': 'BankerOS Banker Copilot (dev)',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      messages: opts.messages,
    }),
    ...getFetchInit(),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 400)}`);
  }
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`OpenRouter returned non-JSON: ${text.slice(0, 200)}`);
  }
  const assistant = data?.choices?.[0]?.message?.content ?? '';
  return {
    text: String(assistant),
    inputTokens: data?.usage?.prompt_tokens ?? 0,
    outputTokens: data?.usage?.completion_tokens ?? 0,
  };
}

function readJsonBody(req: Connect.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: any, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function pickSlashSkill(text: string, skills: Skill[]): { skill: Skill | undefined; args: string } {
  const m = text.match(/^\s*\/(\S+)\s*(.*)$/);
  if (!m) return { skill: undefined, args: '' };
  const [, name, args] = m;
  const skillName = name === 'fx-hedge' ? 'fx-hedging-advisor' : name;
  return { skill: skills.find((s) => s.name === skillName), args: args.trim() };
}

export function copilotDevPlugin(): Plugin {
  return {
    name: 'bankeros-copilot-dev',
    configureServer(server: ViteDevServer) {
      const apiKey = process.env.OPENROUTER_API_KEY ?? '';
      const baseUrl = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';
      const model = process.env.COPILOT_MODEL ?? 'anthropic/claude-sonnet-4.5';
      const maxTokens = parseInt(process.env.COPILOT_MAX_TOKENS ?? '2048');

      server.config.logger.info(
        `[copilot-dev] mounted /v1/copilot/* → OpenRouter (${model}) ${apiKey ? '✓ key loaded' : '✗ OPENROUTER_API_KEY missing'}`,
      );

      server.middlewares.use('/v1/copilot', async (req, res, next) => {
        try {
          const url = (req.originalUrl || req.url || '').replace(/^\/v1\/copilot/, '');

          // ---- GET /health ----
          if (req.method === 'GET' && (url === '/health' || url === '')) {
            return sendJson(res, 200, {
              ok: true,
              provider: 'openrouter',
              model,
              keyConfigured: !!apiKey,
              mode: 'vite-dev-plugin',
            });
          }

          // ---- GET /skills ----
          if (req.method === 'GET' && url.startsWith('/skills')) {
            const [skills, commands] = await Promise.all([loadSkills(), loadCommands()]);
            return sendJson(res, 200, {
              success: true,
              data: {
                skills: skills.map((s) => ({ name: s.name, description: s.description })),
                commands,
                tools: [],
                callerRole: 'DEMO',
              },
            });
          }

          // ---- POST /sessions ----
          if (req.method === 'POST' && url === '/sessions') {
            if (!apiKey) {
              return sendJson(res, 500, {
                success: false,
                error: {
                  code: 'NO_API_KEY',
                  message:
                    'OPENROUTER_API_KEY is not set in .env. Add it and restart `pnpm dev`.',
                },
              });
            }
            const body = (await readJsonBody(req)) as any;
            const userId = 'demo-user';
            const session: Session = {
              id: randomUUID(),
              userId,
              startedAt: Date.now(),
              messages: [],
              totalInputTokens: 0,
              totalOutputTokens: 0,
            };
            SESSIONS.set(session.id, session);

            if (body?.firstMessage) {
              const result = await runTurn(session, body.firstMessage, body.pageContext, {
                apiKey,
                model,
                baseUrl,
                maxTokens,
              });
              return sendJson(res, 200, {
                success: true,
                data: { session: { id: session.id }, result },
              });
            }
            return sendJson(res, 200, { success: true, data: { session: { id: session.id } } });
          }

          // ---- POST /sessions/:id/messages ----
          const m = url.match(/^\/sessions\/([^/]+)\/messages\/?$/);
          if (req.method === 'POST' && m) {
            if (!apiKey) {
              return sendJson(res, 500, {
                success: false,
                error: {
                  code: 'NO_API_KEY',
                  message: 'OPENROUTER_API_KEY is not set in .env. Add it and restart `pnpm dev`.',
                },
              });
            }
            const session = SESSIONS.get(m[1]);
            if (!session) {
              return sendJson(res, 404, {
                success: false,
                error: { code: 'NOT_FOUND', message: 'Session not found (server may have restarted).' },
              });
            }
            const body = (await readJsonBody(req)) as any;
            const content = String(body?.content ?? '');
            if (!content) {
              return sendJson(res, 422, {
                success: false,
                error: { code: 'VALIDATION', message: 'Empty message' },
              });
            }
            const result = await runTurn(session, content, body?.pageContext, {
              apiKey,
              model,
              baseUrl,
              maxTokens,
            });
            return sendJson(res, 200, { success: true, data: result });
          }

          // ---- GET /sessions/:id ----
          const g = url.match(/^\/sessions\/([^/]+)\/?$/);
          if (req.method === 'GET' && g) {
            const session = SESSIONS.get(g[1]);
            if (!session) {
              return sendJson(res, 404, { success: false, error: { code: 'NOT_FOUND' } });
            }
            return sendJson(res, 200, { success: true, data: session });
          }

          // Unknown copilot path → 404
          return sendJson(res, 404, {
            success: false,
            error: { code: 'NOT_FOUND', message: `No copilot route for ${req.method} ${url}` },
          });
        } catch (err: any) {
          const message = err?.message ?? String(err);
          server.config.logger.error(`[copilot-dev] ${message}`);
          return sendJson(res, 500, {
            success: false,
            error: { code: 'INTERNAL', message },
          });
        }
      });
    },
  };
}

async function runTurn(
  session: Session,
  userMessage: string,
  pageContext: { pathname?: string } | undefined,
  cfg: { apiKey: string; model: string; baseUrl: string; maxTokens: number },
) {
  const skills = await loadSkills();
  const { skill, args } = pickSlashSkill(userMessage, skills);

  // Expand slash command into a workflow instruction the model can follow
  const effective = skill
    ? `${userMessage}\n\n(Resolved slash command "/${skill.name}" with arguments: ${args || 'none'}. Follow the active skill instructions exactly.)`
    : userMessage;

  // Build the conversation: system + prior turns + this turn
  const system = buildSystemPrompt(skill, pageContext);
  const convo: ChatMsg[] = [
    { role: 'system', content: system },
    ...session.messages,
    { role: 'user', content: effective },
  ];

  // Persist user message first
  session.messages.push({ role: 'user', content: userMessage });

  const result = await callOpenRouter({
    apiKey: cfg.apiKey,
    model: cfg.model,
    baseUrl: cfg.baseUrl,
    messages: convo,
    maxTokens: cfg.maxTokens,
  });

  session.messages.push({ role: 'assistant', content: result.text });
  session.totalInputTokens += result.inputTokens;
  session.totalOutputTokens += result.outputTokens;

  return {
    assistantText: result.text,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    provider: 'openrouter',
    model: cfg.model,
    skillUsed: skill?.name ?? null,
  };
}
