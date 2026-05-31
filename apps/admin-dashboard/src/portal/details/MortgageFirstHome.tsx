/**
 * Mortgage detail: First Home Loan
 * Benchmarked: HSBC Smart Mortgage / 招行家居贷
 */

import { useState } from 'react';
import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy, FaqAccordion, PricingTable,
} from '../ProductDetailPage';

function MortgageWidget() {
  const [house, setHouse] = useState(5_000_000);
  const [downPct, setDownPct] = useState(30);
  const [years, setYears] = useState(30);
  const rate = 4.05;

  const downPayment = house * downPct / 100;
  const loan = house - downPayment;
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const emi = loan * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalInterest = emi * n - loan;

  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 28, color: 'var(--p-text)' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 18 }}>📐 月供计算器</h3>

      {[
        { label: '房屋总价', val: house, set: setHouse, min: 1_000_000, max: 20_000_000, step: 100_000, fmt: (v: number) => `¥ ${(v/10000).toFixed(0)} 万` },
        { label: '首付比例', val: downPct, set: setDownPct, min: 30, max: 70, step: 5, fmt: (v: number) => `${v} %` },
        { label: '贷款期限', val: years, set: setYears, min: 5, max: 30, step: 1, fmt: (v: number) => `${v} 年` },
      ].map(s => (
        <div key={s.label} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--p-text-soft)' }}>{s.label}</span>
            <span style={{ fontWeight: 700, color: 'var(--p-navy)' }}>{s.fmt(s.val)}</span>
          </div>
          <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={(e) => s.set(+e.target.value)} style={{ width: '100%', accentColor: 'var(--p-red)' }} />
        </div>
      ))}

      <div style={{ background: 'var(--p-bg-section)', padding: 18, borderRadius: 8, marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>首付金额</span>
          <span style={{ fontWeight: 700, color: 'var(--p-navy)' }}>¥ {(downPayment / 10000).toFixed(1)} 万</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>贷款金额</span>
          <span style={{ fontWeight: 700, color: 'var(--p-navy)' }}>¥ {(loan / 10000).toFixed(1)} 万</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--p-border)', paddingTop: 10, marginTop: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>每月还款 (本息)</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--p-red)' }}>¥ {emi.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 6 }}>
          总利息 ¥ {(totalInterest / 10000).toFixed(0)} 万 · 利率 {rate}% (LPR-30bp 首套优惠)
        </div>
      </div>
    </div>
  );
}

