/**
 * 7 loan detail pages
 * Mortgage: Second-home / Overseas
 * Personal: Flash / Education / Medical / Renovation / Auto
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

// ─── 二套房按揭 ────────────────────────────────────────────
const secondHomeCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '二套房按揭' }],
  category: 'Second-Home Mortgage', productName: '二套房按揭贷款',
  tagline: '改善型购房专属 · LPR+60bp · 首付 40% · 30 年期 · 与现有按揭联动管理',
  badge: '改善型置业 · 现有客户优享',
  bullets: ['利率 LPR + 60bp = 4.95%', '首付低至 40%', '贷款期限最长 30 年', '可与首套房联动管理', '支持改善型置换', '审批通道与首套同步'],
  background: 'navy',
  ctaPrimary: { label: '在线预审', to: '/login' },
  overview: {
    description: '二套房按揭贷款是为已有住房按揭记录的家庭再次购房提供的个人住房贷款。\n\n根据中国人民银行规定，二套房贷款采用差别化政策：首付比例不低于 40%，利率不低于 LPR + 60bp。这是为防止投机性购房，引导住房合理消费。\n\nBankerOS 二套房贷款支持"改善型置换"（先卖后买可享受首套优惠）。',
    benchmark: '对标 HSBC Second Home Mortgage · 招行二手房按揭',
    params: [['利率', 'LPR + 60bp = 4.95%'], ['首付比例', '最低 40%'], ['最长期限', '30 年'], ['LTV', '最高 60%'], ['最低贷款额', '¥ 200,000'], ['最高贷款额', '¥ 15,000,000']],
  },
  features: [
    { icon: '🔄', title: '改善型置换', desc: '先卖原房后买新房，可重新享首套优惠 (利率低 90 bp)' },
    { icon: '🏘', title: '与首套联动', desc: '与原有按揭协同管理 · 一个 App 看所有房贷' },
    { icon: '💰', title: '可申请抵押再融资', desc: '原有住房剩余价值可作为新按揭加按使用' },
    { icon: '⚡', title: '审批同步快', desc: '现有按揭客户走快速通道 · 3 工作日审批' },
  ],
  useCases: [
    { persona: '改善型家庭', icon: '👨‍👩‍👧', scenario: '原有 60-80㎡ 小房 · 希望换 100-130㎡ 改善户型', benefit: '先卖后买可享首套利率优惠', example: '上海家庭卖原房 ¥600 万 · 购置 ¥1,200 万改善房' },
    { persona: '学区房需求', icon: '🎓', scenario: '原有住房不在好学区 · 为子女教育换房', benefit: '快速审批 · 与现有按揭联动', example: '海淀家庭购置黄庄学区房 ¥1,800 万' },
    { persona: '养老置业', icon: '🏖', scenario: '退休后购置养老房 · 三亚/海南/云南', benefit: '60% LTV · 长期还款', example: '某退休教师购置三亚海景房 ¥500 万' },
  ],
  process: [
    { step: '01', actor: '客户', title: '在线预审', desc: '5 分钟出预审额度' },
    { step: '02', actor: '客户', title: '签购房合同', desc: '签订《房屋买卖合同》' },
    { step: '03', actor: '银行', title: '审批', desc: '3-7 工作日 (现有客户快速通道)' },
    { step: '04', actor: '银行', title: '放款', desc: '抵押登记后 3 天放款' },
  ],
  caseStudy: {
    company: '陈女士 (银行中层管理)', logo: '🏘', industry: '38 岁 · 上海 · 改善型置换',
    challenge: '陈女士原有浦东 75㎡ 房产 (按揭尚余 ¥80 万)，希望换浦东 130㎡ 三房改善居住。新房总价 ¥1,800 万，原房可卖 ¥900 万。',
    solution: 'BankerOS 改善方案：① 卖出原房 ¥900 万 (还清按揭 ¥80 万，剩 ¥820 万)；② 新房付款：首付 ¥900 万 + 二套按揭 ¥900 万 (50% LTV)；③ 利率 LPR+60bp，30 年期。',
    results: [{ metric: '月供', value: '¥ 47,800' }, { metric: '首付', value: '¥ 900 万' }, { metric: '审批用时', value: '3 天' }, { metric: '改善居住', value: '+ 55㎡' }],
    quote: 'BankerOS 把原有按揭和新按揭打通管理，再也不用同时处理两家银行。改善置换流程也比预想简单。',
    quoteAuthor: '陈女士 · 二套房按揭客户',
  },
  faq: [
    { q: '认贷不认房 vs 认房又认贷的区别？', a: '一线城市多采"认贷又认房"严格政策。家庭名下有 1 套住房或全国曾贷款均算二套。' },
    { q: '能改回首套利率吗？', a: '可。卖出原房并结清原按揭后，再购房视同首套，可享 LPR-30bp 优惠利率。' },
    { q: '二套首付能否用公积金？', a: '可以，但公积金二套首付比例同样 40% 起。组合贷可降低商贷比例。' },
  ],
  ctaTitle: '改善置业从这里开始', ctaDesc: '在线预审 · 现有客户快速通道',
  ctaButton: { label: '立即预审', to: '/login' },
};

// ─── 海外房产按揭 ────────────────────────────────────────────
const overseasMortgageCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '海外房产按揭' }],
  category: 'Overseas Property Mortgage', productName: '海外房产按揭',
  tagline: '英美澳新港澳房产 · 多币种贷款 · 海外律师协助 · 当地税务规划',
  badge: 'Premier 客户专享',
  bullets: ['覆盖 12 国主要城市', '多币种 (USD/GBP/AUD/HKD)', '海外律师协助交易', '当地税务规划', '与海外保险联动', '美元资产配置组合'],
  background: 'gradient',
  ctaPrimary: { label: '咨询海外按揭', to: '/help' },
  overview: {
    description: '海外房产按揭是 BankerOS 为高净值客户购买海外房产 (自住/投资/留学) 提供的多币种住房贷款服务。\n\n覆盖国家：美国/加拿大/英国/澳大利亚/新西兰/香港/澳门/新加坡/日本/葡萄牙等 12 国主要城市。\n\n配套服务：当地律师推荐 + 税务规划 + 海外保险 + 资产管理一站式。',
    benchmark: '对标 HSBC Expat Mortgage · Citi Global Mortgage',
    params: [['利率', '4.5% - 5.5%'], ['首付比例', '最低 40%'], ['最长期限', '25 年'], ['LTV', '最高 60%'], ['最低额度', '$ 200,000 USD'], ['最高额度', '$ 10,000,000 USD'], ['币种', 'USD/GBP/AUD/CAD/HKD/SGD']],
  },
  features: [
    { icon: '🌍', title: '12 国覆盖', desc: '美/加/英/澳/新/港/新加坡/日/葡 等主要发达国家' },
    { icon: '💱', title: '多币种贷款', desc: '可选 USD/GBP/AUD/HKD/SGD 等贷款币种，避免汇率风险' },
    { icon: '⚖️', title: '当地律师协助', desc: '与当地知名律所合作 · 全程交易代理 · 减少法律风险' },
    { icon: '📊', title: '税务规划', desc: '与四大会计师事务所合作 · FATCA / CRS 合规规划' },
    { icon: '🛡', title: '配套保险', desc: '房产保险 + 寿险捆绑 · 海外资产保护' },
  ],
  useCases: [
    { persona: '留学家庭', icon: '🎓', scenario: '子女赴美 / 英 / 澳留学 · 购置学区房', benefit: '租金可抵学费 · 毕业后增值', example: '北京家庭为子女在 UCL 附近买 £1.5M 公寓' },
    { persona: '海外置业', icon: '🏖', scenario: '美元资产配置 · 海外度假 · 移民后用', benefit: '资产分散 · 抗汇率风险', example: '深圳企业主在洛杉矶购置 $3M 别墅' },
    { persona: '海外工作', icon: '✈️', scenario: '外派或长期海外工作 · 当地买房', benefit: '凭本国信用记录贷款 · 利率优惠', example: '某高管派驻新加坡 5 年，购置 SGD 5M 别墅' },
  ],
  process: [
    { step: '01', actor: '客户', title: '初步咨询', desc: '私人银行客户经理一对一沟通' },
    { step: '02', actor: '银行', title: '资格预审', desc: '海外资产合规 + 来源审查' },
    { step: '03', actor: '客户', title: '选房签约', desc: '当地律师协助 · BankerOS 推荐' },
    { step: '04', actor: '银行', title: '海外评估', desc: '联合当地评估机构估值' },
    { step: '05', actor: '银行', title: '审批放款', desc: '4-6 周完成 · 资金跨境结算' },
  ],
  caseStudy: {
    company: '陈先生 (跨境电商创始人)', logo: '🏠', industry: '45 岁 · 深圳 · Jade 钻石客户',
    challenge: '为子女在英国剑桥读书购置 £1.2M 学区公寓。担心：① 海外贷款流程复杂；② 律师/税务找谁；③ 跨境汇款合规。',
    solution: 'BankerOS Premier Global 服务：① 香港分行 60% LTV (£720K) · 25 年期 · 4.8% · GBP 贷款；② 推荐英国 Mills & Reeve 律所代理交易；③ 跨境资金通过 BankerOS 合规通道。',
    results: [{ metric: '贷款额', value: '£ 720,000' }, { metric: '月供', value: '£ 4,150' }, { metric: '租金回报', value: '£ 3,800/月' }, { metric: '净月支出', value: '£ 350' }],
    quote: '本以为海外买房手续繁杂得不行，BankerOS 全程协助让我 3 个月就完成了。儿子毕业后房子还可以继续出租。',
    quoteAuthor: '陈先生 · 海外房产按揭',
  },
  faq: [
    { q: '需要海外护照 / 身份吗？', a: '不需要。BankerOS 海外按揭支持中国大陆居民身份。但购置某些国家房产前需了解当地外国人购房限制 (如新西兰禁止外国人买二手住宅)。' },
    { q: '汇款合规吗？', a: '完全合规。BankerOS 通过 QDII / RQDII 通道为客户办理外汇购汇，符合国家外汇管理局额度规定 ($50K/人/年)，超出部分通过海外资产证明合规购汇。' },
    { q: '海外房子可以租给当地人吗？', a: '可以。BankerOS 与当地 Knight Frank / Savills 等顶级中介合作，提供房产托管 + 出租代理服务。' },
  ],
  ctaTitle: '开启全球置业', ctaDesc: '私人银行客户经理 24h 内联系',
  ctaButton: { label: '预约咨询', to: '/help' },
};

// ─── 闪贷 ────────────────────────────────────────────
const flashLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '闪贷' }],
  category: 'Flash Loan', productName: '闪贷',
  tagline: '极速放款 · 8 分钟到账 · 无需抵押 · 最高 30 万 · 24/7 在线申请',
  badge: '8 分钟放款 · 应急首选',
  bullets: ['最快 8 分钟放款', '无需抵押无需担保', '最高 30 万额度', '随借随还按日计息', '利率 7.20% 起', '24/7 在线申请'],
  background: 'red',
  ctaPrimary: { label: '立即申请', to: '/login' },
  overview: {
    description: '闪贷是 BankerOS 为应急现金需求设计的极速无抵押信用贷款。\n\n基于 AI 自动审批 + 与征信中心 / 社保 / 公积金直连，全程线上无需人工干预。\n\n核心场景：突发开支 · 临时周转 · 信用卡逾期补救 · 应急消费。',
    benchmark: '对标 招行闪电贷 · 微众银行微粒贷 · 中信信秒贷',
    params: [['年利率', '7.20% - 14.40%'], ['额度范围', '¥ 5,000 - ¥ 300,000'], ['期限', '6-36 个月'], ['放款时长', '最快 8 分钟'], ['还款方式', '等额本息 / 先息后本'], ['提前还款', '免违约金']],
  },
  features: [
    { icon: '⚡', title: '8 分钟放款', desc: 'AI 自动审批 · 无需人工 · 平均 5-8 分钟到账' },
    { icon: '📱', title: '全程线上', desc: 'App 一键申请 · 无需到访分行 · 7×24 可申请' },
    { icon: '🔓', title: '无抵押', desc: '凭征信 + 收入即可申请 · 无需房产/车辆/担保人' },
    { icon: '💸', title: '随借随还', desc: '按日计息 · 用 1 天计 1 天利息 · 提前还款免违约金' },
  ],
  useCases: [
    { persona: '突发开支', icon: '🚨', scenario: '家人突然生病 / 车辆事故 / 房屋维修', benefit: '应急资金 8 分钟到账', example: '父亲突发心脏病急需手术费 ¥15 万' },
    { persona: '资金周转', icon: '💰', scenario: '工资还未到账 · 信用卡到期', benefit: '短期周转避免逾期', example: '月初信用卡 ¥3 万 · 工资 10 号到账 · 临时借 10 天' },
    { persona: '小额消费', icon: '🛍', scenario: '旅游 / 数码产品 / 装修开支', benefit: '分期支付不影响现金流', example: '日本旅游 ¥3 万 · 分 12 期还' },
  ],
  process: [
    { step: '01', actor: '客户', title: 'App 申请', desc: '输入金额 + 期限 · 30 秒' },
    { step: '02', actor: 'AI', title: '自动审批', desc: '查征信/社保/公积金 · 1 分钟' },
    { step: '03', actor: 'AI', title: '授信', desc: '5 分钟内出额度 · 自动放款' },
    { step: '04', actor: '客户', title: '资金到账', desc: '8 分钟内入卡 · 立即可用' },
  ],
  caseStudy: {
    company: '小王 (互联网产品经理)', logo: '⚡', industry: '32 岁 · 上海 · 月薪 ¥28K',
    challenge: '突发车祸需要修车 ¥48,000，月薪还没发 (5 号发)，信用卡空白额度不够。',
    solution: '晚 21:30 在 BankerOS App 申请闪贷 ¥50,000 · 12 期 · 5 分钟批准 · 21:45 到账。',
    results: [{ metric: '申请到放款', value: '8 分钟' }, { metric: '月供', value: '¥ 4,533' }, { metric: '总利息', value: '¥ 4,400' }, { metric: '提前还款', value: '免违约金' }],
    quote: '半夜 9 点钟可以申请到款，而且 8 分钟就到了 — 真的是救命。第二个月发工资就提前还了一半，免违约金太人性化。',
    quoteAuthor: '小王 · 闪贷客户',
  },
  fees: [
    { item: '基础利率', amount: '7.20%/年起', note: '优质客户专享' },
    { item: '审批费', amount: '免', note: '' },
    { item: '提前还款违约金', amount: '免', note: '' },
    { item: '逾期罚息', amount: '利率 × 1.5', note: '逾期 30 天起' },
  ],
  faq: [
    { q: '哪些人能申请？', a: '22-55 岁 · 中国大陆居民 · 在职满 6 个月 · 月收入 ¥5K+ · 征信无 M3 以上逾期。' },
    { q: '为什么 8 分钟就能放款？', a: 'BankerOS AI 系统与人行征信、社保、公积金、税务、医保等 20+ 数据源直连，自动评估资质 · 无需人工审核。' },
    { q: '能借多少？', a: '初次申请 ¥5K - 30K · 良好还款 6 个月后可提至 ¥30K - 30 万。' },
  ],
  ctaTitle: '应急资金 8 分钟搞定', ctaDesc: '无抵押 · 24/7 申请 · 利率 7.20% 起',
  ctaButton: { label: '立即申请', to: '/login' },
};

// ─── 教育贷 ────────────────────────────────────────────
const educationLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '教育贷' }],
  category: 'Education Loan', productName: '教育贷',
  tagline: '在职进修 / MBA / 海外留学 · 最高 50 万 · 期限最长 8 年 · 利率 5.50% 起',
  badge: '终身学习 · 投资未来',
  bullets: ['MBA / EMBA / 海外留学', '最高 50 万额度', '期限 1-8 年', '可申请学习期间只还息', '利率 5.50% 起 (低于普通消费贷)', '与学校直接结算'],
  background: 'navy',
  ctaPrimary: { label: '申请教育贷', to: '/login' },
  overview: {
    description: '教育贷是 BankerOS 专为成人教育/继续学习设计的优惠贷款。\n\n覆盖：MBA/EMBA/EdEx 在职教育 · 海外留学 · 职业资格培训 (CFA/CPA/PMP) · 在校生 (含父母申请)。\n\n核心优势：利率低于普通消费贷 1-2 个百分点 + 学习期间只还息。',
    benchmark: '对标 招行教育贷 · 工行学子贷 · 中行留学贷',
    params: [['利率', '5.50% - 7.20%'], ['额度', '¥ 50,000 - ¥ 500,000'], ['期限', '1-8 年'], ['宽限期', '学习期间只还息'], ['担保', '无需抵押'], ['放款方式', '与学校直接结算']],
  },
  features: [
    { icon: '🎓', title: 'MBA/EMBA', desc: '清华/北大/复旦/CEIBS 等 50+ 顶级商学院合作' },
    { icon: '✈️', title: '海外留学', desc: '美/英/澳/加/欧/亚 全球 200+ 名校学费支付' },
    { icon: '📜', title: '职业资格', desc: 'CFA/CPA/PMP/雅思托福 等培训费支持' },
    { icon: '⏰', title: '宽限期', desc: '学习期间 (最长 4 年) 仅还利息，毕业后还本金' },
    { icon: '🏫', title: '直付学校', desc: '资金直接付至学校账户，避免挪用' },
  ],
  useCases: [
    { persona: '在职 MBA', icon: '💼', scenario: '工作 5-10 年 · 想攻读 MBA 提升职业', benefit: '工作 + 学习两不误 · 学费分期付', example: '某经理读复旦 EMBA ¥68 万 · 8 年期月供 ¥9,000' },
    { persona: '海外留学', icon: '🎓', scenario: '攻读海外硕士/博士', benefit: '学费一次付清 · 学期间只还息', example: '英国剑桥硕士 £35K · 学期间月供仅 £150' },
    { persona: '职业资格', icon: '📊', scenario: 'CFA Level 3 / CPA 培训 · 雅思冲刺', benefit: '短期培训分期支付', example: 'CFA 三级培训 ¥3 万 · 24 期月供 ¥1,500' },
  ],
  process: [
    { step: '01', actor: '客户', title: '提交申请', desc: '上传录取通知 + 学校名称' },
    { step: '02', actor: '银行', title: '资格审核', desc: '征信 + 收入 + 学校认证' },
    { step: '03', actor: '银行', title: '审批', desc: '3-7 工作日审批' },
    { step: '04', actor: '银行', title: '直付学校', desc: '资金直接结算至学校账户' },
  ],
  caseStudy: {
    company: '刘女士 (互联网产品经理)', logo: '🎓', industry: '32 岁 · 上海 · 攻读 CEIBS EMBA',
    challenge: '工作 8 年想转型升级，被 CEIBS EMBA 录取。学费 ¥68 万一次付清困难，希望分期但担心利率太高影响生活。',
    solution: 'BankerOS 教育贷 ¥68 万 · 8 年期 · 5.80% · EMBA 在读期间 (24 个月) 只还息 ¥3,290/月 · 毕业后月供 ¥9,500。',
    results: [{ metric: '在读期月供', value: '¥ 3,290' }, { metric: '毕业后月供', value: '¥ 9,500' }, { metric: '总利息', value: '¥ 14.6 万' }, { metric: '比信用贷省', value: '¥ 6 万' }],
    quote: '教育是最好的投资。EMBA 还没毕业，公司给我升了职薪资涨了 50%，回报远超贷款利息。',
    quoteAuthor: '刘女士 · 教育贷客户',
  },
  faq: [
    { q: '哪些学校可申请？', a: '国内 985/211 大学 + 商学院 (清北复交人/CEIBS/长江) + 海外 QS 前 500 大学 + 教育部认证海外高校 + BankerOS 合作培训机构。' },
    { q: '父母能为子女申请吗？', a: '可以。父母作为主借款人，子女作为受益人。资金直付学校。' },
    { q: '与国家助学贷款的区别？', a: '助学贷款 (国开行) 仅在校学生申请，利率低 (2.85%) 但额度小 (本科 1.6 万/年)。BankerOS 教育贷无身份限制，额度更大 (50 万)，适合 MBA / 海外留学。' },
  ],
  ctaTitle: '投资自己的未来', ctaDesc: '利率 5.50% 起 · 学习期间只还息',
  ctaButton: { label: '申请教育贷', to: '/login' },
};

// ─── 装修贷 ────────────────────────────────────────────
const renovationLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '装修贷' }],
  category: 'Renovation Loan', productName: '装修贷',
  tagline: '新房 / 二手房装修 · 最高 100 万 · 期限 1-5 年 · 利率 6.20% 起',
  badge: '新居梦想 · 现金贷不动用',
  bullets: ['最高 100 万额度', '期限 1-5 年', '利率 6.20% 起', '与装修公司直付', '可分阶段提款', '免抵押无需房产证'],
  background: 'navy',
  ctaPrimary: { label: '申请装修贷', to: '/login' },
  overview: {
    description: '装修贷是为家庭新房 / 二手房装修提供的专项消费贷款。\n\n相比信用卡分期 (利率 12-18%)，装修贷利率显著更低 (6.20% 起)；相比普通消费贷，装修贷额度更大且可与装修公司直付。\n\n核心场景：新房入住前的全装 · 二手房翻新 · 局部改造 · 智能家居升级。',
    benchmark: '对标 招行家装贷 · 工行家居贷 · 平安装修贷',
    params: [['利率', '6.20% - 9.50%'], ['额度', '¥ 30,000 - ¥ 1,000,000'], ['期限', '1-5 年'], ['担保', '无需抵押'], ['放款方式', '与装修公司直付 / 自主使用']],
  },
  features: [
    { icon: '🏠', title: '装修公司合作', desc: '500+ 知名装修公司 (东易日盛/业之峰/欧坊) 直付' },
    { icon: '📅', title: '分阶段提款', desc: '按装修进度分 3-5 期提款 · 减少财务成本' },
    { icon: '🪑', title: '家电家具', desc: '可同时支付装修 + 家电家具 (奥维勒/林氏木业)' },
    { icon: '🤖', title: '智能家居', desc: '与小米/华为/Apple Home 合作 · 0 利率分期升级' },
  ],
  useCases: [
    { persona: '新房入住', icon: '🆕', scenario: '收房后准备硬装 + 软装 · 整体预算 30-50 万', benefit: '一次性付清避免资金压力', example: '上海新房 95㎡ 装修 ¥35 万 · 月供 ¥6,600 × 5 年' },
    { persona: '二手房翻新', icon: '🔄', scenario: '老房改造 · 拆除重装 · 30-80 万', benefit: '与装修公司直付 · 资金安全', example: '北京二手房翻新 ¥45 万' },
  ],
  process: [
    { step: '01', actor: '客户', title: '在线申请', desc: '上传房产证 + 装修方案' },
    { step: '02', actor: '银行', title: '审批', desc: '3-7 工作日' },
    { step: '03', actor: '银行', title: '签约提款', desc: '分阶段放款给装修公司' },
  ],
  caseStudy: {
    company: '某新婚夫妇', logo: '💒', industry: '28 + 30 岁 · 杭州 · 新房入住',
    challenge: '夫妇俩新买婚房，需要装修 + 家具 + 家电共 ¥45 万。手头存款只剩 ¥10 万，不想动用。',
    solution: 'BankerOS 装修贷 ¥40 万 · 60 期 · 6.80% · 与东易日盛直付。',
    results: [{ metric: '装修预算', value: '¥ 40 万' }, { metric: '月供', value: '¥ 7,879' }, { metric: '总利息', value: '¥ 7.3 万' }, { metric: '保留存款', value: '¥ 10 万' }],
    quote: '装修贷利率比信用卡分期低一半还多，5 年期月供也能承受。装修款直接付给东易日盛，不用我们倒手，更安全。',
    quoteAuthor: '某新婚夫妇 · 装修贷客户',
  },
  faq: [
    { q: '没有房产证也能申请吗？', a: '可以。新房未办证可凭购房合同 + 完税证明申请。租房装修暂不支持。' },
    { q: '装修款一次给我还是直付公司？', a: '可选。① 直付装修公司更安全，避免资金被挪用；② 自主使用更灵活，但需保留发票备查。' },
    { q: '能买家具家电吗？', a: '可以。装修贷资金可用于：硬装 + 家具 + 家电 + 智能家居 + 软装 (窗帘/灯具/挂画)。仅不能用于股票/虚拟货币/赌博等用途。' },
  ],
  ctaTitle: '梦想新居 · 一次到位', ctaDesc: '与装修公司直付 · 资金安全',
  ctaButton: { label: '申请装修贷', to: '/login' },
};

// ─── 医疗贷 ────────────────────────────────────────────
const medicalLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '医疗贷' }],
  category: 'Medical Loan', productName: '医疗贷',
  tagline: '医美 / 重大手术 / 海外就医 · 最高 100 万 · 利率优惠 5.80% 起',
  badge: '医疗专属 · 优惠利率',
  bullets: ['最高 100 万额度', '期限最长 5 年', '利率 5.80% 起', '与三甲医院直付', '医美机构合作', '海外就医支持'],
  background: 'navy',
  ctaPrimary: { label: '申请医疗贷', to: '/login' },
  overview: {
    description: '医疗贷是为重大医疗开支提供的专项贷款。\n\n覆盖：① 三甲医院重大手术 (心脏/肿瘤/器官移植)；② 医美整形 (双眼皮/隆鼻/植发)；③ 牙科 (种植牙/正畸)；④ 海外就医 (赴美/日本治疗)；⑤ 辅助生殖 (试管婴儿)。\n\n核心优势：利率优惠 + 与医院直付 + 紧急情况快速审批。',
    benchmark: '对标 招行医美贷 · 平安 i 贷',
    params: [['利率', '5.80% - 12.00%'], ['额度', '¥ 5,000 - ¥ 1,000,000'], ['期限', '6-60 个月'], ['放款时长', '4 小时 (紧急通道)'], ['担保', '无需抵押']],
  },
  features: [
    { icon: '🏥', title: '三甲医院合作', desc: '协和/华西/瑞金/中山等 200+ 三甲医院直付' },
    { icon: '💆', title: '医美机构', desc: '美莱/伊美尔/华美等 1000+ 正规医美机构' },
    { icon: '🦷', title: '牙科口腔', desc: '种植牙 (¥1.5-5 万/颗) / 牙齿矫正 (¥3-10 万) 分期' },
    { icon: '✈️', title: '海外就医', desc: '日本质子治疗 / 美国梅奥诊所 / 德国海德堡' },
    { icon: '👶', title: '辅助生殖', desc: '试管婴儿 (¥5-30 万) 分期支付' },
  ],
  useCases: [
    { persona: '重大手术', icon: '🏥', scenario: '癌症 / 心脏 / 器官移植 · 医保不覆盖部分', benefit: '应急资金快速到位', example: '父亲突发心梗 · 心脏支架 ¥18 万自费部分' },
    { persona: '医美整形', icon: '💆', scenario: '双眼皮 / 隆鼻 / 抽脂 / 植发', benefit: '一次到位 · 分期支付', example: '植发 ¥6 万 · 24 期月供 ¥2,700' },
    { persona: '辅助生殖', icon: '👶', scenario: '试管婴儿 · 三代试管', benefit: '高额度支持多次尝试', example: '试管婴儿 3 个周期共 ¥18 万' },
  ],
  process: [
    { step: '01', actor: '客户', title: '紧急申请', desc: '医院出具治疗方案 + 费用预估' },
    { step: '02', actor: '银行', title: '快速审批', desc: '紧急情况 4 小时内完成审批' },
    { step: '03', actor: '银行', title: '直付医院', desc: '资金直接付至医院账户' },
  ],
  caseStudy: {
    company: '王先生 (公司高管)', logo: '🏥', industry: '52 岁 · 上海 · 父亲突发心梗',
    challenge: '王先生父亲突发心梗，需要安装 3 个心脏支架共 ¥18 万。其中医保报销后还需自费 ¥12 万，需要紧急筹款。',
    solution: 'BankerOS 医疗贷 ¥15 万 · 36 期 · 6.20% · 当晚 21 点申请，凌晨 1 点放款，凌晨 3 点医院完成支付，凌晨 5 点开始手术。',
    results: [{ metric: '申请到放款', value: '4 小时' }, { metric: '月供', value: '¥ 4,580' }, { metric: '总利息', value: '¥ 1.5 万' }, { metric: '父亲获救', value: '✓' }],
    quote: '医疗贷是真正救命的产品。子夜 1 点钟我都能拿到钱救父亲，BankerOS 这种服务让我感动。',
    quoteAuthor: '王先生 · 医疗贷客户',
  },
  faq: [
    { q: '医美贷款有什么限制？', a: '仅支持正规整形医院 (有医疗机构执业许可证)。BankerOS 严格审核合作机构资质，避免与黑医美机构合作。' },
    { q: '海外就医资金能否直接出境？', a: '可以，但需要符合外汇管理规定 ($50K/年配额)。超额部分需要医院开具治疗费用证明走特别通道。' },
    { q: '辅助生殖贷款会上传征信吗？', a: '会，但记为"普通消费贷款"，不会标注"辅助生殖"用途，保护隐私。' },
  ],
  ctaTitle: '健康有保障', ctaDesc: '紧急医疗 4 小时放款 · 与医院直付',
  ctaButton: { label: '申请医疗贷', to: '/login' },
};

// ─── 汽车贷款 ────────────────────────────────────────────
const autoLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '汽车贷款' }],
  category: 'Auto Loan', productName: '汽车贷款',
  tagline: '新车 / 二手车 / 新能源车 · 最长 60 期 · 4S 店合作 · 0 利率分期可选',
  badge: '4S 店合作 · 0 利率分期',
  bullets: ['新车 / 二手车 / 新能源车', '最高贷款 80% 车款', '最长 60 期', '利率 5.50% 起', '部分品牌 0 利率', '4S 店现场办理'],
  background: 'navy',
  ctaPrimary: { label: '申请车贷', to: '/login' },
  overview: {
    description: '汽车贷款是为购买乘用车 (新车 / 二手车 / 新能源车) 提供的专项消费贷款。\n\nBankerOS 与全国 500+ 大型 4S 店深度合作，提供"店内现场办理"服务 — 看中车后 30 分钟完成贷款审批，当天提车。\n\n特色：与特斯拉 / BYD / 蔚来 / 理想 / 小鹏 等新能源品牌深度合作，提供 0 利率分期方案。',
    benchmark: '对标 招行车主贷 · 平安车贷 · 上汽通用金融',
    params: [['利率', '5.50% - 8.50%'], ['首付比例', '20% (新车) / 30% (二手)'], ['期限', '12-60 个月'], ['最高贷款', '¥ 500 万'], ['放款方式', '直付 4S 店'], ['0 利率品牌', 'Tesla / BYD / NIO 等']],
  },
  features: [
    { icon: '🚗', title: '4S 店现场办理', desc: '500+ 合作 4S 店 · 30 分钟审批 · 当天提车' },
    { icon: '⚡', title: '新能源专项', desc: 'Tesla / BYD / NIO / 理想 / 小鹏 等品牌 0 利率分期' },
    { icon: '♻️', title: '二手车贷款', desc: '与瓜子/优信合作 · 二手车 30% 首付 · 36-48 期' },
    { icon: '🛡', title: '车贷保险', desc: '可同时购买车险 · 一次性付 + 分期还款' },
    { icon: '💳', title: '弹性还款', desc: '等额本息 / 等额本金 / 大额尾款 (减少前期月供)' },
  ],
  useCases: [
    { persona: '首次购车', icon: '🚙', scenario: '工作 1-3 年 · 月薪 ¥10-20K · 购 10-25 万家用车', benefit: '20% 首付 · 36-48 期适中月供', example: '某 IT 工程师购大众 SUV ¥20 万 · 首付 4 万 · 月供 ¥3,400' },
    { persona: '新能源车', icon: '⚡', scenario: '换电动车 · 关注续航和智能', benefit: '0 利率分期 · 24 期免息', example: 'Model Y ¥30 万 · 0 利率 24 期月供 ¥1.25 万' },
    { persona: '豪华车', icon: '🏎', scenario: '事业有成 · 升级 BBA / 保时捷', benefit: '高额度 + 大额尾款方案', example: '保时捷 Macan ¥85 万 · 60% 尾款 · 月供 ¥6,000' },
  ],
  process: [
    { step: '01', actor: '客户', title: '4S 店选车', desc: '现场咨询车贷顾问' },
    { step: '02', actor: '银行', title: '现场审批', desc: '30 分钟批准' },
    { step: '03', actor: '银行', title: '直付 4S', desc: '当天放款给 4S' },
    { step: '04', actor: '客户', title: '提车', desc: '当天提车开走' },
  ],
  caseStudy: {
    company: '小李 (互联网产品经理)', logo: '🚗', industry: '30 岁 · 杭州 · 购特斯拉 Model 3',
    challenge: '想买 Model 3 ¥27 万，但不想一次性付清 — 希望保留现金流投资。',
    solution: 'BankerOS + 特斯拉合作：20% 首付 ¥5.4 万 · 80% 贷款 ¥21.6 万 · 24 期 0 利率 · 月供 ¥9,000。',
    results: [{ metric: '0 利率分期', value: '24 期' }, { metric: '月供', value: '¥ 9,000' }, { metric: '总利息', value: '¥ 0' }, { metric: '保留投资本金', value: '¥ 20 万' }],
    quote: '0 利率分期相当于白用银行钱。保留的 20 万投资稳健理财年化 8%，2 年净赚 ¥3.2 万 — 等于车价打了 88 折。',
    quoteAuthor: '小李 · 车贷客户',
  },
  faq: [
    { q: '为什么有的品牌 0 利率？', a: '车厂为促销给予客户的补贴。BankerOS 联合车厂推出 0 利率分期，相当于车厂帮客户支付银行利息。每月名额有限。' },
    { q: '二手车贷款贷多少？', a: '二手车首付 30% (低于新车 20%)，因二手车估值波动大风险高。3 年内车龄 + 行驶 < 5 万公里可贷 70%。' },
    { q: '提前还款有违约金吗？', a: '12 个月内提前还款收 1% 违约金。12 个月后免费提前还款。' },
  ],
  ctaTitle: '开走理想座驾', ctaDesc: '0 利率分期 · 4S 店现场办理',
  ctaButton: { label: '申请车贷', to: '/login' },
};

// ─── 婚庆贷 ────────────────────────────────────────────
const weddingLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '婚庆贷' }],
  category: 'Wedding Loan', productName: '婚庆贷',
  tagline: '婚礼策划 · 蜜月旅行 · 婚纱钻戒一站式 · 最高 50 万 · 利率 6.50% 起',
  badge: '人生大事 · 优惠利率',
  bullets: ['最高 50 万额度', '期限 1-3 年', '利率 6.50% 起 (低于普通消费贷)', '与 200+ 婚庆机构合作', '婚纱钻戒可分期', '蜜月旅行专项'],
  background: 'red',
  ctaPrimary: { label: '申请婚庆贷', to: '/login' },
  overview: {
    description: '婚庆贷是 BankerOS 为新人结婚筹备提供的优惠消费贷款。\n\n覆盖：① 婚礼策划 (酒店 / 婚庆公司 / 摄影摄像);② 婚纱钻戒 (婚纱礼服 / 钻戒珠宝);③ 蜜月旅行 (国内/海外 / 邮轮);④ 婚房软装 (家电 / 家具)。\n\n核心优势：利率优惠 (比普通消费贷低 1-2 个百分点) + 与婚庆机构合作直付 + 蜜月旅行专属保险。',
    benchmark: '对标 招行甜蜜贷 · 工行婚庆贷',
    params: [['利率', '6.50% - 9.50%'], ['额度', '¥ 10,000 - ¥ 500,000'], ['期限', '1-3 年'], ['担保', '无需抵押'], ['情侣联合申请', '可 (合并收入审批)'], ['放款时长', '3-5 个工作日']],
  },
  features: [
    { icon: '💒', title: '婚庆机构直付', desc: '与 200+ 婚庆公司 / 酒店合作 · 资金直接付商家' },
    { icon: '💍', title: '钻戒婚纱分期', desc: '周大福 / Tiffany / Vera Wang 等品牌 0 利率分期' },
    { icon: '✈️', title: '蜜月旅行', desc: '配套蜜月保险 · 海外婚礼安全保障' },
    { icon: '👫', title: '情侣联合申请', desc: '夫妻合并收入审批 · 提升额度' },
    { icon: '🎁', title: '婚庆礼包', desc: '审批通过赠送婚庆筹备指南 + 商家折扣券' },
  ],
  useCases: [
    { persona: '都市新人', icon: '💑', scenario: '一线城市婚礼 · 预算 30-50 万', benefit: '一次到位 · 分期还款不影响新生活', example: '上海婚礼 ¥40 万 · 3 年期月供 ¥12,200' },
    { persona: '海外婚礼', icon: '🏝', scenario: '巴厘岛 / 马尔代夫 / 日本 海外婚礼', benefit: '蜜月+婚礼一站规划', example: '巴厘岛婚礼 + 蜜月 ¥25 万 · 24 期月供 ¥11,800' },
    { persona: '情侣联合', icon: '👫', scenario: '双职工共同筹备婚礼', benefit: '合并收入额度更高', example: '夫妻合并收入 ¥4 万/月 · 可贷 ¥40 万' },
  ],
  process: [
    { step: '01', actor: '客户', title: '提交申请', desc: '夫妻双方资料 · 婚礼预算' },
    { step: '02', actor: '银行', title: '审批', desc: '3-5 工作日' },
    { step: '03', actor: '银行', title: '直付商家', desc: '资金按进度直付婚庆公司' },
    { step: '04', actor: '客户', title: '按月还款', desc: '婚礼结束后开始月供' },
  ],
  caseStudy: {
    company: '小周夫妇 (互联网公司同事)', logo: '💑', industry: '28+30 岁 · 上海 · 计划婚礼 ¥35 万',
    challenge: '夫妇俩计划在上海办婚礼 ¥35 万 + 三亚蜜月 ¥5 万。手头存款 ¥20 万 (要保留作为婚房装修)，希望分期不动用存款。',
    solution: 'BankerOS 婚庆贷 ¥30 万 · 36 期 · 7.20% · 资金直付婚庆公司+酒店 · 蜜月旅行 ¥5 万一次性提取。',
    results: [{ metric: '月供', value: '¥ 9,310' }, { metric: '总利息', value: '¥ 3.5 万' }, { metric: '保留存款', value: '¥ 20 万' }, { metric: '婚礼完美', value: '✓' }],
    quote: '婚庆贷帮我们办了梦想中的婚礼，又不用动装修存款。3 年期月供两人分担也不重。',
    quoteAuthor: '小周夫妇 · 婚庆贷客户',
  },
  fees: [
    { item: '利率', amount: '6.50% - 9.50%', note: '根据资信等级' },
    { item: '提前还款', amount: '免', note: '无违约金' },
    { item: '账户管理', amount: '免', note: '' },
  ],
  faq: [
    { q: '能在婚礼前借款吗？', a: '可以。BankerOS 婚庆贷支持婚礼前 6 个月申请放款，提前锁定酒店和婚庆公司档期。' },
    { q: '情侣联合申请怎么操作？', a: '夫妻 (含订婚) 双方共同申请，合并收入提升额度上限至单人 1.8 倍。婚礼证明 (订婚照/酒店预订单) 增加通过率。' },
    { q: '同时贷婚庆+装修可以吗？', a: '可以。BankerOS 提供"新婚一站贷"组合 (婚庆 + 装修)，总额度可达 ¥100 万，利率统一优惠。' },
  ],
  ctaTitle: '人生大事 · 一步到位', ctaDesc: '6.50% 起 · 200+ 婚庆机构合作',
  ctaButton: { label: '申请婚庆贷', to: '/login' },
};

// ─── 经营贷 (个体工商户 / 小微企业主) ────────────────────────────────────────────
const businessOwnerLoanCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '经营贷' }],
  category: 'Business Owner Loan', productName: '经营贷',
  tagline: '小微企业主 / 个体工商户专属 · 最高 500 万 · 抵押 4.5% 起 · 信用 6.5% 起',
  badge: '小微企业主必备',
  bullets: ['最高 500 万额度', '抵押贷款 4.5% 起', '信用贷款 6.5% 起', '期限最长 10 年', '随借随还按日计息', '与营业执照绑定'],
  background: 'navy',
  ctaPrimary: { label: '申请经营贷', to: '/login' },
  overview: {
    description: '经营贷是为个体工商户、小微企业主、自由职业者提供的经营周转资金贷款。\n\n两种主要形式：① 抵押贷款 — 用住房 / 商铺 / 商业地产抵押，利率低 (4.5% 起) 额度高 (最高 500 万);② 信用贷款 — 无需抵押，凭企业流水审批，利率略高 (6.5% 起) 额度较小 (最高 200 万)。\n\n核心场景：原材料采购 · 设备升级 · 店铺装修 · 季节性周转 · 应付员工工资。',
    benchmark: '对标 招行小微企业贷 · 平安惠普 · 网商银行经营贷',
    params: [['抵押利率', '4.5% - 7.0%'], ['信用利率', '6.5% - 12.0%'], ['抵押额度', '¥ 50 万 - ¥ 500 万'], ['信用额度', '¥ 10 万 - ¥ 200 万'], ['期限', '1-10 年'], ['资质', '营业执照 + 1 年以上经营']],
  },
  features: [
    { icon: '🏠', title: '房产抵押', desc: '住宅 / 商铺 / 写字楼抵押 · 评估 70% LTV · 最长 10 年' },
    { icon: '💳', title: '纯信用贷', desc: '无需抵押 · 凭税单 / 流水 / POS 数据审批' },
    { icon: '🔄', title: '随借随还', desc: '按日计息 · 用一天计一天利息 · 提前还款免违约' },
    { icon: '📊', title: '与税务数据直连', desc: '电子税务局授权 · 真实纳税数据自动审批 · 3 工作日' },
    { icon: '🏪', title: 'POS 流水授信', desc: '与微信支付 / 支付宝 / 银联 POS 数据合作 · 月流水授信' },
  ],
  useCases: [
    { persona: '小微企业主', icon: '🏢', scenario: '年营收 100-500 万 · 流动资金需求', benefit: '抵押贷大额低息 · 长期使用', example: '某餐厅老板 ¥300 万抵押贷 · 5 年期 · 月供 ¥5.6 万' },
    { persona: '个体工商户', icon: '🏪', scenario: '夫妻店 / 加盟店 · 进货周转', benefit: 'POS 流水授信 · 1 天放款', example: '某便利店 · 月 POS 流水 ¥50 万 · 授信 ¥30 万' },
    { persona: '自由职业者', icon: '🎨', scenario: '设计师 / 顾问 / 主播 · 接项目', benefit: '信用贷 · 凭税单审批', example: '某主播月入 ¥10 万 · 信用贷 ¥50 万备用' },
    { persona: '小老板换设备', icon: '🏭', scenario: '工厂升级生产线 / 餐厅换厨房设备', benefit: '设备融资 · 设备款 70%', example: '某餐厅升级中央厨房 ¥80 万 · 5 年期' },
  ],
  process: [
    { step: '01', actor: '企业主', title: '提交申请', desc: '营业执照 + 税单 + 银行流水' },
    { step: '02', actor: '银行', title: '资信审核', desc: '电子税务局 + 征信 + POS 数据' },
    { step: '03', actor: '银行', title: '评估抵押物', desc: '房产评估 (如适用) · 3-5 工作日' },
    { step: '04', actor: '银行', title: '授信放款', desc: '审批通过 1-3 天放款' },
  ],
  caseStudy: {
    company: '某连锁餐饮老板 (3 家分店)', logo: '🍽', industry: '40 岁 · 上海 · 年营收 ¥800 万',
    challenge: '老板想再开 2 家新店 (上海 + 杭州)，每家投入 ¥150 万 (装修 + 设备 + 启动金)。共需 ¥300 万，但现有现金流不足。',
    solution: 'BankerOS 经营贷组合：① 老板自住房产抵押贷 ¥200 万 (LPR + 15bp = 4.5%) 5 年期；② 信用贷 ¥100 万 (7.5%) 3 年期 (作为补充)。',
    results: [{ metric: '总融资', value: '¥ 300 万' }, { metric: '加权利率', value: '5.5%' }, { metric: '月供', value: '¥ 6.8 万' }, { metric: '新店开业', value: '4 个月' }],
    quote: 'BankerOS 的经营贷让我从 3 家店扩张到 5 家。审批速度比想象快很多，电子税务直连真的方便。',
    quoteAuthor: '某连锁餐饮老板 · 经营贷客户',
  },
  fees: [
    { item: '抵押贷利率', amount: '4.5% 起', note: 'LPR + 15bp 起' },
    { item: '信用贷利率', amount: '6.5% 起', note: '根据资信差异化' },
    { item: '抵押评估费', amount: '¥ 800-3,000', note: '由独立机构收取' },
    { item: '提前还款', amount: '免', note: '1 年内提前 1% 违约金' },
    { item: '账户管理费', amount: '免', note: '' },
  ],
  faq: [
    { q: '需要什么资质？', a: '① 营业执照 (经营 1 年以上 · 抵押贷 6 个月可申请);② 法人 / 实控人征信良好;③ 近 12 个月银行流水或税单;④ 抵押贷需提供抵押物 (房产/商铺)。' },
    { q: '与个人消费贷的区别？', a: '资金用途 — 经营贷限于经营活动 (进货/工资/设备/装修)，不能用于股票/房产投资。利率通常低 1-2 个百分点 · 额度更大 (300-500 万 vs 50 万)。' },
    { q: '审批要多久？', a: '信用贷 (POS / 税务直连) 3-7 个工作日。抵押贷 (含房产评估) 7-15 个工作日。BankerOS 的"小微极速通道"可缩短至 3 天。' },
    { q: '抵押物会拍卖吗？', a: '只有连续逾期 90 天以上才会启动处置流程，前期会有客户经理多次沟通协商。可申请展期或调整还款计划。' },
  ],
  ctaTitle: '助力小微企业成长', ctaDesc: '抵押 4.5% 起 · 信用 6.5% 起',
  ctaButton: { label: '申请经营贷', to: '/login' },
};

export const LoanWedding         = () => <ProductDetailLite {...weddingLoanCfg} />;
export const LoanBusinessOwner   = () => <ProductDetailLite {...businessOwnerLoanCfg} />;

export const MortgageSecondHome = () => <ProductDetailLite {...secondHomeCfg} />;
export const MortgageOverseas   = () => <ProductDetailLite {...overseasMortgageCfg} />;
export const LoanFlash          = () => <ProductDetailLite {...flashLoanCfg} />;
export const LoanEducation      = () => <ProductDetailLite {...educationLoanCfg} />;
export const LoanRenovation     = () => <ProductDetailLite {...renovationLoanCfg} />;
export const LoanMedical        = () => <ProductDetailLite {...medicalLoanCfg} />;
export const LoanAutoDetail     = () => <ProductDetailLite {...autoLoanCfg} />;
