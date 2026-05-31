import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const PORTFOLIOS = [
  {
    id: 'p1', name: '稳健成长组合', customer: 'Zhao Lei', riskProfile: 'MODERATE',
    totalValue: '2,847,320.00', pnl: '184,291.00', pnlPct: '6.92', currency: 'USD',
    holdings: [
      { symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'EQUITY', quantity: '500', avgCost: '165.20', currentPrice: '182.40', currency: 'USD' },
      { symbol: 'US10Y', name: 'US Treasury 10Y', assetClass: 'FIXED_INCOME', quantity: '1000000', avgCost: '0.9821', currentPrice: '0.9740', currency: 'USD' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', assetClass: 'EQUITY', quantity: '300', avgCost: '310.40', currentPrice: '415.80', currency: 'USD' },
      { symbol: 'SPX500', name: 'S&P 500 ETF', assetClass: 'EQUITY', quantity: '800', avgCost: '420.10', currentPrice: '538.22', currency: 'USD' },
      { symbol: 'CASH', name: 'Money Market Fund', assetClass: 'MONEY_MARKET', quantity: '284291', avgCost: '1.00', currentPrice: '1.00', currency: 'USD' },
    ],
  },
  {
    id: 'p2', name: '进取成长组合', customer: 'Priya Sharma', riskProfile: 'AGGRESSIVE',
    totalValue: '1,240,800.00', pnl: '312,400.00', pnlPct: '33.61', currency: 'USD',
    holdings: [
      { symbol: 'NVDA', name: 'NVIDIA Corp.', assetClass: 'EQUITY', quantity: '200', avgCost: '480.20', currentPrice: '1,050.40', currency: 'USD' },
      { symbol: 'BTC-T', name: 'Bitcoin Trust', assetClass: 'ALTERNATIVE', quantity: '50', avgCost: '12,400.00', currentPrice: '18,200.00', currency: 'USD' },
    ],
  },
];

const PERF_DATA = [
  { month: 'Jan', value: 2_540_000 }, { month: 'Feb', value: 2_610_000 },
  { month: 'Mar', value: 2_480_000 }, { month: 'Apr', value: 2_690_000 },
  { month: 'May', value: 2_780_000 }, { month: 'Jun', value: 2_847_320 },
];

const CLASS_COLORS: Record<string, string> = { EQUITY: '#3b82f6', FIXED_INCOME: '#22c55e', MONEY_MARKET: '#f59e0b', ALTERNATIVE: '#a855f7', REAL_ESTATE: '#06b6d4', COMMODITY: '#ef4444' };
const RISK_COLORS: Record<string, string> = { CONSERVATIVE: 'green', MODERATE: 'blue', AGGRESSIVE: 'red' };

export default function Wealth() {
  const [selected, setSelected] = useState(PORTFOLIOS[0].id);
  const portfolio = PORTFOLIOS.find(p => p.id === selected) ?? PORTFOLIOS[0];

  // Compute allocation breakdown
  const allocation = portfolio.holdings.reduce((acc: Record<string, number>, h) => {
    const mv = parseFloat(h.quantity.replace(/,/g, '')) * parseFloat(h.currentPrice.replace(/,/g, ''));
    acc[h.assetClass] = (acc[h.assetClass] ?? 0) + mv;
    return acc;
  }, {});
  const totalMv = Object.values(allocation).reduce((a, b) => a + b, 0);
  const pieData = Object.entries(allocation).map(([name, value]) => ({ name, value, pct: (value / totalMv * 100).toFixed(1) }));

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card purple"><div className="kpi-label">资产管理规模</div><div className="kpi-value" style={{ fontSize: 20 }}>$934M</div><div className="kpi-delta up">↑ 2.1%</div></div>
        <div className="kpi-card green"><div className="kpi-label">总未实现盈亏</div><div className="kpi-value" style={{ fontSize: 18 }}>+$84.2M</div><div className="kpi-delta up">YTD +9.8%</div></div>
        <div className="kpi-card blue"><div className="kpi-label">投资组合数量</div><div className="kpi-value">1,284</div></div>
        <div className="kpi-card amber"><div className="kpi-label">本月交易订单</div><div className="kpi-value">847</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Portfolio List */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">投资组合</span>
            <button className="btn btn-primary">+ 新建组合</button>
          </div>
          {PORTFOLIOS.map((p) => (
            <div key={p.id} onClick={() => setSelected(p.id)} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected === p.id ? 'rgba(59,130,246,0.05)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <span className={`badge badge-${RISK_COLORS[p.riskProfile]}`}>{p.riskProfile}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>客户: {p.customer}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{p.currency} {p.totalValue}</span>
                <span style={{ color: parseFloat(p.pnl) > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                  +{p.pnlPct}% <span style={{ fontSize: 11 }}>(+${p.pnl})</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">{portfolio.name} — 净值走势</span>
            <span className="tag">6个月</span>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERF_DATA}>
                <defs>
                  <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1e6).toFixed(2)}M`} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, '组合价值']} />
                <Area type="monotone" dataKey="value" stroke="#a855f7" fill="url(#wealthGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Allocation Pie */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={CLASS_COLORS[e.name] ?? '#64748b'} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>资产配置</div>
              {pieData.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: CLASS_COLORS[d.name] ?? '#64748b', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">持仓明细 — {portfolio.name}</span>
          <button className="btn btn-primary">下达买入/卖出指令</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>代码</th><th>名称</th><th>资产类别</th><th>持仓数量</th><th>均价成本</th><th>当前价格</th><th>市值</th><th>盈亏</th><th>盈亏%</th></tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((h) => {
                const qty = parseFloat(h.quantity.replace(/,/g, ''));
                const cost = parseFloat(h.avgCost.replace(/,/g, ''));
                const price = parseFloat(h.currentPrice.replace(/,/g, ''));
                const mv = qty * price;
                const pnl = qty * (price - cost);
                const pnlPct = ((price - cost) / cost * 100);
                return (
                  <tr key={h.symbol}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{h.symbol}</td>
                    <td>{h.name}</td>
                    <td><span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${CLASS_COLORS[h.assetClass]}22`, color: CLASS_COLORS[h.assetClass] }}>{h.assetClass}</span></td>
                    <td style={{ fontFamily: 'monospace' }}>{parseFloat(h.quantity) > 1000 ? qty.toLocaleString() : h.quantity}</td>
                    <td style={{ fontFamily: 'monospace' }}>{h.avgCost}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{h.currentPrice}</td>
                    <td style={{ fontFamily: 'monospace' }}>${mv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ fontFamily: 'monospace', color: pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {pnl >= 0 ? '+' : ''}{pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontWeight: 600, color: pnlPct >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
