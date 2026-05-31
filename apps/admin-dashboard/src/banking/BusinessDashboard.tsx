import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BankingLayout from './BankingLayout';

const CORPORATE_ACCOUNTS = [
  { id: 'c1', name: '主营业务结算账户',  number: '8841 0023 4567 8901', currency: 'CNY', balance: '12,847,200.00', available: '12,847,200.00', type: 'OPERATING' },
  { id: 'c2', name: '工资专户',          number: '8841 0023 4567 8902', currency: 'CNY', balance: '2,100,000.00',  available: '2,100,000.00',  type: 'PAYROLL' },
  { id: 'c3', name: 'USD 离岸结算账户',  number: 'USD-COR-8841-0001',   currency: 'USD', balance: '4,820,000.00',  available: '4,820,000.00',  type: 'FX' },
  { id: 'c4', name: 'EUR 贸易结算账户',  number: 'EUR-COR-8841-0002',   currency: 'EUR', balance: '1,200,000.00',  available: '900,000.00',    type: 'FX' },
  { id: 'c5', name: '香港子公司账户',    number: 'HK-COR-8841-0003',    currency: 'HKD', balance: '8,400,000.00',  available: '8,400,000.00',  type: 'SUB' },
];

const PENDING_AUTH = [
  { id: 'pa1', type: '跨境付款', amount: '$ 250,000.00', counterparty: 'Samsung Electronics Co., Ltd.', maker: '李明 (会计)', requiresApprovers: 2, approved: 1, createdAt: '今日 09:42' },
  { id: 'pa2', type: '工资代发', amount: '¥ 1,820,500.00', counterparty: '员工 187 人', maker: '王芳 (HR经理)', requiresApprovers: 2, approved: 0, createdAt: '今日 08:15' },
  { id: 'pa3', type: '保函开立', amount: '€ 800,000.00', counterparty: 'Port Authority of Rotterdam', maker: '张华 (贸易部)', requiresApprovers: 3, approved: 2, createdAt: '昨日 16:30' },
];

const CASH_FLOW = [
  { week: 'Week 1', inflow: 4_200_000, outflow: 2_800_000 },
  { week: 'Week 2', inflow: 5_800_000, outflow: 3_400_000 },
  { week: 'Week 3', inflow: 3_900_000, outflow: 4_100_000 },
  { week: 'Week 4', inflow: 6_200_000, outflow: 3_800_000 },
];

