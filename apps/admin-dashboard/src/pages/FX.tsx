import { useState } from 'react';
import { MOCK } from '../api/client';

export default function FX() {
  const [buyCcy, setBuyCcy] = useState('EUR');
  const [sellCcy, setSellCcy] = useState('USD');
  const [amount, setAmount] = useState('1000000');
  const [tradeType, setTradeType] = useState('SPOT');

  const selectedRate = MOCK.fxRates.find(r => r.pair === `${buyCcy}/${sellCcy}`) || MOCK.fxRates[0];
  const execRate = selectedRate ? parseFloat(selectedRate.ask) : 1;
  const sellAmount = (parseFloat(amount || '0') * execRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">今日 FX 成交量</div><div className="kpi-value" style={{ fontSize: 18 }}>$2.4B</div></div>
        <div className="kpi-card green"><div className="kpi-label">即期成交笔数</div><div className="kpi-value">1,847</div></div>
        <div className="kpi-card amber"><div className="kpi-label">远期合约</div><div className="kpi-value">284</div></div>
        <div className="kpi-card purple"><div className="kpi-label">FX 敞口 (USD等值)</div><div className="kpi-value" style={{ fontSize: 18 }}>$180M</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Live Rates */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">实时汇率报价台</span>
            <span className="tag" style={{ color: 'var(--accent-green)', borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)' }}>● LIVE</span>
          </div>
          <table>
            <thead>
              <tr><th>货币对</th><th>买入价 (Bid)</th><th>卖出价 (Ask)</th><th>中间价</th><th>涨跌</th></tr>
            </thead>
            <tbody>
              {MOCK.fxRates.map((r) => (
                <tr key={r.pair}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{r.pair}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-green)' }}>{r.bid}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-red)' }}>{r.ask}</td>
                  <td style={{ fontFamily: 'monospace' }}>{r.mid}</td>
                  <td>
                    <span style={{ color: r.change.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)', fontSize: 12, fontWeight: 600 }}>
                      {r.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trade Blotter */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>发起 FX 交易指令</div>

          <div className="form-group">
            <label className="form-label">交易类型</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['SPOT', 'FORWARD'].map((t) => (
                <button key={t} onClick={() => setTradeType(t)}
                  className="btn"
                  style={{ flex: 1, background: tradeType === t ? 'var(--accent-blue)' : 'var(--bg-secondary)', color: tradeType === t ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                  {t === 'SPOT' ? '即期 (T+2)' : '远期'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">买入货币</label>
              <select className="form-input" value={buyCcy} onChange={e => setBuyCcy(e.target.value)}>
                {['EUR', 'GBP', 'USD', 'JPY', 'CNY', 'HKD', 'SGD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">卖出货币</label>
              <select className="form-input" value={sellCcy} onChange={e => setSellCcy(e.target.value)}>
                {['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'HKD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">买入金额</label>
            <input className="form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1,000,000" />
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-muted)' }}>执行汇率</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{execRate.toFixed(6)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-muted)' }}>应付 {sellCcy}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-amber)' }}>{sellAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>交收日期</span>
              <span style={{ fontSize: 12 }}>{tradeType === 'SPOT' ? 'T+2 (2024-06-03)' : '按协议'}</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            确认执行交易
          </button>
        </div>
      </div>

      {/* Recent FX Trades */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>今日 FX 成交记录</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>交易参考号</th><th>账户</th><th>买入</th><th>卖出</th><th>执行汇率</th><th>类型</th><th>交收日</th><th>状态</th></tr>
            </thead>
            <tbody>
              {[
                { ref: 'FX1716480001', account: 'ACC8842001234', buy: '5,000,000 EUR', sell: '5,427,000 USD', rate: '1.08540', type: 'SPOT', settle: '2024-06-01', status: 'CONFIRMED' },
                { ref: 'FX1716480002', account: 'ACC7731009182', buy: '10,000,000 USD', sell: '1,498,700 JPY', rate: '149.870', type: 'SPOT', settle: '2024-06-01', status: 'CONFIRMED' },
                { ref: 'FX1716480003', account: 'ACC6620118472', buy: '2,000,000 GBP', sell: '2,534,800 USD', rate: '1.26740', type: 'FORWARD', settle: '2024-09-01', status: 'CONFIRMED' },
              ].map((t) => (
                <tr key={t.ref}>
                  <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{t.ref}</code></td>
                  <td><code style={{ fontSize: 11 }}>{t.account}</code></td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{t.buy}</td>
                  <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{t.sell}</td>
                  <td style={{ fontFamily: 'monospace' }}>{t.rate}</td>
                  <td><span className={`badge badge-${t.type === 'SPOT' ? 'blue' : 'purple'}`}>{t.type}</span></td>
                  <td style={{ fontSize: 12 }}>{t.settle}</td>
                  <td><span className="badge badge-green">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
