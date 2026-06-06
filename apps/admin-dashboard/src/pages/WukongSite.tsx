type Lang = 'zh' | 'en';
type PageKey = 'home' | 'platform' | 'openSource' | 'developers' | 'dataHealth' | 'ai' | 'pricing';

type WukongSiteProps = {
  lang?: Lang;
  page?: PageKey;
};

const pathByPage: Record<PageKey, string> = {
  home: '',
  platform: 'platform',
  openSource: 'open-source',
  developers: 'developers',
  dataHealth: 'data-health',
  ai: 'ai',
  pricing: 'pricing',
};

const nav = {
  zh: [
    ['平台', '/platform'],
    ['开源', '/open-source'],
    ['开发者', '/developers'],
    ['数据体检', '/data-health'],
    ['AI 安全', '/ai'],
    ['定价', '/pricing'],
  ],
  en: [
    ['Platform', '/en/platform'],
    ['Open Source', '/en/open-source'],
    ['Developers', '/en/developers'],
    ['Data Health', '/en/data-health'],
    ['AI Safety', '/en/ai'],
    ['Pricing', '/en/pricing'],
  ],
};

const copy = {
  zh: {
    eyebrow: 'Open-source CRM Data OS',
    title: '开源 CRM Data OS，让客户数据真正进入 AI 时代',
    subtitle:
      '不用立刻替换现有 CRM。悟空先治理分散在 Excel、旧 CRM、ERP、企业微信、钉钉、飞书里的客户数据，再把它变成可审计、可授权、可被 AI 安全调用的客户数据资产。',
    deploy: '开始开源部署',
    health: '预约客户数据体检',
    secondary: '查看平台架构',
    trust: ['开源 CRM Core', 'MySQL + ClickHouse Data Plane', 'AI Agent 权限审计', '企业微信 / 钉钉 / 飞书连接器'],
    stats: [
      ['AI-ready', '客户数据治理切口'],
      ['Source of Truth', '事务、权限、工作流'],
      ['Realtime Analytics', '客户 360 与经营驾驶舱'],
      ['Agent Audit', '每一次 AI 访问都可追踪'],
    ],
    sections: {
      platform: '五层架构，把 CRM 从业务系统升级为客户数据操作系统',
      why: '不复制 Twenty：悟空的优势是数据密集型 AI CRM',
      open: '开源是分发入口，企业级能力形成商业闭环',
      health: '先做客户数据体检，再进入 AI CRM 试点',
      safety: 'AI Agent 是受控数字员工，不是超级管理员',
    },
    finalCta: '把混乱客户数据治理成 AI 可以安全使用的客户数据资产。',
  },
  en: {
    eyebrow: 'Open-source CRM Data OS',
    title: 'Open-source CRM Data OS for AI-ready customer data',
    subtitle:
      'Do not force a CRM replacement on day one. Wukong first governs customer data spread across Excel, legacy CRM, ERP, WeCom, DingTalk and Lark, then turns it into auditable, permission-aware customer data assets AI can safely use.',
    deploy: 'Deploy Open Source',
    health: 'Book a Data Health Check',
    secondary: 'Explore architecture',
    trust: ['Open CRM Core', 'MySQL + ClickHouse Data Plane', 'AI Agent permission audit', 'WeCom / DingTalk / Lark connectors'],
    stats: [
      ['AI-ready', 'Customer data governance entry point'],
      ['Source of Truth', 'Transactions, permissions and workflows'],
      ['Realtime Analytics', 'Customer 360 and GTM dashboards'],
      ['Agent Audit', 'Every AI access is traceable'],
    ],
    sections: {
      platform: 'A five-layer architecture that turns CRM into a customer data operating system',
      why: 'Not a Twenty clone: Wukong is a data-intensive AI CRM platform',
      open: 'Open source is the distribution layer; enterprise capability closes the business loop',
      health: 'Start with customer data health, then graduate into AI CRM pilots',
      safety: 'AI agents are controlled digital workers, not super admins',
    },
    finalCta: 'Turn messy customer records into safe, AI-ready customer data assets.',
  },
};

