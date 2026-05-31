/**
 * Remaining 5 credit card detail pages (besides World Elite which has its own file).
 * Travel / Gold / Co-branded / Young / Corporate Purchasing
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

const cardVisual = (name: string, sub: string, color: string, accent: string, icon: string) => (
  <div style={{
    background: color, borderRadius: 16, padding: 32, color: 'white', aspectRatio: '1.586',
    position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', maxWidth: 420, margin: '0 auto',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.16em', textTransform: 'uppercase' }}>BankerOS</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{name}</div>
        <div style={{ fontSize: 11, opacity: 0.75 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 32, color: accent }}>{icon}</div>
    </div>
    <div style={{ width: 44, height: 32, background: 'linear-gradient(135deg, #c0c0c0, #888)', borderRadius: 5, marginTop: 32 }} />
    <div style={{ marginTop: 16, fontSize: 18, fontFamily: 'monospace', letterSpacing: '0.18em' }}>4889 ••• ••• 8801</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, opacity: 0.85 }}>
      <span>ZHAO LEI</span><span style={{ fontFamily: 'monospace' }}>12/30</span><span style={{ fontWeight: 900, color: accent }}>VISA</span>
    </div>
  </div>
);

// ─── 环球商旅卡 ────────────────────────────────────────────
const travelCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '信用卡', to: '/products/cards' }, { label: '环球商旅卡' }],
  category: 'Global Travel Card', productName: '环球商旅卡',
  tagline: '专为环球商务出行人士打造 — 海外消费 3% 现金返还 + 12 次机场休息室 + 商务舱升舱折扣',
  badge: '商务客户首选 · VISA Signature',
  bullets: ['海外消费返现 3% · 国内 2%', '机场休息室 12 次/年', '商务舱升舱折扣', '酒店金卡会员资格', '$200K 境外医疗保险', '5 倍消费积分'],
  background: 'navy',
  ctaPrimary: { label: '立即申请', to: '/login?action=open' },
  ctaSecondary: { label: '商旅咨询', to: '/help' },
  visual: cardVisual('环球商旅卡', 'Global Travel Card', 'linear-gradient(135deg, #002966 0%, #001838 100%)', '#06b6d4', '◆'),
  overview: {
    description: '环球商旅卡 (Global Travel Card) 是 BankerOS 与 VISA Signature 联名打造的中高端商务旅行信用卡。\n\n专为每月跨城商务出行 2-3 次的商务人士设计，覆盖机票、酒店、餐饮、机场服务等全场景。\n\n核心特色：海外消费 3% 现金返还 (行业普遍 1.5%)，叠加 5 倍积分。',
    benchmark: '对标 HSBC Premier MasterCard · Standard Chartered Visa Signature · 招行万事达白金商旅卡',
    params: [['卡片等级', 'VISA Signature'], ['年费', '¥ 1,800'], ['最高额度', '¥ 1,000,000'], ['境外消费返现', '3% (无上限)'], ['境内消费返现', '2% (餐饮/酒店)'], ['免息期', '50 天'], ['机场休息室', '12 次/年'], ['境外医疗', '$200K']],
  },
  features: [
    { icon: '✈️', title: '机场休息室', desc: 'LoungeKey 全球 1300+ 机场 · 12 次/年 (本人) + 12 次/年 (同伴)' },
    { icon: '💵', title: '海外返现 3%', desc: '所有海外消费无上限返现，年返现可达数万元' },
    { icon: '🏨', title: '酒店升级', desc: 'IHG / Marriott / Hilton 自动金卡会员 · 房型升级' },
    { icon: '🛂', title: 'WiFi/USIM', desc: '海外 100+ 国家免费 1GB/月 WiFi + eSIM 折扣' },
    { icon: '🥂', title: '航空贵宾', desc: '商务舱升舱折扣 (国航/南航/CX/SQ)' },
    { icon: '🛡', title: '商旅保险', desc: '$200K 境外医疗 + 行李延误 + 航班延误' },
  ],
  useCases: [
    { persona: '跨城商务出差者', icon: '✈️', scenario: '每月 2-3 次国内/海外出差', benefit: '机场休息室 + 升舱 + 返现累积可观', example: '某外贸经理年差旅 ¥30 万，年返现 ¥9,000 + 24 次免费休息室' },
    { persona: '中端管理者', icon: '👔', scenario: '差旅 + 商务宴请 + 接待客户', benefit: '集卡 5 倍积分 + 酒店金卡待遇', example: '科技公司总监年消费 ¥40 万，享 IHG 钻石 + 多次升舱' },
    { persona: '自由职业者', icon: '🎒', scenario: '工作旅行混合 · 多次出境', benefit: '一卡管全球 · 海外消费免转换费 + 返现', example: '数字游民年海外消费 ¥20 万，返现 ¥6,000 + 0 货币转换费' },
  ],
  process: [
    { step: '01', actor: '客户', title: '在线申请', desc: '5 分钟提交资料' },
    { step: '02', actor: '银行', title: '资信审核', desc: 'AI 审批 + 征信查询 · 3 工作日' },
    { step: '03', actor: '银行', title: '授信下卡', desc: '审批通过 · 5-7 天发卡到家' },
    { step: '04', actor: '客户', title: '激活使用', desc: 'App 一键激活 · 立即享权益' },
  ],
  caseStudy: {
    company: '王先生 (出口贸易公司销售总监)', logo: '👔', industry: '42 岁 · 年出差 30+ 次 · 上海',
    challenge: '过去用普通白金卡，海外消费要付 1.5% 货币转换费，年支出超 ¥5,000。机场休息室仅 4 次不够用，需付费购买 LoungeKey 单次 ¥200。',
    solution: '换成 BankerOS 环球商旅卡：海外消费免转换费 + 返现 3% · 12 次免费休息室 + 同伴 12 次。',
    results: [{ metric: '年返现', value: '¥ 9,420' }, { metric: '免转换费', value: '¥ 5,100' }, { metric: '休息室次数', value: '24 次' }, { metric: '净节省', value: '¥ 18K' }],
    quote: '换卡的第一年就省下两万多块，相当于卡费的 10 倍。机场休息室让我和家人一起出行更舒服。',
    quoteAuthor: '王先生 · 环球商旅卡用户',
  },
  fees: [
    { item: '年费 (主卡)', amount: '¥ 1,800', note: '年消费满 ¥ 12 万次年免年费' },
    { item: '年费 (附属卡)', amount: '¥ 0', note: '最多 2 张附属卡免年费' },
    { item: '取现手续费', amount: '3%', note: '透支取现' },
    { item: '货币转换费', amount: '免', note: '境外消费 0 货币转换费' },
    { item: '挂失补卡', amount: '¥ 50', note: 'Premier 客户免' },
  ],
  faq: [
    { q: '与环球白金卡有什么区别？', a: '商旅卡更聚焦于商务出行场景：12 次休息室 + 海外返现 3% + 商务舱升舱。白金卡是顶级综合卡：无限休息室 + Concierge + $500K 医疗 + 高尔夫。商旅卡年费仅 1/2，更适合预算实用客户。' },
    { q: '海外返现什么时候到账？', a: '次月 5 日返现至本卡账单，可抵扣下月消费或直接退现金至银行账户。' },
    { q: '机场休息室同伴免费吗？', a: '本人 12 次 + 同伴 12 次（同伴需与本人同行），全部免费。超出部分 USD 32/人/次。' },
    { q: '商务舱升舱折扣具体多少？', a: '与国航 / 南航 / 东航 / Cathay / Singapore / JAL 合作，提前 72 小时升舱可享 50% off 升舱差价。' },
  ],
  ctaTitle: '开启商旅新体验', ctaDesc: '在线申请 · 7-10 天发卡 · 立享商旅特权',
  ctaButton: { label: '立即申请', to: '/login?action=open' },
};

// ─── 财富金卡 ────────────────────────────────────────────
const goldCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '信用卡', to: '/products/cards' }, { label: '财富金卡' }],
  category: 'Wealth Gold Card', productName: '财富金卡',
  tagline: '中产客户日常消费首选 · 5 倍积分 · 餐饮 5% 返现 · 4 次机场休息室',
  badge: '中产首选 · 5 倍积分',
  bullets: ['消费 5 倍积分', '餐饮 5% 返现', '机场休息室 4 次/年', '加油返现 2%', '电影/演出 8 折', '基础旅游保险'],
  background: 'gold',
  ctaPrimary: { label: '立即申请', to: '/login?action=open' },
  visual: cardVisual('财富金卡', 'Wealth Gold Card', 'linear-gradient(135deg, #b8860b 0%, #8b6914 100%)', '#ffba00', '★'),
  overview: {
    description: '财富金卡 (Wealth Gold Card) 是 BankerOS 针对成长型中产客户推出的金卡级别信用卡。\n\n聚焦日常消费场景：餐饮、加油、电影、家居 — 通过分类返现 + 5 倍积分让每一笔消费都创造价值。\n\n年消费 ¥5-20 万的客户首选。',
    benchmark: '对标 招行 Visa 金卡 · 工行 World 金卡 · 农行 Visa 金卡',
    params: [['卡片等级', 'VISA Gold'], ['年费', '¥ 800 (首年免)'], ['最高额度', '¥ 500,000'], ['基础积分', '5 倍'], ['餐饮返现', '5%'], ['加油返现', '2%'], ['机场休息室', '4 次/年'], ['免息期', '50 天']],
  },
  features: [
    { icon: '🍽', title: '餐饮 5% 返现', desc: '指定餐饮商户消费 5% 直接返现 (上限 ¥500/月)' },
    { icon: '⛽', title: '加油返现 2%', desc: '中石化/中石油加油站消费 2% 返现' },
    { icon: '🎬', title: '电影 8 折', desc: '万达/CGV/UME 电影票每周一/三 8 折优惠' },
    { icon: '✈️', title: '机场休息室', desc: '龙腾 / Priority Pass · 4 次/年' },
    { icon: '🛡', title: '旅游保险', desc: '免费境内/境外基础旅游保险' },
    { icon: '💳', title: '账单分期 0%', desc: '消费 ¥3,000+ 享 6 期 0 手续费分期' },
  ],
  useCases: [
    { persona: '都市职场新人', icon: '🌆', scenario: '月薪 ¥15-30K · 日常消费餐饮/购物/电影', benefit: '小额高频消费返现累积可观', example: '小张 28 岁 IT 工程师，年消费 ¥10 万，年返现 ¥3,500' },
    { persona: '中产家庭', icon: '👨‍👩‍👧', scenario: '家庭日常开销 + 周末家庭出游', benefit: '加油/超市/家居返现 + 双副卡', example: '某家庭年消费 ¥15 万，餐饮加油返现 ¥4,200' },
  ],
  process: [
    { step: '01', actor: '客户', title: '在线申请', desc: '在线 5 分钟' },
    { step: '02', actor: '银行', title: '审批', desc: 'AI 即时审批 · 多数 1 小时内' },
    { step: '03', actor: '银行', title: '寄卡', desc: '5-7 天寄达' },
    { step: '04', actor: '客户', title: '激活', desc: '一键激活立即使用' },
  ],
  caseStudy: {
    company: '李女士 (会计师事务所主管)', logo: '👩‍💼', industry: '34 岁 · 上海 · 年消费 ¥12 万',
    challenge: '原本使用普通白金卡，年费 ¥600 但实际权益用不到，餐饮无返现，加油无折扣。',
    solution: '换成财富金卡：每月外卖 + 餐厅消费 ¥3K → 月返现 ¥150 · 加油 ¥1K → ¥20 · 电影周一周三 8 折。',
    results: [{ metric: '年返现', value: '¥ 3,840' }, { metric: '电影省', value: '¥ 900' }, { metric: '加油返现', value: '¥ 240' }, { metric: '总收益', value: '¥ 4,980' }],
    quote: '虽然不是顶级卡，但实用性满分。月供 ¥800 年费，享 ¥5,000 收益，回本绰绰有余。',
    quoteAuthor: '李女士 · 财富金卡用户',
  },
  fees: [
    { item: '年费', amount: '¥ 800', note: '首年免 · 年消费满 ¥5 万次年免' },
    { item: '附属卡年费', amount: '¥ 0', note: '免年费' },
    { item: '挂失补卡', amount: '¥ 50', note: '' },
    { item: '取现手续费', amount: '3%', note: '透支取现' },
  ],
  faq: [
    { q: '与商旅卡有什么区别？', a: '金卡聚焦本地日常消费 (餐饮/加油/电影/家居)。商旅卡聚焦商务出行 (机场/酒店/海外)。如果您每月在外消费多但少出差，选金卡更划算。' },
    { q: '餐饮返现的商户范围？', a: '与美团/大众点评 5 万+ 餐饮商户合作，包括连锁餐厅、本地餐馆、咖啡馆、奶茶店。返现上限 ¥500/月。' },
    { q: '能升级到环球白金卡吗？', a: '可以。当资产达到 Premier 标准 (50 万) 时可申请升级，原有积分自动迁移。' },
  ],
  ctaTitle: '中产消费首选金卡', ctaDesc: '首年免年费 · 5 倍积分 · 多场景返现',
  ctaButton: { label: '立即申请', to: '/login?action=open' },
};

// ─── 联名信用卡 ────────────────────────────────────────────
const coBrandCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '信用卡', to: '/products/cards' }, { label: '联名信用卡' }],
  category: 'Co-Branded Cards', productName: '联名信用卡',
  tagline: '与全球 50+ 知名品牌联名 · 航空里程 1:1 转换 · 加油 / 电商 / 酒店 5% 返现',
  badge: '50+ 联名 · 双重积分',
  bullets: ['航空公司里程 1:1 自动转换', '酒店积分双重累积', '加油站合作返现 5%', '电商平台合作 5% 返现', '专属客户日活动', '生日月双倍积分'],
  background: 'red',
  ctaPrimary: { label: '选择联名品牌', to: '/login?action=open' },
  visual: cardVisual('联名信用卡', 'Co-Branded Cards', 'linear-gradient(135deg, #db0011 0%, #8b0000 100%)', '#ffba00', '⊕'),
  overview: {
    description: '联名信用卡是 BankerOS 与 50+ 全球知名品牌 (航空公司 / 酒店集团 / 电商平台 / 加油站) 合作发行的特色信用卡。\n\n相比普通信用卡，联名卡的最大特色是双重积分累积 — 既在 BankerOS 积分系统累积，又同步累积合作品牌的会员积分。\n\n热门联名：国航凤凰知音卡、IHG 优悦会卡、京东 PLUS 卡、中石化加油卡。',
    benchmark: '对标 招行 + 多家联名 · 中信 ANA 卡 · 民生联名',
    params: [['卡片等级', '联名白金 / 金卡'], ['年费', '首年免年费'], ['最高额度', '¥ 300,000'], ['联名品牌', '50+'], ['基础积分', '3 倍'], ['品牌返现', '最高 5%'], ['免息期', '50 天']],
  },
  features: [
    { icon: '✈️', title: '航空里程', desc: '消费 ¥8 = 1 里程 · 国航/南航/CX/SQ 等 12 家航司直接累积' },
    { icon: '🏨', title: '酒店积分', desc: 'IHG/Marriott/Hilton/Hyatt 4 大集团积分双累' },
    { icon: '🛒', title: '电商返现', desc: '京东 / 天猫 / 拼多多 5% 直接返现' },
    { icon: '⛽', title: '加油返现', desc: '中石化 / 中石油 5% 返现 + 双倍积分' },
    { icon: '🎁', title: '品牌活动', desc: '联名品牌客户专享活动 · 新品优先购' },
    { icon: '🎂', title: '生日双倍', desc: '生日月所有消费双倍积分 + 联名品牌赠礼' },
  ],
  useCases: [
    { persona: '航空里程党', icon: '✈️', scenario: '每月飞行 4-8 次 · 重度依赖里程兑换', benefit: '里程累积速度 1:1 直接到航司账户', example: '某商务旅客年消费 ¥25 万 = 31,250 国航里程 = 国内往返头等舱 4 次' },
    { persona: '酒店常客', icon: '🏨', scenario: 'IHG/Marriott 金卡会员 · 经常住宿', benefit: '积分双累 + 自动升级金卡', example: 'IHG 金卡用户年消费 ¥15 万，住宿升级 20 次 + 早餐免费' },
    { persona: '电商重度用户', icon: '🛒', scenario: '京东 PLUS 会员 · 月购物 ¥5K+', benefit: '京东消费 5% 返现 + PLUS 双 11 加倍', example: '某电商党年京东消费 ¥6 万，返现 ¥3,000' },
  ],
  process: [
    { step: '01', actor: '客户', title: '选品牌', desc: '50+ 联名品牌中选择 1-2 个' },
    { step: '02', actor: '客户', title: '在线申请', desc: '同步关联品牌会员账号' },
    { step: '03', actor: '银行', title: '审批', desc: '1-3 工作日审批' },
    { step: '04', actor: '银行', title: '发卡', desc: '5-7 天发卡 + 品牌欢迎礼' },
  ],
  caseStudy: {
    company: '张先生 (跨国 IT 公司销售)', logo: '✈️', industry: '38 岁 · 国航金卡 · 年飞行 60 次',
    challenge: '张先生每年商务飞行 60 次，靠航司里程升舱头等舱。但单靠机票里程不够，需要额外消费累积里程。',
    solution: 'BankerOS 国航凤凰知音联名卡：餐饮购物消费直接累积国航里程 1:8。年消费 ¥40 万 = 50,000 里程，足够头等舱升舱 5 次。',
    results: [{ metric: '年累积里程', value: '50,000' }, { metric: '兑换头等', value: '5 次' }, { metric: '价值', value: '¥ 45,000' }, { metric: '会员等级', value: '凤凰金卡' }],
    quote: '我的卡片选择策略：每消费 ¥1 必须产生最少 ¥0.05 价值。联名卡让我突破了普通积分卡的天花板。',
    quoteAuthor: '张先生 · 国航凤凰知音联名卡',
  },
  fees: [
    { item: '年费 (首年)', amount: '免', note: '所有联名卡' },
    { item: '年费 (次年)', amount: '¥ 200-500', note: '根据联名品牌等级' },
    { item: '联名品牌权益', amount: '免', note: '会员等级自动同步' },
  ],
  faq: [
    { q: '可以同时申请多张联名卡吗？', a: '可以，最多 3 张。例如同时持有"航空 + 酒店 + 电商"三联名卡，覆盖全场景。' },
    { q: '里程多久同步到航司账户？', a: '次月 5 日自动同步至关联航司账户，无需手动操作。' },
    { q: '会过期吗？', a: '里程和积分都按合作品牌规则计算。国航里程通常 36 个月，金卡用户延长至 60 个月。' },
  ],
  ctaTitle: '选择您的联名伙伴', ctaDesc: '50+ 品牌任选 · 首年免年费',
  ctaButton: { label: '选择联名品牌', to: '/login?action=open' },
};

// ─── 环球青年卡 ────────────────────────────────────────────
const youngCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '信用卡', to: '/products/cards' }, { label: '环球青年卡' }],
  category: 'Young Adult Card', productName: '环球青年卡',
  tagline: '18-30 岁专属 · 永久免年费 · 海外留学消费 3% 返现 · 学费分期 0 利率',
  badge: '青年专享 · 永久免年费',
  bullets: ['18-30 岁专属', '永久免年费', '海外留学消费返现 3%', '学费分期 0 利率', '免费学生医疗保险', '校园活动专属优惠'],
  background: 'gradient',
  ctaPrimary: { label: '在校学生申请', to: '/login?action=open' },
  visual: cardVisual('环球青年卡', 'Young Adult Card', 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', '#ffba00', '🎓'),
  overview: {
    description: '环球青年卡 (Young Adult Card) 是 BankerOS 为 18-30 岁年轻人 (在校学生 / 应届毕业生) 专门设计的入门级国际信用卡。\n\n永久免年费 + 海外留学专属优惠 + 学费 0 利率分期，是大学生第一张信用卡的最佳选择。\n\n配套学生 App 提供消费管理、储蓄目标、信用知识培训。',
    benchmark: '对标 招行 Young 卡 · HSBC Student MasterCard · 工行学子卡',
    params: [['年龄要求', '18-30 周岁'], ['年费', '永久免'], ['最高额度', '¥ 50,000'], ['海外返现', '3% (留学场景)'], ['学费分期', '0 利率 12 期'], ['留学保险', '免费 $20K'], ['基础积分', '1 倍']],
  },
  features: [
    { icon: '🆓', title: '永久免年费', desc: '无任何年费 · 不要求年消费门槛 · 永久免费持有' },
    { icon: '🎓', title: '学费 0 利率', desc: '海外/国内学费一次性消费后可分 12 期 0 利率分期' },
    { icon: '💵', title: '海外返现 3%', desc: '留学国家消费 3% 返现 (上限 ¥1,000/月)' },
    { icon: '🛡', title: '免费学生保险', desc: '海外留学医疗 $20K + 行李遗失 + 紧急援助' },
    { icon: '📚', title: '校园优惠', desc: '50+ 大学校园食堂/咖啡/书店专属折扣' },
    { icon: '💡', title: '信用知识培训', desc: 'App 内信用基础课程 · 个人理财规划' },
  ],
  useCases: [
    { persona: '在校大学生', icon: '🎓', scenario: '本科 / 研究生在读 · 月生活费 ¥3-5K', benefit: '0 年费起步 · 积累征信 · 享校园优惠', example: '某 985 大学生使用 3 年，毕业时已有完整信用记录 + 良好评分' },
    { persona: '留学生', icon: '✈️', scenario: '在海外留学 · 学费 + 生活费消费海外', benefit: '学费 0 利率分期 · 留学保险免费 · 3% 返现', example: '伦敦留学生年学费 £25K，分 12 期付款 + 无利息' },
    { persona: '应届毕业生', icon: '💼', scenario: '初入职场 · 月薪 ¥8-15K · 建立信用记录', benefit: '入职即可申请 · 积累信用 · 未来升级白金卡', example: '应届硕士毕业生使用 1 年后升级为商旅卡' },
  ],
  process: [
    { step: '01', actor: '学生', title: '在校证明', desc: '学生证 + 在读证明' },
    { step: '02', actor: '银行', title: '简化审批', desc: '免收入要求 · 父母担保可选' },
    { step: '03', actor: '银行', title: '发卡', desc: '5-7 天发卡' },
    { step: '04', actor: '学生', title: 'App 激活', desc: '激活后立即学习信用知识' },
  ],
  caseStudy: {
    company: '小李 (英国伦敦大学硕士)', logo: '🎓', industry: '24 岁 · 留学伦敦 · 年学费 £30,000',
    challenge: '小李从国内本科毕业去伦敦读硕士。学费 £30,000 + 生活费 £15K，父母一次付清压力大。希望分期付款 + 海外医疗保障。',
    solution: 'BankerOS 环球青年卡：学费分 12 期 0 利率 = 月供 £2,500 · 留学生医疗免费 $20K · 海外消费 3% 返现。',
    results: [{ metric: '学费分期', value: '12 期 0 利率' }, { metric: '海外返现', value: '£ 450' }, { metric: '医保覆盖', value: '$ 20K' }, { metric: '征信积累', value: '24 个月' }],
    quote: '青年卡让我能独立管理大学开支，父母不用一次性垫付。海外医保也用上过一次，免费看了急诊。毕业回国后顺利升级商旅卡。',
    quoteAuthor: '小李 · 环球青年卡用户',
  },
  faq: [
    { q: '没有收入的学生能申请吗？', a: '可以。学生证 + 在读证明即可申请。可选父母担保提升额度。' },
    { q: '父母担保会影响他们征信吗？', a: '不影响。学生卡担保仅作为信用参考，父母无连带还款责任。学生违约也不影响父母征信。' },
    { q: '30 岁后会强制取消吗？', a: '不会。30 岁后卡片继续有效，但下次升级时可换为金卡或商旅卡，享更高权益。' },
    { q: '学费分期需要什么条件？', a: '学校账户认证 + 单笔消费 ¥3,000 以上。学费类消费自动提示分期。' },
  ],
  ctaTitle: '人生第一张信用卡', ctaDesc: '永久免年费 · 0 门槛 · 建立信用记录',
  ctaButton: { label: '学生申请', to: '/login?action=open' },
};

// ─── 商务采购卡 ────────────────────────────────────────────
const corporatePurchCfg: ProductConfig = {
  breadcrumbs: [{ label: '个人银行', to: '/products/personal' }, { label: '信用卡', to: '/products/cards' }, { label: '商务采购卡' }],
  category: 'Corporate Purchasing Card', productName: '商务采购卡',
  tagline: '企业采购集中支付 · 详细分类对账 · 员工卡多级权限 · 与 ERP 直连',
  badge: '企业财务专用',
  bullets: ['企业采购集中支付', '详细分类对账报表', '员工卡多级权限', '与 ERP 系统直连', '增值税电子发票自动归档', '采购数据分析仪表盘'],
  background: 'black',
  ctaPrimary: { label: '企业开户咨询', to: '/help' },
  visual: cardVisual('商务采购卡', 'Corporate Purchasing Card', 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 100%)', '#ffba00', '🏢'),
  overview: {
    description: '商务采购卡 (Corporate Purchasing Card, P-Card) 是企业财务部为员工日常采购预付费 + 销账的专用信用卡。\n\n替代传统报销流程 — 员工不再先垫付再报销，而是用公司卡支付，月度账单直接归集到公司账户。\n\n核心价值：减少 80% 报销人工 + 自动分类记账 + 实时控费。',
    benchmark: '对标 American Express Corporate Card · 招行 P 卡 · 中信 商务卡',
    params: [['卡片类型', 'VISA Business / Mastercard Corporate'], ['年费', '按需定制'], ['最高额度', '¥ 10,000,000'], ['员工卡数量', '不限'], ['权限级别', '4 级 (主管 / 部门 / 员工 / 临时)'], ['账单周期', '月度集中'], ['免息期', '最长 56 天']],
  },
  features: [
    { icon: '👥', title: '员工卡多级权限', desc: '主管卡 / 部门卡 / 员工卡 / 临时卡 4 级权限 · 单笔/月度/年度限额' },
    { icon: '📊', title: '采购分析仪表盘', desc: '按部门/员工/商品分类的实时支出仪表板' },
    { icon: '🔌', title: 'ERP 直连', desc: 'SAP / Oracle / Kingdee / 用友 自动同步交易' },
    { icon: '🧾', title: '电子发票自动归档', desc: '与税务系统对接 · 增值税电子发票自动获取归档' },
    { icon: '🛂', title: '可控消费类别', desc: '可指定员工卡只能在油站/餐厅/酒店使用，限制其他类别' },
    { icon: '📱', title: '员工 App', desc: '员工随时查询余额 · 上传发票照片 · 报销自动化' },
  ],
  useCases: [
    { persona: '销售部门', icon: '💼', scenario: '销售经常出差 · 接待客户 · 招待应酬', benefit: '替代垫付报销 · 客户消费透明可控', example: '某 SaaS 公司 100 名销售，月节省 200 小时报销人工' },
    { persona: '采购部门', icon: '📦', scenario: '日常办公用品 / 设备 / 服务采购', benefit: '集中支付 · 批量对账 · ERP 自动入账', example: '制造业企业采购年总额 ¥500 万，对账人力节省 3 FTE' },
    { persona: '研发团队', icon: '💻', scenario: '云服务 (AWS/阿里云) / 软件订阅', benefit: '订阅服务自动续费 · 按项目分类记账', example: '科技公司云费用 ¥200 万/年，分项目归类自动化' },
  ],
  process: [
    { step: '01', actor: '企业', title: '咨询定制', desc: '客户经理上门评估 · 设计权限架构' },
    { step: '02', actor: '银行', title: '主账户开立', desc: '签约 + 主账户授信' },
    { step: '03', actor: '银行', title: '员工卡发放', desc: '批量发卡到员工 · 7-14 天' },
    { step: '04', actor: '企业', title: 'ERP 对接', desc: 'IT 部门完成 ERP 集成 (2-4 周)' },
    { step: '05', actor: '员工', title: '日常使用', desc: '消费 · 上传发票 · 自动入账' },
  ],
  caseStudy: {
    company: '某科技公司 (500 人规模)', logo: '🏢', industry: 'SaaS 软件公司 · 年销售费用 ¥2,800 万',
    challenge: '原有报销流程：员工垫付 → 收发票 → 填报销单 → 经理审 → 财务审 → 7 天打款。年均 12,000 笔报销 × 30 分钟/笔 = 6,000 人工小时。',
    solution: '部署 BankerOS 商务采购卡：销售/采购/研发 100 张员工卡 + 4 级权限 + ERP 直连。报销自动化：员工消费后拍发票上传，AI OCR 识别后自动入账，主管 App 一键审批。',
    results: [{ metric: '报销人工节省', value: '4,800 小时/年' }, { metric: '年节省成本', value: '¥ 96 万' }, { metric: '到账时间', value: 'T+0 (从 7 天)' }, { metric: '违规消费拦截', value: '12 起/年' }],
    quote: '商务采购卡让我们 CFO 从「报销审批员」变回「战略决策者」。AI 自动识别违规消费，比人工更可靠。',
    quoteAuthor: '某科技公司 CFO',
  },
  faq: [
    { q: '员工离职怎么办？', a: 'HR 一键停卡 · 5 分钟生效。已支出由公司统一结算。' },
    { q: '员工消费违规怎么办？', a: 'AI 实时监控异常消费 (大额/非工作时间/非授权类别)，自动拦截或短信预警主管。' },
    { q: '是否影响员工个人信用？', a: '不影响。卡片属公司账户，员工不承担连带责任，不上传至个人征信。' },
    { q: '与对公账户的关系？', a: '采购卡账单按月集中至企业主账户自动还款，可与企业现金管理资金池无缝集成。' },
  ],
  ctaTitle: '让企业财务管理自动化', ctaDesc: '节省 80% 报销人工 · 实时控费 · ERP 直连',
  ctaButton: { label: '咨询客户经理', to: '/help' },
};

export const CardTravel  = () => <ProductDetailLite {...travelCfg} />;
export const CardGold    = () => <ProductDetailLite {...goldCfg} />;
export const CardCoBrand = () => <ProductDetailLite {...coBrandCfg} />;
export const CardYoung   = () => <ProductDetailLite {...youngCfg} />;
export const CardCorporatePurchasing = () => <ProductDetailLite {...corporatePurchCfg} />;
