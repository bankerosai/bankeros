/**
 * Branch Network Management
 * 物理网点 · ATM/VTM · 自助设备 · 网点 KPI · 开/迁/撤管理
 */

const BRANCHES = [
  { id: 'BR-SH-001', code: '上海001', name: '上海分行 (主行)',           city: '上海', addr: '陆家嘴金融贸易区世纪大道 1500 号', area: 'CN-EAST',  type: 'MAIN_BRANCH', staff: 240, atm: 12, kpiAum: '¥ 1,200B', kpiSatisfaction: 4.7, status: 'OPERATING' },
  { id: 'BR-SH-002', code: '上海002', name: '陆家嘴金融支行',             city: '上海', addr: '陆家嘴环路 1000 号', area: 'CN-EAST', type: 'PREMIER_BRANCH', staff: 124, atm: 6,  kpiAum: '¥ 320B', kpiSatisfaction: 4.8, status: 'OPERATING' },
  { id: 'BR-SH-003', code: '上海003', name: '静安寺支行',                 city: '上海', addr: '南京西路 1788 号', area: 'CN-EAST', type: 'STANDARD', staff: 62,  atm: 4,  kpiAum: '¥ 84B',  kpiSatisfaction: 4.5, status: 'OPERATING' },
  { id: 'BR-SH-004', code: '上海004', name: '虹桥商务区支行',             city: '上海', addr: '诸光路 1588 号', area: 'CN-EAST', type: 'STANDARD', staff: 48,  atm: 3,  kpiAum: '¥ 62B',  kpiSatisfaction: 4.6, status: 'OPERATING' },
  { id: 'BR-BJ-001', code: '北京001', name: '北京分行 (主行)',            city: '北京', addr: '建国门外大街 1 号', area: 'CN-NORTH', type: 'MAIN_BRANCH', staff: 280, atm: 18, kpiAum: '¥ 680B',  kpiSatisfaction: 4.6, status: 'OPERATING' },
  { id: 'BR-BJ-002', code: '北京002', name: '国贸 CBD 支行',              city: '北京', addr: '建国门外大街 1 号 国贸大厦', area: 'CN-NORTH', type: 'PREMIER_BRANCH', staff: 84,  atm: 6,  kpiAum: '¥ 240B', kpiSatisfaction: 4.7, status: 'OPERATING' },
  { id: 'BR-HK-001', code: '香港001', name: 'BankerOS 香港分行',         city: '香港', addr: '中环夏悫道 18 号', area: 'OVERSEAS', type: 'MAIN_BRANCH', staff: 320, atm: 24, kpiAum: '¥ 480B', kpiSatisfaction: 4.8, status: 'OPERATING' },
  { id: 'BR-SG-001', code: '新加坡001', name: 'BankerOS 新加坡分行',     city: '新加坡', addr: 'Marina Bay Financial Centre', area: 'OVERSEAS', type: 'MAIN_BRANCH', staff: 180, atm: 12, kpiAum: '¥ 320B', kpiSatisfaction: 4.9, status: 'OPERATING' },
  { id: 'BR-LON-001', code: '伦敦001', name: 'BankerOS London',          city: 'London', addr: '15 Canary Wharf, E14 5JP', area: 'OVERSEAS', type: 'MAIN_BRANCH', staff: 140, atm: 8,  kpiAum: '¥ 280B', kpiSatisfaction: 4.7, status: 'OPERATING' },
  { id: 'BR-NEW-001', code: '苏州 (筹)', name: '苏州工业园区支行',         city: '苏州', addr: '苏州工业园区金鸡湖大道 88 号', area: 'CN-EAST', type: 'STANDARD', staff: 0,  atm: 0,  kpiAum: '¥ 0', kpiSatisfaction: 0,   status: 'OPENING' },
  { id: 'BR-CLO-001', code: '废止', name: '某老旧网点 (待撤)',           city: '上海', addr: '徐汇区天平路 56 号', area: 'CN-EAST', type: 'STANDARD', staff: 24, atm: 2,  kpiAum: '¥ 18B', kpiSatisfaction: 3.8, status: 'CLOSING' },
];

