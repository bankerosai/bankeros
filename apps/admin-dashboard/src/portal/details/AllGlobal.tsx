/**
 * Global & cross-border detail pages: Offshore / Study Abroad / Immigration
 */

import ProductDetailLite, { ProductConfig } from '../ProductDetailLite';

const offshoreCfg: ProductConfig = {
  breadcrumbs: [{ label: '全球与跨境' }, { label: '离岸账户' }],
  category: 'Offshore Account', productName: '离岸账户',
  tagline: '香港 / 新加坡 / 卢森堡 · 资产隔离 · 多币种 · 全球投资便利',
  badge: 'Premier 客户专享',
  bullets: ['香港/新加坡/卢森堡 3 地', '资产 vs 境内隔离', '多币种 (USD/HKD/SGD/EUR)', '无外汇管制', '全球投资便利', '与境内账户互通'],
  background: 'navy',
  ctaPrimary: { label: '离岸账户咨询', to: '/help' },
  overview: {
    description: '离岸账户是在中国大陆以外司法管辖区开立的银行账户。\n\nBankerOS 客户可在 3 大离岸金融中心开户：① 香港 (最方便 · 法律体系成熟 · 离大陆近);② 新加坡 (亚洲财富管理中心 · 政治稳定);③ 卢森堡 (欧洲基金重镇)。\n\n核心优势：① 资产配置全球化;② 不受外汇管制约束 (账户内自由换汇/转账);③ 海外投资便利 (美股/海外基金/海外保险)。',
    benchmark: '对标 HSBC HK Premier · DBS Singapore · UBS Luxembourg',
    params: [['可开户地', '香港 / 新加坡 / 卢森堡'], ['最低存款', '¥ 50 万等值'], ['账户类型', '个人 / 企业'], ['支持币种', '12 种主流'], ['年管理费', '免 (Premier 客户)'], ['与境内联动', 'Premier Global']],
  },
  features: [
    { icon: '🇭🇰', title: '香港账户', desc: '法律体系 + 税务优惠 · 大陆客户最方便选择' },
    { icon: '🇸🇬', title: '新加坡账户', desc: '亚洲财富中心 · 政治稳定 · 严格保密' },
    { icon: '🇱🇺', title: '卢森堡账户', desc: '欧洲基金重镇 · 投资欧债/欧基首选' },
    { icon: '🔄', title: '账户互通', desc: '与境内 BankerOS 账户实时联动' },
  ],
  useCases: [
    { persona: '海外投资客户', icon: '📊', scenario: '投资美股 / 海外基金 / 海外保险', benefit: '不受境内 $50K 购汇限额', example: '某客户离岸账户投美股 $200 万' },
    { persona: '资产隔离', icon: '🛡', scenario: '担心境内监管变化 · 资产分散', benefit: '资产受当地法律保护', example: '某高净值客户 30% 资产配香港离岸' },
  ],
  process: [
    { step: '01', actor: '客户', title: '资格审核', desc: 'Premier 客户 + 资产证明' },
    { step: '02', actor: '银行', title: '远程视频开户', desc: '香港/新加坡分行远程办理' },
    { step: '03', actor: '客户', title: '资金注入', desc: '通过 Premier Global 通道' },
    { step: '04', actor: '客户', title: '账户使用', desc: '与境内账户联动' },
  ],
  caseStudy: {
    company: '某科技公司创始人', logo: '💎', industry: '45 岁 · Jade 客户 · 海外资产配置',
    challenge: '希望配置 USD 资产抗汇率风险，但境内每年只能购汇 $50K，远不够。',
    solution: '在 BankerOS 香港分行开离岸账户 · 通过 Premier Global 合规通道注入资金 · 投资美股 + 美房 + 海外保险。',
    results: [{ metric: '配置规模', value: '$ 200 万' }, { metric: '美股年化', value: '+12%' }, { metric: '汇率风险分散', value: '40%' }, { metric: 'Jade 礼遇', value: '✓' }],
    quote: '离岸账户让我突破了境内购汇限额，真正实现全球资产配置。BankerOS Premier Global 让香港和上海账户像一个账户一样使用。',
    quoteAuthor: '某科技公司创始人',
  },
  faq: [
    { q: '离岸账户合规吗？', a: '完全合规。中国居民可合法持有海外账户，但需要按 CRS/FATCA 申报。BankerOS 协助申报。' },
    { q: '与境内账户的区别？', a: '境内：受外汇管制 ($50K 年限额) + 仅人民币为主。离岸：自由换汇 + 多币种 + 全球投资 + 通常更高利率。' },
  ],
  ctaTitle: '开启全球资产配置', ctaDesc: 'Premier 客户 · 3 地可选',
  ctaButton: { label: '离岸账户咨询', to: '/help' },
};

