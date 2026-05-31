import { useState } from 'react';
import ProductPage, { Section, SectionHeader, FeatureGrid, BenefitList, CtaBanner } from '../ProductPage';

// ─────────────────────────────────────────────────────────────────
// Generic loan page used by /loans/mortgage /loans/personal /loans/auto
// ─────────────────────────────────────────────────────────────────

function MortgageCalculator() {
  const [principal, setPrincipal] = useState(3_000_000);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(4.05);
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalInterest = emi * n - principal;

  return (
    <div style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 10, padding: 28 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6 }}>住房按揭计算器</h3>
      <p style={{ fontSize: 12, color: 'var(--p-text-muted)', marginBottom: 20 }}>实时调整参数，立即看到月供与总利息</p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--p-text-soft)' }}>贷款总额</span>
          <span style={{ fontWeight: 700, color: 'var(--p-navy)' }}>¥ {(principal / 10000).toFixed(0)} 万</span>
        </div>
        <input type="range" min="500000" max="20000000" step="100000" value={principal} onChange={(e) => setPrincipal(+e.target.value)} style={{ width: '100%', accentColor: 'var(--p-red)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--p-text-muted)', marginTop: 4 }}>
          <span>50 万</span><span>2000 万</span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--p-text-soft)' }}>贷款期限</span>
          <span style={{ fontWeight: 700, color: 'var(--p-navy)' }}>{years} 年</span>
        </div>
        <input type="range" min="5" max="30" step="1" value={years} onChange={(e) => setYears(+e.target.value)} style={{ width: '100%', accentColor: 'var(--p-red)' }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--p-text-soft)' }}>年利率</span>
          <span style={{ fontWeight: 700, color: 'var(--p-navy)' }}>{rate.toFixed(2)} %</span>
        </div>
        <input type="range" min="2" max="8" step="0.05" value={rate} onChange={(e) => setRate(+e.target.value)} style={{ width: '100%', accentColor: 'var(--p-red)' }} />
        <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 4 }}>当前优惠利率 LPR-30bp = 4.05%</div>
      </div>

      <div style={{ background: 'var(--p-bg-section)', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>每月还款</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--p-red)' }}>¥ {emi.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--p-text-muted)' }}>
          <span>总利息支出: ¥ {(totalInterest / 10000).toFixed(1)} 万</span>
          <span>本息合计: ¥ {((emi * n) / 10000).toFixed(1)} 万</span>
        </div>
      </div>
    </div>
  );
}

export function Mortgage() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务', to: '/products/loans/personal' }, { label: '住房贷款' }]}
      hero={{
        eyebrow: 'Home Mortgage',
        title: <>购房梦想，<br /><span className="accent">从此触手可及</span></>,
        subtitle: '首套房利率低至 LPR-30bp · 最长 30 年期限 · 在线预审 5 分钟出结果 · 房款 70% 可贷',
        ctaPrimary: { label: '在线预审 →', to: '/login' },
        ctaSecondary: { label: '咨询贷款经理', to: '/help' },
        side: <MortgageCalculator />,
      }}>
      <Section>
        <SectionHeader eyebrow="Mortgage Products" title="3 款按揭方案 · 点击查看详情" subtitle="无论首套、二套、海外，总有一款适合您" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { type: '🏠 首套房按揭',   rate: 'LPR - 30bp', maxLtv: '最高 70% 房款', term: '最长 30 年', perks: ['首付低至 30%', '审批最快 3 天', '提前还款无违约金', '可与公积金组合贷'], to: '/products/loans/mortgage/first-home' },
            { type: '🏡 二套房按揭',   rate: 'LPR + 60bp', maxLtv: '最高 60% 房款', term: '最长 25 年', perks: ['首付 40%+', '可使用房屋抵押再融资', '支持改善型置换', '与现有按揭联动审批'], to: '/products/loans/mortgage/second-home' },
            { type: '🌍 海外房产按揭', rate: '4.5% - 5.5%', maxLtv: '最高 60% 房款', term: '最长 25 年', perks: ['英美/澳新/港澳房产', '多币种贷款 (USD/GBP/AUD)', '当地律师协助', '海外保险一站式'], to: '/products/loans/mortgage/overseas' },
          ].map(p => (
            <a key={p.type} href={p.to}
              style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 10, padding: 28, textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>{p.type}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20, padding: '14px 0', borderTop: '1px solid var(--p-border)', borderBottom: '1px solid var(--p-border)' }}>
                <div><div style={{ fontSize: 10, color: 'var(--p-text-muted)', marginBottom: 2 }}>利率</div><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--p-red)' }}>{p.rate}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--p-text-muted)', marginBottom: 2 }}>额度</div><div style={{ fontSize: 13, fontWeight: 700 }}>{p.maxLtv}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--p-text-muted)', marginBottom: 2 }}>期限</div><div style={{ fontSize: 13, fontWeight: 700 }}>{p.term}</div></div>
              </div>
              <BenefitList items={p.perks} />
              <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: 'var(--p-red)', textTransform: 'uppercase' }}>查看详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Application Process" title="4 步轻松申请按揭" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { step: '①', title: '在线预审', desc: '填写基本信息 5 分钟，立即获得预审额度' },
            { step: '②', title: '提交资料', desc: '上传身份证 + 收入证明 + 房屋信息' },
            { step: '③', title: '银行审批', desc: '专员核查 + 抵押物评估 3-7 个工作日' },
            { step: '④', title: '放款入账', desc: '签约后 3 个工作日放款至开发商' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 40, color: 'var(--p-red)', fontWeight: 800, marginBottom: 10 }}>{s.step}</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6, fontSize: 16 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--p-text-soft)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner title="预约贷款专员，一对一咨询" desc="在线提交需求，30 分钟内获得资深贷款经理联系"
        primaryCta={{ label: '在线预审 →', to: '/login' }} secondaryCta={{ label: '电话咨询 95588', to: '/help' }} />
    </ProductPage>
  );
}

