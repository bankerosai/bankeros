import { useState } from 'react';

const LCS = [
  { id: 'lc1', lcNumber: 'LC2024052801', applicant: 'Zhao Lei Industries', beneficiary: 'Samsung Electronics Co.', beneficiaryBank: 'KEB Hana Bank Seoul', amount: '4,200,000.00', currency: 'USD', expiryDate: '2024-09-30', status: 'ISSUED', goods: 'Electronic Components (8541.10)', swiftRef: 'MT700202405280001' },
  { id: 'lc2', lcNumber: 'LC2024051502', applicant: 'Priya Sharma Imports', beneficiary: 'Tata Steel Ltd', beneficiaryBank: 'SBI Mumbai', amount: '1,850,000.00', currency: 'USD', expiryDate: '2024-08-15', status: 'PRESENTED', goods: 'Hot Rolled Coils (7208.10)', swiftRef: 'MT700202405150002' },
  { id: 'lc3', lcNumber: 'LC2024043003', applicant: 'Gulf Trading FZE', beneficiary: 'Aramco Trading', beneficiaryBank: 'Al Rajhi Bank', amount: '12,500,000.00', currency: 'USD', expiryDate: '2024-07-31', status: 'ADVISED', goods: 'Crude Oil (2709.00)', swiftRef: null },
];

const GUARANTEES = [
  { id: 'bg1', guaranteeNumber: 'BG2024052001', applicant: 'Carlos Mendoza Const.', beneficiary: 'CDMX Metro Authority', type: 'PERFORMANCE_BOND', amount: '2,100,000.00', currency: 'USD', expiryDate: '2025-05-31' },
  { id: 'bg2', guaranteeNumber: 'BG2024044502', applicant: 'Priya Sharma Imports', beneficiary: 'Port Authority of Mumbai', type: 'BID_BOND', amount: '500,000.00', currency: 'USD', expiryDate: '2024-07-15' },
];

const lcStatusColor: Record<string, string> = { ISSUED: 'green', ADVISED: 'blue', PRESENTED: 'amber', ACCEPTED: 'cyan', SETTLED: 'gray', EXPIRED: 'gray', APPLIED: 'purple', AMENDED: 'amber' };
const bgTypeColor: Record<string, string> = { PERFORMANCE_BOND: 'blue', BID_BOND: 'purple', ADVANCE_PAYMENT: 'amber', FINANCIAL: 'green' };

export default function TradeFinance() {
  const [view, setView] = useState<'lc' | 'guarantees'>('lc');
  const [selectedLc, setSelectedLc] = useState<string | null>(null);
  const lc = LCS.find(l => l.id === selectedLc);

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">活跃信用证</div><div className="kpi-value">284</div><div className="kpi-delta">$1.2B 名义金额</div></div>
        <div className="kpi-card amber"><div className="kpi-label">待审单据</div><div className="kpi-value">31</div></div>
        <div className="kpi-card green"><div className="kpi-label">本月结算</div><div className="kpi-value">47</div><div className="kpi-delta up">$180M</div></div>
        <div className="kpi-card purple"><div className="kpi-label">银行保函</div><div className="kpi-value">128</div><div className="kpi-delta">$340M 敞口</div></div>
        <div className="kpi-card cyan"><div className="kpi-label">今日 SWIFT</div><div className="kpi-value">23</div><div className="kpi-delta">MT700/MT707</div></div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['lc', '信用证 (L/C)'], ['guarantees', '银行保函']] .map(([key, label]) => (
          <button key={key} onClick={() => setView(key as any)} className="btn"
            style={{ background: view === key ? 'var(--accent-blue)' : 'var(--bg-card)', color: view === key ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary">+ {view === 'lc' ? '开立信用证' : '开立保函'}</button>
        </div>
      </div>

      {view === 'lc' && (
        <div className="grid-2">
          {/* LC List */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>信用证列表</div>
            {LCS.map((l) => (
              <div key={l.id} onClick={() => setSelectedLc(l.id)} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selectedLc === l.id ? 'rgba(59,130,246,0.05)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{l.lcNumber}</code>
                  <span className={`badge badge-${lcStatusColor[l.status] ?? 'gray'}`}>{l.status}</span>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{l.applicant}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>受益人: {l.beneficiary}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 700 }}>{l.currency} {l.amount}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>到期: {l.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* LC Detail */}
          <div className="card">
            {!lc ? (
              <div className="empty">← 选择信用证查看详情</div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <code style={{ color: 'var(--accent-cyan)', fontSize: 12 }}>{lc.lcNumber}</code>
                    <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{lc.currency} {lc.amount}</div>
                  </div>
                  <span className={`badge badge-${lcStatusColor[lc.status]}`}>{lc.status}</span>
                </div>

                {[
                  ['申请人', lc.applicant], ['受益人', lc.beneficiary],
                  ['受益人银行', lc.beneficiaryBank], ['货物描述', lc.goods],
                  ['到期日期', lc.expiryDate], ['SWIFT 报文号', lc.swiftRef ?? '未发送'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(45,49,72,0.5)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontWeight: 500, maxWidth: 200, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}

                {/* LC Lifecycle Steps */}
                <div style={{ marginTop: 16, marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>生命周期进度</div>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {['申请', '开证', '通知', '交单', '承兑', '结算'].map((step, i) => {
                      const steps: Record<string, number> = { APPLIED: 1, ISSUED: 2, ADVISED: 3, PRESENTED: 4, ACCEPTED: 5, SETTLED: 6 };
                      const current = steps[lc.status] ?? 0;
                      const done = i < current;
                      const active = i === current - 1;
                      return (
                        <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ width: '100%', height: 4, background: done || active ? 'var(--accent-blue)' : 'var(--border)', marginBottom: 6 }} />
                          <div style={{ fontSize: 10, color: active ? 'var(--accent-blue)' : done ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: active ? 700 : 400 }}>{step}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>申请修改</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }}>发 SWIFT</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12 }}>添加不符点</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === 'guarantees' && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>银行保函列表</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>保函编号</th><th>申请人</th><th>受益人</th><th>类型</th><th>金额</th><th>到期日</th><th>操作</th></tr></thead>
              <tbody>
                {GUARANTEES.map((g) => (
                  <tr key={g.id}>
                    <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{g.guaranteeNumber}</code></td>
                    <td>{g.applicant}</td>
                    <td>{g.beneficiary}</td>
                    <td><span className={`badge badge-${bgTypeColor[g.type] ?? 'gray'}`}>{g.type.replace('_', ' ')}</span></td>
                    <td style={{ fontWeight: 600 }}>{g.currency} {g.amount}</td>
                    <td style={{ fontSize: 12 }}>{g.expiryDate}</td>
                    <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>查看</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
