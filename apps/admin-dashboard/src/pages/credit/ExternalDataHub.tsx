/**
 * External Data Hub - integration with 12+ external data sources
 * 人行征信 / 工商 / 税务 / 司法 / 海关 / 外部评级机构
 */

export default function ExternalDataHub() {
  const SOURCES = [
    { category: '🏛 征信机构', items: [
      { name: '中国人民银行征信中心',     api: '/api/external/pbc-credit',         status: 'CONNECTED', usage: '12,840 次/月', cost: '¥ 8/次', sla: '99.9%', lastSync: '2 分钟前' },
      { name: '百行征信 (民营征信)',       api: '/api/external/baihang',            status: 'CONNECTED', usage: '8,420 次/月',  cost: '¥ 4/次', sla: '99.5%', lastSync: '5 分钟前' },
      { name: '芝麻信用 (个人小额)',       api: '/api/external/zhima',              status: 'CONNECTED', usage: '24,180 次/月', cost: '¥ 2/次', sla: '99.8%', lastSync: '1 分钟前' },
    ]},
    { category: '🏢 工商 / 商业信息', items: [
      { name: '国家企业信用信息公示系统',  api: '/api/external/gsxt',               status: 'CONNECTED', usage: '5,420 次/月',  cost: '免费',  sla: '95.0%', lastSync: '15 分钟前' },
      { name: '天眼查 API',                api: '/api/external/tianyancha',         status: 'CONNECTED', usage: '12,800 次/月', cost: '¥ 1/次', sla: '99.5%', lastSync: '3 分钟前' },
      { name: '企查查 API',                api: '/api/external/qichacha',           status: 'CONNECTED', usage: '8,200 次/月',  cost: '¥ 1.2/次', sla: '99.0%', lastSync: '8 分钟前' },
    ]},
    { category: '💰 税务 / 财务', items: [
      { name: '电子税务局 (税务总局)',     api: '/api/external/etax',               status: 'CONNECTED', usage: '4,840 次/月',  cost: '免费 (授权后)', sla: '98.0%', lastSync: '12 分钟前' },
      { name: '增值税发票核验',            api: '/api/external/fapiao',             status: 'CONNECTED', usage: '18,420 次/月', cost: '¥ 0.5/次', sla: '99.7%', lastSync: '1 分钟前' },
    ]},
    { category: '⚖️ 司法 / 行政', items: [
      { name: '中国裁判文书网',            api: '/api/external/court-judgment',     status: 'CONNECTED', usage: '3,210 次/月',  cost: '免费',  sla: '90.0%', lastSync: '22 分钟前' },
      { name: '失信被执行人名单',          api: '/api/external/dishonest',          status: 'CONNECTED', usage: '8,420 次/月',  cost: '免费',  sla: '99.0%', lastSync: '5 分钟前' },
      { name: '海关 AEO 认证查询',         api: '/api/external/customs-aeo',        status: 'CONNECTED', usage: '420 次/月',    cost: '免费',  sla: '95.0%', lastSync: '1 小时前' },
    ]},
    { category: '🏘 资产 / 不动产', items: [
      { name: '全国不动产登记查询',        api: '/api/external/realestate',         status: 'CONNECTED', usage: '1,840 次/月',  cost: '¥ 50/次', sla: '99.0%', lastSync: '30 分钟前' },
      { name: '车辆抵押查询 (公安部)',     api: '/api/external/vehicle',            status: 'CONNECTED', usage: '620 次/月',    cost: '¥ 20/次', sla: '99.0%', lastSync: '45 分钟前' },
    ]},
    { category: '🌐 国际数据源', items: [
      { name: 'Dow Jones 制裁筛查',        api: '/api/external/dowjones',           status: 'CONNECTED', usage: '48,000 次/月', cost: '$ 0.05/次', sla: '99.9%', lastSync: '< 1 分钟' },
      { name: 'World-Check Refinitiv',     api: '/api/external/worldcheck',         status: 'CONNECTED', usage: '24,000 次/月', cost: '$ 0.08/次', sla: '99.9%', lastSync: '< 1 分钟' },
      { name: 'D&B Hoovers (邓白氏)',      api: '/api/external/dnb',                status: 'CONNECTED', usage: '1,240 次/月',  cost: '$ 3/次',   sla: '99.5%', lastSync: '8 分钟前' },
    ]},
    { category: '⭐ 外部评级机构', items: [
      { name: '穆迪 Moody\'s',              api: '/api/external/moodys',             status: 'CONNECTED', usage: '420 次/月',    cost: '$ 50/次',  sla: '99.0%', lastSync: '3 小时前' },
      { name: '标普 S&P Global',           api: '/api/external/sp',                 status: 'CONNECTED', usage: '380 次/月',    cost: '$ 45/次',  sla: '99.0%', lastSync: '4 小时前' },
      { name: '惠誉 Fitch Ratings',        api: '/api/external/fitch',              status: 'CONNECTED', usage: '320 次/月',    cost: '$ 40/次',  sla: '99.0%', lastSync: '2 小时前' },
      { name: '中诚信国际',                api: '/api/external/ccxi',               status: 'CONNECTED', usage: '840 次/月',    cost: '¥ 200/次', sla: '99.0%', lastSync: '1 小时前' },
      { name: '大公国际',                  api: '/api/external/dagong',             status: 'CONNECTED', usage: '420 次/月',    cost: '¥ 180/次', sla: '98.5%', lastSync: '2 小时前' },
    ]},
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🔌 外部数据中心</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          整合 18 个外部数据源 · 实时 API 对接 · 服务全行 KYC / 信贷 / 风控 / 合规
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: '数据源总数',    value: '18',     color: 'var(--accent-blue)' },
          { label: '本月调用次数',  value: '184K',   color: 'var(--accent-cyan)' },
          { label: '本月调用成本',  value: '¥ 84K',  color: 'var(--accent-amber)' },
          { label: '平均 SLA',     value: '99.2%',  color: 'var(--accent-green)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {SOURCES.map(group => (
        <div key={group.category} className="card" style={{ marginBottom: 16 }}>
          <div className="section-header"><span className="section-title">{group.category}</span><span className="badge badge-blue">{group.items.length} 个数据源</span></div>
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12 }}>数据源</th>
                <th style={{ padding: 12 }}>API 端点</th>
                <th style={{ padding: 12 }}>状态</th>
                <th style={{ padding: 12, textAlign: 'right' }}>使用量</th>
                <th style={{ padding: 12, textAlign: 'right' }}>单价</th>
                <th style={{ padding: 12, textAlign: 'right' }}>SLA</th>
                <th style={{ padding: 12 }}>最后同步</th>
                <th style={{ padding: 12 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map(s => (
                <tr key={s.api} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 11, color: 'var(--accent-cyan)' }}>{s.api}</td>
                  <td style={{ padding: 12 }}><span className="badge badge-green">● {s.status}</span></td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{s.usage}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontSize: 12 }}>{s.cost}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: parseFloat(s.sla) >= 99 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{s.sla}</td>
                  <td style={{ padding: 12, fontSize: 11, color: 'var(--text-muted)' }}>{s.lastSync}</td>
                  <td style={{ padding: 12 }}>
                    <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>测试</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
