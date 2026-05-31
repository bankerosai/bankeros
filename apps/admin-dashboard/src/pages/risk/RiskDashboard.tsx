/**
 * CRO (Chief Risk Officer) Dashboard.
 * Top-level view of all risk types - benchmark HSBC GRO / 招行风险管理总部
 */

import { Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, BarChart, Bar, Legend, CartesianGrid } from 'recharts';

const RISK_RADAR = [
  { name: '信用风险', value: 62, fill: '#3b82f6' },
  { name: '市场风险', value: 38, fill: '#22c55e' },
  { name: '流动性风险', value: 28, fill: '#06b6d4' },
  { name: '操作风险', value: 55, fill: '#f59e0b' },
  { name: '合规风险', value: 47, fill: '#a855f7' },
  { name: '声誉风险', value: 18, fill: '#ec4899' },
];

const CAPITAL_TREND = [
  { month: '1月', cet1: 13.2, tier1: 14.8, total: 17.5 },
  { month: '2月', cet1: 13.4, tier1: 15.0, total: 17.7 },
  { month: '3月', cet1: 13.6, tier1: 15.2, total: 17.9 },
  { month: '4月', cet1: 13.5, tier1: 15.1, total: 17.8 },
  { month: '5月', cet1: 13.8, tier1: 15.4, total: 18.1 },
];

const RISK_EVENTS = [
  { time: '14:32', type: '操作风险', severity: 'HIGH', desc: '支付系统延迟超过 SLA · 影响 1200 笔交易', team: '运营部', status: 'INVESTIGATING' },
  { time: '11:18', type: '信用风险', severity: 'MEDIUM', desc: 'ACME 集团评级下调 BBB → BB+ · 敞口 ¥2.5 亿', team: '信贷部', status: 'REVIEWING' },
  { time: '09:42', type: '合规风险', severity: 'HIGH', desc: 'OFAC 制裁名单新增 47 实体 · 待筛查全行客户', team: '合规部', status: 'IN_PROGRESS' },
  { time: '昨日', type: '市场风险', severity: 'LOW', desc: 'USD/JPY 单日波动 1.2% · 触发交易台预警', team: '市场风险部', status: 'CLOSED' },
];

export default function RiskDashboard() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🎯 CRO 综合风险仪表盘</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          首席风险官 (Chief Risk Officer) 视角 · 三道防线汇总 · BCBS 239 数据治理 · Basel III/IV 合规
        </p>
      </div>

      {/* Risk Appetite KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'CET1 资本充足率', value: '13.8%', target: '≥ 7.5%', color: 'var(--accent-green)', status: '✓ 安全' },
          { label: '杠杆率',         value: '5.2%',  target: '≥ 3.0%', color: 'var(--accent-green)', status: '✓ 安全' },
          { label: 'LCR 流动性覆盖率', value: '142%', target: '≥ 100%', color: 'var(--accent-green)', status: '✓ 充足' },
          { label: 'NPL 不良率',     value: '1.42%', target: '≤ 2.0%', color: 'var(--accent-green)', status: '✓ 健康' },
          { label: '拨备覆盖率',     value: '215%',  target: '≥ 150%', color: 'var(--accent-green)', status: '✓ 充足' },
          { label: '操作风险事件',   value: '47',    target: '≤ 50/月', color: 'var(--accent-amber)', status: '⚠ 关注' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>监管要求: {k.target}</div>
            <div style={{ fontSize: 11, color: k.color, marginTop: 4, fontWeight: 600 }}>{k.status}</div>
          </div>
        ))}
      </div>

      {/* Three Lines of Defense */}
      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>🛡 三道防线 (Three Lines of Defense)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { line: '第一道防线', role: '业务部门 (Front Office)', responsibility: '日常风险识别 + 控制 + 一线 KYC', staff: '12,400+', kpis: ['业务自查率 98%', '一线 KYC 通过率 84%', '日常控制点 36,200+'], color: '#3b82f6' },
            { line: '第二道防线', role: '风险/合规独立部门', responsibility: '独立监督 + 政策制定 + 限额管理', staff: '840', kpis: ['政策审议 124/年', '限额变更审批 1,847', '合规检查 2,100/年'], color: '#a855f7' },
            { line: '第三道防线', role: '内部审计 (Internal Audit)', responsibility: '客观评估 + 独立汇报董事会', staff: '180', kpis: ['年度审计 280 个项目', '整改建议 1,420 条', '关闭率 92%'], color: '#ef4444' },
          ].map(d => (
            <div key={d.line} style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8, borderLeft: `4px solid ${d.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: d.color }}>{d.line}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.staff} 人</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{d.role}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{d.responsibility}</div>
              {d.kpis.map(k => (
                <div key={k} style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 0' }}>· {k}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Risk Radar */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">六大风险维度热力图</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>当前风险评分 (0-100)</span>
          </div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="20%" outerRadius="100%" data={RISK_RADAR} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'var(--bg-secondary)' }} />
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capital Adequacy Trend */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">资本充足率走势 (Basel III)</span>
            <span style={{ fontSize: 11, color: 'var(--accent-green)' }}>● 所有指标超监管线</span>
          </div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CAPITAL_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="cet1"  name="CET1" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="tier1" name="Tier 1" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="total" name="总资本" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Access to Risk Modules */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>🎛 风险管理模块导航</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { to: '/admin/risk/credit',      icon: '💳', label: '信用风险',   sub: 'PD/LGD/EAD · NPL · IFRS 9' },
            { to: '/admin/risk/market',      icon: '📊', label: '市场风险',   sub: 'VaR · Greeks · 压力测试' },
            { to: '/admin/risk/operational', icon: '⚙️', label: '操作风险',   sub: 'KRI · RCSA · 损失事件' },
            { to: '/admin/risk/liquidity',   icon: '💧', label: '流动性风险', sub: 'LCR · NSFR · 应急融资' },
            { to: '/admin/risk/capital',     icon: '🏛', label: '资本管理',   sub: 'CET1 · RWA · ICAAP' },
            { to: '/admin/risk/regulatory',  icon: '📋', label: '监管报送',   sub: 'Basel · IFRS 9 · BCBS 239' },
            { to: '/admin/risk/audit',       icon: '🔍', label: '内部审计',   sub: '审计计划 · 整改追踪' },
            { to: '/admin/compliance',       icon: '⚑', label: '合规案件',   sub: 'AML · 制裁 · 反欺诈' },
          ].map(m => (
            <Link key={m.to} to={m.to}
              style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, textDecoration: 'none', color: 'var(--text-primary)', transition: 'all 0.15s', border: '1px solid var(--border)', display: 'block' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.sub}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Risk Events */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">活跃风险事件 (实时)</span>
          <span className="badge badge-red">{RISK_EVENTS.filter(e => e.status !== 'CLOSED').length} 进行中</span>
        </div>
        <table className="b-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>时间</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>风险类型</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>等级</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>描述</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>负责团队</th>
              <th style={{ padding: 12, textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {RISK_EVENTS.map((e, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, color: 'var(--text-muted)', fontSize: 12 }}>{e.time}</td>
                <td style={{ padding: 12 }}><span className="badge badge-blue">{e.type}</span></td>
                <td style={{ padding: 12 }}>
                  <span className={`badge ${e.severity === 'HIGH' ? 'badge-red' : e.severity === 'MEDIUM' ? 'badge-amber' : 'badge-gray'}`}>
                    {e.severity}
                  </span>
                </td>
                <td style={{ padding: 12, fontSize: 12 }}>{e.desc}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{e.team}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge ${e.status === 'CLOSED' ? 'badge-green' : 'badge-amber'}`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
