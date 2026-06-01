/**
 * Vite dev plugin that serves /v1/copilot/* directly from the dev server.
 * Eliminates the need to run a separate banker-copilot-service process for
 * local development. Production still uses the proper microservice.
 *
 * Capabilities (dev mode):
 *   GET  /v1/copilot/health
 *   GET  /v1/copilot/skills
 *   GET  /v1/copilot/mentions?q=...          — entity autocomplete for @ picker
 *   GET  /v1/copilot/artefacts               — list session artefacts
 *   GET  /v1/copilot/artefacts/:id           — single artefact
 *   POST /v1/copilot/artefacts/:id/status    — mark REVIEWED / APPROVED / DISCARDED
 *   POST /v1/copilot/sessions                — open in-memory session, optional first message
 *   POST /v1/copilot/sessions/:id/messages   — non-streaming reply
 *   POST /v1/copilot/sessions/:id/stream     — Server-Sent Events streaming reply
 */
import type { Plugin, ViteDevServer } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import matter from 'gray-matter';

// ────────────────────────────────────────────────────────────
// Proxy support — Node 18+ fetch ignores HTTPS_PROXY by default.
// Wire undici ProxyAgent so users behind Clash / Surge / corp proxies
// (common in CN / enterprise networks) can reach OpenRouter.
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// State
// ────────────────────────────────────────────────────────────
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
interface Artefact {
  id: string;
  sessionId: string;
  skill: string;
  subject: string;
  content: string;
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'DISCARDED';
  createdAt: number;
}
interface Mention {
  id: string;
  label: string;
  kind: 'customer' | 'loan' | 'lc';
  meta?: string;
}

const SESSIONS = new Map<string, Session>();
const ARTEFACTS = new Map<string, Artefact>();
let SKILLS_CACHE: Skill[] | null = null;
let COMMANDS_CACHE: { name: string }[] | null = null;

// Hardcoded mention catalogue for dev mode — production would query BankerOS.
const MENTIONS: Mention[] = [
  { id: 'CIF-884109', label: '浙江华盾包装', kind: 'customer', meta: 'SME · 杭州 · 包装制造' },
  { id: 'CIF-220184', label: '上海钢联材料', kind: 'customer', meta: '核心企业 · 钢材' },
  { id: 'CIF-330042', label: '招商局港口控股', kind: 'customer', meta: '集团客户 · 港口物流' },
  { id: 'CIF-440022', label: '深圳易达供应链', kind: 'customer', meta: 'SME · 物流' },
  { id: 'CIF-550088', label: '广东智造科技', kind: 'customer', meta: '上市公司 · 智能制造' },
  { id: 'APP-2026-0184', label: '浙江华盾 · 经营贷 ¥50M', kind: 'loan', meta: '审批中 · BBB+' },
  { id: 'APP-2026-0192', label: '招商局港口 · 流贷续作 ¥3亿', kind: 'loan', meta: '审批中' },
  { id: 'APP-2026-0218', label: '深圳易达 · 票据池融资 ¥80M', kind: 'loan', meta: '尽调中' },
  { id: 'LC2026-0184', label: 'L/C 即期 · 招商局港口 → ABC Trading', kind: 'lc', meta: 'USD 2.8M · 已开立' },
  { id: 'LC2026-0192', label: 'L/C 90 天远期 · 浙江华盾 → XYZ GmbH', kind: 'lc', meta: 'EUR 1.2M · 议付中' },
];

