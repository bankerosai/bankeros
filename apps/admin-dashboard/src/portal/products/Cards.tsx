import { Link } from 'react-router-dom';
import ProductPage, { Section, SectionHeader, FeatureGrid, CtaBanner } from '../ProductPage';

const CARDS = [
  { name: '环球白金信用卡', sub: 'World Elite Platinum', annualFee: '¥ 3,600', creditLimit: 'up to ¥ 5,000,000', color: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)', accent: '#ffba00', tier: '顶级',
    detailLink: '/products/cards/world-elite',
    perks: ['全球高端机场休息室无限次 (LoungeKey)', '12 倍消费积分 · 兑换 50+ 航空里程', 'Concierge 礼宾服务 24/7', '全球高端医疗保险 $500K', '高尔夫 30 次/年', '免费海外紧急现金支援'],
    suitable: '海外旅行频繁的高净值客户 · 年消费 50 万+' },
  { name: '环球商旅卡', sub: 'Global Travel Card', annualFee: '¥ 1,800', creditLimit: 'up to ¥ 1,000,000', color: 'linear-gradient(135deg, #002966 0%, #001838 100%)', accent: '#06b6d4', tier: '白金',
    detailLink: '/products/cards/travel',
    perks: ['海外消费返现 3% · 国内 2%', '机场休息室 12 次/年', '商务舱升舱折扣', '酒店金卡会员资格 (IHG/Marriott)', '免费境外医疗保险 $200K', 'WiFi 全球免费 1GB/月'],
    suitable: '经常出差的商务人士 · 海外消费 20 万+/年' },
  { name: '财富金卡', sub: 'Wealth Gold Card', annualFee: '¥ 800', creditLimit: 'up to ¥ 500,000', color: 'linear-gradient(135deg, #b8860b 0%, #8b6914 100%)', accent: '#ffba00', tier: '金卡',
    detailLink: '/products/cards/gold',
    perks: ['基础消费 5 倍积分', '机场休息室 4 次/年', '加油返现 2%', '餐饮消费返现 5%', '电影/演出门票 8 折', '免费基础旅游保险'],
    suitable: '中产客户日常消费首选 · 年消费 5-20 万' },
  { name: '联名信用卡', sub: 'Co-Branded Cards', annualFee: '首年免年费', creditLimit: 'up to ¥ 300,000', color: 'linear-gradient(135deg, #db0011 0%, #8b0000 100%)', accent: '#ffba00', tier: '联名',
    detailLink: '/products/cards/cobranded',
    perks: ['航空公司里程 1:1 自动转换', '酒店积分双重累积', '加油站合作返现 5%', '电商平台合作 5% 返现', '专属客户日活动', '生日月双倍积分'],
    suitable: '航空/酒店/购物专精用户' },
  { name: '环球青年卡', sub: 'Young Adult Card', annualFee: '永久免年费', creditLimit: 'up to ¥ 50,000', color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', accent: '#ffba00', tier: '学生',
    detailLink: '/products/cards/young',
    perks: ['18-30 岁专属', '永久免年费', '海外留学消费返现 3%', '学费分期 0 利率', '免费学生医疗保险', '校园活动专属优惠'],
    suitable: '在校学生 · 应届毕业生' },
  { name: '商务采购卡', sub: 'Corporate Purchasing Card', annualFee: '按需定制', creditLimit: 'up to ¥ 10,000,000', color: 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 100%)', accent: '#ffba00', tier: '企业',
    detailLink: '/products/cards/corporate-purchasing',
    perks: ['企业采购集中支付', '详细分类对账报表', '员工卡多级权限', '与 ERP 系统直连', '增值税电子发票自动归档', '采购数据分析仪表盘'],
    suitable: '中小企业及大型企业财务部' },
];

