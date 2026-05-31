import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';

const SERVICES = [
  { icon: '💰', title: '集团现金管理',  desc: '多账户实时归集、虚拟资金池、智能调拨', detail: '支持物理与名义资金池，最多 7 级层级，跨币种轧差利息计算', to: '/products/business/cash-management/pool-details' },
  { icon: '🌐', title: '跨境支付',     desc: 'SWIFT GPI 实时追踪，覆盖 200+ 国家', detail: 'ISO 20022 标准报文，pain.001/002 全流程可视化',           to: '/products/business/cross-border' },
  { icon: '📄', title: '信用证 & 保函', desc: '在线开立 L/C 与各类保函，全流程电子化', detail: '支持 UCP600/URDG758，与 SWIFT MT700/MT760 直连',          to: '/products/business/trade-finance/lc-details' },
  { icon: '🚢', title: '贸易融资',     desc: '出口押汇、进口押汇、福费廷、保理',     detail: '从订单融资到票据贴现，覆盖供应链全场景',                   to: '/products/business/trade-finance' },
  { icon: '💵', title: '薪资代发',     desc: '一次上传，多币种秒级到账',           detail: 'API/CSV/UI 三种渠道，集成员工电子工资条',                  to: '/products/business/payroll' },
  { icon: '📊', title: '银团贷款',     desc: '机构间联合融资，份额自动分配与对账', detail: '支持牵头行/参与行/代理行多种角色，自动计息分润',           to: '/products/business/m-and-a' },
];

export default function ProductBusiness() {
  return (
    <PortalLayout>
      <section className="p-hero" style={{ padding: '60px 48px' }}>
        <div className="p-hero-inner" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 12 }}>
              Business & Corporate Banking
            </div>
            <h1 className="p-hero-title" style={{ fontSize: 42 }}>
              全球化企业的<br /><span className="accent">金融基础设施</span>
            </h1>
            <p className="p-hero-subtitle">
              从中小企业到跨国集团，从日常对公到复杂贸易融资 — BankerOS 是您可信赖的银行合作伙伴。
            </p>
            <div className="p-hero-ctas">
              <Link to="/login?type=business" className="p-btn p-btn-primary">企业网银登录 →</Link>
              <Link to="/contact" className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white' }}>
                预约客户经理
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="p-section">
        <div className="p-section-inner">
          <div className="p-section-header">
            <div className="p-section-eyebrow">Corporate Services</div>
            <h2 className="p-section-title">六大核心企业银行服务</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {SERVICES.map(s => (
              <Link key={s.title} to={s.to} className="p-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="p-product-icon">{s.icon}</div>
                <div className="p-product-title">{s.title}</div>
                <div className="p-product-desc">{s.desc}</div>
                <div style={{ fontSize: 12, color: 'var(--p-text-muted)', borderTop: '1px solid var(--p-border)', paddingTop: 12, marginTop: 12, lineHeight: 1.5 }}>
                  {s.detail}
                </div>
                <div className="p-product-link" style={{ marginTop: 12 }}>查看详情 →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="p-section" style={{ background: 'var(--p-bg-section)' }}>
        <div className="p-section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="p-section-eyebrow">Industry Solutions</div>
              <h2 className="p-section-title" style={{ textAlign: 'left', marginBottom: 20 }}>专业的行业解决方案</h2>
              <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.7, marginBottom: 24 }}>
                我们为不同行业提供量身定制的金融解决方案，深入了解您的业务模式与现金流特征。
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {['制造业', '科技互联网', '医疗健康', '零售消费', '航运物流', '能源化工', '建筑地产', '专业服务'].map(ind => (
                  <div key={ind} style={{ background: 'white', padding: '12px 18px', borderRadius: 6, fontSize: 14, fontWeight: 600, color: 'var(--p-navy)', border: '1px solid var(--p-border)' }}>
                    {ind}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', padding: 32, borderRadius: 12, border: '1px solid var(--p-border)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 18 }}>API 银行 — 与您的 ERP 直连</h3>
              <div style={{ fontFamily: 'monospace', background: 'var(--p-bg-section)', padding: 16, borderRadius: 6, fontSize: 12, color: 'var(--p-navy)', lineHeight: 1.7, marginBottom: 18 }}>
                <div style={{ color: 'var(--p-red)' }}>POST /v1/payments/cross-border/initiate</div>
                <div style={{ color: 'var(--p-text-muted)' }}>Authorization: Bearer ...</div>
                <div style={{ marginTop: 8 }}>{'{'}</div>
                <div style={{ marginLeft: 16 }}>"debtorAccountId": "uuid",</div>
                <div style={{ marginLeft: 16 }}>"amount": "1000000.00",</div>
                <div style={{ marginLeft: 16 }}>"currency": "USD",</div>
                <div style={{ marginLeft: 16 }}>"creditorBankBic": "DEUTDEDB"</div>
                <div>{'}'}</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['REST API + Webhook 推送', 'OAuth 2.0 + mTLS 双重认证', 'ISO 20022 标准报文', '99.99% SLA · 7x24 技术支持'].map(p => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--p-text-soft)' }}>
                    <span style={{ color: 'var(--p-success)', fontWeight: 700 }}>✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
