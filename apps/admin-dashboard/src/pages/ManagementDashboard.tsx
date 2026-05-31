/**
 * Management Dashboard — 12 Business-Line Views
 * ─────────────────────────────────────────────────────────────
 * 对标 HSBC / Citi / Standard Chartered 业务条线管理驾驶舱。
 * 12 个钻取域：
 *   1. Corporate Banking · 对公银行
 *   2. Transaction Banking · 交易银行
 *   3. Retail Banking · 零售银行
 *   4. FI (Financial Institutions) · 同业与金融机构
 *   5. Treasury / Global Markets · 资金与环球市场
 *   6. Risk · 风险管理
 *   7. Operations · 运营管理
 *   8. HR · 人力资源
 *   9. Finance · 财务管理
 *   10. IT & Digital · IT 与数字化
 *   11. Compliance & Legal · 合规与法务
 *   12. Wealth Management · 财富管理
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList,
} from 'recharts';
import { SignalKpi, SectionTitle, ChartCard, Light, tooltipStyle, STATUS_COLOR, Status } from '../components/DashboardKit';

// ──────────────────────────────────────────────────────────────────
// Tab Definitions
// ──────────────────────────────────────────────────────────────────
type TabKey =
  | 'corporate' | 'transaction' | 'retail' | 'fi' | 'treasury'
  | 'risk' | 'operations' | 'hr' | 'finance' | 'it' | 'compliance' | 'wealth';

const TABS: { key: TabKey; label: string; icon: string; color: string; desc: string }[] = [
  { key: 'corporate',   label: '对公银行',   icon: '🏢', color: '#f59e0b', desc: 'Corporate Banking · CMB' },
  { key: 'transaction', label: '交易银行',   icon: '⟳',  color: '#06b6d4', desc: 'Transaction Banking · GTS' },
  { key: 'retail',      label: '零售银行',   icon: '🏠', color: '#22c55e', desc: 'Retail Banking · PFS' },
  { key: 'wealth',      label: '财富管理',   icon: '💎', color: '#a855f7', desc: 'Wealth & Private Banking' },
  { key: 'fi',          label: '同业/FI',    icon: '🔗', color: '#3b82f6', desc: 'Financial Institutions' },
  { key: 'treasury',    label: '资金/GM',    icon: '📈', color: '#ec4899', desc: 'Treasury & Global Markets' },
  { key: 'risk',        label: '风险管理',   icon: '🛡', color: '#ef4444', desc: 'Enterprise Risk' },
  { key: 'operations',  label: '运营',       icon: '⚡', color: '#8b5cf6', desc: 'Operations' },
  { key: 'hr',          label: '人力资源',   icon: '👥', color: '#14b8a6', desc: 'Human Resources' },
  { key: 'finance',     label: '财务',       icon: '💰', color: '#10b981', desc: 'Finance & Planning' },
  { key: 'it',          label: 'IT/数字化',  icon: '💻', color: '#0ea5e9', desc: 'IT & Digital' },
  { key: 'compliance',  label: '合规/法务',  icon: '⚖',  color: '#64748b', desc: 'Compliance & Legal' },
];

// ══════════════════════════════════════════════════════════════════
// 1. CORPORATE BANKING
// ══════════════════════════════════════════════════════════════════
function CorporateTab() {
  const PIPELINE = [
    { stage: '潜在客户 (Lead)',  count: 1840, value: 4200, fill: '#94a3b8' },
    { stage: '方案阶段',          count: 720,  value: 2800, fill: '#3b82f6' },
    { stage: '审批阶段',          count: 380,  value: 1860, fill: '#a855f7' },
    { stage: '签约阶段',          count: 184,  value: 1240, fill: '#f59e0b' },
    { stage: '放款阶段',          count: 120,  value: 820,  fill: '#22c55e' },
  ];
  const REVENUE_MIX = [
    { name: '贷款利息', value: 38, color: '#3b82f6' },
    { name: '贸易融资', value: 18, color: '#22c55e' },
    { name: '保函',     value: 8,  color: '#f59e0b' },
    { name: '现金管理', value: 16, color: '#06b6d4' },
    { name: '外汇',     value: 12, color: '#a855f7' },
    { name: '投行业务', value: 8,  color: '#ec4899' },
  ];
  const RM_PERF = [
    { name: '王明',   customers: 42, revenue: 8420, profit: 3160, npl: 0.8 },
    { name: '李静',   customers: 38, revenue: 7680, profit: 2980, npl: 0.6 },
    { name: '张伟',   customers: 45, revenue: 7240, profit: 2680, npl: 1.4 },
    { name: '陈晓东', customers: 32, revenue: 6840, profit: 2620, npl: 0.4 },
    { name: '刘洋',   customers: 51, revenue: 6420, profit: 2180, npl: 1.8 },
    { name: '周敏',   customers: 28, revenue: 5840, profit: 2480, npl: 0.2 },
  ];
  return (
    <>
      <SectionTitle title="客户经营" icon="◎" subtitle="企业客户总数 · 活跃 · 新增 · 流失 · 覆盖率" />
      <div className="kpi-grid">
        <SignalKpi label="企业客户总数" value="8,124"   delta="↑ 3.2%" status="good" />
        <SignalKpi label="活跃客户"     value="5,284"   delta="活跃率 65%" status="good" />
        <SignalKpi label="新增客户(月)" value="124"     delta="↑ 18%" status="good" />
        <SignalKpi label="流失客户(月)" value="42"      delta="↓ 8" status="good" />
        <SignalKpi label="客户覆盖率"   value="68.4" unit="%" delta="↑ 2.4pp" status="good" target=">65%" />
        <SignalKpi label="ARPU 月均"    value="¥18.4" unit="万" delta="↑ 6.2%" status="good" />
      </div>

      <SectionTitle title="客户经理 (RM) 效率" icon="👤" subtitle="RM 数量 · 人均客户 · 人均收入 · 人均利润" />
      <div className="kpi-grid">
        <SignalKpi label="RM 数量"      value="284"          status="good" />
        <SignalKpi label="人均客户数"   value="28.6"  delta="↑ 1.2" status="good" />
        <SignalKpi label="人均收入(月)" value="¥620" unit="万" delta="↑ 8.4%" status="good" />
        <SignalKpi label="人均利润(月)" value="¥240" unit="万" delta="↑ 12%" status="good" />
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header"><span className="section-title">RM 效率排行榜 (Top 6)</span><span className="tag">月度</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>RM 姓名</th><th>客户数</th><th>月收入(万)</th><th>月利润(万)</th><th>NPL%</th><th>评级</th></tr></thead>
            <tbody>
              {RM_PERF.map((r, i) => (
                <tr key={r.name}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.customers}</td>
                  <td>¥{r.revenue.toLocaleString()}</td>
                  <td>¥{r.profit.toLocaleString()}</td>
                  <td><span style={{ color: r.npl > 1.5 ? STATUS_COLOR.alert : r.npl > 1 ? STATUS_COLOR.watch : STATUS_COLOR.good }}>{r.npl}%</span></td>
                  <td><Light s={r.npl > 1.5 ? 'watch' : 'good'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionTitle title="收入结构 · 资产规模" icon="💰" />
      <div className="grid-2">
        <ChartCard title="对公收入结构" extra={<span className="tag">YTD ¥482亿</span>}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={REVENUE_MIX} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {REVENUE_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="card">
          <div className="card-title">资产规模</div>
          {[
            { label: '授信总额',   v: 28400, unit: '亿', pct: 100, color: '#94a3b8' },
            { label: '贷款余额',   v: 22800, unit: '亿', pct: 80.3, color: '#3b82f6' },
            { label: '融资余额',   v: 18420, unit: '亿', pct: 64.9, color: '#22c55e' },
            { label: '提款率',     v: 80.3,  unit: '%', pct: 80.3, color: '#f59e0b' },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>{r.label}</span>
                <span style={{ fontWeight: 700 }}>{r.v.toLocaleString()} {r.unit}</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} /></div>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle title="销售 Pipeline · 漏斗 (Salesforce-style)" icon="🎯" subtitle="CEO 最关注：商机转化 · 加权预测收入" />
      <div className="grid-2">
        <ChartCard title="客户阶段漏斗" extra={<span className="tag">8 周内</span>} height={300}>
          <ResponsiveContainer>
            <BarChart data={PIPELINE} layout="vertical">
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
              <YAxis dataKey="stage" type="category" stroke="var(--text-muted)" fontSize={11} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {PIPELINE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                <LabelList dataKey="count" position="right" fill="var(--text-secondary)" fontSize={11} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="预期放款金额 (亿)" extra={<span className="badge badge-green">转化率 6.5%</span>} height={300}>
          <ResponsiveContainer>
            <BarChart data={PIPELINE}>
              <XAxis dataKey="stage" stroke="var(--text-muted)" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {PIPELINE.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. TRANSACTION BANKING
// ══════════════════════════════════════════════════════════════════
function TransactionTab() {
  const SCF_DATA = [
    { m: '1月', amount: 280, balance: 1840 }, { m: '2月', amount: 320, balance: 1980 },
    { m: '3月', amount: 380, balance: 2140 }, { m: '4月', amount: 420, balance: 2280 },
    { m: '5月', amount: 480, balance: 2480 }, { m: '6月', amount: 520, balance: 2680 },
    { m: '7月', amount: 580, balance: 2840 }, { m: '8月', amount: 640, balance: 3020 },
  ];
  const XBORDER = [
    { country: '香港',     count: 184000, amount: 2840 },
    { country: '新加坡',   count: 124000, amount: 2180 },
    { country: '美国',     count: 98400,  amount: 1840 },
    { country: '英国',     count: 68200,  amount: 1240 },
    { country: '日本',     count: 52400,  amount: 980 },
    { country: '澳洲',     count: 38200,  amount: 720 },
    { country: '阿联酋',   count: 28400,  amount: 580 },
  ];

  return (
    <>
      <SectionTitle title="Cash Management · 现金管理" icon="💼" subtitle="开户 · 余额 · 日均存款 · 支付" />
      <div className="kpi-grid">
        <SignalKpi label="对公开户数"     value="48,420"            delta="↑ 8.2%" status="good" />
        <SignalKpi label="账户余额"       value="¥1.84"  unit="万亿" delta="↑ 6.4%" status="good" />
        <SignalKpi label="日均存款"       value="¥1.72"  unit="万亿" delta="↑ 5.8%" status="good" />
        <SignalKpi label="支付笔数(日)"   value="280"    unit="万笔" delta="↑ 18%"  status="good" />
        <SignalKpi label="支付金额(日)"   value="¥4,280" unit="亿"   delta="↑ 12%"  status="good" />
        <SignalKpi label="API 客户占比"   value="62"     unit="%"    delta="↑ 8pp"  status="good" />
      </div>

      <SectionTitle title="Trade Finance · 贸易融资" icon="📋" subtitle="信用证 · 保函 · 福费廷 · 出口押汇" />
      <div className="kpi-grid">
        <SignalKpi label="LC 开立量(月)"     value="8,420" unit="笔" delta="↑ 14%" status="good" />
        <SignalKpi label="LC 余额"           value="¥682"  unit="亿"  delta="↑ 8.2%" status="good" />
        <SignalKpi label="保函余额"          value="¥1,240" unit="亿" delta="↑ 12%" status="good" />
        <SignalKpi label="福费廷余额"        value="¥420"  unit="亿"  delta="↑ 6%"  status="good" />
        <SignalKpi label="贸融总余额"        value="¥3,820" unit="亿" delta="↑ 11%" status="good" />
        <SignalKpi label="审单时间(平均)"    value="4.2"   unit="小时" delta="↓ 0.8h" status="good" target="<8h" />
      </div>

      <SectionTitle title="Supply Chain Finance · 供应链金融" icon="🔗" subtitle="核心企业 · 上下游供应商" />
      <div className="grid-2">
        <div>
          <div className="kpi-grid">
            <SignalKpi label="核心企业数"   value="284"            delta="↑ 18" status="good" />
            <SignalKpi label="供应商数"     value="18,420" delta="↑ 1,820" status="good" />
            <SignalKpi label="融资金额(月)" value="¥640"  unit="亿" delta="↑ 24%" status="good" />
            <SignalKpi label="融资余额"     value="¥3,020" unit="亿" delta="↑ 16%" status="good" />
            <SignalKpi label="逾期率"       value="0.42" unit="%" delta="↓ 0.08pp" status="good" target="<1%" />
            <SignalKpi label="平均融资期限" value="84"   unit="天" status="good" />
          </div>
        </div>
        <ChartCard title="SCF 融资金额与余额走势 (亿)" extra={<span className="tag">YoY +42%</span>} height={300}>
          <ResponsiveContainer>
            <AreaChart data={SCF_DATA}>
              <defs>
                <linearGradient id="scfG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="balance" name="融资余额" stroke="#06b6d4" fill="url(#scfG)" strokeWidth={2} />
              <Line type="monotone" dataKey="amount" name="月新增" stroke="#22c55e" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <SectionTitle title="Cross-Border Payments · 跨境支付" icon="🌐" subtitle="多币种 · SWIFT · CIPS · mBridge" />
      <div className="kpi-grid">
        <SignalKpi label="月支付笔数" value="820" unit="万" delta="↑ 24%" status="good" />
        <SignalKpi label="月支付金额" value="¥8,420" unit="亿" delta="↑ 28%" status="good" />
        <SignalKpi label="覆盖国家"  value="184"            status="good" />
        <SignalKpi label="客户数"    value="42,800"   delta="↑ 12%" status="good" />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header"><span className="section-title">Top 7 跨境走廊</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>目的地</th><th>月笔数</th><th>月金额(亿)</th><th>占比</th><th>主要币种</th></tr></thead>
            <tbody>
              {XBORDER.map(x => (
                <tr key={x.country}>
                  <td style={{ fontWeight: 600 }}>{x.country}</td>
                  <td>{x.count.toLocaleString()}</td>
                  <td>¥{x.amount.toLocaleString()}</td>
                  <td>{(x.amount / 8420 * 100).toFixed(1)}%</td>
                  <td><span className="tag">{x.country === '香港' ? 'HKD/USD' : x.country === '美国' ? 'USD' : x.country === '英国' ? 'GBP' : x.country === '日本' ? 'JPY' : x.country === '阿联酋' ? 'AED/USD' : 'SGD/USD'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. RETAIL BANKING
// ══════════════════════════════════════════════════════════════════
function RetailTab() {
  const APP_DATA = [
    { m: '1月', mau: 320, login: 8400, txn: 6200 },
    { m: '2月', mau: 332, login: 8680, txn: 6420 },
    { m: '3月', mau: 348, login: 9200, txn: 6840 },
    { m: '4月', mau: 358, login: 9520, txn: 7180 },
    { m: '5月', mau: 368, login: 9840, txn: 7460 },
    { m: '6月', mau: 376, login: 10240, txn: 7820 },
    { m: '7月', mau: 384, login: 10620, txn: 8140 },
    { m: '8月', mau: 412, login: 11420, txn: 8680 },
  ];
  return (
    <>
      <SectionTitle title="客户增长" icon="◎" />
      <div className="kpi-grid">
        <SignalKpi label="总客户数"     value="624"  unit="万"  delta="↑ 4.2%" status="good" />
        <SignalKpi label="新增客户(月)" value="34.2" unit="万"  delta="↑ 22%"  status="good" />
        <SignalKpi label="流失客户(月)" value="7.2"  unit="万"  delta="↓ 0.4万" status="good" />
        <SignalKpi label="净增长"       value="+27.0" unit="万" delta="↑ 24%"  status="good" />
      </div>

      <SectionTitle title="存款" icon="💰" />
      <div className="kpi-grid">
        <SignalKpi label="活期存款"   value="¥7,820" unit="亿" delta="↑ 8.4%" status="good" />
        <SignalKpi label="定期存款"   value="¥10,620" unit="亿" delta="↑ 5.2%" status="good" />
        <SignalKpi label="总存款"     value="¥18,440" unit="亿" delta="↑ 6.8%" status="good" />
        <SignalKpi label="CASA 比例"  value="42.4" unit="%" delta="↑ 1.2pp" status="good" target=">40%" />
      </div>

      <SectionTitle title="财富管理 (Retail Wealth)" icon="💎" />
      <div className="kpi-grid">
        <SignalKpi label="AUM 财富管理" value="¥6,200" unit="亿" delta="↑ 18%" status="good" />
        <SignalKpi label="基金销售(月)" value="¥240"  unit="亿" delta="↑ 32%" status="good" />
        <SignalKpi label="保险销售(月)" value="¥84"   unit="亿" delta="↑ 24%" status="good" />
        <SignalKpi label="理财销售(月)" value="¥620"  unit="亿" delta="↑ 12%" status="good" />
      </div>

      <SectionTitle title="信贷 (Retail Credit)" icon="💳" />
      <div className="kpi-grid">
        <SignalKpi label="按揭余额"     value="¥11,800" unit="亿" delta="↑ 4.8%" status="good" />
        <SignalKpi label="信用卡余额"   value="¥2,200" unit="亿" delta="↑ 12%"  status="good" />
        <SignalKpi label="消费贷余额"   value="¥6,200" unit="亿" delta="↑ 18%"  status="good" />
        <SignalKpi label="信用卡发卡量" value="184" unit="万张/年" delta="↑ 22%" status="good" />
        <SignalKpi label="按揭新增(月)" value="¥84" unit="亿" delta="↑ 6%" status="good" />
        <SignalKpi label="不良率"       value="1.18" unit="%" delta="↓ 0.04pp" status="good" target="<2%" />
      </div>

      <SectionTitle title="数字渠道" icon="📱" subtitle="APP · 网银 · 小程序 · 开放银行" />
      <div className="grid-2">
        <ChartCard title="APP MAU · 登录次数 · 交易笔数 (万)" extra={<span className="badge badge-green">数字化率 87.4%</span>} height={280}>
          <ResponsiveContainer>
            <LineChart data={APP_DATA}>
              <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="mau"   name="MAU"      stroke="#22c55e" strokeWidth={2.5} />
              <Line type="monotone" dataKey="login" name="登录(万次)" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="txn"   name="交易(万笔)" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <div>
          <div className="kpi-grid">
            <SignalKpi label="APP MAU"      value="412" unit="万" delta="↑ 18.6%" status="good" />
            <SignalKpi label="月登录次数"   value="11,420" unit="万" delta="↑ 14%" status="good" />
            <SignalKpi label="线上开户率"   value="72.8" unit="%"  delta="↑ 8.4pp" status="good" target=">70%" />
            <SignalKpi label="线上交易率"   value="87.4" unit="%"  delta="↑ 4.2pp" status="good" target=">80%" />
            <SignalKpi label="移动支付笔数" value="6.8" unit="亿/月" delta="↑ 32%" status="good" />
            <SignalKpi label="小程序 MAU"   value="184" unit="万" delta="↑ 42%" status="good" />
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. FI (Financial Institutions)
// ══════════════════════════════════════════════════════════════════
function FITab() {
  const FI_TYPE = [
    { name: '银行',       count: 1240, exposure: 8420, color: '#3b82f6' },
    { name: '保险',       count: 380,  exposure: 2680, color: '#22c55e' },
    { name: '证券',       count: 480,  exposure: 1840, color: '#a855f7' },
    { name: '基金',       count: 1820, exposure: 3240, color: '#f59e0b' },
    { name: '支付机构',   count: 380,  exposure: 820,  color: '#ec4899' },
    { name: '其他 NBFI',  count: 240,  exposure: 480,  color: '#94a3b8' },
  ];
  return (
    <>
      <SectionTitle title="FI 客户情况" icon="🔗" subtitle="同业 · 保险 · 证券 · 基金 · 支付机构" />
      <div className="kpi-grid">
        <SignalKpi label="FI 客户总数"      value="4,540"           delta="↑ 184" status="good" />
        <SignalKpi label="新增 FI 客户(月)" value="32"              delta="↑ 8"   status="good" />
        <SignalKpi label="活跃 FI 客户"     value="2,840"           delta="活跃率 62.5%" status="good" />
        <SignalKpi label="海外代理行"       value="1,840"   delta="覆盖 184 国" status="good" />
      </div>

      <SectionTitle title="同业授信" icon="🏛" />
      <div className="kpi-grid">
        <SignalKpi label="同业授信总额"   value="¥1.84" unit="万亿" delta="↑ 8%" status="good" />
        <SignalKpi label="已使用额度"     value="¥1.24" unit="万亿" delta="使用率 67.4%" status="good" />
        <SignalKpi label="剩余额度"       value="¥6,020" unit="亿"  status="good" />
        <SignalKpi label="国别集中度"     value="38" unit="%" delta="香港最大" status="watch" target="<40%" />
      </div>

      <SectionTitle title="FI 收入结构" icon="💵" />
      <div className="kpi-grid">
        <SignalKpi label="托管收入(月)"   value="¥38"  unit="亿" delta="↑ 14%" status="good" />
        <SignalKpi label="资金业务收入"   value="¥62"  unit="亿/月" delta="↑ 8%"  status="good" />
        <SignalKpi label="代理行收入"     value="¥24"  unit="亿/月" delta="↑ 6%"  status="good" />
        <SignalKpi label="清算服务收入"   value="¥18"  unit="亿/月" delta="↑ 22%" status="good" />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-header"><span className="section-title">FI 客户分类</span><span className="tag">按机构类型</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>机构类型</th><th>客户数</th><th>授信敞口(亿)</th><th>占比</th></tr></thead>
            <tbody>
              {FI_TYPE.map(f => (
                <tr key={f.name}>
                  <td><span style={{ display: 'inline-block', width: 10, height: 10, background: f.color, borderRadius: 2, marginRight: 8 }} />{f.name}</td>
                  <td>{f.count.toLocaleString()}</td>
                  <td>¥{f.exposure.toLocaleString()}</td>
                  <td>{(f.exposure / FI_TYPE.reduce((a, b) => a + b.exposure, 0) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. TREASURY / GLOBAL MARKETS
// ══════════════════════════════════════════════════════════════════
function TreasuryTab() {
  const BOND_DATA = [
    { type: '利率债',     position: 8420, yield: 2.84, color: '#3b82f6' },
    { type: '政府债',     position: 6240, yield: 2.62, color: '#22c55e' },
    { type: '金融债',     position: 4180, yield: 3.42, color: '#a855f7' },
    { type: '企业债',     position: 2820, yield: 4.18, color: '#f59e0b' },
    { type: '海外债',     position: 1840, yield: 4.62, color: '#06b6d4' },
  ];
  return (
    <>
      <SectionTitle title="外汇 FX" icon="💱" />
      <div className="kpi-grid">
        <SignalKpi label="日均 FX 交易量"  value="¥820" unit="亿/日" delta="↑ 18%" status="good" />
        <SignalKpi label="FX 月收入"       value="¥18.4" unit="亿"   delta="↑ 24%" status="good" />
        <SignalKpi label="FX 客户数"       value="8,420"             delta="↑ 12%" status="good" />
        <SignalKpi label="主要货币对"      value="48" unit="对"     status="good" />
      </div>

      <SectionTitle title="利率产品 (IRS / IRO)" icon="📈" />
      <div className="kpi-grid">
        <SignalKpi label="IRS 月交易量"  value="¥6,820" unit="亿" delta="↑ 14%" status="good" />
        <SignalKpi label="IRS 月收入"    value="¥4.2"  unit="亿"  delta="↑ 18%" status="good" />
        <SignalKpi label="利率衍生品名义" value="¥2.4" unit="万亿"  status="good" />
        <SignalKpi label="DV01"          value="¥84"  unit="万/bp" delta="↓ 4万" status="good" />
      </div>

      <SectionTitle title="债券持仓 · 银行账户" icon="📜" />
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>债券类别</th><th>持仓(亿)</th><th>到期收益率</th><th>占比</th><th>市值变动(MTM)</th></tr></thead>
            <tbody>
              {BOND_DATA.map(b => {
                const pct = (b.position / BOND_DATA.reduce((a, x) => a + x.position, 0) * 100).toFixed(1);
                return (
                  <tr key={b.type}>
                    <td><span style={{ display: 'inline-block', width: 10, height: 10, background: b.color, borderRadius: 2, marginRight: 8 }} />{b.type}</td>
                    <td style={{ fontWeight: 600 }}>¥{b.position.toLocaleString()}</td>
                    <td>{b.yield}%</td>
                    <td>{pct}%</td>
                    <td><span className="badge badge-green">+¥{(b.position * 0.018).toFixed(0)}M YTD</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SectionTitle title="流动性" icon="💧" />
      <div className="kpi-grid">
        <SignalKpi label="现金头寸"      value="¥1,842" unit="亿" delta="充裕" status="good" />
        <SignalKpi label="LCR"           value="161"   unit="%"  delta="↑ 5pp" status="good" target=">120%" />
        <SignalKpi label="NSFR"          value="125"   unit="%"  delta="↑ 1pp" status="good" target=">100%" />
        <SignalKpi label="HQLA 高流动性资产" value="¥1.84" unit="万亿" delta="↑ 8%" status="good" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 6. RISK
// ══════════════════════════════════════════════════════════════════
function RiskTab() {
  const INDUSTRY_RISK = [
    { name: '房地产',     loan: 4820, npl: 3.82 },
    { name: '建筑',       loan: 2840, npl: 2.42 },
    { name: '制造业',     loan: 6820, npl: 1.52 },
    { name: '贸易',       loan: 4280, npl: 1.84 },
    { name: '科技 TMT',   loan: 3820, npl: 0.92 },
    { name: '能源',       loan: 2480, npl: 1.24 },
    { name: '消费零售',   loan: 2820, npl: 1.68 },
  ];
  const EWS = [
    { client: '碧桂园控股',   issue: '评级下调 BBB→BB+', severity: 'alert' as Status, action: '已启动早期介入' },
    { client: '远洋集团',     issue: '90+ 天逾期 ¥4.2亿', severity: 'alert' as Status, action: '诉讼准备中' },
    { client: '某地产集团 A', issue: '现金流为负 3 期', severity: 'watch' as Status, action: '增加抵押要求' },
    { client: '某科技公司 B', issue: '行业景气度下降', severity: 'watch' as Status, action: '降低授信额度' },
    { client: '某航运公司 C', issue: '运价下跌 28%',   severity: 'watch' as Status, action: '加强月度跟踪' },
    { client: '某物流公司 D', issue: '应收账款激增',   severity: 'watch' as Status, action: '现场尽调' },
  ];
  return (
    <>
      <SectionTitle title="信贷风险 · 核心指标" icon="🛡" />
      <div className="kpi-grid">
        <SignalKpi label="NPL 率"        value="1.61" unit="%" delta="↓ 0.04pp" status="good" target="<2%" />
        <SignalKpi label="逾期率"        value="2.42" unit="%" delta="↑ 0.08pp" status="watch" />
        <SignalKpi label="拨备覆盖率"    value="248"  unit="%" delta="↑ 6pp"    status="good" target=">150%" />
        <SignalKpi label="贷款拨备率"    value="3.84" unit="%" delta="↑ 0.12pp" status="good" />
        <SignalKpi label="不良贷款余额"  value="¥482" unit="亿" delta="↓ ¥18亿" status="good" />
        <SignalKpi label="新增不良(月)"  value="¥18"  unit="亿" delta="↓ ¥4亿" status="good" />
      </div>

      <SectionTitle title="行业风险集中度" icon="📊" />
      <ChartCard title="行业贷款余额 vs NPL" extra={<span className="tag">7 大行业</span>} height={280}>
        <ResponsiveContainer>
          <BarChart data={INDUSTRY_RISK}>
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
            <YAxis yAxisId="L" stroke="var(--text-muted)" fontSize={11} />
            <YAxis yAxisId="R" orientation="right" stroke="var(--text-muted)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="L" dataKey="loan" name="贷款(亿)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="R" dataKey="npl" name="NPL%" stroke="#ef4444" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <SectionTitle title="客户风险集中度" icon="👥" />
      <div className="kpi-grid">
        <SignalKpi label="Top 20 敞口" value="¥820" unit="亿" delta="占总贷款 17.5%" status="watch" target="<20%" />
        <SignalKpi label="Top 50 敞口" value="¥1,420" unit="亿" delta="占 30.3%" status="watch" />
        <SignalKpi label="单一客户上限" value="¥84" unit="亿"  delta="资本 10%" status="good" />
        <SignalKpi label="关联交易上限" value="¥420" unit="亿" delta="资本 50%" status="good" />
      </div>

      <SectionTitle title="风险预警 (Early Warning System)" icon="⚠" subtitle="评级下降 · 逾期增加 · 现金流异常" />
      <div className="card">
        <div className="section-header">
          <span className="section-title">本月预警案例</span>
          <span className="badge badge-amber">未处理 6 件</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>客户</th><th>预警事件</th><th>严重程度</th><th>处置措施</th></tr></thead>
            <tbody>
              {EWS.map(e => (
                <tr key={e.client}>
                  <td style={{ fontWeight: 600 }}>{e.client}</td>
                  <td>{e.issue}</td>
                  <td><Light s={e.severity} /></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 7. OPERATIONS
// ══════════════════════════════════════════════════════════════════
function OperationsTab() {
  return (
    <>
      <SectionTitle title="交易处理" icon="⚡" />
      <div className="kpi-grid">
        <SignalKpi label="日交易总量"     value="3,420" unit="万笔" delta="↑ 18%" status="good" />
        <SignalKpi label="自动处理率 STP" value="87.4"  unit="%"    delta="↑ 2.4pp" status="good" target=">85%" />
        <SignalKpi label="人工处理率"     value="12.6"  unit="%"    delta="↓ 2.4pp" status="good" />
        <SignalKpi label="失败率"         value="0.18"  unit="%"    delta="↓ 0.04pp" status="good" target="<0.5%" />
        <SignalKpi label="重试成功率"     value="94.2"  unit="%"                  status="good" />
        <SignalKpi label="单笔平均处理成本" value="¥0.42"           delta="↓ 8%"  status="good" />
      </div>

      <SectionTitle title="开户运营" icon="📝" />
      <div className="kpi-grid">
        <SignalKpi label="对私开户(日)" value="6,840"  delta="↑ 12%" status="good" />
        <SignalKpi label="对公开户(日)" value="240"    delta="↑ 8%"  status="good" />
        <SignalKpi label="平均开户时间(对私)" value="8.4" unit="分钟" delta="↓ 1.2min" status="good" target="<15min" />
        <SignalKpi label="平均开户时间(对公)" value="2.4" unit="天"  delta="↓ 0.4天"  status="good" target="<3天" />
      </div>

      <SectionTitle title="贸易融资单证" icon="📋" />
      <div className="kpi-grid">
        <SignalKpi label="月单证处理量"  value="42,800" delta="↑ 14%" status="good" />
        <SignalKpi label="审单平均时间"  value="4.2" unit="小时" delta="↓ 0.8h" status="good" target="<8h" />
        <SignalKpi label="一次性通过率"  value="82.4" unit="%" delta="↑ 4pp" status="good" />
        <SignalKpi label="退单率"        value="6.8"  unit="%" delta="↓ 1.2pp" status="good" target="<10%" />
      </div>

      <SectionTitle title="SLA 服务等级" icon="⏱" />
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>业务类别</th><th>SLA 标准</th><th>本月按时率</th><th>超时案件</th><th>状态</th></tr></thead>
            <tbody>
              {[
                { biz: '对私开户',     sla: '<15 分钟', rate: 96.8, over: 218, status: 'good' as Status },
                { biz: '对公开户',     sla: '<3 天',    rate: 92.4, over: 18,  status: 'good' as Status },
                { biz: '消费贷审批',   sla: '<5 分钟',  rate: 98.2, over: 42,  status: 'good' as Status },
                { biz: '企业贷审批',   sla: '<10 天',   rate: 88.4, over: 24,  status: 'watch' as Status },
                { biz: 'LC 开立',     sla: '<8 小时',  rate: 94.2, over: 38,  status: 'good' as Status },
                { biz: '汇款处理',     sla: '<1 小时',  rate: 99.2, over: 184, status: 'good' as Status },
                { biz: '投诉响应',     sla: '<4 小时',  rate: 91.8, over: 28,  status: 'watch' as Status },
              ].map(r => (
                <tr key={r.biz}>
                  <td>{r.biz}</td>
                  <td><span className="tag">{r.sla}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100 }} className="progress-bar">
                        <div className="progress-fill" style={{ width: `${r.rate}%`, background: STATUS_COLOR[r.status] }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{r.rate}%</span>
                    </div>
                  </td>
                  <td>{r.over}</td>
                  <td><Light s={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 8. HR
// ══════════════════════════════════════════════════════════════════
function HRTab() {
  const ORG_STRUCTURE = [
    { name: 'Front Office (前台)', value: 35, color: '#3b82f6', detail: '客户经理 · RM · 销售 · 交易员' },
    { name: 'Middle Office (中台)', value: 25, color: '#22c55e', detail: '风险 · 合规 · 审批 · 中台支持' },
    { name: 'Back Office (后台)',  value: 40, color: '#f59e0b', detail: 'IT · 运营 · 财务 · HR · 行政' },
  ];
  return (
    <>
      <SectionTitle title="人员情况" icon="👥" />
      <div className="kpi-grid">
        <SignalKpi label="总人数"     value="38,142"                     status="good" />
        <SignalKpi label="新增人数(月)" value="184"        delta="↑ 22"   status="good" />
        <SignalKpi label="离职人数(月)" value="124"        delta="↓ 18"   status="good" />
        <SignalKpi label="年化离职率" value="3.9" unit="%" delta="↓ 0.4pp" status="good" target="<8%" />
        <SignalKpi label="平均司龄"   value="7.2" unit="年"               status="good" />
        <SignalKpi label="女性占比"   value="48.4" unit="%"               status="good" />
      </div>

      <SectionTitle title="组织结构 (Front / Middle / Back)" icon="🏢" />
      <div className="grid-2">
        <ChartCard title="前中后台人员分布" extra={<span className="tag">国际银行均值 30/25/45</span>} height={260}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={ORG_STRUCTURE} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {ORG_STRUCTURE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="card">
          <div className="card-title">组织结构详情</div>
          {ORG_STRUCTURE.map(o => (
            <div key={o.name} style={{ padding: '14px 0', borderBottom: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  <span style={{ width: 12, height: 12, background: o.color, borderRadius: 3 }} />
                  {o.name}
                </span>
                <span style={{ fontWeight: 700 }}>{o.value}% · {Math.round(38142 * o.value / 100).toLocaleString()} 人</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle title="招聘" icon="🎯" />
      <div className="kpi-grid">
        <SignalKpi label="月招聘人数"   value="184"        status="good" />
        <SignalKpi label="空缺岗位"     value="324"  delta="↓ 28" status="good" />
        <SignalKpi label="平均招聘周期" value="42"   unit="天"   delta="↓ 6天" status="good" target="<45天" />
        <SignalKpi label="校招在编"     value="2,820" delta="覆盖 38 高校" status="good" />
      </div>

      <SectionTitle title="绩效" icon="📊" />
      <div className="kpi-grid">
        <SignalKpi label="高绩效员工占比" value="22.4" unit="%" delta="↑ 1.2pp" status="good" target=">20%" />
        <SignalKpi label="中等绩效占比"   value="62.8" unit="%"                  status="good" />
        <SignalKpi label="低绩效占比"     value="14.8" unit="%" delta="↓ 1.2pp" status="good" target="<15%" />
        <SignalKpi label="奖金池"         value="¥84.2" unit="亿" delta="↑ 12%" status="good" />
      </div>

      <SectionTitle title="培训" icon="🎓" />
      <div className="kpi-grid">
        <SignalKpi label="人均培训小时数(年)" value="62"   unit="小时" delta="↑ 8h"    status="good" target=">40h" />
        <SignalKpi label="合规培训完成率"     value="98.4" unit="%"    delta="↑ 1.2pp" status="good" target=">95%" />
        <SignalKpi label="专业认证持证率"     value="78.2" unit="%"    delta="↑ 4pp"   status="good" />
        <SignalKpi label="新员工培训完成率"   value="100"  unit="%"                    status="good" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 9. FINANCE
// ══════════════════════════════════════════════════════════════════
function FinanceTab() {
  return (
    <>
      <SectionTitle title="收入" icon="💰" />
      <div className="kpi-grid">
        <SignalKpi label="实际收入 YTD" value="¥847" unit="亿" delta="↑ 12.4%"   status="good" />
        <SignalKpi label="预算收入 YTD" value="¥780" unit="亿"                   status="good" />
        <SignalKpi label="预算完成率"   value="108.5" unit="%" delta="↑ 8.5pp"   status="good" target=">100%" />
        <SignalKpi label="月度收入"     value="¥120" unit="亿" delta="↑ 14%"     status="good" />
      </div>

      <SectionTitle title="成本结构" icon="💸" />
      <div className="grid-2">
        <ChartCard title="成本构成 (亿/月)" extra={<span className="tag">CIR 48.2%</span>} height={260}>
          <ResponsiveContainer>
            <BarChart data={[
              { name: '人力成本', value: 32.4, color: '#3b82f6' },
              { name: 'IT 成本',  value: 12.8, color: '#22c55e' },
              { name: '运营成本', value: 8.6,  color: '#f59e0b' },
              { name: '办公成本', value: 3.2,  color: '#a855f7' },
              { name: '营销成本', value: 4.8,  color: '#ec4899' },
              { name: '其他',     value: 2.2,  color: '#64748b' },
            ]}>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#64748b'].map((c, i) => <Cell key={i} fill={c} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <div>
          <div className="kpi-grid">
            <SignalKpi label="人力成本(月)" value="¥32.4" unit="亿" delta="占比 50%"   status="good" />
            <SignalKpi label="IT 成本(月)"  value="¥12.8" unit="亿" delta="占比 19.8%" status="good" />
            <SignalKpi label="运营成本"     value="¥8.6"  unit="亿" delta="占比 13.3%" status="good" />
            <SignalKpi label="办公成本"     value="¥3.2"  unit="亿" delta="占比 4.9%"  status="good" />
            <SignalKpi label="营销成本"     value="¥4.8"  unit="亿" delta="↑ 18%"      status="good" />
            <SignalKpi label="总成本(月)"   value="¥64"   unit="亿" delta="↑ 6%"       status="good" />
          </div>
        </div>
      </div>

      <SectionTitle title="利润" icon="📈" />
      <div className="kpi-grid">
        <SignalKpi label="税前利润 YTD"   value="¥420" unit="亿" delta="↑ 18%" status="good" />
        <SignalKpi label="净利润 YTD"     value="¥314.6" unit="亿" delta="↑ 15.8%" status="good" />
        <SignalKpi label="净利润率"       value="37.1" unit="%" delta="↑ 1.2pp" status="good" />
        <SignalKpi label="有效税率"       value="25.1" unit="%"                  status="good" />
        <SignalKpi label="月度利润"       value="¥42"  unit="亿" delta="↑ 18%"  status="good" />
        <SignalKpi label="单客利润贡献"   value="¥4,840"          delta="↑ 12%"  status="good" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 10. IT & DIGITAL
// ══════════════════════════════════════════════════════════════════
function ITTab() {
  return (
    <>
      <SectionTitle title="系统可用率" icon="🖥" />
      <div className="kpi-grid">
        <SignalKpi label="核心系统可用率"   value="99.98" unit="%"  delta="SLA 99.95%" status="good" />
        <SignalKpi label="手机银行可用率"   value="99.99" unit="%"                    status="good" />
        <SignalKpi label="网银可用率"       value="99.97" unit="%"                    status="good" />
        <SignalKpi label="重大故障(P0/P1)" value="2"     unit="件/季" delta="↓ 4件"  status="good" />
        <SignalKpi label="MTTR 平均恢复"    value="18"    unit="分钟"  delta="↓ 6min" status="good" target="<30min" />
        <SignalKpi label="MTBF 平均无故障"  value="84"    unit="天"                   status="good" />
      </div>

      <SectionTitle title="DevOps" icon="⚙" />
      <div className="kpi-grid">
        <SignalKpi label="月发布次数"     value="284"            delta="↑ 18%" status="good" />
        <SignalKpi label="失败发布"       value="8"    delta="失败率 2.8%" status="good" target="<5%" />
        <SignalKpi label="变更成功率"     value="97.2" unit="%" delta="↑ 0.8pp" status="good" target=">95%" />
        <SignalKpi label="部署频率"       value="9.5"  unit="次/天"            status="good" />
        <SignalKpi label="Lead Time"      value="2.4"  unit="天" delta="↓ 0.6天" status="good" />
        <SignalKpi label="Change Failure Rate" value="2.8" unit="%" delta="↓ 0.4pp" status="good" />
      </div>

      <SectionTitle title="AI 赋能" icon="🤖" subtitle="GenAI · 机器学习 · 智能客服" />
      <div className="kpi-grid">
        <SignalKpi label="AI 使用人数"     value="29,800"   delta="覆盖 78%" status="good" />
        <SignalKpi label="AI 日处理交易"   value="2,840" unit="万"  delta="↑ 42%" status="good" />
        <SignalKpi label="AI 节省工时(月)" value="184" unit="万小时" delta="↑ 38%" status="good" />
        <SignalKpi label="AI 节省成本(月)" value="¥3.6" unit="亿"   delta="↑ 42%" status="good" />
        <SignalKpi label="AI 准确率"       value="96.2" unit="%"   delta="↑ 1.4pp" status="good" />
        <SignalKpi label="智能客服解决率"  value="84.2" unit="%"   delta="↑ 6pp" status="good" />
      </div>

      <SectionTitle title="云化与新基建" icon="☁" />
      <div className="kpi-grid">
        <SignalKpi label="应用上云比例"    value="68"   unit="%" delta="↑ 18pp" status="good" target=">80%(2027)" />
        <SignalKpi label="容器化比例"      value="78"   unit="%" delta="↑ 12pp" status="good" />
        <SignalKpi label="微服务数量"      value="2,840"         delta="↑ 280" status="good" />
        <SignalKpi label="API 月调用量"    value="48.6" unit="亿" delta="↑ 86%" status="good" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 11. COMPLIANCE
// ══════════════════════════════════════════════════════════════════
function ComplianceTab() {
  return (
    <>
      <SectionTitle title="AML · 反洗钱" icon="⚖" />
      <div className="kpi-grid">
        <SignalKpi label="月告警数"        value="2,080"  delta="↑ 6%"  status="watch" />
        <SignalKpi label="高风险客户"      value="1,840"  delta="↑ 124" status="watch" />
        <SignalKpi label="SAR/STR 提交"   value="52"  delta="↑ 4件" status="good" />
        <SignalKpi label="未结案件"        value="94"     delta="↓ 12件" status="good" target="<100" />
        <SignalKpi label="平均处理时长"    value="3.2" unit="天" delta="↓ 0.4天" status="good" target="<5天" />
        <SignalKpi label="误报率 (False+)" value="62" unit="%" delta="↓ 8pp" status="good" />
      </div>

      <SectionTitle title="制裁筛查" icon="🚫" />
      <div className="kpi-grid">
        <SignalKpi label="月命中数量"      value="18"   delta="均阻断" status="good" />
        <SignalKpi label="高风险国家交易"  value="1,240" delta="已 EDD 100%" status="good" />
        <SignalKpi label="制裁名单更新"    value="实时" delta="OFAC/UN/EU/HMT" status="good" />
        <SignalKpi label="筛查覆盖率"      value="100" unit="%"     status="good" />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="section-header"><span className="section-title">高风险国家交易分布</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>国家/地区</th><th>月笔数</th><th>月金额</th><th>EDD 完成</th></tr></thead>
            <tbody>
              {[
                { c: '伊朗',     n: 0,    a: '¥0',     edd: '禁止' },
                { c: '朝鲜',     n: 0,    a: '¥0',     edd: '禁止' },
                { c: '俄罗斯',   n: 184,  a: '¥48M',   edd: '100%' },
                { c: '叙利亚',   n: 0,    a: '¥0',     edd: '禁止' },
                { c: '委内瑞拉', n: 12,   a: '¥2.8M',  edd: '100%' },
                { c: '苏丹',     n: 0,    a: '¥0',     edd: '禁止' },
                { c: '缅甸',     n: 28,   a: '¥4.2M',  edd: '100%' },
                { c: '阿富汗',   n: 4,    a: '¥1.2M',  edd: '100%' },
              ].map(r => (
                <tr key={r.c}>
                  <td style={{ fontWeight: 600 }}>{r.c}</td>
                  <td>{r.n}</td>
                  <td>{r.a}</td>
                  <td>{r.edd === '禁止' ? <span className="badge badge-red">禁止</span> : <span className="badge badge-green">{r.edd}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SectionTitle title="KYC" icon="📑" />
      <div className="kpi-grid">
        <SignalKpi label="待更新客户"      value="42,800" delta="自动提醒中" status="watch" />
        <SignalKpi label="已完成 KYC"     value="6.18" unit="百万" delta="覆盖率 99.2%" status="good" />
        <SignalKpi label="逾期未更新"      value="284"   delta="↓ 84"   status="good" target="<500" />
        <SignalKpi label="高风险 KYC 比例" value="2.4"   unit="%" delta="月度复审" status="good" />
      </div>

      <SectionTitle title="法务与监管报送" icon="📋" />
      <div className="kpi-grid">
        <SignalKpi label="未决诉讼"        value="14"  delta="敞口 ¥18亿" status="watch" />
        <SignalKpi label="监管处罚(YTD)"   value="2"   delta="累计 ¥240万" status="watch" />
        <SignalKpi label="监管检查"        value="8"  delta="本年" status="good" />
        <SignalKpi label="报送及时率"      value="100" unit="%" delta="COREP/FINREP" status="good" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 12. WEALTH MANAGEMENT
// ══════════════════════════════════════════════════════════════════
function WealthTab() {
  return (
    <>
      <SectionTitle title="财富客户分层" icon="💎" />
      <div className="kpi-grid">
        <SignalKpi label="Premier 客户"   value="184,000" delta="↑ 4.2%" status="good" />
        <SignalKpi label="Jade 客户"      value="32,400"  delta="↑ 6.8%" status="good" />
        <SignalKpi label="Private 客户"   value="8,420"   delta="↑ 8.2%" status="good" />
        <SignalKpi label="家族办公室"     value="184"     delta="↑ 18"   status="good" />
        <SignalKpi label="人均 AUM"       value="¥248"  unit="万"        status="good" />
        <SignalKpi label="客户 NPS"       value="68"    delta="↑ 4分"   status="good" />
      </div>

      <SectionTitle title="AUM 资产管理规模" icon="💰" />
      <div className="kpi-grid">
        <SignalKpi label="总 AUM"         value="¥1.68"  unit="万亿" delta="↑ 18%" status="good" />
        <SignalKpi label="Premier AUM"    value="¥620"   unit="亿"   delta="↑ 12%" status="good" />
        <SignalKpi label="Jade AUM"       value="¥420"   unit="亿"   delta="↑ 18%" status="good" />
        <SignalKpi label="Private AUM"    value="¥640"   unit="亿"   delta="↑ 22%" status="good" />
      </div>

      <SectionTitle title="产品销售" icon="📊" />
      <div className="kpi-grid">
        <SignalKpi label="基金销售(月)"   value="¥240"  unit="亿"  delta="↑ 32%" status="good" />
        <SignalKpi label="保险销售(月)"   value="¥84"   unit="亿"  delta="↑ 24%" status="good" />
        <SignalKpi label="理财销售(月)"   value="¥620"  unit="亿"  delta="↑ 12%" status="good" />
        <SignalKpi label="信托销售(月)"   value="¥48"   unit="亿"  delta="↑ 18%" status="good" />
        <SignalKpi label="结构化产品(月)" value="¥38"   unit="亿"  delta="↑ 28%" status="good" />
        <SignalKpi label="海外配置(月)"   value="¥124"  unit="亿"  delta="↑ 42%" status="good" />
      </div>

      <SectionTitle title="财富收入" icon="💵" />
      <div className="kpi-grid">
        <SignalKpi label="财富月收入"     value="¥18.4" unit="亿"  delta="↑ 28%" status="good" />
        <SignalKpi label="管理费收入"     value="¥6.8"  unit="亿/月" delta="↑ 22%" status="good" />
        <SignalKpi label="申购费收入"     value="¥5.2"  unit="亿/月" delta="↑ 32%" status="good" />
        <SignalKpi label="业绩报酬"       value="¥3.4"  unit="亿/月" delta="↑ 38%" status="good" />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function ManagementDashboard() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get('line') as TabKey) || 'corporate';
  const valid = TABS.some(t => t.key === initial) ? initial : 'corporate';
  const [tab, setTab] = useState<TabKey>(valid);

  // 同步 URL → 内部 state（用户从 Sidebar 切换条线时触发）
  useEffect(() => {
    const q = params.get('line') as TabKey | null;
    if (q && TABS.some(t => t.key === q) && q !== tab) setTab(q);
  }, [params]);

  // 同步 内部 state → URL（用户点 Tab 时把状态写回 URL，便于分享/刷新）
  const switchTab = (k: TabKey) => {
    setTab(k);
    setParams({ line: k }, { replace: true });
  };

  const current = TABS.find(t => t.key === tab)!;

  const renderTab = () => {
    switch (tab) {
      case 'corporate':   return <CorporateTab />;
      case 'transaction': return <TransactionTab />;
      case 'retail':      return <RetailTab />;
      case 'wealth':      return <WealthTab />;
      case 'fi':          return <FITab />;
      case 'treasury':    return <TreasuryTab />;
      case 'risk':        return <RiskTab />;
      case 'operations':  return <OperationsTab />;
      case 'hr':          return <HRTab />;
      case 'finance':     return <FinanceTab />;
      case 'it':          return <ITTab />;
      case 'compliance':  return <ComplianceTab />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${current.color}18, ${current.color}08)`,
        border: '1px solid var(--border)', borderRadius: 12,
        padding: '20px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: current.color, letterSpacing: '0.12em', marginBottom: 6 }}>
            MANAGEMENT DASHBOARD · 12 BUSINESS LINES
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            {current.icon} {current.label} · 管理驾驶舱
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{current.desc} · 支持按国家/客户/产品/分行下钻</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12 }}>⬇ 导出报表</button>
      </div>

      {/* Tab Strip */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 24, padding: 6,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, overflowX: 'auto',
      }}>
        {TABS.map(t => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '8px 14px', minWidth: 90,
                background: active ? `${t.color}20` : 'transparent',
                border: active ? `1px solid ${t.color}60` : '1px solid transparent',
                borderRadius: 8, cursor: 'pointer',
                color: active ? t.color : 'var(--text-secondary)',
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {renderTab()}

      {/* Footer */}
      <div style={{
        marginTop: 32, padding: 14, borderRadius: 12,
        background: 'var(--bg-hover)', textAlign: 'center',
        fontSize: 11, color: 'var(--text-muted)',
      }}>
        BankerOS Management Dashboard · 12 业务条线 · 200+ KPI · 对标 HSBC / Citi / Standard Chartered
      </div>
    </div>
  );
}
