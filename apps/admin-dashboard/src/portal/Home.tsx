import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';

const PRODUCTS = [
  { icon: '💳', title: '一卡通账户',     desc: '一张卡片管理多币种存款、消费与投资，全球 ATM 取现免手续费', link: '/products/accounts/all-in-one' },
  { icon: '🏠', title: '住房按揭贷款',   desc: '首套房利率低至 LPR-30bp，最长 30 年期限，在线预审 5 分钟出结果', link: '/products/loans/mortgage/first-home' },
  { icon: '📈', title: '智能投顾',       desc: 'AI 驱动的全球资产配置，最低 10,000 元起投，专属理财顾问 1v1',     link: '/products/wealth/robo-advisor/details' },
  { icon: '🌍', title: '跨境汇款',       desc: '6 小时到账全球 100+ 国家，汇率优于市场 80%，单笔最高 $200K',     link: '/products/global/remittance' },
  { icon: '🏢', title: '企业现金管理',   desc: '集团多账户实时归集，跨境资金池调配，自动化对账',                     link: '/products/business/cash-management/pool-details' },
  { icon: '🚢', title: '贸易融资',       desc: '信用证开立、保函发行、出口押汇，覆盖全球 60+ 主要贸易港',           link: '/products/business/trade-finance/lc-details' },
];

const NEWS = [
  { date: '2026-05-29', tag: '公告', title: 'BankerOS 获巴塞尔银行监管委员会 BCBS 239 数据治理认证' },
  { date: '2026-05-22', tag: '产品',  title: '推出多币种数字账户，支持 USD/EUR/GBP/JPY/CNH 等 12 种货币' },
  { date: '2026-05-15', tag: '科技',  title: '与 mBridge 央行数字货币网络完成生产环境对接，跨境结算缩短至 3 秒' },
];

