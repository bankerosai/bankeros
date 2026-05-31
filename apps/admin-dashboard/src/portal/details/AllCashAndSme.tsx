/**
 * Cash management sub-products (4): Account Mgmt / Smart Payment / Receivables / Liquidity Forecast
 * SME financing sub-products (3): Supply Chain / Equipment / Bridge Loan
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

// ─── 账户管理 ────────────────────────────────────────────
const accountMgmtCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '现金管理', to: '/products/business/cash-management' }, { label: '账户管理' }],
  category: 'Account Management', productName: '集团账户管理',
  tagline: '集团多账户统一视图 · 多公司/多币种/多地区集中管控 · 服务 7,200 集团',
  badge: '集团财务总监必备',
  bullets: ['集团多账户统一视图', '多公司/多币种/多地区', '实时余额监控', '权限分级管理', '与 ERP 直连', '审批工作流'],
  background: 'navy',
  ctaPrimary: { label: '账户管理咨询', to: '/help' },
  overview: {
    description: '集团账户管理为多法人/多分公司/多地区的企业集团提供统一的账户视图和管控平台。\n\n核心功能：① 集中视图 — 所有账户余额/流水实时聚合;② 分级权限 — 总部/区域/分公司不同权限;③ 审批工作流 — Maker-Checker / 多级审批;④ 标准化报表 — 集团合并报表自动生成。\n\n适合：集团总部、跨国公司、上市公司财务部。',
    benchmark: '对标 HSBC HSBCnet · Citi CitiDirect · 招行公司网银',
    params: [['账户数', '不限'], ['公司主体数', '不限'], ['权限级别', '4 级'], ['报表频率', '实时'], ['集成方式', 'API / ERP 直连']],
  },
  features: [
    { icon: '📊', title: '集团仪表盘', desc: '全集团账户余额一屏看 · 多币种自动折算' },
    { icon: '🔐', title: '分级权限', desc: '集团总部全权 · 区域查看 · 分公司操作' },
    { icon: '✅', title: '审批工作流', desc: 'Maker-Checker · 多级签字 · 移动审批' },
    { icon: '📋', title: '合并报表', desc: '集团合并资产负债表自动生成 · 多准则' },
  ],
  useCases: [
    { persona: '集团总部', icon: '🏛', scenario: '全集团数百个账户分散管理', benefit: '一个仪表盘看所有账户', example: '某 500 强集团 38 子公司 · 200+ 账户统一管' },
  ],
  caseStudy: {
    company: '某汽车集团', logo: '🚗', industry: '上市公司 · 36 子公司',
    challenge: '36 子公司分散在 12 家银行 · 财务部对账要 20 天。',
    solution: 'BankerOS 账户管理平台 · 集中所有账户视图 · ERP 直连。',
    results: [{ metric: '账户数', value: '200+' }, { metric: '对账时间', value: '1 天' }, { metric: '人力节省', value: '5 FTE' }, { metric: '错误率', value: '0%' }],
    quote: '集团账户管理把我们从对账噩梦中解放出来。',
    quoteAuthor: '某汽车集团 CFO',
  },
  ctaTitle: '集团财务现代化', ctaDesc: '与现有银行账户兼容',
  ctaButton: { label: '账户管理咨询', to: '/help' },
};

// ─── 智能支付 ────────────────────────────────────────────
const smartPaymentCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '现金管理', to: '/products/business/cash-management' }, { label: '智能支付' }],
  category: 'Smart Payment', productName: '智能支付平台',
  tagline: '批量支付 + 单笔支付 + 周期付款 + Maker-Checker 多级审批',
  badge: '日均处理 100 万+ 笔',
  bullets: ['批量支付 (Excel/API)', '单笔支付', '周期性自动付款', 'Maker-Checker 多级审批', '支付指令模板', '实时到账追踪'],
  background: 'navy',
  ctaPrimary: { label: '智能支付咨询', to: '/help' },
  overview: {
    description: '智能支付平台为企业提供"一站式"支付管理。\n\n功能矩阵：\n① 批量支付 — 一次上传 Excel/CSV 处理上千笔 (如薪资发放);\n② 单笔支付 — 大额或紧急付款;\n③ 周期付款 — 自动租金/订阅/分期付款;\n④ Maker-Checker — 双人复核避免错误;\n⑤ 支付模板 — 常用收款方一键发起;\n⑥ 实时追踪 — SWIFT GPI 跨境追踪。',
    benchmark: '对标 招行 e+ 企业网银 · HSBC Payment Hub · Citi PayWay',
    params: [['批量上限', '5,000 笔/批'], ['到账时长', '本行秒级 · 跨行 5 分钟 · 跨境 6 小时'], ['币种', '12 种主流'], ['审批级别', '最多 5 级'], ['集成方式', 'API / Web / Excel']],
  },
  features: [
    { icon: '📤', title: '批量支付', desc: '5,000 笔/批 · Excel 一键上传' },
    { icon: '👥', title: 'Maker-Checker', desc: '提交人 + 审批人 + 复核人多级审核' },
    { icon: '🔄', title: '周期付款', desc: '租金/订阅/分期 · 自动按期付款' },
    { icon: '📍', title: '实时追踪', desc: 'SWIFT GPI 跨境追踪 · 类快递物流' },
  ],
  useCases: [
    { persona: 'HR 部门', icon: '💼', scenario: '月度薪资发放 1000+ 员工', benefit: '一次上传一键发放', example: '某科技公司 2000 员工薪资 1 分钟批量发放' },
    { persona: '财务部门', icon: '📋', scenario: '日常对外付款 (供应商/物业/水电)', benefit: '审批+付款一体化', example: '某制造企业月 500 笔付款 · 全部线上审批' },
  ],
  caseStudy: {
    company: '某电商集团', logo: '🛒', industry: '日均处理订单 50K 个',
    challenge: '日均向卖家结算 5,000+ 笔 · 人工操作易错。',
    solution: 'BankerOS 智能支付 · API 自动发起 · 实时分账。',
    results: [{ metric: '日均处理', value: '5,000 笔' }, { metric: '错误率', value: '0.01%' }, { metric: '人力', value: '0' }, { metric: '到账', value: '秒级' }],
    quote: '智能支付让我们的运营效率 10 倍提升。',
    quoteAuthor: '某电商集团 CTO',
  },
  ctaTitle: '让支付简单高效', ctaDesc: '与 ERP 直连 · 0 人工',
  ctaButton: { label: '智能支付咨询', to: '/help' },
};

// ─── 收款管理 ────────────────────────────────────────────
const receivablesCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '现金管理', to: '/products/business/cash-management' }, { label: '收款管理' }],
  category: 'Receivables Management', productName: '收款管理',
  tagline: '虚拟账户 (VA) · 自动识别归属 · 应收账款自动对账',
  badge: '应收对账自动化',
  bullets: ['虚拟账户 (VA) 体系', '客户专属收款账号', '自动识别归属', '应收账款自动对账', '与 ERP 直连', '坏账预警'],
  background: 'navy',
  ctaPrimary: { label: '收款管理咨询', to: '/help' },
  overview: {
    description: '收款管理使用虚拟账户 (Virtual Account, VA) 技术 — 为每个客户分配专属收款账号。\n\n传统问题：客户付款到一个总账户 · 财务无法立即识别是哪个客户付款 · 需要人工对账 (3-7 天)。\n\nVA 解决方案：每个客户都有自己的虚拟账号 · 付款立即识别归属 · 自动入账 · 实时对账。\n\n核心场景：B2B 销售 · 房地产 · 教育培训 · 物业管理。',
    benchmark: '对标 招行 e+ 应收账款 · HSBC Virtual Account Management',
    params: [['VA 数量', '不限'], ['识别速度', '实时'], ['对账自动化', '95%+'], ['与 ERP 集成', 'SAP / Oracle / Kingdee']],
  },
  features: [
    { icon: '🎯', title: '虚拟账户', desc: '为每客户分配专属收款账号 · 自动识别' },
    { icon: '⚡', title: '实时对账', desc: '付款到账即自动核销应收账款' },
    { icon: '🤖', title: 'ERP 自动入账', desc: '与 ERP 直连 · 自动生成会计凭证' },
    { icon: '⚠️', title: '坏账预警', desc: '逾期账款自动提醒 + 催收建议' },
  ],
  useCases: [
    { persona: 'B2B 销售', icon: '💼', scenario: '上千家经销商付款 · 难以快速识别', benefit: 'VA 让每个经销商都有专属账号', example: '某快消品月收款 ¥5 亿 · 1000 经销商 · VA 自动归集' },
    { persona: '物业公司', icon: '🏢', scenario: '收物业费 · 业主无法识别', benefit: '每户专属 VA 收款码', example: '某物业 5000 户 · VA 二维码扫码缴费' },
  ],
  caseStudy: {
    company: '某快消品集团', logo: '🥤', industry: '年销售 ¥80 亿 · 全国 1,200 经销商',
    challenge: '月收款 1,200 笔 · 财务对账 5 天 · 经销商付款不写备注无法识别。',
    solution: 'BankerOS VA 系统 · 为每个经销商分配专属账号 · ERP 直连。',
    results: [{ metric: 'VA 数量', value: '1,200' }, { metric: '对账自动化', value: '98%' }, { metric: '对账时间', value: '半小时' }, { metric: '人力节省', value: '3 FTE' }],
    quote: 'VA 让我们告别"对账靠人猜"的时代。',
    quoteAuthor: '某快消品集团 CFO',
  },
  ctaTitle: '应收账款自动化', ctaDesc: 'VA 让每个客户有专属账号',
  ctaButton: { label: '收款管理咨询', to: '/help' },
};

// ─── 流动性预测 ────────────────────────────────────────────
const liquidityForecastCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '现金管理', to: '/products/business/cash-management' }, { label: '流动性预测' }],
  category: 'Liquidity Forecasting', productName: '流动性预测',
  tagline: 'AI 模型预测 30-365 天现金流 · 短缺/过剩自动告警 · 决策支持',
  badge: 'AI 现金流预测',
  bullets: ['30-365 天预测', 'AI 模型 · 准确度 92%+', '日 / 周 / 月颗粒度', '短缺/过剩自动告警', '与 ERP / 应收应付集成', '场景模拟 (What-if)'],
  background: 'navy',
  ctaPrimary: { label: '流动性预测咨询', to: '/help' },
  overview: {
    description: '流动性预测使用 AI 模型分析企业历史现金流 + 应收应付 + 销售预测 + 季节性 · 自动预测未来 30-365 天的现金流。\n\n核心价值：① 提前发现现金短缺 (安排融资);② 识别过剩资金 (理财增值);③ 优化资金调度;④ 支持战略决策。\n\n预测准确度：30 天 92%+ · 90 天 85%+ · 1 年 75%+。',
    benchmark: '对标 SAP Treasury · Oracle Cash Forecasting · Kyriba',
    params: [['预测期', '30-365 天'], ['准确度', '92% (30 天) / 85% (90 天)'], ['更新频率', '每日'], ['颗粒度', '日/周/月'], ['场景数', '不限 What-if']],
  },
  features: [
    { icon: '🔮', title: 'AI 预测', desc: '机器学习模型 · 持续优化准确度' },
    { icon: '⚠️', title: '自动告警', desc: '预测到短缺/过剩自动短信邮件通知' },
    { icon: '🎯', title: '场景模拟', desc: 'What-if 分析 (大单流失/客户破产/利率上升)' },
    { icon: '🔌', title: 'ERP 集成', desc: '自动获取应收应付/销售预测数据' },
  ],
  useCases: [
    { persona: '集团 CFO', icon: '📊', scenario: '需要提前规划季度资金需求', benefit: '提前 90 天发现现金缺口', example: '某集团预测到 2 个月后资金短缺 · 提前安排融资' },
    { persona: '财务部', icon: '💰', scenario: '日常资金调度优化', benefit: '识别短期闲置资金理财', example: '某企业 ¥5 亿闲置 30 天 · AI 推荐货币基金' },
  ],
  caseStudy: {
    company: '某零售连锁集团', logo: '🛒', industry: '500 家门店 · 季节性强',
    challenge: '春节 / 双 11 / 618 资金需求剧烈波动 · 财务难以精确规划。',
    solution: 'BankerOS AI 流动性预测 · 整合销售/采购/库存数据 · 季节性建模。',
    results: [{ metric: '预测准确度', value: '94% (30 天)' }, { metric: '提前发现缺口', value: '60 天' }, { metric: '融资成本', value: '↓ 30%' }, { metric: '闲置利息', value: '+ ¥ 800 万' }],
    quote: 'AI 预测让我们从"救火队员"变成"战略规划者"。',
    quoteAuthor: '某零售集团 CFO',
  },
  ctaTitle: '现金流前瞻决策', ctaDesc: 'AI 预测 · 92% 准确度',
  ctaButton: { label: '流动性预测咨询', to: '/help' },
};

// ─── 供应链金融 ────────────────────────────────────────────
const supplyChainCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '小微企业', to: '/products/business/sme' }, { label: '供应链金融' }],
  category: 'Supply Chain Finance', productName: '供应链金融',
  tagline: '应收账款融资 · 订单融资 · 保理 · 与核心企业合作池',
  badge: '上下游一体化融资',
  bullets: ['应收账款融资', '订单融资', '保理 (国内 + 国际)', '核心企业反向保理', '基于真实贸易背景', '上下游一体化方案'],
  background: 'navy',
  ctaPrimary: { label: '供应链金融咨询', to: '/help' },
  overview: {
    description: '供应链金融 (Supply Chain Finance, SCF) 是基于核心企业及其上下游企业的真实贸易关系提供的综合金融服务。\n\n3 大主流产品：\n① 应收账款融资 — 供应商凭核心企业应付账款融资;\n② 订单融资 — 凭核心企业订单融资生产;\n③ 反向保理 — 核心企业主动为供应商安排融资。\n\n核心价值：① 上下游小微企业获得低成本融资 (核心企业信用);② 核心企业延长账期 + 巩固供应商关系;③ 银行风险降低 (基于真实贸易)。',
    benchmark: '对标 招行供应链金融 · 平安壹账通 · 蚂蚁金融供应链',
    params: [['融资额度', '应收账款 80-90%'], ['期限', '与账期匹配 (30-365 天)'], ['利率', 'LPR + 50-200 bp'], ['核心企业', '与 BankerOS 合作的 5000+ 核心企业'], ['受惠对象', '上下游小微供应商/分销商']],
  },
  features: [
    { icon: '🔄', title: '反向保理', desc: '核心企业主动为供应商安排融资 · 巩固供应链' },
    { icon: '📋', title: '订单融资', desc: '凭核心企业订单提前融资生产' },
    { icon: '💼', title: '动产质押', desc: '存货 / 仓单质押融资 · 与第三方监管' },
    { icon: '🌐', title: '国际保理', desc: '跨境贸易项下供应链金融' },
    { icon: '🤖', title: '区块链溯源', desc: '基于区块链确认贸易真实性 · 防止欺诈' },
  ],
  useCases: [
    { persona: '核心企业供应商', icon: '🏭', scenario: '为大型企业供货 · 收款慢', benefit: '反向保理立即收款 · 利率低', example: '为某汽车主机厂供货 · 反向保理融资 ¥500 万' },
    { persona: '电商卖家', icon: '🛒', scenario: '京东/天猫卖家 · 应收账款融资', benefit: '电商平台数据支持融资', example: '某天猫旗舰店 · 应收 ¥200 万融资' },
    { persona: '物流公司', icon: '🚚', scenario: '运单 + 货物质押融资', benefit: '盘活在途资产', example: '某物流 · 在途货物 ¥1,000 万质押融资' },
  ],
  process: [
    { step: '01', actor: '核心企业', title: '签合作协议', desc: '核心企业与 BankerOS 签约' },
    { step: '02', actor: '供应商', title: '注册参与', desc: '上下游供应商加入平台' },
    { step: '03', actor: '供应商', title: '上传单据', desc: '应收账款/订单/物流单据' },
    { step: '04', actor: '核心企业', title: '确认', desc: '核心企业线上确认应付' },
    { step: '05', actor: '银行', title: '放款', desc: 'T+1 放款给供应商' },
  ],
  caseStudy: {
    company: '某新能源汽车主机厂', logo: '🚗', industry: '上市公司 · 800 家供应商',
    challenge: '为支持上游 800 家中小供应商 · 主机厂希望提供供应链金融支持。但自己资金有限。',
    solution: 'BankerOS 反向保理平台 · 主机厂确认应付账款 · 上游供应商可立即融资 (主机厂信用)。',
    results: [{ metric: '受惠供应商', value: '800 家' }, { metric: '累计融资', value: '¥ 50 亿' }, { metric: '供应商利率', value: '5.2% (vs 8% 自融)' }, { metric: '供应链稳定性', value: '+ 30%' }],
    quote: 'BankerOS 供应链金融让我们的上游伙伴享受到了大企业的金融待遇。整条供应链都更稳健。',
    quoteAuthor: '某新能源汽车主机厂 CFO',
  },
  ctaTitle: '上下游一体融资', ctaDesc: '核心企业反向保理 · 上游小微受惠',
  ctaButton: { label: '供应链金融咨询', to: '/help' },
};

// ─── 设备融资 ────────────────────────────────────────────
const equipmentCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '小微企业', to: '/products/business/sme' }, { label: '设备融资' }],
  category: 'Equipment Financing', productName: '设备融资',
  tagline: '设备分期 / 融资租赁 · 最高设备款 80% · 期限 1-5 年',
  badge: '生产设备升级利器',
  bullets: ['设备分期付款', '融资租赁 (售后回租)', '最高 80% 设备款', '期限 1-5 年', '设备作为质押', '与设备厂商合作'],
  background: 'navy',
  ctaPrimary: { label: '设备融资咨询', to: '/help' },
  overview: {
    description: '设备融资为企业提供生产设备购置的专项融资。\n\n2 种主要模式：\n① 设备分期 — 企业向设备厂商购买 · BankerOS 提供分期贷款 (设备所有权归企业);\n② 融资租赁 — BankerOS 代企业购买设备 · 租给企业使用 · 租期满后过户。\n\n常见适用：生产线 · 数控机床 · 医疗设备 · 工程机械 · 餐饮设备 · 印刷设备。',
    benchmark: '对标 工银金融租赁 · 国银金租 · 三一融资租赁',
    params: [['融资比例', '60-80%'], ['期限', '1-5 年'], ['利率', '5.5-9%'], ['担保', '设备本身质押 + 企业信用'], ['品牌覆盖', '德国 DMG / 日本 FANUC / 国产汇川 等 200+ 品牌']],
  },
  features: [
    { icon: '🏭', title: '生产设备', desc: '数控机床/注塑机/印刷机/包装机/纺织机' },
    { icon: '🏥', title: '医疗设备', desc: 'CT/MRI/B超/检验仪/牙科设备' },
    { icon: '🚜', title: '工程机械', desc: '挖掘机/装载机/起重机/混凝土泵车' },
    { icon: '🍳', title: '餐饮设备', desc: '商用厨房/中央厨房/冰柜/咖啡机' },
    { icon: '🤝', title: '厂商合作', desc: '与设备厂商深度合作 · 一站式购买+融资' },
  ],
  useCases: [
    { persona: '制造业升级', icon: '🏭', scenario: '工厂升级数控机床 · 单台 ¥100-500 万', benefit: '设备分期不动用流动资金', example: '某机械厂换 5 台数控机床 ¥1,500 万 · 5 年期月供 ¥27.8 万' },
    { persona: '医疗机构', icon: '🏥', scenario: '医院购置 CT/MRI 高价设备', benefit: '融资租赁 + 维护打包', example: '某二级医院购 MRI ¥800 万 · 5 年融资租赁' },
    { persona: '餐饮连锁', icon: '🍽', scenario: '中央厨房设备 + 门店厨房', benefit: '快速扩张 · 设备分期', example: '某连锁餐饮 50 家门店厨房设备 ¥2,000 万分期' },
  ],
  process: [
    { step: '01', actor: '企业', title: '选定设备', desc: '与厂商确认设备型号价格' },
    { step: '02', actor: '银行', title: '审批授信', desc: '5-10 工作日' },
    { step: '03', actor: '银行', title: '设备款支付', desc: 'BankerOS 直接付给设备厂商' },
    { step: '04', actor: '企业', title: '使用设备', desc: '设备到场使用 · 按月还款' },
  ],
  caseStudy: {
    company: '某机械加工厂', logo: '⚙️', industry: '苏州 · 精密机械加工',
    challenge: '需升级 5 台日本 FANUC 五轴加工中心 (¥300 万/台 · 共 ¥1,500 万)。一次性付款资金不够。',
    solution: 'BankerOS 设备分期 · 5 年期 · 利率 6.5% · 与 FANUC 合作直付。',
    results: [{ metric: '总设备款', value: '¥ 1,500 万' }, { metric: '月供', value: '¥ 29.4 万' }, { metric: '设备 ROI', value: '18 个月' }, { metric: '产能提升', value: '+ 150%' }],
    quote: '设备分期让我们快速完成产能升级 · 不用动用宝贵的流动资金。',
    quoteAuthor: '某机械加工厂老板',
  },
  ctaTitle: '设备升级加速器', ctaDesc: '80% 设备款 · 5 年期',
  ctaButton: { label: '设备融资咨询', to: '/help' },
};

// ─── 过桥贷款 ────────────────────────────────────────────
const bridgeLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '小微企业', to: '/products/business/sme' }, { label: '过桥贷款' }],
  category: 'Bridge Loan', productName: '过桥贷款',
  tagline: 'IPO 前 / 融资过桥 · 期限 3-12 个月 · 灵活利率 · 紧急资金需求',
  badge: '短期资金桥梁',
  bullets: ['IPO 前过桥融资', '股权融资过桥', '并购交易过桥', '期限 3-12 个月', '快速放款 7-15 天', '灵活担保结构'],
  background: 'navy',
  ctaPrimary: { label: '过桥贷款咨询', to: '/help' },
  overview: {
    description: '过桥贷款 (Bridge Loan) 是为企业在两次大型融资之间的"过渡期"提供的短期融资。\n\n典型场景：\n① IPO 前过桥 — 企业提交了上市申请 · 等待 IPO 募资到位的 6-12 个月间;\n② 股权融资过桥 — 已签订投资协议 · 等待资金到账;\n③ 并购交易过桥 — 已签收购协议 · 等待长期融资落实;\n④ 资产出售过桥 — 等待资产出售款到账。\n\n核心特点：金额大 · 期限短 · 利率较高 · 通常以未来确定资金为担保。',
    benchmark: '对标 高盛 / 摩根斯坦利 Bridge Loan',
    params: [['金额', '¥ 1,000 万 - ¥ 50 亿'], ['期限', '3-12 个月 (可展期)'], ['利率', '8-15% (年化)'], ['担保', '股权 / 应收款 / 未来确定资金'], ['放款时长', '7-15 工作日']],
  },
  features: [
    { icon: '🚀', title: 'IPO 前过桥', desc: '协助 Pre-IPO 企业 · 12 个月内 IPO 募资归还' },
    { icon: '💼', title: '并购过桥', desc: '收购方先用过桥贷款完成交易 · 后置换长期融资' },
    { icon: '⚡', title: '快速放款', desc: '7-15 工作日 · 远快于普通银行贷款 (1-2 月)' },
    { icon: '🎯', title: '灵活担保', desc: '股权质押 / 应收款 / 未来确定资金均可' },
  ],
  useCases: [
    { persona: 'Pre-IPO 公司', icon: '🚀', scenario: '已提交 IPO 申请 · 等募资到位', benefit: '过桥资金维持运营/扩张', example: '某独角兽提交港股 IPO · ¥5 亿过桥 12 个月' },
    { persona: '并购方', icon: '🤝', scenario: '已签收购协议 · 等长期银团', benefit: '过桥贷款先完成交易', example: '某集团收购竞争对手 ¥20 亿 · 过桥 6 个月' },
    { persona: '股权融资客户', icon: '💼', scenario: '已签 PE 投资协议 · 等钱到账', benefit: '过桥资金桥接到 PE 资金', example: '某创业公司 ¥3 亿 C 轮 · 过桥 3 个月' },
  ],
  process: [
    { step: '01', actor: '企业',  title: '提交申请', desc: '说明未来资金来源 + 过桥需求' },
    { step: '02', actor: '银行',  title: '快速尽调', desc: '5-10 工作日完成' },
    { step: '03', actor: '银行',  title: '审批放款', desc: '7-15 工作日放款' },
    { step: '04', actor: '企业',  title: '到期归还', desc: 'IPO / PE 资金到账后归还' },
  ],
  caseStudy: {
    company: '某 SaaS 独角兽', logo: '☁️', industry: '估值 ¥150 亿 · 港股 IPO 中',
    challenge: '提交港股 IPO 申请后等待聆讯 · 期间需 ¥5 亿用于市场扩张和并购。IPO 募资预计 12 个月后到位。',
    solution: 'BankerOS 过桥贷款 ¥5 亿 · 12 个月 · 利率 9.5% · 以创始人股权 + IPO 募资承诺为担保。',
    results: [{ metric: '过桥规模', value: '¥ 5 亿' }, { metric: '期限', value: '12 个月' }, { metric: '放款用时', value: '10 天' }, { metric: 'IPO 后归还', value: '✓' }],
    quote: 'BankerOS 过桥贷款让我们没有错过 Pre-IPO 的关键扩张窗口期。',
    quoteAuthor: '某 SaaS 独角兽 CEO',
  },
  ctaTitle: '资金链不断挡', ctaDesc: '7-15 天放款 · 灵活担保',
  ctaButton: { label: '过桥贷款咨询', to: '/help' },
};

export const CmAccountMgmt        = () => <ProductDetailLite {...accountMgmtCfg} />;
export const CmSmartPayment       = () => <ProductDetailLite {...smartPaymentCfg} />;
export const CmReceivables        = () => <ProductDetailLite {...receivablesCfg} />;
export const CmLiquidityForecast  = () => <ProductDetailLite {...liquidityForecastCfg} />;
export const SmeSupplyChain       = () => <ProductDetailLite {...supplyChainCfg} />;
export const SmeEquipment         = () => <ProductDetailLite {...equipmentCfg} />;
export const SmeBridgeLoan        = () => <ProductDetailLite {...bridgeLoanCfg} />;
