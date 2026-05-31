import { useLocation } from 'react-router-dom';
import Notifications from './Notifications';
import ThemeToggle from './ThemeToggle';
import { useAuthStore } from '../store/auth';

const TITLES: Record<string, string> = {
  '/admin':               '运营仪表盘',
  '/admin/customers':     '客户管理',
  '/admin/onboarding':    'HSBC 标准开户流程',
  '/admin/loans':         '贷款管理',
  '/admin/syndication':   '银团贷款',
  '/admin/products':      '产品工厂',
  '/admin/payments':      '支付中心',
  '/admin/open-banking':  'Open Banking / BaaS',
  '/admin/fx':            'FX 报价台',
  '/admin/wealth':        '财富管理',
  '/admin/liquidity':     '流动性管理',
  '/admin/trade-finance': '贸易融资',
  '/admin/compliance':    '合规中心',
  '/admin/digital-assets': '数字资产 & CBDC',
  '/admin/batch':         '批处理引擎',
  '/admin/middle-office': '中台对账',
  '/admin/gl':            '核心总账 (GL)',
};

export default function Topbar() {
  const loc = useLocation();
  const matched = Object.keys(TITLES).find(k => loc.pathname.startsWith(k));
  const title = (matched && TITLES[matched]) ?? 'BankerOS Admin';
  const { user } = useAuthStore();
  const now = new Date().toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' });
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? 'A';

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 'auto' }}>{now}</span>
      <ThemeToggle />
      <Notifications />
      <span className="topbar-env">PRODUCTION</span>
      <div className="topbar-avatar" title={user?.email ?? ''}>{initials}</div>
    </header>
  );
}
