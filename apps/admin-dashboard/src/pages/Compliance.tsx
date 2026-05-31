import { MOCK } from '../api/client';

export default function Compliance() {
  const statusBadge = (s: string) => {
    const m: Record<string, string> = { OPEN: 'red', UNDER_REVIEW: 'amber', ESCALATED: 'purple', CLOSED_SAR: 'blue', CLOSED_NO_ACTION: 'gray' };
    return <span className={`badge badge-${m[s] ?? 'gray'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card red"><div className="kpi-label">开放案件</div><div className="kpi-value">8</div></div>
        <div className="kpi-card amber"><div className="kpi-label">审核中</div><div className="kpi-value">11</div></div>
        <div className="kpi-card purple"><div className="kpi-label">已上报</div><div className="kpi-value">4</div></div>
        <div className="kpi-card blue"><div className="kpi-label">本月 SAR</div><div className="kpi-value">2</div></div>
        <div className="kpi-card green"><div className="kpi-label">今日制裁筛查</div><div className="kpi-value">12,847</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>制裁名单实时筛查</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>覆盖名单：OFAC SDN · UN 1267 · EU 合并名单 · HMT 制裁</div>
          <div className="form-group">
            <label className="form-label">被筛查主体名称</label>
            <input className="form-input" placeholder="输入个人/企业名称…" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">国籍/注册国</label>
              <select className="form-input"><option>全部</option><option>CN</option><option>US</option><option>AE</option><option>RU</option><option>IR</option></select>
            </div>
            <div className="form-group">
              <label className="form-label">筛查类型</label>
              <select className="form-input"><option>CUSTOMER</option><option>COUNTERPARTY</option><option>PAYMENT</option></select>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>执行制裁筛查</button>

          <div style={{ marginTop: 16, padding: 14, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
            <div style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>✓ 未发现制裁匹配</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>4 个名单 · 匹配分 0.01 · 无 PEP 标记</div>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>欺诈评分引擎（实时）</div>
          {[
            { ref: 'PAY4A7B2C1D', score: 0.12, decision: 'PASS', factors: [] },
            { ref: 'PAY1K7L0M5N', score: 0.94, decision: 'BLOCK', factors: ['highValue', 'highRiskCountry', 'velocityHigh'] },
            { ref: 'PAYVW4X8Y9Z', score: 0.31, decision: 'REVIEW', factors: ['crossBorder'] },
          ].map((item) => (
            <div key={item.ref} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{item.ref}</code>
                <span className={`badge badge-${item.decision === 'PASS' ? 'green' : item.decision === 'REVIEW' ? 'amber' : 'red'}`}>
                  {item.decision}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${item.score * 100}%`, height: '100%', borderRadius: 3, background: item.score > 0.7 ? 'var(--accent-red)' : item.score > 0.3 ? 'var(--accent-amber)' : 'var(--accent-green)' }} />
                </div>
                <span style={{ fontWeight: 700, minWidth: 36, fontSize: 12 }}>{item.score.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {item.factors.map((f) => <span key={f} className="badge badge-red" style={{ fontSize: 10 }}>{f}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">合规案件列表</span>
          <button className="btn btn-primary">+ 新建案件</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>案件编号</th><th>类型</th><th>状态</th><th>风险评分</th><th>描述</th><th>创建时间</th><th>操作</th></tr>
            </thead>
            <tbody>
              {MOCK.complianceCases.map((c) => (
                <tr key={c.id}>
                  <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{c.caseNumber}</code></td>
                  <td>
                    <span className={`badge badge-${c.type === 'SAR' ? 'red' : c.type === 'EDD' ? 'amber' : 'blue'}`}>
                      {c.type}
                    </span>
                  </td>
                  <td>{statusBadge(c.status)}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: parseFloat(c.riskScore) > 0.7 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                      {c.riskScore}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 300 }}>{c.description}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString('zh-CN')}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>处置</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
