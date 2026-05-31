/**
 * Business Online Banking — deep pages.
 * Modeled after HSBCnet / CMB企业 / 工银 e生意 / Citi CitiDirect.
 *
 * Exports:
 *   CashManagement · BatchPayments · TradeCenter · TreasuryDesk ·
 *   SupplyChainFinance · PayrollCenter · ApiBankingConsole · ApprovalCenter
 */
import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BankingLayout from './BankingLayout';

const tipStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 } as const;

const Hero = ({ title, sub, color = '#002966' }: { title: string; sub: string; color?: string }) => (
  <div style={{ background: `linear-gradient(120deg, ${color}, #1e3a8a)`, color: '#fff', padding: '28px 32px', borderRadius: 12, marginBottom: 24 }}>
    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, opacity: 0.9 }}>{sub}</div>
  </div>
);

const Stat = ({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) => (
  <div className="b-card" style={{ padding: 18 }}>
    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: color ?? '#002966' }}>{value}</div>
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
// 1. CASH MANAGEMENT · 现金管理
// ════════════════════════════════════════════════════════════════════
const CORP_ACCOUNTS = [
  { entity: '招商局港口控股 (HQ)', acct: '招行 - 1100 8801 ··· 0001', ccy: 'CNY', balance: 248_400_000, type: '基本账户' },
  { entity: '招商局港口控股 (HQ)', acct: '招行 - 1100 8801 ··· 0002', ccy: 'USD', balance: 32_400_000, type: '外汇账户' },
  { entity: '招商局港口控股 (HQ)', acct: '招行 - 1100 8801 ··· 0003', ccy: 'HKD', balance: 84_000_000, type: '外汇账户' },
  { entity: '上海招港物流', acct: '招行 - 1100 8801 ··· 0184', ccy: 'CNY', balance: 18_400_000, type: '一般账户' },
  { entity: '深圳招港供应链', acct: '招行 - 1100 8801 ··· 0220', ccy: 'CNY', balance: 12_800_000, type: '一般账户' },
  { entity: '香港招港国际', acct: 'HSBC - 808 ··· 8842', ccy: 'HKD', balance: 42_600_000, type: '海外账户' },
  { entity: '新加坡招港', acct: 'DBS - 0023 ··· 9941', ccy: 'SGD', balance: 8_400_000, type: '海外账户' },
  { entity: '招港(BVI)控股', acct: 'HSBC - BVI ··· 2284', ccy: 'USD', balance: 28_000_000, type: '离岸账户' },
];

