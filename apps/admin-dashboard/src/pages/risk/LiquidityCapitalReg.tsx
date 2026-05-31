/**
 * Liquidity Risk + Capital Management + Regulatory Reporting + Internal Audit
 * 4 modules in one file for efficiency
 */

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

// ────────────────────────────────────────────────────────────
// LIQUIDITY RISK MANAGEMENT
// LCR (Liquidity Coverage Ratio) + NSFR (Net Stable Funding Ratio) + Cash Flow Gap
// ────────────────────────────────────────────────────────────
export function LiquidityRisk() {
  const LCR_TREND = Array.from({ length: 12 }, (_, i) => ({
    month: `${i + 1}月`,
    lcr: 138 + Math.sin(i / 2) * 8 + Math.random() * 4,
    nsfr: 122 + Math.cos(i / 2) * 6 + Math.random() * 3,
    target: 100,
  }));

  const CASH_GAP = [
    { bucket: '0-7 天',   inflow: 84000, outflow: 62000, net: 22000 },
    { bucket: '8-30 天',  inflow: 124000, outflow: 98000, net: 26000 },
    { bucket: '31-90 天', inflow: 184000, outflow: 142000, net: 42000 },
    { bucket: '91-180 天', inflow: 224000, outflow: 198000, net: 26000 },
    { bucket: '181-365 天', inflow: 284000, outflow: 242000, net: 42000 },
    { bucket: '> 1 年',   inflow: 1840000, outflow: 1620000, net: 220000 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>💧 流动性风险管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          LCR (Liquidity Coverage Ratio) · NSFR (Net Stable Funding Ratio) · 现金流缺口 · 应急融资计划
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'LCR 流动性覆盖率', value: '142%', target: '≥ 100%', color: 'var(--accent-green)', desc: 'HQLA / 30 天压力净流出' },
          { label: 'NSFR 净稳定资金比率', value: '124%', target: '≥ 100%', color: 'var(--accent-green)', desc: 'ASF / RSF' },
          { label: 'HQLA 高质量流动资产', value: '¥ 480B', target: 'Level 1: 380B', color: 'var(--accent-blue)', desc: '国债/央行存款' },
          { label: '存贷比',               value: '67.8%', target: '≤ 75%',   color: 'var(--accent-green)', desc: '贷款/存款比率' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>监管: {k.target}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{k.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-header"><span className="section-title">LCR & NSFR 12 月走势</span><span className="badge badge-green">超监管要求</span></div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LCR_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="lcr"    name="LCR"  stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="nsfr"   name="NSFR" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="target" name="监管线" stroke="#ef4444" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-header"><span className="section-title">📊 现金流缺口分析 (¥M)</span></div>
          <div className="card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASH_GAP}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Bar dataKey="inflow"  name="资金流入" fill="#22c55e" />
                <Bar dataKey="outflow" name="资金流出" fill="#ef4444" />
                <Bar dataKey="net"     name="净流量"   fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 14 }}>🆘 应急融资计划 (Contingency Funding Plan)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { tier: '一级应急来源 (24h内)', amount: '¥ 420B', sources: ['央行 SLF 短期流动性便利 ¥ 200B', '同业拆借备用额度 ¥ 120B', 'HQLA 抛售 ¥ 100B'] },
            { tier: '二级应急来源 (1-7天)', amount: '¥ 320B', sources: ['央行 MLF 中期借贷便利 ¥ 180B', '资产证券化 ABS ¥ 80B', '回购协议 ¥ 60B'] },
            { tier: '三级应急来源 (1-4周)', amount: '¥ 240B', sources: ['发行同业存单 ¥ 120B', '债券二级市场出售 ¥ 80B', '海外母行支援 ¥ 40B'] },
            { tier: '严重压力 (1月+)',     amount: '¥ 180B', sources: ['处置非核心资产 ¥ 100B', '股权融资 ¥ 50B', '政府救助 ¥ 30B (按 SIB 框架)'] },
          ].map(t => (
            <div key={t.tier} style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{t.tier}</span>
                <span style={{ fontWeight: 800, fontSize: 18 }}>{t.amount}</span>
              </div>
              {t.sources.map(s => (
                <div key={s} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0' }}>• {s}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CAPITAL MANAGEMENT
// CET1 + Tier 1 + Total Capital + RWA + ICAAP
// ────────────────────────────────────────────────────────────
export function CapitalManagement() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🏛 资本管理</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          CET1 / Tier 1 / 总资本充足率 · RWA 风险加权资产 · ICAAP 内部资本充足评估 · 巴塞尔 III/IV
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'CET1 比率',     value: '13.8%', floor: '≥ 7.5%',  color: 'var(--accent-green)' },
          { label: 'Tier 1 比率',   value: '15.4%', floor: '≥ 8.5%',  color: 'var(--accent-green)' },
          { label: '总资本比率',    value: '18.1%', floor: '≥ 10.5%', color: 'var(--accent-green)' },
          { label: '杠杆率',        value: '5.2%',  floor: '≥ 3.0%',  color: 'var(--accent-green)' },
          { label: '逆周期缓冲',    value: '1.5%',  floor: '0-2.5%',  color: 'var(--accent-blue)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>监管: {k.floor}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>📊 RWA 风险加权资产分解 (¥B)</div>
          <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: 12 }}>风险类别</th>
                <th style={{ padding: 12, textAlign: 'right' }}>RWA</th>
                <th style={{ padding: 12, textAlign: 'right' }}>占比</th>
                <th style={{ padding: 12 }}>方法</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['信用风险', 1820, 68, 'IRB 内部评级法'],
                ['市场风险',  184, 7,  'FRTB-SA 标准法'],
                ['操作风险',  240, 9,  'SA-OR 标准法'],
                ['CVA',       42,  2,  '信用估值调整'],
                ['交易对手', 384, 14, '当前敞口法 CEM'],
              ].map((r: any) => (
                <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{r[0]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>¥ {r[1]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{r[2]}%</td>
                  <td style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>{r[3]}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--bg-secondary)' }}>
                <td style={{ padding: 12, fontWeight: 800 }}>RWA 总计</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>¥ 2,670</td>
                <td style={{ padding: 12, textAlign: 'right', fontWeight: 800 }}>100%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 14 }}>💰 资本构成 (¥B)</div>
          <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>核心一级资本 (CET1)</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>¥ 368.5</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>实收资本 ¥220 + 资本公积 ¥84 + 留存收益 ¥86 - 商誉 ¥21.5</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>+ 其他一级资本 (AT1)</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>¥ 42.7</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>永续债 + 优先股</div>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>+ 二级资本 (Tier 2)</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>¥ 72.5</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>次级债 + 一般贷款损失准备</div>
          </div>
          <div style={{ marginTop: 14, padding: 14, background: 'var(--accent-green)', color: 'white', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 13, opacity: 0.9 }}>总资本</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>¥ 483.7 B</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>资本充足率 = 483.7 / 2,670 = 18.1%</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 14 }}>📋 ICAAP 内部资本充足评估</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          ICAAP (Internal Capital Adequacy Assessment Process) 是巴塞尔第二支柱要求 — 银行需评估自身全面风险并确保资本充足
        </div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>第一支柱 (Pillar 1)</th>
              <th style={{ padding: 12, textAlign: 'right' }}>资本占用 (¥B)</th>
              <th style={{ padding: 12 }}>第二支柱 (Pillar 2)</th>
              <th style={{ padding: 12, textAlign: 'right' }}>资本占用 (¥B)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['信用风险', 218, '集中度风险', 42],
              ['市场风险', 22,  '银行账簿利率风险 IRRBB', 38],
              ['操作风险', 29,  '战略风险', 18],
              ['交易对手', 46,  '声誉风险', 12],
              ['CVA',     5,   '气候风险 (新)', 8],
            ].map((r: any) => (
              <tr key={r[0] as string} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12 }}>{r[0]}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>¥ {r[1]}</td>
                <td style={{ padding: 12 }}>{r[2]}</td>
                <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>¥ {r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// REGULATORY REPORTING
// Basel III/IV · BCBS 239 · IFRS 9 · COREP · FINREP
// ────────────────────────────────────────────────────────────
export function RegulatoryReporting() {
  const REPORTS = [
    { code: 'COREP-OF',  name: 'COREP 资本充足率报表',  frequency: '季度', regulator: '银保监会', lastSubmitted: '2025-04-30', nextDue: '2025-07-31', status: '已提交' },
    { code: 'COREP-LR',  name: 'COREP 杠杆率报表',      frequency: '季度', regulator: '银保监会', lastSubmitted: '2025-04-30', nextDue: '2025-07-31', status: '已提交' },
    { code: 'FINREP',    name: 'FINREP 财务报告',       frequency: '季度', regulator: '银保监会', lastSubmitted: '2025-04-30', nextDue: '2025-07-31', status: '已提交' },
    { code: 'LCR-DAILY', name: 'LCR 日报',              frequency: '日',   regulator: '央行',     lastSubmitted: '2025-05-30', nextDue: '2025-05-31', status: '草稿' },
    { code: 'BCBS-239',  name: 'BCBS 239 数据治理报告', frequency: '年度', regulator: '巴塞尔委员会', lastSubmitted: '2024-12-31', nextDue: '2025-12-31', status: '编制中' },
    { code: 'IFRS9-DIS', name: 'IFRS 9 减值披露',      frequency: '季度', regulator: '会计准则',  lastSubmitted: '2025-04-30', nextDue: '2025-07-31', status: '已提交' },
    { code: 'AML-FIU',   name: '反洗钱大额交易报告',    frequency: '日',   regulator: '人行反洗钱中心', lastSubmitted: '2025-05-30', nextDue: '2025-05-31', status: '已提交' },
    { code: 'SAR',       name: '可疑交易报告 (STR)',    frequency: '事项触发', regulator: '人行', lastSubmitted: '2025-05-28', nextDue: '随时', status: '常态化' },
    { code: 'FATCA-IRS', name: 'FATCA 美国账户报告',    frequency: '年度', regulator: 'IRS',      lastSubmitted: '2025-03-31', nextDue: '2026-03-31', status: '已提交' },
    { code: 'CRS-OECD',  name: 'CRS 共同申报',          frequency: '年度', regulator: '税务总局', lastSubmitted: '2025-05-31', nextDue: '2026-05-31', status: '已提交' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>📋 监管报送</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Basel III/IV · BCBS 239 · IFRS 9 · COREP · FINREP · FATCA · CRS · AML/CFT
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: '本年应提报表', value: '184', color: 'var(--accent-blue)' },
          { label: '已提交',       value: '172', color: 'var(--accent-green)' },
          { label: '草稿中',       value: '8',   color: 'var(--accent-amber)' },
          { label: '逾期',         value: '0',   color: 'var(--accent-green)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header"><span className="section-title">📑 监管报表追踪</span><button className="btn btn-primary">+ 新建报表</button></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>代码</th>
              <th style={{ padding: 12 }}>报表名称</th>
              <th style={{ padding: 12 }}>频率</th>
              <th style={{ padding: 12 }}>监管机构</th>
              <th style={{ padding: 12 }}>上次提交</th>
              <th style={{ padding: 12 }}>下次截止</th>
              <th style={{ padding: 12 }}>状态</th>
              <th style={{ padding: 12 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {REPORTS.map(r => (
              <tr key={r.code} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{r.code}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: 12 }}><span className="badge badge-blue">{r.frequency}</span></td>
                <td style={{ padding: 12, fontSize: 12 }}>{r.regulator}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{r.lastSubmitted}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{r.nextDue}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge ${r.status === '已提交' ? 'badge-green' : r.status === '草稿' ? 'badge-amber' : r.status === '编制中' ? 'badge-blue' : 'badge-purple'}`}>{r.status}</span>
                </td>
                <td style={{ padding: 12 }}>
                  <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// INTERNAL AUDIT
// 3rd Line of Defense · Audit Plan · Findings · Remediation Tracking
// ────────────────────────────────────────────────────────────
export function InternalAudit() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>🔍 内部审计</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          第三道防线 · 独立客观 · 直接汇报董事会审计委员会 · IIA 国际内审师协会标准
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '本年审计项目', value: '280' },
          { label: '已完成',       value: '184', color: 'var(--accent-green)' },
          { label: '进行中',       value: '62',  color: 'var(--accent-blue)' },
          { label: '审计发现',     value: '1,420' },
          { label: '整改关闭率',   value: '92%', color: 'var(--accent-green)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color ?? 'var(--text-primary)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-header"><span className="section-title">📋 2025 年度审计计划</span><span className="badge badge-blue">280 个项目</span></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>项目编号</th>
              <th style={{ padding: 12 }}>审计对象</th>
              <th style={{ padding: 12 }}>类型</th>
              <th style={{ padding: 12 }}>风险评级</th>
              <th style={{ padding: 12 }}>负责人</th>
              <th style={{ padding: 12 }}>计划期</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'AUD-2025-184', target: '对公信贷部 信用评级流程',   type: '业务流程审计', risk: 'HIGH',   owner: '王审计师', period: '2025 Q3', status: '进行中' },
              { id: 'AUD-2025-183', target: 'IT 信息安全 渗透测试',       type: 'IT 审计',     risk: 'HIGH',   owner: '李审计师', period: '2025 Q3', status: '进行中' },
              { id: 'AUD-2025-182', target: '反洗钱 KYC 流程',           type: '合规审计',    risk: 'HIGH',   owner: '张审计师', period: '2025 Q2', status: '报告中' },
              { id: 'AUD-2025-181', target: '财富管理 适当性销售',        type: '业务流程审计', risk: 'MEDIUM', owner: '陈审计师', period: '2025 Q2', status: '已完成' },
              { id: 'AUD-2025-180', target: '现金管理 备用金',           type: '财务审计',    risk: 'LOW',    owner: '刘审计师', period: '2025 Q2', status: '已完成' },
            ].map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{a.id}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{a.target}</td>
                <td style={{ padding: 12 }}><span className="badge badge-blue">{a.type}</span></td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${a.risk === 'HIGH' ? 'red' : a.risk === 'MEDIUM' ? 'amber' : 'gray'}`}>{a.risk}</span>
                </td>
                <td style={{ padding: 12, fontSize: 12 }}>{a.owner}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{a.period}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${a.status === '已完成' ? 'green' : a.status === '报告中' ? 'amber' : 'blue'}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="section-header"><span className="section-title">⚠️ 重大审计发现追踪 (Open Findings)</span><span className="badge badge-amber">108 待整改</span></div>
        <table className="b-table" style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              <th style={{ padding: 12 }}>发现编号</th>
              <th style={{ padding: 12 }}>审计项目</th>
              <th style={{ padding: 12 }}>发现描述</th>
              <th style={{ padding: 12 }}>严重性</th>
              <th style={{ padding: 12 }}>整改负责人</th>
              <th style={{ padding: 12 }}>截止日期</th>
              <th style={{ padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'F-2025-1248', proj: 'AUD-2025-182', desc: 'KYC 客户尽职调查档案缺失 18 份', sev: 'HIGH',   owner: '合规部', due: '2025-06-30', status: '整改中' },
              { id: 'F-2025-1247', proj: 'AUD-2025-184', desc: '对公贷款 5 笔评级模型偏离 50bp+',  sev: 'HIGH',   owner: '信贷部', due: '2025-06-15', status: '整改中' },
              { id: 'F-2025-1246', proj: 'AUD-2025-183', desc: '服务器修复延迟 · 安全补丁缺失 12 项', sev: 'MEDIUM', owner: 'IT 部',  due: '2025-06-10', status: '已逾期' },
              { id: 'F-2025-1245', proj: 'AUD-2025-181', desc: '财富顾问销售不当 2 起 · 处罚通报',  sev: 'MEDIUM', owner: '财富部', due: '2025-07-01', status: '整改中' },
              { id: 'F-2025-1244', proj: 'AUD-2025-180', desc: '现金管理日报缺失 1 次 (上月)',     sev: 'LOW',    owner: '运营部', due: '2025-05-30', status: '已完成' },
            ].map(f => (
              <tr key={f.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{f.id}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{f.proj}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{f.desc}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${f.sev === 'HIGH' ? 'red' : f.sev === 'MEDIUM' ? 'amber' : 'gray'}`}>{f.sev}</span>
                </td>
                <td style={{ padding: 12, fontSize: 12 }}>{f.owner}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{f.due}</td>
                <td style={{ padding: 12 }}>
                  <span className={`badge badge-${f.status === '已完成' ? 'green' : f.status === '已逾期' ? 'red' : 'amber'}`}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