const SELF_SERVICE = [
  { type: 'ATM 现金取款机',  count: 4820,  uptime: '99.8%', monthly: '120 万笔', status: '正常' },
  { type: 'VTM 远程视频柜员', count: 1240,  uptime: '99.5%', monthly: '48 万笔',  status: '正常' },
  { type: '智能柜台',       count: 2840,  uptime: '99.7%', monthly: '180 万笔', status: '正常' },
  { type: '自助发卡机',      count: 1820,  uptime: '99.6%', monthly: '24 万笔',  status: '正常' },
  { type: '智能存款机 CRS',  count: 3280,  uptime: '99.4%', monthly: '90 万笔',  status: '正常' },
  { type: '外汇兑换机',      count: 480,   uptime: '99.0%', monthly: '12 万笔',  status: '关注' },
];

export default function BranchNetwork() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🏬 网点管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          物理网点 · ATM/VTM · 自助设备 · 网点 KPI · 开/迁/撤管理 · 服务全球 64 国
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '物理网点总数', value: '2,840',  color: 'var(--accent-blue)' },
          { label: '国内网点',     value: '2,580' },
          { label: '海外网点',     value: '260',   sub: '38 国家', color: 'var(--accent-purple)' },
          { label: 'ATM/VTM 设备', value: '14,480' },
          { label: '在筹建网点',   value: '24',     color: 'var(--accent-amber)' },
          { label: '客户满意度',   value: '4.7/5',  color: 'var(--accent-green)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Self-Service Equipment Summary */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title">🤖 自助设备汇总</span>
          <span className="badge badge-green">平均可用率 99.5%</span>
        </div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>设备类型</th>
              <th style={{ padding: 12, textAlign: 'right' }}>总数</th>
              <th style={{ padding: 12, textAlign: 'right' }}>可用率</th>
              <th style={{ padding: 12, textAlign: 'right' }}>月交易量</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {SELF_SERVICE.map(s => (
              <tr key={s.type} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{s.type}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{s.count.toLocaleString()}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: parseFloat(s.uptime) >= 99.5 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{s.uptime}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>{s.monthly}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge ${s.status === '正常' ? 'badge-green' : 'badge-amber'}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Branch list */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">🏢 网点列表</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <select style={{ padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 12 }}>
              <option>全部区域</option><option>华北</option><option>华东</option><option>华南</option><option>西南</option><option>海外</option>
            </select>
            <select style={{ padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 12 }}>
              <option>全部类型</option><option>主行</option><option>Premier 旗舰</option><option>标准网点</option>
            </select>
            <button className="btn btn-primary" style={{ fontSize: 12 }}>+ 新建网点</button>
          </div>
        </div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>网点编号</th>
              <th style={{ padding: 12 }}>网点名称</th>
              <th style={{ padding: 12 }}>地址</th>
              <th style={{ padding: 12 }}>类型</th>
              <th style={{ padding: 12, textAlign: 'right' }}>员工</th>
              <th style={{ padding: 12, textAlign: 'right' }}>ATM</th>
              <th style={{ padding: 12, textAlign: 'right' }}>AUM</th>
              <th style={{ padding: 12, textAlign: 'right' }}>满意度</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {BRANCHES.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 11, color: 'var(--accent-cyan)' }}>{b.id}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{b.name}</td>
                <td style={{ padding: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div>{b.city} · {b.addr}</div>
                </td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${b.type === 'MAIN_BRANCH' ? 'blue' : b.type === 'PREMIER_BRANCH' ? 'purple' : 'gray'}`} style={{ fontSize: 10 }}>
                    {b.type === 'MAIN_BRANCH' ? '主行' : b.type === 'PREMIER_BRANCH' ? 'Premier 旗舰' : '标准'}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: 'right' }}>{b.staff || '—'}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>{b.atm || '—'}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-green)' }}>{b.kpiAum}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  {b.kpiSatisfaction > 0 ? (
                    <span style={{ fontFamily: 'monospace', color: b.kpiSatisfaction >= 4.5 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      ⭐ {b.kpiSatisfaction}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${b.status === 'OPERATING' ? 'green' : b.status === 'OPENING' ? 'blue' : 'red'}`}>
                    {b.status === 'OPERATING' ? '运营中' : b.status === 'OPENING' ? '筹建中' : '即将撤销'}
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