const studyAbroadCfg: ProductConfig = {
  breadcrumbs: [{ label: '全球与跨境' }, { label: '留学金融' }],
  category: 'Study Abroad Banking', productName: '留学金融',
  tagline: '学费汇款 · 留学贷款 · 海外开户 · 学生卡 · 一站式留学金融',
  badge: '5 大模块一站式',
  bullets: ['学费汇款免手续费', '留学贷款 0 利率 (与学校合作)', '海外开户陪同', '学生信用卡', '留学保险', '紧急援助 24/7'],
  background: 'navy',
  ctaPrimary: { label: '留学金融咨询', to: '/help' },
  overview: {
    description: 'BankerOS 留学金融为留学生家庭提供全方位金融服务。\n\n5 大模块：① 学费汇款 (与 200+ 海外名校直付);② 留学贷款 (与 50+ 学校合作 0 利率分期);③ 海外开户 (英美澳新港 学生账户);④ 学生信用卡 (免年费 + 海外消费返现);⑤ 留学保险 ($50K 医疗 + 紧急援助)。',
    benchmark: '对标 招行留学金融 · 工行学子 · HSBC Student',
    params: [['学费汇款', '免手续费'], ['留学贷款', '最高 ¥ 500 万 · 5.5% 起'], ['海外开户', '英 / 美 / 澳 / 新 / 港'], ['学生信用卡', '永久免年费'], ['留学保险', '$ 50K 医疗']],
  },
  features: [
    { icon: '🎓', title: '学费汇款', desc: '与 200+ 海外名校直付 · 免手续费 · 6 小时到账' },
    { icon: '💰', title: '留学贷款', desc: '与海外学校合作 · 0 利率分期 · 在读期间只还息' },
    { icon: '🏦', title: '海外开户陪同', desc: 'BankerOS 海外分行协助开本地账户' },
    { icon: '💳', title: '学生信用卡', desc: '永久免年费 + 海外消费 3% 返现' },
    { icon: '🛡', title: '留学保险', desc: '$50K 海外医疗 + 24/7 紧急援助' },
  ],
  useCases: [
    { persona: '美国留学家庭', icon: '🇺🇸', scenario: '子女赴美读本科/硕士', benefit: '一站式服务从汇款到开户', example: '某家庭子女赴 MIT · 学费 + 生活费一站搞定' },
    { persona: '英国留学家庭', icon: '🇬🇧', scenario: '子女赴英读硕士 (1 年制)', benefit: '学费 0 利率分期 · 减轻一次付清压力', example: '某家庭子女去剑桥 · £35K 学费分 12 期' },
  ],
  process: [
    { step: '01', actor: '家庭', title: '咨询', desc: '客户经理评估留学需求' },
    { step: '02', actor: '银行', title: '方案设计', desc: '汇款 + 贷款 + 海外开户 + 保险' },
    { step: '03', actor: '家庭', title: '签约', desc: '签订各项服务协议' },
    { step: '04', actor: '银行', title: '持续支持', desc: '留学期间 24/7 紧急援助' },
  ],
  caseStudy: {
    company: '王女士家庭 (儿子赴美 UCB)', logo: '🎓', industry: '45 岁 · 上海 · 儿子伯克利留学',
    challenge: '儿子被加州大学伯克利分校录取 · 学费 $50K/年 · 4 年共 $200K + 生活费 $80K = $280K · 家庭一次性付清压力大。',
    solution: 'BankerOS 留学金融组合：① 学费汇款 (免手续费);② 留学贷款 ¥100 万 (0 利率 12 期);③ 伯克利附近 Chase 银行账户开立;④ 学生信用卡 (海外消费 3% 返);⑤ $50K 医保。',
    results: [{ metric: '学费总额', value: '$ 200K' }, { metric: '汇款节省', value: '$ 8K' }, { metric: '贷款节省利息', value: '¥ 6 万' }, { metric: '4 年返现', value: '$ 2,400' }],
    quote: 'BankerOS 把留学的所有金融问题打包解决了。从汇款到保险，我们家长再也不用操心各种银行手续。',
    quoteAuthor: '王女士 · 留学家长',
  },
  ctaTitle: '为子女留学保驾护航', ctaDesc: '5 大模块一站式服务',
  ctaButton: { label: '留学金融咨询', to: '/help' },
};

