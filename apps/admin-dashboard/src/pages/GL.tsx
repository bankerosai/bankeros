import { MOCK } from '../api/client';

const typeBadge = (t: string) => {
  const m: Record<string, string> = { ASSET: 'blue', LIABILITY: 'red', EQUITY: 'purple', INCOME: 'green', EXPENSE: 'amber' };
  return <span className={`badge badge-${m[t] ?? 'gray'}`}>{t}</span>;
};

const fmtB = (n: number) => `$${(n / 1e9).toFixed(2)}B`;

export default function GL() {
  const totalDebits  = MOCK.glAccounts.reduce((s, a) => s + parseFloat(a.debitTotal.replace(/,/g, '')), 0);
  const totalCredits = MOCK.glAccounts.reduce((s, a) => s + parseFloat(a.creditTotal.replace(/,/g, '')), 0);
  const isBalanced   = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue">
          <div className="kpi-label">总借方合计</div>
          <div className="kpi-value" style={{ fontSize: 18 }}>{fmtB(totalDebits)}</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">总贷方合计</div>
          <div className="kpi-value" style={{ fontSize: 18 }}>{fmtB(totalCredits)}</div>
        </div>
        <div className={`kpi-card ${isBalanced ? 'green' : 'red'}`}>
          <div className="kpi-label">借贷平衡</div>
          <div className="kpi-value">{isBalanced ? '✓ 平衡' : '✗ 失衡'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title">试算表（当前业务日）</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost">触发 EOD</button>
            <button className="btn btn-primary">新建分录</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>科目代码</th><th>科目名称</th><th>类型</th><th>借方合计</th><th>贷方合计</th><th>净余额</th></tr>
            </thead>
            <tbody>
              {MOCK.glAccounts.map((a) => {
                const net = parseFloat(a.netBalance.replace(/,/g, '').replace('-', ''));
                const isDebit = !a.netBalance.startsWith('-');
                return (
                  <tr key={a.code}>
                    <td><code style={{ color: 'var(--accent-cyan)', fontSize: 12 }}>{a.code}</code></td>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td>{typeBadge(a.type)}</td>
                    <td style={{ fontFamily: 'monospace', textAlign: 'right' }}>{a.debitTotal !== '0.00' ? `$${a.debitTotal}` : '—'}</td>
                    <td style={{ fontFamily: 'monospace', textAlign: 'right' }}>{a.creditTotal !== '0.00' ? `$${a.creditTotal}` : '—'}</td>
                    <td style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 600, color: isDebit ? 'var(--text-primary)' : 'var(--accent-green)' }}>
                      {a.netBalance.startsWith('-') ? '-' : ''}${a.netBalance.replace('-', '')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--border)' }}>
                <td colSpan={3} style={{ fontWeight: 700, padding: '12px 12px' }}>合计</td>
                <td style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 700 }}>{fmtB(totalDebits)}</td>
                <td style={{ fontFamily: 'monospace', textAlign: 'right', fontWeight: 700 }}>{fmtB(totalCredits)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${isBalanced ? 'green' : 'red'}`}>
                    {isBalanced ? '✓ 借贷平衡' : '✗ 失衡'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>发起会计分录</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>复式记账强制校验：借贷双方必须平衡才可过账</div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: 'var(--accent-cyan)' }}>
            {`POST /v1/gl/journal-entries\n{\n  "referenceId": "PAY001",\n  "referenceType": "PAYMENT",\n  "businessDate": "2024-05-30",\n  "lines": [\n    { "accountCode": "1000",\n      "type": "DEBIT",\n      "amount": "50000.00",\n      "currency": "USD" },\n    { "accountCode": "2000",\n      "type": "CREDIT",\n      "amount": "50000.00",\n      "currency": "USD" }\n  ]\n}`}
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>EOD 批处理历史</div>
          {[
            { date: '2024-05-30', status: 'RUNNING', processed: '42,800 / 48,291', duration: '进行中' },
            { date: '2024-05-29', status: 'COMPLETED', processed: '48,109 / 48,109', duration: '4m 32s' },
            { date: '2024-05-28', status: 'COMPLETED', processed: '47,891 / 47,891', duration: '4m 18s' },
            { date: '2024-05-27', status: 'COMPLETED', processed: '47,420 / 47,420', duration: '4m 09s' },
          ].map((j) => (
            <div key={j.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{j.date} EOD</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{j.processed} 账户</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${j.status === 'COMPLETED' ? 'green' : 'amber'}`}>{j.status}</span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{j.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
