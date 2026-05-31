/**
 * BankerOS CEO Dashboard (行长驾驶舱)
 * ─────────────────────────────────────────────────────────────
 * 对标 HSBC / Standard Chartered / Citi 国际银行高管驾驶舱。
 * 30~50 个核心 KPI · 10 个钻取板块 · 红绿灯阈值预警。
 *
 * 设计原则：
 *   "用 20 个左右指标快速判断银行是否安全、赚钱、增长、合规。"
 *
 * 板块：
 *   L1  CEO Snapshot (12 灯柱)
 *   L2  盈利能力 (Profitability)
 *   L3  资产负债表 (B/S)
 *   L4  风险驾驶舱 (Risk)
 *   L5  资本管理 (Capital)
 *   L6  流动性 (Liquidity)
 *   L7  客户经营 (Customer)
 *   L8  运营效率 (Operations)
 *   L9  合规与安全 (Compliance & Fraud)
 *   L10 战略与数字化 (Strategy)
 */

import { useMemo, useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend,
} from 'recharts';

// ──────────────────────────────────────────────────────────────────
// 通用工具
// ──────────────────────────────────────────────────────────────────
type Status = 'good' | 'watch' | 'alert';
const STATUS_COLOR: Record<Status, string> = {
  good: '#22c55e',
  watch: '#f59e0b',
  alert: '#ef4444',
};
const STATUS_LABEL: Record<Status, string> = { good: '✓ 健康', watch: '! 关注', alert: '⚠ 告警' };

function statusOf(value: number, opts: { goodAbove?: number; goodBelow?: number; watchBelow?: number; watchAbove?: number }): Status {
  if (opts.goodAbove !== undefined) {
    if (value >= opts.goodAbove) return 'good';
    if (opts.watchBelow !== undefined && value >= opts.watchBelow) return 'watch';
    return 'alert';
  }
  if (opts.goodBelow !== undefined) {
    if (value <= opts.goodBelow) return 'good';
    if (opts.watchAbove !== undefined && value <= opts.watchAbove) return 'watch';
    return 'alert';
  }
  return 'good';
}

const Light = ({ s }: { s: Status }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 600, color: STATUS_COLOR[s],
  }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[s], boxShadow: `0 0 8px ${STATUS_COLOR[s]}` }} />
    {STATUS_LABEL[s]}
  </span>
);

const SectionTitle = ({ idx, title, subtitle, icon }: { idx: string; title: string; subtitle: string; icon: string }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '32px 0 14px', borderLeft: '3px solid var(--accent-blue)', paddingLeft: 12 }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.08em' }}>{idx}</span>
    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{icon} {title}</span>
    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</span>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// 模拟数据（基于 1,200 亿美金资产中型国际银行假设）
// ──────────────────────────────────────────────────────────────────
const TREND_REVENUE = [
  { m: '1月', rev: 8.2, prof: 2.8, budget: 8.0 },
  { m: '2月', rev: 7.9, prof: 2.6, budget: 8.1 },
  { m: '3月', rev: 9.4, prof: 3.4, budget: 8.4 },
  { m: '4月', rev: 9.8, prof: 3.6, budget: 8.6 },
  { m: '5月', rev: 10.2, prof: 3.8, budget: 8.8 },
  { m: '6月', rev: 10.8, prof: 4.1, budget: 9.0 },
  { m: '7月', rev: 11.2, prof: 4.4, budget: 9.2 },
  { m: '8月', rev: 11.5, prof: 4.6, budget: 9.4 },
];

const REVENUE_MIX = [
  { name: '利息收入', value: 58, color: '#3b82f6' },
  { name: '手续费', value: 18, color: '#22c55e' },
  { name: '贸易融资', value: 9, color: '#f59e0b' },
  { name: '外汇/资金', value: 8, color: '#a855f7' },
  { name: '财富管理', value: 7, color: '#06b6d4' },
];

const NPL_TREND = [
  { m: '1月', npl: 1.45, p30: 2.1, p60: 1.7, p90: 1.45 },
  { m: '2月', npl: 1.48, p30: 2.2, p60: 1.8, p90: 1.48 },
  { m: '3月', npl: 1.52, p30: 2.4, p60: 1.9, p90: 1.52 },
  { m: '4月', npl: 1.55, p30: 2.5, p60: 2.0, p90: 1.55 },
  { m: '5月', npl: 1.58, p30: 2.6, p60: 2.0, p90: 1.58 },
  { m: '6月', npl: 1.62, p30: 2.7, p60: 2.1, p90: 1.62 },
  { m: '7月', npl: 1.65, p30: 2.8, p60: 2.2, p90: 1.65 },
  { m: '8月', npl: 1.61, p30: 2.7, p60: 2.1, p90: 1.61 },
];

