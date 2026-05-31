/**
 * Accounts, Deposits, FX, Precious Metals, Insurance detail pages
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

// ─── 一卡通主账户 ────────────────────────────────────────────
const allInOneCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '银行账户', to: '/products/accounts' }, { label: '一卡通主账户' }],
  category: 'All-in-One Account', productName: '一卡通主账户',
  tagline: '一张卡管理 12 种货币 · 全球 ATM 取现免费 · 7×24 实时换汇 · 招行经典模式',
  badge: '招行同款一卡通体验',
  bullets: ['12 种主流货币一卡管理', '全球 ATM 取现免手续费', '7×24 实时换汇', '免账户管理费', '手机银行一键切换币种', '存款保险 50 万元'],
  background: 'navy',
  ctaPrimary: { label: '在线开户', to: '/login?action=open' },
  overview: {
    description: '一卡通主账户是 BankerOS 借鉴招行经典"一卡通"模式打造的多币种综合账户。\n\n一张卡片绑定一个客户的多个币种子账户 (USD/EUR/HKD/CNY 等 12 种)，统一登录、统一对账、统一管理。\n\n核心场景：经常出境旅游/商务 · 跨境投资 · 海外购物 · 外汇兑换 · 子女留学。',
    benchmark: '对标 招行一卡通 · HSBC Premier Multi-Currency · Citi Citigold',
    params: [['账户类型', '综合账户'], ['支持币种', 'USD/EUR/GBP/JPY/HKD/SGD 等 12 种'], ['账户管理费', '免'], ['ATM 取现', '全球 200+ 国家免费'], ['换汇手续费', '免'], ['存款保险', '¥ 50 万 / 账户']],
  },
  features: [
    { icon: '💱', title: '12 种货币', desc: '一张卡片同时持有 USD/EUR/GBP/JPY/HKD/SGD/AUD/CAD/CHF/CNY/CNH/NZD' },
    { icon: '🌐', title: '全球 ATM 免费', desc: 'Plus / Cirrus / 银联三网通用 · 200+ 国家 100 万台 ATM' },
    { icon: '⚡', title: '7×24 实时换汇', desc: '单笔最高 100 万美元 · 按 BankerOS 实时报价' },
    { icon: '📱', title: 'App 切换币种', desc: '手机银行内一键切换币种支付 · 自动换汇' },
    { icon: '🧾', title: '统一对账单', desc: '所有币种统一对账 · 月度 PDF / camt.053 导出' },
    { icon: '🛡', title: '存款保险', desc: '受国家存款保险条例保护 · 最高 ¥50 万/账户' },
  ],
  useCases: [
    { persona: '环球旅行者', icon: '✈️', scenario: '每年出境 5+ 次 · 多国消费', benefit: '免货币转换费 · ATM 免费取现', example: '某商务人士年出境 12 次 · 节省手续费 ¥8,000' },
    { persona: '留学家庭', icon: '🎓', scenario: '子女海外留学 · 学费 + 生活费汇款', benefit: '一卡多币 · 学费实时支付', example: '子女在美留学 · 每月生活费 $2,000 美元账户直接消费' },
    { persona: '跨境投资', icon: '📊', scenario: '美股 / 港股 / 海外基金投资', benefit: '美元/港币账户直接对接券商', example: '某投资者持 USD 50K 跨境股票投资' },
  ],
  process: [
    { step: '01', actor: '客户', title: '在线开户', desc: '8 分钟完成 KYC' },
    { step: '02', actor: '银行', title: '开立主账户 + 子账户', desc: '12 种币种子账户自动开立' },
    { step: '03', actor: '银行', title: '寄卡', desc: '5-7 天卡片到家' },
    { step: '04', actor: '客户', title: 'App 激活', desc: '激活后立即享受全球服务' },
  ],
  caseStudy: {
    company: '王女士 (跨境电商经营)', logo: '🛒', industry: '32 岁 · 深圳 · 美国/欧洲电商业务',
    challenge: '王女士经营跨境电商，需要每月收 USD/EUR/GBP 三种货币的销售款，并支付供应商 USD 货款。过去用 3 个不同银行的账户，对账复杂、换汇成本高。',
    solution: 'BankerOS 一卡通主账户：一张卡管理 USD/EUR/GBP/CNY 4 种货币 · 销售款直接入对应币种账户 · 付款用美元账户支付 · 月底统一换汇结算。',
    results: [{ metric: '账户简化', value: '4 个 → 1 张卡' }, { metric: '换汇成本', value: '↓ 0.4%' }, { metric: '对账时间', value: '↓ 80%' }, { metric: '资金可视', value: '实时' }],
    quote: '一卡通让我的跨境业务管理变得超简单。月底对账从 1 天缩短到 1 小时，所有币种余额一目了然。',
    quoteAuthor: '王女士 · 一卡通客户',
  },
  fees: [
    { item: '账户管理费', amount: '免', note: '所有币种子账户' },
    { item: 'ATM 取现 (境外)', amount: '免', note: 'Plus/Cirrus/银联网络' },
    { item: 'ATM 取现 (本行)', amount: '免', note: '不限次数' },
    { item: '换汇手续费', amount: '免', note: '按 BankerOS 实时报价' },
    { item: '小额账户费', amount: '免', note: '无最低存款要求' },
  ],
  faq: [
    { q: '是否需要为每种货币单独开户？', a: '不需要。开通一卡通后，所有币种子账户自动建立，无需单独申请。' },
    { q: '换汇费率怎么算？', a: '按 BankerOS 实时报价 (买入价 + 卖出价 ≈ 中间价 ± 10-15 bp)。比传统银行优惠 30-50%。' },
    { q: '海外取现真的不要手续费？', a: '是的。BankerOS 与 Plus/Cirrus/银联 三大网络合作，全球 200+ 国家 100 万 ATM 取现 0 手续费。仅当地 ATM 运营商可能收 $1-3 操作费。' },
  ],
  ctaTitle: '一卡走天下', ctaDesc: '12 种货币 · 全球免费 · 8 分钟开户',
  ctaButton: { label: '在线开户', to: '/login?action=open' },
};

// ─── 大额存单 ────────────────────────────────────────────
const certificateDepositCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '存款产品', to: '/products/savings' }, { label: '大额存单' }],
  category: 'Certificate of Deposit', productName: '大额存单',
  tagline: '20 万起存 · 利率上浮 35%-50% · 可转让 · 1/3/5 年期可选',
  badge: '高息存款 · 可转让 CD',
  bullets: ['¥ 20 万起存', '利率上浮 35-50%', '1/3/5 年期可选', '可转让二级市场', '存款保险保障', '到期自动续期'],
  background: 'navy',
  ctaPrimary: { label: '认购大额存单', to: '/login' },
  overview: {
    description: '大额存单 (Negotiable Certificate of Deposit, NCD) 是商业银行面向个人和非金融机构发行的、以人民币计价的记账式大额存款凭证。\n\n相比普通定期存款，大额存单的利率显著上浮 35-50% · 可在到期前转让给其他客户 · 流动性更强。\n\n核心场景：保守型客户的中长期资金配置 · 退休金管理 · 教育金储备。',
    benchmark: '对标 招行大额存单 · 工行大额可转让定存',
    params: [['最低起存', '¥ 200,000'], ['期限', '1/3/5 年'], ['1 年利率', '1.85% (上浮 35%)'], ['3 年利率', '2.85% (上浮 35%)'], ['5 年利率', '3.10% (上浮 50%)'], ['可转让', '是 (二级市场)'], ['存款保险', '¥ 50 万']],
  },
  features: [
    { icon: '💰', title: '高息存款', desc: '相比同期定期上浮 35-50% · 收益显著提升' },
    { icon: '🔄', title: '可转让', desc: '到期前可在 BankerOS 二级市场转让 · 流动性强' },
    { icon: '🛡', title: '存款保险', desc: '受国家存款保险条例保护 · 最高 ¥50 万' },
    { icon: '📅', title: '到期自动续期', desc: '可设置到期自动续存 · 享受滚动利息' },
  ],
  useCases: [
    { persona: '保守型理财', icon: '🛡', scenario: '不愿承担本金风险 · 希望略高于定期收益', benefit: '比定期高 35% · 本金 100% 安全', example: '退休教师 ¥80 万 3 年期 · 年利息 ¥2.28 万' },
    { persona: '教育金储备', icon: '🎓', scenario: '为子女 5-10 年后留学规划', benefit: '5 年锁定 3.10% 高息', example: '为孩子准备 ¥100 万留学金 · 5 年后变 ¥117 万' },
    { persona: '中老年人', icon: '👴', scenario: '退休金管理 · 寻求安全稳健收益', benefit: '存款保险保障 · 高于活期 10 倍', example: '某退休干部 ¥50 万 3 年期' },
  ],
  process: [
    { step: '01', actor: '客户', title: '选择期限', desc: '1/3/5 年 · 收益不同' },
    { step: '02', actor: '客户', title: '提交认购', desc: 'App 内一键认购 ¥20 万 起' },
    { step: '03', actor: '银行', title: '划款', desc: '资金从活期账户划转' },
    { step: '04', actor: '客户', title: '持有', desc: '到期收本金 + 利息' },
  ],
  caseStudy: {
    company: '陈先生 (退休工程师)', logo: '👴', industry: '65 岁 · 上海 · 退休金管理',
    challenge: '陈先生退休后有 ¥200 万存款，希望既安全又有合理回报。活期利息太低 (0.2%)，定期收益又不甘心 (1.65%)。',
    solution: 'BankerOS 大额存单组合：¥100 万 5 年期 (3.10%) + ¥100 万 1 年期 (1.85%) 滚动 · 兼顾收益和流动性。',
    results: [{ metric: '年利息', value: '¥ 49,500' }, { metric: '比活期', value: '↑ 25 倍' }, { metric: '比定期', value: '↑ 35%' }, { metric: '本金安全', value: '100%' }],
    quote: '大额存单让我兼顾收益和安全。即使急用钱也能转让，比定期灵活很多。',
    quoteAuthor: '陈先生 · 大额存单客户',
  },
  faq: [
    { q: '可以提前支取吗？', a: '不可直接提前支取。但可在 BankerOS 二级市场转让给其他客户，按当前市场价成交 (通常略低于面值)。' },
    { q: '如何转让？', a: 'App 内"我的大额存单"→"转让"，输入转让价格，2-7 天内自动匹配买家。' },
    { q: '受存款保险保护吗？', a: '是的。大额存单和普通存款一样，受国家存款保险条例保护，单家银行最高 ¥50 万/客户。超过部分建议分散持有。' },
  ],
  ctaTitle: '高息存款 · 安全保障', ctaDesc: '¥20 万起 · 利率上浮 35-50%',
  ctaButton: { label: '认购大额存单', to: '/login' },
};

// ─── 结构性存款 ────────────────────────────────────────────
const structuredDepositCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '存款产品', to: '/products/savings' }, { label: '结构性存款' }],
  category: 'Structured Deposit', productName: '结构性存款',
  tagline: '挂钩股票/汇率/利率 · 保本浮动收益 · 预期年化 3-6%',
  badge: '保本 + 浮动收益',
  bullets: ['100% 保本承诺', '挂钩多种标的', '预期收益 3-6%', '期限 3-12 个月', '存款保险保障', '不计入理财额度'],
  background: 'navy',
  ctaPrimary: { label: '了解最新产品', to: '/login' },
  overview: {
    description: '结构性存款是嵌入金融衍生品 (期权) 的存款产品。本金按存款管理 100% 保本，收益挂钩股票指数 / 汇率 / 利率 / 大宗商品等标的，浮动产生。\n\n相比理财产品 (非保本)，结构性存款风险等级低 (R1 谨慎)。相比定期存款，潜在收益更高。',
    benchmark: '对标 招行结构性存款 · 工行结构性存款 · HSBC Equity-Linked Deposit',
    params: [['最低起存', '¥ 50,000'], ['期限', '3 / 6 / 9 / 12 个月'], ['保本比例', '100%'], ['预期收益', '3% - 6%'], ['挂钩标的', 'S&P 500 / 沪深300 / 黄金 / 汇率等'], ['风险等级', 'R1 谨慎']],
  },
  features: [
    { icon: '🛡', title: '100% 保本', desc: '本金 100% 安全 · 不会亏损 · 受存款保险保护' },
    { icon: '📈', title: '潜在高收益', desc: '挂钩标的表现良好时收益最高 6% (超出定期 3 倍)' },
    { icon: '🎯', title: '多种标的', desc: '股票指数 (沪深300/标普 500) / 汇率 (USDCNY) / 黄金' },
    { icon: '⏰', title: '短期灵活', desc: '3-12 个月可选 · 资金占用时间短' },
  ],
  useCases: [
    { persona: '保守型客户', icon: '🛡', scenario: '不能承受本金损失 · 但定期太低', benefit: '保本 + 比定期高出 1-3 个百分点', example: '某退休客户 ¥30 万 · 12 个月期 · 实际收益 4.8%' },
    { persona: '看涨标的客户', icon: '📈', scenario: '认为股市/黄金/某种货币会上涨', benefit: '0 风险参与上涨收益', example: '看涨标普 500 · 12 个月期 · 最高收益 6%' },
  ],
  process: [
    { step: '01', actor: '客户', title: '风险评估', desc: '完成 R1 级别投资者认证' },
    { step: '02', actor: '客户', title: '选择产品', desc: '挑选挂钩标的 + 期限' },
    { step: '03', actor: '客户', title: '认购', desc: '¥5 万 起认购' },
    { step: '04', actor: '银行', title: '到期兑付', desc: '本金 + 浮动收益自动入账' },
  ],
  caseStudy: {
    company: '李先生 (公务员)', logo: '🏛', industry: '45 岁 · 北京 · 保守型客户',
    challenge: '想给孩子准备一笔 1 年后的留学押金 ¥30 万。普通定期 1 年期只有 1.65%，但理财产品又怕本金亏损。',
    solution: 'BankerOS 12 个月期挂钩标普 500 结构性存款：100% 保本 · 预期收益 3.5% - 6.0%。',
    results: [{ metric: '本金安全', value: '100%' }, { metric: '实际年化', value: '4.8%' }, { metric: '比定期高', value: '+ 3.15%' }, { metric: '到期金额', value: '¥ 31.44 万' }],
    quote: '保本但收益翻倍 — 这种产品对我这种谨慎的客户太友好了。',
    quoteAuthor: '李先生 · 结构性存款客户',
  },
  faq: [
    { q: '为什么能保本？', a: '本金部分作为银行普通存款，受存款保险保护。收益部分用利息购买期权 — 期权赚了多分红，亏了也最多损失利息部分。' },
    { q: '提前支取怎么办？', a: '部分产品支持提前支取，但只能拿回本金 (无收益)。建议持有到期。' },
    { q: '与理财产品的区别？', a: '结构性存款受存款保险保护 (本金 100% 安全)，理财产品是非保本。结构性存款适合保守型客户，理财产品适合稳健型。' },
  ],
  ctaTitle: '保本投资 · 享浮动收益', ctaDesc: '5 万起 · 3-12 个月 · 100% 保本',
  ctaButton: { label: '了解最新产品', to: '/login' },
};

// ─── 外汇兑换 ────────────────────────────────────────────
const fxExchangeCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '外汇兑换' }],
  category: 'FX Exchange', productName: '外汇兑换',
  tagline: '12 种货币 · 7×24 实时换汇 · 优于市场 0.4% · 单笔最高 $1M',
  badge: '7×24 实时换汇',
  bullets: ['12 种主流货币', '7×24 不间断', '汇率优于市场 0.4%', '单笔 $1M 等值', '智能汇率预警', '定投锁汇支持'],
  background: 'navy',
  ctaPrimary: { label: '立即换汇', to: '/login' },
  overview: {
    description: 'BankerOS 外汇兑换服务是个人客户在不同币种间转换资金的便捷工具。\n\n基于 BankerOS 与全球 60+ 大型 FX 流动性提供商的直连，提供市场前 5% 的优惠汇率。\n\n核心场景：出境旅游 · 海外留学汇款 · 跨境投资 · 海外保险缴费 · 外汇资产配置。',
    benchmark: '对标 招行手机银行换汇 · HSBC FX · Wise',
    params: [['货币对', '12 种主流'], ['运行时间', '7×24 不间断'], ['汇率优势', '0.4% (vs 中间价)'], ['单笔上限', '$ 1,000,000 等值'], ['年度结售汇额度', '$ 50,000 (大陆居民)'], ['手续费', '免']],
  },
  features: [
    { icon: '⚡', title: '7×24 不间断', desc: '周末/节假日均可换汇 · 不受银行营业时间限制' },
    { icon: '💱', title: '12 种货币', desc: 'USD/EUR/GBP/JPY/HKD/SGD/AUD/CAD/CHF/CNY/CNH/NZD' },
    { icon: '🔔', title: '汇率预警', desc: '设置目标汇率 · 达到时自动通知/自动换汇' },
    { icon: '📅', title: '定投锁汇', desc: '为留学家庭设计 · 每月固定金额自动换汇' },
  ],
  useCases: [
    { persona: '出境旅游', icon: '✈️', scenario: '欧洲游 / 日本游 / 美国游', benefit: '7×24 提前换汇 · 不需到柜台', example: '欧洲游前一晚 22:00 换汇 €5,000' },
    { persona: '留学家庭', icon: '🎓', scenario: '每月固定汇学费/生活费', benefit: '定投锁汇 · 分散汇率风险', example: '英国留学 · 每月 £3,000 自动换汇' },
    { persona: '海外投资', icon: '📊', scenario: '美股 / 港股 / 海外基金', benefit: '大额换汇 · 优惠汇率', example: '某投资者一次性换 $200K 美元' },
  ],
  process: [
    { step: '01', actor: '客户', title: 'App 选择币种', desc: '选择买入和卖出货币对' },
    { step: '02', actor: '客户', title: '查询实时汇率', desc: 'BankerOS 实时报价' },
    { step: '03', actor: '客户', title: '确认换汇', desc: '输入金额 · 一键确认' },
    { step: '04', actor: '银行', title: '即时到账', desc: '资金 30 秒内入对应币种账户' },
  ],
  caseStudy: {
    company: '张女士 (英国伦敦留学子女)', logo: '🎓', industry: '45 岁 · 母亲为子女汇款',
    challenge: '儿子在伦敦读硕士，每月需汇 £3,000 生活费 + 半年汇 £15,000 学费。汇率波动让她担心汇多了浪费、汇少了不够。',
    solution: 'BankerOS 定投锁汇：① 每月 15 号自动以当日汇率换 £3,000 (¥27,500 左右)；② 学费 £15,000 设定汇率预警，达到 9.0 时自动执行。',
    results: [{ metric: '汇率优惠', value: '↓ 0.4%' }, { metric: '年节省', value: '¥ 3,800' }, { metric: '手动操作', value: '↓ 0' }, { metric: '汇率波动风险', value: '↓ 50%' }],
    quote: '定投锁汇让我从「每月跑银行」的焦虑中解脱出来。汇率好的时候系统自动多换，差的时候少换 — 数学上证明是最优策略。',
    quoteAuthor: '张女士 · 留学汇款客户',
  },
  fees: [
    { item: '换汇手续费', amount: '免', note: '所有币种' },
    { item: '汇率点差', amount: '~ 0.1-0.2%', note: '远低于现钞牌价 0.6%' },
    { item: '定投锁汇', amount: '免', note: '增值服务免费' },
  ],
  faq: [
    { q: '汇率为什么比柜台便宜？', a: 'BankerOS App 换汇按现汇牌价 (银行间价格 + 0.1-0.2% 点差)。柜台兑换按现钞牌价 (额外 0.4-0.6% 点差)。App 优惠 0.4% 是典型差距。' },
    { q: '$50K 年度额度怎么用？', a: '中国大陆居民每人每年最多购汇 $50K 等值外币。已结汇不计入限额。BankerOS App 实时显示剩余额度。' },
    { q: '超出年度额度怎么办？', a: '通过 BankerOS 香港分行账户 (Premier 客户专享) 或合规化的海外资产证明购汇。' },
  ],
  ctaTitle: '7×24 智能换汇', ctaDesc: '12 货币 · 优惠汇率 · 即时到账',
  ctaButton: { label: '立即换汇', to: '/login' },
};

// ─── 贵金属 ────────────────────────────────────────────
const preciousMetalsCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贵金属' }],
  category: 'Precious Metals', productName: '贵金属投资',
  tagline: '黄金 / 白银 / 铂金 / 钯金 · 实物 + 纸黄金 · 抗通胀避险资产',
  badge: '抗通胀首选 · 避险资产',
  bullets: ['4 种贵金属 (Au/Ag/Pt/Pd)', '实物 + 账户黄金', '1g 起投', '7×24 实时报价', '抗通胀避险', '可与上交所黄金对接'],
  background: 'gold',
  ctaPrimary: { label: '开始投资黄金', to: '/login' },
  overview: {
    description: '贵金属投资是 BankerOS 提供的实物 / 账户型贵金属投资服务。\n\n两种形式：① 实物黄金 (金条/金币) · 顺丰寄送上门 + 银行保管箱托管；② 账户黄金 (纸黄金) · 不持有实物 · 价格挂钩国际金价。\n\n避险价值：黄金长期与货币贬值正相关。过去 20 年人民币计价黄金涨幅超 400%。',
    benchmark: '对标 工行如意金条 · 招行黄金通 · 上交所 Au99.99',
    params: [['品种', '黄金 Au / 白银 Ag / 铂金 Pt / 钯金 Pd'], ['形式', '实物 + 账户'], ['最低交易', '1g'], ['运行时间', '7×24 (账户) / 工作时间 (实物)'], ['交割', '顺丰 + 银行保管箱'], ['手续费', '0.5% (实物) / 0.1% (账户)']],
  },
  features: [
    { icon: '🟡', title: '实物黄金', desc: '金条 (10g/50g/100g/500g/1kg) + 金币 (生肖/熊猫) · 顺丰寄送' },
    { icon: '💎', title: '账户黄金', desc: '不持实物 · 类似股票交易 · 价格挂钩国际金价' },
    { icon: '🏦', title: '银行保管箱', desc: '可托管至 BankerOS 全国 200+ 网点保管箱' },
    { icon: '📊', title: '实时报价', desc: '与上海黄金交易所 Au99.99 直连 · 7×24 报价' },
  ],
  useCases: [
    { persona: '抗通胀客户', icon: '🛡', scenario: '担心货币贬值 · 长期持有避险资产', benefit: '黄金长期跑赢通胀 · 平均年化 6-8%', example: '某客户配置 10% 资产为黄金 · 抗 2022 年通胀' },
    { persona: '婚庆礼品', icon: '💒', scenario: '结婚 / 满月 / 寿宴礼品', benefit: '生肖金条/金币 · 保值传家', example: '生日宴赠送 50g 龙年生肖金条' },
    { persona: '收藏投资', icon: '🏛', scenario: '熊猫金币 / 限量纪念币收藏', benefit: '兼顾投资和收藏价值', example: '2024 年熊猫金币套装 · 增值 30%' },
  ],
  process: [
    { step: '01', actor: '客户', title: '选择形式', desc: '实物 (寄送) 或账户 (纸黄金)' },
    { step: '02', actor: '客户', title: '在线下单', desc: 'App 一键买入' },
    { step: '03', actor: '银行', title: '交割', desc: '账户金即时入账 / 实物 7 天寄送' },
    { step: '04', actor: '客户', title: '持有', desc: '实物存自家或保管箱' },
  ],
  caseStudy: {
    company: '某高净值家庭', logo: '👨‍👩‍👧', industry: '50 岁 · 上海 · 财富配置黄金',
    challenge: '家庭可投资资产 ¥1,000 万，希望配置 10% (¥100 万) 为黄金作为长期避险。但实物存家担心安全，纸黄金又觉得"没拿到手"。',
    solution: 'BankerOS 组合方案：① ¥50 万实物 (100g 金条 × 8 根) 存入 BankerOS 保管箱；② ¥50 万账户黄金 · 灵活操作 · 短期波段。',
    results: [{ metric: '实物 + 账户', value: '50/50 配比' }, { metric: '保管箱', value: '免费 (Jade)' }, { metric: '5 年年化', value: '+ 8.4%' }, { metric: '抗通胀', value: '✓' }],
    quote: '黄金是我家族的「压舱石」。实物给我安心感，账户给我灵活度，两者结合最优。',
    quoteAuthor: '某高净值家庭 · 贵金属客户',
  },
  faq: [
    { q: '黄金会亏钱吗？', a: '短期会波动，但长期 (10 年以上) 历史数据显示黄金抗通胀效果显著。2003-2023 年人民币计价黄金涨幅 5 倍以上。建议作为资产配置的一部分 (5-15%) 而非主投。' },
    { q: '实物黄金怎么变现？', a: '可在 BankerOS App 内一键回购 (按当日金价 - 1% 手续费)，资金 T+1 到账。或自行到当地金店变现 (价格略低)。' },
    { q: '账户黄金需要交割实物吗？', a: '不需要。账户黄金类似股票，只在账户内交易。但持有 100g 以上账户金可申请实物交割。' },
  ],
  ctaTitle: '配置黄金 · 抗通胀传家', ctaDesc: '1g 起投 · 实物 + 账户双模式',
  ctaButton: { label: '开始投资黄金', to: '/login' },
};

// ─── 人寿保险 ────────────────────────────────────────────
const lifeInsuranceCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '保险', to: '/products/insurance/life' }, { label: '人寿保险' }],
  category: 'Life Insurance', productName: '人寿保险',
  tagline: '定期寿险 / 终身寿险 / 投连险 · 100 万-1000 万保额 · 家庭支柱保障',
  badge: '家庭保障必备',
  bullets: ['定期 / 终身 / 投连 3 类', '保额 100 万-1000 万', '保费灵活年缴', '免体检最高 100 万', '与保险公司直签', '15 天犹豫期'],
  background: 'navy',
  ctaPrimary: { label: '人寿保险测算', to: '/login' },
  overview: {
    description: '人寿保险是被保险人身故/全残时为受益人提供经济补偿的保障型保险。\n\n3 大类型：① 定期寿险 (10-30 年保障 · 保费低 · 适合家庭主收入者)；② 终身寿险 (终身保障 + 现金价值 · 适合资产传承)；③ 投连险 (保险 + 投资 · 适合追求收益客户)。\n\n核心价值：家庭支柱身故时，保险金保障家人房贷、子女教育、生活费数十年开支。',
    benchmark: '对标 中信保诚定期寿险 · 平安智盈人生 · 友邦充裕未来',
    params: [['类型', '定期 / 终身 / 投连'], ['保额范围', '¥ 100 万 - ¥ 1,000 万'], ['投保年龄', '18-60 周岁'], ['保障期限', '10/20/30 年 / 终身'], ['缴费方式', '年缴 / 月缴'], ['犹豫期', '15 天']],
  },
  features: [
    { icon: '🛡', title: '定期寿险', desc: '保费低 (30 岁男 100 万 30 年仅 ¥1,500/年) · 适合家庭主力' },
    { icon: '💎', title: '终身寿险', desc: '终身保障 + 现金价值积累 · 兼具传承和保障' },
    { icon: '📈', title: '投连险', desc: '保险 + 投资组合 · 现金价值随市场表现波动' },
    { icon: '⚡', title: '免体检', desc: '保额 100 万以内免体检 · 60 岁以下健康人群' },
  ],
  useCases: [
    { persona: '家庭主力', icon: '👨‍💼', scenario: '30-45 岁男 · 家庭主收入者 · 有房贷', benefit: '保障家庭未来 20-30 年开支', example: '30 岁男 · 300 万保额 30 年定期 · 年保费 ¥3,200' },
    { persona: '资产传承', icon: '🏛', scenario: '高净值客户 · 希望保留资产传给子女', benefit: '免税传承 + 杠杆放大', example: '50 岁富豪 · 1000 万保额终身寿 · 一次性保费 200 万' },
    { persona: '追求收益', icon: '📊', scenario: '想要保障 + 投资收益', benefit: '投连险灵活配置', example: '40 岁客户 · 投连险保障 + 50% 配股票基金' },
  ],
  process: [
    { step: '01', actor: '客户', title: '需求分析', desc: '客户经理评估家庭状况' },
    { step: '02', actor: '客户', title: '产品推荐', desc: '匹配定期 / 终身 / 投连' },
    { step: '03', actor: '客户', title: '健康告知', desc: '在线问卷 + 必要时体检' },
    { step: '04', actor: '保险公司', title: '承保', desc: '审核通过签发保单' },
  ],
  caseStudy: {
    company: '李先生 (家庭支柱)', logo: '👨‍💼', industry: '35 岁 · 上海 · 有房贷 ¥350 万 · 妻子 + 5 岁孩子',
    challenge: '李先生是家庭唯一主收入者，年薪 ¥80 万。担心万一发生意外，妻子和孩子无法承担房贷 + 生活费 + 教育金。',
    solution: 'BankerOS 推荐：定期寿险 ¥500 万 · 30 年 · 涵盖 30-65 岁经济责任期 · 年保费 ¥4,200 (年薪的 0.5%)。',
    results: [{ metric: '保额', value: '¥ 500 万' }, { metric: '年保费', value: '¥ 4,200' }, { metric: '保费/年收入', value: '0.5%' }, { metric: '覆盖期限', value: '30 年' }],
    quote: '每年花 ¥4,200 给家人 ¥500 万的保障，这是性价比最高的爱。希望永远用不上，但有了就睡得踏实。',
    quoteAuthor: '李先生 · 定期寿险客户',
  },
  faq: [
    { q: '定期寿险 vs 终身寿险？', a: '定期：保费低 · 保障期限内身故才赔 · 适合家庭主收入者保家。终身：终身保障 · 必然赔付 · 适合资产传承和富裕家庭。建议先买定期保家，富裕后再买终身传承。' },
    { q: '健康告知重要吗？', a: '至关重要。隐瞒病史可能导致保险公司拒赔。BankerOS 提供"健康告知辅导"服务，帮客户准确告知。' },
    { q: '保险公司倒闭怎么办？', a: '保险公司由银保监会监管，受《保险法》保护。即使破产，保单由其他保险公司接管，权益不变。' },
  ],
  ctaTitle: '为家人撑起保护伞', ctaDesc: '专业测算 · 量身定制 · 多家保险公司比价',
  ctaButton: { label: '人寿保险测算', to: '/login' },
};

// ─── 健康医疗保险 ────────────────────────────────────────────
const healthInsuranceCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '保险', to: '/products/insurance/health' }, { label: '健康医疗保险' }],
  category: 'Health Insurance', productName: '健康医疗保险',
  tagline: '重疾险 · 百万医疗 · 高端医疗 · 全方位健康保障',
  badge: '重疾 + 医疗双保障',
  bullets: ['重疾险 50-100 种', '百万医疗 ¥600/年起', '高端医疗 (国际部)', '海外就医保障', '在线问诊免费', '与三甲医院合作'],
  background: 'navy',
  ctaPrimary: { label: '健康保险测算', to: '/login' },
  overview: {
    description: 'BankerOS 健康医疗保险包括 3 大类：\n\n① 重疾险 — 确诊重大疾病 (50-100 种) 一次性给付现金 (50-100 万)，用于治疗 + 收入补偿；\n\n② 百万医疗 — 报销医保外的住院费用 (¥1 万免赔 + 100% 报销 · 上限 ¥300 万)，价格低 (¥600/年起)；\n\n③ 高端医疗 — VIP 国际部 / 私立医院 / 海外就医 (无免赔 · 报销 ¥1,000 万+)。',
    benchmark: '对标 平安保险百万医疗 · 太平洋蓝医保 · 友邦愈从容',
    params: [['重疾险保额', '¥ 50 - 100 万'], ['百万医疗保额', '¥ 300 万'], ['高端医疗保额', '¥ 1,000 万'], ['免赔额', '¥ 1 万 (百万) / 0 (高端)'], ['续保年龄', '0-65 岁'], ['等待期', '90 天']],
  },
  features: [
    { icon: '🏥', title: '重疾险 100 种', desc: '覆盖癌症/心梗/脑卒中/器官移植等 100 种重疾 · 一次性赔付' },
    { icon: '💊', title: '百万医疗', desc: '¥600/年起 · 报销住院/手术/药费 · 上限 ¥300 万' },
    { icon: '🏨', title: '高端医疗', desc: '协和/华西国际部 + 私立医院 + 海外就医' },
    { icon: '👨‍⚕️', title: '在线问诊免费', desc: '7×24 三甲医院专家在线问诊 · 处方药配送' },
  ],
  useCases: [
    { persona: '中产家庭', icon: '👨‍👩‍👧', scenario: '担心重疾医疗费 · 期望全家保障', benefit: '百万医疗 ¥600/年/人 全家保', example: '某 4 口之家 · 4 份百万医疗 · 年保费 ¥2,400' },
    { persona: '高净值', icon: '💎', scenario: '希望最高规格医疗 · 不愿排队', benefit: '高端医疗 · 协和国际部 · 私立医院', example: 'Jade 客户 · 高端医疗 ¥1,000 万 · 年保费 ¥4 万' },
    { persona: '父母', icon: '👴', scenario: '60+ 岁父母 · 医保不够用', benefit: '专属老年人医疗险', example: '父母 65 岁 · 老年百万医疗 · 年保费 ¥3,600' },
  ],
  process: [
    { step: '01', actor: '客户', title: '健康问卷', desc: '在线 5 分钟告知病史' },
    { step: '02', actor: '保险', title: '核保', desc: '智能核保 70% 客户可直接通过' },
    { step: '03', actor: '客户', title: '签约缴费', desc: '电子保单立即生效' },
    { step: '04', actor: '客户', title: '90 天等待', desc: '等待期后正式生效' },
  ],
  caseStudy: {
    company: '王女士 (公司中层)', logo: '🏥', industry: '38 岁 · 北京 · 已婚 + 8 岁女',
    challenge: '丈夫去年突发心梗住院，医保外费用 ¥18 万家庭压力大。后悔没早买重疾险，现在希望全家都买全。',
    solution: 'BankerOS 全家保障方案：① 王女士本人重疾 ¥80 万 + 百万医疗；② 丈夫续保百万医疗 (重疾因病史拒)；③ 8 岁女儿少儿重疾 ¥50 万；④ 父母老年百万医疗。年总保费 ¥1.2 万。',
    results: [{ metric: '全家保额', value: '¥ 230 万' }, { metric: '年保费', value: '¥ 1.2 万' }, { metric: '保费/收入', value: '< 2%' }, { metric: '心理安心', value: '✓' }],
    quote: '保险这种事真的不要等到出事才想起。我们家因为丈夫的经历才警醒，现在全家保障到位睡得安稳。',
    quoteAuthor: '王女士 · 全家保险客户',
  },
  faq: [
    { q: '重疾险等待期是什么？', a: '保单生效后前 90 天为等待期。期内确诊重疾不赔且退保费。等待期后正式生效。' },
    { q: '已有病史能买吗？', a: '健康问卷如实告知后，保险公司会决定：标准承保 / 加费 / 责任除外 / 拒保。BankerOS 与多家保险公司合作，能找到合适方案。' },
    { q: '可以买多家公司的保险吗？', a: '可以。多家重疾险可叠加赔付 (3 家 × 100 万 = 300 万一次性赔)。但医疗险只能报销一次实际损失。' },
  ],
  ctaTitle: '健康保障 · 全家安心', ctaDesc: '专业测算 · 多公司比价 · 在线投保',
  ctaButton: { label: '健康保险测算', to: '/login' },
};

// ─── 旅行保险 ────────────────────────────────────────────
const travelInsuranceCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '保险', to: '/products/insurance/travel' }, { label: '旅行保险' }],
  category: 'Travel Insurance', productName: '旅行保险',
  tagline: '境外医疗 / 行李延误 / 紧急救援 · 单次旅行 ¥30 起 · 年保 ¥600 起',
  badge: '出境旅行必备',
  bullets: ['境外医疗 $200K-$1M', '行李延误赔付', '航班延误险', '24/7 紧急救援', '国际 SOS 合作', '单次 / 年度可选'],
  background: 'navy',
  ctaPrimary: { label: '购买旅行险', to: '/login' },
  overview: {
    description: '旅行保险为境内 / 境外旅游提供综合保障。\n\n核心保障：① 境外医疗 (突发疾病/意外伤害) ¥200K-¥1M；② 紧急救援 (国际 SOS 24/7)；③ 行李延误/丢失赔偿；④ 航班延误险；⑤ 旅行取消险。\n\n两种购买方式：单次旅行 (¥30-200/次) · 年度全年 (¥600-3000/年 · 不限次数)。',
    benchmark: '对标 安联旅行险 · 美亚保险 · 友邦旅行卫士',
    params: [['境外医疗', '$ 200K - $ 1M'], ['紧急救援', '24/7 全球'], ['行李延误', '¥ 500-2000'], ['航班延误', '¥ 500-3000'], ['旅行取消', '¥ 10K-50K'], ['年度版价格', '¥ 600-3000']],
  },
  features: [
    { icon: '🏥', title: '$200K-$1M 境外医疗', desc: '突发疾病/意外伤害 · 全球任意医院垫付' },
    { icon: '🆘', title: '24/7 紧急救援', desc: '与 International SOS 合作 · 直升机救援 · 医疗转运' },
    { icon: '🎒', title: '行李丢失赔偿', desc: '行李延误 6h+ ¥500 · 丢失最高 ¥2,000' },
    { icon: '✈️', title: '航班延误险', desc: '延误 3h+ ¥500 · 6h+ ¥1,500 · 自动赔付' },
    { icon: '📅', title: '旅行取消险', desc: '不可抗力取消行程 · 退还酒店/机票费用' },
  ],
  useCases: [
    { persona: '欧美深度游', icon: '🌍', scenario: '欧洲 / 美国 15-30 天深度游', benefit: '高额医疗 + SOS · 安心畅游', example: '欧洲蜜月 15 天 · $500K 医疗 · 保费 ¥250' },
    { persona: '亲子家庭', icon: '👨‍👩‍👧', scenario: '带子女出境 · 担心孩子健康', benefit: '全家保障 · 包孕妇/儿童', example: '4 口家庭日本 7 天 · 保费 ¥420' },
    { persona: '商务出差客户', icon: '💼', scenario: '每月出境 2-3 次', benefit: '年度保 · 不限次数 · 性价比高', example: '某高管年度保 ¥2,000 · 年出境 24 次' },
  ],
  process: [
    { step: '01', actor: '客户', title: '在线选择', desc: '目的地 + 出行日期' },
    { step: '02', actor: '系统', title: '智能推荐', desc: '匹配保额 + 价格' },
    { step: '03', actor: '客户', title: '支付', desc: '微信/支付宝 · 即时生效' },
    { step: '04', actor: '客户', title: '电子保单', desc: '邮件 + App 保存' },
  ],
  caseStudy: {
    company: '王先生 (家庭欧洲游)', logo: '✈️', industry: '40 岁 · 上海 · 全家瑞士 12 天游',
    challenge: '王先生一家 4 口 (含 8 岁子女 + 70 岁母亲) 去瑞士滑雪。担心：① 高龄母亲突发心脏问题；② 子女滑雪受伤；③ 瑞士医疗费用极高。',
    solution: '购买 BankerOS 高端旅行险：4 人 12 天 · $500K 境外医疗 · 24/7 SOS · 滑雪 + 老年人专项 · 总保费 ¥980。',
    results: [{ metric: '保额', value: '$ 500K' }, { metric: '保费/天/人', value: '¥ 20' }, { metric: 'SOS 覆盖', value: '24/7' }, { metric: '滑雪意外', value: '✓ 覆盖' }],
    quote: '在欧洲住一晚医院都要好几千美元。¥1,000 块换全家 $500K 保障，太值了。',
    quoteAuthor: '王先生 · 旅行险客户',
  },
  faq: [
    { q: '已患疾病能赔吗？', a: '已存在的慢性病 (高血压/糖尿病) 不赔。但突发病情 (心梗/中风) 不论是否有基础病史均赔。' },
    { q: '极限运动覆盖吗？', a: '基础版不包含极限运动 (跳伞/潜水/登山)。可加购"运动专项险"覆盖。滑雪一般在基础版内。' },
    { q: '如何理赔？', a: '海外就医保留所有票据。回国后 30 天内 App 内提交照片，3-5 工作日审核完成赔付。' },
  ],
  ctaTitle: '出境无忧 · 全程守护', ctaDesc: '单次 ¥30 起 · 年度 ¥600 起',
  ctaButton: { label: '购买旅行险', to: '/login' },
};

export const AccountAllInOne     = () => <ProductDetailLite {...allInOneCfg} />;
export const SavingsCertificate  = () => <ProductDetailLite {...certificateDepositCfg} />;
export const SavingsStructured   = () => <ProductDetailLite {...structuredDepositCfg} />;
export const FxExchangeDetail    = () => <ProductDetailLite {...fxExchangeCfg} />;
export const PreciousMetalsDetail = () => <ProductDetailLite {...preciousMetalsCfg} />;
export const InsuranceLife       = () => <ProductDetailLite {...lifeInsuranceCfg} />;
export const InsuranceHealth     = () => <ProductDetailLite {...healthInsuranceCfg} />;
export const InsuranceTravel     = () => <ProductDetailLite {...travelInsuranceCfg} />;