const architecture = {
  zh: [
    ['CRM Core', '客户、联系人、线索、商机、合同、回款、任务、工单。'],
    ['Wukong Base', 'Schema、Metadata、API、权限、文件、工作流、租户和审计。'],
    ['Data Plane', 'MySQL 承载事实源，ClickHouse 承载事件、日志、分析和 AI 观测。'],
    ['Identity Fabric', 'RBAC、ABAC、ReBAC、SSO、SCIM、字段权限、行级权限。'],
    ['AI Runtime', 'RAG、Agent、模型网关、工具调用、审批、回写和成本控制。'],
  ],
  en: [
    ['CRM Core', 'Accounts, contacts, leads, opportunities, contracts, payments, tasks and cases.'],
    ['Wukong Base', 'Schema, metadata, APIs, permissions, files, workflows, tenants and audit.'],
    ['Data Plane', 'MySQL for source of truth. ClickHouse for events, logs, analytics and AI observability.'],
    ['Identity Fabric', 'RBAC, ABAC, ReBAC, SSO, SCIM, field permissions and row-level access.'],
    ['AI Runtime', 'RAG, agents, model gateway, tool calls, approvals, write-back and cost control.'],
  ],
};

const differentiators = {
  zh: [
    ['客户数据治理', '不是先要求换 CRM，而是先发现重复客户、缺失字段、归属异常和长期未跟进。'],
    ['MySQL + ClickHouse', '事务事实源与实时分析分层，支撑客户 360、AI 审计和经营驾驶舱。'],
    ['中国企业生态', '企业微信、钉钉、飞书、ERP、老 CRM、Excel、数据库迁移和实施商网络。'],
    ['AI 安全运行时', 'Agent 具备身份、权限、预算、审批、审计和撤销机制。'],
  ],
  en: [
    ['Customer data governance', 'Start with duplicates, missing fields, ownership gaps and stale accounts before forcing replacement.'],
    ['MySQL + ClickHouse', 'Separate transaction truth from realtime analytics for Customer 360, AI audit and GTM dashboards.'],
    ['China enterprise ecosystem', 'WeCom, DingTalk, Lark, ERP, legacy CRM, Excel, database migration and partner delivery.'],
    ['AI safety runtime', 'Agents have identity, permissions, budget, approvals, audit and rollback boundaries.'],
  ],
};

const pricing = {
  zh: [
    ['Community', '免费', '开源 CRM Core、Docker 部署、标准对象、基础连接器和社区支持。'],
    ['Cloud', '按用户 / 用量', '托管云、自动升级、RAG、AI Agent、文件解析、备份和监控。'],
    ['Enterprise', '年度合同', 'SSO、SCIM、高级权限、私有化、高可用、审计、安全加固和 SLA。'],
    ['Data Governance Service', '项目制', '客户数据体检、迁移、清洗、字段映射、去重合并和 AI-ready 改造。'],
  ],
  en: [
    ['Community', 'Free', 'Open CRM Core, Docker deployment, standard objects, basic connectors and community support.'],
    ['Cloud', 'Per user / usage', 'Managed cloud, upgrades, RAG, AI agents, file parsing, backup and monitoring.'],
    ['Enterprise', 'Annual contract', 'SSO, SCIM, advanced permissions, private deployment, HA, audit, hardening and SLA.'],
    ['Data Governance Service', 'Project-based', 'Data health check, migration, cleanup, field mapping, dedupe and AI-ready transformation.'],
  ],
};

