/**
 * BankingLayout — HSBC / CMB / ICBC style online-banking shell.
 *
 * Features:
 *   - 8-category mega menu with grouped sub-items + descriptions
 *   - Global search bar
 *   - Breadcrumb
 *   - Quick action bar (transfer / pay / topup)
 *   - Message center bell with unread badge
 *   - User profile chip (tier badge: Premier/Jade/Private)
 *   - Last login + IP + secure logout
 */
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import '../styles-portal.css';

interface MenuLink { to: string; label: string; desc?: string; badge?: string; icon?: string }
interface MenuGroup { title: string; links: MenuLink[] }
interface MenuItem { key: string; label: string; groups?: MenuGroup[]; to?: string }

// ──────────────────────────────────────────────────────────
// PERSONAL · 个人网银导航（对标 HSBC Personal Internet Banking）
// ──────────────────────────────────────────────────────────
const PERSONAL_MENU: MenuItem[] = [
  { key: 'home', label: '账户总览', to: '/personal' },
  {
    key: 'accounts', label: '账户与转账',
    groups: [
      { title: '账户管理', links: [
        { to: '/personal/accounts', icon: '◧', label: '我的账户', desc: '查询余额 · 多币种 · 账户明细' },
        { to: '/personal/statements', icon: '📋', label: '账单流水', desc: '历史交易 · 自定义筛选 · 导出 PDF/Excel' },
        { to: '/personal/accounts/manage', icon: '⚙', label: '账户管理', desc: '开户 · 销户 · 主账户切换' },
      ]},
      { title: '资金划转', links: [
        { to: '/personal/transfer', icon: '⟶', label: '行内转账', desc: '本人同名 / 转给他人 / 即时到账' },
        { to: '/personal/transfer?type=interbank', icon: '⇆', label: '跨行汇款', desc: '同城 / 异地 / 实时' },
        { to: '/personal/transfer?type=swift', icon: '🌐', label: '境外汇款 SWIFT', desc: 'CIPS / SWIFT GPI · 跟踪到账' },
        { to: '/personal/payees', icon: '👥', label: '收款人管理', desc: '常用收款人 · 黑名单' },
      ]},
    ],
  },
  {
    key: 'cards', label: '卡片',
    groups: [
      { title: '信用卡', links: [
        { to: '/personal/cards', icon: '💳', label: '我的卡片', desc: '账单 · 额度 · 临时提额' },
        { to: '/personal/cards/bills', icon: '📄', label: '账单与还款', desc: '当期账单 · 自动还款 · 分期' },
        { to: '/personal/cards/rewards', icon: '🎁', label: '积分商城', desc: '积分兑换 · 里程 · 礼品' },
        { to: '/personal/cards/instalment', icon: '🔢', label: '账单分期', desc: '3/6/12/24 期 · 利率试算' },
      ]},
      { title: '借记卡', links: [
        { to: '/personal/cards/debit', icon: '🏧', label: '借记卡管理', desc: '冻结 / 解冻 · 限额调整' },
        { to: '/personal/cards/issue', icon: '➕', label: '申请新卡', desc: '主题卡 · 联名卡 · 高端卡' },
      ]},
    ],
  },
  {
    key: 'wealth', label: '财富投资',
    groups: [
      { title: '投资产品', links: [
        { to: '/personal/wealth', icon: '◒', label: '财富总览', desc: '持仓 · 盈亏 · 资产配置' },
        { to: '/personal/wealth/funds', icon: '📈', label: '基金', desc: '股票 / 债券 / 混合 / 货币基金' },
        { to: '/personal/wealth/wm', icon: '💰', label: '理财产品', desc: '固收 + · 净值型 · 现金类' },
        { to: '/personal/wealth/structured', icon: '🧩', label: '结构性产品', desc: '挂钩股票 / 黄金 / FX' },
        { to: '/personal/wealth/insurance', icon: '🛡', label: '保险', desc: '寿险 · 重疾 · 储蓄 · 年金' },
        { to: '/personal/wealth/gold', icon: '🥇', label: '黄金 / 贵金属', desc: '积存金 · 实物金 · 黄金 ETF' },
      ]},
      { title: '专业服务', links: [
        { to: '/personal/wealth/robo', icon: '🤖', label: '智能投顾', desc: 'AI 资产配置 · 一键调仓' },
        { to: '/personal/premier', icon: '👑', label: 'Premier / Jade / Private', desc: '私行专属 · 全球资产' },
      ]},
    ],
  },
  {
    key: 'fx', label: '外汇 / 全球',
    groups: [
      { title: '外汇业务', links: [
        { to: '/personal/fx', icon: '💱', label: '结售汇', desc: '12 种货币 · 实时牌价' },
        { to: '/personal/fx/global-account', icon: '🌍', label: '全球账户', desc: '一户多币 · 海外消费' },
        { to: '/personal/fx/remittance', icon: '✈', label: '出国留学汇款', desc: '学费 · 生活费 · 移民购房' },
        { to: '/personal/fx/rates', icon: '📊', label: '汇率走势 / 提醒', desc: '历史汇率 · 目标价提醒' },
      ]},
    ],
  },
  {
    key: 'loans', label: '贷款',
    groups: [
      { title: '贷款产品', links: [
        { to: '/personal/loans', icon: '🏠', label: '我的贷款', desc: '余额 · 还款计划 · 提前还款' },
        { to: '/personal/loans/mortgage', icon: '🏡', label: '住房贷款', desc: '首套 / 二套 / 抵押贷' },
        { to: '/personal/loans/personal', icon: '💼', label: '消费贷款', desc: '闪电贷 · 装修 · 教育' },
        { to: '/personal/loans/auto', icon: '🚗', label: '汽车贷款', desc: '4S 店合作 · 低首付' },
        { to: '/personal/loans/calculator', icon: '🧮', label: '贷款计算器', desc: '等额本息 / 本金 / 试算' },
      ]},
    ],
  },
  {
    key: 'lifestyle', label: '生活缴费',
    groups: [
      { title: '日常缴费', links: [
        { to: '/personal/lifestyle', icon: '🏘', label: '生活缴费中心', desc: '水电煤 · 物业 · 宽带 · 手机' },
        { to: '/personal/lifestyle/travel', icon: '🛫', label: '机票 / 酒店', desc: '高端会员折扣 · 里程兑换' },
        { to: '/personal/lifestyle/dining', icon: '🍽', label: '餐饮订座', desc: 'Premier 餐厅折扣' },
      ]},
    ],
  },
  {
    key: 'security', label: '安全中心', to: '/personal/security' },
];

