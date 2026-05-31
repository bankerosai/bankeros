/**
 * Wealth management detail pages:
 * Funds / Bonds / Structured Products / Trust / Migration / Inheritance
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

const fundsCfg: ProductConfig = {
  breadcrumbs: [{ label: '财富管理' }, { label: '投资产品' }, { label: '公募基金' }],
  category: 'Mutual Funds', productName: '公募基金',
  tagline: '5,000+ 只精选基金 · 申购费 1 折 · 一站式投资股票/债券/QDII/REITs',
  badge: '5,000+ 基金 · 申购 1 折',
  bullets: ['5,000+ 只精选基金', '申购费 1 折 (低至 0.15%)', '股票/债券/QDII/REITs', '智能定投', '基金组合优选', '基金经理排名分析'],
  background: 'navy',
  ctaPrimary: { label: '开通基金账户', to: '/login' },
  overview: {
    description: '公募基金代销服务 — BankerOS 与全国 150+ 公募基金公司合作，提供 5,000+ 只基金一站式投资。\n\n核心优势：申购费 1 折优惠 (传统银行渠道 1.5% → BankerOS 0.15%)，相当于每年节省 1-2 个百分点。\n\n投资品类全覆盖：股票型/混合型/债券型/货币型/QDII/REITs/FOF。',
    benchmark: '对标 招行掌上生活基金 · 天天基金网 · 蚂蚁基金',
    params: [['基金数量', '5,000+'], ['基金公司', '150+ 家'], ['品类', '股票/债券/QDII/REITs/FOF'], ['最低申购', '¥ 10'], ['申购费', '1 折优惠'], ['赎回时长', 'T+1 / T+3']],
  },
  features: [
    { icon: '💯', title: '5,000+ 基金', desc: '覆盖国内主流基金公司 · 易方达/嘉实/广发/华夏/南方等' },
    { icon: '💰', title: '申购费 1 折', desc: '原价 1.5% → BankerOS 0.15% · 年节省可观' },
    { icon: '🎯', title: '基金组合优选', desc: '专家精选 50 个组合 · 不同风险偏好' },
    { icon: '📊', title: '基金经理评级', desc: 'Morningstar 五星评级 + BankerOS 自研排名' },
    { icon: '🔄', title: '智能定投', desc: '每周/每月自动定投 · 平摊成本' },
  ],
  useCases: [
    { persona: '基金小白', icon: '🌱', scenario: '想理财但不会选基金', benefit: '基金组合一键购买', example: '某理财新手买入"稳健 60"组合 · 一键持有 8 只基金' },
    { persona: '中长期投资', icon: '📈', scenario: '3-10 年长期投资 · 不需要短期流动性', benefit: '股票/混合型基金 · 长期回报高', example: '某用户每月定投 ¥5,000 沪深 300 指数基金 · 10 年累计收益 ¥150 万' },
  ],
  process: [
    { step: '01', actor: '客户', title: '开通基金账户', desc: '5 分钟实名认证' },
    { step: '02', actor: '客户', title: '风险测评', desc: 'R1-R5 风险等级' },
    { step: '03', actor: '客户', title: '挑选基金', desc: 'AI 推荐 + 手动筛选' },
    { step: '04', actor: '客户', title: '申购', desc: 'T+1 确认份额' },
  ],
  caseStudy: {
    company: '某 IT 工程师', logo: '💻', industry: '32 岁 · 月薪 ¥30K · 定投 5 年',
    challenge: '想做长期投资但不懂选股，单买基金又怕选错。',
    solution: 'BankerOS 智能定投：每月 5,000 元定投"沪深 300 指数 ETF (易方达)" · 持续 5 年。',
    results: [{ metric: '累计投入', value: '¥ 30 万' }, { metric: '5 年市值', value: '¥ 41 万' }, { metric: '年化收益', value: '7.5%' }, { metric: '申购费节省', value: '¥ 4,200' }],
    quote: '定投让我从"理财小白"变成"长期投资者"。5 年下来不知不觉攒下 40 多万，比把钱放余额宝强太多。',
    quoteAuthor: '某 IT 工程师 · 基金定投客户',
  },
  faq: [
    { q: '为什么 BankerOS 申购费便宜？', a: '我们是基金代销机构，与基金公司直签，省去中间渠道费用。' },
    { q: '基金会亏钱吗？', a: '会。股票型/混合型基金有亏损风险。建议长期持有 (3 年+) 并分散投资。货币型/纯债基金风险最低。' },
    { q: '基金怎么赎回？', a: 'T+1 (货币基金) / T+3 (股票/混合基金) 到账。BankerOS 提供"快速取现"服务 · 1 万元内 T+0 到账。' },
  ],
  ctaTitle: '开启基金投资之旅', ctaDesc: '5,000+ 基金 · 申购 1 折',
  ctaButton: { label: '开通基金账户', to: '/login' },
};

const bondsCfg: ProductConfig = {
  breadcrumbs: [{ label: '财富管理' }, { label: '投资产品' }, { label: '债券' }],
  category: 'Bonds', productName: '债券投资',
  tagline: '国债 / 金融债 / 公司债 / 海外债 · 稳健收益 3-6% · ¥100 元起投',
  badge: '稳健投资 · 3-6% 年化',
  bullets: ['国债/金融债/公司债/海外债', '收益 3-6%', '¥100 元起投', '到期保本', '二级市场可转让', '免税国债'],
  background: 'navy',
  ctaPrimary: { label: '认购债券', to: '/login' },
  overview: {
    description: 'BankerOS 债券投资覆盖完整产品线：① 国债 (3-10 年期 · 免税)；② 金融债 (银行/政策性银行发行)；③ 公司债 (大型央企/上市公司)；④ 海外债 (美国国债/欧债/新兴市场)。\n\n债券特点：固定收益 (类似存款利息) + 到期保本 + 中期赎回可在二级市场转让。\n\n核心场景：稳健型客户 / 大额资产配置 / 退休金管理。',
    benchmark: '对标 招行个人国债 · 工行债券通',
    params: [['国债收益', '3-4% (3-10 年)'], ['金融债', '4-5% (3-5 年)'], ['公司债', '5-7% (AAA-AA)'], ['海外债', '4-8%'], ['最低投资', '¥ 100 (国债) / ¥ 1,000 (公司债)'], ['二级转让', '可']],
  },
  features: [
    { icon: '🏛', title: '国债', desc: '国家信用 · 最安全 · 免利息所得税 · 收益 3-4%' },
    { icon: '🏦', title: '金融债', desc: '商业银行/国开行发行 · 信用极佳 · 收益 4-5%' },
    { icon: '🏢', title: '公司债', desc: 'AAA 级央企/大型上市公司 · 收益 5-7%' },
    { icon: '🌍', title: '海外债', desc: '美国国债/欧债 · 全球资产配置' },
  ],
  useCases: [
    { persona: '保守型投资者', icon: '🛡', scenario: '不能承受本金损失', benefit: '到期 100% 保本 + 固定收益', example: '某退休客户 ¥100 万 · 5 年期国债 · 年息 3.4 万' },
    { persona: '大额资产配置', icon: '📊', scenario: '高净值客户 30-50% 配债券', benefit: '抗股市波动 · 平衡组合', example: 'Jade 客户 ¥1000 万组合 · 40% 配置债券' },
  ],
  process: [
    { step: '01', actor: '客户', title: '风险测评', desc: 'R1-R3 客户均可' },
    { step: '02', actor: '客户', title: '认购', desc: '一级 / 二级市场购买' },
    { step: '03', actor: '银行', title: '到期', desc: '本金 + 利息自动入账' },
  ],
  caseStudy: {
    company: '某退休家庭', logo: '👴', industry: '70 岁 · ¥500 万退休金管理',
    challenge: '希望年收益 5% 以上但不能承受亏损。',
    solution: 'BankerOS 债券组合：60% 国债 (3.5%) + 30% 金融债 (4.5%) + 10% 公司债 (6%) = 平均 4.05%。',
    results: [{ metric: '年收益', value: '¥ 20.3 万' }, { metric: '收益率', value: '4.05%' }, { metric: '本金保全', value: '100%' }, { metric: '比定期', value: '+ 1.55%' }],
    quote: '债券组合给我稳定收益又不担心本金，比定期高 1.5% 一年多收 ¥7,500。',
    quoteAuthor: '某退休家庭 · 债券客户',
  },
  faq: [
    { q: '债券会亏钱吗？', a: '持有到期 100% 保本。但中途在二级市场卖出可能因市场利率上升而价格下跌。建议持有到期。' },
    { q: '国债免税吗？', a: '中国国债免征利息所得税 (普通利息要交 20%)。同等票面利率下，国债实际收益高于其他债券。' },
  ],
  ctaTitle: '稳健债券投资', ctaDesc: '收益 3-6% · 到期保本',
  ctaButton: { label: '认购债券', to: '/login' },
};

const structuredProductCfg: ProductConfig = {
  breadcrumbs: [{ label: '财富管理' }, { label: '投资产品' }, { label: '结构性产品' }],
  category: 'Structured Products', productName: '结构性产品',
  tagline: '挂钩股票/指数/汇率/利率 · 高收益策略 · 6-18 个月期',
  badge: '收益 + 期权策略',
  bullets: ['挂钩多种标的', '收益 6-15% 潜力', '保本 / 非保本可选', '6-18 个月期', '专家设计策略', '机构级产品'],
  background: 'navy',
  ctaPrimary: { label: '咨询结构性产品', to: '/help' },
  overview: {
    description: '结构性产品是嵌入金融衍生品的复合型理财产品。\n\n通过期权策略获得"标的资产上涨/下跌" 部分收益，同时控制风险。\n\n常见挂钩标的：单股 (Apple/Tesla) · 指数 (沪深 300/标普 500) · 汇率 (USDCNY) · 大宗商品 (黄金/原油)。',
    benchmark: '对标 招行结构性理财 · HSBC Equity-Linked Notes',
    params: [['最低投资', '¥ 100,000'], ['期限', '6-18 个月'], ['挂钩标的', '股票/指数/汇率/商品'], ['保本类型', '保本 / 非保本'], ['潜在收益', '6-15%'], ['风险等级', 'R3-R4']],
  },
  features: [
    { icon: '🎯', title: '多种策略', desc: '看涨/看跌/区间/二元期权多种结构' },
    { icon: '🏆', title: '机构级产品', desc: '原本仅机构客户可投 · BankerOS 引入个人' },
    { icon: '👨‍🏫', title: '专家设计', desc: '资深结构师团队定期推出新策略' },
  ],
  useCases: [
    { persona: '看涨投资者', icon: '📈', scenario: '看好某只股票/指数', benefit: '0 风险参与上涨 (保本款)', example: '看涨特斯拉 · 12 个月期 · 上涨 30% 获 12% 收益' },
  ],
  process: [
    { step: '01', actor: '客户', title: '风险测评', desc: 'R3+ 客户' },
    { step: '02', actor: '客户', title: '选择策略', desc: 'BankerOS 推荐 5-10 款新品' },
    { step: '03', actor: '客户', title: '认购', desc: '¥10 万 起' },
    { step: '04', actor: '银行', title: '到期兑付', desc: '本金 + 浮动收益' },
  ],
  caseStudy: {
    company: 'Premier 客户', logo: '💎', industry: '40 岁 · 上海',
    challenge: '看好美股 AI 板块但不愿直接买美股 (汇率/税务复杂)',
    solution: '挂钩"纳斯达克 100"12 个月期结构性产品 · 保本 · 上涨 ≤20% 不参与 · >20% 部分获 50% 收益',
    results: [{ metric: '本金安全', value: '100%' }, { metric: '到期收益', value: '11.2%' }, { metric: '挂钩资产涨幅', value: '+38%' }, { metric: '比纳指 ETF', value: '0 汇率风险' }],
    quote: '结构性产品让我享受美股 AI 红利同时不担心本金，比直接买美股省心很多。',
    quoteAuthor: 'Premier 客户',
  },
  faq: [
    { q: '保本款保多少？', a: '保 100% 本金。即使挂钩标的暴跌，到期至少拿回本金。' },
    { q: '非保本款风险多大？', a: '极端情况可能损失 20-50% 本金，但收益潜力也更高 (15-25%)。仅适合 R4+ 客户。' },
  ],
  ctaTitle: '专业结构性产品', ctaDesc: '机构级策略 · Premier 客户专享',
  ctaButton: { label: '咨询专家', to: '/help' },
};

const trustCfg: ProductConfig = {
  breadcrumbs: [{ label: '财富管理' }, { label: '专属服务' }, { label: '家族信托' }],
  category: 'Family Trust', productName: '家族信托',
  tagline: '资产隔离 · 财富传承 · 跨代规划 · BVI/Cayman/Singapore/HK 多地架构',
  badge: '私行客户专享 · ¥3000 万起',
  bullets: ['资产隔离避险', '跨代财富传承', '4 地架构 (BVI/Cayman/SG/HK)', '受益人指定灵活', '免遗产税 · 避债权追索', '20-100 年期'],
  background: 'black',
  ctaPrimary: { label: '私行专家咨询', to: '/help' },
  overview: {
    description: '家族信托是高净值家庭进行财富传承、税务规划、资产保护的核心工具。\n\n客户 (委托人) 将资产委托给受托人 (信托公司) 管理，按事先约定为受益人 (子女/配偶/慈善) 分配收益。\n\n核心价值：① 资产隔离 (与债务/婚姻/经营隔离)；② 跨代传承 (避遗产税)；③ 长期规划 (20-100 年)。',
    benchmark: '对标 招行私行家族信托 · 渣打 SC Trust · HSBC Trust Services',
    params: [['最低规模', '¥ 3,000 万'], ['期限', '20-100 年'], ['注册地', 'BVI / Cayman / Singapore / HK'], ['受益人', '指定 + 灵活变更'], ['信托类型', '保障型/慈善型/混合型']],
  },
  features: [
    { icon: '🛡', title: '资产隔离', desc: '信托资产独立于委托人 · 不受婚姻/债务/经营风险影响' },
    { icon: '🏛', title: '跨代传承', desc: '可指定子女、孙辈、慈善基金等多重受益人' },
    { icon: '🌏', title: '多地架构', desc: 'BVI 离岸 + Cayman 灵活 + Singapore 安全 + HK 便利' },
    { icon: '💰', title: '避遗产税', desc: '部分司法管辖区遗产税最高 40% · 信托可合法规避' },
  ],
  useCases: [
    { persona: '企业家', icon: '🏢', scenario: '担心企业经营风险波及家庭', benefit: '资产隔离 · 经营失败不连累家人', example: '某企业家将 ¥1 亿信托资产 · 家庭安全' },
    { persona: '高净值家庭传承', icon: '👨‍👩‍👧‍👦', scenario: '子女不善理财 · 怕挥霍', benefit: '信托按计划分配 · 受益人 25/30/35 岁分阶段领', example: '为孩子设定 30 岁前每年领 100 万 · 30 岁后自主' },
    { persona: '再婚家庭', icon: '💍', scenario: '希望保护前段婚姻子女', benefit: '指定受益人 · 不受新婚姻影响', example: '前妻子女作为信托受益人' },
  ],
  process: [
    { step: '01', actor: '客户', title: '需求咨询', desc: '私人银行家深度访谈' },
    { step: '02', actor: '专业团队', title: '架构设计', desc: '律师/税务/信托 3 方协作' },
    { step: '03', actor: '客户', title: '签署文件', desc: '《信托契约》+ 资产清单' },
    { step: '04', actor: '客户', title: '资产注入', desc: '现金/股权/不动产/艺术品' },
  ],
  caseStudy: {
    company: '某科技集团创始人', logo: '🏢', industry: '55 岁 · 创业 25 年 · 净资产 ¥5 亿',
    challenge: '公司即将 IPO，但担心未来：① 经营风险波及家庭；② 子女不善理财；③ 遗产税 (新加坡居所);',
    solution: 'BankerOS 设计三层架构：① Cayman 主信托 (¥3 亿)；② Singapore 子信托 (¥1 亿配偶/子女)；③ HK 慈善信托 (¥1 亿慈善)。',
    results: [{ metric: '资产规模', value: '¥ 5 亿' }, { metric: '司法管辖区', value: '3 地' }, { metric: '受益人', value: '配偶 + 2 子女' }, { metric: '免税', value: '✓ 合规' }],
    quote: '家族信托给我和家人最重要的礼物 — 安心。无论公司未来如何，家庭已被妥善保护。',
    quoteAuthor: '某科技集团创始人',
  },
  faq: [
    { q: '为什么不在中国设立？', a: '中国境内信托业务尚不成熟 · 法律保护和税务规划灵活性不如离岸地。BankerOS 香港分行可协助境外信托设立。' },
    { q: '是否合规？', a: '完全合规。信托资产需通过合法渠道转移 (购汇额度内/海外资产)。所有架构符合 CRS / FATCA 申报要求。' },
  ],
  ctaTitle: '财富守护 · 传承百年', ctaDesc: '私人银行家保密咨询 · ¥3000 万起',
  ctaButton: { label: '预约咨询', to: '/help' },
};

const migrationCfg: ProductConfig = {
  breadcrumbs: [{ label: '财富管理' }, { label: '专属服务' }, { label: '海外配置' }],
  category: 'Overseas Asset Allocation', productName: '海外资产配置',
  tagline: '美元资产 · 海外保险 · 移民规划 · 全球资产布局',
  badge: 'Jade 客户专享',
  bullets: ['美元资产配置', '海外保险/年金', '美 / 加 / 澳 / 葡 移民', '海外房产投资', '离岸账户开立', '税务规划'],
  background: 'navy',
  ctaPrimary: { label: '海外配置咨询', to: '/help' },
  overview: {
    description: '为高净值客户提供全球范围的资产配置、移民规划、税务优化一站式服务。\n\n核心服务：① 美元资产 (美股/美债/美房)；② 海外保险 (大额寿险/年金险)；③ 移民身份规划 (投资移民/技术移民)；④ 海外公司架构。',
    benchmark: '对标 招行私行 · 友邦海外保险 · 雷曼移民',
    params: [['最低资产', '¥ 600 万 (Jade)'], ['覆盖国家', '20+'], ['投资品类', '股/债/房/保险/PE'], ['移民国家', '美/加/澳/欧/亚'], ['专属服务', '私人银行家 + 律师 + 税务']],
  },
  features: [
    { icon: '💵', title: '美元资产', desc: '美股/美债/美房一站式 · 与 BankerOS 香港分行联动' },
    { icon: '🛡', title: '海外保险', desc: '友邦/保诚/宏利 大额寿险 · 美元保单' },
    { icon: '🛂', title: '移民规划', desc: '美 EB5 / 加 SUV / 澳 188 / 葡萄牙黄金签证' },
    { icon: '🏠', title: '海外房产', desc: '与 Knight Frank / Sotheby\'s 合作 · 全球顶级房产' },
  ],
  useCases: [
    { persona: '美元配置客户', icon: '💵', scenario: '担心人民币贬值 · 配置美元资产', benefit: '汇率分散 · 美股长期上涨', example: '某客户配置 30% 资产为美元 (美股+美房)' },
    { persona: '子女留学规划', icon: '🎓', scenario: '为子女未来留学+移民规划', benefit: '美国 EB5/加拿大 SUV 投资移民', example: '某家庭 $1.05M EB5 投资 · 5 年获绿卡' },
  ],
  process: [
    { step: '01', actor: '客户', title: '需求评估', desc: '私行家庭目标分析' },
    { step: '02', actor: '专家', title: '方案设计', desc: '律师 + 税务 + 投资 3 方' },
    { step: '03', actor: '客户', title: '签约执行', desc: '海外账户开立 + 资金配置' },
  ],
  caseStudy: {
    company: '深圳企业家家庭', logo: '🌏', industry: '50 岁 · 净资产 ¥2 亿 · 子女赴美',
    challenge: '希望部分资产配置美元 + 为子女准备移民身份。',
    solution: '① $500K 美股组合 (FAANG + 标普 500)；② $500K 美国房产 (洛杉矶学区房 出租)；③ $1.05M EB5 投资移民 (5 年获绿卡)。',
    results: [{ metric: '美元资产', value: '$ 2.05M' }, { metric: '美房年租金', value: '$ 36K' }, { metric: 'EB5 排期', value: '5 年' }, { metric: '子女身份', value: '绿卡' }],
    quote: 'BankerOS 把投资、移民、税务、教育全部串起来，让我们一次性把全家未来 10 年的规划做完了。',
    quoteAuthor: '深圳企业家',
  },
  faq: [
    { q: '需要怎么资质？', a: 'Jade 钻石客户 (日均资产 600 万) 起。海外配置涉及跨境合规，需要 BankerOS 客户经理协助办理。' },
    { q: '资金合规怎么办？', a: '通过 BankerOS 合规通道，使用 QDII/QDLP 等合法渠道，并配合 CRS/FATCA 申报。' },
  ],
  ctaTitle: '全球资产 · 全家未来', ctaDesc: 'Jade 客户专享 · 一站式咨询',
  ctaButton: { label: '海外配置咨询', to: '/help' },
};

const inheritanceCfg: ProductConfig = {
  breadcrumbs: [{ label: '财富管理' }, { label: '专属服务' }, { label: '遗产规划' }],
  category: 'Estate Planning', productName: '遗产规划',
  tagline: '遗嘱信托 · 慈善基金 · 家族办公室 · 跨代财富智慧传承',
  badge: '私行客户专享',
  bullets: ['遗嘱信托设立', '慈善基金会', '家族宪章制定', '继承人金融素养', '跨代信托', '名校引荐 (商学院)'],
  background: 'black',
  ctaPrimary: { label: '遗产规划咨询', to: '/help' },
  overview: {
    description: '遗产规划是为家庭长期传承资产、教育下一代、践行公益慈善的综合性服务。\n\n服务内容：① 遗嘱信托 (按计划分配资产)；② 慈善基金会设立 (家族慈善+税务优化)；③ 家族宪章 (家族成员行为准则)；④ 继承人培养 (商学院/财富课程)。',
    benchmark: '对标 UBS Family Office · Citi Private Bank · HSBC Trust',
    params: [['最低资产', '¥ 5 亿'], ['服务团队', '律师 + 税务 + 信托 + 教育'], ['期限', '50-100 年'], ['受益人', '家族多代']],
  },
  features: [
    { icon: '📜', title: '遗嘱信托', desc: '按生前意愿在身后执行 · 跨代分配资产' },
    { icon: '❤️', title: '慈善基金会', desc: '设立家族慈善 · 既做善事又规划税务' },
    { icon: '🏛', title: '家族宪章', desc: '制定家族企业治理 · 继承人准则' },
    { icon: '🎓', title: '继承人培养', desc: '哈佛/斯坦福商学院 · 财富管理培训' },
  ],
  useCases: [
    { persona: '超高净值', icon: '💎', scenario: '资产 5 亿+ · 多子女 · 担心争产', benefit: '提前规划避免家族纷争', example: '某地产家族 ¥10 亿 · 3 子女 · 信托公平分配' },
    { persona: '回馈社会', icon: '❤️', scenario: '希望财富造福社会而非全留子女', benefit: '慈善基金会 · 子女做受托人', example: '某企业家捐 ¥5 亿成立教育基金' },
  ],
  process: [
    { step: '01', actor: '客户', title: '家族访谈', desc: '了解家族结构 · 财富目标' },
    { step: '02', actor: '专家', title: '架构设计', desc: '法律 + 税务 + 信托综合方案' },
    { step: '03', actor: '客户', title: '签署执行', desc: '《遗嘱信托契约》+ 资产清单' },
  ],
  caseStudy: {
    company: '某地产家族', logo: '🏛', industry: '70 岁创始人 · ¥10 亿净资产 · 3 个子女',
    challenge: '3 个子女能力差异大，担心身后争产 · 希望部分资产做慈善。',
    solution: 'BankerOS 家族办公室设计：① ¥5 亿信托给 3 子女均分；② ¥3 亿成立教育慈善基金会；③ ¥2 亿留给配偶；④ 制定家族宪章 (不许变卖核心资产)。',
    results: [{ metric: '总规模', value: '¥ 10 亿' }, { metric: '受益人', value: '3 子女 + 配偶 + 慈善' }, { metric: '免遗产税', value: '✓' }, { metric: '家族和睦', value: '✓' }],
    quote: '财富规划比赚钱更重要。BankerOS 帮我把家族 100 年的事都安排妥当，是我最满意的决定。',
    quoteAuthor: '某地产家族创始人',
  },
  faq: [
    { q: '与家族信托的区别？', a: '家族信托侧重资产隔离和传承。遗产规划更全面：包含信托 + 慈善 + 家族治理 + 继承人教育。' },
  ],
  ctaTitle: '财富智慧传承', ctaDesc: '为家族百年未来规划',
  ctaButton: { label: '遗产规划咨询', to: '/help' },
};

export const WealthFunds       = () => <ProductDetailLite {...fundsCfg} />;
export const WealthBonds       = () => <ProductDetailLite {...bondsCfg} />;
export const WealthStructured  = () => <ProductDetailLite {...structuredProductCfg} />;
export const WealthTrust       = () => <ProductDetailLite {...trustCfg} />;
export const WealthMigration   = () => <ProductDetailLite {...migrationCfg} />;
export const WealthInheritance = () => <ProductDetailLite {...inheritanceCfg} />;
