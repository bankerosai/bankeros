import { useState } from 'react';

const CONSENTS = [
  { id: 'c1', consentId: 'CONSENT_1716822841_a3f2b', tppName: 'MoneyLion App', tppClientId: 'tpp_moneylion_001', customer: 'Zhao Lei', permissions: ['ReadAccountsBasic', 'ReadBalances', 'ReadTransactions'], status: 'Authorised', createdAt: '2024-05-27', expiresAt: '2024-08-27' },
  { id: 'c2', consentId: 'CONSENT_1716736441_b8d4c', tppName: 'Wise Business', tppClientId: 'tpp_wise_008', customer: 'Priya Sharma', permissions: ['ReadAccountsDetail', 'ReadBalances', 'ReadPayments'], status: 'Authorised', createdAt: '2024-05-26', expiresAt: '2025-05-26' },
  { id: 'c3', consentId: 'CONSENT_1716650041_c9e5d', tppName: 'Xero Accounting', tppClientId: 'tpp_xero_014', customer: 'Gulf Trading FZE', permissions: ['ReadAccountsBasic', 'ReadTransactions'], status: 'Revoked', createdAt: '2024-05-22', expiresAt: '2024-08-22' },
  { id: 'c4', consentId: 'CONSENT_1716563641_d0f6e', tppName: 'Stripe Connect', tppClientId: 'tpp_stripe_042', customer: 'Sarah Mitchell', permissions: ['ReadAccountsBasic', 'ReadBalances'], status: 'AwaitingAuthorisation', createdAt: '2024-05-30', expiresAt: '2024-06-30' },
];

const API_CALLS = [
  { endpoint: 'GET /aisp/accounts', tpp: 'MoneyLion App', count: 4821, avgLatency: '42ms', status: '200' },
  { endpoint: 'GET /aisp/accounts/{id}/transactions', tpp: 'MoneyLion App', count: 1284, avgLatency: '87ms', status: '200' },
  { endpoint: 'GET /aisp/accounts/{id}/balances', tpp: 'Wise Business', count: 3847, avgLatency: '31ms', status: '200' },
  { endpoint: 'POST /pisp/domestic-payment-consents', tpp: 'Stripe Connect', count: 284, avgLatency: '124ms', status: '201' },
  { endpoint: 'POST /pisp/payments', tpp: 'Wise Business', count: 147, avgLatency: '210ms', status: '201' },
  { endpoint: 'GET /aisp/accounts', tpp: 'Unknown TPP', count: 12, avgLatency: '—', status: '401' },
];

const consentStatusColor: Record<string, string> = { Authorised: 'green', AwaitingAuthorisation: 'amber', Revoked: 'red', Expired: 'gray' };
const permColor: Record<string, string> = {
  ReadAccountsBasic: 'blue', ReadAccountsDetail: 'blue', ReadBalances: 'green',
  ReadTransactions: 'cyan', ReadPayments: 'purple',
};

