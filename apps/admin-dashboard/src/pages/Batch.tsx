import { useState } from 'react';

const JOBS = [
  { id: 'j1', name: 'EOD_INTEREST_2024-05-30', type: 'EOD_INTEREST', businessDate: '2024-05-30', status: 'COMPLETED', progress: 100, processed: 48291, total: 48291, errors: 0, duration: '4m 32s', startedAt: '23:55:00', completedAt: '23:59:32' },
  { id: 'j2', name: 'EOD_REVALUATION_2024-05-30', type: 'EOD_REVALUATION', businessDate: '2024-05-30', status: 'COMPLETED', progress: 100, processed: 12, total: 12, errors: 0, duration: '0m 18s', startedAt: '23:59:35', completedAt: '23:59:53' },
  { id: 'j3', name: 'OVERDUE_CHECK_2024-05-30', type: 'OVERDUE_CHECK', businessDate: '2024-05-30', status: 'COMPLETED', progress: 100, processed: 4968, total: 4968, errors: 0, duration: '0m 42s', startedAt: '00:00:01', completedAt: '00:00:43' },
  { id: 'j4', name: 'EOD_INTEREST_2024-05-29', type: 'EOD_INTEREST', businessDate: '2024-05-29', status: 'COMPLETED', progress: 100, processed: 47891, total: 47891, errors: 0, duration: '4m 18s', startedAt: '23:55:00', completedAt: '23:59:18' },
  { id: 'j5', name: 'REPORT_GEN_2024-05-01', type: 'REPORT_GEN', businessDate: '2024-05-01', status: 'COMPLETED', progress: 100, processed: 24, total: 24, errors: 2, duration: '2m 04s', startedAt: '06:00:00', completedAt: '06:02:04' },
];

const REPORTS = [
  { code: 'BALANCE_SHEET', name: '资产负债表', frequency: '月末', lastRun: '2024-04-30', standard: 'IFRS 9' },
  { code: 'PAYMENT_VOLUME', name: '支付量统计报表', frequency: '每日', lastRun: '2024-05-30', standard: '央行报送' },
  { code: 'LOAN_PORTFOLIO', name: '贷款组合质量报告', frequency: '月末', lastRun: '2024-04-30', standard: 'BCBS 239' },
  { code: 'LIQUIDITY_RATIO', name: '流动性覆盖率 (LCR)', frequency: '每日', lastRun: '2024-05-30', standard: 'Basel III' },
  { code: 'CAPITAL_ADEQUACY', name: '资本充足率 (CAR)', frequency: '季度', lastRun: '2024-03-31', standard: 'Basel III' },
  { code: 'AML_SUMMARY', name: '反洗钱汇总报告', frequency: '月末', lastRun: '2024-04-30', standard: 'FATF' },
];

const statusColor: Record<string, string> = { COMPLETED: 'green', RUNNING: 'blue', FAILED: 'red', PENDING: 'amber', CANCELLED: 'gray' };
const typeColor: Record<string, string> = { EOD_INTEREST: 'blue', EOD_REVALUATION: 'purple', OVERDUE_CHECK: 'amber', REPORT_GEN: 'green' };

export default function Batch() {
  const [selectedDate, setSelectedDate] = useState('2024-05-31');
  const [running, setRunning] = useState(false);

  function triggerEod() {
    setRunning(true);
    setTimeout(() => setRunning(false), 3000);
  }

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card green"><div className="kpi-label">今日 EOD 状态</div><div className="kpi-value" style={{ fontSize: 14 }}>✓ 完成</div><div className="kpi-delta up">23:59:53</div></div>
        <div className="kpi-card blue"><div className="kpi-label">今日处理账户</div><div className="kpi-value">48,291</div></div>
        <div className="kpi-card amber"><div className="kpi-label">逾期识别</div><div className="kpi-value">147</div><div className="kpi-delta down">+3 新增</div></div>
        <div className="kpi-card purple"><div className="kpi-label">利息计提总额</div><div className="kpi-value" style={{ fontSize: 18 }}>$284K</div></div>
        <div className="kpi-card red"><div className="kpi-label">批处理错误</div><div className="kpi-value">2</div><div className="kpi-delta">报表生成模块</div></div>
      </div>

      {/* EOD Trigger Panel */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>手动触发 EOD 批处理</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            正常情况下由 <code style={{ color: 'var(--accent-cyan)' }}>node-cron</code> 在每日 23:55 UTC 自动触发。
            此界面用于紧急补跑或特定业务日期的手动触发。
          </div>
          <div className="form-group">
            <label className="form-label">业务日期 (Business Date)</label>
            <input className="form-input" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>将执行以下操作：</div>
            {['存款账户日计息（普通账户 2.0% p.a.）', '逾期贷款状态跃迁 (ACTIVE → OVERDUE)', 'ECB 汇率拉取与外币敞口重估', '试算表快照生成'].map((s) => (
              <div key={s} style={{ color: 'var(--text-muted)', marginBottom: 3 }}>· {s}</div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={triggerEod} disabled={running}>
            {running ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> 执行中…</> : `触发 ${selectedDate} EOD 批处理`}
          </button>
          {running && (
            <div style={{ marginTop: 12, padding: 12, background: 'rgba(59,130,246,0.1)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span>日计息 – 活跃账户</span><span style={{ color: 'var(--accent-cyan)' }}>进行中…</span>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress-fill" style={{ width: '62%', background: 'var(--accent-blue)', animation: 'none' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>已处理 29,940 / 48,291 账户</div>
            </div>
          )}
        </div>

        {/* Regulatory Reports */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">监管报表生成</span>
            <span className="tag">Basel III / BCBS239</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>报表</th><th>频率</th><th>最后生成</th><th>标准</th><th>操作</th></tr></thead>
              <tbody>
                {REPORTS.map((r) => (
                  <tr key={r.code}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td><span className="badge badge-gray">{r.frequency}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.lastRun}</td>
                    <td style={{ fontSize: 11, color: 'var(--accent-blue)' }}>{r.standard}</td>
                    <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>生成</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Job History */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>批处理任务历史</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>任务名称</th><th>类型</th><th>业务日期</th><th>状态</th><th>进度</th><th>处理量</th><th>错误</th><th>耗时</th></tr></thead>
            <tbody>
              {JOBS.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontSize: 12 }}><code style={{ color: 'var(--text-secondary)' }}>{j.name}</code></td>
                  <td><span className={`badge badge-${typeColor[j.type] ?? 'gray'}`} style={{ fontSize: 10 }}>{j.type}</span></td>
                  <td style={{ fontSize: 12 }}>{j.businessDate}</td>
                  <td><span className={`badge badge-${statusColor[j.status]}`}>{j.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${j.progress}%`, height: '100%', background: j.status === 'FAILED' ? 'var(--accent-red)' : 'var(--accent-green)' }} />
                      </div>
                      <span style={{ fontSize: 11 }}>{j.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{j.processed.toLocaleString()} / {j.total.toLocaleString()}</td>
                  <td style={{ color: j.errors > 0 ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: j.errors > 0 ? 700 : 400 }}>{j.errors}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{j.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
