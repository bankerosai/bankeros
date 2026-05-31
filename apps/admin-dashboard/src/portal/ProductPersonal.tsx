import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';

const FEATURES = [
  { icon: '💳', title: '一卡通多币种账户', to: '/products/accounts/all-in-one', items: ['USD/EUR/GBP/JPY/HKD/SGD 等 12 种货币', '全球 ATM 取现免手续费', '账户管理费全免', '7×24 小时实时换汇'] },
  { icon: '📱', title: '移动银行 App',     to: '/products/payments',           items: ['指纹/FaceID 一键登录', '生物识别交易授权', '语音助手智能客服', '富电子凭证防伪'] },
  { icon: '🛡', title: '存款保障',         to: '/products/savings/certificate', items: ['存款保险条例保障最高 50 万元/账户', '24×7 反欺诈监控引擎', '可疑交易实时短信预警', '一键挂失冻结'] },
  { icon: '✈️', title: '环球贵宾服务',     to: '/products/wealth/premier',     items: ['全球 100+ 国家分行可办业务', '海外紧急现金/卡片补办', '航班延误险/全球医疗险', '机场 VIP 休息室'] },
];

const CARDS = [
  { name: '钻石卡 Diamond',  annualFee: '年费 ¥1,800', perks: '8倍积分 · 60次机场休息室 · 全球医疗保险',     color: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)', to: '/products/cards/world-elite' },
  { name: '白金卡 Platinum', annualFee: '年费 ¥600',   perks: '5倍积分 · 12次机场休息室 · 高尔夫预订',       color: 'linear-gradient(135deg, #002966, #001838)', to: '/products/cards/travel' },
  { name: '金卡 Gold',       annualFee: '年费 ¥200',   perks: '3倍积分 · 4次机场休息室 · 海外消费返现',      color: 'linear-gradient(135deg, #b8860b, #8b6914)', to: '/products/cards/gold' },
  { name: '普卡 Classic',    annualFee: '首年免年费',  perks: '1倍积分 · 在线消费返现 · 分期免息',          color: 'linear-gradient(135deg, #8b0000, #5a0000)', to: '/products/cards/young' },
];

export default function ProductPersonal() {
  return (
    <PortalLayout>
      {/* Hero */}
      <section className="p-hero" style={{ padding: '60px 48px' }}>
        <div className="p-hero-inner" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 12 }}>
              Personal Banking
            </div>
            <h1 className="p-hero-title" style={{ fontSize: 42 }}>
              一个账户，<br />
              <span className="accent">管理您的全球财富</span>
            </h1>
            <p className="p-hero-subtitle">
              在线 8 分钟开户，全球 100+ 国家通行使用。 集存款、汇款、外汇、理财、贷款于一体的智能账户。
            </p>
            <div className="p-hero-ctas">
              <Link to="/login?action=open" className="p-btn p-btn-primary">在线开户 →</Link>
              <Link to="/login?type=personal" className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white' }}>
                我已是客户，登录
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="p-section">
        <div className="p-section-inner">
          <div className="p-section-header">
            <div className="p-section-eyebrow">Account Features</div>
            <h2 className="p-section-title">为什么选择 BankerOS 个人账户</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {FEATURES.map(f => (
              <Link key={f.title} to={f.to}
                style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 32, textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="p-product-icon" style={{ marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14 }}>{f.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {f.items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 14, color: 'var(--p-text-soft)' }}>
                      <span style={{ color: 'var(--p-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: 'var(--p-red)' }}>查看详情 →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="p-section" style={{ background: 'var(--p-bg-section)' }}>
        <div className="p-section-inner">
          <div className="p-section-header">
            <div className="p-section-eyebrow">Credit Cards</div>
            <h2 className="p-section-title">BankerOS 信用卡家族</h2>
            <p className="p-section-subtitle">从入门级到顶级私享，总有一张适合您</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {CARDS.map(c => (
              <Link key={c.name} to={c.to}
                style={{ borderRadius: 12, overflow: 'hidden', background: 'white', border: '1px solid var(--p-border)', transition: 'all 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
                onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ height: 180, background: c.color, padding: 24, color: 'white', position: 'relative' }}>
                  <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.12em', textTransform: 'uppercase' }}>BankerOS</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
                  <div style={{ position: 'absolute', bottom: 24, left: 24, fontSize: 13, fontFamily: 'monospace', letterSpacing: '0.15em', opacity: 0.85 }}>
                    •••• •••• •••• ••••
                  </div>
                  <div style={{ position: 'absolute', top: 24, right: 24, fontSize: 22, fontWeight: 800, color: '#ffba00' }}>★</div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 12, color: 'var(--p-text-muted)', marginBottom: 8 }}>{c.annualFee}</div>
                  <div style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.5, marginBottom: 16, minHeight: 60 }}>
                    {c.perks}
                  </div>
                  <div className="p-btn p-btn-secondary" style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}>查看详情 →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Now CTA */}
      <section className="p-section" style={{ background: 'var(--p-navy)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>立即开始</h2>
          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28 }}>
            只需身份证 + 手机号 + 一张人像照片，8 分钟完成开户
          </p>
          <Link to="/login?action=open" className="p-btn p-btn-primary" style={{ padding: '14px 36px', fontSize: 16 }}>
            在线开户 — 8 分钟搞定 →
          </Link>
        </div>
      </section>
    </PortalLayout>
  );
}
