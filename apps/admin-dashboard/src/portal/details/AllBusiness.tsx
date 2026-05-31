/**
 * Business banking detail pages:
 * Commercial / Corporate / CrossBorder / Payroll / API / IPO / M&A / Bonds
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

const commercialCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '商业银行 (1-50亿)' }],
  category: 'Commercial Banking', productName: '商业银行',
  tagline: '年营收 1-50 亿企业首选 · 综合现金管理 + 供应链金融 + 贸易融资',
  badge: '中型企业一站式',
  bullets: ['年营收 1-50 亿企业', '综合现金管理', '供应链金融', '贸易融资', '专属客户经理', '与 ERP 直连'],
  background: 'navy',
  ctaPrimary: { label: '商业银行咨询', to: '/help' },
  overview: {
    description: '商业银行服务面向年营收 1-50 亿的中型企业 (上市公司 / 行业龙头 / 准上市公司)。\n\n提供企业全生命周期金融服务：① 现金管理 (资金池/支付/对账)；② 信贷融资 (流贷/项目贷/银团);③ 贸易融资 (L/C/保函/出口押汇);④ 国际业务 (跨境支付/外汇)。',
    benchmark: '对标 招行公司业务 · HSBC Commercial Banking · 渣打 Business',
    params: [['目标企业', '年营收 ¥ 1-50 亿'], ['服务深度', '综合金融解决方案'], ['授信额度', '¥ 5,000 万 - ¥ 50 亿'], ['关系经理', '专属 1v1'], ['服务网点', '全国 200+ 分行']],
  },
  features: [
    { icon: '🏦', title: '综合现金管理', desc: '集团多账户/资金池/智能预测 · 提升资金使用效率 30%+' },
    { icon: '💳', title: '信贷融资', desc: '流动资金贷 / 项目贷 / 银团贷款 / 并购贷款' },
    { icon: '🚢', title: '贸易融资', desc: 'L/C / 保函 / 出口押汇 / 福费廷一站式' },
    { icon: '👔', title: '专属客户经理', desc: '资深行业专家 1v1 · 季度战略复盘' },
    { icon: '🔌', title: 'ERP 直连', desc: 'SAP / Oracle / Kingdee / 用友 自动对接' },
  ],
  useCases: [
    { persona: '上市公司财务', icon: '📊', scenario: '上市公司需要专业化、合规化资金管理', benefit: '满足 SOX / 内控要求', example: '某 A 股上市公司 · 全集团 80 家子公司资金管理' },
    { persona: '行业龙头', icon: '🏭', scenario: '制造业/零售/科技龙头 · 上下游链长', benefit: '供应链金融帮助上下游', example: '某汽车主机厂 · 1000 家供应商应收账款保理' },
    { persona: '准上市公司', icon: '📈', scenario: 'Pre-IPO 阶段 · 财务规范化升级', benefit: 'BankerOS IPO 辅导 + 资金管理', example: '某 Pre-IPO 科技公司 · 财务规范化 12 个月' },
  ],
  process: [
    { step: '01', actor: '企业', title: '客户经理拜访', desc: '资深 RM 上门访谈' },
    { step: '02', actor: '银行', title: '方案设计', desc: '量身定制综合金融方案' },
    { step: '03', actor: '银行', title: '授信落地', desc: '5-15 工作日完成' },
    { step: '04', actor: '银行', title: '持续服务', desc: '季度复盘 + 新需求支持' },
  ],
  caseStudy: {
    company: '某 A 股科技公司', logo: '💻', industry: '年营收 ¥30 亿 · 全球 8 家子公司',
    challenge: '上市后财务管理升级需求：① 80 家分子公司资金池；② 供应商账期金融；③ 跨境美元收款；④ 满足 SOX 内控。',
    solution: 'BankerOS 综合方案：① 三级资金池 (集团-区域-子公司)；② 供应链保理 ¥3 亿额度；③ 跨境美元账户；④ Maker-Checker 工作流。',
    results: [{ metric: '资金归集', value: '99.5%' }, { metric: '利息节省', value: '¥ 4,200 万/年' }, { metric: '审计合规', value: '✓' }, { metric: '人效提升', value: '+ 60%' }],
    quote: 'BankerOS 不只是银行，更像我们的财务转型顾问。上市后我们的财务管理能力直接对标世界 500 强。',
    quoteAuthor: '某 A 股科技公司 CFO',
  },
  ctaTitle: '商业银行专属服务', ctaDesc: '客户经理 24h 内联系',
  ctaButton: { label: '咨询客户经理', to: '/help' },
};

const corporateCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '大型企业 (>50亿)' }],
  category: 'Corporate Banking', productName: '大型企业银行',
  tagline: '世界 500 强 + 央国企 · 全球综合金融服务 · 投行 + 银团 + GTS',
  badge: '世界 500 强专属',
  bullets: ['世界 500 强 / 央国企', '全球综合金融', '银团贷款 (¥10-1000 亿)', '投资银行业务', 'GTS 全球交易服务', '专属银行家团队'],
  background: 'black',
  ctaPrimary: { label: '战略合作咨询', to: '/help' },
  overview: {
    description: '大型企业银行 (Corporate & Investment Banking) 服务世界 500 强、央企国企、行业龙头集团。\n\n提供战略级金融解决方案：① 投行业务 (IPO/再融资/并购);② 银团贷款 (¥10 亿-¥1,000 亿);③ 跨境综合服务 (全球现金管理 + 国际结算);④ 资本市场 (债券发行/股权配售)。',
    benchmark: '对标 中行公司业务 · HSBC GBM · Citi ICG',
    params: [['目标企业', '年营收 ¥ 50 亿+'], ['授信规模', '¥ 10 亿 - ¥ 1,000 亿'], ['服务团队', '银行家 + 投行家 + 律师'], ['全球网络', '64 国 450 分行']],
  },
  features: [
    { icon: '💼', title: '投资银行', desc: 'IPO 辅导 / 再融资 / 并购财务顾问 / 私募融资' },
    { icon: '🏦', title: '银团贷款', desc: '担任牵头行 · 撮合 10-20 家银行 · 单笔 ¥100 亿+' },
    { icon: '🌐', title: 'GTS 全球服务', desc: '64 国分行联动 · 跨境现金管理 · 国际结算' },
    { icon: '📊', title: '资本市场', desc: '熊猫债 / 点心债 / 欧债 / 美债发行' },
  ],
  useCases: [
    { persona: '央企国企', icon: '🏛', scenario: '中央/省属国企 · 战略转型/海外并购', benefit: '银团贷款 + 投行服务', example: '某央企海外并购 $20 亿 · BankerOS 牵头 5 家银团' },
    { persona: '科技独角兽', icon: '🚀', scenario: '估值 100 亿+ · Pre-IPO 阶段', benefit: 'IPO 辅导 + Pre-IPO 融资', example: '某独角兽 $5 亿 D 轮融资 + 港股 IPO' },
  ],
  process: [
    { step: '01', actor: '银行', title: '战略合作签约', desc: '高层会晤 · 签订《战略合作协议》' },
    { step: '02', actor: '银行', title: '专属团队', desc: '配置 5-10 人专属银行家团队' },
    { step: '03', actor: '银行', title: '量身方案', desc: '复杂需求 4-12 周方案设计' },
    { step: '04', actor: '银行', title: '执行交付', desc: '银团 / IPO / 并购 全周期支持' },
  ],
  caseStudy: {
    company: '某央企集团', logo: '🏛', industry: '世界 500 强 · 年营收 ¥3,000 亿',
    challenge: '海外并购欧洲某能源公司 $50 亿 · 需要：① 跨境融资；② 并购财务顾问；③ 反垄断审查协助；④ 后期整合融资。',
    solution: 'BankerOS 担任独家财务顾问 + 银团贷款牵头行 · 撮合 12 家中外银行组成 $30 亿银团 + 投行团队全程跟踪反垄断 + Cayman 跨境架构。',
    results: [{ metric: '银团规模', value: '$ 30 亿' }, { metric: '银团成员', value: '12 家' }, { metric: '签约用时', value: '8 个月' }, { metric: '反垄断', value: '✓ 通过' }],
    quote: 'BankerOS 不仅给资金，更给我们战略级的支持。这单跨国并购的成功，BankerOS 团队功不可没。',
    quoteAuthor: '某央企集团 CEO',
  },
  ctaTitle: '战略级金融合作伙伴', ctaDesc: '世界 500 强首选',
  ctaButton: { label: '战略合作咨询', to: '/help' },
};

const crossBorderCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '跨境结算' }],
  category: 'Cross-Border Settlement', productName: '跨境结算',
  tagline: 'SWIFT GPI · ISO 20022 · 200+ 国家 · 6 小时到账 · 全程追踪',
  badge: 'SWIFT GPI · 全程追踪',
  bullets: ['SWIFT GPI 全程可追踪', 'ISO 20022 标准报文', '200+ 国家直连', '6 小时到账', '12 种货币', '配套贸易融资'],
  background: 'navy',
  ctaPrimary: { label: '跨境结算咨询', to: '/help' },
  overview: {
    description: '企业跨境结算是 BankerOS 为外贸/跨国企业提供的全球支付收款服务。\n\n基于 SWIFT GPI (Global Payments Innovation) 网络，提供：① 实时追踪 (查询付款进度类似快递);② 当日到账 (90% 跨境付款 6 小时内到账);③ 透明费用 (中介行费用提前披露)。',
    benchmark: '对标 招行国际业务 · 工行环球行 · HSBC Trade & Payments',
    params: [['网络覆盖', '200+ 国家 / 60+ 主要贸易港'], ['到账时长', '6 小时 (90% 通道)'], ['支持币种', '12 种主流'], ['报文标准', 'ISO 20022 / SWIFT MT'], ['查询', 'SWIFT GPI 实时']],
  },
  features: [
    { icon: '🌐', title: 'SWIFT GPI 追踪', desc: '从付款到收款全程可视化 · 类似快递物流' },
    { icon: '⚡', title: '6 小时到账', desc: '90% 主流通道 6 小时内到账 · 显著快于行业平均 1-3 天' },
    { icon: '📋', title: 'ISO 20022', desc: '标准化报文 · 信息更完整 · 减少差错率' },
    { icon: '💰', title: '透明费用', desc: '付款前提前披露中介行费用 · 无隐藏收费' },
    { icon: '🤖', title: 'API 集成', desc: 'ERP / SAP / Oracle 直连发起付款 · 自动对账' },
  ],
  useCases: [
    { persona: '外贸出口商', icon: '🚢', scenario: '从欧美/东南亚客户收款', benefit: 'GPI 追踪 · 实时知道收款状态', example: '某义乌出口商 · 月收款 $200 万 · GPI 实时追踪' },
    { persona: '进口商', icon: '📦', scenario: '向海外供应商付款', benefit: '6 小时到账保供应链顺畅', example: '某进口商 $80 万付德国 · 6 小时到账' },
    { persona: '跨国集团', icon: '🏢', scenario: '集团内部跨境调拨资金', benefit: '12 种货币一站式', example: '某集团美中欧三地资金调度' },
  ],
  process: [
    { step: '01', actor: '企业', title: '在线发起', desc: 'Web/API/ERP 提交付款指令' },
    { step: '02', actor: '银行', title: 'KYC / 反洗钱', desc: 'AI 自动审核 · 1 分钟' },
    { step: '03', actor: 'SWIFT', title: 'GPI 传输', desc: '通过 SWIFT 网络 · 实时追踪' },
    { step: '04', actor: '收款行', title: '到账', desc: '6 小时内入账' },
  ],
  caseStudy: {
    company: '某进出口公司', logo: '🚢', industry: '年贸易额 $5 亿 · 50+ 国家客户',
    challenge: '过去用传统跨境付款：① 2-5 天到账 (客户经常催);② 中介行收费不透明 (50-200 美元/笔);③ 经常因为信息不全被退回。',
    solution: 'BankerOS GPI + ISO 20022 + ERP 直连：① 90% 付款 6 小时到账；② 中介费提前显示；③ ISO 20022 减少信息缺失；④ ERP 自动发起。',
    results: [{ metric: '平均到账', value: '5h (从 3 天)' }, { metric: '退单率', value: '0.5% (从 8%)' }, { metric: '中介费节省', value: '$ 4 万/年' }, { metric: '人工节省', value: '60%' }],
    quote: 'GPI 让我们从此告别"跨境付款的黑箱"。现在客户问钱到哪里了，我直接发给他追踪链接。',
    quoteAuthor: '某进出口公司 CFO',
  },
  ctaTitle: '极速 · 透明 · 可追踪', ctaDesc: '6 小时到账 · 200+ 国家',
  ctaButton: { label: '跨境结算咨询', to: '/help' },
};

const payrollCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '薪资代发' }],
  category: 'Payroll Service', productName: '企业薪资代发',
  tagline: '一次上传 · 多币种秒到 · 集成个税/公积金/社保',
  badge: '人力部首选',
  bullets: ['一次上传一键发放', '多币种支持', '秒级到账', '自动个税公积金计算', '电子工资条', '与 HR 系统集成'],
  background: 'navy',
  ctaPrimary: { label: '薪资代发咨询', to: '/help' },
  overview: {
    description: '企业薪资代发是 BankerOS 为企业 HR 部门提供的员工薪酬一站式服务。\n\n核心价值：① 一次上传 (Excel/API/HR 系统) 即可批量发放；② 多币种秒到 (员工外籍/外派也支持);③ 自动代扣个税/公积金/社保;④ 员工 App 查询电子工资条。\n\n服务对象：50 人以上规模企业。',
    benchmark: '对标 招行薪福通 · 平安壹钱包 · 工行薪资管家',
    params: [['服务规模', '50 - 100,000 人企业'], ['到账时长', '秒级 (本行) / T+0 (跨行)'], ['支持币种', '12 种主流'], ['一次发放上限', '不限'], ['集成方式', 'Excel / API / HR 系统']],
  },
  features: [
    { icon: '⚡', title: '秒级到账', desc: '本行员工秒级 · 跨行 5 分钟 · 跨境 6 小时' },
    { icon: '🧾', title: '自动代扣', desc: '个税 / 公积金 / 社保 / 企业年金一站计算' },
    { icon: '📱', title: '员工 App', desc: '员工查询电子工资条 · 历史记录 · 一键报税' },
    { icon: '🔌', title: 'HR 系统集成', desc: '与 SAP SuccessFactors / Workday / 钉钉 / 飞书直连' },
  ],
  useCases: [
    { persona: '中小企业 HR', icon: '👥', scenario: '50-500 人企业 · HR 人手紧张', benefit: '免人工核算 · 减少错误', example: '某科技公司 200 员工 · HR 人月节省 8 小时' },
    { persona: '跨国公司', icon: '🌍', scenario: '外籍员工/外派员工 · 多币种工资', benefit: '一次提交多币种发放', example: '某跨国公司中外 1,000 员工 · 8 种币种一次发' },
  ],
  process: [
    { step: '01', actor: 'HR', title: '上传名单', desc: 'Excel / API / HR 系统' },
    { step: '02', actor: '系统', title: '自动计算', desc: '个税 / 公积金 / 社保扣减' },
    { step: '03', actor: 'HR', title: '审批', desc: 'Maker-Checker 双人复核' },
    { step: '04', actor: '银行', title: '批量发放', desc: '秒级到账 · 短信通知员工' },
  ],
  caseStudy: {
    company: '某连锁餐饮集团', logo: '🍽', industry: '500 家门店 · 8,000 员工',
    challenge: '员工工资发放：① 8,000 员工分布 30 个城市；② 每月 25 号统一发；③ HR 需手工核算个税/公积金/外卖兼职费用。',
    solution: 'BankerOS 薪资代发 + 与企业 HR 系统集成：员工数据自动同步 · 一键发放 · 个税公积金自动扣减 · 员工 App 查询。',
    results: [{ metric: 'HR 时间节省', value: '40 小时/月' }, { metric: '差错率', value: '0% (从 0.5%)' }, { metric: '到账时长', value: '15 秒 (从 2 天)' }, { metric: '员工满意度', value: '+ 30%' }],
    quote: '从"工资发完累瘫"到"一键搞定"，HR 部门可以做更有价值的事。',
    quoteAuthor: '某连锁餐饮 HR 总监',
  },
  ctaTitle: '让 HR 从繁琐中解放', ctaDesc: '一次上传 · 秒级到账 · 自动税务',
  ctaButton: { label: '薪资代发咨询', to: '/help' },
};

const apiBankCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: 'API 银行' }],
  category: 'API Banking', productName: 'API 银行',
  tagline: 'REST API + Webhook + ISO 20022 · 与 ERP 直连 · 99.99% SLA',
  badge: '开发者首选',
  bullets: ['100+ 标准 API', 'OAuth 2.0 + mTLS 双重认证', 'ISO 20022 标准报文', 'Webhook 实时推送', '99.99% SLA', '7×24 技术支持'],
  background: 'navy',
  ctaPrimary: { label: '获取 API 文档', to: '/about/innovation' },
  overview: {
    description: 'API 银行 (Banking-as-a-Service) 为企业提供完整的开放金融 API 集合。\n\n企业 IT 系统 (ERP / SaaS / 电商) 可以通过 API 直接对接 BankerOS，实现：① 自动发起支付/查询余额/对账；② 在自己产品中嵌入银行账户和支付功能；③ 实时获取交易数据。',
    benchmark: '对标 Stripe · Plaid · 招行 API · Citi APIs · HSBC Connect',
    params: [['API 数量', '100+'], ['认证', 'OAuth 2.0 + mTLS'], ['报文标准', 'ISO 20022 + REST JSON'], ['SLA', '99.99%'], ['QPS', '5,000+'], ['费用', '按调用量 / 包年']],
  },
  features: [
    { icon: '🔌', title: '100+ 标准 API', desc: '账户/支付/转账/外汇/贷款/卡片全覆盖' },
    { icon: '🔒', title: 'OAuth 2.0 + mTLS', desc: '银行级安全双重认证 · 符合 FAPI 1.0 Advanced 标准' },
    { icon: '⚡', title: 'Webhook 推送', desc: '账户变动实时推送至客户系统 · 无需轮询' },
    { icon: '📚', title: '完整文档', desc: 'Swagger UI + Postman + SDK (Java/Python/Go/Node)' },
    { icon: '🛡', title: '99.99% SLA', desc: '99.99% 可用性承诺 · 双活数据中心' },
  ],
  useCases: [
    { persona: '跨境电商', icon: '🛒', scenario: '电商平台自动结算到卖家账户', benefit: '集成银行 API 自动分账', example: '某跨境电商日均 10,000 笔分账 · 全自动' },
    { persona: 'SaaS 公司', icon: '☁️', scenario: '财务 SaaS 自动对账 / 发票', benefit: 'API 实时获取流水数据', example: '某财务 SaaS · 客户银行流水自动入账' },
    { persona: '集团企业 ERP', icon: '🏢', scenario: 'SAP / Oracle 自动发起付款', benefit: '财务部 0 手工操作', example: '某集团月发 5,000 笔款 · 100% API 自动' },
  ],
  process: [
    { step: '01', actor: '企业', title: '申请开通', desc: '企业资料 + 业务场景说明' },
    { step: '02', actor: '银行', title: '审批授权', desc: '7-15 工作日完成' },
    { step: '03', actor: '企业', title: '技术对接', desc: '获取 API Key · 联调测试 (2-4 周)' },
    { step: '04', actor: '企业', title: '上线生产', desc: '正式调用 API · 实时监控' },
  ],
  caseStudy: {
    company: '某跨境电商平台', logo: '🛒', industry: '日均订单 50K · 跨境分账',
    challenge: '电商平台需要把每笔订单按比例分给卖家 (70%) / 物流 (15%) / 平台 (15%)。人工对账无法承载日均 5 万笔订单。',
    solution: 'BankerOS API 银行集成：每笔订单触发自动分账 API · 实时分别打款给卖家/物流/平台。',
    results: [{ metric: '日均交易', value: '50,000 笔' }, { metric: '到账', value: '秒级' }, { metric: '人力节省', value: '5 FTE' }, { metric: '客户满意度', value: '+ 40%' }],
    quote: 'API 银行让我们从"人工对账噩梦"变成"全自动金融基础设施"。开发对接只用 4 周，从此再也不用关心钱怎么动了。',
    quoteAuthor: '某跨境电商 CTO',
  },
  ctaTitle: '开放金融 · 与您共创', ctaDesc: '99.99% SLA · 7×24 技术支持',
  ctaButton: { label: '获取 API 文档', to: '/about/innovation' },
};

const ipoCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '资本市场' }, { label: 'IPO 上市辅导' }],
  category: 'IPO Advisory', productName: 'IPO 上市辅导',
  tagline: 'Pre-IPO 融资 · A 股 / 港股 / 美股辅导 · 全程跟踪 12-24 个月',
  badge: '资本市场全周期',
  bullets: ['Pre-IPO 融资 ¥5-50 亿', 'A 股 / 港股 / 美股全覆盖', '保荐人 + 律师 + 会计师组队', '12-24 个月全周期', '招股说明书撰写', '路演组织'],
  background: 'navy',
  ctaPrimary: { label: 'IPO 辅导咨询', to: '/help' },
  overview: {
    description: 'BankerOS 投行业务 IPO 辅导服务覆盖企业上市全周期 · 12-24 个月。\n\n服务内容：① Pre-IPO 融资 (D/E 轮股权融资);② 上市辅导 (财务规范化 + 内控改善);③ 招股说明书撰写 + 反馈;④ 路演组织 (港股 / 美股);⑤ 上市后再融资 (定增 / 配股)。',
    benchmark: '对标 中信证券 · 中金公司 · 高盛中国',
    params: [['服务范围', 'A 股 / 港股 / 美股'], ['Pre-IPO 融资', '¥ 5 - 50 亿'], ['辅导周期', '12-24 个月'], ['团队配置', '保荐 + 律师 + 会计师'], ['上市保荐', 'BankerOS Securities (港股)']],
  },
  features: [
    { icon: '💰', title: 'Pre-IPO 融资', desc: 'D/E 轮股权融资 · 引入战略投资者' },
    { icon: '📊', title: '财务规范化', desc: '12-18 个月将财务体系达到上市标准 (PCAOB / HKICPA)' },
    { icon: '📜', title: '招股说明书', desc: '业内顶级团队撰写 · 反馈意见高效回复' },
    { icon: '🎤', title: '全球路演', desc: '香港 / 纽约 / 伦敦 / 新加坡 4 站路演' },
  ],
  useCases: [
    { persona: '独角兽企业', icon: '🚀', scenario: '估值 100 亿+ · 准备 IPO', benefit: 'Pre-IPO 融资 + 上市辅导一站', example: '某 SaaS 独角兽 · D 轮 ¥10 亿 + 港股 IPO' },
  ],
  process: [
    { step: '01', actor: '企业', title: '战略评估', desc: '与 BankerOS 投行家访谈' },
    { step: '02', actor: '投行', title: '签订辅导协议', desc: '12-24 个月辅导服务' },
    { step: '03', actor: '投行', title: '上市筹备', desc: '财务/法务/内控同步推进' },
    { step: '04', actor: '投行', title: '招股+路演', desc: '6 个月内提交招股 · 路演 + 询价' },
    { step: '05', actor: '企业', title: '挂牌上市', desc: '敲钟仪式 · 上市后服务' },
  ],
  caseStudy: {
    company: '某 SaaS 独角兽', logo: '☁️', industry: '估值 ¥150 亿 · 准备港股上市',
    challenge: '完成 C 轮融资 ¥30 亿后估值 150 亿，希望 18 个月内港股上市。但财务体系/合规体系/治理结构均需升级。',
    solution: 'BankerOS 全程辅导：① 协助引入 ¥10 亿 D 轮 + ¥5 亿基石投资者；② 12 个月财务规范化；③ 律师 + 会计师组建团队；④ 主导 6 个月招股 + 4 城市路演。',
    results: [{ metric: 'D 轮融资', value: '¥ 10 亿' }, { metric: 'IPO 募资', value: '¥ 35 亿' }, { metric: '总用时', value: '20 个月' }, { metric: '首日涨幅', value: '+ 28%' }],
    quote: 'BankerOS 投行家就像我们的 CFO 一样深入参与每个细节。20 个月的辅导让公司不仅完成上市，更完成了管理升级。',
    quoteAuthor: '某 SaaS 独角兽 CEO',
  },
  ctaTitle: '伴您走向资本市场', ctaDesc: '12-24 个月全周期辅导',
  ctaButton: { label: 'IPO 辅导咨询', to: '/help' },
};

const mAndACfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '资本市场' }, { label: '并购融资' }],
  category: 'M&A Financing', productName: '并购融资',
  tagline: '杠杆收购 (LBO) · 战略并购 · 跨境并购 · 财务顾问全程',
  badge: '战略级金融服务',
  bullets: ['杠杆收购 (LBO)', '战略并购融资', '跨境并购支持', '反向并购重组', '财务顾问全程', '可达 ¥100 亿+'],
  background: 'black',
  ctaPrimary: { label: '并购融资咨询', to: '/help' },
  overview: {
    description: '并购融资为企业并购交易提供资金 + 顾问服务。\n\n3 类典型场景：① 杠杆收购 (LBO) — PE 基金/管理层用借款收购公司；② 战略并购 — 企业为业务扩张收购对手/上下游；③ 跨境并购 — 中国企业收购海外公司。\n\nBankerOS 提供：并购贷款 + 财务顾问 (估值/谈判/尽调/反垄断)。',
    benchmark: '对标 中信证券 M&A · 中金并购 · Goldman Sachs M&A',
    params: [['并购规模', '¥ 5 亿 - ¥ 500 亿'], ['融资类型', '并购贷款 + 股权融资'], ['服务范围', '境内 + 跨境'], ['辅助', '财务顾问 + 律师 + 反垄断'], ['典型周期', '6-18 个月']],
  },
  features: [
    { icon: '💰', title: '并购贷款', desc: '可融资标的对价 60% · 期限最长 7 年' },
    { icon: '🎯', title: '杠杆收购 (LBO)', desc: 'PE 收购 · 用目标公司未来现金流偿债' },
    { icon: '🌍', title: '跨境并购', desc: '协调中外法律/反垄断/汇率/支付' },
    { icon: '⚖️', title: '财务顾问', desc: '估值定价 + 交易结构 + 谈判支持' },
  ],
  useCases: [
    { persona: 'PE 基金', icon: '💼', scenario: 'LBO 收购上市公司 / 老牌企业', benefit: '70-80% 并购贷款杠杆', example: '某 PE 杠杆收购 ¥30 亿 · 自有 ¥10 亿' },
    { persona: '产业整合者', icon: '🏭', scenario: '收购竞争对手 / 上下游', benefit: '战略协同 + 财务顾问', example: '某汽车主机厂收购零部件公司 ¥80 亿' },
    { persona: '出海企业', icon: '🌐', scenario: '中企收购海外品牌/技术', benefit: '跨境融资 + 反垄断协助', example: '某中企收购欧洲化工 $20 亿' },
  ],
  process: [
    { step: '01', actor: '企业', title: '战略规划', desc: '梳理并购目标 + 资金需求' },
    { step: '02', actor: '投行', title: '尽职调查', desc: '财务/法律/业务深度调查' },
    { step: '03', actor: '投行', title: '估值定价', desc: 'DCF/可比公司多重估值' },
    { step: '04', actor: '投行', title: '融资安排', desc: '并购贷款 + 银团组建' },
    { step: '05', actor: '银行', title: '交易交割', desc: '资金到位 · 股权过户' },
  ],
  caseStudy: {
    company: '某汽车主机厂', logo: '🚗', industry: '上市公司 · 战略并购零部件供应商',
    challenge: '需收购上游零部件供应商 ¥80 亿以巩固供应链 · 但自有资金仅 ¥30 亿。',
    solution: 'BankerOS 财务顾问 + 并购贷款 ¥40 亿 + 撮合定向增发 ¥10 亿。',
    results: [{ metric: '并购规模', value: '¥ 80 亿' }, { metric: '并购贷款', value: '¥ 40 亿' }, { metric: '定增', value: '¥ 10 亿' }, { metric: '反垄断', value: '✓ 通过' }],
    quote: 'BankerOS 不仅给钱，关键时刻给我们专业判断 — 包括砍价 8 亿和反垄断设计。',
    quoteAuthor: '某汽车主机厂 CFO',
  },
  ctaTitle: '战略并购 · 全程伴随', ctaDesc: '财务顾问 + 融资一站',
  ctaButton: { label: '并购融资咨询', to: '/help' },
};

const corporateBondsCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '资本市场' }, { label: '债券发行' }],
  category: 'Corporate Bond Issuance', productName: '企业债券发行',
  tagline: '熊猫债 · 点心债 · 海外债 · 公司债 · 中期票据 · 全币种发行',
  badge: '债券承销 Top 5',
  bullets: ['熊猫债 (境外发行人发行人民币债)', '点心债 (海外人民币债)', '海外债 (USD/EUR)', '公司债 (上交所/深交所)', '中期票据 (银行间)', '主承销 + 财顾'],
  background: 'navy',
  ctaPrimary: { label: '债券发行咨询', to: '/help' },
  overview: {
    description: '企业债券发行是为企业筹集中长期资金的资本市场工具。\n\nBankerOS 投行部担任：① 主承销商 — 设计债券产品 + 路演销售 + 定价;② 财务顾问 — 信用评级辅导 + 信息披露指导;③ 资金管理 — 募集资金账户监管。\n\n债券品种：境内 (公司债/中票/短融) + 境外 (海外债/点心债/熊猫债)。',
    benchmark: '对标 中信建投债券 · 中金固收 · 摩根大通债务资本市场',
    params: [['发行规模', '¥ 5 亿 - ¥ 500 亿'], ['期限', '1-30 年'], ['品种', '公司债 / 中票 / 短融 / 海外债'], ['评级要求', 'AA 以上'], ['典型周期', '3-6 个月']],
  },
  features: [
    { icon: '🐼', title: '熊猫债', desc: '境外发行人在中国发行人民币债 · BankerOS 主承' },
    { icon: '🥟', title: '点心债', desc: '香港离岸人民币债 · 海外人民币基金投资' },
    { icon: '💵', title: '海外债', desc: 'USD / EUR / HKD 计价债 · 全球投资者' },
    { icon: '📊', title: '公司债', desc: '上交所/深交所公开发行 · 个人/机构均可投' },
  ],
  useCases: [
    { persona: '大型企业再融资', icon: '🏢', scenario: '需要长期资金降低短债占比', benefit: '5-10 年期债券替代短贷', example: '某上市公司发 10 年期 ¥30 亿公司债 · 利率 4.2%' },
    { persona: '海外子公司', icon: '🌍', scenario: '海外子公司当地融资', benefit: '点心债/海外债当地货币融资', example: '某中企香港子公司发 HKD 50 亿点心债' },
  ],
  process: [
    { step: '01', actor: '企业', title: '需求评估', desc: '资金需求 + 时间窗口' },
    { step: '02', actor: '投行', title: '产品设计', desc: '币种 + 期限 + 票面利率' },
    { step: '03', actor: '投行', title: '评级辅导', desc: '协助穆迪/标普/中诚信评级' },
    { step: '04', actor: '投行', title: '路演销售', desc: '机构投资者路演 + 询价' },
    { step: '05', actor: '银行', title: '挂牌交易', desc: '上交所/银行间挂牌' },
  ],
  caseStudy: {
    company: '某能源央企', logo: '⚡', industry: '世界 500 强 · 海外项目融资',
    challenge: '中东大型能源项目需要 USD 30 亿融资 · 银行贷款不够 + 利率高。',
    solution: 'BankerOS 主承销 USD 海外债 $20 亿 · 10 年期 · 票面利率 4.8% (LIBOR + 200 bp) · 全球路演 (香港/伦敦/纽约) · 超额认购 3 倍。',
    results: [{ metric: '发行规模', value: '$ 20 亿' }, { metric: '期限', value: '10 年' }, { metric: '利率', value: '4.8% (低于贷款 1.5%)' }, { metric: '超额认购', value: '3 倍' }],
    quote: '海外债比贷款省利息 1.5 个百分点 — 10 年节省 $3 亿。BankerOS 投行的全球路演能力是关键。',
    quoteAuthor: '某能源央企 CFO',
  },
  ctaTitle: '资本市场专家', ctaDesc: '债券发行全周期服务',
  ctaButton: { label: '债券发行咨询', to: '/help' },
};

export const BusinessCommercial   = () => <ProductDetailLite {...commercialCfg} />;
export const BusinessCorporate    = () => <ProductDetailLite {...corporateCfg} />;
export const BusinessCrossBorder  = () => <ProductDetailLite {...crossBorderCfg} />;
export const BusinessPayroll      = () => <ProductDetailLite {...payrollCfg} />;
export const BusinessApiBank      = () => <ProductDetailLite {...apiBankCfg} />;
export const BusinessIpo          = () => <ProductDetailLite {...ipoCfg} />;
export const BusinessMAndA        = () => <ProductDetailLite {...mAndACfg} />;
export const BusinessBonds        = () => <ProductDetailLite {...corporateBondsCfg} />;
