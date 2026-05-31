import { useState } from 'react';

const FACILITIES = [
  {
    id: 'f1', facilityNumber: 'FAC2024001', borrower: 'Zhao Lei Industries Ltd',
    type: 'SYNDICATED_TERM', currency: 'USD', totalCommitment: '500,000,000.00',
    drawnAmount: '320,000,000.00', availableAmount: '180,000,000.00',
    interestMargin: '1.85%', referenceRate: 'SOFR', maturityDate: '2029-05-30',
    status: 'ACTIVE',
    participants: [
      { name: 'BankerOS (Agent)', role: 'AGENT', commitment: '100,000,000', share: '20.0%' },
      { name: 'HSBC plc', role: 'MANDATED_LEAD_ARRANGER', commitment: '125,000,000', share: '25.0%' },
      { name: 'JPMorgan Chase', role: 'BOOKRUNNER', commitment: '100,000,000', share: '20.0%' },
      { name: 'Deutsche Bank', role: 'PARTICIPANT', commitment: '75,000,000', share: '15.0%' },
      { name: 'Standard Chartered', role: 'PARTICIPANT', commitment: '100,000,000', share: '20.0%' },
    ],
  },
  {
    id: 'f2', facilityNumber: 'FAC2024002', borrower: 'Gulf Trading FZE',
    type: 'REVOLVING', currency: 'USD', totalCommitment: '200,000,000.00',
    drawnAmount: '80,000,000.00', availableAmount: '120,000,000.00',
    interestMargin: '2.10%', referenceRate: 'SOFR', maturityDate: '2027-12-31',
    status: 'ACTIVE',
    participants: [
      { name: 'BankerOS (Agent)', role: 'AGENT', commitment: '60,000,000', share: '30.0%' },
      { name: 'Emirates NBD', role: 'MANDATED_LEAD_ARRANGER', commitment: '80,000,000', share: '40.0%' },
      { name: 'Abu Dhabi Commercial Bank', role: 'PARTICIPANT', commitment: '60,000,000', share: '30.0%' },
    ],
  },
];

const DRAWDOWNS = [
  { id: 'd1', ref: 'DD20240528001', facility: 'FAC2024001', amount: '$100M', currency: 'USD', tenor: '90 days', rate: '7.28%', settlementDate: '2024-05-30', status: 'FUNDED' },
  { id: 'd2', ref: 'DD20240501002', facility: 'FAC2024001', amount: '$120M', currency: 'USD', tenor: '180 days', rate: '7.31%', settlementDate: '2024-05-03', status: 'FUNDED' },
  { id: 'd3', ref: 'DD20240415003', facility: 'FAC2024002', amount: '$80M',  currency: 'USD', tenor: '120 days', rate: '7.43%', settlementDate: '2024-04-17', status: 'FUNDED' },
];

const roleColor: Record<string, string> = { AGENT: 'cyan', MANDATED_LEAD_ARRANGER: 'blue', BOOKRUNNER: 'purple', PARTICIPANT: 'gray' };

export default function Syndication() {
  const [selected, setSelected] = useState(FACILITIES[0].id);
  const facility = FACILITIES.find(f => f.id === selected) ?? FACILITIES[0];
  const drawn = parseFloat(facility.drawnAmount.replace(/,/g, ''));
  const total = parseFloat(facility.totalCommitment.replace(/,/g, ''));
  const utilizationPct = (drawn / total * 100).toFixed(1);

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">活跃银团授信</div><div className="kpi-value">7</div><div className="kpi-delta">$2.1B 总承诺</div></div>
        <div className="kpi-card amber"><div className="kpi-label">已提款余额</div><div className="kpi-value" style={{ fontSize: 18 }}>$840M</div></div>
        <div className="kpi-card green"><div className="kpi-label">可用额度</div><div className="kpi-value" style={{ fontSize: 18 }}>$1.26B</div></div>
        <div className="kpi-card purple"><div className="kpi-label">本月承诺费收入</div><div className="kpi-value">$1.2M</div></div>
        <div className="kpi-card cyan"><div className="kpi-label">参与行数量</div><div className="kpi-value">24</div></div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Facility List */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">授信额度体系</span>
            <button className="btn btn-primary">+ 新建授信</button>
          </div>
          {FACILITIES.map(f => {
            const dr = parseFloat(f.drawnAmount.replace(/,/g, ''));
            const tot = parseFloat(f.totalCommitment.replace(/,/g, ''));
            const pct = (dr / tot * 100).toFixed(0);
            return (
              <div key={f.id} onClick={() => setSelected(f.id)}
                style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected === f.id ? 'rgba(59,130,246,0.04)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{f.facilityNumber}</code>
                  <span className="badge badge-green">{f.status}</span>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{f.borrower}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  {f.type} · {f.referenceRate} + {f.interestMargin} · 到期 {f.maturityDate}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span>{f.currency} {f.drawnAmount} 已提款</span>
                  <span style={{ fontWeight: 600 }}>{pct}% 使用率</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: parseInt(pct) > 80 ? 'var(--accent-amber)' : 'var(--accent-blue)' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Facility Detail — Participant Table */}
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <code style={{ color: 'var(--accent-cyan)', fontSize: 12 }}>{facility.facilityNumber}</code>
              <span className="badge badge-green">{facility.status}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{facility.borrower}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              {facility.currency} {facility.totalCommitment} · {facility.referenceRate} + {facility.interestMargin} · 到期 {facility.maturityDate}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              {[
                { label: '已提款', value: `$${parseFloat(facility.drawnAmount.replace(/,/g, '')) / 1e6}M` },
                { label: '可用额度', value: `$${parseFloat(facility.availableAmount.replace(/,/g, '')) / 1e6}M` },
                { label: '使用率', value: `${utilizationPct}%` },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="progress-bar" style={{ height: 8, marginBottom: 16 }}>
              <div className="progress-fill" style={{ width: `${utilizationPct}%`, background: parseFloat(utilizationPct) > 80 ? 'var(--accent-amber)' : 'var(--accent-blue)' }} />
            </div>
          </div>

          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>参贷行分配（{facility.participants.length} 家）</div>
          <div className="table-wrap" style={{ maxHeight: 220, overflowY: 'auto' }}>
            <table>
              <thead><tr><th>参与行</th><th>角色</th><th>承诺金额</th><th>份额</th></tr></thead>
              <tbody>
                {facility.participants.map(p => (
                  <tr key={p.name}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{p.name}</td>
                    <td><span className={`badge badge-${roleColor[p.role] ?? 'gray'}`} style={{ fontSize: 10 }}>{p.role.replace(/_/g, ' ')}</span></td>
                    <td style={{ fontFamily: 'monospace' }}>${p.commitment}</td>
                    <td style={{ fontWeight: 600 }}>{p.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>发起提款 (Drawdown)</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>还款分发</button>
          </div>
        </div>
      </div>

      {/* Drawdown History */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">提款记录</span>
          <span className="tag">T+2 交收</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>提款参考号</th><th>所属授信</th><th>金额</th><th>期限</th><th>利率</th><th>交收日期</th><th>状态</th></tr></thead>
            <tbody>
              {DRAWDOWNS.map(d => (
                <tr key={d.id}>
                  <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{d.ref}</code></td>
                  <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{d.facility}</span></td>
                  <td style={{ fontWeight: 600 }}>{d.amount}</td>
                  <td>{d.tenor}</td>
                  <td style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{d.rate}</td>
                  <td style={{ fontSize: 12 }}>{d.settlementDate}</td>
                  <td><span className="badge badge-green">{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
