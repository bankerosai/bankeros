/**
 * BankerOS Admin Sidebar — organized by Business Line (BIAN-aligned).
 * Top filter: switch between business lines · each line shows its own modules.
 */

import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

type LineKey = 'all' | 'retail' | 'wealth' | 'corporate' | 'gbm' | 'innovation' | 'hr' | 'shared';

interface NavItem { to: string; icon: string; label: string; exact?: boolean; badge?: string }
interface LineDef {
  key: LineKey;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  desc: string;
  bian: string;
  sections: { label: string; items: NavItem[] }[];
}

// ──────────────────────────────────────────────────────────────────
// Business Lines (5 + Shared/Overview)
// Each maps to a frontend product domain
// ──────────────────────────────────────────────────────────────────
const LINES: LineDef[] = [
  {
    key: 'all', label: '总览（全行视图）', shortLabel: '总览', icon: '◈', color: '#3b82f6',
    desc: '跨条线管理 · 高管层视角', bian: 'Enterprise Risk · Group Reporting',
    sections: [
      { label: '集团总览', items: [
        { to: '/admin', icon: '◈', label: 'CEO 驾驶舱', exact: true, badge: 'CEO' },
        { to: '/admin/lines', icon: '▦', label: '12 条线管理驾驶舱', badge: '12' },
        { to: '/admin/ops-dashboard', icon: '◇', label: '运营仪表盘' },
        { to: '/admin/gl', icon: '⊞', label: '核心总账 GL' },
        { to: '/admin/customers', icon: '◎', label: '全行客户管理' },
      ] },
    ],
  },
  {
    key: 'retail', label: '零售银行条线', shortLabel: '零售', icon: '🏠', color: '#22c55e',
    desc: '个人客户 · PFS', bian: 'Customer Behavior Insights · Retail Banking Fulfillment',
    sections: [
      { label: '零售客户', items: [
        { to: '/admin/customers?segment=retail', icon: '◎', label: '零售客户管理' },
        { to: '/admin/onboarding', icon: '✦', label: 'HSBC 标准开户' },
      ] },
      { label: '零售产品', items: [
        { to: '/admin/loans?type=personal', icon: '◑', label: '个人贷款' },
        { to: '/admin/products?segment=retail', icon: '⬡', label: '零售产品工厂' },
      ] },
      { label: '💼 信贷工作流', items: [
        { to: '/admin/credit-workflow/workbench', icon: '💼', label: '客户经理工作台' },
        { to: '/admin/credit-workflow/external-data', icon: '🔌', label: '外部数据中心' },
      ] },
      { label: '零售运营', items: [
        { to: '/admin/payments?segment=retail', icon: '⟳', label: '零售支付' },
      ] },
    ],
  },
  {
    key: 'wealth', label: '财富与私人银行条线', shortLabel: '财富', icon: '💎', color: '#a855f7',
    desc: 'Premier / Jade / Private · AUM 视角', bian: 'Investment Portfolio Management',
    sections: [
      { label: '财富客户', items: [
        { to: '/admin/customers?segment=wealth', icon: '👤', label: 'Premier / Jade 客户' },
        { to: '/admin/customers?segment=private', icon: '👑', label: '私人银行客户' },
      ] },
      { label: '投资业务', items: [
        { to: '/admin/wealth', icon: '◒', label: '投资组合管理' },
        { to: '/admin/products?segment=wealth', icon: '⬡', label: '财富产品工厂' },
      ] },
    ],
  },
  {
    key: 'corporate', label: '对公银行条线', shortLabel: '对公', icon: '🏢', color: '#f59e0b',
    desc: 'Commercial / SME / 大型企业', bian: 'Corporate Treasury · Trade Finance',
    sections: [
      { label: '对公客户', items: [
        { to: '/admin/customers?segment=corporate', icon: '🏢', label: '对公客户管理' },
        { to: '/admin/onboarding?type=corporate', icon: '✦', label: '企业开户' },
      ] },
      { label: '对公融资', items: [
        { to: '/admin/loans?type=corporate', icon: '◑', label: '对公贷款' },
        { to: '/admin/syndication', icon: '⊛', label: '银团贷款' },
        { to: '/admin/trade-finance', icon: '⊟', label: '贸易融资 (LC/保函)' },
      ] },
      { label: '💼 信贷工作流 (LOS)', items: [
        { to: '/admin/credit-workflow/workbench', icon: '💼', label: '客户经理工作台' },
        { to: '/admin/credit-workflow/committee', icon: '🏛', label: '审贷委员会' },
        { to: '/admin/credit-workflow/external-data', icon: '🔌', label: '外部数据中心' },
      ] },
      { label: '现金管理', items: [
        { to: '/admin/liquidity', icon: '⊗', label: '集团流动性管理' },
      ] },
    ],
  },
  {
    key: 'gbm', label: '同业 · 投行 · 金融市场', shortLabel: '同业/投行', icon: '🌍', color: '#06b6d4',
    desc: 'GB&M · Treasury · Markets', bian: 'Treasury · Securities · Custody',
    sections: [
      { label: '机构客户', items: [
        { to: '/admin/customers?segment=institutional', icon: '🏛', label: '机构/同业客户' },
      ] },
      { label: '金融市场', items: [
        { to: '/admin/fx', icon: '◈', label: 'FX 报价台' },
        { to: '/admin/payments?segment=cross-border', icon: '⟳', label: '跨境支付清算' },
        { to: '/admin/open-banking', icon: '⊕', label: 'Open Banking / BaaS' },
      ] },
    ],
  },
  {
    key: 'innovation', label: '创新业务条线', shortLabel: '创新', icon: '🚀', color: '#ec4899',
    desc: '数字资产 · CBDC · 区块链', bian: 'Digital Asset Custody',
    sections: [
      { label: '数字金融', items: [
        { to: '/admin/digital-assets', icon: '◆', label: '数字资产托管' },
      ] },
    ],
  },
  {
    key: 'hr', label: '🏢 行政与人事 (HR & Admin)', shortLabel: '行政人事', icon: '🏢', color: '#14b8a6',
    desc: 'Group Services · 人事/组织/网点', bian: 'Human Resources · Branch Network · IAM',
    sections: [
      { label: '🌲 组织管理', items: [
        { to: '/admin/hr/organization', icon: '🌲', label: '组织架构' },
        { to: '/admin/hr/employees',    icon: '👥', label: '员工管理 (HR)' },
      ] },
      { label: '🏬 网点管理', items: [
        { to: '/admin/hr/branches',     icon: '🏬', label: '网点 / ATM 管理' },
      ] },
      { label: '🔐 权限与考核', items: [
        { to: '/admin/hr/roles',        icon: '🔐', label: '角色与权限 (IAM)' },
        { to: '/admin/hr/performance',  icon: '📊', label: '绩效考核 (KPI)' },
        { to: '/admin/hr/training',     icon: '🎓', label: '培训与认证' },
      ] },
    ],
  },
  {
    key: 'shared', label: '风险 / 合规 / 运营 (共享)', shortLabel: '风控运营', icon: '🛡', color: '#ef4444',
    desc: '跨条线 · 二线/三线防御 · Basel III/IV', bian: 'Risk Mgmt · Compliance · Operations · Internal Audit',
    sections: [
      { label: '🎯 风险综合', items: [
        { to: '/admin/risk', icon: '🎯', label: 'CRO 风险仪表盘', exact: true },
      ] },
      { label: '⚖️ 五大风险类别', items: [
        { to: '/admin/risk/credit',      icon: '💳', label: '信用风险 (IFRS 9)' },
        { to: '/admin/risk/market',      icon: '📊', label: '市场风险 (VaR)' },
        { to: '/admin/risk/operational', icon: '⚙️', label: '操作风险 (KRI)' },
        { to: '/admin/risk/liquidity',   icon: '💧', label: '流动性风险 (LCR)' },
        { to: '/admin/compliance',       icon: '⚑', label: '合规风险 (AML)', badge: '23' },
      ] },
      { label: '💼 信贷流程管理 (LOS)', items: [
        { to: '/admin/credit-workflow/workbench',    icon: '💼', label: '客户经理工作台' },
        { to: '/admin/credit-workflow/committee',    icon: '🏛', label: '审贷委员会' },
        { to: '/admin/credit-workflow/external-data', icon: '🔌', label: '外部数据中心' },
      ] },
      { label: '🏛 资本与监管', items: [
        { to: '/admin/risk/capital',     icon: '🏛', label: '资本管理 (CET1)' },
        { to: '/admin/risk/regulatory',  icon: '📋', label: '监管报送 (Basel)' },
      ] },
      { label: '🔍 第三道防线', items: [
        { to: '/admin/risk/audit',       icon: '🔍', label: '内部审计 (IIA)' },
      ] },
      { label: '⚙️ 运营中心', items: [
        { to: '/admin/batch',            icon: '⊞', label: '批处理 / EOD' },
        { to: '/admin/middle-office',    icon: '⊜', label: '中台对账' },
      ] },
    ],
  },
];