const INDUSTRY_RISK = [
  { name: '房地产', loan: 580, npl: 3.8, color: '#ef4444' },
  { name: '建筑', loan: 320, npl: 2.4, color: '#f59e0b' },
  { name: '制造业', loan: 720, npl: 1.5, color: '#22c55e' },
  { name: '贸易', loan: 480, npl: 1.8, color: '#3b82f6' },
  { name: '能源', loan: 280, npl: 1.2, color: '#a855f7' },
  { name: 'TMT', loan: 420, npl: 0.9, color: '#06b6d4' },
  { name: '金融', loan: 380, npl: 0.6, color: '#14b8a6' },
  { name: '其他', loan: 620, npl: 1.4, color: '#94a3b8' },
];

const TOP_EXPOSURE = [
  { name: '招商局集团', industry: '综合', limit: 8500, used: 6200, rating: 'AAA', risk: 'good' as Status },
  { name: '中远海运', industry: '航运', limit: 7200, used: 5800, rating: 'AA+', risk: 'good' as Status },
  { name: '万科地产', industry: '房地产', limit: 6800, used: 6100, rating: 'A+', risk: 'watch' as Status },
  { name: '华为技术', industry: 'TMT', limit: 6500, used: 4200, rating: 'AA', risk: 'good' as Status },
  { name: '中海油', industry: '能源', limit: 6200, used: 4800, rating: 'AAA', risk: 'good' as Status },
  { name: '碧桂园控股', industry: '房地产', limit: 5800, used: 5800, rating: 'BBB', risk: 'alert' as Status },
  { name: '比亚迪', industry: '汽车', limit: 5500, used: 3900, rating: 'AA', risk: 'good' as Status },
  { name: '宁德时代', industry: '新能源', limit: 5200, used: 4100, rating: 'AA', risk: 'good' as Status },
  { name: '京东物流', industry: '物流', limit: 4800, used: 3600, rating: 'A+', risk: 'good' as Status },
  { name: '远洋集团', industry: '房地产', limit: 4500, used: 4400, rating: 'BB+', risk: 'alert' as Status },
];

const CAPITAL_TREND = [
  { m: '1月', cet1: 13.8, t1: 15.2, car: 17.5 },
  { m: '2月', cet1: 13.9, t1: 15.3, car: 17.6 },
  { m: '3月', cet1: 14.1, t1: 15.5, car: 17.8 },
  { m: '4月', cet1: 14.2, t1: 15.6, car: 17.9 },
  { m: '5月', cet1: 14.3, t1: 15.7, car: 18.0 },
  { m: '6月', cet1: 14.4, t1: 15.8, car: 18.1 },
  { m: '7月', cet1: 14.5, t1: 15.9, car: 18.2 },
  { m: '8月', cet1: 14.6, t1: 16.0, car: 18.3 },
];

const LIQUIDITY_TREND = [
  { m: '1月', lcr: 142, nsfr: 118 },
  { m: '2月', lcr: 145, nsfr: 119 },
  { m: '3月', lcr: 148, nsfr: 120 },
  { m: '4月', lcr: 152, nsfr: 121 },
  { m: '5月', lcr: 155, nsfr: 122 },
  { m: '6月', lcr: 158, nsfr: 123 },
  { m: '7月', lcr: 156, nsfr: 124 },
  { m: '8月', lcr: 161, nsfr: 125 },
];

const CUSTOMER_GROWTH = [
  { m: '1月', new: 18420, churn: 4200, net: 14220 },
  { m: '2月', new: 19800, churn: 4600, net: 15200 },
  { m: '3月', new: 22400, churn: 5100, net: 17300 },
  { m: '4月', new: 24600, churn: 5400, net: 19200 },
  { m: '5月', new: 26800, churn: 5800, net: 21000 },
  { m: '6月', new: 28200, churn: 6100, net: 22100 },
  { m: '7月', new: 31400, churn: 6800, net: 24600 },
  { m: '8月', new: 34200, churn: 7200, net: 27000 },
];

