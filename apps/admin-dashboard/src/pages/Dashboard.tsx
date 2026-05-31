import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MOCK } from '../api/client';

const statusBadge = (s: string) => {
  const m: Record<string, string> = { COMPLETED: 'green', PROCESSING: 'blue', FAILED: 'red', PENDING: 'amber', ACTIVE: 'green', OVERDUE: 'red', APPROVED: 'green', PENDING_REVIEW: 'amber', REJECTED: 'red' };
  return <span className={`badge badge-${m[s] ?? 'gray'}`}>{s}</span>;
};

const PORTFOLIO_MIX = [
  { name: '股票', value: 50, color: '#3b82f6' },
  { name: '固收', value: 30, color: '#22c55e' },
  { name: '货币', value: 10, color: '#f59e0b' },
  { name: '另类', value: 10, color: '#a855f7' },
];

const fmt = (n: string | number) => typeof n === 'number' ? `$${(n / 1e6).toFixed(1)}M` : `$${n}`;

export default function Dashboard() {
  return (
    <div>
      {/* ── KPI Strip ── */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon">🏦</div>
          <div className="kpi-label">客户存款总额</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>$2.85B</div>
          <div className="kpi-delta up">↑ 3.2% 本月</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon">📋</div>
          <div className="kpi-label">贷款余额</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>$1.92B</div>
          <div className="kpi-delta up">↑ 1.8% 本月</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon">👥</div>
          <div className="kpi-label">活跃客户</div>
          <div className="kpi-value">48,291</div>
          <div className="kpi-delta up">↑ 412 本周</div>
        </div>
        <div className="kpi-card cyan">
          <div className="kpi-icon">⟳</div>
          <div className="kpi-label">今日支付笔数</div>
          <div className="kpi-value">12,847</div>
          <div className="kpi-delta up">↑ 7.4% vs 昨日</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon">💹</div>
          <div className="kpi-label">资产管理规模</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>$934M</div>
          <div className="kpi-delta up">↑ 2.1%</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-icon">⚑</div>
          <div className="kpi-label">待处理合规案件</div>
          <div className="kpi-value">23</div>
          <div className="kpi-delta down">↑ 3 新增今日</div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Payment Volume Trend */}
        <div className="card">
          <div className="section-header">
            <span className="card-title">今日支付量趋势</span>
            <span className="tag">实时</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK.paymentTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v: number, name: string) => name === 'amount' ? [fmt(v), '交易金额'] : [v.toLocaleString(), '笔数']}
                />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="url(#blueGrad)" strokeWidth={2} name="volume" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Mix */}
        <div className="card">
          <div className="section-header">
            <span className="card-title">财富组合配置（稳健型）</span>
            <span className="tag">AUM $934M</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 240 }}>
            <ResponsiveContainer width={180} height="100%">
              <PieChart>
                <Pie data={PORTFOLIO_MIX} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                  {PORTFOLIO_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PORTFOLIO_MIX.map((item) => (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <span style={{ fontWeight: 600 }}>{item.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Payments ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title">最新支付记录</span>
          <button className="btn btn-ghost" onClick={() => window.location.href = '/payments'}>查看全部 →</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>支付参考号</th><th>付款方</th><th>收款方</th><th>金额</th>
                <th>网络</th><th>欺诈评分</th><th>状态</th><th>时间</th>
              </tr>
            </thead>
            <tbody>
              {MOCK.payments.map((p) => (
                <tr key={p.id}>
                  <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{p.paymentReference}</code></td>
                  <td>{p.debtorName}</td>
                  <td>{p.creditorName}</td>
                  <td style={{ fontWeight: 600 }}>{p.currency} {p.amount}</td>
                  <td><span className="badge badge-blue">{p.network}</span></td>
                  <td>
                    <span style={{ color: parseFloat(p.fraudScore) > 0.7 ? 'var(--accent-red)' : parseFloat(p.fraudScore) > 0.3 ? 'var(--accent-amber)' : 'var(--accent-green)', fontWeight: 600 }}>
                      {p.fraudScore}
                    </span>
                  </td>
                  <td>{statusBadge(p.status)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(p.instructedAt).toLocaleTimeString('zh-CN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid-2">
        {/* Loans */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">贷款组合</span>
            <span className="badge badge-amber">147 逾期</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>贷款编号</th><th>客户</th><th>余额</th><th>利率</th><th>状态</th></tr>
              </thead>
              <tbody>
                {MOCK.loans.map((l) => (
                  <tr key={l.id}>
                    <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{l.loanNumber}</code></td>
                    <td>{l.customerName}</td>
                    <td style={{ fontWeight: 600 }}>{l.currency} {l.outstandingBalance}</td>
                    <td>{l.interestRate}%</td>
                    <td>{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Cases */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">合规警报</span>
            <button className="btn btn-ghost" onClick={() => window.location.href = '/compliance'}>全部 →</button>
          </div>
          {MOCK.complianceCases.map((c) => (
            <div key={c.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span className={`dot dot-${c.status === 'OPEN' ? 'red' : c.status === 'UNDER_REVIEW' ? 'amber' : 'gray'}`} style={{ marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{c.caseNumber}</code>
                  <span className={`badge badge-${c.type === 'SAR' ? 'red' : c.type === 'EDD' ? 'amber' : 'blue'}`}>{c.type}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{c.description}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {statusBadge(c.status)}
                  <span style={{ fontSize: 11, color: parseFloat(c.riskScore) > 0.7 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                    风险分 {c.riskScore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
