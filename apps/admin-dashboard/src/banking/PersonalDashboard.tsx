import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import BankingLayout from './BankingLayout';

const ACCOUNTS = [
  { id: 'a1', type: '一卡通主账户', currency: 'CNY', number: '6225 8801 ··· 4821', balance: '128,420.50', available: '128,420.50' },
  { id: 'a2', type: '美元活期账户',  currency: 'USD', number: 'USD-8841-0023',     balance: '18,420.00', available: '18,420.00' },
  { id: 'a3', type: '港币定期存款',  currency: 'HKD', number: 'HKD-TD-8841-991',   balance: '500,000.00', available: '0.00' },
  { id: 'a4', type: '欧元结算账户',  currency: 'EUR', number: 'EUR-8841-0045',     balance: '8,920.00',  available: '8,920.00' },
];

const TRANSACTIONS = [
  { id: 't1', date: '2026-05-31', desc: '工资入账 - ACME 科技公司',     amount: '+25,000.00', currency: 'CNY', type: 'in',  category: '工资' },
  { id: 't2', date: '2026-05-30', desc: '美团 - 外卖订单',              amount: '-86.50',     currency: 'CNY', type: 'out', category: '餐饮' },
  { id: 't3', date: '2026-05-30', desc: '招商证券 - 申购货币基金',      amount: '-50,000.00', currency: 'CNY', type: 'out', category: '投资' },
  { id: 't4', date: '2026-05-29', desc: '跨境汇款 - 收款方 Alice Chen', amount: '-2,500.00',  currency: 'USD', type: 'out', category: '汇款' },
  { id: 't5', date: '2026-05-29', desc: 'Apple Store - iPhone 15 Pro', amount: '-8,999.00',  currency: 'CNY', type: 'out', category: '购物' },
  { id: 't6', date: '2026-05-28', desc: '利息收入 - 港币定期存款',      amount: '+1,250.00',  currency: 'HKD', type: 'in',  category: '利息' },
];

const SPEND_TREND = [
  { month: '1月', spend: 18420 }, { month: '2月', spend: 22100 },
  { month: '3月', spend: 19840 }, { month: '4月', spend: 24210 },
  { month: '5月', spend: 21850 }, { month: '6月', spend: 16420 },
];