export function CashManagement() {
  const FX = { CNY: 1, USD: 7.18, HKD: 0.92, SGD: 5.32 } as Record<string, number>;
  const totalCny = CORP_ACCOUNTS.reduce((s, a) => s + a.balance * (FX[a.ccy] ?? 1), 0);
  return (
    <BankingLayout variant="business">
      <Hero title="现金管理中心 (Cash Management)" sub={`8 家公司主体 · 8 账户 · 折人民币合计 ¥${(totalCny / 1e8).toFixed(2)} 亿`} />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="集团总余额（CNY 等值）" value={`¥ ${(totalCny / 1e8).toFixed(2)} 亿`} sub="↑ +1.8% MoM" />
        <Stat label="今日资金流入" value="¥ 18.42 M" sub="42 笔到账" color="#22c55e" />
        <Stat label="今日资金流出" value="¥ 12.80 M" sub="18 笔付款 · 4 待审批" color="#dc2626" />
      </div>

      <Section title="账户总览（多公司 · 多币种 · 多银行）">
        <table className="b-table">
          <thead><tr><th>法人主体</th><th>账户</th><th>币种</th><th style={{ textAlign: 'right' }}>余额</th><th style={{ textAlign: 'right' }}>折 CNY (M)</th><th>账户类型</th><th>操作</th></tr></thead>
          <tbody>
            {CORP_ACCOUNTS.map(a => (
              <tr key={a.acct}>
                <td style={{ fontWeight: 600 }}>{a.entity}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{a.acct}</td>
                <td><span className="b-badge b-badge-info">{a.ccy}</span></td>
                <td style={{ textAlign: 'right' }}>{a.balance.toLocaleString()}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{(a.balance * (FX[a.ccy] ?? 1) / 1e6).toFixed(2)}</td>
                <td><span className="b-badge b-badge-success">{a.type}</span></td>
                <td style={{ fontSize: 11 }}>明细 · 转账 · 对账单</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="b-grid-2">
        <Section title="🌊 资金归集 (Cash Pooling)">
          <div style={{ background: '#f0f9ff', padding: 14, borderRadius: 6, marginBottom: 14, fontSize: 12, color: '#1e40af' }}>
            <strong>当前策略：Target Balance Pooling</strong> — 子账户日终保留 ¥500K，余额自动归集至总账户
          </div>
          <table className="b-table">
            <thead><tr><th>归集方式</th><th>账户数</th><th>本月归集</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>Zero Balance (零余额)</td><td>3</td><td>¥ 184 M</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td>Target Balance (目标余额)</td><td>4</td><td>¥ 218 M</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td>Notional Pooling (名义归集)</td><td>2 (HK + SG)</td><td>节省利息 ¥1.2 M</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td>Cross-Currency Sweep</td><td>USD↔CNY</td><td>USD 2.4 M</td><td><span className="b-badge b-badge-warn">每日 16:00</span></td></tr>
            </tbody>
          </table>
        </Section>

        <Section title="🔢 虚拟账户 (Virtual Account Mgmt)">
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
            为每位客户分配独立虚拟收款账户，自动对账，应收准确识别。
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Stat label="活跃虚拟账户" value="1,840" />
            <Stat label="本月自动对账" value="98.4%" color="#22c55e" />
            <Stat label="待识别款项" value="8 笔" />
            <Stat label="节省对账工时" value="184 h/月" />
          </div>
        </Section>
      </div>

      <Section title="🔮 现金流预测 (AI · 13 周滚动)">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={Array.from({ length: 13 }, (_, i) => ({
            w: `W${i + 1}`,
            in: 180 + Math.sin(i / 2) * 40 + i * 2,
            out: 140 + Math.cos(i / 2) * 30 + i * 1.5,
            bal: 320 + i * 8,
          }))}>
            <XAxis dataKey="w" /><YAxis />
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => `¥${v.toFixed(0)}M`} />
            <Legend />
            <Area type="monotone" dataKey="in"  name="预计流入"   stroke="#22c55e" fill="#bbf7d0" />
            <Area type="monotone" dataKey="out" name="预计流出"   stroke="#dc2626" fill="#fecaca" />
            <Line type="monotone" dataKey="bal" name="预计期末余额" stroke="#002966" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
          🤖 AI 预测置信度 92% · 基于历史回款规律 + 已签合同 + 季节性调整
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 2. BATCH PAYMENTS · 批量支付
// ════════════════════════════════════════════════════════════════════
export function BatchPayments() {
  const [step, setStep] = useState<'upload' | 'review' | 'approve'>('upload');
  return (
    <BankingLayout variant="business">
      <Hero title="批量支付 (Batch Payment)" sub="上传 Excel · 一次最多 10,000 笔 · 支持境内 + 跨境混合" />

      <Section title="支付流程">
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
          {[['upload', '① 上传文件'], ['review', '② 校验复核'], ['approve', '③ 多级审批'], ['', '④ 执行支付']].map(([k, l], i, arr) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step === k || (k === 'upload' && step !== 'upload') ? '#002966' : '#e2e8f0',
                color: step === k || (k === 'upload' && step !== 'upload') ? '#fff' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ marginLeft: 8, fontSize: 13, fontWeight: step === k ? 700 : 500 }}>{l}</div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: '#e2e8f0', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        {step === 'upload' && (
          <>
            <div style={{ border: '2px dashed #94a3b8', borderRadius: 8, padding: 40, textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>拖拽 Excel / CSV 文件到这里</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>支持 .xlsx · .csv · 最大 10MB · 单次最多 10,000 笔</div>
              <button className="b-btn b-btn-primary">选择文件</button>
              <div style={{ marginTop: 16, fontSize: 11, color: '#64748b' }}>
                <a href="#" style={{ color: '#dc2626' }}>下载模板</a>  ·  <a href="#" style={{ color: '#dc2626' }}>使用示例</a>  ·  <a href="#" style={{ color: '#dc2626' }}>API 自动上传</a>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="b-btn b-btn-ghost" onClick={() => setStep('review')}>下一步：校验</button>
            </div>
          </>
        )}

        {step === 'review' && (
          <>
            <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>
              ✓ <strong>校验完成</strong> · 总 248 笔 · 金额合计 ¥18,420,500 · ⚠ 4 笔异常（红色高亮，需人工确认）
            </div>
            <table className="b-table">
              <thead><tr><th>#</th><th>收款人</th><th>账号</th><th>开户行</th><th style={{ textAlign: 'right' }}>金额</th><th>用途</th><th>校验</th></tr></thead>
              <tbody>
                {[
                  { n: '上海 ACME 科技', a: '6225 ···· 0084', b: '工行 浦东支行', v: 580000, p: '货款 - PO20260601', ok: true },
                  { n: '深圳易达供应链', a: '6228 ···· 8841', b: '招行 福田支行', v: 1240000, p: '货款 - PO20260603', ok: true },
                  { n: '张伟（个人）', a: '6217 ···· 2284', b: '建行 上海分行', v: 18000, p: '差旅报销', ok: true },
                  { n: 'XYZ Holdings Pte', a: 'SG 0023 ···· 994', b: 'DBS Singapore', v: 84000, p: '咨询费 USD', ok: true, ccy: 'USD' },
                  { n: '李梅', a: '6227 ···· 7783', b: '招行 北京', v: 80000, p: '咨询费', ok: false, err: '账户名与账号不匹配' },
                  { n: '广州顺达物流', a: '6228 ···· 0033', b: '招行 广州', v: 240000, p: '运费', ok: false, err: '受益人在反洗钱观察名单' },
                ].map((r, i) => (
                  <tr key={i} style={{ background: r.ok ? 'transparent' : '#fef2f2' }}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.n}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r.a}</td>
                    <td>{r.b}</td>
                    <td style={{ textAlign: 'right' }}>{r.ccy ?? '¥'}{r.v.toLocaleString()}</td>
                    <td style={{ fontSize: 11 }}>{r.p}</td>
                    <td>{r.ok ? <span className="b-badge b-badge-success">✓</span> : <span className="b-badge" style={{ background: '#fef2f2', color: '#dc2626' }} title={r.err}>⚠ {r.err}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="b-btn b-btn-primary" onClick={() => setStep('approve')}>提交审批</button>
              <button className="b-btn b-btn-ghost" onClick={() => setStep('upload')}>返回</button>
            </div>
          </>
        )}

        {step === 'approve' && (
          <>
            <div style={{ background: '#fffbeb', padding: 14, borderRadius: 6, marginBottom: 14, fontSize: 13 }}>
              ⏳ <strong>已提交至审批流</strong> · 金额 ¥18.4M 触发 3 级审批（财务经理 → CFO → 总裁）
            </div>
            <div style={{ display: 'flex', gap: 24, padding: 20, background: '#f8fafc', borderRadius: 8 }}>
              {[
                { name: '李晓东 (财务经理)', role: '一级复核', s: '✓ 已审批', t: '09:42', c: '#22c55e' },
                { name: '王志强 (CFO)', role: '二级审批', s: '⏳ 审批中', t: '待处理', c: '#f59e0b' },
                { name: '陈建华 (总裁)', role: '三级最终', s: '— 待二级通过', t: '—', c: '#94a3b8' },
              ].map(p => (
                <div key={p.name} style={{ flex: 1, padding: 14, background: '#fff', borderRadius: 8, borderTop: `3px solid ${p.c}` }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{p.role}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, margin: '4px 0' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: p.c, fontWeight: 600 }}>{p.s}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{p.t}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>

      <Section title="本月批量支付概况">
        <div className="b-grid-3">
          <Stat label="本月批次" value="42" sub="↑ 6 vs 上月" />
          <Stat label="本月总金额" value="¥ 482 M" sub="↑ 12%" />
          <Stat label="平均处理时长" value="2.4 小时" sub="↓ 0.4h" color="#22c55e" />
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 3. TRADE CENTER · 贸易融资中心
// ════════════════════════════════════════════════════════════════════
export function TradeCenter() {
  return (
    <BankingLayout variant="business">
      <Hero title="贸易融资中心 (Trade Finance)" sub="L/C · 保函 · 福费廷 · 出口押汇 · 反向保理" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="开立 L/C 余额" value="USD 18.4 M" sub="12 笔活跃" />
        <Stat label="保函余额" value="¥ 84 M" sub="8 笔投标/履约" />
        <Stat label="本月福费廷融资" value="USD 4.8 M" sub="3 笔 · 加权天数 142 天" color="#22c55e" />
      </div>

      <Section title="🆕 申请单证 / 融资">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '📋', n: '开立信用证 L/C', d: '即期 / 远期 · UCP 600' },
            { i: '🛡', n: '银行保函', d: '投标 / 履约 / 预付款 / 质量' },
            { i: '📥', n: '出口押汇', d: 'L/C 项下 · 单据齐全即融资' },
            { i: '📤', n: '进口押汇', d: '到单后融资 · 锁汇可选' },
            { i: '🔁', n: '福费廷 Forfaiting', d: '无追索权应收账款' },
            { i: '🧾', n: '保理 Factoring', d: '正向 / 反向 / 池保理' },
            { i: '💵', n: '票据贴现', d: '银承 / 商承 · 在线议价' },
            { i: '🚢', n: '装运前融资', d: '订单融资 · 备货资金' },
            { i: '🌐', n: '跨境人民币贸融', d: 'CIPS · NRA 账户' },
          ].map(p => (
            <button key={p.n} className="b-card" style={{ padding: 18, textAlign: 'left', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{p.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{p.d}</div>
              <div style={{ color: '#dc2626', fontSize: 12, fontWeight: 600, marginTop: 8 }}>立即申请 →</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="我的活跃业务">
        <table className="b-table">
          <thead><tr><th>编号</th><th>产品</th><th>对手方</th><th>金额</th><th>开立日</th><th>到期日</th><th>剩余天数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { n: 'LC2026-0184', t: 'L/C 即期', c: 'ABC Trading (US)', amt: 'USD 2.8 M', i: '2026-04-12', d: '2026-07-12', s: '已开立', st: 'success' },
              { n: 'LC2026-0192', t: 'L/C 90 天远期', c: 'XYZ GmbH (DE)', amt: 'EUR 1.2 M', i: '2026-05-08', d: '2026-08-08', s: '议付中', st: 'warn' },
              { n: 'BG2026-0042', t: '履约保函', c: '广州港务局', amt: '¥ 28 M', i: '2026-03-20', d: '2027-03-20', s: '生效', st: 'success' },
              { n: 'FO2026-0018', t: '福费廷', c: 'Cathay Pacific', amt: 'USD 1.8 M', i: '2026-05-02', d: '2026-10-30', s: '已融资', st: 'success' },
              { n: 'EXP2026-0084', t: '出口押汇', c: 'Maersk Line', amt: 'USD 980 K', i: '2026-05-25', d: '2026-08-25', s: '审核中', st: 'warn' },
              { n: 'IMP2026-0142', t: '进口押汇', c: '上海铁矿石', amt: 'USD 3.2 M', i: '2026-05-12', d: '2026-08-12', s: '已融资', st: 'success' },
            ].map(r => (
              <tr key={r.n}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.n}</td>
                <td>{r.t}</td>
                <td>{r.c}</td>
                <td style={{ fontWeight: 600 }}>{r.amt}</td>
                <td>{r.i}</td>
                <td>{r.d}</td>
                <td>{Math.floor((new Date(r.d).getTime() - new Date('2026-05-31').getTime()) / 864e5)} 天</td>
                <td><span className={`b-badge b-badge-${r.st}`}>{r.s}</span></td>
                <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>详情</a> · 修改</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="单证状态跟踪（典型 L/C 流程）">
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { l: '开立申请', d: '4/12', ok: true }, { l: '银行开立', d: '4/13', ok: true },
            { l: '通知行确认', d: '4/14', ok: true }, { l: '受益人交单', d: '5/28', ok: true },
            { l: '银行审单', d: '5/29', ok: true }, { l: '议付/承兑', d: '5/30', ok: false, cur: true },
            { l: '付款赎单', d: '—', ok: false }, { l: '客户提货', d: '—', ok: false },
          ].map((s, i, arr) => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: s.ok ? '#22c55e' : s.cur ? '#f59e0b' : '#e2e8f0',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
              }}>{s.ok ? '✓' : s.cur ? '●' : i + 1}</div>
              <div style={{ marginLeft: 8, fontSize: 11 }}>
                <div style={{ fontWeight: s.cur ? 700 : 500 }}>{s.l}</div>
                <div style={{ color: '#94a3b8', fontSize: 10 }}>{s.d}</div>
              </div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: s.ok ? '#22c55e' : '#e2e8f0', margin: '0 6px' }} />}
            </div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 4. TREASURY DESK · FX / 利率 / 商品 套保
// ════════════════════════════════════════════════════════════════════
export function TreasuryDesk() {
  const [pair, setPair] = useState('USD/CNY');
  return (
    <BankingLayout variant="business">
      <Hero title="资金交易台 (Treasury & Hedging)" sub="实时 FX / Forward / Swap / NDF · IRS · 商品套保" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="未平仓敞口 USD" value="USD 18.4 M" sub="↑ 进口订单 8 月集中" />
        <Stat label="已对冲比例" value="64%" sub="政策要求 ≥ 60%" color="#22c55e" />
        <Stat label="本月 FX 损益" value="+¥ 184 K" sub="对冲后净盈" color="#22c55e" />
      </div>

      <div className="b-grid-2">
        <Section title="💱 FX 现货 / 远期交易">
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {['USD/CNY', 'EUR/CNY', 'HKD/CNY', 'JPY/CNY'].map(p => (
              <button key={p} onClick={() => setPair(p)} style={{
                padding: '6px 14px', border: pair === p ? '2px solid #002966' : '1px solid #e2e8f0',
                background: pair === p ? '#eff6ff' : '#fff', borderRadius: 4, cursor: 'pointer',
                fontFamily: 'monospace', fontWeight: 600, fontSize: 12,
              }}>{p}</button>
            ))}
          </div>
          <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{pair} · 实时报价 (Bid / Ask)</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#002966', fontFamily: 'monospace' }}>
              7.1820 <span style={{ color: '#dc2626' }}>/</span> 7.1850
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>价差 3 pips · 您的 RM 折扣 -1 pip</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16, fontSize: 12 }}>
              <div><strong>Spot</strong> 7.1835</div><div><strong>1M Fwd</strong> 7.1782 (-53 pips)</div>
              <div><strong>3M Fwd</strong> 7.1685 (-150 pips)</div><div><strong>6M Fwd</strong> 7.1542 (-293 pips)</div>
              <div><strong>1Y Fwd</strong> 7.1280 (-555 pips)</div><div><strong>NDF (HK) 1Y</strong> 7.1320</div>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 16 }}>询价交易 RFQ</button>
          </div>
        </Section>

        <Section title="🛡 汇率风险对冲建议（AI）">
          <div style={{ background: '#fffbeb', padding: 14, borderRadius: 6, fontSize: 13, color: '#92400e', marginBottom: 14 }}>
            💡 您 8 月有 USD 5M 进口付款，建议立即锁汇：1M Forward 7.1782，相比即期可节省 ¥26,500
          </div>
          <table className="b-table">
            <thead><tr><th>产品</th><th>到期</th><th>名义本金</th><th>执行价</th><th>MTM 损益</th></tr></thead>
            <tbody>
              <tr><td>Forward USD Buy</td><td>2026-08-15</td><td>USD 5 M</td><td>7.1820</td><td className="b-amount-pos">+¥ 142 K</td></tr>
              <tr><td>Call Option USD Buy</td><td>2026-09-30</td><td>USD 2 M</td><td>7.2000</td><td className="b-amount-pos">+¥ 28 K</td></tr>
              <tr><td>CCS USD/CNY 2Y</td><td>2027-12-31</td><td>USD 10 M</td><td>SOFR+50</td><td className="b-amount-pos">+¥ 880 K</td></tr>
              <tr><td>Range Forward</td><td>2026-08-30</td><td>USD 3 M</td><td>7.15-7.25</td><td className="b-amount-neg">-¥ 12 K</td></tr>
            </tbody>
          </table>
        </Section>
      </div>

      <Section title="〽 利率互换 IRS (固息 ↔ 浮息)">
        <div className="b-grid-2">
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>您的浮息贷款总额：¥ 580 M · 当前 LPR 3.95% · 利率上升风险敞口大</div>
            <div className="b-card" style={{ padding: 18, background: '#eff6ff' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>建议：将 60% 浮息转为固息</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>名义本金 ¥348 M · 5 年期 · 收浮 LPR · 付固 3.85%</div>
              <button className="b-btn b-btn-primary">询价 IRS</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={Array.from({ length: 60 }, (_, i) => ({
              m: `M${i}`,
              float: 3.95 + Math.sin(i / 8) * 0.4,
              fixed: 3.85,
            }))}>
              <XAxis dataKey="m" interval={11} fontSize={10} /><YAxis />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Line type="monotone" dataKey="float" name="LPR 浮动利率" stroke="#dc2626" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fixed" name="IRS 锁定 3.85%" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 5. SUPPLY CHAIN FINANCE · 供应链金融
// ════════════════════════════════════════════════════════════════════
export function SupplyChainFinance() {
  return (
    <BankingLayout variant="business">
      <Hero title="供应链金融 (Supply Chain Finance)" sub="核心企业视角 · 上下游 184 家供应商 · 累计放款 ¥3.2 亿" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="供应商数量" value="184 家" sub="↑ 18" />
        <Stat label="经销商数量" value="284 家" sub="↑ 24" />
        <Stat label="融资余额" value="¥ 3.20 亿" sub="↑ 24% MoM" color="#22c55e" />
      </div>

      <div className="b-grid-2">
        <Section title="📥 应收账款融资（反向保理）">
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
            您作为核心企业，确认对供应商的应付账款，供应商可凭确认书向银行申请融资。
          </div>
          <table className="b-table">
            <thead><tr><th>供应商</th><th>应付金额</th><th>到期日</th><th>融资进度</th></tr></thead>
            <tbody>
              <tr><td>上海钢联材料</td><td>¥ 4.2 M</td><td>2026-08-12</td><td><span className="b-badge b-badge-success">✓ 已放款 ¥4.0 M</span></td></tr>
              <tr><td>江苏联东电子</td><td>¥ 2.8 M</td><td>2026-09-04</td><td><span className="b-badge b-badge-warn">⏳ 待您确认</span></td></tr>
              <tr><td>浙江华盾包装</td><td>¥ 1.2 M</td><td>2026-08-22</td><td><span className="b-badge b-badge-success">✓ 已放款 ¥1.15 M</span></td></tr>
              <tr><td>广东智造科技</td><td>¥ 6.4 M</td><td>2026-10-10</td><td><span className="b-badge b-badge-info">— 供应商未申请</span></td></tr>
            </tbody>
          </table>
        </Section>

        <Section title="📤 应付账款融资 (动态贴现 / 票据流转)">
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
            利用您的高信用，延长账期但供应商立即拿到货款；或将银承汇票拆分流转给上游。
          </div>
          <table className="b-table">
            <thead><tr><th>方案</th><th>账期延长</th><th>供应商成本</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>30 天 → 60 天动态贴现</td><td>+30 天</td><td>2.4% 年化</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td>60 天 → 90 天</td><td>+30 天</td><td>2.8% 年化</td><td><span className="b-badge b-badge-warn">招商中</span></td></tr>
              <tr><td>电子银承拆分 (¥10M)</td><td>—</td><td>—</td><td><span className="b-badge b-badge-info">已拆 18 张</span></td></tr>
            </tbody>
          </table>
        </Section>
      </div>

      <Section title="🚚 经销商网络融资">
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
          基于您给下游经销商的提货订单，由银行向经销商提供订单融资 / 库存融资，您仍享受全款回款。
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={[
            { region: '华东', distributors: 84, financed: 1.2, gmv: 4.2 },
            { region: '华南', distributors: 62, financed: 0.8, gmv: 3.1 },
            { region: '华北', distributors: 48, financed: 0.5, gmv: 2.4 },
            { region: '华中', distributors: 32, financed: 0.4, gmv: 1.8 },
            { region: '西南', distributors: 28, financed: 0.2, gmv: 1.2 },
            { region: '东北', distributors: 22, financed: 0.1, gmv: 0.8 },
            { region: '西北', distributors: 8, financed: 0.05, gmv: 0.4 },
          ]}>
            <XAxis dataKey="region" /><YAxis yAxisId="L" /><YAxis yAxisId="R" orientation="right" />
            <Tooltip contentStyle={tipStyle} />
            <Legend />
            <Bar yAxisId="L" dataKey="distributors" name="经销商数" fill="#0891b2" />
            <Bar yAxisId="R" dataKey="financed" name="融资余额(亿)" fill="#22c55e" />
            <Bar yAxisId="R" dataKey="gmv" name="GMV(亿)" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 6. PAYROLL CENTER · 薪资代发
// ════════════════════════════════════════════════════════════════════
export function PayrollCenter() {
  return (
    <BankingLayout variant="business">
      <Hero title="薪资代发中心 (Payroll)" sub="2,840 名员工 · 自动个税 · 自动社保公积金 · HR 系统直连" color="#16a34a" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="本月应发工资" value="¥ 24.80 M" sub="2,840 人 · 平均 ¥8,732" />
        <Stat label="个税代缴" value="¥ 2.40 M" sub="自动申报国税" color="#dc2626" />
        <Stat label="社保公积金" value="¥ 4.68 M" sub="五险一金 + 企业年金" />
      </div>

      <Section title="📅 工资发放流程">
        <table className="b-table">
          <thead><tr><th>月份</th><th>员工数</th><th>应发总额</th><th>实发金额</th><th>个税</th><th>社保</th><th>发放日</th><th>状态</th></tr></thead>
          <tbody>
            {[
              { m: '2026-05', n: 2840, total: '24.80 M', net: '17.72 M', tax: '2.40 M', sb: '4.68 M', d: '5/25', s: '✓ 已发' },
              { m: '2026-04', n: 2832, total: '24.62 M', net: '17.58 M', tax: '2.38 M', sb: '4.66 M', d: '4/25', s: '✓ 已发' },
              { m: '2026-03', n: 2820, total: '24.48 M', net: '17.48 M', tax: '2.34 M', sb: '4.66 M', d: '3/25', s: '✓ 已发' },
              { m: '2026-06', n: 2842, total: '24.94 M', net: '17.82 M', tax: '2.42 M', sb: '4.70 M', d: '6/25', s: '⏳ 待审批' },
            ].map(r => (
              <tr key={r.m}>
                <td style={{ fontWeight: 600 }}>{r.m}</td>
                <td>{r.n.toLocaleString()}</td>
                <td>¥ {r.total}</td>
                <td style={{ fontWeight: 600 }}>¥ {r.net}</td>
                <td>¥ {r.tax}</td>
                <td>¥ {r.sb}</td>
                <td>{r.d}</td>
                <td>{r.s.startsWith('✓') ? <span className="b-badge b-badge-success">{r.s}</span> : <span className="b-badge b-badge-warn">{r.s}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="b-grid-2">
        <Section title="💳 员工福利卡">
          {[
            ['🥗 员工餐补', '¥800/月 · 美团 / 大众点评直充'],
            ['🚌 通勤补贴', '¥600/月 · 滴滴企业版'],
            ['🏥 商业医疗险', '人均 ¥240/年 · 平安保险'],
            ['🎓 学习津贴', '¥3,000/年 · 极客时间 / Udemy'],
            ['🏠 住房补贴', '¥2,000/月 · 直发员工账户'],
            ['🎂 生日礼品', '¥500 元 · 一键发券'],
          ].map(([t, d]) => (
            <div key={t as string} style={{ padding: 12, marginBottom: 6, background: '#f0fdf4', borderRadius: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{d}</div>
            </div>
          ))}
        </Section>
        <Section title="🔄 HR 系统集成">
          <div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>当前已对接：北森 HR Cloud</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>✓ 员工档案自动同步 · ✓ 离职自动停发 · ✓ 调薪审批同步</div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['SAP SuccessFactors', 'Workday', '钉钉', '飞书', '金蝶 K3', '用友 NC', 'Moka', 'i人事'].map(s => (
                <span key={s} className="b-badge b-badge-info" style={{ fontSize: 11 }}>{s}</span>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 7. API BANKING CONSOLE · 开放银行
// ════════════════════════════════════════════════════════════════════
export function ApiBankingConsole() {
  return (
    <BankingLayout variant="business">
      <Hero title="API 银行控制台 (Open Banking)" sub="REST APIs · OAuth 2.0 · Webhooks · 沙盒环境 · 100+ 接口" color="#7c3aed" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="本月 API 调用" value="2.84 M" sub="↑ 18% MoM · 成功率 99.94%" />
        <Stat label="活跃 API Key" value="14 个" sub="生产 6 · 沙盒 8" />
        <Stat label="平均响应时间" value="48 ms" sub="P99 142 ms" color="#22c55e" />
      </div>

      <Section title="🔑 API 密钥管理" extra={<button className="b-btn b-btn-primary">+ 新建 Key</button>}>
        <table className="b-table">
          <thead><tr><th>名称</th><th>Key Prefix</th><th>环境</th><th>权限范围</th><th>创建于</th><th>最近使用</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { n: 'ERP 主集成', k: 'pk_live_8842...', e: 'PROD', s: '账户·支付·查询', c: '2024-08-12', u: '5 分钟前' },
              { n: 'TMS 资金管理', k: 'pk_live_9941...', e: 'PROD', s: '账户·汇率', c: '2025-02-20', u: '12 分钟前' },
              { n: '财务对账系统', k: 'pk_live_0184...', e: 'PROD', s: '只读·交易明细', c: '2025-05-08', u: '今天' },
              { n: '工资代发集成', k: 'pk_live_2284...', e: 'PROD', s: '批量支付', c: '2025-09-10', u: '昨天' },
              { n: '开发测试', k: 'pk_test_4421...', e: 'SANDBOX', s: 'ALL', c: '2026-01-15', u: '今天' },
            ].map(k => (
              <tr key={k.k}>
                <td style={{ fontWeight: 600 }}>{k.n}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{k.k}</td>
                <td><span className={`b-badge ${k.e === 'PROD' ? 'b-badge-warn' : 'b-badge-info'}`}>{k.e}</span></td>
                <td style={{ fontSize: 12 }}>{k.s}</td>
                <td>{k.c}</td>
                <td>{k.u}</td>
                <td style={{ fontSize: 12 }}><a href="#" style={{ color: '#dc2626' }}>查看</a> · <a href="#" style={{ color: '#dc2626' }}>轮换</a> · <a href="#" style={{ color: '#dc2626' }}>禁用</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="b-grid-2">
        <Section title="📊 API 调用量（最近 7 天）">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={[
              { d: '5/25', v: 380, err: 4 }, { d: '5/26', v: 420, err: 6 },
              { d: '5/27', v: 440, err: 2 }, { d: '5/28', v: 462, err: 8 },
              { d: '5/29', v: 480, err: 5 }, { d: '5/30', v: 510, err: 3 }, { d: '5/31', v: 540, err: 4 },
            ]}>
              <XAxis dataKey="d" /><YAxis yAxisId="L" /><YAxis yAxisId="R" orientation="right" />
              <Tooltip contentStyle={tipStyle} />
              <Area yAxisId="L" type="monotone" dataKey="v" name="调用 (K)" stroke="#7c3aed" fill="#ddd6fe" />
              <Line yAxisId="R" type="monotone" dataKey="err" name="错误数" stroke="#dc2626" />
            </AreaChart>
          </ResponsiveContainer>
        </Section>
        <Section title="📖 热门 API 端点">
          <table className="b-table">
            <thead><tr><th>端点</th><th style={{ textAlign: 'right' }}>本月调用</th><th>成功率</th></tr></thead>
            <tbody>
              <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>GET /accounts/balance</td><td style={{ textAlign: 'right' }}>1.84 M</td><td><span className="b-badge b-badge-success">99.98%</span></td></tr>
              <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>POST /payments/domestic</td><td style={{ textAlign: 'right' }}>420 K</td><td><span className="b-badge b-badge-success">99.92%</span></td></tr>
              <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>POST /payments/batch</td><td style={{ textAlign: 'right' }}>148 K</td><td><span className="b-badge b-badge-success">99.95%</span></td></tr>
              <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>GET /fx/rates</td><td style={{ textAlign: 'right' }}>320 K</td><td><span className="b-badge b-badge-success">100%</span></td></tr>
              <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>POST /trade-finance/lc</td><td style={{ textAlign: 'right' }}>184</td><td><span className="b-badge b-badge-success">100%</span></td></tr>
              <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>GET /statements/{`{acct}`}</td><td style={{ textAlign: 'right' }}>92 K</td><td><span className="b-badge b-badge-success">99.96%</span></td></tr>
            </tbody>
          </table>
        </Section>
      </div>

      <Section title="🔄 集成方式">
        <div className="b-grid-3">
          {[
            { i: '🔌', n: 'REST API', d: '标准 JSON · OAuth 2.0', tag: '推荐' },
            { i: '🔄', n: 'Webhook', d: '事件推送 · 收款 / 退款 / 失败', tag: '实时' },
            { i: '🖥', n: 'Host-to-Host', d: 'SFTP · MQ · 主机直联', tag: '大型企业' },
            { i: '🔗', n: 'ERP 适配器', d: 'SAP · Oracle · 金蝶 · 用友', tag: '即插即用' },
            { i: '📱', n: 'SDK', d: 'Java · Python · Node · Go · PHP', tag: '开发友好' },
            { i: '🧪', n: '沙盒环境', d: '模拟数据 · 7×24 可用', tag: '免费' },
          ].map(c => (
            <div key={c.n} className="b-card" style={{ padding: 18 }}>
              <span className="b-badge b-badge-info">{c.tag}</span>
              <div style={{ fontSize: 28, marginTop: 6 }}>{c.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '6px 0' }}>{c.n}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{c.d}</div>
              <button className="b-btn b-btn-ghost" style={{ marginTop: 10, fontSize: 12 }}>查看文档</button>
            </div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// 8. APPROVAL CENTER · 多级审批中心
// ════════════════════════════════════════════════════════════════════
export function ApprovalCenter() {
  const PENDING = [
    { id: 'AP-26-0428', type: '批量付款', desc: '6月供应商付款 248 笔', amt: '¥18.42 M', sub: '张敏', date: '今天 09:42', level: '二级 / 三级', priority: 'high' },
    { id: 'AP-26-0427', type: '工资代发', desc: '2026年6月工资 2,842 人', amt: '¥24.94 M', sub: 'HR 系统', date: '今天 08:30', level: '二级', priority: 'normal' },
    { id: 'AP-26-0426', type: 'L/C 开立', desc: '进口铁矿石 USD 3.2M', amt: 'USD 3.2 M', sub: '李伟', date: '昨天 17:20', level: '一级', priority: 'high' },
    { id: 'AP-26-0425', type: '保函申请', desc: '广州港务局履约保函', amt: '¥28 M', sub: '李伟', date: '昨天 16:00', level: '二级', priority: 'normal' },
    { id: 'AP-26-0424', type: 'FX 交易', desc: 'USD 5M 远期锁汇 8/15', amt: 'USD 5 M', sub: '财务部', date: '昨天 14:30', level: '一级', priority: 'normal' },
    { id: 'AP-26-0423', type: '跨境汇款', desc: '香港子公司增资', amt: 'HKD 8 M', sub: '王晓', date: '昨天 11:00', level: '三级', priority: 'high' },
    { id: 'AP-26-0422', type: '账户开立', desc: '新设青岛分公司基本账户', amt: '—', sub: '行政', date: '5/29', level: '二级', priority: 'low' },
    { id: 'AP-26-0421', type: '新增收款人', desc: '新供应商 4 家', amt: '—', sub: '采购部', date: '5/28', level: '一级', priority: 'low' },
  ];
  return (
    <BankingLayout variant="business">
      <Hero title="审批中心 (Approval Workflow)" sub="待您审批 12 项 · 总金额 ¥84 M · 已超时 0 项" color="#d97706" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="待我审批" value="12" sub="🔴 高优先级 4" color="#dc2626" />
        <Stat label="我已审批 (本月)" value="284" sub="平均耗时 1.8h" color="#22c55e" />
        <Stat label="退回 / 拒绝" value="6" sub="拒绝率 2.1%" />
      </div>

      <Section title="待审批清单" extra={<div style={{ display: 'flex', gap: 6 }}>
        <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>全部</button>
        <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>付款</button>
        <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>贸易</button>
        <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>FX</button>
      </div>}>
        <table className="b-table">
          <thead><tr><th>编号</th><th>类型</th><th>描述</th><th>金额</th><th>提交人</th><th>提交时间</th><th>当前层级</th><th>优先级</th><th>操作</th></tr></thead>
          <tbody>
            {PENDING.map(p => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.id}</td>
                <td><span className="b-badge b-badge-info">{p.type}</span></td>
                <td>{p.desc}</td>
                <td style={{ fontWeight: 700 }}>{p.amt}</td>
                <td>{p.sub}</td>
                <td style={{ fontSize: 11 }}>{p.date}</td>
                <td style={{ fontSize: 11 }}>{p.level}</td>
                <td>
                  <span className="b-badge" style={{
                    background: p.priority === 'high' ? '#fef2f2' : p.priority === 'normal' ? '#fffbeb' : '#f0fdf4',
                    color: p.priority === 'high' ? '#dc2626' : p.priority === 'normal' ? '#d97706' : '#22c55e',
                  }}>{p.priority === 'high' ? '🔴 高' : p.priority === 'normal' ? '🟡 中' : '🟢 低'}</span>
                </td>
                <td style={{ fontSize: 12 }}>
                  <button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>批准</button>
                  <button className="b-btn b-btn-ghost" style={{ fontSize: 11, padding: '4px 10px', marginLeft: 4 }}>退回</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="b-grid-2">
        <Section title="📋 审批流配置">
          <table className="b-table">
            <thead><tr><th>业务类型</th><th>金额区间</th><th>审批层级</th></tr></thead>
            <tbody>
              <tr><td>境内付款</td><td>{'< ¥100K'}</td><td>财务专员（一级）</td></tr>
              <tr><td>境内付款</td><td>¥100K - ¥5M</td><td>财务经理 + CFO（二级）</td></tr>
              <tr><td>境内付款</td><td>{'> ¥5M'}</td><td>CFO + 总裁（三级）</td></tr>
              <tr><td>跨境汇款</td><td>所有</td><td>财务经理 + CFO + 总裁（三级）</td></tr>
              <tr><td>FX 交易</td><td>{'< $1M'}</td><td>财务总监（一级）</td></tr>
              <tr><td>FX 交易</td><td>{'> $1M'}</td><td>CFO + 总裁（二级）</td></tr>
              <tr><td>L/C / 保函</td><td>所有</td><td>财务经理 + 总裁（二级）</td></tr>
            </tbody>
          </table>
        </Section>

        <Section title="🔐 经办 · 复核 · 授权（三权分立）">
          <div style={{ background: '#fef9c3', padding: 14, borderRadius: 6, fontSize: 12, marginBottom: 14 }}>
            <strong>合规要求：</strong>所有交易必须由不同角色完成「经办 → 复核 → 授权」，防止内部欺诈。
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { r: '经办员 (Maker)', n: '张敏 · 李伟 · 王晓 · 等 12 人', d: '录入交易、上传文件' },
              { r: '复核员 (Checker)', n: '李晓东 · 周强 · 等 4 人', d: '审核数据正确性' },
              { r: '授权人 (Authorizer)', n: 'CFO 王志强 · 总裁 陈建华', d: '最终放款授权' },
            ].map(p => (
              <div key={p.r} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.r}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{p.n}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </BankingLayout>
  );
}
