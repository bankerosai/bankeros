/**
 * Market Risk Management
 * VaR · Greeks · Sensitivity Analysis · Stress Testing · FRTB compliance
 */

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar } from 'recharts';

const VAR_TREND = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  var95: 18 + Math.sin(i / 3) * 4 + Math.random() * 2,
  var99: 28 + Math.sin(i / 3) * 6 + Math.random() * 3,
  limit: 50,
}));

export default function MarketRisk() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>📊 市场风险管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          VaR (Value at Risk) · Greeks (Delta/Gamma/Vega/Theta) · 压力测试 · FRTB (Fundamental Review of Trading Book) 合规
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'VaR (95%, 1日)', value: '¥ 24.8M', sub: '当前敞口', color: 'var(--accent-blue)' },
          { label: 'VaR (99%, 1日)', value: '¥ 38.2M', sub: '极端损失', color: 'var(--accent-amber)' },
          { label: 'VaR 限额',       value: '¥ 50M',   sub: '使用率 76%', color: 'var(--accent-green)' },
          { label: 'CVaR (TVaR)',   value: '¥ 52.4M', sub: '超 VaR 平均损失', color: 'var(--accent-red)' },
          { label: '回测违例',       value: '2 次/年', sub: '在阈值内 (≤4)', color: 'var(--accent-green)' },
          { label: 'FRTB SA-MR',    value: '¥ 184M',  sub: 'RWA 标准法', color: 'var(--accent-cyan)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* VaR Trend */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">VaR 30 日走势 (历史模拟法)</span>
            <span className="badge badge-green">在限额内</span>
          </div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VAR_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="M" />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="var95" name="VaR 95%" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="var99" name="VaR 99%" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="limit" name="限额"   stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Greeks Exposure */}
        <div className="card">
          <div className="section-header"><span className="section-title">Greeks 敞口分析 (衍生品)</span></div>
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>风险因子</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Delta</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Gamma</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Vega</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Theta</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['🇺🇸 USD/CNY', '+1,240', '+24', '+182', '-18'],
                ['🇪🇺 EUR/CNY', '-540', '-12', '+95', '-8'],
                ['🇬🇧 GBP/CNY', '+320', '+8', '+45', '-4'],
                ['📈 沪深 300',  '+2,180', '+45', '+340', '-28'],
                ['📈 标普 500',  '+820', '+18', '+125', '-12'],
                ['🟡 黄金',     '+450', '+10', '+85', '-7'],
                ['🛢 原油 WTI', '-180', '-5', '+42', '-3'],
              ].map(r => (
                <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r[0]}</td>
                  {r.slice(1).map((v, i) => (
                    <td key={i} style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: v.startsWith('-') ? 'var(--accent-red)' : 'var(--accent-green)' }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>⚡ 市场压力情景测试</div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>历史情景</th>
              <th style={{ padding: 12 }}>描述</th>
              <th style={{ padding: 12, textAlign: 'right' }}>预估损失</th>
              <th style={{ padding: 12, textAlign: 'right' }}>资本影响</th>
              <th style={{ padding: 12 }}>评估</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: '2008 金融危机',  desc: '股市 -45% · 信用利差 +400bp · 流动性枯竭', loss: '¥ 184M', impact: '-0.8% CET1', pass: true },
              { name: '2020 新冠冲击',  desc: '股市 -30% · USD 暴涨 · 油价 -60%',          loss: '¥ 142M', impact: '-0.6% CET1', pass: true },
              { name: '2022 加息周期',  desc: 'Fed +500bp · 长债收益率上升 · 科技股 -35%',  loss: '¥ 98M',  impact: '-0.4% CET1', pass: true },
              { name: '2015 汇改情景',  desc: 'USD/CNY 一次性贬值 5% · 资本外流',          loss: '¥ 240M', impact: '-1.1% CET1', pass: true },
              { name: '黑天鹅 (假设)',  desc: '同时发生股灾 + 汇率危机 + 信用违约潮',       loss: '¥ 580M', impact: '-2.6% CET1', pass: false },
            ].map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: 12, fontSize: 12, color: 'var(--text-secondary)' }}>{s.desc}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-red)' }}>{s.loss}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-amber)' }}>{s.impact}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge ${s.pass ? 'badge-green' : 'badge-amber'}`}>{s.pass ? '✓ 在承受范围' : '⚠ 需补充资本'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 14 }}>📋 交易限额监控 (Trading Desk Limits)</div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>交易台</th>
              <th style={{ padding: 12 }}>负责人</th>
              <th style={{ padding: 12, textAlign: 'right' }}>VaR 限额</th>
              <th style={{ padding: 12, textAlign: 'right' }}>当前使用</th>
              <th style={{ padding: 12, textAlign: 'right' }}>使用率</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['FX Spot 现汇台',   '王浩明', 15, 11.2, 74.7, 'normal'],
              ['FX Derivatives',   '李静茹', 12, 10.8, 90.0, 'warning'],
              ['利率掉期 IRS',     '张大伟', 20, 12.4, 62.0, 'normal'],
              ['股票自营',         '陈志诚', 8,  4.8,  60.0, 'normal'],
              ['信用债',           '刘晓琳', 18, 16.1, 89.4, 'warning'],
              ['大宗商品',         '赵建国', 6,  2.1,  35.0, 'normal'],
            ].map((r: any) => (
              <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{r[0]}</td>
                <td style={{ padding: 12 }}>{r[1]}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>¥ {r[2]}M</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>¥ {r[3]}M</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${r[4]}%`, height: '100%', background: r[4] > 85 ? 'var(--accent-red)' : r[4] > 70 ? 'var(--accent-amber)' : 'var(--accent-green)' }} />
                    </div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{r[4]}%</span>
                  </div>
                </td>
                <td style={{ padding: 12 }}><span className={`badge badge-${r[5] === 'warning' ? 'amber' : 'green'}`}>{r[5] === 'warning' ? '接近上限' : '正常'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
