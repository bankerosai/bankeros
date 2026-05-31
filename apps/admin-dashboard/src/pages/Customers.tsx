import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOCK } from '../api/client';

const SEGMENTS = [
  { key: 'all',           label: '全部客户',   color: 'var(--text-secondary)', icon: '◎' },
  { key: 'retail',        label: '零售客户',   color: '#22c55e', icon: '🏠' },
  { key: 'wealth',        label: 'Premier/Jade', color: '#a855f7', icon: '💎' },
  { key: 'private',       label: '私人银行',   color: '#ffba00', icon: '👑' },
  { key: 'corporate',     label: '对公客户',   color: '#f59e0b', icon: '🏢' },
  { key: 'institutional', label: '机构/同业',  color: '#06b6d4', icon: '🏛' },
];

// Mock segment mapping (in real app this comes from customer record)
const SEGMENT_MAP: Record<string, string> = {
  c1: 'wealth', c2: 'wealth', c3: 'private', c4: 'retail', c5: 'corporate',
};

const kycBadge = (s: string) => {
  const m: Record<string, string> = { APPROVED: 'green', PENDING_REVIEW: 'amber', REJECTED: 'red', NOT_STARTED: 'gray', IN_PROGRESS: 'blue' };
  return <span className={`badge badge-${m[s] ?? 'gray'}`}>{s}</span>;
};

const riskBadge = (r: string) => {
  const m: Record<string, string> = { LOW: 'green', MEDIUM: 'amber', HIGH: 'red', PROHIBITED: 'red' };
  return <span className={`badge badge-${m[r] ?? 'gray'}`}>{r}</span>;
};

export default function Customers() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [segment, setSegment] = useState(params.get('segment') || 'all');

  const filtered = MOCK.customers.filter((c) => {
    const matchSearch = !search || c.fullName.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search) || c.cifNumber.includes(search);
    const matchKyc = kycFilter === 'ALL' || c.kycStatus === kycFilter;
    const matchSegment = segment === 'all' || SEGMENT_MAP[c.id] === segment;
    return matchSearch && matchKyc && matchSegment;
  });

  const activeSegment = SEGMENTS.find(s => s.key === segment) ?? SEGMENTS[0];

  return (
    <div>
      {/* Business Line Tabs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          🏛 业务条线过滤 (Business Line View)
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 6, borderRadius: 10, border: '1px solid var(--border)' }}>
          {SEGMENTS.map(s => (
            <button key={s.key} onClick={() => setSegment(s.key)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 6, border: 'none',
                background: segment === s.key ? `${s.color}22` : 'transparent',
                color: segment === s.key ? s.color : 'var(--text-secondary)',
                fontSize: 12, fontWeight: segment === s.key ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: 14, marginRight: 6 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          当前条线: <span style={{ color: activeSegment.color, fontWeight: 700 }}>{activeSegment.label}</span>
          · 显示 {filtered.length} 客户
        </div>
      </div>

      {/* Stats */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card green">
          <div className="kpi-label">KYC 已批准</div>
          <div className="kpi-value">41,284</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">待审核</div>
          <div className="kpi-value">1,847</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">高风险客户</div>
          <div className="kpi-value">312</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-label">今日新增</div>
          <div className="kpi-value">84</div>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            style={{ flex: 1, minWidth: 200, maxWidth: 320 }}
            placeholder="搜索客户名称 / 邮箱 / CIF编号…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-input"
            style={{ width: 160 }}
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
          >
            <option value="ALL">全部 KYC 状态</option>
            <option value="APPROVED">已批准</option>
            <option value="PENDING_REVIEW">待审核</option>
            <option value="REJECTED">已拒绝</option>
          </select>
          <button className="btn btn-primary">+ 新建开户申请</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CIF 编号</th><th>客户名称</th><th>邮箱</th><th>国家</th>
                <th>KYC 状态</th><th>风险等级</th><th>开户日期</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => navigate(`/admin/customers/${c.id}`)} style={{ cursor: 'pointer' }}>
                  <td><code style={{ fontSize: 11, color: 'var(--accent-cyan)' }}>{c.cifNumber}</code></td>
                  <td style={{ fontWeight: 500 }}>{c.fullName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                  <td>
                    <span className="badge badge-gray">{c.country}</span>
                  </td>
                  <td>{kycBadge(c.kycStatus)}</td>
                  <td>{riskBadge(c.riskLevel)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.createdAt}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${c.id}`); }}>360° 视图</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span>显示 {filtered.length} / 48,291 条记录</span>
          <span>第 1 页 / 共 2,415 页</span>
        </div>
      </div>
    </div>
  );
}