const pageCopy: Record<Lang, Record<PageKey, { eyebrow: string; title: string; intro: string; cards: string[][] }>> = {
  zh: {
    home: { eyebrow: '', title: '', intro: '', cards: [] },
    platform: {
      eyebrow: 'Platform',
      title: 'Wukong Base + Data Plane + AI Runtime',
      intro: '统一 CRM 标准对象、数据运行时、权限控制平面和 AI 安全运行时，让客户数据从业务记录升级为可治理资产。',
      cards: architecture.zh,
    },
    openSource: {
      eyebrow: 'Open Source',
      title: '开源是悟空的分发入口，也是生态标准的起点',
      intro: '社区版降低部署门槛，企业级模块通过云托管、权限、审计、连接器、SLA 和私有化形成商业化空间。',
      cards: [
        ['仓库矩阵', 'wukong-schema、wukong-base、wukong-crm、wukong-connectors、wukong-ai、wukong-sdk、wukong-cli。'],
        ['部署入口', 'Docker Compose、一键示例数据、开发者 Quick Start、API 文档和贡献指南。'],
        ['许可证边界', 'Schema / SDK / Connector Spec 适合 Apache 2.0 或 MIT；Core 采用 Open Core 商业化策略。'],
        ['社区增长', '通过 GitHub/Gitee、文档、Demo 数据、连接器示例和实施商生态吸引贡献者。'],
      ],
    },
    developers: {
      eyebrow: 'Developers',
      title: '让开发者和实施商基于悟空构建行业 CRM',
      intro: '统一 Schema、API、SDK、连接器和插件运行时，避免多套后端分裂，让扩展发生在标准核心之上。',
      cards: [
        ['Schema-first', '标准 CRM 数据模型、字段、关系、权限和审计结构。'],
        ['Connectors', '企业微信、钉钉、飞书、ERP、旧 CRM、Excel、数据库和 Webhook。'],
        ['SDK / CLI', 'TypeScript、Python、Java、PHP SDK，以及部署、迁移、调试 CLI。'],
        ['Apps / Plugins', '行业模板、AI Skills、页面扩展、工作流扩展和连接器市场。'],
      ],
    },
    dataHealth: {
      eyebrow: 'Data Health',
      title: '先做客户数据体检，再谈 AI CRM',
      intro: '客户不一定愿意马上换系统，但会关心客户数据到底有多乱，以及这些数据能不能支撑 AI。',
      cards: [
        ['数据发现', '扫描 CRM、Excel、ERP、企业微信和数据库，识别客户、联系人、商机、合同和回款。'],
        ['质量画像', '空值率、重复率、字段枚举混乱、销售归属异常、长期未跟进和商机阶段异常。'],
        ['AI-ready 指数', '用可解释指标衡量客户数据是否能被 RAG、Agent 和管理层问数安全使用。'],
        ['试点包', '1 周数据体检、2 周客户 360 + AI 问答、2-4 周销售过程 AI 助手。'],
      ],
    },
    ai: {
      eyebrow: 'AI Runtime',
      title: 'AI Agent 必须可授权、可观测、可审计',
      intro: '悟空不把 AI 做成聊天框，而是建立权限感知 RAG、Agent 工具边界、ClickHouse 观测和可控写回。',
      cards: [
        ['Customer 360', '基于结构化时间线总结客户、商机、合同、风险、沟通和下一步动作。'],
        ['RAG Governance', '检索日志、引用来源、权限拦截、采纳率、失败率和评估集。'],
        ['Agent Audit', '记录谁触发、读了什么、调了什么工具、花了多少 Token、是否被人工采纳。'],
        ['Controlled Write-back', '创建任务、更新商机、发起审批、提醒销售等关键动作必须可确认和撤销。'],
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: '从开源部署到企业级数据治理',
      intro: '悟空的商业模式由开源社区、托管云、企业版、数据治理服务和伙伴市场共同组成。',
      cards: pricing.zh,
    },
  },
  en: {
    home: { eyebrow: '', title: '', intro: '', cards: [] },
    platform: {
      eyebrow: 'Platform',
      title: 'Wukong Base + Data Plane + AI Runtime',
      intro: 'Unify CRM objects, data runtime, permission control plane and AI safety runtime so customer records become governable assets.',
      cards: architecture.en,
    },
    openSource: {
      eyebrow: 'Open Source',
      title: 'Open source is the distribution layer and the start of the ecosystem standard',
      intro: 'Community lowers deployment friction. Enterprise modules monetize through cloud, permissions, audit, connectors, SLA and private deployment.',
      cards: [
        ['Repository matrix', 'wukong-schema, wukong-base, wukong-crm, wukong-connectors, wukong-ai, wukong-sdk and wukong-cli.'],
        ['Deployment entry', 'Docker Compose, sample data, developer quick start, API docs and contribution guide.'],
        ['License boundary', 'Schema, SDK and connector specs fit Apache 2.0 or MIT. Core follows an open-core strategy.'],
        ['Community growth', 'GitHub/Gitee, docs, demo data, connector examples and partner delivery bring contributors.'],
      ],
    },
    developers: {
      eyebrow: 'Developers',
      title: 'Build industry CRM products on Wukong',
      intro: 'One schema, API, SDK, connector and plugin runtime prevents backend fragmentation and keeps extensions above the standard core.',
      cards: [
        ['Schema-first', 'Standard CRM data model, fields, relationships, permissions and audit structures.'],
        ['Connectors', 'WeCom, DingTalk, Lark, ERP, legacy CRM, Excel, databases and webhooks.'],
        ['SDK / CLI', 'TypeScript, Python, Java, PHP SDKs plus deployment, migration and debugging CLI.'],
        ['Apps / Plugins', 'Industry templates, AI skills, page extensions, workflow extensions and connector marketplace.'],
      ],
    },
    dataHealth: {
      eyebrow: 'Data Health',
      title: 'Start with customer data health before AI CRM',
      intro: 'Customers may not replace CRM immediately, but they do care how messy their data is and whether it can support AI safely.',
      cards: [
        ['Discovery', 'Scan CRM, Excel, ERP, collaboration tools and databases to identify accounts, contacts, deals, contracts and payments.'],
        ['Quality profile', 'Null rate, duplicate rate, messy enums, ownership gaps, stale accounts and abnormal deal stages.'],
        ['AI-ready index', 'Explainable metrics for whether data can safely support RAG, agents and executive questions.'],
        ['Pilot packs', '1-week health check, 2-week Customer 360 + AI Q&A, 2-4 week sales AI assistant.'],
      ],
    },
    ai: {
      eyebrow: 'AI Runtime',
      title: 'AI agents must be permissioned, observable and auditable',
      intro: 'Wukong avoids shallow chatbot CRM by building permission-aware RAG, agent tool boundaries, ClickHouse observability and controlled write-back.',
      cards: [
        ['Customer 360', 'Summarize accounts, deals, contracts, risks, communication and next actions from structured timelines.'],
        ['RAG Governance', 'Retrieval logs, citations, permission blocks, adoption rate, failures and eval sets.'],
        ['Agent Audit', 'Track who triggered AI, what it read, which tools it called, token cost and human adoption.'],
        ['Controlled Write-back', 'Create tasks, update deals, start approvals and remind sales with confirmation and rollback.'],
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'From open-source deployment to enterprise data governance',
      intro: 'Wukong monetizes through community, managed cloud, enterprise modules, data governance services and partner marketplace.',
      cards: pricing.en,
    },
  },
};

function langPath(lang: Lang, page: PageKey) {
  const base = pathByPage[page];
  if (lang === 'zh') return base ? `/${base}` : '/';
  return base ? `/en/${base}` : '/en';
}

function Header({ lang, page }: { lang: Lang; page: PageKey }) {
  const otherLang = lang === 'zh' ? 'en' : 'zh';
  return (
    <header className="wk-nav">
      <a className="wk-brand" href={langPath(lang, 'home')} aria-label="Wukong CRM">
        <span className="wk-brand-mark">WK</span>
        <span>
          <strong>悟空 CRM</strong>
          <small>CRM Data OS</small>
        </span>
      </a>
      <nav className="wk-nav-links" aria-label="Primary">
        {nav[lang].map(([label, href]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>
      <div className="wk-nav-actions">
        <a className="wk-lang" href={langPath(otherLang, page)}>{lang === 'zh' ? 'EN' : '中文'}</a>
        <a className="wk-button wk-button-dark" href={langPath(lang, 'openSource')}>
          {lang === 'zh' ? '开源部署' : 'Deploy'}
        </a>
      </div>
    </header>
  );
}

function ProductMock({ lang }: { lang: Lang }) {
  const labels = lang === 'zh'
    ? ['客户 360', '数据体检', 'AI 审计', 'ClickHouse 观测']
    : ['Customer 360', 'Data Health', 'AI Audit', 'ClickHouse'];
  return (
    <div className="wk-product" aria-label="Wukong product preview">
      <div className="wk-product-sidebar">
        <span />
        <span />
        <span />
      </div>
      <div className="wk-product-main">
        <div className="wk-product-top">
          <div>
            <b>{lang === 'zh' ? '浙江启明装备集团' : 'Acme Industrial Group'}</b>
            <p>{lang === 'zh' ? 'AI-ready 指数 82 / 100' : 'AI-ready index 82 / 100'}</p>
          </div>
          <button>{lang === 'zh' ? '生成体检报告' : 'Generate report'}</button>
        </div>
        <div className="wk-product-grid">
          {labels.map((label, index) => (
            <div className="wk-product-card" key={label}>
              <small>{label}</small>
              <strong>{['1,248', '38%', '12.4k', '94ms'][index]}</strong>
              <div className={`wk-spark wk-spark-${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="wk-timeline">
          <div><span />{lang === 'zh' ? '发现 143 个重复客户，建议合并 51 组主数据。' : 'Found 143 duplicate accounts and 51 master-data merge groups.'}</div>
          <div><span />{lang === 'zh' ? 'AI Agent 查询合同风险，命中 7 条来源引用。' : 'AI Agent checked contract risk with 7 cited sources.'}</div>
          <div><span />{lang === 'zh' ? '销售经理查看华东区 Pipeline，下钻到长期未跟进客户。' : 'Sales leader inspected East pipeline and stale accounts.'}</div>
        </div>
      </div>
    </div>
  );
}

function CardGrid({ cards }: { cards: string[][] }) {
  return (
    <div className="wk-card-grid">
      {cards.map(([title, body]) => (
        <article className="wk-card" key={title}>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}

function HomePage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <section className="wk-hero">
        <div className="wk-hero-copy">
          <p className="wk-eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p className="wk-subtitle">{c.subtitle}</p>
          <div className="wk-cta-row">
            <a className="wk-button wk-button-dark" href={langPath(lang, 'openSource')}>{c.deploy}</a>
            <a className="wk-button wk-button-light" href={langPath(lang, 'dataHealth')}>{c.health}</a>
            <a className="wk-text-link" href={langPath(lang, 'platform')}>{c.secondary}</a>
          </div>
          <div className="wk-trust-row">
            {c.trust.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <ProductMock lang={lang} />
      </section>

      <section className="wk-stats">
        {c.stats.map(([value, label]) => (
          <div key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <SectionHeading title={c.sections.platform} />
      <CardGrid cards={architecture[lang]} />

      <section className="wk-split">
        <div>
          <p className="wk-eyebrow">Wukong vs Twenty</p>
          <h2>{c.sections.why}</h2>
        </div>
        <CardGrid cards={differentiators[lang]} />
      </section>

      <section className="wk-band">
        <div>
          <p className="wk-eyebrow">{lang === 'zh' ? 'Open source GTM' : 'Open source GTM'}</p>
          <h2>{c.sections.open}</h2>
        </div>
        <div className="wk-codebox">
          <span>docker compose up -d</span>
          <span>wukong seed demo-data</span>
          <span>wukong connector add wecom</span>
          <span>wukong ai audit enable</span>
        </div>
      </section>

      <SectionHeading title={c.sections.health} />
      <CardGrid cards={pageCopy[lang].dataHealth.cards} />

      <section className="wk-final-cta">
        <h2>{c.finalCta}</h2>
        <div className="wk-cta-row">
          <a className="wk-button wk-button-dark" href={langPath(lang, 'openSource')}>{c.deploy}</a>
          <a className="wk-button wk-button-light" href={langPath(lang, 'dataHealth')}>{c.health}</a>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="wk-section-heading">
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function SubPage({ lang, page }: { lang: Lang; page: PageKey }) {
  const p = pageCopy[lang][page];
  return (
    <>
      <section className="wk-page-hero">
        <p className="wk-eyebrow">{p.eyebrow}</p>
        <h1>{p.title}</h1>
        <p>{p.intro}</p>
      </section>
      {page === 'pricing' ? <PricingGrid lang={lang} /> : <CardGrid cards={p.cards} />}
      <section className="wk-final-cta wk-final-cta-small">
        <h2>{copy[lang].finalCta}</h2>
        <div className="wk-cta-row">
          <a className="wk-button wk-button-dark" href={langPath(lang, 'openSource')}>{copy[lang].deploy}</a>
          <a className="wk-button wk-button-light" href={langPath(lang, 'dataHealth')}>{copy[lang].health}</a>
        </div>
      </section>
    </>
  );
}

function PricingGrid({ lang }: { lang: Lang }) {
  return (
    <div className="wk-pricing-grid">
      {pricing[lang].map(([tier, price, body]) => (
        <article className="wk-price-card" key={tier}>
          <h3>{tier}</h3>
          <strong>{price}</strong>
          <p>{body}</p>
          <a href={tier === 'Community' ? langPath(lang, 'openSource') : langPath(lang, 'dataHealth')}>
            {lang === 'zh' ? '了解方案' : 'Learn more'}
          </a>
        </article>
      ))}
    </div>
  );
}

export default function WukongSite({ lang = 'zh', page = 'home' }: WukongSiteProps) {
  return (
    <main className="wk-site">
      <Header lang={lang} page={page} />
      {page === 'home' ? <HomePage lang={lang} /> : <SubPage lang={lang} page={page} />}
      <footer className="wk-footer">
        <div>
          <strong>悟空 CRM</strong>
          <span>CRM Data OS</span>
        </div>
        <p>{lang === 'zh' ? '开源 CRM Data OS，让客户数据真正进入 AI 时代。' : 'Open-source CRM Data OS for AI-ready customer data.'}</p>
      </footer>
    </main>
  );
}