export default function BusinessDashboard() {
  const totalCny = 12_847_200 + 2_100_000 + 4_820_000 * 7.2 + 1_200_000 * 7.87 + 8_400_000 * 0.93;

  return (
    <BankingLayout variant="business">
      <h1 className="b-page-title">ACME 科技有限公司</h1>
      <p className="b-page-sub">客户编号: CIF2024-CORP-0087 · 关系经理: 陈晓东 · 上次登录 2026-05-30 16:42</p>

      {/* Wealth Summary */}
      <div className="b-summary-card" style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 32, alignItems: 'center' }}>
        <div>
          <div className="b-summary-label">集团总头寸（人民币等值）</div>
          <div className="b-summary-value">¥ {(totalCny / 1e6).toFixed(2)}M</div>
          <div className="b-summary-meta">5 个账户 · 4 种货币</div>
        </div>
        <div>
          <div className="b-summary-label">本月收款</div>
          <div className="b-summary-value" style={{ fontSize: 22 }}>¥ 28.4M</div>
          <div className="b-summary-meta">↑ +18.2% MoM</div>
        </div>
        <div>
          <div className="b-summary-label">本月付款</div>
          <div className="b-summary-value" style={{ fontSize: 22 }}>¥ 16.2M</div>
          <div className="b-summary-meta">↓ -6.4% MoM</div>
        </div>
        <div>
          <div className="b-summary-label">净现金流</div>
          <div className="b-summary-value" style={{ fontSize: 22, color: '#ffba00' }}>+¥ 12.2M</div>
          <div className="b-summary-meta">↑ 强劲增长</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="b-card" style={{ marginBottom: 24 }}>
        <div className="b-card-body">
          <div className="b-quick-grid">
            {[
              { to: '/business/payments',  icon: '💸', label: '跨境付款' },
              { to: '/business/payroll',   icon: '👥', label: '薪资代发' },
              { to: '/business/trade',     icon: '📄', label: '开立信用证' },
              { to: '/business/cash',      icon: '🏦', label: '资金归集' },
              { to: '#',                   icon: '💱', label: '外汇交易' },
              { to: '#',                   icon: '🧾', label: '电子对账单' },
              { to: '#',                   icon: '🤝', label: '保函/履约' },
              { to: '/business/api',       icon: '🔌', label: 'API 集成' },
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
        {/* Account positions */}
        <div className="b-card">
          <div className="b-card-header">
            <span className="b-card-title">集团账户头寸</span>
            <Link to="#" style={{ fontSize: 13, color: 'var(--b-navy)', textDecoration: 'none', fontWeight: 600 }}>详细视图 →</Link>
          </div>
          <table className="b-table">
            <thead><tr><th>账户名称</th><th>类型</th><th style={{ textAlign: 'right' }}>余额</th></tr></thead>
            <tbody>
              {CORPORATE_ACCOUNTS.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--b-text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{a.number}</div>
                  </td>
                  <td>
                    <span className="b-badge b-badge-info">{a.type}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--b-navy)' }}>{a.balance}</div>
                    <div style={{ fontSize: 11, color: 'var(--b-text-muted)' }}>{a.currency}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cash flow chart */}
        <div className="b-card">
          <div className="b-card-header">
            <span className="b-card-title">现金流 - 近 4 周</span>
            <select style={{ padding: '4px 8px', border: '1px solid var(--b-border)', borderRadius: 4, fontSize: 12, color: 'var(--b-text-soft)' }}>
              <option>本月</option><option>上月</option><option>本季度</option>
            </select>
          </div>
          <div className="b-card-body">
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CASH_FLOW}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8a94a0' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8a94a0' }} tickFormatter={v => `¥${v/1e6}M`} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #e4e7ec', borderRadius: 6, fontSize: 13 }} formatter={(v: number) => `¥${(v/1e6).toFixed(2)}M`} />
                  <Bar dataKey="inflow"  fill="#007a33" radius={[4, 4, 0, 0]} name="收款" />
                  <Bar dataKey="outflow" fill="#db0011" radius={[4, 4, 0, 0]} name="付款" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 12, fontSize: 12, justifyContent: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#007a33', borderRadius: 2 }} />
                <span style={{ color: 'var(--b-text-soft)' }}>收款</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: '#db0011', borderRadius: 2 }} />
                <span style={{ color: 'var(--b-text-soft)' }}>付款</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending authorization workflow */}
      <div className="b-card" style={{ marginBottom: 24 }}>
        <div className="b-card-header">
          <span className="b-card-title">待审批事项 (Maker-Checker)</span>
          <span style={{ fontSize: 13, color: 'var(--b-warn)', fontWeight: 600 }}>{PENDING_AUTH.length} 项待您审批</span>
        </div>
        <div className="b-card-body" style={{ padding: 0 }}>
          {PENDING_AUTH.map(p => {
            const progress = (p.approved / p.requiresApprovers) * 100;
            return (
              <div key={p.id} style={{ padding: '18px 24px', borderBottom: '1px solid var(--b-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(0,41,102,0.08)', color: 'var(--b-navy)', padding: '3px 8px', borderRadius: 3 }}>
                        {p.type}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--b-text-muted)' }}>提交人：{p.maker} · {p.createdAt}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.counterparty}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--b-red)', marginBottom: 10 }}>{p.amount}</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--b-text-muted)' }}>审批进度</span>
                      <div style={{ width: 200, height: 6, background: 'var(--b-border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? 'var(--b-success)' : 'var(--b-warn)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{p.approved} / {p.requiresApprovers}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>查看详情</button>
                    <button className="b-btn b-btn-primary" style={{ fontSize: 12 }}>批准</button>
                    <button style={{ background: 'transparent', border: '1.5px solid var(--b-red)', color: 'var(--b-red)', padding: '10px 16px', borderRadius: 4, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      拒绝
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BankingLayout>
  );
}