export function PersonalLoan() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '个人银行', to: '/products/personal' }, { label: '贷款服务' }, { label: '个人消费贷' }]}
      hero={{
        eyebrow: 'Personal Loan',
        title: <>当下所需，<br /><span className="accent">即刻满足</span></>,
        subtitle: '在线申请 · 8 分钟放款 · 最高 100 万元 · 期限 6-60 个月 · 利率最低 6.50% 起',
        ctaPrimary: { label: '立即申请 →', to: '/login' },
        background: 'red',
      }}>
      <Section>
        <SectionHeader eyebrow="Loan Products" title="6 款个人贷款产品 · 点击查看详情" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '⚡', title: '闪贷',   desc: '极速放款 · 最快 8 分钟到账 · 最高 30 万 · 利率 7.20% 起',  to: '/products/loans/flash' },
            { icon: '🎓', title: '教育贷', desc: '在职进修/MBA/海外留学 · 最高 50 万 · 期限最长 8 年',       to: '/products/loans/education' },
            { icon: '💍', title: '婚庆贷', desc: '婚礼/蜜月一站式 · 最高 50 万 · 期限 1-3 年',             to: '/products/loans/wedding' },
            { icon: '🏥', title: '医疗贷', desc: '医美/重大手术/海外就医 · 最高 100 万 · 利率优惠',         to: '/products/loans/medical' },
            { icon: '🎨', title: '装修贷', desc: '新房/二手房装修 · 最高 100 万 · 期限 1-5 年',            to: '/products/loans/renovation' },
            { icon: '💼', title: '经营贷', desc: '小微企业主/个体工商户 · 最高 500 万 · 抵押/信用可选',    to: '/products/loans/business-owner' },
          ].map(p => (
            <a key={p.title} href={p.to}
              style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 28, textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div className="p-product-icon" style={{ marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{p.desc}</p>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--p-red)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>查看详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Why Choose Us" title="为什么选择 BankerOS 消费贷" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <div style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>✓ 极速审批，8 分钟放款</h3>
            <BenefitList items={['AI 自动审批引擎，免人工排队', '与征信中心/社保/公积金数据直连', '无需到访分行，全程线上', '7×24 小时可随时申请']} />
          </div>
          <div style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>✓ 灵活还款，自由提前</h3>
            <BenefitList items={['等额本息 / 先息后本 / 按月付息一次还本 三种方式', '随借随还，按日计息', '提前还款无违约金', '余额不足自动从签约账户扣款']} />
          </div>
        </div>
      </Section>

      <CtaBanner title="今天申请，今天到账" desc="无需抵押 · 无需担保 · 全程线上 · 资金灵活使用"
        primaryCta={{ label: '立即申请 →', to: '/login' }} bg="red" />
    </ProductPage>
  );
}
