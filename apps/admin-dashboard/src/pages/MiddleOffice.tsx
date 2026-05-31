import { useState } from 'react';

const EXCEPTIONS = [
  { id: 'e1', exceptionId: 'EXC-2024-0841', reconId: 'RECON-20240530', externalRef: 'SWIFT-MSG-00281', amount: '$1,250,000.00', currency: 'USD', reason: 'NO_INTERNAL_MATCH', status: 'OPEN', createdAt: '09:42', description: 'SWIFT MT103 inbound — no matching payment order found in system' },
  { id: 'e2', exceptionId: 'EXC-2024-0840', reconId: 'RECON-20240530', externalRef: 'ACH-BATCH-00129', amount: '$84,200.00', currency: 'USD', reason: 'AMOUNT_MISMATCH', status: 'OPEN', createdAt: '09:18', description: 'ACH debit amount differs by $0.01 from internal record — rounding discrepancy' },
  { id: 'e3', exceptionId: 'EXC-2024-0839', reconId: 'RECON-20240529', externalRef: 'RTGS-TX-00047', amount: '$5,000,000.00', currency: 'USD', reason: 'DUPLICATE_DETECTION', status: 'RESOLVED', createdAt: '2024-05-29 14:22', description: 'Confirmed duplicate RTGS instruction — original already settled. Resolved by Ops Team.' },
  { id: 'e4', exceptionId: 'EXC-2024-0838', reconId: 'RECON-20240529', externalRef: 'SEPA-CT-00891', amount: '€280,000.00', currency: 'EUR', reason: 'VALUE_DATE_MISMATCH', status: 'ESCALATED', createdAt: '2024-05-29 11:05', description: 'SEPA credit transfer value date T+2 but internal booking date T+3 — under investigation' },
];

const RECONS = [
  { id: 'r1', reconId: 'RECON-20240530', source: 'SWIFT-GPI', businessDate: '2024-05-30', totalRecords: 1284, matched: 1282, unmatched: 2, matchRate: '99.84%', status: 'EXCEPTIONS', completedAt: '10:02' },
  { id: 'r2', reconId: 'RECON-20240530-ACH', source: 'ACH-BATCH', businessDate: '2024-05-30', totalRecords: 4821, matched: 4820, unmatched: 1, matchRate: '99.98%', status: 'EXCEPTIONS', completedAt: '09:30' },
  { id: 'r3', reconId: 'RECON-20240529', source: 'RTGS-CBPR', businessDate: '2024-05-29', totalRecords: 284, matched: 282, unmatched: 2, matchRate: '99.30%', status: 'EXCEPTIONS', completedAt: '2024-05-29 23:55' },
  { id: 'r4', reconId: 'RECON-20240528', source: 'SWIFT-GPI', businessDate: '2024-05-28', totalRecords: 1102, matched: 1102, unmatched: 0, matchRate: '100.00%', status: 'CLEAN', completedAt: '2024-05-28 10:08' },
];

const DOCUMENTS = [
  { id: 'd1', fileName: 'loan_agreement_LN8834920011.pdf', entityType: 'LOAN', entityId: 'LN8834920011', sizeBytes: 284210, uploadedAt: '2024-01-15 09:22', uploadedBy: 'loan.officer@bank.io' },
  { id: 'd2', fileName: 'kyc_passport_CIF20240001.jpg', entityType: 'CUSTOMER', entityId: 'CIF20240001', sizeBytes: 1240480, uploadedAt: '2024-01-14 14:11', uploadedBy: 'kyc.team@bank.io' },
  { id: 'd3', fileName: 'lc_LC2024052801_docs.zip', entityType: 'LC', entityId: 'LC2024052801', sizeBytes: 4821024, uploadedAt: '2024-05-28 16:44', uploadedBy: 'trade.ops@bank.io' },
  { id: 'd4', fileName: 'board_resolution_CIF20240002.pdf', entityType: 'CUSTOMER', entityId: 'CIF20240002', sizeBytes: 182400, uploadedAt: '2024-02-03 10:30', uploadedBy: 'compliance@bank.io' },
];

const excStatusColor: Record<string, string> = { OPEN: 'red', ESCALATED: 'purple', RESOLVED: 'green', WRITTEN_OFF: 'gray' };
const reconStatusColor: Record<string, string> = { CLEAN: 'green', EXCEPTIONS: 'amber', RUNNING: 'blue' };

