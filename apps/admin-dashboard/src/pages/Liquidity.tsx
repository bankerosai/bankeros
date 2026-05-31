import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const POOLS = [
  {
    id: 'pool1', name: 'APAC Corporate Treasury Pool', masterAccount: 'ACC8841000001', currency: 'USD', isNotional: false,
    members: [
      { name: 'HQ Master Account', accountNumber: 'ACC8841000001', balance: '12,847,200.00', target: null, role: 'MASTER' },
      { name: 'Singapore Subsidiary', accountNumber: 'ACC8841000002', balance: '284,100.00', target: '500,000.00', role: 'MEMBER' },
      { name: 'HK Subsidiary', accountNumber: 'ACC8841000003', balance: '1,920,400.00', target: '2,000,000.00', role: 'MEMBER' },
      { name: 'Shanghai Office', accountNumber: 'ACC8841000004', balance: '430,800.00', target: '300,000.00', role: 'MEMBER' },
    ],
  },
];

const FORECAST = [
  { date: 'Day 1', balance: 12_847_200 }, { date: 'Day 3', balance: 11_920_000 },
  { date: 'Day 5', balance: 13_284_000 }, { date: 'Day 7', balance: 12_100_000 },
  { date: 'Day 10', balance: 14_200_000 }, { date: 'Day 15', balance: 13_847_000 },
  { date: 'Day 20', balance: 12_420_000 }, { date: 'Day 30', balance: 15_100_000 },
];

const FX_RATES = [
  { pair: 'EUR/USD', bid: '1.0851', ask: '1.0857', change: '+0.12%', positive: true },
  { pair: 'GBP/USD', bid: '1.2671', ask: '1.2677', change: '-0.08%', positive: false },
  { pair: 'USD/JPY', bid: '149.84', ask: '149.90', change: '+0.34%', positive: true },
  { pair: 'USD/CNY', bid: '7.2538', ask: '7.2544', change: '-0.05%', positive: false },
  { pair: 'USD/HKD', bid: '7.8149', ask: '7.8153', change: '+0.01%', positive: true },
];

export default function Liquidity() {
  const pool = POOLS[0];
  const totalBalance = pool.members.reduce((s, m) => s + parseFloat(m.balance.replace(/,/g, '')), 0);

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">资金池总头寸</div><div className="kpi-value" style={{ fontSize: 18 }}>$15.48M</div><div className="kpi-delta">USD 等值</div></div>
        <div className="kpi-card green"><div className="kpi-label">今日清扫总额</div><div className="kpi-value" style={{ fontSize: 18 }}>$2.1M</div><div className="kpi-delta up">4 次上划</div></div>
        <div className="kpi-card amber"><div className="kpi-label">名义轧差节省</div><div className="kpi-value">$84,200</div><div className="kpi-delta">利息节约</div></div>
        <div className="kpi-card purple"><div className="kpi-label">活跃资金池</div><div className="kpi-value">12</div><div className="kpi-delta">3 个名义</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Pool Structure */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">{pool.name}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-blue">{pool.isNotional ? 'NOTIONAL' : 'PHYSICAL'}</span>
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '5px 12px' }}>触发清扫</button>
            </div>
          </div>

          {pool.members.map((m, i) => {
            const bal = parseFloat(m.balance.replace(/,/g, ''));
            const tgt = m.target ? parseFloat(m.target.replace(/,/g, '')) : null;
            const pct = (bal / totalBalance * 100).toFixed(1);
            const isAbove = tgt ? bal > tgt : false;
            return (
              <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                    <code style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.accountNumber}</code>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: m.role === 'MASTER' ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      ${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    {m.target && (
                      <div style={{ fontSize: 11, color: isAbove ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                        目标: ${tgt!.toLocaleString()} {isAbove ? '↑ 超出待上划' : '↓ 不足待下拨'}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: m.role === 'MASTER' ? 'var(--accent-cyan)' : 'var(--accent-blue)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 32 }}>{pct}%</span>
                  {m.role === 'MASTER' && <span className="badge badge-cyan" style={{ fontSize: 10 }}>主账户</span>}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>池内合计</span>
            <span style={{ fontWeight: 700 }}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* 30-Day Forecast */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">30 天现金头寸预测</span>
            <span className="tag">模型预测</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FORECAST} barSize={20}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, '预测余额']} />
                <ReferenceLine y={10_000_000} stroke="var(--accent-amber)" strokeDasharray="4 2" label={{ value: '最低限额', fill: '#f59e0b', fontSize: 10 }} />
                <Bar dataKey="balance" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>预测模型输入</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>· 应收账款 (A/R) 到期</span><span>· 贷款还款计划</span>
              <span>· 定期付款合同</span><span>· 历史现金流模式</span>
            </div>
          </div>
        </div>
      </div>

      {/* FX Rates */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">实时外汇参考汇率（ECB 中间价）</span>
          <button className="btn btn-ghost" style={{ fontSize: 12 }}>+ 录入汇率</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>货币对</th><th>买入价</th><th>卖出价</th><th>涨跌</th><th>更新时间</th></tr></thead>
            <tbody>
              {FX_RATES.map((r) => (
                <tr key={r.pair}>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>{r.pair}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-green)' }}>{r.bid}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-red)' }}>{r.ask}</td>
                  <td style={{ fontWeight: 600, color: r.positive ? 'var(--accent-green)' : 'var(--accent-red)' }}>{r.change}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>今日 16:00 ECB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