// ──────────────────────────────────────────────────────────
// BUSINESS · 企业网银导航（对标 HSBCnet / CMB企业 / 工银 e生意）
// ──────────────────────────────────────────────────────────
const BUSINESS_MENU: MenuItem[] = [
  { key: 'home', label: '企业总览', to: '/business' },
  {
    key: 'cash', label: '现金管理 Cash Mgmt',
    groups: [
      { title: '账户与流动性', links: [
        { to: '/business/cash', icon: '◧', label: '账户总览', desc: '多公司 / 多账户 / 多币种' },
        { to: '/business/cash/pooling', icon: '🌊', label: '资金归集', desc: 'Zero / Target / Sweep' },
        { to: '/business/cash/virtual', icon: '🔢', label: '虚拟账户 VAM', desc: '应收对账 · 子账户' },
        { to: '/business/cash/forecast', icon: '🔮', label: '现金流预测', desc: 'AI 13-week 流动性预测' },
      ]},
    ],
  },
  {
    key: 'payments', label: '支付',
    groups: [
      { title: '支付业务', links: [
        { to: '/business/payments', icon: '⟶', label: '单笔支付', desc: '国内 / 跨境' },
        { to: '/business/payments/batch', icon: '⏤', label: '批量支付', desc: '上传 Excel · 10,000 笔' },
        { to: '/business/payments/payroll', icon: '👥', label: '薪资代发', desc: 'HR 集成 · 个税 · 社保' },
        { to: '/business/payments/xborder', icon: '🌐', label: '跨境支付', desc: 'SWIFT gpi · CIPS · ISO 20022' },
        { to: '/business/payments/instant', icon: '⚡', label: '实时支付 RTP', desc: '24/7/365 · 秒级到账' },
      ]},
    ],
  },
  {
    key: 'trade', label: '贸易融资 TF',
    groups: [
      { title: '单证业务', links: [
        { to: '/business/trade', icon: '📋', label: 'L/C 信用证', desc: '开立 · 修改 · 受理 · 议付' },
        { to: '/business/trade/guarantee', icon: '🛡', label: '银行保函', desc: '投标 / 履约 / 预付款保函' },
        { to: '/business/trade/collection', icon: '📬', label: '托收 D/A · D/P', desc: '出口 / 进口 · 跟单托收' },
      ]},
      { title: '融资业务', links: [
        { to: '/business/trade/discount', icon: '💵', label: '票据贴现', desc: '银承汇票 · 商承汇票' },
        { to: '/business/trade/forfaiting', icon: '🔁', label: '福费廷 Forfaiting', desc: '无追索权应收账款融资' },
        { to: '/business/trade/factoring', icon: '🧾', label: '保理', desc: '出口 · 反向 · 池保理' },
        { to: '/business/trade/loans', icon: '🚢', label: '进出口押汇', desc: '出口押汇 · 进口押汇' },
      ]},
    ],
  },
  {
    key: 'scf', label: '供应链金融',
    groups: [
      { title: '核心 + 上下游', links: [
        { to: '/business/scf', icon: '🔗', label: 'SCF 主驾驶舱', desc: '核心企业视图' },
        { to: '/business/scf/receivable', icon: '📥', label: '应收账款融资', desc: '反向保理 · 经销商授信' },
        { to: '/business/scf/payable', icon: '📤', label: '应付账款融资', desc: '动态贴现 · 票据流转' },
        { to: '/business/scf/distributor', icon: '🚚', label: '经销商网络', desc: '订单融资 · 库存融资' },
      ]},
    ],
  },
  {
    key: 'treasury', label: '资金 / 风险对冲',
    groups: [
      { title: '资金业务', links: [
        { to: '/business/treasury', icon: '📈', label: 'FX 交易台', desc: 'Spot / Forward / Swap / NDF' },
        { to: '/business/treasury/hedge', icon: '🛡', label: '汇率锁定', desc: '远期 / 期权 / 套保策略' },
        { to: '/business/treasury/irs', icon: '〽', label: '利率互换 IRS', desc: '固息↔浮息 · 利率风险对冲' },
        { to: '/business/treasury/commodity', icon: '🛢', label: '大宗商品套保', desc: '原油 / 金属 / 农产品' },
      ]},
    ],
  },
  {
    key: 'api', label: 'API 银行',
    groups: [
      { title: '开放银行', links: [
        { to: '/business/api', icon: '🔌', label: 'API 控制台', desc: 'Keys · 用量 · 沙盒' },
        { to: '/business/api/docs', icon: '📖', label: '接口文档', desc: 'REST · OAuth 2.0 · Webhook' },
        { to: '/business/api/erp', icon: '🔄', label: 'ERP 直连', desc: 'SAP · Oracle · 金蝶 · 用友' },
        { to: '/business/api/host2host', icon: '🖥', label: 'Host-to-Host', desc: 'SFTP · MQ · 主机直联' },
      ]},
    ],
  },
  {
    key: 'approval', label: '审批中心', to: '/business/approval' },
];