function fmtBytes(n: number): string {
  if (n > 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  return `${(n / 1e3).toFixed(0)} KB`;
}

export default function MiddleOffice() {
  const [tab, setTab] = useState<'reconciliation' | 'exceptions' | 'documents'>('reconciliation');
  const [resolving, setResolving] = useState<string | null>(null);

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card green"><div className="kpi-label">今日对账完成</div><div className="kpi-value">6</div><div className="kpi-delta up">批次</div></div>
        <div className="kpi-card amber"><div className="kpi-label">待处理异常</div><div className="kpi-value">3</div></div>
        <div className="kpi-card red"><div className="kpi-label">升级案件</div><div className="kpi-value">1</div></div>
        <div className="kpi-card blue"><div className="kpi-label">文档总数</div><div className="kpi-value">4,821</div></div>
        <div className="kpi-card purple"><div className="kpi-label">平均匹配率</div><div className="kpi-value">99.78%</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['reconciliation', '自动对账'], ['exceptions', '异常工作流'], ['documents', '文档管理']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as any)} className="btn"
            style={{ background: tab === k ? 'var(--accent-blue)' : 'var(--bg-card)', color: tab === k ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary" onClick={() => {}}>
            {tab === 'reconciliation' ? '+ 触发对账' : tab === 'documents' ? '+ 上传文档' : ''}
          </button>
        </div>
      </div>

      {tab === 'reconciliation' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>对账批次历史</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>批次号</th><th>来源系统</th><th>业务日期</th><th>总记录</th><th>匹配</th><th>异常</th><th>匹配率</th><th>状态</th><th>完成时间</th></tr></thead>
                <tbody>
                  {RECONS.map(r => (
                    <tr key={r.id}>
                      <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{r.reconId}</code></td>
                      <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{r.source}</span></td>
                      <td style={{ fontSize: 12 }}>{r.businessDate}</td>
                      <td style={{ fontFamily: 'monospace' }}>{r.totalRecords.toLocaleString()}</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{r.matched.toLocaleString()}</td>
                      <td style={{ color: r.unmatched > 0 ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: r.unmatched > 0 ? 700 : 400 }}>{r.unmatched}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 50, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: r.matchRate, height: '100%', background: r.unmatched === 0 ? 'var(--accent-green)' : 'var(--accent-amber)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{r.matchRate}</span>
                        </div>
                      </td>
                      <td><span className={`badge badge-${reconStatusColor[r.status]}`}>{r.status}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>触发新对账任务</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">来源系统</label>
                <select className="form-input">
                  <option>SWIFT-GPI</option><option>ACH-BATCH</option><option>RTGS-CBPR</option><option>SEPA-CT</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">业务日期</label>
                <input className="form-input" type="date" defaultValue="2024-05-31" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">文件 / 数据流</label>
                <input className="form-input" placeholder="粘贴外部文件内容或 API 端点" />
              </div>
              <button className="btn btn-primary" style={{ height: 38 }}>执行对账</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'exceptions' && (
        <div>
          {resolving && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="card" style={{ width: 440 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>处置异常: {resolving}</div>
                <div className="form-group">
                  <label className="form-label">处置结论</label>
                  <select className="form-input"><option>RESOLVED</option><option>ESCALATED</option><option>WRITTEN_OFF</option></select>
                </div>
                <div className="form-group">
                  <label className="form-label">处置说明</label>
                  <textarea className="form-input" rows={3} placeholder="填写处置原因和操作步骤…" style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button className="btn btn-ghost" onClick={() => setResolving(null)}>取消</button>
                  <button className="btn btn-primary" onClick={() => setResolving(null)}>确认处置</button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>异常事件列表（待处置）</div>
            {EXCEPTIONS.map(e => (
              <div key={e.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{e.exceptionId}</code>
                    <span className={`badge badge-${excStatusColor[e.status]}`}>{e.status}</span>
                    <span className="badge badge-gray" style={{ fontSize: 10 }}>{e.reason}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.createdAt}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{e.description}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 8 }}>
                  <span>外部参考: <code style={{ color: 'var(--accent-cyan)' }}>{e.externalRef}</code></span>
                  <span>金额: <strong>{e.amount}</strong></span>
                  <span>对账批次: <span style={{ color: 'var(--text-muted)' }}>{e.reconId}</span></span>
                </div>
                {e.status !== 'RESOLVED' && (
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 12px' }} onClick={() => setResolving(e.exceptionId)}>
                    处置此异常
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'documents' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>文档库（加密存储 · 版本控制）</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>文件名</th><th>关联实体类型</th><th>实体 ID</th><th>文件大小</th><th>上传人</th><th>上传时间</th><th>操作</th></tr></thead>
                <tbody>
                  {DOCUMENTS.map(d => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{d.fileName.endsWith('.pdf') ? '📄' : d.fileName.endsWith('.jpg') ? '🖼' : '📦'}</span>
                          <span style={{ fontSize: 12 }}>{d.fileName}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{d.entityType}</span></td>
                      <td><code style={{ fontSize: 10, color: 'var(--accent-cyan)' }}>{d.entityId}</code></td>
                      <td style={{ fontSize: 12 }}>{fmtBytes(d.sizeBytes)}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.uploadedBy}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.uploadedAt}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 8px' }}>查看</button>
                          <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 8px' }}>下载</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>上传新文档</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">关联实体类型</label>
                <select className="form-input"><option>CUSTOMER</option><option>LOAN</option><option>LC</option><option>GUARANTEE</option><option>COMPLIANCE</option></select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">实体 ID</label>
                <input className="form-input" placeholder="LN8834920011 / CIF20240001" />
              </div>
            </div>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>拖拽文件到此处上传</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>支持 PDF · JPEG · PNG · ZIP · DOCX，单文件最大 50MB</div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-ghost" style={{ fontSize: 12 }}>或点击选择文件</button>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
              ⚡ 上传完成后自动生成 SHA-256 校验码，所有文档使用 AES-256-GCM 加密存储，操作行为写入不可篡改审计日志。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
