import { useState } from 'react';

const PRODUCTS = [
  { id: 'p1', code: 'PERSONAL_FIXED', name: '个人固定利率贷款', type: 'PERSONAL', currency: 'USD', minAmount: '1,000', maxAmount: '50,000', minTerm: 6, maxTerm: 60, rate: '8.90%', penalty: '2.00%', grace: 5, frequency: 'MONTHLY', isActive: true, loansCount: 2841 },
  { id: 'p2', code: 'SME_REVOLVING', name: '中小企业循环信贷', type: 'SME', currency: 'USD', minAmount: '50,000', maxAmount: '5,000,000', minTerm: 12, maxTerm: 60, rate: '6.50%', penalty: '3.00%', grace: 10, frequency: 'MONTHLY', isActive: true, loansCount: 284 },
  { id: 'p3', code: 'MORTGAGE_FLOAT', name: '浮动利率住房贷款', type: 'MORTGAGE', currency: 'USD', minAmount: '100,000', maxAmount: '5,000,000', minTerm: 60, maxTerm: 360, rate: '5.25%', penalty: '1.50%', grace: 15, frequency: 'MONTHLY', isActive: true, loansCount: 1847 },
  { id: 'p4', code: 'TRADE_FINANCE_SHORT', name: '贸易融资短期垫款', type: 'TRADE_FINANCE', currency: 'USD', minAmount: '500,000', maxAmount: '50,000,000', minTerm: 1, maxTerm: 12, rate: '4.80%', penalty: '0.50%', grace: 0, frequency: 'BULLET', isActive: true, loansCount: 93 },
  { id: 'p5', code: 'CORPORATE_TERM', name: '企业定期贷款', type: 'CORPORATE', currency: 'USD', minAmount: '1,000,000', maxAmount: '100,000,000', minTerm: 12, maxTerm: 84, rate: '5.90%', penalty: '2.00%', grace: 30, frequency: 'QUARTERLY', isActive: false, loansCount: 47 },
];

const typeColor: Record<string, string> = { PERSONAL: 'blue', SME: 'green', MORTGAGE: 'purple', TRADE_FINANCE: 'cyan', CORPORATE: 'amber', SYNDICATED: 'red' };

export default function Products() {
  const [selected, setSelected] = useState(PRODUCTS[0].id);
  const [showForm, setShowForm] = useState(false);
  const product = PRODUCTS.find(p => p.id === selected) ?? PRODUCTS[0];

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">活跃产品数</div><div className="kpi-value">12</div></div>
        <div className="kpi-card green"><div className="kpi-label">关联贷款总数</div><div className="kpi-value">5,112</div></div>
        <div className="kpi-card amber"><div className="kpi-label">平均利率</div><div className="kpi-value">6.87%</div></div>
        <div className="kpi-card purple"><div className="kpi-label">本月新产品</div><div className="kpi-value">2</div></div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>新建贷款产品</span>
              <button className="btn btn-ghost" style={{ padding: '4px 10px' }} onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: '产品代码 (唯一)', key: 'code', placeholder: 'SME_FIXED_V2' },
                { label: '产品名称', key: 'name', placeholder: '中小企业固定利率贷款 V2' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">贷款类型</label>
                <select className="form-input"><option>PERSONAL</option><option>SME</option><option>MORTGAGE</option><option>CORPORATE</option><option>TRADE_FINANCE</option></select>
              </div>
              <div className="form-group">
                <label className="form-label">还款频率</label>
                <select className="form-input"><option>MONTHLY</option><option>QUARTERLY</option><option>ANNUALLY</option><option>BULLET</option></select>
              </div>
              {[
                { label: '最低金额 (USD)', placeholder: '1000' },
                { label: '最高金额 (USD)', placeholder: '50000' },
                { label: '最短期限 (月)', placeholder: '6' },
                { label: '最长期限 (月)', placeholder: '60' },
                { label: '年利率 (小数)', placeholder: '0.089' },
                { label: '罚息率 (小数)', placeholder: '0.02' },
              ].map(f => (
                <div key={f.label} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder} type="number" step="0.001" />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">宽限期 (天)</label>
                <input className="form-input" placeholder="5" type="number" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>取消</button>
              <button className="btn btn-primary" onClick={() => setShowForm(false)}>创建并上线产品</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Product List */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">产品目录</span>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ 新建产品</button>
          </div>
          {PRODUCTS.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)}
              style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', opacity: p.isActive ? 1 : 0.5, background: selected === p.id ? 'rgba(59,130,246,0.04)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{p.code}</code>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span className={`badge badge-${typeColor[p.type] ?? 'gray'}`} style={{ fontSize: 10 }}>{p.type}</span>
                  <span className={`badge badge-${p.isActive ? 'green' : 'gray'}`} style={{ fontSize: 10 }}>{p.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span>利率: <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{p.rate}</span></span>
                <span>期限: {p.minTerm}~{p.maxTerm}月</span>
                <span>关联贷款: {p.loansCount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Product Detail */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{product.name}</div>
              <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{product.code}</code>
            </div>
            <span className={`badge badge-${product.isActive ? 'green' : 'gray'}`}>{product.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { label: '产品类型', value: product.type },
              { label: '计息币种', value: product.currency },
              { label: '最低申请金额', value: `$${product.minAmount}` },
              { label: '最高申请金额', value: `$${product.maxAmount}` },
              { label: '最短期限', value: `${product.minTerm} 个月` },
              { label: '最长期限', value: `${product.maxTerm} 个月` },
              { label: '年名义利率', value: product.rate, highlight: true },
              { label: '逾期罚息率', value: product.penalty, warn: true },
              { label: '还款频率', value: product.frequency },
              { label: '宽限期', value: `${product.grace} 天` },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontWeight: 600, color: item.highlight ? 'var(--accent-amber)' : item.warn ? 'var(--accent-red)' : 'var(--text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Formula box */}
          <div style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>计息公式 (等额本息 EMI)</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-cyan)', lineHeight: 1.8 }}>
              EMI = P × r × (1+r)^n / ((1+r)^n - 1)<br />
              <span style={{ color: 'var(--text-muted)' }}>r = {product.rate} ÷ 12 = {(parseFloat(product.rate) / 12).toFixed(4)}%/月</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>编辑产品参数</button>
            <button className="btn btn-ghost" style={{ fontSize: 12, color: product.isActive ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {product.isActive ? '停用产品' : '重新激活'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
