/**
 * Operational Risk Management
 * KRI (Key Risk Indicators) · RCSA (Risk & Control Self-Assessment) · Loss Event Database
 * Basel III: Standardized Approach for Operational Risk (SA-OR)
 */

export default function OperationalRisk() {
  const KRI_LIST = [
    { name: '系统宕机次数', current: 2,    threshold: 5,   trend: '↓', unit: '次/月', status: 'green' },
    { name: '员工操作失误率', current: 0.18, threshold: 0.5, trend: '→', unit: '%', status: 'green' },
    { name: '客户投诉数', current: 142,  threshold: 200, trend: '↓', unit: '件/月', status: 'green' },
    { name: '欺诈损失金额', current: 84,   threshold: 100, trend: '↑', unit: '万元/月', status: 'amber' },
    { name: '关键人员流失率', current: 8.2,  threshold: 10,  trend: '↑', unit: '%/年', status: 'amber' },
    { name: '第三方服务中断', current: 0,    threshold: 3,   trend: '→', unit: '次/月', status: 'green' },
    { name: 'IT 安全事件',   current: 18,   threshold: 30,  trend: '↓', unit: '件/月', status: 'green' },
    { name: '审计发现问题数', current: 42,   threshold: 60,  trend: '→', unit: '件/季', status: 'green' },
  ];

  const LOSS_EVENTS = [
    { id: 'LE-2025-0142', date: '2025-05-28', category: '内部欺诈', dept: '信贷部', amount: 480000, severity: 'HIGH', desc: '某客户经理伪造客户资料发放贷款', status: 'INVESTIGATING' },
    { id: 'LE-2025-0141', date: '2025-05-25', category: '系统故障', dept: '运营部', amount: 120000, severity: 'MEDIUM', desc: '核心系统升级导致 4 小时业务中断', status: 'RESOLVED' },
    { id: 'LE-2025-0140', date: '2025-05-22', category: '外部欺诈', dept: '信用卡', amount: 285000, severity: 'HIGH', desc: '伪卡盗刷 32 笔 · 已挂失追回', status: 'PARTIALLY_RECOVERED' },
    { id: 'LE-2025-0139', date: '2025-05-20', category: '执行错误', dept: '清算部', amount: 80000, severity: 'LOW', desc: 'SWIFT 报文错误导致重复支付', status: 'RECOVERED' },
    { id: 'LE-2025-0138', date: '2025-05-18', category: '客户事故', dept: '柜面',   amount: 50000, severity: 'LOW', desc: 'ATM 吞卡 + 错误扣款', status: 'RESOLVED' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>⚙️ 操作风险管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          KRI 关键风险指标 · RCSA 风险与控制自评估 · 损失事件数据库 · 巴塞尔 SA-OR 标准化方法
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: '本月损失事件', value: 47, sub: '↓ 5 vs 上月' },
          { label: '总损失金额',  value: '¥ 1.21M', sub: '↓ 18%' },
          { label: 'KRI 突破阈值', value: '2/8', sub: '欺诈/人员流失', color: 'var(--accent-amber)' },
          { label: 'RCSA 完成率', value: '94%', sub: '420/447 部门' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color ?? 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header"><span className="section-title">🚦 KRI 关键风险指标看板</span></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>指标</th>
              <th style={{ padding: 12, textAlign: 'right' }}>当前值</th>
              <th style={{ padding: 12, textAlign: 'right' }}>阈值</th>
              <th style={{ padding: 12, textAlign: 'right' }}>使用率</th>
              <th style={{ padding: 12, textAlign: 'right' }}>趋势</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {KRI_LIST.map(k => {
              const usage = (k.current / k.threshold) * 100;
              return (
                <tr key={k.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12 }}>{k.name}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{k.current} {k.unit}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{k.threshold} {k.unit}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(usage, 100)}%`, height: '100%', background: usage > 80 ? 'var(--accent-red)' : usage > 60 ? 'var(--accent-amber)' : 'var(--accent-green)' }} />
                      </div>
                      <span style={{ fontFamily: 'monospace' }}>{usage.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: 12, textAlign: 'right', fontSize: 16, color: k.trend === '↓' ? 'var(--accent-green)' : k.trend === '↑' ? 'var(--accent-red)' : 'var(--text-muted)' }}>{k.trend}</td>
                  <td style={{ padding: 12 }}><span className={`badge badge-${k.status}`}>{k.status === 'green' ? '正常' : '关注'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header"><span className="section-title">💥 损失事件登记 (Loss Event Database)</span><button className="btn btn-primary">+ 登记新事件</button></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>事件 ID</th>
              <th style={{ padding: 12 }}>日期</th>
              <th style={{ padding: 12 }}>类别</th>
              <th style={{ padding: 12 }}>部门</th>
              <th style={{ padding: 12, textAlign: 'right' }}>损失金额</th>
              <th style={{ padding: 12 }}>严重性</th>
              <th style={{ padding: 12 }}>描述</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {LOSS_EVENTS.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 11, color: 'var(--accent-cyan)' }}>{e.id}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{e.date}</td>
                <td style={{ padding: 12 }}><span className="badge badge-blue">{e.category}</span></td>
                <td style={{ padding: 12 }}>{e.dept}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-red)' }}>¥ {e.amount.toLocaleString()}</td>
                <td style={{ padding: 12 }}><span className={`badge badge-${e.severity === 'HIGH' ? 'red' : e.severity === 'MEDIUM' ? 'amber' : 'gray'}`}>{e.severity}</span></td>
                <td style={{ padding: 12, fontSize: 12 }}>{e.desc}</td>
                <td style={{ padding: 12 }}><span className={`badge badge-${e.status.includes('RECOVERED') || e.status === 'RESOLVED' ? 'green' : 'amber'}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 14 }}>📋 风险与控制自评估 (RCSA)</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          各业务部门每季度对所属业务流程进行风险识别、控制评估、剩余风险评级
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { dept: '零售信贷部', risks: 184, controls: 420, residual: 'MEDIUM', completion: 100 },
            { dept: '对公信贷部', risks: 142, controls: 380, residual: 'LOW',    completion: 100 },
            { dept: '清算部',     risks: 96,  controls: 280, residual: 'LOW',    completion: 100 },
            { dept: '财富管理部', risks: 78,  controls: 215, residual: 'LOW',    completion: 95 },
            { dept: '金融市场部', risks: 124, controls: 340, residual: 'MEDIUM', completion: 88 },
            { dept: 'IT 信息技术部', risks: 215, controls: 580, residual: 'MEDIUM', completion: 92 },
          ].map(d => (
            <div key={d.dept} style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700 }}>{d.dept}</span>
                <span className={`badge badge-${d.residual === 'HIGH' ? 'red' : d.residual === 'MEDIUM' ? 'amber' : 'green'}`}>剩余风险: {d.residual}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>识别风险</div>
                  <div style={{ fontWeight: 700 }}>{d.risks}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>设置控制</div>
                  <div style={{ fontWeight: 700 }}>{d.controls}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>完成度</div>
                  <div style={{ fontWeight: 700, color: d.completion === 100 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{d.completion}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