const SEGMENT_AUM = [
  { name: '大型企业', count: 2840, aum: 4200, color: '#3b82f6' },
  { name: '中小企业', count: 48600, aum: 1850, color: '#22c55e' },
  { name: '私人银行', count: 8420, aum: 1680, color: '#a855f7' },
  { name: '财富 Premier', count: 184000, aum: 620, color: '#06b6d4' },
  { name: '零售', count: 6240000, aum: 480, color: '#f59e0b' },
];

const STP_DATA = [
  { name: '汇款', stp: 94.2 },
  { name: '开户', stp: 78.4 },
  { name: '信用卡审批', stp: 86.5 },
  { name: '消费贷', stp: 72.8 },
  { name: '贸易融资', stp: 42.6 },
  { name: '企业贷款', stp: 28.4 },
];

const AML_CASES = [
  { m: '1月', alerts: 1240, str: 24 },
  { m: '2月', alerts: 1380, str: 28 },
  { m: '3月', alerts: 1520, str: 32 },
  { m: '4月', alerts: 1680, str: 38 },
  { m: '5月', alerts: 1740, str: 42 },
  { m: '6月', alerts: 1820, str: 45 },
  { m: '7月', alerts: 1960, str: 48 },
  { m: '8月', alerts: 2080, str: 52 },
];

// ──────────────────────────────────────────────────────────────────
// KPI 红绿灯卡片
// ──────────────────────────────────────────────────────────────────
const SignalKpi = ({
  label, value, unit, delta, status, target,
}: { label: string; value: string; unit?: string; delta?: string; status: Status; target?: string }) => (
  <div className="card" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: STATUS_COLOR[status] }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <Light s={status} />
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
      {unit && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span>}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
      {delta && <span style={{ color: delta.startsWith('↑') ? STATUS_COLOR.good : delta.startsWith('↓') ? STATUS_COLOR.alert : 'var(--text-muted)' }}>{delta}</span>}
      {target && <span style={{ color: 'var(--text-muted)' }}>目标 {target}</span>}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────