const STORAGE_KEY = 'bankeros-active-line';

// 业务条线 → ManagementDashboard 内 Tab 的映射
// (Sidebar 条线数 ≠ Dashboard Tab 数：有 1:1、N:1 与跳转特例)
const LINE_TO_DASHBOARD: Record<LineKey, string> = {
  all:        '/admin',                          // CEO 驾驶舱
  retail:     '/admin/lines?line=retail',
  wealth:     '/admin/lines?line=wealth',
  corporate:  '/admin/lines?line=corporate',
  gbm:        '/admin/lines?line=treasury',      // 同业/投行/金市 → Treasury Tab
  innovation: '/admin/lines?line=it',            // 创新业务 → IT/数字化 Tab
  hr:         '/admin/lines?line=hr',
  shared:     '/admin/lines?line=risk',          // 共享风控 → 风险 Tab
};

const LINE_OVERVIEW_LABEL: Record<LineKey, string> = {
  all:        'CEO 全行驾驶舱',
  retail:     '零售条线驾驶舱',
  wealth:     '财富条线驾驶舱',
  corporate:  '对公条线驾驶舱',
  gbm:        '资金/金市驾驶舱',
  innovation: '创新业务驾驶舱',
  hr:         '人事行政驾驶舱',
  shared:     '风险/合规驾驶舱',
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLine, setActiveLine] = useState<LineKey>(() => {
    return (localStorage.getItem(STORAGE_KEY) as LineKey) || 'all';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeLine);
  }, [activeLine]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const currentLine = LINES.find(l => l.key === activeLine) ?? LINES[0];

  return (
    <aside className="sidebar" style={{ width: 260 }}>
      <div className="sidebar-logo">
        <div className="logo-mark">B</div>
        <div>
          <div className="logo-text">BankerOS</div>
          <div className="logo-sub">银行员工工作台</div>
        </div>
      </div>

      {/* ─── Business Line Switcher ─── */}
      <div style={{ padding: '12px 12px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, padding: '0 4px' }}>
          🏛 业务条线 (BIAN)
        </div>
        <select
          value={activeLine}
          onChange={(e) => {
            const next = e.target.value as LineKey;
            setActiveLine(next);
            // 切换条线 → 自动跳转到该条线的总览驾驶舱
            navigate(LINE_TO_DASHBOARD[next]);
          }}
          style={{
            width: '100%', padding: '10px 12px',
            background: 'var(--bg-secondary)',
            border: `1px solid ${currentLine.color}`,
            borderLeft: `4px solid ${currentLine.color}`,
            borderRadius: 6, color: 'var(--text-primary)',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          }}>
          {LINES.map(l => (
            <option key={l.key} value={l.key}>{l.icon} {l.label}</option>
          ))}
        </select>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, padding: '0 4px', lineHeight: 1.4 }}>
          {currentLine.desc}
        </div>
        <div style={{ fontSize: 9, color: currentLine.color, marginTop: 4, padding: '0 4px', fontFamily: 'monospace' }}>
          BIAN: {currentLine.bian}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '6px 12px 8px' }} />

      {/* ─── 条线总览驾驶舱（永远置顶） ─── */}
      <div className="nav-section">
        <div className="nav-label" style={{ color: currentLine.color }}>📊 条线总览</div>
        <NavLink
          to={LINE_TO_DASHBOARD[activeLine]}
          end={activeLine === 'all'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          style={{
            background: `${currentLine.color}14`,
            borderLeft: `3px solid ${currentLine.color}`,
            fontWeight: 600,
          }}
        >
          <span className="icon">◈</span>
          {LINE_OVERVIEW_LABEL[activeLine]}
          <span className="nav-badge" style={{ background: currentLine.color }}>OV</span>
        </NavLink>
      </div>

      {/* ─── Menu Sections (filtered by line) ─── */}
      {currentLine.sections.map((section) => (
        <div className="nav-section" key={section.label}>
          <div className="nav-label">{section.label}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      {/* ─── Cross-cutting always-available (admin/shared) ─── */}
      {activeLine !== 'shared' && activeLine !== 'all' && (
        <div className="nav-section" style={{ marginTop: 'auto' }}>
          <div className="nav-label" style={{ color: 'var(--accent-red)' }}>🔗 跨条线快捷</div>
          <NavLink to="/admin/compliance" className="nav-item">
            <span className="icon">⚑</span>合规案件
            <span className="nav-badge">23</span>
          </NavLink>
          <NavLink to="/admin/batch" className="nav-item">
            <span className="icon">⊞</span>EOD 批处理
          </NavLink>
        </div>
      )}

      {/* ─── User Footer ─── */}
      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 13 }}>
            {user?.email?.slice(0, 1).toUpperCase() ?? 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email ?? 'admin@bankeros.io'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {user?.role ?? 'SUPER_ADMIN'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={() => navigate('/')}>
            ← 公共门户
          </button>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={handleLogout}>
            退出
          </button>
        </div>
      </div>
    </aside>
  );
}