// ──────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────
interface Props { children: React.ReactNode; variant: 'personal' | 'business' }

export default function BankingLayout({ children, variant }: Props) {
  const menu = variant === 'personal' ? PERSONAL_MENU : BUSINESS_MENU;
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [msgOpen, setMsgOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-close on route change
  useEffect(() => { setOpenMenu(null); }, [location.pathname]);

  function handleLogout() { logout(); navigate('/'); }

  // Build breadcrumb from current path
  const crumbs = location.pathname.split('/').filter(Boolean);

  const tier = variant === 'personal' ? 'Premier' : 'Corporate';
  const tierColor = variant === 'personal' ? '#a855f7' : '#3b82f6';

  return (
    <div className="banking-root">
      {/* ─── TOP BAR v2 (glass elevated) ─── */}
      <header className="b-topbar" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" className="p-logo">
          <div className="p-logo-mark">B</div>
          <div>
            <div className="p-logo-text">BankerOS</div>
            <span className="p-logo-sub">{variant === 'personal' ? 'PERSONAL BANKING' : 'BUSINESS BANKING'}</span>
          </div>
        </Link>

        {/* Mega Menu */}
        <nav className="b-nav" ref={menuRef} style={{ position: 'relative' }}>
          {menu.map(item => {
            const isOpen = openMenu === item.key;
            const isActive = item.to ? location.pathname === item.to : item.groups?.some(g => g.links.some(l => location.pathname.startsWith(l.to.split('?')[0])));
            if (!item.groups) {
              return (
                <NavLink key={item.key} to={item.to!} end className={({ isActive }) => `b-nav-item${isActive ? ' active' : ''}`}>
                  {item.label}
                </NavLink>
              );
            }
            return (
              <div key={item.key} style={{ position: 'relative' }}>
                <button
                  onMouseEnter={() => setOpenMenu(item.key)}
                  onClick={() => setOpenMenu(isOpen ? null : item.key)}
                  className={`b-nav-item${isActive ? ' active' : ''}`}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
                >
                  {item.label} <span style={{ fontSize: 9, opacity: 0.7 }}>▾</span>
                </button>
                {isOpen && (
                  <div
                    onMouseLeave={() => setOpenMenu(null)}
                    style={{
                      position: 'absolute', top: '100%', left: 0, marginTop: 4,
                      background: '#fff',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                      borderRadius: 8, padding: 18,
                      minWidth: item.groups.length > 1 ? 640 : 360,
                      display: 'grid', gridTemplateColumns: item.groups.length > 1 ? '1fr 1fr' : '1fr', gap: 16,
                    }}
                  >
                    {item.groups.map(g => (
                      <div key={g.title}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                          {g.title}
                        </div>
                        {g.links.map(l => (
                          <NavLink key={l.to} to={l.to}
                            style={{
                              display: 'flex', gap: 12, padding: '10px 8px', borderRadius: 6,
                              textDecoration: 'none', color: '#0f172a',
                              transition: 'background 0.1s', alignItems: 'flex-start',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{l.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>
                                {l.label}{l.badge && <span style={{ marginLeft: 6, fontSize: 9, padding: '1px 5px', background: '#dc2626', color: '#fff', borderRadius: 3 }}>{l.badge}</span>}
                              </div>
                              {l.desc && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{l.desc}</div>}
                            </div>
                          </NavLink>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <input
            type="search"
            placeholder="搜索：账户 · 交易 · 产品 · 帮助"
            aria-label="全局搜索"
            style={{ fontFamily: 'inherit' }}
          />
          <button
            onClick={() => setMsgOpen(!msgOpen)}
            style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}
            title="消息中心"
          >
            <span style={{ display: 'inline-block', transform: 'translateY(1px)' }}>🔔</span>
            <span style={{
              position: 'absolute', top: 2, right: 2,
              minWidth: 16, height: 16, padding: '0 4px',
              background: 'var(--brand-red)', color: '#fff',
              fontSize: 10, fontWeight: 700, borderRadius: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 2px var(--paper)',
            }}>3</span>
          </button>

          <div className="b-topbar-account" title={user?.email} style={{ gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: variant === 'personal' ? 'linear-gradient(135deg, #9333ea, #6b21a8)' : 'linear-gradient(135deg, #002966, #1e3a8a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#fff', fontSize: 14,
              boxShadow: variant === 'personal' ? '0 2px 8px rgba(147,51,234,0.3)' : '0 2px 8px rgba(0,41,102,0.3)',
            }}>
              {user?.email?.slice(0, 1).toUpperCase() ?? 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontSize: 13 }}>{variant === 'personal' ? '赵磊 先生' : '招商局港口控股'}</span>
              <span style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: tierColor,
              }}>{tier}</span>
            </div>
          </div>

          <button className="b-logout" onClick={handleLogout}>安全退出</button>
        </div>
      </header>

      {/* ─── BREADCRUMB + TRUST + QUICK ACTIONS ─── */}
      <div className="b-breadcrumb">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>BankerOS</Link>
            {crumbs.map((c, i) => (
              <span key={i}>
                <span style={{ margin: '0 8px', color: '#cbd5e1' }}>›</span>
                <span style={{ color: i === crumbs.length - 1 ? 'var(--ink)' : 'var(--muted)', fontWeight: i === crumbs.length - 1 ? 600 : 500 }}>
                  {decodeURIComponent(c)}
                </span>
              </span>
            ))}
          </div>
          <span className="trust">上次登录 2026/05/30 14:22 · 上海 · iPhone</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(variant === 'personal' ? [
            { to: '/personal/transfer',  l: '快速转账', i: '⟶', c: 'var(--brand-red)',  bg: 'rgba(219,0,17,0.06)' },
            { to: '/personal/lifestyle', l: '缴费',     i: '⚡', c: 'var(--info)',       bg: 'rgba(37,99,235,0.06)' },
            { to: '/personal/wealth',    l: '财富',     i: '◆',  c: 'var(--violet)',     bg: 'rgba(147,51,234,0.06)' },
          ] : [
            { to: '/business/payments/batch', l: '批量付款',  i: '⏤', c: 'var(--brand-red)', bg: 'rgba(219,0,17,0.06)' },
            { to: '/business/approval',       l: '审批 · 12', i: '✓', c: 'var(--warn)',      bg: 'rgba(217,119,6,0.08)' },
            { to: '/business/treasury',       l: 'FX',        i: '◷', c: 'var(--info)',      bg: 'rgba(37,99,235,0.06)' },
          ]).map(q => (
            <Link key={q.to} to={q.to} style={{
              fontSize: 12, padding: '6px 12px',
              background: q.bg, color: q.c,
              borderRadius: 'var(--r-md)', textDecoration: 'none', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all var(--motion-fast) var(--ease-out)',
            }}
            onMouseEnter={e => { (e.currentTarget.style.transform = 'translateY(-1px)'); }}
            onMouseLeave={e => { (e.currentTarget.style.transform = 'translateY(0)'); }}>
              <span style={{ fontSize: 13 }}>{q.i}</span> {q.l}
            </Link>
          ))}
        </div>
      </div>

      {/* ─── MESSAGE CENTER DROPDOWN v2 ─── */}
      {msgOpen && (
        <div style={{
          position: 'fixed', right: 32, top: 72, zIndex: 60,
          background: 'var(--paper)', borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--e3)', border: '1px solid var(--line)',
          width: 380, padding: 0, overflow: 'hidden',
          animation: 'dropdownIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }} onMouseLeave={() => setMsgOpen(false)}>
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid var(--line-soft)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>消息中心</span>
            <span style={{
              fontSize: 10.5, fontWeight: 700, padding: '2px 8px',
              background: 'rgba(219,0,17,0.08)', color: 'var(--brand-red)', borderRadius: 100,
            }}>3 未读</span>
          </div>
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {[
              { type: '账户安全', t: '检测到新设备登录 (iPhone · 上海)', time: '5 分钟前', color: '#dc2626', dot: '🛡' },
              { type: '账单提醒', t: '信用卡账单 ¥8,642.18 将于 6/15 到期', time: '2 小时前', color: '#d97706', dot: '📅' },
              { type: '产品推荐', t: '新一期净值型理财开售 · 业绩比较基准 4.85%', time: '今天 09:00', color: '#2563eb', dot: '✦' },
            ].map((m, i) => (
              <div key={i} style={{
                padding: '14px 18px',
                borderTop: i ? '1px solid var(--line-soft)' : 'none',
                cursor: 'pointer', transition: 'background var(--motion-fast)',
                display: 'flex', gap: 12,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--canvas)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `${m.color}15`, color: m.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>{m.dot}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: '0.05em' }}>{m.type}</span>
                    <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.45 }}>{m.t}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', padding: '12px', borderTop: '1px solid var(--line-soft)',
            background: 'transparent', color: 'var(--brand-red)',
            border: 'none', fontSize: 12.5, cursor: 'pointer', fontWeight: 600,
            transition: 'background var(--motion-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--canvas)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            查看全部消息 →
          </button>
        </div>
      )}

      <div className="b-content">{children}</div>
    </div>
  );
}