export default function Home() {
  return (
    <PortalLayout>
      {/* Hero */}
      <section className="p-hero">
        <div className="p-hero-inner">
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 16 }}>
              Open Source Digital Banking
            </div>
            <h1 className="p-hero-title">
              重新定义<br />
              <span className="accent">数字时代</span>的银行
            </h1>
            <p className="p-hero-subtitle">
              基于 Open Banking、ISO 20022、BIAN 标准构建的现代化银行核心系统。
              为个人、企业和金融机构提供端到端的数字化金融服务。
            </p>
            <div className="p-hero-ctas">
              <Link to="/login" className="p-btn p-btn-primary">立即登录网银 →</Link>
              <Link to="/products/personal" className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white' }}>
                了解个人银行服务
              </Link>
            </div>
          </div>

          <div className="p-hero-card">
            <h3>实时汇率快报</h3>
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--p-border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--p-text-muted)', fontWeight: 500 }}>货币对</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--p-text-muted)', fontWeight: 500 }}>买入</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--p-text-muted)', fontWeight: 500 }}>卖出</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--p-text-muted)', fontWeight: 500 }}>涨跌</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['USD/CNY', '7.2540', '7.2620', '+0.05%', true],
                  ['EUR/CNY', '7.8721', '7.8840', '+0.12%', true],
                  ['HKD/CNY', '0.9275', '0.9290', '-0.02%', false],
                  ['JPY/CNY', '0.0484', '0.0488', '+0.34%', true],
                ].map(([pair, bid, ask, chg, up]) => (
                  <tr key={pair as string} style={{ borderBottom: '1px solid var(--p-border-soft)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 600 }}>{pair}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'monospace' }}>{bid}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'monospace' }}>{ask}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', color: up ? 'var(--p-success)' : 'var(--p-red)', fontWeight: 600 }}>{chg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--p-text-muted)' }}>
              更新于 {new Date().toLocaleString('zh-CN')} · 仅供参考，不构成交易报价
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="p-trust-strip">
        <div className="p-trust-row">
          {[
            ['$284B+', '客户资产管理规模'],
            ['64', '业务覆盖国家与地区'],
            ['1,280 万', '注册个人客户'],
            ['7.2 万', '机构与企业客户'],
          ].map(([num, label]) => (
            <div className="p-trust-item" key={label}>
              <span className="p-trust-num">{num}</span>
              <span className="p-trust-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="p-section">
        <div className="p-section-inner">
          <div className="p-section-header">
            <div className="p-section-eyebrow">Banking Solutions</div>
            <h2 className="p-section-title">为您和企业打造的金融解决方案</h2>
            <p className="p-section-subtitle">
              从日常存款到跨境贸易融资，从个人理财到企业现金管理 — 一站式服务您所有的金融需求
            </p>
          </div>

          <div className="p-product-grid">
            {PRODUCTS.map((p) => (
              <Link to={p.link} className="p-product-card" key={p.title}>
                <div className="p-product-icon">{p.icon}</div>
                <div className="p-product-title">{p.title}</div>
                <div className="p-product-desc">{p.desc}</div>
                <div className="p-product-link">了解更多 →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banking Categories Section */}
      <section className="p-section" style={{ background: 'var(--p-bg-section)' }}>
        <div className="p-section-inner">
          <div className="p-section-header">
            <div className="p-section-eyebrow">Choose Your Banking</div>
            <h2 className="p-section-title">个人客户 · 企业客户 · 私人银行</h2>
          </div>

          <div className="p-product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="p-product-card" style={{ background: 'var(--p-navy)', color: 'white', borderColor: 'var(--p-navy)' }}>
              <div className="p-product-icon" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>👤</div>
              <div className="p-product-title" style={{ color: 'white' }}>个人银行</div>
              <div className="p-product-desc" style={{ color: 'rgba(255,255,255,0.85)' }}>
                储蓄、信用卡、贷款、外汇兑换、理财投资 — 智能 App 随时随地管理
              </div>
              <Link to="/login?type=personal" className="p-btn p-btn-primary" style={{ marginTop: 8 }}>个人登录 →</Link>
            </div>

            <div className="p-product-card">
              <div className="p-product-icon">🏢</div>
              <div className="p-product-title">企业银行</div>
              <div className="p-product-desc">
                公司账户、薪资代发、跨境支付、贸易融资、现金管理 — 助力企业全球化运营
              </div>
              <Link to="/login?type=business" className="p-btn p-btn-secondary" style={{ marginTop: 8 }}>企业登录 →</Link>
            </div>

            <div className="p-product-card">
              <div className="p-product-icon" style={{ background: 'linear-gradient(135deg, #ffba00, #ff8800)', color: 'white' }}>💎</div>
              <div className="p-product-title">私人银行</div>
              <div className="p-product-desc">
                可投资资产 600 万美元起，专属客户经理、全球资产配置、家族信托
              </div>
              <Link to="/contact" className="p-btn p-btn-ghost" style={{ marginTop: 8 }}>预约咨询 →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* News / Insights */}
      <section className="p-section">
        <div className="p-section-inner">
          <div className="p-section-header">
            <div className="p-section-eyebrow">Latest News</div>
            <h2 className="p-section-title">银行动态</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {NEWS.map((n) => (
              <article key={n.title} style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 24, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-red)', background: 'rgba(219,0,17,0.08)', padding: '3px 8px', borderRadius: 3 }}>
                    {n.tag}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--p-text-muted)' }}>{n.date}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 12, lineHeight: 1.4 }}>{n.title}</h3>
                <div style={{ fontSize: 13, color: 'var(--p-red)', fontWeight: 700 }}>阅读全文 →</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Security Trust Section */}
      <section className="p-section" style={{ background: 'var(--p-navy)', color: 'white' }}>
        <div className="p-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffba00', marginBottom: 16 }}>
                Trust & Security
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em' }}>
                银行级的安全保障
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.9, marginBottom: 28 }}>
                BankerOS 采用与全球顶级银行一致的安全标准。
                所有交易使用 TLS 1.3 端到端加密；身份验证支持 FIDO2 生物识别 + TOTP；
                客户资金受存款保险条例保障，最高赔付 50 万元。
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {['ISO 27001', 'PCI DSS', 'SOC 2 Type II', 'BCBS 239', 'GDPR', 'PDPA'].map(cert => (
                  <div key={cert} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                    ✓ {cert}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 36, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>合规与监管牌照</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  ['🏛', '中国银行业监督管理委员会', '银行业金融机构许可证 No. B0001H123456789'],
                  ['🏛', '香港金融管理局 (HKMA)', 'Authorized Institution No. 1234'],
                  ['🏛', '英国金融行为监管局 (FCA)', 'Reference No. 123456'],
                  ['🏛', '新加坡金融管理局 (MAS)', 'Full Bank License'],
                ].map(([icon, body, sub]) => (
                  <div key={body} style={{ display: 'flex', gap: 14 }}>
                    <div style={{ fontSize: 24 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{body}</div>
                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
