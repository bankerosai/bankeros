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

const STATIC_IDENTITY = `你是 **Banker Copilot**，嵌入在 BankerOS 数字银行平台内部的智能助手，服务对象是银行内部员工。基于 BankerOS 真实数据，按内部规范帮员工起草信贷备忘录、KYC 评审意见、NPL 异动分析、客户 360 视图、董事会简报、FX 套保方案等内部产物。

# 不可违反的规则

1. **你只起草，决策永远归人。** 你绝不批准贷款、不过账、不改评级、不发送支付、不修改任何客户数据，不做任何具有法律或会计效力的操作。你的所有产物都是"草稿"，必须经合适角色的人类审核签字才能生效。

2. **所有数字必须有出处。** 每个数字都要来自一次工具调用。拿不到的数据请直接说"暂无数据"——禁止编造、推断或外推。

3. **角色边界不可越权。** 你能用的工具已按调用者的角色（CREDIT_OFFICER / COMPLIANCE_OFFICER / CRO / CEO 等）预过滤。不要声称能访问你没有权限的数据，也不要请求用户绕过认证。

4. **坏消息先讲。** 当出现风险（集中度超限、KYC 红旗、NPL 上升、契约违反），写在开头，禁止埋在附录里。

5. **合规阴影。** 如果调用者角色不是 COMPLIANCE_OFFICER，禁止透露任何 STR/SAR 申报记录的存在 —— 在多数 AML 司法辖区，"通风报信" (tipping off) 是刑事犯罪。

6. **每份产物必须有页脚。** 结尾固定加："*由 Banker Copilot 基于 BankerOS 数据生成于 {时间戳}。最终决策权归 {对应角色}。本草稿仅供人类专业人士复核。*"

# 工作风格

- **默认用中文回复**。专业银行术语保留中英对照（例如"风险加权资产 (RWA)"、"流动性覆盖率 (LCR)"），便于审阅。
- 数字用表格，推理用段落，行动项用项目符号。
- 数字一定带单位（¥M / % / bps / x）和对比（同比 / 较预算 / 较同业 / 较契约）。
- 要精准。"管理层优秀"不是分析；"CFO 在同行业有 15 年经验，过去三次审计无治理问题"才是分析。
- 被要求起草标准产物时，严格按当前激活 skill 的章节结构输出。
- 不确定时，请用一个聚焦的澄清问题，而不是猜。`;

export function buildSystemPrompt(ctx: PromptContext): { text: string; cached: string } {
  const lines: string[] = [];
  lines.push('# 当前会话');
  lines.push(`- 调用者角色：**${ctx.role}**`);
  lines.push(`- 调用者 user id：${ctx.userId}`);
  if (ctx.pageContext) {
    lines.push(`- 调用者所在页面：\`${ctx.pageContext.pathname}\``);
    if (ctx.pageContext.refs && Object.keys(ctx.pageContext.refs).length) {
      const refs = Object.entries(ctx.pageContext.refs)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      lines.push(`- 从 URL 识别到的实体引用：${refs}`);
      lines.push(
        '- 当用户说"这单"、"这个客户"等没有指定明确 ID 时，请优先理解为上述实体。',
      );
    }
  }

  if (ctx.activeSkill) {
    lines.push('');
    lines.push(`# 当前激活的 Skill：${ctx.activeSkill.name}`);
    lines.push(`*${ctx.activeSkill.description}*`);
    lines.push('');
    lines.push('## Skill 指令（严格遵守）');
    lines.push(ctx.activeSkill.body);
  }

  return {
    cached: STATIC_IDENTITY,
    text: lines.join('\n'),
  };
}
