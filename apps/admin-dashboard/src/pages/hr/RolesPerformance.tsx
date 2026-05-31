/**
 * Roles & Permissions (IAM) + Performance & Training
 * 角色权限管理 + 绩效考核 + 培训认证
 */

// ────────────────────────────────────────────
// ROLES & PERMISSIONS (IAM)
// ────────────────────────────────────────────
export function RolesPermissions() {
  const ROLES = [
    { code: 'SUPER_ADMIN',        label: '系统管理员',     users: 12,    permissions: 'ALL (240+)', risk: 'CRITICAL', desc: '最高权限 · 仅 IT 总监+总行行长' },
    { code: 'BRANCH_MANAGER',     label: '分行行长',       users: 142,   permissions: '分行业务 (48)', risk: 'HIGH', desc: '分行管理 · 网点 KPI · 人员管理' },
    { code: 'RELATIONSHIP_MGR',   label: '客户经理',       users: 8420,  permissions: '客户管理 + 申请 (24)', risk: 'MEDIUM', desc: '日常客户服务 · 贷款申请' },
    { code: 'CREDIT_OFFICER',     label: '审贷官',         users: 84,    permissions: '审批 ≤ ¥2000万 (18)', risk: 'HIGH', desc: '独立审批权 · 不属业务部' },
    { code: 'COMPLIANCE_OFFICER', label: '合规专员',       users: 320,   permissions: '合规检查 · AML (32)', risk: 'HIGH', desc: '反洗钱 · 制裁筛查' },
    { code: 'RISK_ANALYST',       label: '风险分析师',     users: 280,   permissions: '风险报表 (28)', risk: 'MEDIUM', desc: '二线风险管理' },
    { code: 'AUDITOR',            label: '审计员',         users: 180,   permissions: '只读+审计 (180)', risk: 'CRITICAL', desc: '三线 · 只读访问全行系统' },
    { code: 'TELLER',             label: '柜员',           users: 12400, permissions: '现金/转账 (12)', risk: 'LOW', desc: '柜面服务 · 受限金额' },
    { code: 'CUSTOMER_SERVICE',   label: '客服',           users: 2400,  permissions: '查询+投诉 (8)', risk: 'LOW', desc: '只读查询权限' },
    { code: 'API_SERVICE',        label: 'API 服务账号',   users: 480,   permissions: 'API 端点 (按需)', risk: 'HIGH', desc: '系统间集成' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🔐 角色与权限管理 (IAM)</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          基于角色的访问控制 (RBAC) · 最小权限原则 · 与 IAM Service 联动 · SOX 合规
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: '系统角色数', value: '24',     color: 'var(--accent-blue)' },
          { label: '总用户数',   value: '38,142' },
          { label: '权限点',     value: '240+',   color: 'var(--accent-amber)' },
          { label: '本月授权变更', value: '184',   sub: '已全部留痕' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">👤 角色清单</span>
          <button className="btn btn-primary">+ 新建角色</button>
        </div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>角色代码</th>
              <th style={{ padding: 12 }}>角色名称</th>
              <th style={{ padding: 12, textAlign: 'right' }}>用户数</th>
              <th style={{ padding: 12 }}>权限范围</th>
              <th style={{ padding: 12 }}>风险等级</th>
              <th style={{ padding: 12 }}>描述</th>
              <th style={{ padding: 12 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {ROLES.map(r => (
              <tr key={r.code} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--accent-cyan)', fontSize: 11 }}>{r.code}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{r.label}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{r.users.toLocaleString()}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{r.permissions}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${r.risk === 'CRITICAL' ? 'red' : r.risk === 'HIGH' ? 'amber' : r.risk === 'MEDIUM' ? 'blue' : 'gray'}`}>{r.risk}</span>
                </td>
                <td style={{ padding: 12, fontSize: 12, color: 'var(--text-secondary)' }}>{r.desc}</td>
                <td style={{ padding: 12 }}>
                  <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>编辑权限</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// PERFORMANCE & KPI
// ────────────────────────────────────────────
export function PerformanceManagement() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>📊 绩效考核 (Performance)</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          KPI 体系 · 客户经理佣金 · 评级与晋升 · 平衡计分卡 (BSC)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: '本季度待评员工', value: '38,142' },
          { label: '已完成评估',     value: '34,420 (90%)', color: 'var(--accent-green)' },
          { label: '优秀 (A)',       value: '8.4%' },
          { label: '待改进 (D)',     value: '2.1%',  color: 'var(--accent-amber)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>🎯 客户经理 KPI 体系</div>
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12 }}>KPI 指标</th>
                <th style={{ padding: 12, textAlign: 'right' }}>权重</th>
                <th style={{ padding: 12, textAlign: 'right' }}>季度目标</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['新增客户数',         '15%', '20 户/季'],
                ['客户 AUM 增长',     '25%', '+ ¥ 50M'],
                ['存款余额',           '15%', '¥ 200M'],
                ['贷款投放',           '20%', '¥ 80M'],
                ['中间业务收入',       '10%', '¥ 200K'],
                ['客户满意度 NPS',     '10%', '≥ 65'],
                ['不良贷款率',         '5%',  '≤ 1.5%'],
              ].map((r: any) => (
                <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12 }}>{r[0]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontWeight: 700 }}>{r[1]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>💰 佣金结算规则</div>
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12 }}>业务类型</th>
                <th style={{ padding: 12, textAlign: 'right' }}>佣金比例</th>
                <th style={{ padding: 12 }}>支付时点</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['零售贷款',     '0.4% × 本金',      '放款后'],
                ['企业贷款',     '0.2% × 本金',      '放款后'],
                ['基金销售',     '15-30% × 申购费',  '次月'],
                ['保险销售',     '2-5% × 首年保费',  '保单生效'],
                ['信用卡发卡',   '¥ 50-200 / 张',    '首次激活'],
                ['理财产品',     '0.1% × 销售额',    '季度结算'],
              ].map((r: any) => (
                <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12 }}>{r[0]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>{r[1]}</td>
                  <td style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// TRAINING & CERTIFICATION
// ────────────────────────────────────────────
export function TrainingManagement() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🎓 培训与认证管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          必修培训 · 持证上岗管理 · 合规培训 · 与 HR 档案联动
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '今年培训人次', value: '128K', color: 'var(--accent-blue)' },
          { label: '在线课程数',   value: '480' },
          { label: '合规培训完成率', value: '94%', color: 'var(--accent-green)' },
          { label: '持证员工数',   value: '29,820', sub: '78%' },
          { label: '证书到期预警', value: '142', sub: '30 天内', color: 'var(--accent-amber)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header"><span className="section-title">📚 必修培训课程</span><span className="badge badge-blue">全员强制</span></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>课程</th>
              <th style={{ padding: 12 }}>类别</th>
              <th style={{ padding: 12 }}>时长</th>
              <th style={{ padding: 12 }}>频率</th>
              <th style={{ padding: 12 }}>适用人群</th>
              <th style={{ padding: 12, textAlign: 'right' }}>完成率</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: '反洗钱 (AML) 基础培训',    cat: '合规', duration: '4 小时', freq: '每年', target: '全员',         comp: 98 },
              { name: 'KYC 客户尽职调查',          cat: '合规', duration: '3 小时', freq: '每年', target: '一线员工',     comp: 94 },
              { name: '反欺诈与可疑交易识别',      cat: '风控', duration: '2 小时', freq: '每年', target: '柜员/客户经理', comp: 92 },
              { name: 'GDPR / 个人信息保护',       cat: '合规', duration: '1.5 小时', freq: '每年', target: '全员',       comp: 96 },
              { name: '操作风险 RCSA 培训',        cat: '风控', duration: '2 小时', freq: '每年', target: '中层 +',       comp: 88 },
              { name: '信贷政策与流程',            cat: '业务', duration: '6 小时', freq: '每年', target: '客户经理/审贷', comp: 90 },
              { name: '财富顾问适当性销售',        cat: '业务', duration: '4 小时', freq: '每年', target: '理财顾问',     comp: 86 },
              { name: 'IT 信息安全意识',           cat: '安全', duration: '1 小时', freq: '每年', target: '全员',         comp: 95 },
            ].map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${c.cat === '合规' ? 'red' : c.cat === '风控' ? 'amber' : c.cat === '业务' ? 'blue' : 'purple'}`}>{c.cat}</span>
                </td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.duration}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.freq}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.target}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: 'var(--border)', borderRadius: 3 }}>
                      <div style={{ width: `${c.comp}%`, height: '100%', background: c.comp >= 90 ? 'var(--accent-green)' : 'var(--accent-amber)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.comp}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="section-header"><span className="section-title">🏆 专业资格证书 (持证上岗)</span></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>证书</th>
              <th style={{ padding: 12 }}>颁发机构</th>
              <th style={{ padding: 12 }}>持证要求</th>
              <th style={{ padding: 12, textAlign: 'right' }}>持证人数</th>
              <th style={{ padding: 12 }}>有效期</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'CFA (特许金融分析师)',           org: 'CFA Institute',    req: '基金/投资顾问', count: 1240,  validity: '终身' },
              { name: 'FRM (金融风险管理师)',           org: 'GARP',             req: '风险管理',     count: 480,   validity: '终身' },
              { name: 'CAMS (反洗钱认证)',              org: 'ACAMS',            req: '合规岗位',     count: 280,   validity: '3 年' },
              { name: 'CFP (理财规划师)',               org: 'FPSB',             req: '理财顾问',     count: 2840,  validity: '2 年' },
              { name: 'AFP (金融理财师)',               org: 'FPSB',             req: '客户经理',     count: 8420,  validity: '2 年' },
              { name: 'CPA (注册会计师)',               org: '中注协',           req: '财务岗',       count: 380,   validity: '终身' },
              { name: '基金从业资格',                   org: '中国证券业协会',    req: '基金销售',     count: 6240,  validity: '终身' },
              { name: '保险代理从业资格',               org: '中国银保监会',      req: '保险销售',     count: 4820,  validity: '终身' },
            ].map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.org}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{c.req}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{c.count.toLocaleString()}</td>
                <td style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>{c.validity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