export default function Cards() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '个人银行', to: '/products/personal' }, { label: '信用卡' }]}
      hero={{
        eyebrow: 'Credit Cards',
        title: <>BankerOS<br /><span className="accent">信用卡家族</span></>,
        subtitle: '从入门青年卡到环球白金，6 款精心设计的信用卡，匹配您人生每个阶段的消费需求。',
        ctaPrimary: { label: '在线申请 →', to: '/login?action=open' },
        ctaSecondary: { label: '权益对比', to: '#compare' },
        background: 'gradient',
      }}>
      <Section>
        <SectionHeader eyebrow="Card Lineup" title="6 款信用卡，1 张满足所有需求" subtitle="对标 HSBC Premier MasterCard / 招行 AE 白 / 工行白金" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {CARDS.map(c => (
            <div key={c.name} style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 12, overflow: 'hidden', transition: 'all 0.25s' }}>
              {/* Card visual */}
              <div style={{ height: 200, background: c.color, padding: 22, color: 'white', position: 'relative' }}>
                <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase' }}>BankerOS</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{c.sub}</div>
                <div style={{ position: 'absolute', top: 22, right: 22, fontSize: 24, color: c.accent }}>{c.tier === '顶级' ? '👑' : c.tier === '白金' ? '◆' : c.tier === '金卡' ? '★' : '●'}</div>
                <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22 }}>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.15em', opacity: 0.85 }}>•••• •••• •••• 8801</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 9, opacity: 0.7 }}>
                    <span>{c.tier === '学生' ? '青年专享' : c.tier === '企业' ? '企业卡' : '环球通用'}</span>
                    <span>VISA / MasterCard / 银联</span>
                  </div>
                </div>
              </div>

              {/* Card details */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>年费</div>
                    <div style={{ fontWeight: 700, color: c.tier === '学生' ? 'var(--p-success)' : 'var(--p-navy)' }}>{c.annualFee}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>最高额度</div>
                    <div style={{ fontWeight: 700, color: 'var(--p-text)', fontSize: 13 }}>{c.creditLimit}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--p-text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>专属权益</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {c.perks.slice(0, 4).map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6, fontSize: 12, color: 'var(--p-text-soft)' }}>
                        <span style={{ color: c.accent, flexShrink: 0 }}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '8px 12px', background: 'var(--p-bg-section)', borderRadius: 4, fontSize: 11, color: 'var(--p-text-muted)', marginBottom: 14 }}>
                  💡 适合: {c.suitable}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={c.detailLink} className="p-btn p-btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: 12 }}>
                    产品详情 →
                  </Link>
                  <Link to="/login?action=open" className="p-btn p-btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: 12 }}>立即申请</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Feature Comparison" title="信用卡权益对比表" />
        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--p-bg-section)' }}>
                <th style={{ padding: 14, textAlign: 'left', fontWeight: 700, color: 'var(--p-navy)' }}>权益项目</th>
                {['白金', '商旅', '金卡', '联名', '青年'].map(t => (
                  <th key={t} style={{ padding: 14, textAlign: 'center', fontWeight: 700, color: 'var(--p-navy)' }}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['年费',                  '¥3,600', '¥1,800', '¥800',   '首年免', '永久免'],
                ['基础积分',              '12 倍',  '5 倍',   '5 倍',   '3 倍',   '1 倍'],
                ['海外消费返现',          '✅',     '✅ 3%',  '—',       '—',     '✅ 3%'],
                ['机场休息室 (次/年)',     '无限',   '12',     '4',       '—',     '—'],
                ['境外医疗保险',          '$500K',  '$200K',  '基础',   '—',     '$50K'],
                ['礼宾服务',              '24/7',   '工作日', '—',       '—',     '—'],
                ['高尔夫预订',            '30 次',  '12 次',  '—',       '—',     '—'],
                ['加油返现',              '—',     '—',       '2%',      '5%',    '—'],
                ['学费分期',              '—',     '—',       '—',       '—',     '✅ 0%'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--p-border-soft)' }}>
                  <td style={{ padding: 12, fontWeight: 600, color: 'var(--p-text)' }}>{row[0]}</td>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} style={{ padding: 12, textAlign: 'center', color: cell === '—' ? 'var(--p-text-muted)' : 'var(--p-text-soft)' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Rewards Program" title="积分商城与里程兑换" subtitle="积分 = 积分 × 价值 · 您的每一笔消费都将累积价值" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { icon: '✈️', title: '航空里程', desc: '50+ 航司里程兑换 · 国航/南航/东航/HKExpress/Singapore/Cathay/Emirates/Qatar' },
            { icon: '🏨', title: '酒店住宿', desc: 'IHG/Marriott/Hilton/Hyatt 等高端酒店积分兑换免费住宿' },
            { icon: '🎁', title: '商品兑换', desc: '5000+ 件精选商品 · 苹果/索尼/戴森/科颜氏' },
            { icon: '🎫', title: '生活体验', desc: '高端餐厅/SPA/演唱会/赛事门票兑换' },
          ].map(r => (
            <div key={r.title} style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner title="不知道选哪张卡？" desc="使用 AI 卡片推荐器，回答 3 个问题即可获得最适合您的信用卡"
        primaryCta={{ label: '智能推荐 →', to: '/help' }}
        secondaryCta={{ label: '在线申请', to: '/login?action=open' }} />
    </ProductPage>
  );
}