export default function OpenBanking() {
  const [activeTab, setActiveTab] = useState<'consents' | 'api' | 'tpps'>('consents');

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card green"><div className="kpi-label">有效授权</div><div className="kpi-value">1,284</div></div>
        <div className="kpi-card amber"><div className="kpi-label">待授权</div><div className="kpi-value">47</div></div>
        <div className="kpi-card blue"><div className="kpi-label">今日 API 调用</div><div className="kpi-value">10,283</div></div>
        <div className="kpi-card purple"><div className="kpi-label">接入 TPP 数量</div><div className="kpi-value">28</div></div>
        <div className="kpi-card red"><div className="kpi-label">今日 401 错误</div><div className="kpi-value">12</div></div>
      </div>

      {/* Open Banking Standard Info */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(59,130,246,0.3)' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: '标准', value: 'Open Banking UK v3.1 / PSD2' },
            { label: '认证模式', value: 'OAuth 2.0 + PKCE' },
            { label: 'API 前缀', value: '/open-banking/v3.1/{aisp|pisp}' },
            { label: '安全', value: 'MTLS + FAPI 1.0 Advanced' },
            { label: '令牌有效期', value: '3600s Access / 7d Refresh' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--accent-cyan)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['consents', '同意管理'], ['api', 'API 调用监控'], ['tpps', '接入 TPP 列表']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key as any)} className="btn"
            style={{ background: activeTab === key ? 'var(--accent-blue)' : 'var(--bg-card)', color: activeTab === key ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'consents' && (
        <div className="card">
          <div className="section-header">
            <span className="section-title">客户授权同意记录 (AIS/PIS Consents)</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Open Banking v3.1 标准</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Consent ID</th><th>TPP 应用</th><th>客户</th><th>权限范围</th><th>状态</th><th>创建日期</th><th>到期日</th><th>操作</th></tr></thead>
              <tbody>
                {CONSENTS.map(c => (
                  <tr key={c.id}>
                    <td><code style={{ fontSize: 10, color: 'var(--accent-cyan)' }}>{c.consentId.slice(0, 24)}…</code></td>
                    <td style={{ fontWeight: 500 }}>{c.tppName}</td>
                    <td>{c.customer}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {c.permissions.map(p => (
                          <span key={p} className={`badge badge-${permColor[p] ?? 'gray'}`} style={{ fontSize: 9 }}>{p.replace('Read', '')}</span>
                        ))}
                      </div>
                    </td>
                    <td><span className={`badge badge-${consentStatusColor[c.status] ?? 'gray'}`}>{c.status}</span></td>
                    <td style={{ fontSize: 12 }}>{c.createdAt}</td>
                    <td style={{ fontSize: 12 }}>{c.expiresAt}</td>
                    <td>
                      {c.status === 'Authorised' && (
                        <button className="btn btn-ghost" style={{ fontSize: 11, padding: '3px 8px', color: 'var(--accent-red)' }}>撤销</button>
                      )}
                      {c.status === 'AwaitingAuthorisation' && (
                        <button className="btn btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }}>授权</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>API 调用统计（今日）</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>端点</th><th>TPP</th><th>调用次数</th><th>平均延迟</th><th>状态码</th></tr></thead>
              <tbody>
                {API_CALLS.map((a, i) => (
                  <tr key={i}>
                    <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{a.endpoint}</code></td>
                    <td>{a.tpp}</td>
                    <td style={{ fontWeight: 600 }}>{a.count.toLocaleString()}</td>
                    <td style={{ color: parseInt(a.avgLatency) > 100 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>{a.avgLatency}</td>
                    <td><span className={`badge badge-${a.status.startsWith('2') ? 'green' : a.status === '401' ? 'red' : 'amber'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tpps' && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>已认证第三方服务商 (TPP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { name: 'MoneyLion App', type: 'AISP', clientId: 'tpp_moneylion_001', status: 'ACTIVE', consents: 412 },
              { name: 'Wise Business', type: 'AISP+PISP', clientId: 'tpp_wise_008', status: 'ACTIVE', consents: 287 },
              { name: 'Xero Accounting', type: 'AISP', clientId: 'tpp_xero_014', status: 'ACTIVE', consents: 184 },
              { name: 'Stripe Connect', type: 'PISP', clientId: 'tpp_stripe_042', status: 'ACTIVE', consents: 94 },
              { name: 'Plaid', type: 'AISP', clientId: 'tpp_plaid_003', status: 'ACTIVE', consents: 621 },
              { name: 'Unknown Party', type: 'UNKNOWN', clientId: 'tpp_unknown_099', status: 'SUSPENDED', consents: 0 },
            ].map(tpp => (
              <div key={tpp.clientId} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{tpp.name}</span>
                  <span className={`badge badge-${tpp.status === 'ACTIVE' ? 'green' : 'red'}`} style={{ fontSize: 10 }}>{tpp.status}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  <code>{tpp.clientId}</code>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>{tpp.type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tpp.consents} 个有效授权</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
