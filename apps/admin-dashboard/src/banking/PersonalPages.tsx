/**
 * Personal Online Banking — deep product & action pages.
 * Modeled after HSBC One / CMB App / ICBC e-Life / BOC 中银 e 财富.
 *
 * Exports:
 *   AccountsCenter · CardsCenter · WealthCenter · FxGlobal ·
 *   LoansCenter · PayLifestyle · SecurityCenter · PremierLounge
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BankingLayout from './BankingLayout';

const tipStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 } as const;

// ════════════════════════════════════════════════════════════════════
// 0. SHARED PRIMITIVES
// ════════════════════════════════════════════════════════════════════
const Hero = ({ title, sub, color = '#dc2626' }: { title: string; sub: string; color?: string }) => (
  <div style={{ background: `linear-gradient(120deg, ${color}, #002966)`, color: '#fff', padding: '28px 32px', borderRadius: 12, marginBottom: 24 }}>
    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, opacity: 0.9 }}>{sub}</div>
  </div>
);

const Stat = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) => (
  <div className="b-card" style={{ padding: 18 }}>
    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: color ?? '#0f172a' }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{sub}</div>}
  </div>
);

const Section = ({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) => (
  <div className="b-card" style={{ marginBottom: 20 }}>
    <div className="b-card-header"><div className="b-card-title">{title}</div>{extra}</div>
    <div className="b-card-body">{children}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════════
// 1. ACCOUNTS CENTER · 我的账户
// ════════════════════════════════════════════════════════════════════
const ACCOUNTS = [
  { type: '一卡通主账户', ccy: 'CNY', num: '6225 8801 ··· 4821', balance: 128420.50, avail: 128420.50, rate: '0.30%', kind: '活期' },
  { type: '工资账户', ccy: 'CNY', num: '6225 8801 ··· 4838', balance: 32100.00, avail: 32100.00, rate: '0.30%', kind: '活期' },
  { type: '美元账户', ccy: 'USD', num: 'USD-8841-0023', balance: 18420.00, avail: 18420.00, rate: '4.20%', kind: '活期' },
  { type: '港币定期', ccy: 'HKD', num: 'HKD-TD-8841-991', balance: 500000.00, avail: 0, rate: '3.85%', kind: '定期 12 月' },
  { type: '欧元结算', ccy: 'EUR', num: 'EUR-8841-0045', balance: 8920.00, avail: 8920.00, rate: '3.20%', kind: '活期' },
  { type: '人民币结构性存款', ccy: 'CNY', num: 'SD-2026-00184', balance: 200000.00, avail: 0, rate: '3.65%~5.20%', kind: '结构 90 天' },
];
const FX_RATE = { USD: 7.18, HKD: 0.92, EUR: 7.82 } as Record<string, number>;

export function AccountsCenter() {
  const totalCny = ACCOUNTS.reduce((s, a) => s + a.balance * (FX_RATE[a.ccy] ?? 1), 0);
  return (
    <BankingLayout variant="personal">
      <Hero title="我的账户" sub={`共 ${ACCOUNTS.length} 个账户 · 合计折人民币 ¥${totalCny.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`} />

      <div className="b-quick-grid" style={{ marginBottom: 20 }}>
        {[
          { i: '➕', l: '新开账户' }, { i: '⟶', l: '转账汇款' }, { i: '📋', l: '账单流水' },
          { i: '💱', l: '结售汇' }, { i: '🔒', l: '账户冻结' }, { i: '⬇', l: '导出对账单' },
        ].map(q => (
          <button key={q.l} className="b-quick-btn">
            <div className="b-quick-icon">{q.i}</div>
            <div className="b-quick-label">{q.l}</div>
          </button>
        ))}
      </div>

      <Section title="账户列表（多币种）" extra={<span style={{ fontSize: 11, color: '#64748b' }}>实时 · 北京时间 09:42</span>}>
        <table className="b-table">
          <thead>
            <tr><th>账户类型</th><th>账号</th><th style={{ textAlign: 'right' }}>余额</th><th style={{ textAlign: 'right' }}>可用</th><th style={{ textAlign: 'right' }}>利率</th><th>类别</th><th>操作</th></tr>
          </thead>
          <tbody>
            {ACCOUNTS.map(a => (
              <tr key={a.num}>
                <td style={{ fontWeight: 600 }}>{a.type}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{a.num}</td>
                <td style={{ textAlign: 'right' }}><strong>{a.ccy} {a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                <td style={{ textAlign: 'right', color: '#64748b' }}>{a.avail.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'right' }}><span className="b-badge b-badge-info">{a.rate}</span></td>
                <td><span className="b-badge b-badge-success">{a.kind}</span></td>
                <td style={{ fontSize: 12, color: '#dc2626' }}><Link to="/personal/statements" style={{ color: '#dc2626' }}>明细</Link> · 转出 · 设置</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="b-grid-2">
        <Section title="资产币种分布">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ACCOUNTS.map(a => ({ name: a.ccy, value: a.balance * (FX_RATE[a.ccy] ?? 1) }))} dataKey="value" innerRadius={50} outerRadius={90} label={(d: any) => `${d.name} ${(d.percent * 100).toFixed(0)}%`}>
                {ACCOUNTS.map((_, i) => <Cell key={i} fill={['#dc2626', '#002966', '#ffba00', '#22c55e', '#9333ea', '#06b6d4'][i]} />)}
              </Pie>
              <Tooltip contentStyle={tipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
        <Section title="近 6 月资产变化（折 CNY）">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={[
              { m: '12月', v: 1080000 }, { m: '1月', v: 1120000 }, { m: '2月', v: 1180000 },
              { m: '3月', v: 1240000 }, { m: '4月', v: 1320000 }, { m: '5月', v: 1382000 },
            ]}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} /><stop offset="100%" stopColor="#dc2626" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="m" /><YAxis />
              <Tooltip contentStyle={tipStyle} />
              <Area type="monotone" dataKey="v" stroke="#dc2626" fill="url(#ag)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Section>
      </div>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 2. CARDS CENTER · 信用卡中心
// ════════════════════════════════════════════════════════════════════
const CARDS = [
  { name: 'World Elite Mastercard', num: '5478 ···· ···· 8841', limit: 280000, used: 28640, points: 184200, cycle: '每月 8 日', payDue: '6 月 28 日', img: 'linear-gradient(135deg, #000, #1a1a1a)' },
  { name: 'Visa Infinite 御玺', num: '4622 ···· ···· 9924', limit: 180000, used: 8421, points: 62800, cycle: '每月 15 日', payDue: '7 月 5 日', img: 'linear-gradient(135deg, #c026d3, #6b21a8)' },
  { name: 'Premier 旅行白金', num: '5544 ···· ···· 1183', limit: 80000, used: 12480, points: 28400, cycle: '每月 1 日', payDue: '6 月 21 日', img: 'linear-gradient(135deg, #0ea5e9, #1e40af)' },
];

export function CardsCenter() {
  const [tab, setTab] = useState<'cards' | 'bills' | 'instalment' | 'rewards'>('cards');
  return (
    <BankingLayout variant="personal">
      <Hero title="信用卡中心" sub="3 张卡片 · 总额度 ¥540,000 · 已用 ¥49,541 · 可用 ¥490,459" color="#9333ea" />

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, padding: 4, background: '#f1f5f9', borderRadius: 8, width: 'fit-content' }}>
        {[['cards', '💳 我的卡'], ['bills', '📄 账单与还款'], ['instalment', '🔢 账单分期'], ['rewards', '🎁 积分商城']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            style={{ padding: '8px 16px', background: tab === k ? '#fff' : 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: tab === k ? 700 : 500, color: tab === k ? '#0f172a' : '#64748b', fontSize: 13 }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'cards' && (
        <>
          <div className="b-grid-3" style={{ marginBottom: 20 }}>
            {CARDS.map(c => (
              <div key={c.num} style={{ background: c.img, color: '#fff', borderRadius: 16, padding: 22, minHeight: 200, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.1em', marginBottom: 8 }}>BankerOS</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 24 }}>{c.name}</div>
                <div style={{ fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 16 }}>{c.num}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 9, opacity: 0.7, textTransform: 'uppercase' }}>可用额度</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>¥{(c.limit - c.used).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 28, opacity: 0.3, fontWeight: 800 }}>VISA</div>
                </div>
              </div>
            ))}
          </div>
          <Section title="卡片管理">
            <div className="b-grid-3" style={{ gap: 12 }}>
              {[
                ['📊 临时提额', '最高额度 +30%'], ['🔒 卡片冻结', '丢失立即停卡'],
                ['📱 设置密码', '交易密码 · 查询密码'], ['🌍 境外开通', '境外消费白名单'],
                ['🚨 异常交易申诉', '盗刷保障'], ['💰 现金分期', '12 期 0.6% 月费率'],
              ].map(([t, d]) => (
                <button key={t as string} className="b-card" style={{ padding: 18, textAlign: 'left', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{d}</div>
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      {tab === 'bills' && (
        <>
          <div className="b-grid-3" style={{ marginBottom: 20 }}>
            <Stat label="当期账单合计" value="¥ 28,640.18" sub="6/15 到期 · 还有 8 天" color="#dc2626" />
            <Stat label="最低还款额" value="¥ 2,864.02" sub="避免逾期" />
            <Stat label="未出账消费" value="¥ 4,820.00" sub="将进入下期账单" />
          </div>
          <Section title="还款" extra={<button className="b-btn b-btn-primary">立即全额还款</button>}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="b-card" style={{ padding: 16, border: '2px solid #dc2626' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>✓ 已开启自动还款</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>从主账户 ···· 4821 全额自动扣款</div>
              </div>
              <div className="b-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>本月已还</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>¥ 14,200.00</div>
              </div>
              <div className="b-card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>循环利息</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>¥ 0.00 <span style={{ fontSize: 11, color: '#64748b' }}>无逾期</span></div>
              </div>
            </div>
          </Section>
          <Section title="本期账单明细（World Elite）">
            <table className="b-table">
              <thead><tr><th>日期</th><th>商户</th><th>类别</th><th style={{ textAlign: 'right' }}>金额</th><th>分期</th></tr></thead>
              <tbody>
                {[
                  ['2026-06-08', 'Apple Store 浦东', '电子产品', 8999, '可分期'],
                  ['2026-06-07', '上海希尔顿酒店', '住宿', 4800, '已分 6 期'],
                  ['2026-06-05', '京东 - 戴森吹风机', '家电', 2980, '可分期'],
                  ['2026-06-04', 'Lululemon', '服饰', 2680, '-'],
                  ['2026-06-03', '星巴克(陆家嘴)', '餐饮', 86, '-'],
                  ['2026-06-02', 'Cathay Pacific 香港', '机票', 9097, '已分 12 期'],
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td>{r[1]}</td><td><span className="b-badge b-badge-info">{r[2]}</span></td>
                    <td style={{ textAlign: 'right' }} className="b-amount-neg">-¥{(r[3] as number).toLocaleString()}</td>
                    <td style={{ fontSize: 12 }}>{r[4] === '可分期' ? <a href="#" style={{ color: '#dc2626' }}>{r[4]} →</a> : r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </>
      )}

      {tab === 'instalment' && (
        <Section title="账单分期试算">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="b-form-group"><div className="b-form-label">分期金额</div><input className="b-form-input" defaultValue="8,999" /></div>
              <div className="b-form-group"><div className="b-form-label">期数</div>
                <select className="b-form-input">
                  <option>3 期 · 手续费率 0.65% /期</option>
                  <option>6 期 · 手续费率 0.60% /期</option>
                  <option>12 期 · 手续费率 0.55% /期</option>
                  <option>24 期 · 手续费率 0.50% /期</option>
                </select>
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%' }}>确认分期</button>
            </div>
            <div className="b-card" style={{ padding: 20, background: '#fef2f2' }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>试算结果（12 期）</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>¥ 799.42 <span style={{ fontSize: 14, fontWeight: 400 }}>/月</span></div>
              <div style={{ borderTop: '1px solid #fecaca', marginTop: 16, paddingTop: 16, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>本金</span><span>¥ 749.92</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>手续费</span><span>¥ 49.50</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>总手续费</span><span>¥ 594.00 (实际年化 7.32%)</span></div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {tab === 'rewards' && (
        <>
          <Stat label="可用积分" value="275,400 分" sub="≈ ¥2,754 · 1 积分 = ¥0.01" color="#f59e0b" />
          <div className="b-grid-3" style={{ marginTop: 20 }}>
            {[
              { i: '✈', n: '国航 / 国泰里程兑换', d: '20,000 积分 = 4,000 里程', p: 20000 },
              { i: '🎫', n: '机场贵宾室通行证', d: '环球龙腾 6 次', p: 60000 },
              { i: '🎁', n: 'Apple AirPods Pro 2', d: '官方零售 ¥1,899', p: 189900 },
              { i: '🍷', n: '法国波尔多红酒礼盒', d: '6 支装', p: 88000 },
              { i: '💰', n: '抵扣账单', d: '1:1 实时抵扣', p: 1 },
              { i: '☕', n: '星巴克 200 元礼品卡', d: '电子券码', p: 20000 },
            ].map(r => (
              <div key={r.n} className="b-card" style={{ padding: 18 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{r.i}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{r.n}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>{r.d}</div>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 700 }}>{r.p === 1 ? '1 积分 = ¥0.01' : `${r.p.toLocaleString()} 积分`}</div>
                <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12, fontSize: 12 }}>立即兑换</button>
              </div>
            ))}
          </div>
        </>
      )}
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 3. WEALTH CENTER · 财富中心
// ════════════════════════════════════════════════════════════════════
const HOLDINGS = [
  { code: '519688', name: '招商中证白酒指数 LOF', type: '股票基金', cost: 1.842, nav: 2.184, qty: 12000, pnl: 18.6 },
  { code: '161725', name: '招商中证 1000 指数', type: '股票基金', cost: 1.220, nav: 1.342, qty: 8000, pnl: 10.0 },
  { code: '003547', name: '南方天天利货币 B', type: '货币基金', cost: 1.000, nav: 1.000, qty: 80000, pnl: 1.92 },
  { code: 'WM-2026-184', name: '招银理财 - 招睿稳健 365 天', type: '理财', cost: 1.000, nav: 1.0312, qty: 200000, pnl: 3.12 },
  { code: 'STR-2026-022', name: '挂钩黄金双区间结构化', type: '结构化', cost: 1.000, nav: 1.0142, qty: 100000, pnl: 1.42 },
  { code: 'INS-LIFE-001', name: '招商信诺 · 安享康健重疾', type: '保险', cost: 18000, nav: 18000, qty: 1, pnl: 0 },
];

export function WealthCenter() {
  const totalCost = HOLDINGS.reduce((s, h) => s + h.cost * h.qty, 0);
  const totalMv = HOLDINGS.reduce((s, h) => s + h.nav * h.qty, 0);
  const totalPnl = totalMv - totalCost;
  const pnlPct = (totalPnl / totalCost * 100).toFixed(2);

  return (
    <BankingLayout variant="personal">
      <Hero title="财富中心" sub="您的专属理财顾问 · 王雪 AFP · 158 ···· 2841" color="#9333ea" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="持仓市值" value={`¥ ${totalMv.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`} sub={`成本 ¥${totalCost.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`} />
        <Stat label="累计盈亏" value={`+¥ ${totalPnl.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`} sub={`收益率 +${pnlPct}%`} color="#22c55e" />
        <Stat label="今日盈亏" value="+¥ 1,842.50" sub="+0.43%" color="#22c55e" />
      </div>

      <div className="b-grid-2">
        <Section title="资产配置">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={[
                { name: '股票基金', value: 38, color: '#dc2626' },
                { name: '债券/理财', value: 28, color: '#3b82f6' },
                { name: '货币现金', value: 14, color: '#22c55e' },
                { name: '结构化', value: 10, color: '#f59e0b' },
                { name: '黄金', value: 6, color: '#facc15' },
                { name: '保险', value: 4, color: '#a855f7' },
              ]} dataKey="value" innerRadius={60} outerRadius={100}>
                {['#dc2626', '#3b82f6', '#22c55e', '#f59e0b', '#facc15', '#a855f7'].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={tipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Section>
        <Section title="近 12 月净值走势">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={[
              { m: '6月', mv: 380 }, { m: '7月', mv: 392 }, { m: '8月', mv: 388 },
              { m: '9月', mv: 405 }, { m: '10月', mv: 418 }, { m: '11月', mv: 422 },
              { m: '12月', mv: 410 }, { m: '1月', mv: 425 }, { m: '2月', mv: 432 },
              { m: '3月', mv: 446 }, { m: '4月', mv: 458 }, { m: '5月', mv: 482 },
            ]}>
              <XAxis dataKey="m" /><YAxis />
              <Tooltip contentStyle={tipStyle} formatter={(v: any) => `¥${v} 万`} />
              <Line type="monotone" dataKey="mv" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Section>
      </div>

      <Section title="我的持仓">
        <table className="b-table">
          <thead><tr><th>产品代码</th><th>名称</th><th>类型</th><th>持仓份额</th><th>成本价</th><th>最新净值</th><th style={{ textAlign: 'right' }}>市值</th><th style={{ textAlign: 'right' }}>盈亏%</th><th>操作</th></tr></thead>
          <tbody>
            {HOLDINGS.map(h => (
              <tr key={h.code}>
                <td style={{ fontFamily: 'monospace' }}>{h.code}</td>
                <td style={{ fontWeight: 600 }}>{h.name}</td>
                <td><span className="b-badge b-badge-info">{h.type}</span></td>
                <td>{h.qty.toLocaleString()}</td>
                <td>{h.cost.toFixed(4)}</td>
                <td>{h.nav.toFixed(4)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>¥{(h.nav * h.qty).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'right' }} className={h.pnl >= 0 ? 'b-amount-pos' : 'b-amount-neg'}>{h.pnl >= 0 ? '+' : ''}{h.pnl.toFixed(2)}%</td>
                <td style={{ fontSize: 12 }}><a href="#" style={{ color: '#dc2626' }}>申购</a> · <a href="#" style={{ color: '#dc2626' }}>赎回</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="精选理财产品（专属您的风险等级 R3 平衡型）">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { tag: '净值型', name: '招睿稳健 365 天', yield: '4.85%', risk: 'R2', min: '¥1万起', term: '365 天' },
            { tag: 'FOF', name: '招商混合型 FOF', yield: '6.20%', risk: 'R3', min: '¥1千起', term: '建议持有 1 年+' },
            { tag: '结构化', name: '挂钩沪深 300 鲨鱼鳍', yield: '0~8.50%', risk: 'R3', min: '¥5万起', term: '6 月' },
            { tag: '货币基金', name: '南方天天利', yield: '2.18%', risk: 'R1', min: '¥1元起', term: '随时' },
            { tag: '保险', name: '招商信诺 · 增额终身寿', yield: '3.50% IRR', risk: 'R1', min: '¥10万起', term: '10/15/20 年' },
            { tag: 'QDII', name: '南方香港优选股票 QDII', yield: '历史 12.4%', risk: 'R4', min: '¥1千起', term: '建议持有 3 年+' },
          ].map(p => (
            <div key={p.name} className="b-card" style={{ padding: 18, cursor: 'pointer' }}>
              <span className="b-badge b-badge-warn">{p.tag}</span>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0' }}>{p.name}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>{p.yield}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>业绩比较基准 / 近 1 年</div>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 12, paddingTop: 10, fontSize: 11, color: '#64748b' }}>
                {p.risk} · {p.min} · {p.term}
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12, fontSize: 12 }}>立即购买</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🤖 智能投顾 / 一键调仓建议">
        <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>💡 BankerOS AI 建议：当前股票配置偏高，建议适度调整</div>
          <div style={{ fontSize: 12, color: '#92400e', marginBottom: 12 }}>基于您的风险偏好 R3 + 市场波动率提升，建议将股票从 38% → 30%，加配债券 28% → 36%</div>
          <button className="b-btn b-btn-primary">查看 AI 调仓方案</button>
          <button className="b-btn b-btn-ghost" style={{ marginLeft: 8 }}>忽略</button>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 4. FX & GLOBAL · 外汇 / 全球账户
// ════════════════════════════════════════════════════════════════════
const FX_PAIRS = [
  { pair: 'USD/CNY', bid: 7.1820, ask: 7.1850, change: 0.12, mid: 7.1835 },
  { pair: 'HKD/CNY', bid: 0.9180, ask: 0.9210, change: -0.04, mid: 0.9195 },
  { pair: 'EUR/CNY', bid: 7.8120, ask: 7.8260, change: 0.32, mid: 7.8190 },
  { pair: 'GBP/CNY', bid: 9.0420, ask: 9.0580, change: 0.18, mid: 9.0500 },
  { pair: 'JPY/CNY', bid: 0.0468, ask: 0.0472, change: -0.18, mid: 0.0470 },
  { pair: 'AUD/CNY', bid: 4.7820, ask: 4.7980, change: 0.08, mid: 4.7900 },
  { pair: 'SGD/CNY', bid: 5.3120, ask: 5.3280, change: 0.04, mid: 5.3200 },
  { pair: 'CHF/CNY', bid: 8.0820, ask: 8.0960, change: 0.22, mid: 8.0890 },
];

export function FxGlobal() {
  const [from, setFrom] = useState('CNY');
  const [to, setTo] = useState('USD');
  const [amt, setAmt] = useState('10000');

  return (
    <BankingLayout variant="personal">
      <Hero title="外汇与全球账户" sub="12 种货币 · 实时牌价 · 留学 / 旅游 / 海外投资" color="#002966" />

      <div className="b-grid-2" style={{ marginBottom: 20 }}>
        <Section title="结售汇 / 即时换汇">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end' }}>
            <div>
              <div className="b-form-label">付出</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="b-form-input" style={{ width: 100 }} value={from} onChange={e => setFrom(e.target.value)}>
                  {['CNY', 'USD', 'HKD', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input className="b-form-input" value={amt} onChange={e => setAmt(e.target.value)} />
              </div>
            </div>
            <button style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>⇄</button>
            <div>
              <div className="b-form-label">收到（预计）</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="b-form-input" style={{ width: 100 }} value={to} onChange={e => setTo(e.target.value)}>
                  {['USD', 'CNY', 'HKD', 'EUR', 'GBP', 'JPY', 'AUD', 'SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input className="b-form-input" value={(parseFloat(amt) / 7.1835).toFixed(2)} readOnly />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: '#f0fdf4', borderRadius: 6, fontSize: 12 }}>
            参考汇率 USD/CNY <strong>7.1835</strong> · 实时刷新 · 您可获 Premier 客户优惠点差 -10 bps
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="b-btn b-btn-primary">立即换汇</button>
            <button className="b-btn b-btn-ghost">设置目标价提醒</button>
            <button className="b-btn b-btn-ghost">远期锁汇</button>
          </div>
        </Section>

        <Section title="USD/CNY 24 小时走势">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={Array.from({ length: 24 }, (_, i) => ({ h: `${i}:00`, r: 7.18 + Math.sin(i / 4) * 0.012 + Math.random() * 0.005 }))}>
              <XAxis dataKey="h" interval={3} fontSize={10} /><YAxis domain={['auto', 'auto']} fontSize={10} />
              <Tooltip contentStyle={tipStyle} formatter={(v: any) => v.toFixed(4)} />
              <Line type="monotone" dataKey="r" stroke="#dc2626" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Section>
      </div>

      <Section title="实时牌价（北京时间 09:42:18）" extra={<button className="b-btn b-btn-ghost">刷新</button>}>
        <table className="b-table">
          <thead><tr><th>货币对</th><th style={{ textAlign: 'right' }}>银行买入</th><th style={{ textAlign: 'right' }}>银行卖出</th><th style={{ textAlign: 'right' }}>中间价</th><th style={{ textAlign: 'right' }}>日内%</th><th>操作</th></tr></thead>
          <tbody>
            {FX_PAIRS.map(p => (
              <tr key={p.pair}>
                <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{p.pair}</td>
                <td style={{ textAlign: 'right' }}>{p.bid.toFixed(4)}</td>
                <td style={{ textAlign: 'right' }}>{p.ask.toFixed(4)}</td>
                <td style={{ textAlign: 'right', color: '#64748b' }}>{p.mid.toFixed(4)}</td>
                <td style={{ textAlign: 'right' }} className={p.change >= 0 ? 'b-amount-pos' : 'b-amount-neg'}>{p.change >= 0 ? '+' : ''}{p.change}%</td>
                <td style={{ fontSize: 12 }}><a href="#" style={{ color: '#dc2626' }}>买入</a> · <a href="#" style={{ color: '#dc2626' }}>卖出</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="b-grid-2">
        <Section title="🌍 全球账户 · 一户多币">
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>持有 12 种货币 · 海外消费免转换费 · 全球 ATM 取现 0 手续费</div>
          {['USD', 'HKD', 'EUR', 'GBP', 'JPY', 'AUD'].map(c => (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontWeight: 700, marginRight: 12 }}>{c}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>账户 ···· {c}-0023</span>
              </div>
              <div style={{ fontWeight: 700 }}>{c === 'USD' ? '18,420.00' : c === 'HKD' ? '500,000.00' : c === 'EUR' ? '8,920.00' : '0.00'}</div>
            </div>
          ))}
        </Section>
        <Section title="✈ 出国留学专属服务">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['🎓 留学汇款专户', '免手续费 + SWIFT GPI 跟踪 · 24h 内到账'],
              ['💳 海外学生卡', '附属卡 · 限额可控 · 实时短信通知'],
              ['🏠 海外购房按揭', '英 / 美 / 澳 / 加 / 新 / 港 · 30 年期'],
              ['📑 资金证明', '在线申请 · 中英文 · 30 分钟出函'],
            ].map(([t, d]) => (
              <div key={t as string} style={{ padding: 14, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{d}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 5. LOANS CENTER · 我的贷款
// ════════════════════════════════════════════════════════════════════
export function LoansCenter() {
  return (
    <BankingLayout variant="personal">
      <Hero title="我的贷款" sub="您当前共 1 笔贷款 · 房贷余额 ¥1,842,000 · 信用额度 ¥320,000 可用" color="#002966" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="贷款总余额" value="¥ 1,842,000" sub="2 套房产抵押" />
        <Stat label="本月应还" value="¥ 12,840" sub="6/22 自动扣款" color="#dc2626" />
        <Stat label="可用信用贷额度" value="¥ 320,000" sub="闪电贷 · 秒批" color="#22c55e" />
      </div>

      <Section title="贷款明细 - 浦东陆家嘴金茂府首套房贷">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>原贷款金额</div><div style={{ fontWeight: 700 }}>¥ 3,200,000</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>当前余额</div><div style={{ fontWeight: 700, color: '#dc2626' }}>¥ 1,842,000</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>贷款期限</div><div style={{ fontWeight: 700 }}>30 年</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>已还期数</div><div style={{ fontWeight: 700 }}>96 / 360</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>利率</div><div style={{ fontWeight: 700 }}>LPR-20bp = 3.75%</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>下次重定价</div><div style={{ fontWeight: 700 }}>2027-01-01</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>还款方式</div><div style={{ fontWeight: 700 }}>等额本息</div></div>
              <div><div style={{ color: '#64748b', fontSize: 11 }}>到期日</div><div style={{ fontWeight: 700 }}>2052-12-22</div></div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="b-btn b-btn-primary">申请提前还款</button>
              <button className="b-btn b-btn-ghost">变更还款方式</button>
              <button className="b-btn b-btn-ghost">下载还款计划表</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={Array.from({ length: 30 }, (_, i) => ({ y: 2018 + i, bal: Math.max(0, 3200 - 88 * i) }))}>
              <XAxis dataKey="y" /><YAxis />
              <Tooltip contentStyle={tipStyle} formatter={(v: any) => `¥${v.toFixed(0)}K`} />
              <Area type="monotone" dataKey="bal" stroke="#dc2626" fill="#fecaca" name="贷款余额(千元)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="申请新贷款">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '🏡', n: '住房按揭贷款', d: '首套 / 二套 · 最长 30 年 · 最低 LPR-20bp', amt: '最高 ¥3,000 万', rate: '3.75% 起' },
            { i: '💼', n: '消费分期贷款', d: '装修 · 教育 · 婚庆 · 旅游', amt: '¥30 万', rate: '4.20% 起' },
            { i: '⚡', n: '招行闪电贷', d: '纯线上 · 秒批 · 随借随还', amt: '¥30 万', rate: '4.80% 起' },
            { i: '🚗', n: '汽车贷款', d: '4S 店合作 · 最低 0 首付', amt: '¥80 万', rate: '4.50% 起' },
            { i: '💍', n: '婚庆贷', d: '专为新人 · 24 期分期', amt: '¥20 万', rate: '5.20% 起' },
            { i: '🎓', n: '教育留学贷', d: '凭录取通知书申请', amt: '¥100 万', rate: '4.00% 起' },
          ].map(l => (
            <div key={l.n} className="b-card" style={{ padding: 18, cursor: 'pointer' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{l.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{l.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, minHeight: 32 }}>{l.d}</div>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 12, paddingTop: 10 }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>额度上限 · 利率</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{l.amt} · <span style={{ color: '#dc2626' }}>{l.rate}</span></div>
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12, fontSize: 12 }}>立即申请</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🧮 贷款试算器">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">贷款金额（万元）</div><input className="b-form-input" defaultValue="300" /></div>
            <div className="b-form-group"><div className="b-form-label">贷款期限</div>
              <select className="b-form-input"><option>30 年 (360 期)</option><option>20 年</option><option>10 年</option><option>5 年</option></select>
            </div>
            <div className="b-form-group"><div className="b-form-label">年利率 (%)</div><input className="b-form-input" defaultValue="3.75" /></div>
            <div className="b-form-group"><div className="b-form-label">还款方式</div>
              <select className="b-form-input"><option>等额本息</option><option>等额本金</option></select>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%' }}>开始试算</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fef2f2' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>每月还款</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#dc2626' }}>¥ 13,894</div>
            <div style={{ borderTop: '1px solid #fecaca', marginTop: 16, paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>总还款额</span><span>¥ 5,002,068</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>总利息</span><span style={{ color: '#dc2626' }}>¥ 2,002,068</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>首月利息 / 本金</span><span>¥9,375 / ¥4,519</span></div>
            </div>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 6. PAY & LIFESTYLE · 缴费 + 生活
// ════════════════════════════════════════════════════════════════════
export function PayLifestyle() {
  return (
    <BankingLayout variant="personal">
      <Hero title="生活缴费中心" sub="水 · 电 · 燃气 · 物业 · 宽带 · 手机 · 交通 · 保险 一站式" color="#0ea5e9" />

      <Section title="常用缴费">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '💧', n: '上海自来水', d: '账户 ···· 2841', due: '¥ 124.50', date: '6/20 到期' },
            { i: '⚡', n: '上海电力', d: '账户 ···· 9982', due: '¥ 482.00', date: '6/15 到期' },
            { i: '🔥', n: '上海燃气', d: '账户 ···· 4521', due: '¥ 86.00', date: '已开启自动' },
            { i: '🏠', n: '陆家嘴金茂物业', d: '12 月一付', due: '¥ 4,800', date: '7/1 到期' },
            { i: '📡', n: '中国电信宽带', d: '500M · 12 月', due: '¥ 1,680', date: '8/12 到期' },
            { i: '📱', n: '手机话费 (138)', d: '本人 + 太太号', due: '¥ 200', date: '已自动充值' },
          ].map(b => (
            <div key={b.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: 26, marginRight: 8 }}>{b.i}</span>
                  <span style={{ fontWeight: 700 }}>{b.n}</span>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{b.d}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626' }}>{b.due}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{b.date}</div>
                </div>
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12, fontSize: 12 }}>立即缴费</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="更多生活服务">
        <div className="b-quick-grid">
          {[
            ['🛫', '机票'], ['🏨', '酒店'], ['🚄', '高铁'], ['🎬', '电影票'], ['🍽', '餐厅'],
            ['🅿', '停车缴费'], ['🚇', '地铁卡充值'], ['📚', '学费'], ['🏥', '医院预约'],
            ['💊', '药品'], ['🎁', '礼品卡'], ['☕', '咖啡'],
          ].map(([i, l]) => (
            <button key={l} className="b-quick-btn">
              <div className="b-quick-icon">{i}</div>
              <div className="b-quick-label">{l}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="本月支出分析">
        <div className="b-grid-2">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[
                { name: '餐饮', value: 28, color: '#dc2626' },
                { name: '购物', value: 22, color: '#9333ea' },
                { name: '交通', value: 12, color: '#3b82f6' },
                { name: '居家', value: 14, color: '#22c55e' },
                { name: '娱乐', value: 10, color: '#f59e0b' },
                { name: '医疗', value: 6, color: '#06b6d4' },
                { name: '其他', value: 8, color: '#94a3b8' },
              ]} dataKey="value" outerRadius={90} label={(d: any) => `${d.name} ${d.value}%`}>
                {['#dc2626', '#9333ea', '#3b82f6', '#22c55e', '#f59e0b', '#06b6d4', '#94a3b8'].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div>
            <div style={{ fontSize: 11, color: '#64748b' }}>本月总支出</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>¥ 18,642 <span style={{ fontSize: 14, color: '#22c55e' }}>↓ 12% MoM</span></div>
            <div style={{ marginTop: 20 }}>
              {[['餐饮', 5220], ['购物', 4100], ['交通', 2240], ['居家', 2610], ['娱乐', 1864], ['医疗', 1118], ['其他', 1490]].map(([n, v]) => (
                <div key={n as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                  <span>{n}</span><span style={{ fontWeight: 600 }}>¥{(v as number).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 7. SECURITY CENTER · 安全中心
// ════════════════════════════════════════════════════════════════════
export function SecurityCenter() {
  return (
    <BankingLayout variant="personal">
      <Hero title="安全中心" sub="您的账户安全评分 · 95/100 优秀 · 已启用 5/6 项安全功能" color="#22c55e" />

      <Section title="🔐 登录与认证">
        <div className="b-grid-2">
          {[
            { i: '🔑', n: '登录密码', d: '90 天未修改 · 强度高', s: '✓ 已设置', c: '#22c55e' },
            { i: '🛡', n: '交易密码', d: '与登录密码独立', s: '✓ 已设置', c: '#22c55e' },
            { i: '👤', n: '人脸识别', d: '苹果 Face ID · 安卓人脸', s: '✓ 已启用', c: '#22c55e' },
            { i: '📱', n: '短信 OTP', d: '6 位动态码', s: '✓ 已启用', c: '#22c55e' },
            { i: '🔐', n: 'U 盾 / Token', d: '硬件加密', s: '✓ 已启用', c: '#22c55e' },
            { i: '✋', n: '指纹认证', d: 'TouchID / 指纹', s: '⚠ 未启用', c: '#f59e0b' },
          ].map(item => (
            <div key={item.n} style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28 }}>{item.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.n}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{item.d}</div>
              </div>
              <span style={{ color: item.c, fontWeight: 700, fontSize: 12 }}>{item.s}</span>
              <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>管理</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="💰 交易限额管理">
        <table className="b-table">
          <thead><tr><th>交易类型</th><th style={{ textAlign: 'right' }}>单笔限额</th><th style={{ textAlign: 'right' }}>日累计</th><th style={{ textAlign: 'right' }}>已使用</th><th>认证方式</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { t: '行内转账（本人）', s: '不限', d: '不限', u: '¥18,420', a: '密码' },
              { t: '行内转账（他人）', s: '¥500,000', d: '¥1,000,000', u: '¥120,000', a: '密码 + OTP' },
              { t: '跨行汇款', s: '¥1,000,000', d: '¥2,000,000', u: '¥0', a: '密码 + OTP + 人脸' },
              { t: '境外汇款 SWIFT', s: 'USD 50,000', d: 'USD 50,000/年', u: 'USD 12,400', a: 'U 盾 + 人脸' },
              { t: '快捷支付（小额）', s: '¥5,000', d: '¥20,000', u: '¥2,840', a: '指纹/人脸' },
            ].map(r => (
              <tr key={r.t}>
                <td style={{ fontWeight: 600 }}>{r.t}</td>
                <td style={{ textAlign: 'right' }}>{r.s}</td>
                <td style={{ textAlign: 'right' }}>{r.d}</td>
                <td style={{ textAlign: 'right', color: '#dc2626' }}>{r.u}</td>
                <td><span className="b-badge b-badge-info">{r.a}</span></td>
                <td style={{ fontSize: 12, color: '#dc2626' }}><a href="#" style={{ color: '#dc2626' }}>调整</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="📱 我的设备 (已授权 4 台)">
        <table className="b-table">
          <thead><tr><th>设备</th><th>类型</th><th>最近登录</th><th>位置</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { d: 'iPhone 15 Pro Max', t: '手机银行', last: '今天 09:42', loc: '上海 浦东', s: '当前' },
              { d: 'MacBook Pro M3 14"', t: '网页 Chrome', last: '昨天 22:30', loc: '上海 浦东', s: '已授权' },
              { d: 'iPad Air', t: '手机银行', last: '5/28 18:42', loc: '上海 静安', s: '已授权' },
              { d: 'Pixel 8 (备用)', t: '手机银行', last: '5/15 12:00', loc: '北京 朝阳', s: '已授权' },
            ].map(d => (
              <tr key={d.d}>
                <td style={{ fontWeight: 600 }}>{d.d}</td>
                <td>{d.t}</td>
                <td>{d.last}</td>
                <td>{d.loc}</td>
                <td><span className={`b-badge ${d.s === '当前' ? 'b-badge-success' : 'b-badge-info'}`}>{d.s}</span></td>
                <td style={{ fontSize: 12 }}>{d.s !== '当前' && <a href="#" style={{ color: '#dc2626' }}>解除授权</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="🚨 最近 30 天安全事件">
        <table className="b-table">
          <thead><tr><th>时间</th><th>事件</th><th>设备 / 位置</th><th>结果</th></tr></thead>
          <tbody>
            {[
              ['今天 09:42', '登录手机银行', 'iPhone · 上海 116.231.··.45', '✓ 成功'],
              ['昨天 22:30', '登录网银 (笔记本)', 'MacBook · 上海 116.231.··.45', '✓ 成功'],
              ['5/28 18:00', '修改交易密码', 'iPhone · 上海', '✓ 成功 · 已短信通知'],
              ['5/22 14:08', '异地登录尝试 (北京)', '未知设备 · 116.116.··.12', '⛔ 拒绝 · 已冻结 24h'],
              ['5/20 09:15', '境外消费 - Apple Pay 东京', 'iPhone · NFC', '✓ 成功 · ¥1,820'],
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td><td>{r[1]}</td><td style={{ fontSize: 11, fontFamily: 'monospace' }}>{r[2]}</td>
                <td>{r[3].startsWith('✓') ? <span className="b-badge b-badge-success">{r[3]}</span> : <span className="b-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>{r[3]}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 8. PREMIER LOUNGE · Premier / Jade / Private 专属
// ════════════════════════════════════════════════════════════════════
export function PremierLounge() {
  return (
    <BankingLayout variant="personal">
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #6b21a8 50%, #c026d3)', padding: '40px 32px', borderRadius: 16, color: '#fff', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 12, opacity: 0.8, letterSpacing: '0.2em', marginBottom: 8 }}>BANKEROS PREMIER</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>欢迎您，赵磊先生 👑</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 24 }}>您是 BankerOS Premier 客户（AUM ¥1.38M）· 距离 Jade 资格还差 ¥3.62M</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { l: '客户经理', v: '王雪 AFP', d: '158 ···· 2841' },
            { l: '专属热线', v: '400-888-Premier', d: '24/7 优先接听' },
            { l: '机场贵宾室', v: '环球龙腾', d: '每年 24 次免费' },
            { l: '高尔夫', v: '8 家俱乐部', d: '免开球费' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{s.l}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{s.v}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="b-grid-2">
        <Section title="🎯 Premier 专属服务">
          {[
            ['🎓 子女留学规划', '免费 1V1 咨询 · 哈佛 / 剑桥校友资源'],
            ['🏠 海外购房贷款', '英美澳加 6 国 · 7 折优惠利率'],
            ['🏥 国际医疗', '全球 600+ 顶级私立医院直付'],
            ['📜 资产传承规划', '信托 · 保险金 · 家族办公室'],
            ['🛂 移民身份规划', '香港优才 / 新加坡 EP / 葡萄牙黄金签证'],
            ['💎 私人投资银行家', '一站式财富管理 · 海外配置'],
          ].map(([t, d]) => (
            <div key={t as string} style={{ padding: 14, marginBottom: 8, background: '#faf5ff', borderLeft: '3px solid #9333ea', borderRadius: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{d}</div>
            </div>
          ))}
        </Section>

        <Section title="🌟 升级到 Jade / Private 享受更多">
          <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', padding: 16, borderRadius: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>JADE · 翡翠会员（AUM ¥5M+）</div>
            <div style={{ fontSize: 11, color: '#047857', marginTop: 4 }}>· 全球 24/7 私人银行家  · 海外置业一站式  · 子女顶级私校申请支持  · 免管理费</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff', padding: 16, borderRadius: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>👑 PRIVATE · 私人银行（AUM ¥30M+）</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>· 家族办公室定制  · 全球资产配置  · 私募 / Pre-IPO 通道  · 私人飞机 / 游艇礼宾</div>
          </div>
          <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 14, background: '#9333ea' }}>预约客户经理评估升级方案</button>
        </Section>
      </div>

      <Section title="🌍 全球资产配置（建议）">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={[
            { region: '中国 A 股', cur: 32, sug: 25 },
            { region: '中国港股', cur: 14, sug: 12 },
            { region: '美股', cur: 8, sug: 18 },
            { region: '欧洲', cur: 4, sug: 8 },
            { region: '日股', cur: 2, sug: 6 },
            { region: '黄金', cur: 8, sug: 12 },
            { region: '债券', cur: 24, sug: 12 },
            { region: '另类', cur: 8, sug: 7 },
          ]}>
            <XAxis dataKey="region" /><YAxis />
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => `${v}%`} />
            <Legend />
            <Bar dataKey="cur" name="当前" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sug" name="建议" fill="#9333ea" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </BankingLayout>
  );
}
