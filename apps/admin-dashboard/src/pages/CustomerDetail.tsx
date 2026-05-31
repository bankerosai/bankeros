/**
 * Customer 360° detail page — HSBC / 招行 banker-facing standard.
 * Tabs: Overview / Accounts / Loans / Transactions / KYC / Compliance / Communications
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

type Tab = 'overview' | 'accounts' | 'loans' | 'transactions' | 'kyc' | 'compliance' | 'wealth' | 'communications';

const MOCK_CUSTOMER = {
  id: 'c1',
  cifNumber: 'CIF20240001',
  fullName: 'Zhao Lei / 赵磊',
  type: 'INDIVIDUAL',
  email: 'zhao.lei@example.com',
  phone: '+86 138 4821 5566',
  dateOfBirth: '1985-03-15',
  nationality: 'CN',
  taxId: '310101198503151234',
  fatcaStatus: 'NON_US_PERSON',
  crsStatus: 'CN_TAX_RESIDENT',
  pepFlag: false,
  pepSelfDeclaration: false,
  occupation: '科技公司高管',
  employer: 'ACME Technology Co., Ltd.',
  annualIncome: '500,000 - 1,000,000 CNY',
  netWorth: '5,000,000 - 10,000,000 CNY',
  sourceOfFunds: '工资收入 + 股票期权 + 投资收益',
  address: {
    line1: '上海市浦东新区世纪大道 1500 号',
    line2: '环球金融中心 28 楼',
    city: '上海',
    state: '上海',
    postalCode: '200120',
    country: 'CN',
  },
  kycStatus: 'APPROVED',
  riskLevel: 'LOW',
  segment: 'AFFLUENT',
  relationshipManagerId: 'rm-1',
  relationshipManagerName: '陈晓东',
  createdAt: '2024-01-15',
  lastReviewDate: '2025-12-15',
  nextReviewDate: '2026-12-15',
  totalAssets: '¥ 2,847,320',
  totalLiabilities: '¥ 280,000',
  netWorthCalculated: '¥ 2,567,320',
  productCount: 8,
  ltv: '¥ 142,800',  // Customer lifetime value
};

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview',       label: '总览',         icon: '◈' },
  { key: 'accounts',       label: '账户与卡片',   icon: '💳' },
  { key: 'loans',          label: '贷款与负债',   icon: '📋' },
  { key: 'transactions',   label: '交易历史',     icon: '⟳' },
  { key: 'wealth',         label: '财富与投资',   icon: '📈' },
  { key: 'kyc',            label: 'KYC 与文档',   icon: '🆔' },
  { key: 'compliance',     label: '合规与风险',   icon: '⚑' },
  { key: 'communications', label: '沟通记录',     icon: '💬' },
];

export default function CustomerDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const c = MOCK_CUSTOMER;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: 'var(--text-muted)' }}>
        <Link to="/admin/customers" style={{ color: 'var(--accent-cyan)' }}>客户管理</Link>
        <span>/</span>
        <span>{c.cifNumber}</span>
      </div>

      {/* Customer Header */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 800, color: 'white', flexShrink: 0,
          }}>
            {c.fullName.slice(0, 1)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{c.fullName}</h1>
              <span className={`badge badge-${c.kycStatus === 'APPROVED' ? 'green' : 'amber'}`}>{c.kycStatus}</span>
              <span className={`badge badge-${c.riskLevel === 'LOW' ? 'green' : c.riskLevel === 'MEDIUM' ? 'amber' : 'red'}`}>风险: {c.riskLevel}</span>
              <span className="badge badge-purple">{c.segment}</span>
              {c.pepFlag && <span className="badge badge-red">PEP</span>}
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span><code style={{ color: 'var(--accent-cyan)' }}>{c.cifNumber}</code></span>
              <span>📧 {c.email}</span>
              <span>📞 {c.phone}</span>
              <span>🌍 {c.nationality} · {c.address.country}</span>
              <span>👤 客户经理: <strong>{c.relationshipManagerName}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>📞 联系客户</button>
            <button className="btn btn-ghost" style={{ fontSize: 12 }}>📤 邮件通知</button>
            <button className="btn btn-primary" style={{ fontSize: 12 }}>编辑信息</button>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          {[
            { label: '总资产', value: c.totalAssets, color: 'var(--accent-green)' },
            { label: '总负债', value: c.totalLiabilities },
            { label: '净资产', value: c.netWorthCalculated, color: 'var(--accent-cyan)' },
            { label: '持有产品', value: `${c.productCount} 个` },
            { label: '客户终身价值 (LTV)', value: c.ltv, color: 'var(--accent-amber)' },
          ].map(k => (
            <div key={k.label}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: k.color ?? 'var(--text-primary)', marginTop: 4 }}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              background: 'transparent', border: 'none', color: tab === t.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '12px 18px', cursor: 'pointer', fontSize: 13, fontWeight: tab === t.key ? 600 : 500,
              borderBottom: tab === t.key ? '2px solid var(--accent-cyan)' : '2px solid transparent', marginBottom: -1,
              transition: 'all 0.15s',
            }}>
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid-2">
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>基本信息</div>
            {[
              ['客户类型',      c.type === 'INDIVIDUAL' ? '个人客户' : '企业客户'],
              ['出生日期',      `${c.dateOfBirth} (${2026 - 1985} 岁)`],
              ['国籍 / 居住地', `${c.nationality} / ${c.address.country}`],
              ['税务居民身份', c.crsStatus],
              ['FATCA 状态',   c.fatcaStatus],
              ['身份证号 / 税号', c.taxId],
              ['职业',          c.occupation],
              ['雇主',          c.employer],
              ['年收入区间',    c.annualIncome],
              ['净资产区间',    c.netWorth],
              ['资金来源声明', c.sourceOfFunds],
              ['居住地址',     `${c.address.line1}, ${c.address.line2}, ${c.address.city} ${c.address.postalCode}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid rgba(45,49,72,0.4)', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)', width: 140, flexShrink: 0 }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 16 }}>客户关系信息</div>
              {[
                ['客户编号 (CIF)',  c.cifNumber],
                ['客户细分',        c.segment + ' (中产富裕)'],
                ['关系经理',        c.relationshipManagerName],
                ['开户日期',        c.createdAt + ` (${Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000*60*60*24*30))} 个月)`],
                ['最近 KYC 审核',  c.lastReviewDate],
                ['下次审核到期',   c.nextReviewDate],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid rgba(45,49,72,0.4)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)', width: 140, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 12 }}>智能建议 (AI Recommendation)</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>基于客户画像和行为数据生成的个性化产品推荐</div>
              {[
                { product: '私人银行升级', confidence: 0.84, reason: '净资产达标 · 持有 8 个产品 · 6 个月活跃' },
                { product: '住房按揭贷款', confidence: 0.72, reason: '年龄 41 · 稳定收入 · 无现有按揭' },
                { product: '海外子女教育金', confidence: 0.65, reason: '高收入家庭 · 历史教育类支出增长' },
              ].map(r => (
                <div key={r.product} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{r.product}</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: 12 }}>匹配度 {(r.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'kyc' && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 16 }}>KYC 状态总览</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'KYC 状态', value: 'APPROVED', color: 'var(--accent-green)' },
                { label: '尽职调查级别', value: '标准 (CDD)', color: 'var(--accent-blue)' },
                { label: '风险评级', value: 'LOW (低)', color: 'var(--accent-green)' },
                { label: '下次审核', value: c.nextReviewDate },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: item.color ?? 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>已上传文档</div>
              {[
                { type: '身份证正面', file: 'id_front.jpg', size: '1.24 MB', uploadedAt: '2024-01-15', verified: true },
                { type: '身份证背面', file: 'id_back.jpg',  size: '1.18 MB', uploadedAt: '2024-01-15', verified: true },
                { type: '人脸活体检测', file: 'liveness.mp4', size: '4.82 MB', uploadedAt: '2024-01-15', verified: true, livenessScore: 0.9821 },
                { type: '住址证明 - 水电账单', file: 'utility_bill.pdf', size: '0.84 MB', uploadedAt: '2024-01-15', verified: true },
                { type: '在职证明',  file: 'employment.pdf',  size: '0.62 MB', uploadedAt: '2024-01-15', verified: true },
              ].map(d => (
                <div key={d.file} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{d.type}</span>
                    {d.verified && <span className="badge badge-green">已验证</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>{d.file} · {d.size}</span>
                    <span>{d.uploadedAt}{d.livenessScore && ` · 活体分 ${d.livenessScore}`}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>制裁筛查历史</div>
              {[
                { list: 'OFAC SDN List', date: '2026-05-15', result: 'CLEAR', score: 0.01 },
                { list: 'UN Consolidated List', date: '2026-05-15', result: 'CLEAR', score: 0.02 },
                { list: 'EU Restrictive Measures', date: '2026-05-15', result: 'CLEAR', score: 0.01 },
                { list: 'HMT Sanctions List', date: '2026-05-15', result: 'CLEAR', score: 0.01 },
                { list: 'World-Check PEP', date: '2026-05-15', result: 'CLEAR', score: 0.00 },
                { list: 'CIIN Adverse Media',   date: '2026-05-15', result: 'REVIEW', score: 0.32 },
              ].map(s => (
                <div key={s.list} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span>{s.list}</span>
                    <span className={`badge badge-${s.result === 'CLEAR' ? 'green' : 'amber'}`} style={{ fontSize: 10 }}>{s.result}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    上次筛查: {s.date} · 匹配分: {s.score}
                  </div>
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 12, fontSize: 12, width: '100%', justifyContent: 'center' }}>
                立即执行制裁筛查
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs — placeholder content showing structure */}
      {tab !== 'overview' && tab !== 'kyc' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{tabs.find(t => t.key === tab)?.icon}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {tabs.find(t => t.key === tab)?.label}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            该标签页将聚合显示客户的相关数据，遵循 HSBC / 招行 客户经理工作台标准。
            <br /> 当前演示侧重于"总览"和"KYC 与文档"两个核心标签。
          </div>
        </div>
      )}
    </div>
  );
}