const immigrationCfg: ProductConfig = {
  breadcrumbs: [{ label: '全球与跨境' }, { label: '移民/海外置业' }],
  category: 'Immigration & Overseas Property', productName: '移民/海外置业',
  tagline: '美/加/澳/葡 投资移民 · 海外按揭 · 资产配置 · 全程顾问',
  badge: 'Jade 客户专享',
  bullets: ['美 EB-5 ($800K)', '加 SUV ($175K)', '澳 188C ($5M)', '葡萄牙黄金签 (€280K)', '海外按揭 (60% LTV)', '律师 + 顾问全程'],
  background: 'navy',
  ctaPrimary: { label: '移民咨询', to: '/help' },
  overview: {
    description: '移民/海外置业是为高净值客户提供的境外身份规划 + 海外房产服务。\n\n主流项目：① 美国 EB-5 ($800K 投资移民 · 5 年获绿卡);② 加拿大 SUV ($17.5 万创新移民);③ 澳大利亚 188C ($500 万重大投资);④ 葡萄牙黄金签 (€28 万房产);⑤ 希腊黄金签 (€25 万房产)。\n\nBankerOS 提供：律师匹配 + 资金合规 + 海外按揭 + 子女教育 + 税务规划。',
    benchmark: '对标 招行私行海外配置 · 友邦移民 · HSBC International',
    params: [['美 EB-5 投资', '$ 800,000'], ['加 SUV', '$ 175,000'], ['澳 188C', '$ 5,000,000'], ['葡萄牙黄金签', '€ 280,000'], ['处理周期', '1-5 年'], ['海外按揭', '60% LTV']],
  },
  features: [
    { icon: '🇺🇸', title: '美 EB-5', desc: '投资 $80 万至区域中心 · 创造 10 个就业 · 5 年获绿卡' },
    { icon: '🇨🇦', title: '加 SUV', desc: '创新企业家移民 · 风投支持 · 快速获 PR' },
    { icon: '🇦🇺', title: '澳 188C', desc: '$500 万重大投资移民 · 4 年永居' },
    { icon: '🇵🇹', title: '葡萄牙黄金签', desc: '€ 28 万房产 · 5 年获欧盟身份' },
    { icon: '🏠', title: '海外按揭', desc: '60% LTV · 多币种贷款 · 当地律师协助' },
  ],
  useCases: [
    { persona: '子女教育', icon: '🎓', scenario: '想让子女享受海外教育', benefit: '本地学校 + 大学州内学费', example: '某家庭 EB-5 移民美 · 子女 UC 体系本州学费 (省 50%)' },
    { persona: '资产配置', icon: '💰', scenario: '希望资产分散海外 + 获身份', benefit: '一举多得 · 房产 + 身份 + 资产', example: '某客户葡萄牙买 €30 万房 · 获欧盟身份' },
  ],
  process: [
    { step: '01', actor: '客户', title: '咨询访谈', desc: '私人银行家 + 移民律师 1v1' },
    { step: '02', actor: '律师', title: '方案设计', desc: '匹配最优国家 + 项目' },
    { step: '03', actor: '客户', title: '签约付款', desc: '律师费 + 投资款' },
    { step: '04', actor: '律师', title: '申请处理', desc: '1-5 年获身份' },
  ],
  caseStudy: {
    company: '某深圳企业家家庭', logo: '🌍', industry: '50 岁 · 净资产 ¥3 亿 · 子女赴美求学',
    challenge: '希望全家移民美国 · 子女享受美国教育 + 配置美元资产。',
    solution: 'BankerOS 全程服务：① EB-5 $80 万投资 + $5 万律师费;② 配套美国房产 $200 万 (洛杉矶);③ 海外按揭 60% LTV;④ 美国券商账户;⑤ 4 年内获绿卡。',
    results: [{ metric: '总投入', value: '$ 350 万' }, { metric: '获身份时间', value: '4 年' }, { metric: '子女学费', value: '州内 (省 50%)' }, { metric: '房产年增值', value: '+ 6%' }],
    quote: 'BankerOS 不只是帮我们办移民，更帮我们规划了未来 10 年的全家生活。',
    quoteAuthor: '某深圳企业家',
  },
  ctaTitle: '开启海外身份之旅', ctaDesc: 'Jade 客户专享 · 律师全程',
  ctaButton: { label: '移民咨询', to: '/help' },
};

export const GlobalOffshore       = () => <ProductDetailLite {...offshoreCfg} />;
export const GlobalStudyAbroad    = () => <ProductDetailLite {...studyAbroadCfg} />;
export const GlobalImmigration    = () => <ProductDetailLite {...immigrationCfg} />;
