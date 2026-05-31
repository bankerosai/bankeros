import { useState } from 'react';
import { MOCK } from '../api/client';

const statusBadge = (s: string) => {
  const m: Record<string, string> = { ACTIVE: 'green', OVERDUE: 'red', SETTLED: 'gray', APPROVED: 'blue', SUBMITTED: 'amber', REJECTED: 'red', DRAFT: 'gray' };
  return <span className={`badge badge-${m[s] ?? 'gray'}`}>{s}</span>;
};

const SCHEDULE = [
  { period: 1, dueDate: '2024-06-15', principal: '780.42', interest: '370.83', total: '1,151.25', paid: true },
  { period: 2, dueDate: '2024-07-15', principal: '786.23', interest: '365.02', total: '1,151.25', paid: true },
  { period: 3, dueDate: '2024-08-15', principal: '792.10', interest: '359.15', total: '1,151.25', paid: false },
  { period: 4, dueDate: '2024-09-15', principal: '798.01', interest: '353.24', total: '1,151.25', paid: false },
  { period: 5, dueDate: '2024-10-15', principal: '803.98', interest: '347.27', total: '1,151.25', paid: false },
  { period: 6, dueDate: '2024-11-15', principal: '809.99', interest: '341.26', total: '1,151.25', paid: false },
];

export default function Loans() {
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<'schedule' | 'transactions'>('schedule');
  const selectedLoan = MOCK.loans.find(l => l.id === selected);

  const utilization = selectedLoan
    ? (parseFloat(selectedLoan.outstandingBalance.replace(/,/g, '')) / parseFloat(selectedLoan.principalAmount.replace(/,/g, '')) * 100).toFixed(1)
    : null;

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card green"><div className="kpi-label">活跃贷款</div><div className="kpi-value">4,821</div><div className="kpi-delta up">$1.92B 余额</div></div>
        <div className="kpi-card red"><div className="kpi-label">逾期贷款</div><div className="kpi-value">147</div><div className="kpi-delta down">↑ 3 本周新增</div></div>
        <div className="kpi-card amber"><div className="kpi-label">待审批</div><div className="kpi-value">83</div></div>
        <div className="kpi-card blue"><div className="kpi-label">本月放款</div><div className="kpi-value">$84.2M</div></div>
        <div className="kpi-card purple"><div className="kpi-label">平均利率</div><div className="kpi-value">7.84%</div></div>
      </div>

      <div className="grid-2">
        {/* Loan List */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">贷款列表</span>
            <button className="btn btn-primary">+ 新建申请</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>贷款编号</th><th>客户</th><th>产品</th><th>余额</th><th>状态</th></tr>
              </thead>
              <tbody>
                {MOCK.loans.map((l) => (
                  <tr key={l.id} onClick={() => setSelected(l.id)} style={{ cursor: 'pointer', background: selected === l.id ? 'var(--bg-hover)' : undefined }}>
                    <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{l.loanNumber}</code></td>
                    <td style={{ fontWeight: 500 }}>{l.customerName}</td>
                    <td style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 120 }}>{l.productName}</td>
                    <td style={{ fontWeight: 600 }}>{l.currency} {l.outstandingBalance}</td>
                    <td>{statusBadge(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>显示 3 / 4,968 条 · 点击行查看详情</div>
        </div>

        {/* Loan Detail */}
        <div className="card">
          {!selectedLoan ? (
            <div className="empty">← 点击左侧贷款查看详情</div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <code style={{ color: 'var(--accent-cyan)', fontSize: 12 }}>{selectedLoan.loanNumber}</code>
                  {statusBadge(selectedLoan.status)}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedLoan.customerName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedLoan.productName}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: '原始本金', value: `${selectedLoan.currency} ${selectedLoan.principalAmount}` },
                  { label: '未偿余额', value: `${selectedLoan.currency} ${selectedLoan.outstandingBalance}`, highlight: true },
                  { label: '年利率', value: `${selectedLoan.interestRate}%` },
                  { label: '下次到期', value: selectedLoan.nextDueDate, warn: selectedLoan.status === 'OVERDUE' },
                ].map((item) => (
                  <div key={item.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, color: item.warn ? 'var(--accent-red)' : item.highlight ? 'var(--accent-amber)' : 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Utilization */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>本金使用率</span>
                  <span style={{ fontWeight: 600 }}>{utilization}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${utilization}%`, background: parseFloat(utilization!) > 90 ? 'var(--accent-red)' : 'var(--accent-blue)' }} />
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {(['schedule', 'transactions'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className="btn"
                    style={{ background: tab === t ? 'rgba(59,130,246,0.15)' : 'transparent', color: tab === t ? 'var(--accent-blue)' : 'var(--text-muted)', border: '1px solid var(--border)', fontSize: 12 }}>
                    {t === 'schedule' ? '还款计划表' : '交易记录'}
                  </button>
                ))}
              </div>

              {tab === 'schedule' && (
                <div className="table-wrap" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table>
                    <thead><tr><th>#</th><th>到期日</th><th>本金</th><th>利息</th><th>应付合计</th><th>状态</th></tr></thead>
                    <tbody>
                      {SCHEDULE.map((s) => (
                        <tr key={s.period} style={{ opacity: s.paid ? 0.5 : 1 }}>
                          <td style={{ color: 'var(--text-muted)' }}>{s.period}</td>
                          <td style={{ fontSize: 12 }}>{s.dueDate}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.principal}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-amber)' }}>{s.interest}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{s.total}</td>
                          <td>{s.paid ? <span className="badge badge-green">已还</span> : <span className="badge badge-gray">待还</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'transactions' && (
                <div className="table-wrap" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table>
                    <thead><tr><th>类型</th><th>金额</th><th>本金部分</th><th>利息部分</th><th>日期</th></tr></thead>
                    <tbody>
                      <tr><td><span className="badge badge-blue">DISBURSEMENT</span></td><td style={{ fontFamily: 'monospace' }}>50,000.00</td><td>50,000.00</td><td>0.00</td><td style={{ fontSize: 12 }}>2024-01-15</td></tr>
                      <tr><td><span className="badge badge-green">REPAYMENT</span></td><td style={{ fontFamily: 'monospace' }}>1,151.25</td><td>780.42</td><td>370.83</td><td style={{ fontSize: 12 }}>2024-02-15</td></tr>
                      <tr><td><span className="badge badge-green">REPAYMENT</span></td><td style={{ fontFamily: 'monospace' }}>1,151.25</td><td>786.23</td><td>365.02</td><td style={{ fontSize: 12 }}>2024-03-15</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>录入还款</button>
                <button className="btn btn-ghost" style={{ fontSize: 12 }}>批准</button>
                <button className="btn btn-ghost" style={{ fontSize: 12, color: 'var(--accent-red)' }}>标记逾期</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
