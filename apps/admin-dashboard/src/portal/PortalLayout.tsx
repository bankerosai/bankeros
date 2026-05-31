import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../styles-portal.css';

interface MegaItem { to: string; label: string; desc?: string; icon?: string; tag?: string; }
interface MegaSection { title: string; items: MegaItem[]; }
interface NavEntry {
  label: string;
  mega: MegaSection[];
  featured?: { title: string; desc: string; cta: string; link: string; accent?: string };
}

const NAV: NavEntry[] = [
  {
    label: '个人银行',
    mega: [
      {
        title: '日常银行',
        items: [
          { to: '/products/accounts',   icon: '💳', label: '银行账户',   desc: '储蓄账户 · 一卡通 · 多币种账户' },
          { to: '/products/cards',      icon: '💎', label: '信用卡',     desc: '环球白金卡 · 商旅卡 · 联名卡', tag: '热门' },
          { to: '/products/payments',   icon: '📲', label: '支付与转账', desc: '境内实时支付 · 跨境汇款' },
        ],
      },
      {
        title: '借贷与购房',
        items: [
          { to: '/products/loans/mortgage', icon: '🏠', label: '住房贷款',   desc: '首套房利率优惠 · 30 年最长期限' },
          { to: '/products/loans/personal', icon: '💰', label: '个人消费贷', desc: '在线申请 · 8 分钟放款' },
          { to: '/products/loans/auto',     icon: '🚗', label: '汽车贷款',   desc: '4S 店合作 · 0 利率分期' },
        ],
      },
      {
        title: '存款与外汇',
        items: [
          { to: '/products/savings', icon: '🏦', label: '存款产品', desc: '活期 · 定期 · 大额存单 · 结构性存款' },
          { to: '/products/fx',      icon: '💱', label: '外汇兑换', desc: '12 种货币 · 7×24 实时换汇' },
          { to: '/products/precious-metals', icon: '🟡', label: '贵金属', desc: '黄金 · 白银 · 实物 / 纸黄金' },
        ],
      },
      {
        title: '保险与保障',
        items: [
          { to: '/products/insurance/life',   icon: '🛡', label: '人寿保险', desc: '定期 · 终身 · 投连险' },
          { to: '/products/insurance/health', icon: '🏥', label: '健康医疗', desc: '重疾 · 百万医疗 · 高端医疗' },
          { to: '/products/insurance/travel', icon: '✈️', label: '旅行保险', desc: '境外医疗 · 行李延误 · 紧急救援' },
        ],
      },
    ],
    featured: { title: '在线开户', desc: '8 分钟开立多币种账户，立即可用', cta: '立即开户 →', link: '/login?action=open', accent: 'var(--p-red)' },
  },
  {
    label: '财富管理',
    mega: [
      {
        title: '客户分层',
        items: [
          { to: '/products/wealth/premier', icon: '⭐', label: 'Premier 优越理财', desc: '日均资产 50 万起 · 全球贵宾礼遇' },
          { to: '/products/wealth/jade',    icon: '💎', label: 'Jade 钻石客户',   desc: '日均 600 万起 · 1v1 顾问', tag: 'VIP' },
          { to: '/products/wealth/private', icon: '👑', label: '私人银行',         desc: '可投资资产 3000 万起 · 家族信托' },
        ],
      },
      {
        title: '投资产品',
        items: [
          { to: '/products/wealth/funds',        icon: '📊', label: '公募基金',   desc: '5000+ 只精选基金 · 申购费 1 折' },
          { to: '/products/wealth/bonds',        icon: '📈', label: '债券',       desc: '国债 · 金融债 · 公司债 · 海外债' },
          { to: '/products/wealth/structured',   icon: '🎯', label: '结构性产品', desc: '挂钩股票/汇率/利率' },
          { to: '/products/wealth/robo-advisor', icon: '🤖', label: '智能投顾',   desc: 'AI 资产配置 · 1 万起投' },
        ],
      },
      {
        title: '专属服务',
        items: [
          { to: '/products/wealth/trust',     icon: '🏛', label: '家族信托', desc: '资产隔离 · 财富传承' },
          { to: '/products/wealth/migration', icon: '🌍', label: '海外配置', desc: '美元资产 · 海外保险' },
          { to: '/products/wealth/inheritance', icon: '📜', label: '遗产规划', desc: '遗嘱信托 · 慈善基金' },
        ],
      },
    ],
    featured: { title: 'Jade 升级礼', desc: '资产达 600 万享专属客户经理 + 全球机场贵宾厅', cta: '了解详情 →', link: '/products/wealth/jade', accent: '#ffba00' },
  },
  {
    label: '企业银行',
    mega: [
      {
        title: '按规模',
        items: [
          { to: '/products/business/sme',        icon: '🏪', label: '小微企业 (年营收 < 1亿)', desc: '极速开户 · 一户多用' },
          { to: '/products/business/commercial', icon: '🏢', label: '商业银行 (1-50亿)',     desc: '综合现金管理' },
          { to: '/products/business/corporate',  icon: '🏛', label: '大型企业 (> 50亿)',    desc: '银团贷款 · 投资银行' },
        ],
      },
      {
        title: '核心服务',
        items: [
          { to: '/products/business/cash-management', icon: '💵', label: '现金管理', desc: '集团资金归集 · 名义资金池' },
          { to: '/products/business/trade-finance',   icon: '🚢', label: '贸易融资', desc: '信用证 · 保函 · 出口押汇' },
          { to: '/products/business/cross-border',    icon: '🌐', label: '跨境结算', desc: 'SWIFT GPI · 多币种' },
          { to: '/products/business/payroll',         icon: '👥', label: '薪资代发', desc: '一次上传 · 秒到' },
        ],
      },
      {
        title: '资本市场',
        items: [
          { to: '/products/business/ipo',     icon: '📊', label: 'IPO 上市辅导', desc: '资本市场全周期' },
          { to: '/products/business/m-and-a', icon: '🤝', label: '并购融资',     desc: '杠杆收购 · 重组' },
          { to: '/products/business/bonds',   icon: '📈', label: '债券发行',     desc: '熊猫债 · 点心债 · 海外债' },
          { to: '/products/business/api',     icon: '🔌', label: 'API 银行',     desc: 'ERP 直连 · ISO 20022' },
        ],
      },
    ],
    featured: { title: '中小企业开户', desc: '在线提交资料，5 个工作日内开户', cta: '咨询客户经理 →', link: '/products/business/sme', accent: 'var(--p-navy)' },
  },
  {
    label: '全球与跨境',
    mega: [
      {
        title: '跨境账户',
        items: [
          { to: '/products/global/multi-currency', icon: '💱', label: '多币种账户',     desc: '12 种货币 · 一账多币' },
          { to: '/products/global/premier-global', icon: '🌍', label: 'Premier Global', desc: '全球账户互通', tag: '招牌' },
          { to: '/products/global/offshore',       icon: '🏝', label: '离岸账户',       desc: '香港/新加坡/卢森堡' },
        ],
      },
      {
        title: '跨境业务',
        items: [
          { to: '/products/global/remittance',   icon: '💸', label: '国际汇款',   desc: '200+ 国家 · 6 小时到账' },
          { to: '/products/global/study-abroad', icon: '🎓', label: '留学金融',   desc: '学费汇款 · 留学贷款' },
          { to: '/products/global/immigration',  icon: '✈️', label: '移民/海外置业', desc: '海外按揭 · 资产配置' },
        ],
      },
      {
        title: '全球网点',
        items: [
          { to: '/branches/hong-kong', icon: '🇭🇰', label: '香港' },
          { to: '/branches/singapore', icon: '🇸🇬', label: '新加坡' },
          { to: '/branches/london',    icon: '🇬🇧', label: '伦敦' },
          { to: '/branches/new-york',  icon: '🇺🇸', label: '纽约' },
          { to: '/branches/dubai',     icon: '🇦🇪', label: '迪拜' },
          { to: '/branches/sydney',    icon: '🇦🇺', label: '悉尼' },
        ],
      },
    ],
    featured: { title: 'mBridge 央行数字货币', desc: '4 国央行 · 3 秒结算 · 实时 PvP', cta: '了解详情 →', link: '/about/innovation', accent: '#06b6d4' },
  },
  {
    label: '关于我们',
    mega: [
      {
        title: '公司介绍',
        items: [
          { to: '/about',            icon: 'ℹ️', label: '银行简介',   desc: '近 30 年 · 64 国家' },
          { to: '/about/leadership', icon: '👔', label: '管理团队',   desc: '董事会 · 高管' },
          { to: '/about/awards',     icon: '🏆', label: '荣誉奖项',   desc: 'The Banker / Euromoney' },
          { to: '/about/innovation', icon: '💡', label: '科技与创新', desc: 'BCBS239 · mBridge' },
        ],
      },
      {
        title: '可持续发展',
        items: [
          { to: '/about/esg',          icon: '🌱', label: 'ESG 战略', desc: '碳中和 2030 · 绿色金融' },
          { to: '/about/philanthropy', icon: '❤️', label: '社会公益', desc: '教育 · 医疗' },
        ],
      },
      {
        title: '投资者关系',
        items: [
          { to: '/about/financials', icon: '📊', label: '财务公告', desc: '年报 · 中期报告' },
          { to: '/about/governance', icon: '⚖️', label: '公司治理', desc: '股权结构' },
          { to: '/careers',          icon: '💼', label: '招贤纳士', desc: '校招 · 社招' },
        ],
      },
    ],
  },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [openMega, setOpenMega] = useState<string | null>(null);

  return (
    <div className="portal-root" onClick={() => setOpenMega(null)}>
      {/* Utility bar */}
      <div style={{ background: 'var(--p-navy-dark)', color: 'rgba(255,255,255,0.8)', fontSize: 12, padding: '6px 48px', display: 'flex', justifyContent: 'flex-end', gap: 18 }}>
        <Link to="/rates" style={{ color: 'inherit', textDecoration: 'none' }}>📊 利率/汇率公告</Link>
        <Link to="/branches" style={{ color: 'inherit', textDecoration: 'none' }}>📍 分行查询</Link>
        <Link to="/help" style={{ color: 'inherit', textDecoration: 'none' }}>❓ 帮助中心</Link>
        <Link to="/security" style={{ color: 'inherit', textDecoration: 'none' }}>🛡 安全防护</Link>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <Link to="/login?type=staff" style={{ color: 'inherit', textDecoration: 'none' }}>👨‍💼 员工通道</Link>
        <span style={{ cursor: 'pointer' }}>🌐 中文 / English</span>
      </div>

      {/* Top bar */}
      <header className="p-topbar" onClick={(e) => e.stopPropagation()}>
        <Link to="/" className="p-logo">
          <div className="p-logo-mark">B</div>
          <div>
            <div className="p-logo-text">BankerOS</div>
            <span className="p-logo-sub">DIGITAL BANKING</span>
          </div>
        </Link>

        <nav className="p-nav" style={{ position: 'relative' }}>
          {NAV.map(n => (
            <div key={n.label}
              onMouseEnter={() => setOpenMega(n.label)}
              onMouseLeave={() => setOpenMega(null)}
              style={{ position: 'relative' }}>
              <button style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '24px 18px', fontSize: 14, fontWeight: 500,
                color: openMega === n.label ? 'var(--p-red)' : 'var(--p-text)',
                borderBottom: openMega === n.label ? '3px solid var(--p-red)' : '3px solid transparent',
                fontFamily: 'inherit',
              }}>
                {n.label} <span style={{ fontSize: 9, marginLeft: 4 }}>▼</span>
              </button>

              {openMega === n.label && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-30%)',
                  width: n.featured ? 940 : 720,
                  background: 'white', borderRadius: 8,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                  border: '1px solid var(--p-border-soft)',
                  display: 'grid',
                  gridTemplateColumns: n.featured ? `repeat(${n.mega.length}, 1fr) 240px` : `repeat(${n.mega.length}, 1fr)`,
                  zIndex: 200, overflow: 'hidden',
                }}>
                  {n.mega.map(sec => (
                    <div key={sec.title} style={{ padding: 20, borderRight: '1px solid var(--p-border-soft)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                        {sec.title}
                      </div>
                      {sec.items.map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setOpenMega(null)}
                          style={{ display: 'block', padding: '8px 10px', borderRadius: 4, color: 'var(--p-text)', textDecoration: 'none', marginBottom: 2 }}
                          onMouseOver={(e) => (e.currentTarget.style.background = 'var(--p-bg-section)')}
                          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            {item.icon && <span style={{ fontSize: 14 }}>{item.icon}</span>}
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-navy)' }}>{item.label}</span>
                            {item.tag && <span style={{ fontSize: 9, padding: '2px 6px', background: 'var(--p-red)', color: 'white', borderRadius: 3, fontWeight: 700 }}>{item.tag}</span>}
                          </div>
                          {item.desc && <div style={{ fontSize: 11, color: 'var(--p-text-muted)', paddingLeft: item.icon ? 22 : 0 }}>{item.desc}</div>}
                        </Link>
                      ))}
                    </div>
                  ))}
                  {n.featured && (
                    <div style={{ padding: 20, background: 'linear-gradient(135deg, var(--p-navy), var(--p-navy-dark))', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: n.featured.accent ?? '#ffba00', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>⚡ 推荐</div>
                        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{n.featured.title}</div>
                        <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.5, marginBottom: 16 }}>{n.featured.desc}</div>
                      </div>
                      <Link to={n.featured.link} onClick={() => setOpenMega(null)}
                        style={{ background: n.featured.accent ?? '#ffba00', color: '#0f1117', padding: '10px 14px', borderRadius: 4, fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                        {n.featured.cta}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-topbar-actions">
          <Link to="/login" className="p-btn p-btn-ghost">登录网银</Link>
          <Link to="/login?action=open" className="p-btn p-btn-primary">在线开户</Link>
        </div>
      </header>

      <main onClick={(e) => e.stopPropagation()}>{children}</main>

      {/* Footer */}
      <footer className="p-footer">
        <div className="p-footer-inner" style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr' }}>
          <div>
            <div className="p-logo" style={{ marginBottom: 16 }}>
              <div className="p-logo-mark">B</div>
              <div>
                <div className="p-logo-text" style={{ color: 'white' }}>BankerOS</div>
                <span className="p-logo-sub">DIGITAL BANKING PLATFORM</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              开源、安全、合规的下一代银行核心平台。覆盖 64 国，服务 1280 万个人与 7.2 万机构客户。
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {['📘', '🐦', '💼', '📺', '📷'].map(i => (
                <span key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{i}</span>
              ))}
            </div>
          </div>

          <div>
            <h4>个人银行</h4>
            <ul>
              <li><Link to="/products/accounts">银行账户</Link></li>
              <li><Link to="/products/cards">信用卡</Link></li>
              <li><Link to="/products/loans/personal">个人贷款</Link></li>
              <li><Link to="/products/loans/mortgage">住房贷款</Link></li>
              <li><Link to="/products/savings">存款理财</Link></li>
              <li><Link to="/products/insurance/life">保险产品</Link></li>
            </ul>
          </div>

          <div>
            <h4>财富与企业</h4>
            <ul>
              <li><Link to="/products/wealth/premier">Premier 优越</Link></li>
              <li><Link to="/products/wealth/private">私人银行</Link></li>
              <li><Link to="/products/business/sme">中小企业</Link></li>
              <li><Link to="/products/business/cash-management">现金管理</Link></li>
              <li><Link to="/products/business/trade-finance">贸易融资</Link></li>
              <li><Link to="/products/business/api">API 银行</Link></li>
            </ul>
          </div>

          <div>
            <h4>全球与跨境</h4>
            <ul>
              <li><Link to="/products/global/multi-currency">多币种账户</Link></li>
              <li><Link to="/products/global/remittance">国际汇款</Link></li>
              <li><Link to="/products/global/study-abroad">留学金融</Link></li>
              <li><Link to="/branches">全球网点</Link></li>
              <li><Link to="/rates">汇率公告</Link></li>
            </ul>
          </div>

          <div>
            <h4>关于与帮助</h4>
            <ul>
              <li><Link to="/about">银行简介</Link></li>
              <li><Link to="/about/innovation">科技创新</Link></li>
              <li><Link to="/about/esg">ESG</Link></li>
              <li><Link to="/careers">招贤纳士</Link></li>
              <li><Link to="/help">客户服务</Link></li>
              <li><Link to="/security">安全防护</Link></li>
              <li style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to="/login?type=staff" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>🔒 员工通道</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-footer-bottom">
          <span>© {new Date().getFullYear()} BankerOS · 金融许可证 B0001H123456789 · 央行支付牌照 Z2000123000007</span>
          <span>Apache 2.0 · 客服 95588</span>
        </div>
      </footer>
    </div>
  );
}
