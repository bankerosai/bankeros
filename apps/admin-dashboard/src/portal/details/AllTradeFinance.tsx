/**
 * 7 trade finance product detail pages (beyond L/C)
 * Bank Guarantee · Export Financing · Import Financing · Forfaiting
 * Export Factoring · Shipping Finance · Export Credit
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

// ─── 银行保函 ────────────────────────────────────────────
const bankGuaranteeCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '银行保函' }],
  category: 'Bank Guarantee', productName: '银行保函',
  tagline: '投标保函 / 履约保函 / 预付款保函 / 财务保函 · URDG 758 国际惯例',
  badge: 'URDG 758 国际通行',
  bullets: ['投标 / 履约 / 预付款 / 财务 4 大类', '与受益方 / 项目方银行直连', '24 小时极速开立', '中英文双语', 'SWIFT MT760 / MT767 报文', '最低费率 0.1%/季'],
  background: 'navy',
  ctaPrimary: { label: '在线开立保函', to: '/login' },
  overview: {
    description: '银行保函 (Bank Guarantee) 是 BankerOS 应申请人请求，对受益人开具的书面付款承诺。\n\n4 大主流类型：\n① 投标保函 (Bid Bond) — 投标人参加招标时提交，保证中标后会签约;\n② 履约保函 (Performance Bond) — 中标后开立，保证按合同履约;\n③ 预付款保函 (Advance Payment) — 收到预付款的供应商提供，保证按约履约;\n④ 财务保函 (Financial Guarantee) — 担保借款人按时偿还贷款。\n\n遵守 ICC URDG 758 (Uniform Rules for Demand Guarantees) 国际惯例。',
    benchmark: '对标 HSBC Bank Guarantee · 招行国际保函 · 工行保函业务',
    params: [['国际标准', 'URDG 758 / ISP 98'], ['报文规范', 'SWIFT MT760 / MT767'], ['最低金额', 'USD 10,000 等值'], ['最高金额', '不设上限'], ['期限', '通常 1-5 年'], ['费率', '0.1%-0.5%/季'], ['开立时长', '24 小时-3 工作日']],
  },
  features: [
    { icon: '📋', title: '投标保函', desc: '招标项目 · 保证投标人遵守招标规则 · 通常 ¥10-100 万' },
    { icon: '🤝', title: '履约保函', desc: '保证施工方/供应商按合同履行 · 通常合同价 10%' },
    { icon: '💰', title: '预付款保函', desc: '收到预付款的供应商提供 · 保证按约履约或退款' },
    { icon: '🏦', title: '财务保函', desc: '担保借款人偿还贷款 · 用于跨境融资增信' },
    { icon: '🌐', title: '海关保函', desc: '海关减免/缓征关税担保 · 保税仓担保' },
    { icon: '⚖️', title: '法院保函', desc: '诉讼保全 / 财产保全担保 · 替代现金保证金' },
  ],
  useCases: [
    { persona: '工程承包商', icon: '🏗', scenario: '参加大型项目投标 · 中标后施工担保', benefit: '银行信用替代保证金 · 资金不被占用', example: '某承包商投 ¥5 亿基建项目 · 投标保函 ¥500 万 + 履约保函 ¥5,000 万' },
    { persona: '设备制造商', icon: '🏭', scenario: '出售大型设备 · 提供售后履约担保', benefit: '增强买方信任 · 促成交易', example: '某机械厂出口 USD 2M 设备 · 履约保函担保 1 年质保期' },
    { persona: '供应商', icon: '📦', scenario: '收到客户大额预付款', benefit: '预付款保函取信客户 · 保证按时交货', example: '某出口商收 USD 500K 预付款 · 开预付款保函担保按期出货' },
  ],
  process: [
    { step: '01', actor: '申请人', title: '提交申请', desc: '基础合同 + 受益人信息 + 保函要素' },
    { step: '02', actor: '银行',   title: '资信审核', desc: '申请人资信 + 项目合理性' },
    { step: '03', actor: '银行',   title: '收取保证金', desc: '通常 10-30% 保证金或全额授信' },
    { step: '04', actor: '银行',   title: '开立保函', desc: 'SWIFT MT760 或纸质保函发出' },
    { step: '05', actor: '银行',   title: '到期解除', desc: '受益人退保或失效自动解除' },
  ],
  caseStudy: {
    company: '某基建工程集团', logo: '🏗', industry: '年承接合同额 ¥50 亿 · 高速公路/桥梁建设',
    challenge: '参与海外某国 USD 800M 高速公路项目投标。需要：① 投标保函 USD 8M (1%);② 中标后履约保函 USD 80M (10%);③ 预付款保函 USD 160M (20% 预付款)。共计 USD 248M 担保需求。如自筹保证金会严重占用现金流。',
    solution: 'BankerOS 综合保函方案：① 总授信额度 USD 250M;② 投标保函/履约保函/预付款保函一体化设计;③ 与项目甲方银行直连开立 · 通过 SWIFT MT760。',
    results: [{ metric: '总担保规模', value: 'USD 248M' }, { metric: '资金占用', value: '< 5%' }, { metric: '开立用时', value: '7 天' }, { metric: '项目中标', value: '✓' }],
    quote: '没有 BankerOS 的保函支持，我们根本拿不下这个海外大项目。一笔综合授信解决了所有担保需求。',
    quoteAuthor: '某基建集团 CFO',
  },
  fees: [
    { item: '投标保函', amount: '0.1%/季', note: '最低 ¥ 500' },
    { item: '履约保函', amount: '0.15-0.3%/季', note: '根据期限和金额' },
    { item: '预付款保函', amount: '0.2%/季', note: '' },
    { item: '财务保函', amount: '0.25-0.5%/季', note: '风险较高' },
    { item: '保证金', amount: '10-30%', note: '优质客户可申请 0 保证金' },
    { item: '修改费', amount: '¥ 300/笔', note: '次要修改' },
  ],
  faq: [
    { q: '保函与信用证有什么区别？', a: '信用证 (L/C) 用于贸易支付 — 出口商交单后银行付款。保函主要用于担保 — 仅在被担保方违约时银行才赔付，正常情况下保函到期作废。L/C 必然涉及资金流转，保函可能根本不动用。' },
    { q: '受益人怎么索赔？', a: '受益人需向 BankerOS 提交"索赔申请"+ 证明被担保方违约的文件。BankerOS 审核后按保函条款无条件付款给受益人，再向申请人追偿。' },
    { q: '保函会上征信吗？', a: '保函是或有负债，不直接上征信。但占用银行授信额度，影响其他贷款申请。如发生索赔追偿，则上征信。' },
  ],
  ctaTitle: '银行信用支持您的商业承诺', ctaDesc: '24 小时极速开立 · 全球受益人',
  ctaButton: { label: '在线开立保函', to: '/login' },
};

// ─── 出口押汇 ────────────────────────────────────────────
const exportFinancingCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '出口押汇' }],
  category: 'Export Bill Negotiation', productName: '出口押汇',
  tagline: '出口商凭单据从银行取得贸易融资 · 折扣率 LIBOR + 50bp 起 · 当日放款',
  badge: '出口商资金周转利器',
  bullets: ['L/C 项下出口押汇', '托收项下出口押汇', 'D/P · D/A 适用', '折扣率 LIBOR + 50bp 起', '币种 USD/EUR/GBP/JPY', '90 天-180 天'],
  background: 'navy',
  ctaPrimary: { label: '出口押汇申请', to: '/login' },
  overview: {
    description: '出口押汇 (Export Bill Negotiation / Bill Discounting) 是出口商发货后，将信用证项下或托收项下的远期票据/单据卖给 BankerOS，立即取得货款的融资方式。\n\n通俗讲：出口商不需要等待 90-180 天买家付款，而是把"将来收钱的权利"以折扣价卖给银行立即套现。BankerOS 扣除融资利息后立即支付货款。\n\n核心价值：① 加快资金周转 (DSO 从 180 天 → 0 天);② 锁定汇率风险;③ 转移收款风险给银行。',
    benchmark: '对标 招行出口押汇 · 工行结算融资 · HSBC Export Finance',
    params: [['融资比例', '票面金额 80-95%'], ['融资期限', '90-180 天'], ['折扣率', 'LIBOR + 50-150 bp'], ['币种', 'USD/EUR/GBP/JPY/HKD 等'], ['追索权', '有追索权 (可选无追索)'], ['放款时长', '当日 (单据齐全)']],
  },
  features: [
    { icon: '⚡', title: '当日放款', desc: '单据齐全后当日完成审核+放款' },
    { icon: '💵', title: '高融资比例', desc: '票面金额 80-95% 立即到账' },
    { icon: '📋', title: 'L/C 或托收', desc: 'L/C 信用证项下 + D/P / D/A 托收项下均可' },
    { icon: '🌐', title: '多币种', desc: 'USD/EUR/GBP/JPY/HKD 等 12 种主流货币' },
    { icon: '🛡', title: '无追索可选', desc: '福费廷模式 · 转移所有风险给银行 (利率略高)' },
  ],
  useCases: [
    { persona: '中小出口商', icon: '📦', scenario: '客户要求 90/180 天账期 · 自己现金流紧张', benefit: '加速资金回笼 · 用于下一单生产', example: '某义乌出口商单笔 USD 80K · 90 天账期 · 押汇当日到账 USD 75K' },
    { persona: '大宗贸易商', icon: '🚢', scenario: '大宗商品出口 · 客户远期付款', benefit: '大额融资 · 库存周转加快', example: '某粮食出口商 USD 5M 出口 · 押汇 USD 4.5M' },
    { persona: '应付供应商货款', icon: '💰', scenario: '出口收款慢但供应商等不及', benefit: '出口押汇资金支付国内供应商', example: '某外贸公司供应商 30 天账期 · 出口押汇资金回款支付' },
  ],
  process: [
    { step: '01', actor: '出口商', title: '发货并交单', desc: '取得提单/发票/保险单等' },
    { step: '02', actor: '出口商', title: '申请押汇', desc: '提交单据 + 押汇申请' },
    { step: '03', actor: '银行',   title: '审单', desc: '检查单据符合 L/C 条款' },
    { step: '04', actor: '银行',   title: '扣息放款', desc: '票面 - 利息 = 当日入账金额' },
    { step: '05', actor: '银行',   title: '到期收款', desc: '银行向买方银行索款' },
  ],
  caseStudy: {
    company: '某机电出口商', logo: '⚙️', industry: '年出口 USD 30M · 主要市场美/欧',
    challenge: '美国客户单笔订单 USD 800K · 90 天 D/P 远期付款 · 现金流压力大 (生产成本 USD 500K 已垫付)。',
    solution: 'BankerOS 出口押汇 · 单据审核合格后 USD 750K (94% 比例) 当日到账 · 利率 LIBOR + 80bp · 90 天后 BankerOS 向买方银行收款。',
    results: [{ metric: '融资金额', value: 'USD 750K' }, { metric: '融资比例', value: '94%' }, { metric: '资金到账', value: '当日' }, { metric: '融资成本', value: '$ 12K' }],
    quote: '出口押汇让我们能接更多订单。原本 90 天的钱当天到账，现金流压力解决了，可以接 3 倍的订单量。',
    quoteAuthor: '某机电出口商 CFO',
  },
  fees: [
    { item: '基础利率', amount: 'LIBOR + 50-150 bp', note: '根据客户资信和买方所在国' },
    { item: '审单费', amount: 'USD 30-50/笔', note: '' },
    { item: '催收费', amount: 'USD 50/笔', note: '逾期催收时收取' },
    { item: '电讯费', amount: 'USD 25/笔', note: 'SWIFT 通信费' },
  ],
  faq: [
    { q: '与福费廷有什么区别？', a: '出口押汇通常有追索权 (买方不付款，银行向出口商追偿)。福费廷是无追索权押汇 (银行承担所有风险)，利率高 50-100 bp。' },
    { q: '托收和 L/C 项下押汇的区别？', a: 'L/C 项下：开证行付款承诺 · 风险低 · 利率低。托收项下：仅靠商业信用 · 风险高 · 利率高 30-50 bp。' },
  ],
  ctaTitle: '加速资金回笼', ctaDesc: 'L/C 项下当日放款 · 融资 95%',
  ctaButton: { label: '出口押汇申请', to: '/login' },
};

// ─── 进口押汇 ────────────────────────────────────────────
const importFinancingCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '进口押汇' }],
  category: 'Import Bill Financing', productName: '进口押汇',
  tagline: '进口商赎单付款融资 · 30-180 天 · 灵活展期 · 利率 LIBOR + 60bp 起',
  badge: '进口商现金流救星',
  bullets: ['进口贸易融资', '30-180 天可展期', '利率 LIBOR + 60bp 起', '币种全覆盖', '与 L/C 业务联动', '商品质押降低成本'],
  background: 'navy',
  ctaPrimary: { label: '进口押汇申请', to: '/login' },
  overview: {
    description: '进口押汇 (Import Bill Financing) 是 BankerOS 应进口商申请，对外付清货款后给予进口商的短期融资。\n\n场景：进口商收到外贸单据后无足够现金付款赎单，BankerOS 替进口商先付款，进口商以销售货物的回笼资金分期归还押汇本息。\n\n核心价值：① 缓解付款资金压力;② 货物销售后归还更轻松;③ 商品质押降低融资成本。',
    benchmark: '对标 招行进口押汇 · 工行进口贸易融资 · HSBC Import Loan',
    params: [['融资期限', '30-180 天 (可展期)'], ['融资金额', '货款 90-100%'], ['利率', 'LIBOR + 60-150 bp'], ['担保方式', '商品质押 / 信用 / 房产抵押'], ['币种', 'USD/EUR/GBP/JPY 等']],
  },
  features: [
    { icon: '💸', title: '即开即用', desc: '与 L/C 业务无缝衔接 · L/C 项下自动申请' },
    { icon: '📦', title: '商品质押', desc: '进口商品作为质押物 · 利率低 50bp' },
    { icon: '🔄', title: '灵活展期', desc: '到期可申请 30-90 天展期 · 适应销售周期' },
    { icon: '🛂', title: '保税仓库', desc: '货物存于 BankerOS 合作保税仓 · 监管安全' },
  ],
  useCases: [
    { persona: '大宗进口商', icon: '🛢', scenario: '进口原油/铁矿/粮食大宗商品', benefit: '商品质押 · 销售后归还融资', example: '某能源公司进口 USD 5M 原油 · 押汇 90 天 · 销售后归还' },
    { persona: '消费品进口商', icon: '📱', scenario: '进口家电/服装/食品 · 等待分销', benefit: '货物分销期间的过桥融资', example: '某 3C 进口商 USD 1M 手机进口 · 押汇 60 天分销' },
  ],
  process: [
    { step: '01', actor: '进口商', title: '收到外贸单据', desc: '通过 L/C 或托收方式' },
    { step: '02', actor: '进口商', title: '申请押汇', desc: '不足以一次付清，申请融资' },
    { step: '03', actor: '银行',   title: '审核 + 放款', desc: '替进口商对外付清货款' },
    { step: '04', actor: '进口商', title: '取得货物', desc: '凭单据提货并销售' },
    { step: '05', actor: '进口商', title: '到期还款', desc: '销售回款归还押汇本息' },
  ],
  caseStudy: {
    company: '某 3C 进口商', logo: '📱', industry: '年进口额 USD 50M · 主要市场美/日',
    challenge: '从韩国进口一批手机 USD 2M · 货到港但分销需 60 天回款 · 现金不足以一次付清。',
    solution: 'BankerOS 进口押汇 USD 2M · 60 天期 · 商品质押 · 利率 LIBOR + 70 bp · 经销商付款后归还。',
    results: [{ metric: '融资规模', value: 'USD 2M' }, { metric: '期限', value: '60 天' }, { metric: '利息', value: 'USD 21K' }, { metric: '现金流改善', value: '✓' }],
    quote: '进口押汇是我们做大进口生意的关键工具。否则要么放弃订单，要么找高利率民间借贷。',
    quoteAuthor: '某 3C 进口商 CFO',
  },
  faq: [
    { q: '商品如果卖不掉怎么办？', a: '可以申请展期 30-90 天。若长期滞销，BankerOS 有权处置质押商品。建议进口商配套销售预估，避免囤积。' },
  ],
  ctaTitle: '解决进口现金流问题', ctaDesc: '商品质押 · 利率优惠',
  ctaButton: { label: '进口押汇申请', to: '/login' },
};

// ─── 福费廷 ────────────────────────────────────────────
const forfaitingCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '福费廷' }],
  category: 'Forfaiting', productName: '福费廷',
  tagline: '无追索权买断远期信用证下应收款 · 出口商立即收款 · 风险完全转移',
  badge: '无追索权 · 完全转移风险',
  bullets: ['100% 无追索权', '即时获得货款', '锁定汇率/利率风险', '远期信用证适用', '账户外业务 (不上资产负债表)', 'IFA 福费廷协会成员'],
  background: 'navy',
  ctaPrimary: { label: '福费廷咨询', to: '/help' },
  overview: {
    description: '福费廷 (Forfaiting) 源自法语，意为"放弃权利"。BankerOS 无追索权地买入出口商在远期信用证 (Usance L/C) 下未到期的应收款，扣除贴现息后立即支付货款给出口商。\n\n与出口押汇最大区别：福费廷是无追索权 — 即使买方/开证行违约，银行不向出口商追偿。出口商完全免除信用风险、汇率风险、利率风险、政治风险。\n\n适用于：长账期 (180 天-5 年) 大额贸易 · 高风险国家出口 · 资产负债表优化。',
    benchmark: '对标 HSBC Forfaiting · 工行福费廷 · 国际福费廷协会 IFA',
    params: [['追索方式', '完全无追索 (Without Recourse)'], ['期限', '180 天 - 5 年'], ['金额范围', 'USD 100K - 不设上限'], ['折扣率', 'LIBOR + 100-300 bp'], ['币种', 'USD/EUR/GBP'], ['资产负债表', '出表 (不计入负债)']],
  },
  features: [
    { icon: '🛡', title: '无追索权', desc: '100% 转移所有风险给 BankerOS · 出口商高枕无忧' },
    { icon: '⚡', title: '立即收款', desc: '远期票据立即变现 · DSO 从 5 年 → 0 天' },
    { icon: '📊', title: '出表融资', desc: '不计入负债 · 改善企业资产负债结构' },
    { icon: '🌐', title: '高风险国家', desc: '俄罗斯/伊朗/委内瑞拉等敏感市场出口可行' },
  ],
  useCases: [
    { persona: '大型设备出口', icon: '🏗', scenario: '出口飞机/船舶/重型机械 · 3-5 年付款', benefit: '5 年货款一次性变现', example: '某航空企业出口 USD 50M 飞机 · 5 年期 · 福费廷立即变现 USD 42M' },
    { persona: '工程承包', icon: '🏛', scenario: '海外大型 EPC 项目 · 业主分期付款', benefit: '锁定 5 年回款 + 转移风险', example: '某国企在非洲 EPC 项目 · USD 80M 分 5 年付款 · 福费廷处理' },
    { persona: '高风险市场', icon: '⚠️', scenario: '出口至俄罗斯/伊朗/朝鲜等', benefit: '银行承担政治风险', example: '某出口商至俄罗斯 EUR 10M · 福费廷转移制裁风险' },
  ],
  process: [
    { step: '01', actor: '出口商', title: '签订合同', desc: '约定远期 L/C 付款条款' },
    { step: '02', actor: '出口商', title: '咨询福费廷', desc: 'BankerOS 报价折扣率' },
    { step: '03', actor: '银行',   title: '尽调评估', desc: '评估开证行/进口国风险' },
    { step: '04', actor: '出口商', title: '发货并交单', desc: '取得开证行承兑' },
    { step: '05', actor: '银行',   title: '无追索买断', desc: '立即支付 · 风险完全转移' },
  ],
  caseStudy: {
    company: '某航空航天集团', logo: '✈️', industry: '飞机制造 · 海外出口',
    challenge: '出口 4 架支线客机至非洲某航空公司 · 总价 USD 60M · 5 年分期付款。担心：① 航空公司未来 5 年可能破产;② 当地货币贬值风险;③ 制裁政治风险。',
    solution: 'BankerOS 福费廷 USD 60M · 5 年期 · 无追索权买断。出口商立即获得 USD 48M (扣除 5 年贴现息 USD 12M)。所有信用/汇率/政治风险完全转移给 BankerOS。',
    results: [{ metric: '出口总价', value: 'USD 60M' }, { metric: '即收现金', value: 'USD 48M' }, { metric: '风险转移', value: '100%' }, { metric: 'DSO', value: '0 (从 5 年)' }],
    quote: '福费廷让我们能放心做长账期高风险市场。即使买方未来破产，我们也已经拿到了所有钱。',
    quoteAuthor: '某航空航天 CFO',
  },
  faq: [
    { q: '福费廷折扣率为什么这么高？', a: '因为银行承担所有风险 (信用/汇率/利率/政治)，定价相应包含风险溢价。但对出口商来说，转移这么多风险，多付 200-300 bp 是值得的。' },
  ],
  ctaTitle: '完全转移贸易风险', ctaDesc: '无追索权 · 立即变现 · 出表融资',
  ctaButton: { label: '福费廷咨询', to: '/help' },
};

// ─── 出口保理 ────────────────────────────────────────────
const exportFactoringCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '出口保理' }],
  category: 'Export Factoring', productName: '出口保理',
  tagline: '基于应收账款的融资 · 含信用风险担保 · 国际保理协会成员',
  badge: 'FCI 国际保理协会成员',
  bullets: ['应收账款融资 (80-90%)', '信用风险担保', '应收账款管理', '催收服务', '国际保理协会 FCI', '适合 O/A 30-180 天'],
  background: 'navy',
  ctaPrimary: { label: '出口保理咨询', to: '/help' },
  overview: {
    description: '出口保理 (Export Factoring) 是 BankerOS 为出口商提供的"3 in 1"综合服务：① 应收账款融资 (预付货款);② 信用风险担保 (买方违约赔付);③ 应收账款管理与催收。\n\n适用于赊销 (Open Account, O/A) 模式出口 — 出口商发货后给予买方 30-180 天信用期。BankerOS 通过 FCI 国际保理协会全球网络，与买方所在国保理商合作，提供本地催收。\n\n双保理 (Two-Factor) 模式：出口保理商 + 进口保理商联合服务。',
    benchmark: '对标 招商银行国际保理 · 工行出口保理 · COFACE',
    params: [['融资比例', '应收账款 80-90%'], ['期限', '30-180 天 (与账期匹配)'], ['坏账担保', '90-100% (含进口商破产)'], ['服务范围', 'FCI 网络 90+ 国家'], ['费率', '1-2% (含融资息)']],
  },
  features: [
    { icon: '💰', title: '应收账款融资', desc: '发货后立即获得 80-90% 货款' },
    { icon: '🛡', title: '坏账担保', desc: '买方破产/拖欠时银行赔付 (90-100%)' },
    { icon: '📊', title: '账款管理', desc: '专业账款管理 + 对账 + 报表' },
    { icon: '📞', title: '本地催收', desc: 'FCI 网络当地保理商专业催收' },
  ],
  useCases: [
    { persona: 'O/A 赊销出口', icon: '💳', scenario: '与海外大客户 O/A 60/90/180 天结算', benefit: '加速回款 + 坏账担保', example: '某 OEM 厂家月对欧美客户 O/A 60 天 · 保理融资' },
    { persona: '新客户开发', icon: '🆕', scenario: '想进入新市场但不了解客户资信', benefit: 'BankerOS 提供进口商资信调查', example: '某出口商进入巴西新客户 · 保理调查 + 担保' },
  ],
  process: [
    { step: '01', actor: '出口商', title: '签约保理', desc: '将应收账款转让给 BankerOS' },
    { step: '02', actor: '出口商', title: '发货销售', desc: '正常出货并出具发票' },
    { step: '03', actor: '银行',   title: '预付货款', desc: '应收账款 80-90% 当日到账' },
    { step: '04', actor: '银行',   title: '催收管理', desc: '到期通过 FCI 网络催收' },
    { step: '05', actor: '银行',   title: '清算余款', desc: '收齐货款后扣息 · 支付剩余 10-20%' },
  ],
  caseStudy: {
    company: '某家具出口商', logo: '🪑', industry: '出口至北美 IKEA / 沃尔玛 / Costco',
    challenge: '主要客户 IKEA 美国分公司要求 O/A 90 天 · 月销售 USD 3M · 担心客户资信 + 资金占用。',
    solution: 'BankerOS 出口保理 · 与 IKEA 应收账款 USD 3M/月 · 融资 85% (USD 2.55M/月当日到账) · 坏账担保 95%。',
    results: [{ metric: '月融资', value: 'USD 2.55M' }, { metric: '坏账担保', value: '95%' }, { metric: 'DSO', value: '0 (从 90 天)' }, { metric: '客户安心', value: '✓' }],
    quote: 'IKEA 这种大客户都给 90 天账期 · 没有保理我们根本接不起。BankerOS 让我们既能接订单又不怕坏账。',
    quoteAuthor: '某家具出口商 CFO',
  },
  ctaTitle: 'O/A 赊销出口保护伞', ctaDesc: '坏账担保 95% · FCI 全球网络',
  ctaButton: { label: '出口保理咨询', to: '/help' },
};

// ─── 航运融资 ────────────────────────────────────────────
const shippingFinanceCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '航运融资' }],
  category: 'Shipping Finance', productName: '航运融资',
  tagline: '船舶购置 · 航运公司流动资金 · 海上保险 · 全方位航运金融',
  badge: '海运 + 物流专属',
  bullets: ['船舶购置贷款 60-80% LTV', '航运公司流动资金', '运费押汇', '燃油融资', '海上保险', '集装箱融资'],
  background: 'navy',
  ctaPrimary: { label: '航运融资咨询', to: '/help' },
  overview: {
    description: '航运融资 (Shipping Finance) 是 BankerOS 为航运公司、船东、物流企业提供的综合金融服务。\n\n核心产品：\n① 船舶购置贷款 — 新造船/二手船购买 · 60-80% LTV · 期限 5-15 年\n② 航运公司流动资金 — 燃油/港口费/船员工资周转\n③ 运费押汇 — 装船后凭提单融资\n④ 集装箱融资 — 集装箱购置/租赁\n⑤ 海上保险 — 与劳合社合作的船舶/货物险',
    benchmark: '对标 香港金融管理局航运中心 · 渣打航运金融',
    params: [['船舶贷款 LTV', '60-80%'], ['期限', '5-15 年'], ['利率', 'LIBOR + 200-400 bp'], ['船龄要求', '< 15 年'], ['抵押方式', '船舶第一抵押权'], ['保险', '强制船舶险 + 战争险']],
  },
  features: [
    { icon: '🚢', title: '船舶购置贷款', desc: '新造船 / 二手船 · 60-80% 船价融资' },
    { icon: '⛽', title: '燃油融资', desc: '燃油采购短期融资 · 与油轮合作' },
    { icon: '📦', title: '集装箱融资', desc: '20尺/40尺 集装箱购置/租赁融资' },
    { icon: '🛡', title: '海上保险', desc: '船舶险 + 货物险 + 战争险 + 海盗险' },
    { icon: '⚓', title: '港口费支付', desc: '全球港口费 USD 一键支付' },
  ],
  useCases: [
    { persona: '船东', icon: '👨‍✈️', scenario: '购置新船扩大船队', benefit: '60-80% 船价融资 · 15 年长期', example: '某航运公司购置 5 万吨散货船 USD 30M · 融资 USD 21M' },
    { persona: '物流公司', icon: '📦', scenario: '集装箱采购 · 港口费周转', benefit: '集装箱融资 + 流动资金贷款', example: '某物流公司年采购 5000 个集装箱 · 融资 USD 8M' },
  ],
  process: [
    { step: '01', actor: '船东', title: '提交船舶资料', desc: '船舶规格 + 卖家 + 评估报告' },
    { step: '02', actor: '银行', title: '尽调评估', desc: '船龄 / 船况 / 船东资信' },
    { step: '03', actor: '银行', title: '审批授信', desc: '4-8 周完成 (大额项目)' },
    { step: '04', actor: '银行', title: '放款交割', desc: '船舶过户 + 第一抵押权' },
  ],
  caseStudy: {
    company: '某航运公司 (HK 上市)', logo: '🚢', industry: '集装箱航运 · 旗下 12 艘船',
    challenge: '订造 2 艘 6000 TEU 集装箱船 · 单价 USD 40M · 总价 USD 80M。需要 70% 融资 (USD 56M)。',
    solution: 'BankerOS 牵头银团贷款 USD 56M · 12 年期 · 船舶第一抵押权 · 配套船舶险 + 战争险。',
    results: [{ metric: '融资规模', value: 'USD 56M' }, { metric: 'LTV', value: '70%' }, { metric: '期限', value: '12 年' }, { metric: '银团成员', value: '6 家' }],
    quote: 'BankerOS 是少数能做航运项目的银行。从船舶融资到海上保险一站式 · 让我们专注航运业务。',
    quoteAuthor: '某航运公司 CFO',
  },
  ctaTitle: '航运业务一站式金融', ctaDesc: '与劳合社/IUMI 合作',
  ctaButton: { label: '航运融资咨询', to: '/help' },
};

// ─── 出口信贷 ────────────────────────────────────────────
const exportCreditCfg: ProductConfig = {
  breadcrumbs: [{ label: '企业银行' }, { label: '贸易融资', to: '/products/business/trade-finance' }, { label: '出口信贷' }],
  category: 'Export Credit', productName: '出口信贷',
  tagline: '配合出口信用保险 · 中长期项目融资 · OECD 出口信贷框架',
  badge: 'OECD 框架 · 政策性融资',
  bullets: ['配套出口信用保险', '中长期 2-15 年', '大额项目融资', 'OECD 出口信贷协议', '与中信保合作', '一带一路重点支持'],
  background: 'navy',
  ctaPrimary: { label: '出口信贷咨询', to: '/help' },
  overview: {
    description: '出口信贷 (Export Credit) 是政策性金融工具 · 帮助本国出口商在国际市场上销售大型机电设备、工程承包、技术服务等高附加值产品/服务。\n\n两种形式：\n① 卖方信贷 — 银行贷款给本国出口商 · 出口商给买方提供延期付款;\n② 买方信贷 — 银行直接贷款给海外买方 · 资金专用于购买本国产品。\n\n通常配套出口信用保险 (中信保 / SACE / Euler Hermes) · 转移政治和商业风险。遵守 OECD 出口信贷协议 (OECD Arrangement) · 利率/期限均有国际框架。',
    benchmark: '对标 中国进出口银行 · 中国出口信用保险公司 · 韩国进出口银行 KEXIM',
    params: [['期限', '2-15 年 (国际标准)'], ['LTV', '通常 85%'], ['利率', 'CIRR (商业参考利率)'], ['首付', '15% (合同价格)'], ['配套保险', '中信保 90-95% 担保'], ['适用产品', '机电设备/工程/船舶/飞机']],
  },
  features: [
    { icon: '🌍', title: '海外大项目', desc: '海外高速公路/电厂/港口/桥梁等基建项目' },
    { icon: '🛡', title: '中信保担保', desc: '中国出口信用保险 90-95% 担保 · 转移政治/商业风险' },
    { icon: '📈', title: '中长期融资', desc: '2-15 年长期 · 匹配大型项目周期' },
    { icon: '🚀', title: '一带一路', desc: '配合国家战略 · 优先支持一带一路项目' },
  ],
  useCases: [
    { persona: '装备制造', icon: '🏭', scenario: '出口大型机电设备 (发电机/盾构机/挖掘机)', benefit: '助力中国装备走出去', example: '某重工出口非洲挖掘机 USD 80M · 5 年期出口信贷' },
    { persona: 'EPC 总承包商', icon: '🏗', scenario: '海外大型基建项目 · 业主分期付款', benefit: '出口信贷 + 中信保配套', example: '某基建集团承包东南亚港口 USD 500M · 出口信贷 USD 425M' },
    { persona: '高科技出口', icon: '🚄', scenario: '出口高铁/特高压电网/卫星等', benefit: '战略性产品出口支持', example: '某中车集团出口高铁 USD 1B · 国家级出口信贷' },
  ],
  process: [
    { step: '01', actor: '出口商', title: '签合同 + 申请', desc: '与海外业主签出口合同' },
    { step: '02', actor: '中信保', title: '保险承保', desc: '中信保评估并出具承保意向' },
    { step: '03', actor: '银行',   title: '尽调审批', desc: '6-12 个月评估项目可行性' },
    { step: '04', actor: '银行',   title: '签贷款协议', desc: '出口信贷协议 + 业主担保' },
    { step: '05', actor: '银行',   title: '分期放款', desc: '按项目进度分期支付' },
  ],
  caseStudy: {
    company: '某国企海外水电项目', logo: '⚡', industry: 'EPC 工程承包 · 一带一路项目',
    challenge: '承接东南亚某国 USD 800M 水电站 EPC 项目。业主 (该国电力公司) 要求 10 年分期付款。需要 BankerOS 出口信贷 + 中信保担保。',
    solution: 'BankerOS 联合中信保 + 银团：① 中信保承保 90% 政治和商业风险;② BankerOS 牵头银团 USD 680M 出口信贷 · 10 年期 · CIRR 利率;③ 业主 15% 首付;④ 配套海运 + 工程保险。',
    results: [{ metric: '项目总额', value: 'USD 800M' }, { metric: '出口信贷', value: 'USD 680M' }, { metric: '中信保担保', value: '90%' }, { metric: '中国设备出口', value: 'USD 600M' }],
    quote: '一带一路大项目离不开出口信贷支持。BankerOS 整合中信保 + 银团 + 项目融资能力让我们顺利拿下海外大单。',
    quoteAuthor: '某国企海外事业部总经理',
  },
  ctaTitle: '助力企业走向世界', ctaDesc: '一带一路战略合作伙伴',
  ctaButton: { label: '出口信贷咨询', to: '/help' },
};

export const TfBankGuarantee   = () => <ProductDetailLite {...bankGuaranteeCfg} />;
export const TfExportFinancing = () => <ProductDetailLite {...exportFinancingCfg} />;
export const TfImportFinancing = () => <ProductDetailLite {...importFinancingCfg} />;
export const TfForfaiting      = () => <ProductDetailLite {...forfaitingCfg} />;
export const TfExportFactoring = () => <ProductDetailLite {...exportFactoringCfg} />;
export const TfShippingFinance = () => <ProductDetailLite {...shippingFinanceCfg} />;
export const TfExportCredit    = () => <ProductDetailLite {...exportCreditCfg} />;