export default function MortgageFirstHome() {
  return (
    <ProductDetailPage
      breadcrumbs={[
        { label: '个人银行', to: '/products/personal' },
        { label: '贷款服务', to: '/products/loans/personal' },
        { label: '首套房按揭' },
      ]}
      sections={[
        { id: 'overview',   label: '产品概述' },
        { id: 'features',   label: '核心优势' },
        { id: 'eligibility', label: '申请条件' },
        { id: 'usecases',   label: '适用人群' },
        { id: 'process',    label: '办理流程' },
        { id: 'case',       label: '客户案例' },
        { id: 'fees',       label: '费率说明' },
        { id: 'faq',        label: '常见问题' },
      ]}
      hero={{
        badge: '首套刚需客户专享 · LPR-30bp 优惠利率',
        category: 'First-Home Mortgage',
        productName: '首套房按揭贷款',
        tagline: '安居梦想 · 触手可及。BankerOS 为首次置业的您提供同业最优利率与最快放款服务。',
        bullets: [
          '利率低至 LPR-30bp = 4.05% (同业最低)',
          '首付低至 30%',
          '贷款期限最长 30 年',
          '在线预审 5 分钟出结果',
          '审批最快 3 个工作日',
          '提前还款无违约金',
        ],
        background: 'navy',
        ctaPrimary: { label: '在线预审 →', to: '/login' },
        ctaSecondary: { label: '咨询贷款经理', to: '/help' },
        visual: <MortgageWidget />,
      }}>

      {/* ───── Overview ───── */}
      <Sect id="overview" eyebrow="What is First-Home Mortgage" title="什么是首套房按揭贷款？">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <div>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 14 }}>
              <strong>首套房按揭贷款</strong> 是为<strong>首次购买住宅</strong>的客户提供的<strong>个人住房抵押贷款</strong>。
              客户以所购房屋作为<strong>抵押物</strong>，银行根据房屋评估价值的一定比例 (最高 70%) 提供长期贷款。
            </p>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 14 }}>
              根据中国人民银行规定，首套房贷款享受<strong>优惠利率</strong>（通常 LPR-20 到 LPR-30 个基点），
              比二套房利率低 50-100 bp。BankerOS 在 LPR 基础上提供<strong>同业最低 -30bp 减点</strong>，
              即 4.05% 年利率 (基于当前 5 年期 LPR 4.35%)。
            </p>

            <div style={{ background: 'rgba(34,197,94,0.05)', borderLeft: '4px solid var(--p-success)', padding: 16, borderRadius: 4 }}>
              <h4 style={{ fontWeight: 700, color: 'var(--p-success)', marginBottom: 8, fontSize: 14 }}>✓ 与公积金贷款的关系</h4>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', margin: 0, lineHeight: 1.6 }}>
                BankerOS 商业按揭可与<strong>住房公积金贷款</strong>组合使用 (称为"组合贷")。
                公积金贷款利率更低 (2.85%-3.25%) 但有限额。建议优先用足公积金额度，超出部分用商业贷。
              </p>
            </div>
          </div>

          <div style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>关键参数</h4>
            {[
              ['基准利率',    'LPR (5Y) = 4.35%'],
              ['BankerOS 利率', 'LPR - 30bp = 4.05%'],
              ['首付比例',    '最低 30%'],
              ['LTV (贷款比)', '最高 70%'],
              ['最低贷款额',  '¥ 100,000'],
              ['最高贷款额',  '¥ 20,000,000'],
              ['最长期限',    '30 年'],
              ['还款方式',    '等额本息/等额本金'],
              ['提前还款',    '无违约金'],
              ['审批时长',    '3-7 个工作日'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-border)', fontSize: 13 }}>
                <span style={{ color: 'var(--p-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--p-navy)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      {/* ───── Features ───── */}
      <Sect id="features" alt eyebrow="Why Choose Us" title="为什么选择 BankerOS 首套房按揭">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '💰', title: '同业最低利率', desc: 'LPR-30bp 优惠利率，30 年贷款累计节省利息约 ¥80 万 (基于 ¥350 万贷款)' },
            { icon: '⚡', title: '极速审批',     desc: '在线预审 5 分钟出结果，正式审批 3-7 工作日。同业平均 14 天' },
            { icon: '🎁', title: '无隐藏费用',   desc: '免账户管理费 · 免提前还款违约金 · 免抵押登记费 (BankerOS 代办)' },
            { icon: '📱', title: 'App 全程管理', desc: '在线申请 · 实时进度查询 · 自动还款 · 月度还款提醒 · 还款表导出' },
            { icon: '🤝', title: '专属客户经理', desc: '审批通过即配置专属客户经理，购房 + 装修 + 保险一站式服务' },
            { icon: '🔄', title: '灵活组合贷',   desc: '与公积金贷款无缝组合，优先用足公积金额度，最大化降低成本' },
          ].map(f => (
            <div key={f.title} style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{f.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Sect>

      {/* ───── Eligibility ───── */}
      <Sect id="eligibility" eyebrow="Eligibility" title="申请条件">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14 }}>✅ 借款人要求</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                '年龄 22-65 周岁 (本息还清时不超过 70 周岁)',
                '本市户籍或具有合法居留证件',
                '稳定的工作和收入来源 (在职满 6 个月)',
                '月收入 ≥ 月供 × 2 倍',
                '征信无 M3 以上严重逾期记录',
                '名下无其他银行未结清按揭 (定义首套)',
              ].map(c => (
                <li key={c} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--p-border-soft)', fontSize: 13 }}>
                  <span style={{ color: 'var(--p-success)', flexShrink: 0 }}>✓</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14 }}>🏠 房屋要求</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                '城市规划区内合法商品房 (含一手/二手)',
                '已取得不动产权证 (二手房) 或预售许可证',
                '建筑年限不超过 25 年 (一手房不限)',
                '可办理产权过户和抵押登记',
                '位于 BankerOS 评估认可的地段',
                '房屋评估价值 ≥ 100 万元',
              ].map(c => (
                <li key={c} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--p-border-soft)', fontSize: 13 }}>
                  <span style={{ color: 'var(--p-success)', flexShrink: 0 }}>✓</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 20, background: 'rgba(245,158,11,0.08)', borderLeft: '4px solid var(--p-warn)', borderRadius: 4 }}>
          <h4 style={{ fontWeight: 700, color: 'var(--p-warn)', marginBottom: 8, fontSize: 14 }}>⚠️ 关于"首套"定义</h4>
          <p style={{ fontSize: 13, color: 'var(--p-text-soft)', margin: 0, lineHeight: 1.6 }}>
            "首套房"的认定以家庭为单位（夫妻 + 未成年子女），全国住房贷款数据互通。
            如您在<strong>其他城市</strong>有过商业按揭记录（即使已结清），通常不属于首套。
            建议提前查询中国人民银行个人征信报告确认。
          </p>
        </div>
      </Sect>

      {/* ───── Use Cases ───── */}
      <Sect id="usecases" alt eyebrow="Who's It For" title="谁最适合首套房按揭">
        <UseCaseGrid items={[
          { persona: '刚毕业 1-3 年职场新人', icon: '🎓',
            scenario: '攒够首付 (¥80-150 万) · 月薪 ¥1.5-3 万 · 一线 / 新一线城市购小户型',
            benefit: '低利率减轻 30 年月供压力',
            example: '小赵 28 岁 · 上海月薪 ¥2 万 · 购 ¥350 万小三房 · 月供 ¥12,500' },
          { persona: '婚育期 30+ 家庭', icon: '👨‍👩‍👧',
            scenario: '夫妻合并收入 ¥30K+ · 准备结婚或子女入学 · 购改善型住房',
            benefit: '组合贷最大化降本',
            example: '王先生夫妇 · 双职工 · 购 ¥800 万学区房 · 公积金 + 商贷组合' },
          { persona: '一线流动青年', icon: '✈️',
            scenario: '在 BJ/SH/SZ/GZ 工作但户籍在外地 · 需要居留证 + 社保 5 年',
            benefit: '不限户籍，符合条件即可贷',
            example: '上海工作的杭州青年 · 缴满 5 年社保 · 凭居留证申请按揭' },
          { persona: '高净值海外华人', icon: '🌏',
            scenario: '在国内购置投资性住宅或父母养老房 · 资产证明充分',
            benefit: '可申请离岸账户配套服务',
            example: 'HSBC 香港 Premier 客户 · 上海购房 · 离岸资产证明合规' },
          { persona: '二孩家庭改善', icon: '🏘',
            scenario: '原有住房太小 · 卖小换大 · 老房还清后归入"首套"待遇',
            benefit: '认贷不认房政策下享受首套利率',
            example: '上海原有 60㎡ · 卖出还贷后购 120㎡ · 重新享首套优惠' },
          { persona: '县城/小城市刚需', icon: '🏡',
            scenario: '老家购房养老或子女教育 · 房价 50-200 万',
            benefit: '低首付低月供，无负担置业',
            example: '三线城市 ¥120 万住房 · 首付 30% · 月供 ¥4,200' },
        ]} />
      </Sect>

      {/* ───── Process ───── */}
      <Sect id="process" eyebrow="How It Works" title="办理流程">
        <ProcessFlow steps={[
          { step: '01', actor: '客户',     title: '在线预审',     desc: '5 分钟填表 · 立即获预审额度' },
          { step: '02', actor: '客户',     title: '签购房合同',  desc: '与开发商/卖家签订《商品房买卖合同》' },
          { step: '03', actor: '客户',     title: '提交资料',    desc: '身份证 · 收入证明 · 征信报告 · 购房合同' },
          { step: '04', actor: '银行',     title: '面签 + 评估', desc: '客户面签 · 第三方评估房屋价值' },
          { step: '05', actor: '银行',     title: '审批授信',    desc: '风控审批 · 3-7 个工作日' },
          { step: '06', actor: '客户',     title: '抵押登记',    desc: '不动产中心办理抵押 (BankerOS 代办)' },
          { step: '07', actor: '银行',     title: '放款入账',    desc: '资金划至开发商/卖家账户' },
          { step: '08', actor: '客户',     title: '按月还款',    desc: '次月起按月还款 · App 自动扣款' },
        ]} />
      </Sect>

      {/* ───── Case ───── */}
      <Sect id="case" alt eyebrow="Customer Story" title="客户故事">
        <CaseStudy
          company="刘先生 (互联网产品经理) + 张女士 (会计)"
          logo="🏠"
          industry="32 岁 + 30 岁 · 上海双职工 · 双方公积金合计 ¥6,000/月"
          challenge="夫妇俩工作 6 年攒下 ¥150 万首付，看中浦东 ¥500 万的 95㎡ 三房。需要贷款 ¥350 万，但他们也希望充分利用公积金，且月供不超过家庭收入 50% (合计 ¥3.5 万)。"
          solution="BankerOS 设计组合贷方案：① 公积金贷款 ¥120 万 (利率 3.25%)；② BankerOS 首套商业贷 ¥230 万 (利率 LPR-30bp = 4.05%)；③ 30 年期等额本息；④ 配套生命安全险，月供从工资卡自动扣款。"
          results={[
            { metric: '总月供', value: '¥ 16,840' },
            { metric: '占家庭收入', value: '48%' },
            { metric: '比纯商贷省利息', value: '¥ 23 万' },
            { metric: '审批用时', value: '5 天' },
          ]}
          quote="原本以为买房要拖好几年，结果 BankerOS 5 个工作日就批了贷款，比同业快了一倍。客户经理建议的组合贷方案让我们 30 年省下 20 多万利息。"
          quoteAuthor="刘先生 · 浦东购房客户"
        />
      </Sect>

      {/* ───── Fees ───── */}
      <Sect id="fees" eyebrow="Pricing" title="费率说明">
        <PricingTable fees={[
          { item: '贷款利率',  amount: 'LPR - 30bp', note: '当前 4.05% · 与 5Y LPR 浮动' },
          { item: '提前还款手续费', amount: '免', note: '同业通常收 1-3 个月利息' },
          { item: '抵押评估费', amount: '¥ 800-3,000', note: '由独立评估机构收取 · BankerOS 不收手续费' },
          { item: '抵押登记费', amount: '免', note: 'BankerOS 全程代办' },
          { item: '账户管理费', amount: '免', note: '同业通常 0.05%/月' },
          { item: '保险费',     amount: '约 0.05% × 贷款额', note: '生命安全险 · 自愿购买' },
          { item: '违约罚息', amount: '利率 × 1.5', note: '月供逾期 30 天起' },
          { item: '资料复印费', amount: '免', note: 'BankerOS 承担' },
        ]} />
      </Sect>

      {/* ───── FAQ ───── */}
      <Sect id="faq" alt eyebrow="FAQ" title="常见问题">
        <FaqAccordion items={[
          { q: '首套房和二套房怎么界定？', a: '以家庭为单位 (夫妻 + 未成年子女)，看是否曾有住房按揭记录 ("认贷不认房")。无论是否名下有房，只要没有过按揭即按首套。在其他城市贷过即使结清也算二套。' },
          { q: '能否中途调整月供金额？', a: '可以。每月还款超过最低额视为提前还款，自动减少本金。也可申请"缩短期限"或"减少月供"两种调整方式 (1 年只能调一次)。' },
          { q: '利率会随 LPR 变动吗？', a: '每年 1 月 1 日按上年 12 月 LPR 重定价。例如 LPR 上涨 25bp，您的利率从 4.05% 涨至 4.30%。可申请固定利率 (但通常更高)。' },
          { q: '能用海外收入证明吗？', a: '可以。需提供海外银行流水 + 雇主证明 + 完税证明。汇率换算按中国人民银行牌价。BankerOS Premier 客户的海外资产可作为补充证明。' },
          { q: '如果失业怎么办？', a: '主动联系银行可申请：① 短期 (3-6 月) 暂缓还本只还息；② 延长贷款期限；③ 与 BankerOS 协商个性化方案。切勿断供，否则会上征信影响所有银行业务。' },
          { q: '能提前一次性还清吗？', a: '可以。提前提交申请，5 个工作日内办理，无违约金。还清后 7 个工作日内办理解除抵押。' },
        ]} />
      </Sect>

      <section className="p-section" style={{ background: 'var(--p-navy)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>实现安居梦</h2>
          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28 }}>同业最低利率 · 5 分钟在线预审 · 3 天极速放款</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/login" className="p-btn" style={{ background: '#ffba00', color: '#000', padding: '14px 36px', fontWeight: 700, fontSize: 14 }}>在线预审 →</a>
            <a href="/help" className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white', padding: '14px 36px', fontSize: 14 }}>咨询贷款经理</a>
          </div>
        </div>
      </section>
    </ProductDetailPage>
  );
}