export default function PersonalDashboard() {
  const totalCny = ACCOUNTS.reduce((s, a) => s + (a.currency === 'CNY' ? parseFloat(a.balance.replace(/,/g, '')) : parseFloat(a.balance.replace(/,/g, '')) * 7.2), 0);

  return (
    <BankingLayout variant="personal">
      <div>
        <h1 className="b-page-title">欢迎回来，赵磊</h1>
        <p className="b-page-sub">您上次登录时间：2026-05-30 14:22 · IP: 116.231.··.45 · 上海</p>
      </div>

      {/* Wealth summary card */}
      <div className="b-summary-card" style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 32, alignItems: 'center' }}>
        <div>
          <div className="b-summary-label">总资产估值（人民币等值）</div>
          <div className="b-summary-value">¥ {totalCny.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="b-summary-meta">↑ +2.4% 本月 · +¥3,182</div>
        </div>
        <div>
          <div className="b-summary-label">本月支出</div>
          <div className="b-summary-value" style={{ fontSize: 22 }}>¥ 16,420</div>
          <div className="b-summary-meta">↓ -24.8% vs 上月</div>
        </div>
        <div>
          <div className="b-summary-label">本月收入</div>
          <div className="b-summary-value" style={{ fontSize: 22 }}>¥ 26,250</div>
          <div className="b-summary-meta">+ 工资 + 利息</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="b-card" style={{ marginBottom: 24 }}>
        <div className="b-card-body">
          <div className="b-quick-grid">
            {[
              { to: '/personal/transfer', icon: '💸', label: '转账汇款' },
              { to: '/personal/fx',       icon: '💱', label: '外汇兑换' },
              { to: '/personal/wealth',   icon: '📈', label: '理财投资' },
              { to: '/personal/cards',    icon: '💳', label: '信用卡管理' },
              { to: '#',                  icon: '🏠', label: '贷款申请' },
              { to: '#',                  icon: '🧾', label: '账单支付' },
              { to: '#',                  icon: '📲', label: '手机充值' },
              { to: '#',                  icon: '🌍', label: '跨境汇款' },
            ].map(a => (
              <Link key={a.label} to={a.to} className="b-quick-btn">
                <span className="b-quick-icon">{a.icon}</span>
                <span className="b-quick-label">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="b-grid-2" style={{ marginBottom: 24 }}>
        {/* Accounts list */}
        <div className="b-card">
          <div className="b-card-header">
            <span className="b-card-title">我的账户</span>
            <Link to="/personal/statements" style={{ fontSize: 13, color: 'var(--b-navy)', textDecoration: 'none', fontWeight: 600 }}>查看全部 →</Link>
          </div>
          <div className="b-card-body">
            {ACCOUNTS.map(a => (
              <div key={a.id} className="b-account-card">
                <div className="b-account-row">
                  <div>
                    <div className="b-account-type">{a.type}</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{a.type.includes('定期') ? '定期账户' : '活期账户'}</div>
                    <div className="b-account-num">{a.number}</div>
                  </div>
                  <div>
                    <div className="b-account-balance">{a.balance}</div>
                    <div className="b-account-currency">{a.currency} · 可用 {a.available}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Trend */}
        <div className="b-card">
          <div className="b-card-header">
            <span className="b-card-title">支出趋势 - 近 6 个月</span>
            <span style={{ fontSize: 12, color: 'var(--b-text-muted)' }}>月平均 ¥ 20,500</span>
          </div>
          <div className="b-card-body">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPEND_TREND}>
                  <defs>
                    <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#002966" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#002966" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8a94a0' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8a94a0' }} tickFormatter={v => `¥${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #e4e7ec', borderRadius: 6, fontSize: 13 }}
                    formatter={(v: number) => [`¥ ${v.toLocaleString()}`, '总支出']}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#002966" strokeWidth={2.5} fill="url(#navyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 12 }}>
              {[
                ['餐饮', '¥4,820', '#db0011'],
                ['购物', '¥6,100', '#002966'],
                ['交通', '¥1,420', '#007a33'],
                ['其他', '¥4,080', '#ffba00'],
              ].map(([cat, amt, color]) => (
                <div key={cat} style={{ borderTop: `3px solid ${color}`, paddingTop: 8 }}>
                  <div style={{ color: 'var(--b-text-muted)' }}>{cat}</div>
                  <div style={{ fontWeight: 700, color: 'var(--b-navy)', marginTop: 2 }}>{amt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="b-card">
        <div className="b-card-header">
          <span className="b-card-title">最近交易</span>
          <Link to="/personal/statements" style={{ fontSize: 13, color: 'var(--b-navy)', textDecoration: 'none', fontWeight: 600 }}>查看全部 →</Link>
        </div>
        <table className="b-table">
          <thead>
            <tr><th>日期</th><th>交易描述</th><th>类别</th><th>金额</th><th style={{ textAlign: 'right' }}>币种</th></tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map(t => (
              <tr key={t.id}>
                <td style={{ color: 'var(--b-text-muted)', whiteSpace: 'nowrap' }}>{t.date}</td>
                <td style={{ fontWeight: 500 }}>{t.desc}</td>
                <td><span className="b-badge b-badge-info">{t.category}</span></td>
                <td className={t.type === 'in' ? 'b-amount-pos' : 'b-amount-neg'} style={{ fontFamily: 'monospace', fontSize: 14 }}>
                  {t.amount}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--b-text-muted)', fontSize: 12 }}>{t.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BankingLayout>
  );
}
