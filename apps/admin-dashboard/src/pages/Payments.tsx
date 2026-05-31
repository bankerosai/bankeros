import { MOCK } from '../api/client';

const networkBadge = (n: string) => {
  const m: Record<string, string> = { SWIFT: 'purple', ACH: 'blue', RTGS: 'cyan', FASTER_PAYMENTS: 'green', SEPA: 'blue', INTERNAL: 'gray' };
  return <span className={`badge badge-${m[n] ?? 'gray'}`}>{n}</span>;
};

const statusBadge = (s: string) => {
  const m: Record<string, string> = { COMPLETED: 'green', PROCESSING: 'blue', FAILED: 'red', PENDING: 'amber', REVERSED: 'gray' };
  return <span className={`badge badge-${m[s] ?? 'gray'}`}>{s}</span>;
};

export default function Payments() {
  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card green">
          <div className="kpi-label">今日完成</div>
          <div className="kpi-value">11,284</div>
          <div className="kpi-delta up">$847M</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">处理中</div>
          <div className="kpi-value">284</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">等待清算</div>
          <div className="kpi-value">1,279</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">欺诈拦截</div>
          <div className="kpi-value">3</div>
          <div className="kpi-delta down">高风险</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">SWIFT 报文</div>
          <div className="kpi-value">412</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">支付记录</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost">导出 camt.053</button>
            <button className="btn btn-primary">+ 发起支付</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>参考号</th><th>付款方</th><th>收款方</th><th>金额</th>
                <th>清算网络</th><th>欺诈评分</th><th>状态</th><th>指令时间</th>
              </tr>
            </thead>
            <tbody>
              {MOCK.payments.map((p) => (
                <tr key={p.id}>
                  <td>
                    <code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{p.paymentReference}</code>
                  </td>
                  <td>{p.debtorName}</td>
                  <td>{p.creditorName}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{p.amount}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{p.currency}</span>
                  </td>
                  <td>{networkBadge(p.network)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 48, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          width: `${parseFloat(p.fraudScore) * 100}%`, height: '100%',
                          background: parseFloat(p.fraudScore) > 0.7 ? 'var(--accent-red)' : parseFloat(p.fraudScore) > 0.3 ? 'var(--accent-amber)' : 'var(--accent-green)',
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: parseFloat(p.fraudScore) > 0.7 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                        {p.fraudScore}
                      </span>
                    </div>
                  </td>
                  <td>{statusBadge(p.status)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {new Date(p.instructedAt).toLocaleString('zh-CN')}
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