// ────────────────────────────────────────────────────────────
// Loaders
// ────────────────────────────────────────────────────────────
function repoRoot() {
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

// ────────────────────────────────────────────────────────────
// System prompt (Chinese — keep banking jargon bilingual when needed)
// ────────────────────────────────────────────────────────────
function buildSystemPrompt(skill?: Skill, pageContext?: { pathname?: string }): string {
  const lines: string[] = [];
  lines.push(
    `你是 **Banker Copilot**，嵌入在 BankerOS 数字银行平台内部的智能助手，服务对象是银行内部员工（客户经理、信贷官、合规官、CRO、CFO、行长、运营、财富顾问、Treasury Sales 等）。`,
    ``,
    `你的核心职责：基于 BankerOS 的真实数据，按内部规范帮员工**起草**银行内部产物 —— 信贷委员会备忘录（IC Memo）、KYC 评审意见、NPL 异动分析、客户 360 视图、董事会简报、FX 套保方案等。`,
    ``,
    `# 不可违反的规则`,
    ``,
    `1. **你只起草，决策永远归人**。你绝不批准贷款、不过账、不改评级、不发送支付、不修改任何客户数据，不做任何具有法律或会计效力的操作。你的所有产物都是"草稿"，必须经合适角色的人类审核签字才能生效。`,
    `2. **所有数字必须有出处**。每个数字都要能追溯到一次工具调用或员工提供的资料。拿不到的数据请直接说"暂无数据"，**禁止编造或推断**。`,
    `3. **角色边界不可越权**。你能用的工具已按调用者的角色（CREDIT_OFFICER / COMPLIANCE_OFFICER / CRO / CEO 等）预过滤。不要假装能访问你没有权限的数据。`,
    `4. **坏消息先讲**。当出现风险（NPL 上升、行业集中度超限、KYC 红旗、契约违反）时，**写在开头**，禁止埋在附录里。`,
    `5. **合规阴影**。如果调用者角色不是 COMPLIANCE_OFFICER，**禁止透露任何 STR/SAR 申报记录**的存在 —— 在多数 AML 司法辖区，"通风报信" (tipping off) 是刑事犯罪。`,
    `6. **每份产物必须有页脚**："*由 Banker Copilot 基于 BankerOS 数据生成于 [时间戳]。最终决策权归 [对应角色]。本草稿仅供人类专业人士复核。*"`,
    ``,
    `# 工作风格`,
    ``,
    `- **默认用中文回复**。专业银行术语保留中英对照（如"风险加权资产 (RWA)"、"流动性覆盖率 (LCR)"），便于审阅。`,
    `- 数字用表格，推理用段落，行动项用项目符号。`,
    `- 数字一定带单位（¥M / % / bps / x）和对比（同比 / 较预算 / 较同业 / 较契约）。`,
    `- 要精准。"管理层优秀"不是分析；"CFO 在同行业有 15 年经验，过去三次审计无治理问题"才是分析。`,
    `- 被要求起草标准产物时，**严格按对应 skill 的章节结构**输出，不要随意增减段落。`,
    `- 不确定时，请用一个聚焦的澄清问题，而不是猜。`,
    ``,
    `# 当前运行环境`,
    `这是开发环境，没有接通真实的 BankerOS 工具调用。在本次会话中：`,
    `- 任何"工具调用结果"请用**符合真实业务逻辑的示意数据**填充，并在产物里明确标注"（开发环境示意数据）"。`,
    `- 银行真实业务上线后，这些数字会被 BankerOS 服务的真实数据替换。`,
  );

  if (pageContext?.pathname) {
    lines.push(``, `# 当前用户所在页面`, `\`${pageContext.pathname}\``);
    lines.push(
      `当用户用"这单"、"这个客户"等指代时，请优先理解为当前页面对应的实体。`,
    );
  }

  if (skill) {
    lines.push(``, `# 当前激活的 Skill：${skill.name}`, `*${skill.description}*`, ``);
    lines.push(`## Skill 指令（严格遵守）`);
    lines.push(skill.body);
  }

  return lines.join('\n');
}

// ────────────────────────────────────────────────────────────
// OpenRouter calls
// ────────────────────────────────────────────────────────────
interface OpenRouterCfg {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
}

/**
 * Resolve OpenRouter provider override based on model prefix.
 * For Anthropic models we force Anthropic Direct to avoid AWS Bedrock's
 * region restrictions. Override via OPENROUTER_PROVIDER_ORDER=A,B,C env.
 */
function providerHintFor(model: string): Record<string, unknown> | undefined {
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

async function callOpenRouter(
  cfg: OpenRouterCfg,
  messages: ChatMsg[],
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  await ensureProxyAgent();
  const provider = providerHintFor(cfg.model);
  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/bankerosai/bankeros',
      'X-Title': 'BankerOS Banker Copilot (dev)',
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: cfg.maxTokens,
      messages,
      ...(provider ? { provider } : {}),
    }),
    ...getFetchInit(),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 400)}`);
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`OpenRouter returned non-JSON: ${text.slice(0, 200)}`);
  }
  return {
    text: String(data?.choices?.[0]?.message?.content ?? ''),
    inputTokens: data?.usage?.prompt_tokens ?? 0,
    outputTokens: data?.usage?.completion_tokens ?? 0,
  };
}

/** Stream OpenRouter completions back via SSE. Returns the full assembled text. */
async function streamOpenRouter(
  cfg: OpenRouterCfg,
  messages: ChatMsg[],
  onDelta: (chunk: string) => void,
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  await ensureProxyAgent();
  const provider = providerHintFor(cfg.model);
  const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/bankerosai/bankeros',
      'X-Title': 'BankerOS Banker Copilot (dev)',
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: cfg.maxTokens,
      messages,
      stream: true,
      ...(provider ? { provider } : {}),
    }),
    ...getFetchInit(),
  });
  if (!res.ok || !res.body) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let inputTokens = 0;
  let outputTokens = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events end with \n\n; split + process complete events
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';
    for (const ev of events) {
      const line = ev.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const json = JSON.parse(data);
        const delta = json?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta) {
          fullText += delta;
          onDelta(delta);
        }
        if (json?.usage) {
          inputTokens = json.usage.prompt_tokens ?? inputTokens;
          outputTokens = json.usage.completion_tokens ?? outputTokens;
        }
      } catch {
        /* skip malformed chunks */
      }
    }
  }
  return { text: fullText, inputTokens, outputTokens };
}

// ────────────────────────────────────────────────────────────
// Turn orchestration
// ────────────────────────────────────────────────────────────
function pickSlashSkill(
  text: string,
  skills: Skill[],
): { skill: Skill | undefined; args: string; cmdName: string | undefined } {
  const m = text.match(/^\s*\/(\S+)\s*([\s\S]*)$/);
  if (!m) return { skill: undefined, args: '', cmdName: undefined };
  const [, name, args] = m;
  const skillName = name === 'fx-hedge' ? 'fx-hedging-advisor' : name;
  return {
    skill: skills.find((s) => s.name === skillName),
    args: args.trim(),
    cmdName: name,
  };
}

function maybeCreateArtefact(
  session: Session,
  userMessage: string,
  assistantText: string,
  cmdName: string | undefined,
): Artefact | undefined {
  if (!cmdName || assistantText.length < 400) return undefined;
  const subjectMatch = userMessage.match(/^\s*\/\S+\s+(.+?)$/);
  const subject = subjectMatch?.[1]?.trim() || '（无主题）';
  const a: Artefact = {
    id: randomUUID(),
    sessionId: session.id,
    skill: cmdName,
    subject,
    content: assistantText,
    status: 'DRAFT',
    createdAt: Date.now(),
  };
  ARTEFACTS.set(a.id, a);
  return a;
}

async function buildConvo(
  session: Session,
  userMessage: string,
  pageContext: { pathname?: string } | undefined,
): Promise<{ convo: ChatMsg[]; skill?: Skill; cmdName?: string }> {
  const skills = await loadSkills();
  const { skill, args, cmdName } = pickSlashSkill(userMessage, skills);
  const effective = skill
    ? `${userMessage}\n\n（已识别斜杠命令 "/${skill.name}"，参数：${args || '无'}。严格按当前激活 skill 指令执行。）`
    : userMessage;

  const system = buildSystemPrompt(skill, pageContext);
  const convo: ChatMsg[] = [
    { role: 'system', content: system },
    ...session.messages,
    { role: 'user', content: effective },
  ];
  session.messages.push({ role: 'user', content: userMessage });
  return { convo, skill, cmdName };
}

// ────────────────────────────────────────────────────────────
// HTTP helpers
// ────────────────────────────────────────────────────────────
function readJsonBody(req: any): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: any) => (raw += chunk));
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
function setSseHeaders(res: any) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
}
function sseSend(res: any, event: string, data: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// ────────────────────────────────────────────────────────────
// Plugin
// ────────────────────────────────────────────────────────────
export function copilotDevPlugin(): Plugin {
  return {
    name: 'bankeros-copilot-dev',
    configureServer(server: ViteDevServer) {
      const apiKey = process.env.OPENROUTER_API_KEY ?? '';
      const baseUrl = process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1';
      const model = process.env.COPILOT_MODEL ?? 'anthropic/claude-sonnet-4.5';
      const maxTokens = parseInt(process.env.COPILOT_MAX_TOKENS ?? '4096');
      const cfg: OpenRouterCfg = { apiKey, baseUrl, model, maxTokens };

      server.config.logger.info(
        `[copilot-dev] mounted /v1/copilot/* → OpenRouter (${model}${providerHintFor(model) ? ' · forced provider' : ''}) ${apiKey ? '✓ key loaded' : '✗ OPENROUTER_API_KEY missing'}`,
      );

      server.middlewares.use('/v1/copilot', async (req: any, res: any) => {
        try {
          const url = (req.originalUrl || req.url || '').replace(/^\/v1\/copilot/, '');

          // GET /health
          if (req.method === 'GET' && (url === '/health' || url === '' || url === '/')) {
            return sendJson(res, 200, {
              ok: true,
              provider: 'openrouter',
              model,
              keyConfigured: !!apiKey,
              mode: 'vite-dev-plugin',
              forcedProviderOrder: providerHintFor(model)?.order,
            });
          }

          // GET /skills
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

          // GET /mentions?q=...
          if (req.method === 'GET' && url.startsWith('/mentions')) {
            const q = new URL(req.url || '', 'http://x').searchParams.get('q')?.toLowerCase() ?? '';
            const hits = MENTIONS.filter(
              (m) =>
                !q ||
                m.id.toLowerCase().includes(q) ||
                m.label.toLowerCase().includes(q),
            ).slice(0, 8);
            return sendJson(res, 200, { success: true, data: hits });
          }

          // GET /artefacts
          if (req.method === 'GET' && url === '/artefacts') {
            const list = [...ARTEFACTS.values()].sort((a, b) => b.createdAt - a.createdAt);
            return sendJson(res, 200, { success: true, data: list });
          }

          // GET /artefacts/:id
          const ag = url.match(/^\/artefacts\/([^/]+)\/?$/);
          if (req.method === 'GET' && ag) {
            const a = ARTEFACTS.get(ag[1]);
            if (!a) return sendJson(res, 404, { success: false, error: { code: 'NOT_FOUND' } });
            return sendJson(res, 200, { success: true, data: a });
          }

          // POST /artefacts/:id/status
          const as = url.match(/^\/artefacts\/([^/]+)\/status\/?$/);
          if (req.method === 'POST' && as) {
            const a = ARTEFACTS.get(as[1]);
            if (!a) return sendJson(res, 404, { success: false, error: { code: 'NOT_FOUND' } });
            const body = (await readJsonBody(req)) as any;
            const status = String(body?.status ?? '') as Artefact['status'];
            if (!['DRAFT', 'REVIEWED', 'APPROVED', 'DISCARDED'].includes(status)) {
              return sendJson(res, 422, { success: false, error: { code: 'BAD_STATUS' } });
            }
            a.status = status;
            return sendJson(res, 200, { success: true, data: a });
          }

          // POST /sessions
          if (req.method === 'POST' && url === '/sessions') {
            if (!apiKey) return notConfigured(res);
            const body = (await readJsonBody(req)) as any;
            const session: Session = {
              id: randomUUID(),
              userId: 'demo-user',
              startedAt: Date.now(),
              messages: [],
              totalInputTokens: 0,
              totalOutputTokens: 0,
            };
            SESSIONS.set(session.id, session);

            if (body?.firstMessage) {
              const result = await runTurn(session, body.firstMessage, body.pageContext, cfg);
              return sendJson(res, 200, {
                success: true,
                data: { session: { id: session.id }, result },
              });
            }
            return sendJson(res, 200, { success: true, data: { session: { id: session.id } } });
          }

          // POST /sessions/:id/messages — non-streaming
          const m = url.match(/^\/sessions\/([^/]+)\/messages\/?$/);
          if (req.method === 'POST' && m) {
            if (!apiKey) return notConfigured(res);
            const session = SESSIONS.get(m[1]);
            if (!session) return notFoundSession(res);
            const body = (await readJsonBody(req)) as any;
            const content = String(body?.content ?? '');
            if (!content) return sendJson(res, 422, { success: false, error: { code: 'EMPTY' } });
            const result = await runTurn(session, content, body?.pageContext, cfg);
            return sendJson(res, 200, { success: true, data: result });
          }

          // POST /sessions/:id/stream — Server-Sent Events
          const s = url.match(/^\/sessions\/([^/]+)\/stream\/?$/);
          if (req.method === 'POST' && s) {
            if (!apiKey) return notConfigured(res);
            const session = SESSIONS.get(s[1]);
            if (!session) return notFoundSession(res);
            const body = (await readJsonBody(req)) as any;
            const content = String(body?.content ?? '');
            if (!content) return sendJson(res, 422, { success: false, error: { code: 'EMPTY' } });

            setSseHeaders(res);
            try {
              const { convo, skill, cmdName } = await buildConvo(session, content, body?.pageContext);
              const result = await streamOpenRouter(cfg, convo, (delta) => {
                sseSend(res, 'delta', { text: delta });
              });
              session.messages.push({ role: 'assistant', content: result.text });
              session.totalInputTokens += result.inputTokens;
              session.totalOutputTokens += result.outputTokens;
              const artefact = maybeCreateArtefact(session, content, result.text, cmdName);
              sseSend(res, 'done', {
                inputTokens: result.inputTokens,
                outputTokens: result.outputTokens,
                provider: 'openrouter',
                model: cfg.model,
                skillUsed: skill?.name ?? null,
                artefact: artefact ? { id: artefact.id, skill: artefact.skill, subject: artefact.subject } : undefined,
              });
              res.end();
            } catch (err: any) {
              sseSend(res, 'error', { message: err?.message ?? String(err) });
              res.end();
            }
            return;
          }

          // GET /sessions/:id
          const g = url.match(/^\/sessions\/([^/]+)\/?$/);
          if (req.method === 'GET' && g) {
            const session = SESSIONS.get(g[1]);
            if (!session) return notFoundSession(res);
            return sendJson(res, 200, { success: true, data: session });
          }

          return sendJson(res, 404, {
            success: false,
            error: { code: 'NOT_FOUND', message: `No copilot route for ${req.method} ${url}` },
          });
        } catch (err: any) {
          const message = err?.message ?? String(err);
          server.config.logger.error(`[copilot-dev] ${message}`);
          return sendJson(res, 500, { success: false, error: { code: 'INTERNAL', message } });
        }
      });
    },
  };
}

function notConfigured(res: any) {
  return sendJson(res, 500, {
    success: false,
    error: {
      code: 'NO_API_KEY',
      message: 'OPENROUTER_API_KEY 未设置。请在仓库根 .env 加上 key 后重启 pnpm dev。',
    },
  });
}
function notFoundSession(res: any) {
  return sendJson(res, 404, {
    success: false,
    error: { code: 'NOT_FOUND', message: '会话不存在（服务可能已重启 — 在内存模式下会话会丢）' },
  });
}

async function runTurn(
  session: Session,
  userMessage: string,
  pageContext: { pathname?: string } | undefined,
  cfg: OpenRouterCfg,
) {
  const { convo, skill, cmdName } = await buildConvo(session, userMessage, pageContext);
  const result = await callOpenRouter(cfg, convo);
  session.messages.push({ role: 'assistant', content: result.text });
  session.totalInputTokens += result.inputTokens;
  session.totalOutputTokens += result.outputTokens;
  const artefact = maybeCreateArtefact(session, userMessage, result.text, cmdName);
  return {
    assistantText: result.text,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    provider: 'openrouter',
    model: cfg.model,
    skillUsed: skill?.name ?? null,
    artefact: artefact
      ? { id: artefact.id, skill: artefact.skill, subject: artefact.subject }
      : undefined,
  };
}