// 主组件
// ──────────────────────────────────────────────────────────────────
export default function CeoDashboard() {
  const [period, setPeriod] = useState<'mtd' | 'qtd' | 'ytd'>('ytd');
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  // ── 计算红绿灯状态 ───────────────────────────────
  const signals = useMemo(() => ({
    revenue: statusOf(108, { goodAbove: 100, watchBelow: 90 }),       // 预算达成率
    profit: statusOf(112, { goodAbove: 100, watchBelow: 90 }),
    roe: statusOf(14.8, { goodAbove: 12, watchBelow: 8 }),
    cir: statusOf(48.2, { goodBelow: 50, watchAbove: 60 }),
    assets: statusOf(8.4, { goodAbove: 5, watchBelow: 2 }),
    deposits: statusOf(6.8, { goodAbove: 5, watchBelow: 2 }),
    loans: statusOf(7.2, { goodAbove: 5, watchBelow: 2 }),
    npl: statusOf(1.61, { goodBelow: 2, watchAbove: 3 }),
    cet1: statusOf(14.6, { goodAbove: 12, watchBelow: 10.5 }),
    lcr: statusOf(161, { goodAbove: 120, watchBelow: 100 }),
    customers: statusOf(8.2, { goodAbove: 5, watchBelow: 2 }),
    aml: statusOf(94, { goodBelow: 100, watchAbove: 200 }),           // 未结案
  }), []);

  return (
    <div>
      {/* ═══════════ Page Header ═══════════ */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.05))',
        border: '1px solid var(--border)', borderRadius: 12,
        padding: '22px 24px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.12em', marginBottom: 6 }}>
            CEO DASHBOARD · 行长驾驶舱
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            BankerOS 全行经营驾驶舱
          </h1>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            董事长 · 行长 · 总裁视图 · 数据截至 <strong>{today} 09:00 (UTC+8)</strong> · 涵盖全球 38 个国家与地区
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['mtd', 'qtd', 'ytd'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={period === p ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ fontSize: 12 }}
            >
              {p === 'mtd' ? '本月' : p === 'qtd' ? '本季' : '年度'}
            </button>
          ))}
          <button className="btn btn-ghost" style={{ fontSize: 12 }}>⬇ 导出 PDF</button>
        </div>
      </div>

      {/* ═══════════ L1 · CEO Snapshot (12 红绿灯) ═══════════ */}
      <SectionTitle idx="L1" icon="◈" title="CEO Snapshot · 12 项核心指标"
        subtitle="董事会一眼看清：是否安全 · 是否赚钱 · 是否增长 · 是否合规" />

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <SignalKpi label="营业收入 YTD" value="¥847.2" unit="亿" delta="↑ 12.4% YoY" status={signals.revenue} target="¥780亿" />
        <SignalKpi label="净利润 YTD"   value="¥314.6" unit="亿" delta="↑ 15.8% YoY" status={signals.profit}  target="¥280亿" />
        <SignalKpi label="ROE"          value="14.8"   unit="%"  delta="↑ 0.6pp"     status={signals.roe}     target=">12%" />
        <SignalKpi label="成本收入比"   value="48.2"   unit="%"  delta="↓ 1.4pp"     status={signals.cir}     target="<50%" />
        <SignalKpi label="总资产"       value="¥8.40"  unit="万亿" delta="↑ 8.4% YoY" status={signals.assets}  target=">¥8万亿" />
        <SignalKpi label="存款总额"     value="¥5.82"  unit="万亿" delta="↑ 6.8% YoY" status={signals.deposits} target=">5%" />
        <SignalKpi label="贷款总额"     value="¥4.68"  unit="万亿" delta="↑ 7.2% YoY" status={signals.loans}   target=">5%" />
        <SignalKpi label="不良贷款率"   value="1.61"   unit="%"  delta="↓ 0.04pp"    status={signals.npl}     target="<2%" />
        <SignalKpi label="CET1 核心资本" value="14.6"  unit="%"  delta="↑ 0.2pp"     status={signals.cet1}    target=">12%" />
        <SignalKpi label="LCR 流动性"   value="161"    unit="%"  delta="↑ 5pp"       status={signals.lcr}     target=">120%" />
        <SignalKpi label="客户净增长"   value="+27.0"  unit="万"  delta="↑ 22% YoY"   status={signals.customers} target=">20万" />
        <SignalKpi label="AML 未结告警" value="94"     unit="件"  delta="↓ 12件"      status={signals.aml}     target="<100" />
      </div>

      {/* ═══════════ L2 · 盈利能力 ═══════════ */}
      <SectionTitle idx="L2" icon="💰" title="盈利能力 · Profitability"
        subtitle="收入 · 利润 · ROE · 成本收入比 · 收入结构" />

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">收入与利润趋势（亿元）</span>
            <span className="tag">预算完成率 108.5%</span>
          </div>
          <div className="chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={TREND_REVENUE}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="rev" name="营业收入" stroke="#3b82f6" fill="url(#gradRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="prof" name="净利润" stroke="#22c55e" fill="url(#gradProf)" strokeWidth={2} />
                <Line type="monotone" dataKey="budget" name="预算" stroke="#f59e0b" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">收入结构</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>YTD ¥847亿</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 180, height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={REVENUE_MIX} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {REVENUE_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              {REVENUE_MIX.map(m => (
                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-soft)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, background: m.color, borderRadius: 2 }} />{m.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginTop: 16 }}>
        <SignalKpi label="ROA"           value="1.18"  unit="%"  delta="↑ 0.05pp"   status="good" />
        <SignalKpi label="ROTE"          value="16.4"  unit="%"  delta="↑ 0.8pp"    status="good" />
        <SignalKpi label="NIM 净息差"    value="2.18"  unit="%"  delta="↓ 0.04pp"   status="watch" />
        <SignalKpi label="EPS"           value="¥4.82" delta="↑ 14.2%"             status="good" />
        <SignalKpi label="股息支付率"    value="32"    unit="%"                    status="good" />
        <SignalKpi label="P/B"           value="0.85"  delta="↑ 0.06"              status="watch" />
      </div>

      {/* ═══════════ L3 · 资产负债表 ═══════════ */}
      <SectionTitle idx="L3" icon="⊞" title="资产负债表 · Balance Sheet"
        subtitle="银行本质上经营资产负债表：存款 · 贷款 · 贷存比" />

      <div className="grid-3">
        <div className="card">
          <div className="card-title">存款结构</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>¥5.82 <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>万亿</span></div>
          <div style={{ fontSize: 11, color: STATUS_COLOR.good, marginBottom: 14 }}>↑ 6.8% YoY · CASA 比例 42.4%</div>
          {[
            { label: '企业存款', v: 3.18, pct: 54.6, color: '#3b82f6' },
            { label: '零售存款', v: 1.84, pct: 31.6, color: '#22c55e' },
            { label: '私行存款', v: 0.52, pct: 8.9, color: '#a855f7' },
            { label: '同业存款', v: 0.28, pct: 4.9, color: '#f59e0b' },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{row.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>¥{row.v}万亿 · {row.pct}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${row.pct}%`, background: row.color }} /></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">贷款结构</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>¥4.68 <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>万亿</span></div>
          <div style={{ fontSize: 11, color: STATUS_COLOR.good, marginBottom: 14 }}>↑ 7.2% YoY · 月新增 ¥420亿</div>
          {[
            { label: '企业贷款', v: 2.28, pct: 48.7, color: '#3b82f6' },
            { label: '按揭贷款', v: 1.18, pct: 25.2, color: '#22c55e' },
            { label: '消费贷款', v: 0.62, pct: 13.2, color: '#a855f7' },
            { label: '贸易融资', v: 0.38, pct: 8.1, color: '#f59e0b' },
            { label: '信用卡', v: 0.22, pct: 4.7, color: '#06b6d4' },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span>{row.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>¥{row.v}万亿 · {row.pct}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${row.pct}%`, background: row.color }} /></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">关键比率</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
            {[
              { label: '贷存比 LDR', v: '80.4%', range: '最佳 70%-90%', status: 'good' as Status, pct: 80.4 },
              { label: '贷款收益率', v: '4.62%', range: '行业平均 4.3%', status: 'good' as Status, pct: 92 },
              { label: '存款成本率', v: '2.44%', range: '同业 2.6%', status: 'good' as Status, pct: 81 },
              { label: '杠杆率',     v: '7.2%',  range: '监管 ≥4%', status: 'good' as Status, pct: 72 },
              { label: '生息资产占比', v: '88.4%', range: '目标 >85%', status: 'good' as Status, pct: 88.4 },
            ].map(r => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: STATUS_COLOR[r.status] }}>{r.v}</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{r.range}</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.pct}%`, background: STATUS_COLOR[r.status] }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ L4 · 风险驾驶舱 ═══════════ */}
      <SectionTitle idx="L4" icon="🛡" title="风险驾驶舱 · Risk Dashboard"
        subtitle="NPL · 逾期分布 · 行业集中度 · 前 20 大风险敞口" />

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">逾期与不良趋势</span>
            <span className="badge badge-green">NPL 1.61% ↓</span>
          </div>
          <div className="chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={NPL_TREND}>
                <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="p30" name="30天逾期%" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="p60" name="60天逾期%" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="p90" name="90天+ (NPL)%" stroke="#ef4444" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">行业贷款 & 不良集中度</span>
            <span className="tag">8 大行业</span>
          </div>
          <div className="chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={INDUSTRY_RISK}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                <YAxis yAxisId="L" stroke="var(--text-muted)" fontSize={11} />
                <YAxis yAxisId="R" orientation="right" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="L" dataKey="loan" name="贷款(亿)" fill="#3b82f6" radius={[4,4,0,0]} />
                <Line yAxisId="R" dataKey="npl" name="NPL%" stroke="#ef4444" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-header">
          <span className="section-title">前 10 大风险敞口客户</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>合计 ¥510亿 · 占总贷款 10.9%</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>客户名称</th><th>行业</th><th>授信额度(亿)</th><th>用信余额(亿)</th><th>使用率</th><th>内部评级</th><th>风险状态</th>
              </tr>
            </thead>
            <tbody>
              {TOP_EXPOSURE.map((c, i) => {
                const usage = (c.used / c.limit * 100).toFixed(1);
                return (
                  <tr key={c.name}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td><span className="tag">{c.industry}</span></td>
                    <td>¥{(c.limit / 100).toFixed(1)}</td>
                    <td>¥{(c.used / 100).toFixed(1)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60 }} className="progress-bar">
                          <div className="progress-fill" style={{ width: `${usage}%`, background: +usage > 90 ? STATUS_COLOR.alert : +usage > 75 ? STATUS_COLOR.watch : STATUS_COLOR.good }} />
                        </div>
                        <span style={{ fontSize: 12 }}>{usage}%</span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${c.rating.startsWith('AAA') ? 'green' : c.rating.startsWith('AA') ? 'blue' : c.rating.startsWith('A') ? 'purple' : c.rating.startsWith('BBB') ? 'amber' : 'red'}`}>{c.rating}</span></td>
                    <td><Light s={c.risk} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════ L5 · 资本管理 ═══════════ */}
      <SectionTitle idx="L5" icon="🏛" title="资本管理 · Capital Adequacy (Basel III/IV)"
        subtitle="CET1 · Tier 1 · CAR · 风险加权资产 (RWA)" />

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">资本充足率走势</span>
            <span className="tag">监管：CET1 ≥8.5% · CAR ≥10.5%</span>
          </div>
          <div className="chart-wrap" style={{ height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={CAPITAL_TREND}>
                <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
                <YAxis domain={[10, 20]} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="cet1" name="CET1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="t1"   name="Tier 1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.10} strokeWidth={2} />
                <Area type="monotone" dataKey="car"  name="总资本" stroke="#a855f7" fill="#a855f7" fillOpacity={0.08} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">RWA 风险加权资产分布</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>合计 ¥4.82 万亿</span>
          </div>
          <div style={{ marginTop: 12 }}>
            {[
              { label: '信用风险 RWA', v: 4080, pct: 84.6, color: '#3b82f6' },
              { label: '市场风险 RWA',  v: 280, pct: 5.8, color: '#f59e0b' },
              { label: '操作风险 RWA',  v: 360, pct: 7.5, color: '#a855f7' },
              { label: 'CVA 调整',     v: 100, pct: 2.1, color: '#06b6d4' },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{r.label}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>¥{r.v}亿 · {r.pct}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} /></div>
              </div>
            ))}
            <div style={{ marginTop: 18, padding: 12, background: 'var(--bg-hover)', borderRadius: 8, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>资本缓冲区</span>
                <span style={{ color: STATUS_COLOR.good, fontWeight: 600 }}>¥186亿 可用</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>预计可支持新增贷款</span>
                <span style={{ fontWeight: 600 }}>¥1,240亿</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ L6 · 流动性 ═══════════ */}
      <SectionTitle idx="L6" icon="💧" title="流动性管理 · Liquidity"
        subtitle="LCR · NSFR · 现金头寸预测 · 银行最怕流动性危机" />

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">LCR / NSFR 走势</span>
            <span className="badge badge-green">双指标均显著高于监管线</span>
          </div>
          <div className="chart-wrap" style={{ height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={LIQUIDITY_TREND}>
                <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="lcr" name="LCR (监管 ≥100%)" stroke="#3b82f6" strokeWidth={2.5} />
                <Line type="monotone" dataKey="nsfr" name="NSFR (监管 ≥100%)" stroke="#22c55e" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">现金头寸预测</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>今日实时现金</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>¥1,842 亿</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <div>
              <div>7 日预测</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>含到期回笼 · 大额支付</div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: STATUS_COLOR.good }}>¥1,968 亿</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <div>
              <div>30 日预测</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>压力情景下</div>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: STATUS_COLOR.good }}>¥1,520 亿</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div>
              <div>压力测试 (银行挤兑)</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>30 日流出 25%</div>
            </div>
            <span className="badge badge-green">通过 ✓</span>
          </div>
        </div>
      </div>

      {/* ═══════════ L7 · 客户经营 ═══════════ */}
      <SectionTitle idx="L7" icon="👥" title="客户经营 · Customer Insights"
        subtitle="客户增长 · 分层 AUM · Top 100 客户贡献度" />

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">客户增长（月）</span>
            <span className="tag">YTD 净增 +193 万</span>
          </div>
          <div className="chart-wrap" style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={CUSTOMER_GROWTH}>
                <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="new" name="新增" fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="churn" name="流失" fill="#ef4444" radius={[4,4,0,0]} />
                <Line type="monotone" dataKey="net" name="净增长" stroke="#3b82f6" strokeWidth={2.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">客户分层 AUM</div>
          <div className="table-wrap" style={{ marginTop: 8 }}>
            <table>
              <thead>
                <tr><th>分层</th><th style={{ textAlign: 'right' }}>客户数</th><th style={{ textAlign: 'right' }}>AUM (亿)</th><th style={{ textAlign: 'right' }}>占比</th></tr>
              </thead>
              <tbody>
                {SEGMENT_AUM.map(s => {
                  const total = SEGMENT_AUM.reduce((a, b) => a + b.aum, 0);
                  const pct = (s.aum / total * 100).toFixed(1);
                  return (
                    <tr key={s.name}>
                      <td><span style={{ display: 'inline-block', width: 8, height: 8, background: s.color, borderRadius: 2, marginRight: 8 }} />{s.name}</td>
                      <td style={{ textAlign: 'right' }}>{s.count.toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>¥{s.aum.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pct}%</span>
                          <span style={{ width: 50, display: 'inline-block' }} className="progress-bar">
                            <span className="progress-fill" style={{ display: 'block', width: `${pct}%`, background: s.color, height: '100%' }} />
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-hover)', borderRadius: 8, fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Top 100 客户贡献</span>
            <span><strong>收入 32.4%</strong> · 存款 28.6% · 贷款 41.2%</span>
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginTop: 16 }}>
        <SignalKpi label="总客户数"        value="648"    unit="万"   delta="↑ 3.1%"  status="good" />
        <SignalKpi label="月活客户 MAU"    value="412"    unit="万"   delta="↑ 4.8%"  status="good" />
        <SignalKpi label="人均 AUM"        value="¥13.0"  unit="万"   delta="↑ 6.2%"  status="good" />
        <SignalKpi label="客户 NPS"         value="62"                 delta="↑ 4分"   status="good" target=">50" />
        <SignalKpi label="月度流失率"      value="0.18"   unit="%"   delta="↓ 0.02pp" status="good" target="<0.3%" />
        <SignalKpi label="客户终身价值 LTV" value="¥18.6" unit="万"   delta="↑ 12%"   status="good" />
      </div>

      {/* ═══════════ L8 · 运营效率 ═══════════ */}
      <SectionTitle idx="L8" icon="⚡" title="运营效率 · Operational Efficiency"
        subtitle="审批时长 · STP 直通率 · 系统可用率" />

      <div className="grid-2">
        <div className="card">
          <div className="card-title">STP 直通率（按业务）</div>
          <div className="chart-wrap" style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={STP_DATA} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} width={88} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="stp" radius={[0,4,4,0]}>
                  {STP_DATA.map((e, i) => <Cell key={i} fill={e.stp >= 80 ? '#22c55e' : e.stp >= 50 ? '#f59e0b' : '#ef4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">审批与系统 SLA</div>
          {[
            { label: '开户平均时长', v: '8.4 分钟', target: '<15分钟', status: 'good' as Status, pct: 56 },
            { label: '消费贷审批', v: '2.4 分钟', target: '<5分钟', status: 'good' as Status, pct: 48 },
            { label: '小微贷审批', v: '1.8 小时', target: '<4小时', status: 'good' as Status, pct: 45 },
            { label: '企业贷审批', v: '6.2 天', target: '<10天', status: 'good' as Status, pct: 62 },
            { label: '贸易融资审批', v: '4.8 小时', target: '<8小时', status: 'good' as Status, pct: 60 },
            { label: '核心系统可用率', v: '99.98%', target: '≥99.95%', status: 'good' as Status, pct: 99.98 },
            { label: '手机银行可用率', v: '99.99%', target: '≥99.9%', status: 'good' as Status, pct: 99.99 },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                <span><span style={{ fontWeight: 700, color: STATUS_COLOR[r.status] }}>{r.v}</span> <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>({r.target})</span></span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.pct}%`, background: STATUS_COLOR[r.status] }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ L9 · 合规与安全 ═══════════ */}
      <SectionTitle idx="L9" icon="🔒" title="合规与安全 · Compliance & Fraud"
        subtitle="AML 反洗钱 · 欺诈监控 · 制裁筛查" />

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">AML 告警与 STR 申报</span>
            <span className="badge badge-amber">未结 94 件</span>
          </div>
          <div className="chart-wrap" style={{ height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={AML_CASES}>
                <XAxis dataKey="m" stroke="var(--text-muted)" fontSize={11} />
                <YAxis yAxisId="L" stroke="var(--text-muted)" fontSize={11} />
                <YAxis yAxisId="R" orientation="right" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area yAxisId="L" type="monotone" dataKey="alerts" name="月告警数" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Line yAxisId="R" type="monotone" dataKey="str" name="STR 申报" stroke="#ef4444" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">欺诈与制裁</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            <div style={{ padding: 14, background: 'var(--bg-hover)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>本月欺诈拦截金额</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: STATUS_COLOR.good }}>¥2,840万</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>拦截率 96.4%</div>
            </div>
            <div style={{ padding: 14, background: 'var(--bg-hover)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>欺诈案件数</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>248</div>
              <div style={{ fontSize: 11, color: STATUS_COLOR.alert, marginTop: 4 }}>↑ 8.2% MoM</div>
            </div>
            <div style={{ padding: 14, background: 'var(--bg-hover)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>制裁名单命中</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>18</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>已上报 18 / 已阻断 18</div>
            </div>
            <div style={{ padding: 14, background: 'var(--bg-hover)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>高风险国家交易</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>1,240</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>已 EDD 100%</div>
            </div>
            <div style={{ gridColumn: 'span 2', padding: 14, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>📋 监管报送状态 (COREP / FINREP / CRS / FATCA)</span>
                <span className="badge badge-green">全部按时</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ L10 · 战略与数字化 ═══════════ */}
      <SectionTitle idx="L10" icon="🚀" title="战略与数字化 · Strategic Initiatives"
        subtitle="数字渠道占比 · AI 赋能 · 创新业务" />

      <div className="kpi-grid">
        <SignalKpi label="数字渠道交易占比" value="87.4" unit="%" delta="↑ 4.2pp YoY" status="good" target=">80%" />
        <SignalKpi label="移动端 MAU"        value="384" unit="万"  delta="↑ 18.6%"   status="good" />
        <SignalKpi label="线上开户占比"      value="72.8" unit="%" delta="↑ 8.4pp"   status="good" />
        <SignalKpi label="AI 处理交易数(日)" value="2,840" unit="万" delta="↑ 42%"   status="good" />
        <SignalKpi label="AI 模型准确率"     value="96.2" unit="%" delta="↑ 1.4pp"   status="good" />
        <SignalKpi label="AI 节省工时(月)"   value="184" unit="万小时" delta="↑ 38%"  status="good" />
        <SignalKpi label="跨境支付量"        value="¥820" unit="亿/月" delta="↑ 28%"  status="good" />
        <SignalKpi label="供应链金融余额"    value="¥1,240" unit="亿" delta="↑ 32%"  status="good" />
        <SignalKpi label="数字资产/CBDC"     value="¥86" unit="亿" delta="↑ 142%"   status="good" />
        <SignalKpi label="ESG 绿色信贷余额"  value="¥820" unit="亿" delta="↑ 26%"   status="good" />
        <SignalKpi label="Open Banking API 调用" value="48.6" unit="亿/月" delta="↑ 86%" status="good" />
        <SignalKpi label="员工 AI 工具普及率" value="78"  unit="%" delta="↑ 24pp"   status="good" />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="section-header">
          <span className="section-title">战略项目进度（董事会跟踪）</span>
          <span className="tag">6 项核心战略</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>战略项目</th><th>负责人</th><th>预算</th><th>已投入</th><th>进度</th><th>里程碑</th><th>状态</th></tr>
            </thead>
            <tbody>
              {[
                { name: '财富管理 2030 战略', owner: '王副行长', budget: '¥18亿', used: '¥7.2亿', pct: 42, milestone: '私行客户突破 1 万', status: 'good' as Status },
                { name: 'AI Everywhere 计划', owner: 'CTO 陈博士', budget: '¥24亿', used: '¥12.8亿', pct: 58, milestone: 'GPT 在 12 业务线落地', status: 'good' as Status },
                { name: 'GBA 大湾区拓展',     owner: '区域总裁 李总', budget: '¥12亿', used: '¥6.4亿', pct: 56, milestone: '深港跨境理财通 v2.0', status: 'good' as Status },
                { name: 'CBDC / 数字人民币',  owner: '创新部 张总', budget: '¥6亿', used: '¥2.8亿', pct: 48, milestone: 'mBridge 多边平台接入', status: 'good' as Status },
                { name: 'ESG / 双碳金融',     owner: 'CSO 周博士', budget: '¥8亿', used: '¥3.2亿', pct: 41, milestone: '绿色债券承销 Top 5', status: 'watch' as Status },
                { name: '核心系统云化',       owner: 'CIO 刘总',  budget: '¥38亿', used: '¥22.4亿', pct: 62, milestone: '存款主机下线', status: 'watch' as Status },
              ].map(p => (
                <tr key={p.name}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.owner}</td>
                  <td>{p.budget}</td>
                  <td>{p.used}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100 }} className="progress-bar">
                        <div className="progress-fill" style={{ width: `${p.pct}%`, background: STATUS_COLOR[p.status] }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{p.pct}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.milestone}</td>
                  <td><Light s={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════ Footer ═══════════ */}
      <div style={{
        marginTop: 32, padding: 16, borderRadius: 12,
        background: 'var(--bg-hover)', textAlign: 'center',
        fontSize: 11, color: 'var(--text-muted)',
      }}>
        BankerOS CEO Dashboard · 30~50 核心 KPI · 对标 HSBC / Citi / Standard Chartered · BIAN v12 / Basel III/IV / IFRS 9
        <br />
        所有指标支持按 <strong>国家 / 客户 / 产品 / 行业 / 分行 / 客户经理</strong> 维度下钻 · 数据每 5 分钟自动刷新
      </div>
    </div>
  );
}
