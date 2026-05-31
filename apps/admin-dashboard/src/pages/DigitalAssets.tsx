import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WALLETS = [
  { id: 'w1', address: '0x3f9a2b8c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a', type: 'CUSTODY', assets: [{ symbol: 'ETH', balance: '1,240.84', valueUsd: '$4,521,860' }, { symbol: 'USDC', balance: '2,000,000.00', valueUsd: '$2,000,000' }] },
  { id: 'w2', address: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', type: 'CBDC', assets: [{ symbol: 'e-HKD', balance: '50,000,000.00', valueUsd: '$6,410,256' }, { symbol: 'e-CNY', balance: '10,000,000.00', valueUsd: '$1,380,042' }] },
  { id: 'w3', address: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d', type: 'TOKENIZED_DEPOSIT', assets: [{ symbol: 'BOND-USD-2026', balance: '5,000.00', valueUsd: '$4,872,000' }] },
];

const TOKENS = [
  { symbol: 'BOND-USD-2026', name: 'USD Treasury Bond 2026', type: 'BOND', supply: '10,000', faceValue: '1,000', currency: 'USD', coupon: '4.75%', maturity: '2026-03-15', status: 'ISSUED' },
  { symbol: 'PROP-SG-01', name: 'Singapore Marina Bay REIT Token', type: 'REAL_ESTATE', supply: '1,000,000', faceValue: '10', currency: 'SGD', coupon: '6.20%', maturity: null, status: 'ISSUED' },
];

const PRICE_DATA = [
  { date: '2024-01', eth: 2280 }, { date: '2024-02', eth: 2890 },
  { date: '2024-03', eth: 3480 }, { date: '2024-04', eth: 3120 },
  { date: '2024-05', eth: 3641 }, { date: '2024-06', eth: 3642 },
];

const RECENT_TXS = [
  { hash: '0x4a7b2c...f8a9', from: 'ACC-0001', to: '0xExternal...', asset: 'ETH', amount: '50.00', status: 'CONFIRMED', travelRule: true, time: '14:32' },
  { hash: '0x1d3e5f...c2b4', from: 'CBDC-Pool', to: 'BNM-Node', asset: 'e-CNY', amount: '5,000,000', status: 'CONFIRMED', travelRule: false, time: '12:18' },
  { hash: '0x9f8e7d...a3b2', from: '0xInternal', to: 'ACC-0003', asset: 'USDC', amount: '250,000', status: 'PENDING', travelRule: true, time: '11:45' },
];

export default function DigitalAssets() {
  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card purple"><div className="kpi-label">数字资产 AUC</div><div className="kpi-value" style={{ fontSize: 18 }}>$18.8M</div></div>
        <div className="kpi-card blue"><div className="kpi-label">托管钱包数</div><div className="kpi-value">47</div></div>
        <div className="kpi-card green"><div className="kpi-label">已发行代币化资产</div><div className="kpi-value">12</div><div className="kpi-delta">$48M 规模</div></div>
        <div className="kpi-card cyan"><div className="kpi-label">mBridge 净结算</div><div className="kpi-value">$6.4M</div><div className="kpi-delta">今日 PvP</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Travel Rule 合规率</div><div className="kpi-value">100%</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Wallets */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">托管钱包</span>
            <button className="btn btn-primary">+ 创建钱包</button>
          </div>
          {WALLETS.map((w) => (
            <div key={w.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className={`badge badge-${w.type === 'CUSTODY' ? 'blue' : w.type === 'CBDC' ? 'cyan' : 'purple'}`}>{w.type}</span>
                <span style={{ fontSize: 11, color: 'var(--accent-green)' }}>● HSM/MPC 保护</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, wordBreak: 'break-all' }}>{w.address}</div>
              {w.assets.map((a) => (
                <div key={a.symbol} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{a.symbol}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'monospace' }}>{a.balance}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 8 }}>{a.valueUsd}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ETH Price Chart */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">ETH/USD 价格走势</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-purple)' }}>$3,642</span>
          </div>
          <div style={{ height: 160, marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRICE_DATA}>
                <defs>
                  <linearGradient id="ethGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'ETH/USD']} />
                <Area type="monotone" dataKey="eth" stroke="#a855f7" fill="url(#ethGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* mBridge Status */}
          <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>mBridge 多边 CBDC 网络</span>
              <span style={{ color: 'var(--accent-green)', fontSize: 12 }}>● 运行中</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <span>参与央行: HKMA · PBoC · CBUAE · BOT</span>
              <span>结算模式: PvP 原子交收</span>
              <span>区块高度: #1,234,567</span>
              <span>平均结算: 3 秒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tokenized Assets */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title">代币化资产（ERC-1400 安全代币）</span>
          <button className="btn btn-primary">+ 发行新代币</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>代币符号</th><th>资产名称</th><th>类型</th><th>发行总量</th><th>面值</th><th>票息/收益率</th><th>到期日</th><th>状态</th></tr></thead>
            <tbody>
              {TOKENS.map((t) => (
                <tr key={t.symbol}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{t.symbol}</td>
                  <td>{t.name}</td>
                  <td><span className="badge badge-purple">{t.type}</span></td>
                  <td style={{ fontFamily: 'monospace' }}>{t.supply}</td>
                  <td style={{ fontFamily: 'monospace' }}>{t.currency} {t.faceValue}</td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{t.coupon}</td>
                  <td style={{ fontSize: 12 }}>{t.maturity ?? '永续'}</td>
                  <td><span className="badge badge-green">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Blockchain Transactions */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>最新链上交易</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>交易哈希</th><th>发送方</th><th>接收方</th><th>资产</th><th>金额</th><th>Travel Rule</th><th>状态</th><th>时间</th></tr></thead>
            <tbody>
              {RECENT_TXS.map((tx) => (
                <tr key={tx.hash}>
                  <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{tx.hash}</code></td>
                  <td style={{ fontSize: 12 }}>{tx.from}</td>
                  <td style={{ fontSize: 12 }}>{tx.to}</td>
                  <td style={{ fontWeight: 600 }}>{tx.asset}</td>
                  <td style={{ fontFamily: 'monospace' }}>{tx.amount}</td>
                  <td>{tx.travelRule ? <span className="badge badge-green">✓ 合规</span> : <span className="badge badge-gray">N/A</span>}</td>
                  <td><span className={`badge badge-${tx.status === 'CONFIRMED' ? 'green' : 'amber'}`}>{tx.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
