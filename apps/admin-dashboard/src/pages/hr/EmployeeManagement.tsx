/**
 * Employee Management (HR)
 * 员工档案 · 入职/离职/调岗 · 通讯录 · 持证管理
 */

import { useState } from 'react';

const EMPLOYEES = [
  { id: 'E20180042', name: '王明',     deptPath: '上海分行 / 对公业务部', role: '高级客户经理',  level: 'P6', joinDate: '2018-03-15', email: 'wangming@bankeros.io', phone: '138-0011-2233', status: 'ACTIVE',  certs: ['AFP', 'CFP'] },
  { id: 'E20150188', name: '陈晓东',   deptPath: '总部 / 风险管理部',     role: '首席风险官 CRO', level: 'P9', joinDate: '2015-06-01', email: 'chen.xd@bankeros.io',  phone: '139-0022-3344', status: 'ACTIVE',  certs: ['FRM', 'CFA', 'PRM'] },
  { id: 'E20200012', name: '刘晓琳',   deptPath: '总部 / 合规部',         role: '合规总监',     level: 'P8', joinDate: '2020-01-12', email: 'liu.xl@bankeros.io',   phone: '186-1100-4455', status: 'ACTIVE',  certs: ['CAMS', 'ICA'] },
  { id: 'E20210084', name: '张大伟',   deptPath: '华北区域 / 北京分行',   role: '分行行长',     level: 'P7', joinDate: '2021-05-22', email: 'zhang.dw@bankeros.io', phone: '186-2200-5566', status: 'ACTIVE',  certs: ['EMBA'] },
  { id: 'E20230048', name: '小赵',     deptPath: '上海分行 / 零售业务部', role: '客户经理',     level: 'P4', joinDate: '2023-07-01', email: 'zhao.j@bankeros.io',   phone: '189-3300-6677', status: 'ACTIVE',  certs: ['AFP'] },
  { id: 'E20190156', name: '李静茹',   deptPath: '总部 / 财务部',         role: '财务总监 CFO',  level: 'P9', joinDate: '2019-08-15', email: 'li.jr@bankeros.io',    phone: '186-4400-7788', status: 'ACTIVE',  certs: ['CPA', 'ACCA'] },
  { id: 'E20240008', name: '林浩然',   deptPath: 'IT 信息技术部',         role: '架构师',       level: 'P6', joinDate: '2024-02-14', email: 'lin.hr@bankeros.io',   phone: '188-5500-8899', status: 'PROBATION', certs: ['AWS', 'PMP'] },
  { id: 'E20180224', name: '王雪萍',   deptPath: '总部 / 人力资源部',     role: 'HRD',          level: 'P8', joinDate: '2018-09-01', email: 'wang.xp@bankeros.io',  phone: '139-6600-9900', status: 'ACTIVE',  certs: ['SPHR'] },
];

const PENDING_ACTIONS = [
  { type: '入职', name: '钱晓宇', target: '上海分行 · 客户经理', date: '2025-06-15', stage: '背景调查中' },
  { type: '调岗', name: '周建明', target: '从南京分行 → 上海分行', date: '2025-06-01', stage: '审批中 (2/3)' },
  { type: '离职', name: '高建国', target: '原职: 陆家嘴支行行长', date: '2025-05-31', stage: '工作交接中' },
  { type: '晋升', name: '小赵',   target: '客户经理 P4 → 高级客户经理 P5', date: '2025-06-30', stage: '述职后' },
];

export default function EmployeeManagement() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'directory' | 'pending' | 'org'>('directory');

  const filtered = EMPLOYEES.filter(e =>
    !search || e.name.includes(search) || e.id.includes(search) || e.email.includes(search) || e.role.includes(search)
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>👥 人员管理 (HR)</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          员工档案 · 通讯录 · 入职/离职/调岗 · 持证管理 · 与组织架构联动
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '在职员工',   value: '38,142',     color: 'var(--accent-green)' },
          { label: '本月入职',   value: '184',        color: 'var(--accent-blue)' },
          { label: '本月离职',   value: '124',        sub: '流失率 0.3%', color: 'var(--accent-amber)' },
          { label: '试用期',     value: '420' },
          { label: '海外派遣',   value: '218',        sub: '38 国家' },
          { label: '持证率',     value: '78%',        sub: '合规要求 ≥ 70%', color: 'var(--accent-green)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[
          ['directory', `📇 员工通讯录 (${EMPLOYEES.length})`],
          ['pending',   `🔄 待办事项 (${PENDING_ACTIONS.length})`],
          ['org',       `🏢 组织视图`],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '12px 18px', fontSize: 13, fontWeight: tab === k ? 700 : 500,
              color: tab === k ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              borderBottom: tab === k ? '2px solid var(--accent-cyan)' : '2px solid transparent', marginBottom: -1,
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'directory' && (
        <div className="card">
          <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 搜索员工姓名/工号/邮箱/职位..." style={{
                flex: 1, padding: '10px 14px', background: 'var(--bg-secondary)',
                border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)',
              }} />
            <select style={{ padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)' }}>
              <option>全部部门</option><option>对公业务部</option><option>零售业务部</option><option>风险管理部</option>
              <option>合规部</option><option>财务部</option><option>IT 部</option><option>人力资源部</option>
            </select>
            <button className="btn btn-primary">+ 新增员工</button>
            <button className="btn btn-ghost">📤 导出</button>
          </div>
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12 }}>工号</th>
                <th style={{ padding: 12 }}>姓名</th>
                <th style={{ padding: 12 }}>所属部门</th>
                <th style={{ padding: 12 }}>职位</th>
                <th style={{ padding: 12 }}>职级</th>
                <th style={{ padding: 12 }}>入职日期</th>
                <th style={{ padding: 12 }}>联系方式</th>
                <th style={{ padding: 12 }}>持证</th>
                <th style={{ padding: 12 }}>状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{e.id}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                        {e.name.slice(0, 1)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{e.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: 'var(--text-secondary)' }}>{e.deptPath}</td>
                  <td style={{ padding: 12, fontSize: 12 }}>{e.role}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ fontFamily: 'monospace', padding: '3px 8px', borderRadius: 3, background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)', fontWeight: 700, fontSize: 11 }}>{e.level}</span>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>{e.joinDate}</td>
                  <td style={{ padding: 12, fontSize: 11 }}>
                    <div>{e.email}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{e.phone}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {e.certs.map(c => <span key={c} className="badge badge-green" style={{ fontSize: 10 }}>{c}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span className={`badge ${e.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}`}>
                      {e.status === 'ACTIVE' ? '在职' : '试用'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'pending' && (
        <div className="card">
          {PENDING_ACTIONS.map((p, i) => (
            <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className={`badge ${p.type === '入职' ? 'badge-green' : p.type === '调岗' ? 'badge-blue' : p.type === '晋升' ? 'badge-purple' : 'badge-amber'}`}>
                {p.type}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.target}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>生效: {p.date}</div>
              <span className="badge badge-amber">{p.stage}</span>
              <button className="btn btn-ghost" style={{ fontSize: 12 }}>处理</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'org' && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌲</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>查看完整组织架构</div>
          <a href="/admin/hr/organization" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12 }}>
            打开组织架构树 →
          </a>
        </div>
      )}
    </div>
  );
}
