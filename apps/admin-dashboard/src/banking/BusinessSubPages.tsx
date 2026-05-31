/**
 * Business Banking — Focused Sub-Pages
 * ─────────────────────────────────────────────────────────────
 * Each menu sub-item gets its own dedicated page with focused content.
 * Replaces the previous behaviour where all sub-items rendered the same parent page.
 *
 * Modules:
 *   Cash      : CashPooling · VirtualAccount · CashForecast
 *   Payments  : SinglePayment · XBorderPayment · InstantPayment
 *   Trade     : BankGuarantee · TradeCollection · BillDiscount · Forfaiting · Factoring · TradeLoans
 *   SCF       : ScfReceivable · ScfPayable · ScfDistributor
 *   Treasury  : FxHedging · IrsDesk · CommodityHedge
 *   API       : ApiDocs · ErpIntegration · HostToHost
 */
import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BankingLayout from './BankingLayout';

const tipStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 } as const;

const Hero = ({ title, sub, color = '#002966', icon }: { title: string; sub: string; color?: string; icon?: string }) => (
  <div style={{ background: `linear-gradient(120deg, ${color}, #1e3a8a)`, color: '#fff', padding: '28px 32px', borderRadius: 12, marginBottom: 24 }}>
    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{icon} {title}</div>
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
// ▌ CASH MANAGEMENT 子页面
// ════════════════════════════════════════════════════════════════════

// 1. 资金归集（Cash Pooling）
export function CashPooling() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🌊" title="资金归集 (Cash Pooling)" sub="Zero / Target / Notional / Cross-Currency · 4 种归集策略 · 累计节省利息支出 ¥4.8 M" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="归集账户数" value="9 个" sub="含 2 海外账户" />
        <Stat label="本月归集金额" value="¥ 402 M" sub="↑ 18% MoM" color="#22c55e" />
        <Stat label="累计利息节省" value="¥ 4.80 M" sub="YTD · 主账户增值" color="#22c55e" />
      </div>

      <Section title="🏗 我的归集结构 (Pool Topology)">
        <div style={{ fontFamily: 'monospace', fontSize: 13, background: '#f8fafc', padding: 20, borderRadius: 8, lineHeight: 1.8 }}>
          <div>🏛 <strong>主账户：招商局港口 (HQ) — CNY 1100 ··· 0001</strong>     余额 ¥248,400,000</div>
          <div style={{ paddingLeft: 24 }}>└─ <strong>Zero Balance ↓</strong></div>
          <div style={{ paddingLeft: 48 }}>├─ 上海招港物流  — 1100 ··· 0184    余额 ¥0   (日终自动上划)</div>
          <div style={{ paddingLeft: 48 }}>├─ 深圳招港供应链 — 1100 ··· 0220    余额 ¥0   (日终自动上划)</div>
          <div style={{ paddingLeft: 48 }}>└─ 青岛招港码头  — 1100 ··· 0284    余额 ¥0   (日终自动上划)</div>
          <div style={{ paddingLeft: 24, marginTop: 8 }}>└─ <strong>Target Balance ↓ (保留 ¥500K)</strong></div>
          <div style={{ paddingLeft: 48 }}>├─ 招港(BVI)控股 — USD ··· 2284    余额 USD 500K (其余上划至 HQ-USD)</div>
          <div style={{ paddingLeft: 48 }}>└─ 香港招港国际  — HKD 808 ··· 8842 余额 HKD 500K (其余上划至 HQ-USD)</div>
          <div style={{ paddingLeft: 24, marginTop: 8 }}>└─ <strong>Notional Pooling (HK Multi-Currency)</strong></div>
          <div style={{ paddingLeft: 48 }}>├─ HKD 84,000,000  ┐</div>
          <div style={{ paddingLeft: 48 }}>├─ USD  32,400,000  ├─ 名义合并计息 · 资金不动</div>
          <div style={{ paddingLeft: 48 }}>└─ SGD   8,400,000  ┘</div>
        </div>
      </Section>

      <div className="b-grid-2">
        <Section title="⚙ 4 种归集策略详情">
          <table className="b-table">
            <thead><tr><th>策略</th><th>账户数</th><th>本月归集</th><th>触发时间</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td><strong>Zero Balance</strong><div style={{ fontSize: 11, color: '#64748b' }}>子账户全部归零</div></td><td>3</td><td>¥184 M</td><td>每日 23:50</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td><strong>Target Balance</strong><div style={{ fontSize: 11, color: '#64748b' }}>保留目标余额</div></td><td>4</td><td>¥218 M</td><td>每日 23:50</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td><strong>Notional Pooling</strong><div style={{ fontSize: 11, color: '#64748b' }}>名义合并 · 资金不动</div></td><td>2 (HK)</td><td>节省 ¥1.2 M</td><td>实时</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
              <tr><td><strong>Cross-Currency Sweep</strong><div style={{ fontSize: 11, color: '#64748b' }}>USD↔CNY 自动换汇归集</div></td><td>2</td><td>USD 2.4 M</td><td>每日 16:00</td><td><span className="b-badge b-badge-warn">需手工确认</span></td></tr>
            </tbody>
          </table>
        </Section>
        <Section title="📅 最近归集流水">
          <table className="b-table">
            <thead><tr><th>日期</th><th>方向</th><th>金额</th><th>类型</th></tr></thead>
            <tbody>
              {[
                ['2026-05-30 23:50', '上海物流 → HQ', '¥48.20 M', 'ZBA'],
                ['2026-05-30 23:50', '深圳供应链 → HQ', '¥32.40 M', 'ZBA'],
                ['2026-05-30 23:50', '青岛码头 → HQ', '¥18.80 M', 'ZBA'],
                ['2026-05-30 16:00', 'BVI USD → HK', 'USD 1.20 M', 'X-Ccy'],
                ['2026-05-29 23:50', '上海物流 → HQ', '¥52.40 M', 'ZBA'],
                ['2026-05-29 23:50', '青岛 → HQ', '¥22.20 M', 'ZBA'],
              ].map((r, i) => (
                <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td style={{ fontWeight: 600 }}>{r[2]}</td><td><span className="b-badge b-badge-info">{r[3]}</span></td></tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>

      <Section title="➕ 新建归集规则">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="b-form-group"><div className="b-form-label">主账户</div><select className="b-form-input"><option>招商局港口 HQ - CNY 1100 ··· 0001</option></select></div>
          <div className="b-form-group"><div className="b-form-label">归集类型</div><select className="b-form-input"><option>Zero Balance</option><option>Target Balance</option><option>Notional</option><option>Cross-Currency Sweep</option></select></div>
          <div className="b-form-group"><div className="b-form-label">子账户（可多选）</div><select className="b-form-input" multiple style={{ height: 80 }}><option>上海物流</option><option>深圳供应链</option><option>青岛码头</option></select></div>
          <div className="b-form-group"><div className="b-form-label">触发频率</div><select className="b-form-input"><option>每日 23:50</option><option>每小时</option><option>实时</option><option>手工</option></select></div>
        </div>
        <button className="b-btn b-btn-primary">保存并启用</button>
      </Section>
    </BankingLayout>
  );
}

// 2. 虚拟账户 VAM
export function VirtualAccount() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🔢" title="虚拟账户管理 (Virtual Account Management)" sub="1,840 个活跃虚拟账户 · 自动对账 98.4% · 节省财务工时 184 h/月" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="活跃虚拟账户" value="1,840" sub="↑ 184 本月新开" />
        <Stat label="本月收款笔数" value="48,200" sub="自动识别 47,440" color="#22c55e" />
        <Stat label="待识别款项" value="8 笔" sub="¥24K · 待人工分配" color="#f59e0b" />
      </div>

      <Section title="💡 工作原理">
        <div style={{ background: '#eff6ff', padding: 16, borderRadius: 8, fontSize: 13, lineHeight: 1.8 }}>
          <strong>1.</strong> 您为每个客户/项目/经销商 申请一个独立的虚拟账号<br />
          <strong>2.</strong> 客户付款到他自己的虚拟账号（钱真实进入您的<strong>1 个主账户</strong>）<br />
          <strong>3.</strong> 系统自动按虚拟账号 → 识别付款人 → 写入您 ERP 的对应应收科目<br />
          <strong>4.</strong> 月底 0 人工对账，准确率 99%+
        </div>
      </Section>

      <Section title="虚拟账户列表" extra={<button className="b-btn b-btn-primary">+ 新建虚拟账户</button>}>
        <table className="b-table">
          <thead><tr><th>虚拟账号</th><th>关联客户</th><th>用途</th><th style={{ textAlign: 'right' }}>本月入账</th><th>笔数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { v: 'VAM 1100-0001-V0001', c: 'ACME 上海科技', u: '应收账款 (PO 类)', amt: 4_820_000, n: 124 },
              { v: 'VAM 1100-0001-V0002', c: '易达供应链', u: '应收账款', amt: 2_840_000, n: 86 },
              { v: 'VAM 1100-0001-V0003', c: '广东智造', u: '货款', amt: 6_400_000, n: 42 },
              { v: 'VAM 1100-0001-V0184', c: '租户 - 浦东金茂大厦 22F', u: '租金', amt: 380_000, n: 4 },
              { v: 'VAM 1100-0001-V0185', c: '租户 - 静安嘉里中心 18F', u: '租金', amt: 280_000, n: 4 },
              { v: 'VAM 1100-0001-V1842', c: '苏州经销商 A', u: '提货预付', amt: 1_240_000, n: 24 },
            ].map(r => (
              <tr key={r.v}>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r.v}</td>
                <td style={{ fontWeight: 600 }}>{r.c}</td>
                <td><span className="b-badge b-badge-info">{r.u}</span></td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>¥{r.amt.toLocaleString()}</td>
                <td>{r.n}</td>
                <td><span className="b-badge b-badge-success">运行中</span></td>
                <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>明细</a> · 暂停 · 关闭</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="🚨 待识别款项">
        <div style={{ background: '#fffbeb', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: 12, color: '#92400e' }}>
          以下款项未匹配到虚拟账号，请人工分配后写入 ERP
        </div>
        <table className="b-table">
          <thead><tr><th>到账时间</th><th>金额</th><th>付款人</th><th>备注</th><th>建议归类</th><th>操作</th></tr></thead>
          <tbody>
            {[
              ['今天 09:12', '¥ 12,400', '张三', '汇款', '租金 (V0184)?', '确认'],
              ['今天 08:45', '¥ 4,800', '王五', '咨询费', '— 未知 —', '手工分配'],
              ['昨天 17:20', '¥ 2,400', '深圳某公司', '订金', '货款 (V0003)?', '确认'],
              ['昨天 14:30', '¥ 4,200', 'XYZ Co', '余款', '应收 (V0002)?', '确认'],
            ].map((r, i) => (
              <tr key={i}><td>{r[0]}</td><td style={{ fontWeight: 600 }}>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>{r[5]}</button></td></tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 3. 现金流预测
export function CashForecast() {
  const data = Array.from({ length: 13 }, (_, i) => ({
    w: `W${i + 1}`,
    in: 180 + Math.sin(i / 2) * 40 + i * 2,
    out: 140 + Math.cos(i / 2) * 30 + i * 1.5,
    bal: 320 + i * 8,
  }));
  return (
    <BankingLayout variant="business">
      <Hero icon="🔮" title="AI 现金流预测 (Cash Flow Forecast)" sub="13 周滚动 · ML 模型置信度 92% · 提前发现流动性缺口" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="13 周预测期末余额" value="¥ 424 M" sub="↑ +32% vs 当前" color="#22c55e" />
        <Stat label="预测置信度" value="92%" sub="基于过去 36 月数据" />
        <Stat label="最大流动性缺口" value="W7: ¥-18M" sub="2026-07-20 周 · 建议预筹" color="#dc2626" />
      </div>

      <Section title="📊 13 周滚动预测（流入/流出/期末余额）">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <XAxis dataKey="w" /><YAxis />
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => `¥${v.toFixed(0)}M`} />
            <Legend />
            <Area type="monotone" dataKey="in"  name="预计流入" stroke="#22c55e" fill="#bbf7d0" />
            <Area type="monotone" dataKey="out" name="预计流出" stroke="#dc2626" fill="#fecaca" />
            <Line type="monotone" dataKey="bal" name="预计期末余额" stroke="#002966" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      <div className="b-grid-2">
        <Section title="📥 预测流入来源分解">
          <table className="b-table">
            <thead><tr><th>类别</th><th>13 周合计</th><th>占比</th><th>置信度</th></tr></thead>
            <tbody>
              <tr><td>合同回款（已签未收）</td><td>¥ 1,840 M</td><td>62%</td><td><span className="b-badge b-badge-success">98%</span></td></tr>
              <tr><td>到期理财赎回</td><td>¥ 420 M</td><td>14%</td><td><span className="b-badge b-badge-success">100%</span></td></tr>
              <tr><td>政府退税 (出口/增值税)</td><td>¥ 280 M</td><td>9%</td><td><span className="b-badge b-badge-success">95%</span></td></tr>
              <tr><td>新增订单回款 (ML 预测)</td><td>¥ 320 M</td><td>11%</td><td><span className="b-badge b-badge-warn">78%</span></td></tr>
              <tr><td>其他</td><td>¥ 120 M</td><td>4%</td><td><span className="b-badge b-badge-warn">70%</span></td></tr>
            </tbody>
          </table>
        </Section>
        <Section title="📤 预测流出去向分解">
          <table className="b-table">
            <thead><tr><th>类别</th><th>13 周合计</th><th>占比</th><th>置信度</th></tr></thead>
            <tbody>
              <tr><td>供应商付款 (已开 PO)</td><td>¥ 1,240 M</td><td>58%</td><td><span className="b-badge b-badge-success">99%</span></td></tr>
              <tr><td>工资 + 社保</td><td>¥ 380 M</td><td>18%</td><td><span className="b-badge b-badge-success">100%</span></td></tr>
              <tr><td>税费 (增值税 / 所得税)</td><td>¥ 240 M</td><td>11%</td><td><span className="b-badge b-badge-success">98%</span></td></tr>
              <tr><td>贷款利息 + 本金</td><td>¥ 168 M</td><td>8%</td><td><span className="b-badge b-badge-success">100%</span></td></tr>
              <tr><td>其他运营</td><td>¥ 92 M</td><td>5%</td><td><span className="b-badge b-badge-warn">82%</span></td></tr>
            </tbody>
          </table>
        </Section>
      </div>

      <Section title="🤖 AI 建议">
        <div style={{ background: '#fffbeb', padding: 16, borderRadius: 8, fontSize: 13, color: '#92400e' }}>
          <strong>⚠ W7 (2026/7/20-7/26) 预计现金缺口 ¥18M</strong><br /><br />
          <strong>建议方案 1：</strong>提前赎回到期理财（影响收益约 ¥80K）<br />
          <strong>建议方案 2：</strong>使用现有授信额度 ¥80M 临时拆借（成本约 ¥210K/月）<br />
          <strong>建议方案 3：</strong>与 5 大客户协商提前回款（节省融资成本，但影响客户关系）<br /><br />
          <button className="b-btn b-btn-primary">采纳方案 1</button>
          <button className="b-btn b-btn-ghost" style={{ marginLeft: 8 }}>详细对比</button>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ PAYMENTS 子页面
// ════════════════════════════════════════════════════════════════════

// 4. 单笔支付
export function SinglePayment() {
  return (
    <BankingLayout variant="business">
      <Hero icon="⟶" title="单笔支付 (Single Payment)" sub="国内 / 跨境 · 实时到账 · 多级审批 · 支持 12 币种" />

      <Section title="新建支付">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">付款账户</div>
              <select className="b-form-input">
                <option>招行 - 1100 ··· 0001 · CNY · 余额 ¥248,400,000</option>
                <option>招行 - 1100 ··· 0002 · USD · 余额 32,400,000</option>
                <option>HSBC - 808 ··· 8842 · HKD · 余额 84,000,000</option>
              </select>
            </div>
            <div className="b-form-group"><div className="b-form-label">收款人</div>
              <select className="b-form-input">
                <option>+ 新增收款人</option>
                <option>★ 上海 ACME 科技（工行 浦东）— 6225 ···· 0084</option>
                <option>★ 深圳易达供应链（招行 福田）— 6228 ···· 8841</option>
                <option>★ Apple Inc.（Citibank NY）— USD CIT ··· 4421</option>
              </select>
            </div>
            <div className="b-form-group"><div className="b-form-label">金额</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="b-form-input" style={{ width: 100 }}><option>CNY</option><option>USD</option><option>EUR</option><option>HKD</option></select>
                <input className="b-form-input" placeholder="0.00" defaultValue="580,000.00" />
              </div>
            </div>
            <div className="b-form-group"><div className="b-form-label">用途 / 摘要</div>
              <input className="b-form-input" defaultValue="货款 - PO20260601" />
            </div>
            <div className="b-form-group"><div className="b-form-label">付款类型</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <label><input type="radio" name="t" defaultChecked /> 实时到账 (RTP)</label>
                <label><input type="radio" name="t" /> 普通汇款</label>
                <label><input type="radio" name="t" /> 定时支付</label>
              </div>
            </div>
            <div className="b-form-group"><div className="b-form-label">附件（合同 / 发票）</div>
              <button className="b-btn b-btn-ghost" style={{ width: '100%' }}>📎 上传文件</button>
            </div>
          </div>
          <div>
            <div className="b-card" style={{ padding: 20, background: '#f8fafc' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 支付预览</div>
              <table style={{ width: '100%', fontSize: 13 }}>
                <tbody>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>付款</td><td style={{ textAlign: 'right', fontWeight: 600 }}>招商局港口 1100 ··· 0001</td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>收款</td><td style={{ textAlign: 'right', fontWeight: 600 }}>上海 ACME 科技</td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>账号</td><td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 11 }}>6225 ···· 0084</td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>开户行</td><td style={{ textAlign: 'right' }}>工行 上海浦东支行</td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>金额</td><td style={{ textAlign: 'right', fontSize: 20, fontWeight: 800, color: '#dc2626' }}>¥ 580,000.00</td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>手续费</td><td style={{ textAlign: 'right' }}>¥ 0.00 <span style={{ fontSize: 10, color: '#22c55e' }}>(本月免费额度内)</span></td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>预计到账</td><td style={{ textAlign: 'right', color: '#22c55e' }}>实时（&lt; 10 秒）</td></tr>
                  <tr><td style={{ color: '#64748b', padding: '6px 0' }}>审批要求</td><td style={{ textAlign: 'right' }}>财务经理 + CFO（2 级）</td></tr>
                </tbody>
              </table>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 16 }}>提交支付（短信 OTP）</button>
              <button className="b-btn b-btn-ghost" style={{ width: '100%', marginTop: 8 }}>保存为草稿</button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="📜 最近 10 笔支付">
        <table className="b-table">
          <thead><tr><th>编号</th><th>时间</th><th>收款人</th><th>金额</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { i: 'PAY-26-0184', t: '今天 09:14', n: 'Apple Inc.', a: 'USD 24,820', s: '已到账' },
              { i: 'PAY-26-0183', t: '今天 08:42', n: '上海某代理公司', a: '¥ 18,400', s: '已到账' },
              { i: 'PAY-26-0182', t: '昨天 17:30', n: '深圳易达', a: '¥ 1,240,000', s: '已到账' },
              { i: 'PAY-26-0181', t: '昨天 15:00', n: 'Samsung Korea', a: 'KRW 184,000,000', s: '审批中' },
              { i: 'PAY-26-0180', t: '昨天 11:20', n: '广州顺达', a: '¥ 240,000', s: '已到账' },
            ].map(p => (
              <tr key={p.i}>
                <td style={{ fontFamily: 'monospace' }}>{p.i}</td><td>{p.t}</td><td style={{ fontWeight: 600 }}>{p.n}</td>
                <td style={{ fontWeight: 600 }}>{p.a}</td>
                <td><span className={`b-badge ${p.s === '已到账' ? 'b-badge-success' : 'b-badge-warn'}`}>{p.s}</span></td>
                <td style={{ fontSize: 12 }}><a href="#" style={{ color: '#dc2626' }}>回单</a> · 详情</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 5. 跨境支付
export function XBorderPayment() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🌐" title="跨境支付 (Cross-Border Payment)" sub="SWIFT gpi · CIPS · ISO 20022 · mBridge CBDC · 184 国可达" color="#7c3aed" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="本月跨境笔数" value="284" sub="↑ 24%" />
        <Stat label="平均到账时长" value="2.4 小时" sub="SWIFT gpi: 95% < 1 天" color="#22c55e" />
        <Stat label="本月手续费支出" value="¥ 184 K" sub="↓ 8% (CIPS 占比提升)" color="#22c55e" />
      </div>

      <Section title="💡 选择最优清算通道">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '🚀', n: 'SWIFT gpi', d: '188 国 · 跟踪到账 · T+0~T+1', fee: 'USD 15-50', best: '主流货币 / 重要客户' },
            { i: '🇨🇳', n: 'CIPS', d: '人民币国际支付 · 直连 · 实时', fee: '¥ 0-20', best: '人民币跨境' },
            { i: '⛓', n: 'mBridge CBDC', d: '香港/泰国/UAE/中国 · 秒级 · 7×24', fee: '近乎 0', best: '4 国小额高频' },
            { i: '🏠', n: '同业代理行', d: 'HSBC / Citi / DBS · 全球网络', fee: '$10-30', best: '需要 nostro 服务' },
            { i: '💰', n: 'Wise (中介)', d: '小额优势 · 真实中间价', fee: '0.4-0.7%', best: '小额工资 / 个人' },
            { i: '🎯', n: 'SEPA', d: '欧元区 36 国 · 即时 / 普通', fee: '€ 0-5', best: '欧元区' },
          ].map(c => (
            <div key={c.n} className="b-card" style={{ padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{c.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', minHeight: 30 }}>{c.d}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>{c.fee}</span>
                <span className="b-badge b-badge-info">{c.best}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="新建跨境付款">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">付款币种 + 金额</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="b-form-input" style={{ width: 100 }}><option>USD</option><option>EUR</option><option>HKD</option><option>GBP</option><option>JPY</option><option>SGD</option></select>
                <input className="b-form-input" defaultValue="250,000.00" />
              </div>
            </div>
            <div className="b-form-group"><div className="b-form-label">收款人 (Beneficiary)</div><input className="b-form-input" defaultValue="Apple Inc." /></div>
            <div className="b-form-group"><div className="b-form-label">收款行 SWIFT BIC</div><input className="b-form-input" defaultValue="CITIUS33XXX (Citibank N.A. New York)" /></div>
            <div className="b-form-group"><div className="b-form-label">收款账号 (IBAN)</div><input className="b-form-input" defaultValue="US64 CITI 0000 1234 5678 9012" style={{ fontFamily: 'monospace' }} /></div>
            <div className="b-form-group"><div className="b-form-label">清算通道</div>
              <select className="b-form-input"><option>SWIFT gpi (推荐 · T+0)</option><option>SWIFT 普通</option><option>同业代理行 (HSBC)</option></select>
            </div>
            <div className="b-form-group"><div className="b-form-label">手续费承担方</div>
              <select className="b-form-input"><option>OUR - 全部由我方承担</option><option>BEN - 受益人承担</option><option>SHA - 双方分担</option></select>
            </div>
            <div className="b-form-group"><div className="b-form-label">用途代码 (国际收支申报)</div>
              <select className="b-form-input"><option>121010 - 货物贸易</option><option>122010 - 服务贸易</option><option>222 - 投资</option></select>
            </div>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#f8fafc' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 SWIFT MT103 / pacs.008 预览</div>
            <pre style={{ fontSize: 11, fontFamily: 'monospace', background: '#0f172a', color: '#e2e8f0', padding: 14, borderRadius: 6, overflow: 'auto', lineHeight: 1.6 }}>{`{1:F01CMBCCNBSXXXXNNNN}
{2:I103CITIUS33XXXXN}
{4:
:20:PAY-26-0184
:32A:260601USD250000,00
:50K:/1100880100020002
 ZHAOSHANG PORT HOLDINGS
 SHANGHAI, CHINA
:52A:CMBCCNBS
:57A:CITIUS33XXX
:59:/US64CITI000012345678
 APPLE INC.
 CUPERTINO, CA, USA
:70:GOODS PAYMENT PO20260601
:71A:OUR
-}`}</pre>
            <div style={{ marginTop: 14, padding: 12, background: '#dcfce7', borderRadius: 6, fontSize: 12 }}>
              <strong>预计到账：</strong> 2026-06-01 11:42 (Citibank NY 当地时间) · 跟踪号 SWIFT GPI <code>UETR-A7F8E2D9</code>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 14 }}>提交（CFO + 总裁审批）</button>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 6. 实时支付 RTP
export function InstantPayment() {
  return (
    <BankingLayout variant="business">
      <Hero icon="⚡" title="实时支付 RTP (Real-Time Payments)" sub="24/7/365 · &lt; 10 秒到账 · 支持 IBPS / FPS / FedNow / SEPA Instant" color="#f59e0b" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="本月 RTP 笔数" value="18,420" sub="↑ 124% YoY" color="#22c55e" />
        <Stat label="平均到账" value="4.2 秒" sub="P99: 9.8 秒" />
        <Stat label="成功率" value="99.94%" sub="失败自动重试" color="#22c55e" />
      </div>

      <Section title="支持的 RTP 网络">
        <table className="b-table">
          <thead><tr><th>网络</th><th>覆盖</th><th>限额</th><th>开放时间</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td><strong>IBPS</strong> 网联</td><td>🇨🇳 中国境内</td><td>单笔 ¥1M</td><td>24/7</td><td><span className="b-badge b-badge-success">已接入</span></td></tr>
            <tr><td><strong>FPS</strong> Faster Payments</td><td>🇭🇰 香港</td><td>HKD 10M</td><td>24/7</td><td><span className="b-badge b-badge-success">已接入</span></td></tr>
            <tr><td><strong>FedNow</strong></td><td>🇺🇸 美国</td><td>USD 500K</td><td>24/7</td><td><span className="b-badge b-badge-success">已接入</span></td></tr>
            <tr><td><strong>SEPA Instant</strong></td><td>🇪🇺 欧元区 36 国</td><td>EUR 100K</td><td>24/7</td><td><span className="b-badge b-badge-success">已接入</span></td></tr>
            <tr><td><strong>UPI</strong></td><td>🇮🇳 印度</td><td>INR 200K</td><td>24/7</td><td><span className="b-badge b-badge-warn">2026Q3 接入</span></td></tr>
            <tr><td><strong>PIX</strong></td><td>🇧🇷 巴西</td><td>BRL 1M</td><td>24/7</td><td><span className="b-badge b-badge-warn">2026Q4 接入</span></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="🚀 立即发送 RTP">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">收款人手机/账号/邮箱（FPS Proxy）</div><input className="b-form-input" placeholder="如 +852 1234 5678 / acme@example.com" /></div>
            <div className="b-form-group"><div className="b-form-label">金额</div>
              <div style={{ display: 'flex', gap: 8 }}><select className="b-form-input" style={{ width: 100 }}><option>HKD</option><option>USD</option></select><input className="b-form-input" defaultValue="48,200" /></div>
            </div>
            <div className="b-form-group"><div className="b-form-label">附言（中英文 140 字）</div><input className="b-form-input" defaultValue="HK Office Rent - Jun" /></div>
            <button className="b-btn b-btn-primary" style={{ width: '100%' }}>⚡ 立即发送（指纹 / 人脸授权）</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fffbeb', textAlign: 'center' }}>
            <div style={{ fontSize: 64 }}>⚡</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>预计 4 秒到账</div>
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 6 }}>FPS 网络 · 7×24 · 手续费 0</div>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ TRADE FINANCE 子页面
// ════════════════════════════════════════════════════════════════════

// 7. 银行保函
export function BankGuarantee() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🛡" title="银行保函 (Bank Guarantee)" sub="投标 · 履约 · 预付款 · 质量 · 付款保函 · URDG 758 / ISP 98" color="#0e7490" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="保函余额" value="¥ 84 M" sub="8 笔活跃" />
        <Stat label="本月新开" value="3 笔" sub="¥ 12.4 M" color="#22c55e" />
        <Stat label="即将到期 (30 天内)" value="2 笔" sub="¥ 14.2 M · 注意续保" color="#f59e0b" />
      </div>

      <Section title="新开保函">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">保函类型</div>
              <select className="b-form-input">
                <option>🏗 投标保函 (Bid Bond) · 一般 1-5% 标的</option>
                <option>✅ 履约保函 (Performance) · 一般 5-10%</option>
                <option>💰 预付款保函 (Advance Payment) · 一般 100% 预付额</option>
                <option>🔧 质量保函 (Warranty) · 一般 5-10%</option>
                <option>💳 付款保函 (Payment) · 100% 应付金额</option>
                <option>✈ 海关保函 (Customs)</option>
                <option>📦 提货保函 (Shipping Guarantee)</option>
              </select>
            </div>
            <div className="b-form-group"><div className="b-form-label">受益人 (Beneficiary)</div><input className="b-form-input" defaultValue="广州港务局" /></div>
            <div className="b-form-group"><div className="b-form-label">保函金额</div>
              <div style={{ display: 'flex', gap: 8 }}><select className="b-form-input" style={{ width: 100 }}><option>CNY</option><option>USD</option></select><input className="b-form-input" defaultValue="28,000,000" /></div>
            </div>
            <div className="b-form-group"><div className="b-form-label">有效期至</div><input className="b-form-input" type="date" defaultValue="2027-03-20" /></div>
            <div className="b-form-group"><div className="b-form-label">担保规则</div><select className="b-form-input"><option>URDG 758 (国际推荐)</option><option>ISP 98</option><option>中国境内保函条例</option></select></div>
            <div className="b-form-group"><div className="b-form-label">反担保方式</div>
              <select className="b-form-input"><option>保证金 100% (即时开立)</option><option>保证金 30% + 授信额度 70%</option><option>纯授信 (需占用 ¥28M)</option></select>
            </div>
            <button className="b-btn b-btn-primary">提交开立申请</button>
          </div>
          <div className="b-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📜 保函正文预览</div>
            <pre style={{ fontSize: 11, fontFamily: 'monospace', background: '#f8fafc', padding: 14, borderRadius: 6, lineHeight: 1.6, color: '#0f172a', maxHeight: 360, overflow: 'auto' }}>{`PERFORMANCE GUARANTEE
URDG 758

To: 广州港务局
Date: 2026-05-31
GTE No: BG2026-0042

We, BankerOS Bank, irrevocably
undertake to pay to you, upon
your first written demand and
your declaration that the principal
has failed to perform contractually,
an amount not exceeding:

CNY 28,000,000.00
(Twenty Eight Million RMB Only)

For account of:
招商局港口控股有限公司

Under contract:
[XX 港口扩建 工程合同]
Dated: 2026-04-15

This guarantee expires on
2027-03-20.

Subject to URDG 758.

Authorised Signature
BankerOS Bank, Shanghai`}</pre>
          </div>
        </div>
      </Section>

      <Section title="活跃保函">
        <table className="b-table">
          <thead><tr><th>编号</th><th>类型</th><th>受益人</th><th>金额</th><th>开立日</th><th>到期日</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { n: 'BG2026-0042', t: '履约', b: '广州港务局', a: '¥ 28 M', i: '2026-03-20', d: '2027-03-20', s: '生效' },
              { n: 'BG2026-0041', t: '投标', b: '深圳盐田港', a: '¥ 8 M', i: '2026-02-12', d: '2026-08-12', s: '生效' },
              { n: 'BG2026-0040', t: '预付款', b: '中海集运', a: 'USD 1.2 M', i: '2026-01-08', d: '2026-12-08', s: '生效' },
              { n: 'BG2026-0039', t: '质量', b: '上海振华重工', a: '¥ 14.2 M', i: '2025-06-22', d: '2026-06-22', s: '即将到期' },
              { n: 'BG2026-0038', t: '付款', b: 'Maersk Asia', a: 'USD 800 K', i: '2025-12-15', d: '2026-12-15', s: '生效' },
            ].map(r => (
              <tr key={r.n}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.n}</td><td><span className="b-badge b-badge-info">{r.t}</span></td>
                <td>{r.b}</td><td style={{ fontWeight: 600 }}>{r.a}</td><td>{r.i}</td><td>{r.d}</td>
                <td><span className={`b-badge ${r.s === '即将到期' ? 'b-badge-warn' : 'b-badge-success'}`}>{r.s}</span></td>
                <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>正本</a> · 修改 · 退保</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 8. 托收 D/A D/P
export function TradeCollection() {
  return (
    <BankingLayout variant="business">
      <Hero icon="📬" title="跟单托收 (Documentary Collection)" sub="D/P 付款交单 · D/A 承兑交单 · URC 522" color="#0e7490" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="出口托收余额" value="USD 4.2 M" sub="14 笔" />
        <Stat label="进口托收余额" value="USD 2.8 M" sub="8 笔" />
        <Stat label="本月手续费收入" value="¥ 18 K" />
      </div>

      <Section title="D/P vs D/A 对比">
        <div className="b-grid-2">
          <div className="b-card" style={{ padding: 20, background: '#dcfce7' }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>D/P · Documents against Payment</div>
            <div style={{ fontSize: 12, color: '#15803d', marginTop: 6 }}>付款交单 · 进口商必须付款后才能取得单据</div>
            <div style={{ fontSize: 12, marginTop: 14, lineHeight: 1.8 }}>
              ✅ 出口商风险较低<br />
              ⚠ 进口商无信贷支持<br />
              💰 适用：新客户 / 信用一般
            </div>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fef3c7' }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>D/A · Documents against Acceptance</div>
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 6 }}>承兑交单 · 进口商只需承兑汇票即可取得单据，到期再付款</div>
            <div style={{ fontSize: 12, marginTop: 14, lineHeight: 1.8 }}>
              ⚠ 出口商承担信用风险<br />
              ✅ 进口商现金流好<br />
              💰 适用：长期合作伙伴
            </div>
          </div>
        </div>
      </Section>

      <Section title="托收业务清单">
        <table className="b-table">
          <thead><tr><th>编号</th><th>类型</th><th>买卖方</th><th>商品</th><th>金额</th><th>开立日</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>COL-26-018</td><td><span className="b-badge b-badge-success">D/P 出口</span></td><td>BankerOS → US Buyer</td><td>港口机械</td><td>USD 480 K</td><td>2026-05-12</td><td>对方已付款</td></tr>
            <tr><td>COL-26-017</td><td><span className="b-badge b-badge-warn">D/A 出口</span></td><td>BankerOS → DE Buyer</td><td>集装箱配件</td><td>EUR 280 K</td><td>2026-05-08</td><td>已承兑 90 天</td></tr>
            <tr><td>COL-26-016</td><td><span className="b-badge b-badge-success">D/P 进口</span></td><td>JP Seller → BankerOS</td><td>港口起重设备</td><td>USD 1.2 M</td><td>2026-05-02</td><td>已付款交单</td></tr>
            <tr><td>COL-26-015</td><td><span className="b-badge b-badge-warn">D/A 进口</span></td><td>SG Seller → BankerOS</td><td>导航系统</td><td>SGD 380 K</td><td>2026-04-28</td><td>承兑中 (60 天)</td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 9. 票据贴现
export function BillDiscount() {
  return (
    <BankingLayout variant="business">
      <Hero icon="💵" title="票据贴现 (Bill Discount)" sub="银行承兑汇票 / 商业承兑汇票 · 在线议价 · 秒级响应" color="#0e7490" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="可贴现票据" value="¥ 32 M" sub="18 张 · 平均 92 天剩余" />
        <Stat label="本月贴现总额" value="¥ 84 M" sub="↑ 32% MoM" color="#22c55e" />
        <Stat label="当前贴现率" value="2.45%" sub="银承 · 6 月期" />
      </div>

      <Section title="我的票据池" extra={<button className="b-btn b-btn-primary">+ 上传新票</button>}>
        <table className="b-table">
          <thead><tr><th>票号</th><th>类型</th><th>出票人</th><th>承兑行 / 承兑人</th><th>金额</th><th>到期日</th><th>贴现率</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { n: 'BA240501-001', t: '银承', d: '上海某贸易', acc: '工行 上海分行', a: 2_000_000, e: '2026-08-15', r: '2.42%' },
              { n: 'BA240501-002', t: '银承', d: '深圳某科技', acc: '招行 深圳分行', a: 5_000_000, e: '2026-09-30', r: '2.45%' },
              { n: 'CA240520-008', t: '商承', d: '某 AAA 央企', acc: '某央企财司', a: 8_000_000, e: '2026-11-22', r: '3.18%' },
              { n: 'BA240601-022', t: '银承', d: '某地产集团', acc: '建行 北京', a: 4_500_000, e: '2026-10-10', r: '2.85%' },
              { n: 'BA240605-005', t: '银承', d: '某物流公司', acc: '中行 广州', a: 2_800_000, e: '2026-08-28', r: '2.50%' },
            ].map(b => (
              <tr key={b.n}>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{b.n}</td><td><span className={`b-badge b-badge-${b.t === '银承' ? 'success' : 'warn'}`}>{b.t}</span></td>
                <td>{b.d}</td><td>{b.acc}</td><td style={{ fontWeight: 600 }}>¥{b.a.toLocaleString()}</td><td>{b.e}</td>
                <td><strong style={{ color: '#dc2626' }}>{b.r}</strong></td>
                <td style={{ fontSize: 12 }}><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>立即贴现</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="🧮 贴现试算">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">票面金额</div><input className="b-form-input" defaultValue="5,000,000" /></div>
            <div className="b-form-group"><div className="b-form-label">剩余天数</div><input className="b-form-input" defaultValue="120" /></div>
            <div className="b-form-group"><div className="b-form-label">承兑类型</div><select className="b-form-input"><option>银承 (2.45%)</option><option>商承 AAA (3.18%)</option><option>商承 AA+ (3.85%)</option></select></div>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fef2f2' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>贴现利息</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>¥ 40,274</div>
            <div style={{ borderTop: '1px solid #fecaca', marginTop: 16, paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>实收金额</span><span style={{ fontWeight: 700 }}>¥ 4,959,726</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>到账时间</span><span>秒到</span></div>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12 }}>立即贴现</button>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 10. 福费廷
export function Forfaiting() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🔁" title="福费廷 (Forfaiting)" sub="无追索权应收账款融资 · 转移信用 / 国家 / 汇率 / 利率四大风险 · IFA 协会成员" color="#0e7490" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="本月福费廷融资" value="USD 4.8 M" sub="3 笔 · 加权 142 天" />
        <Stat label="平均贴现率" value="SOFR + 280bp" sub="约 7.4%" />
        <Stat label="二级市场转售" value="USD 1.8 M" sub="本月已转售" color="#22c55e" />
      </div>

      <Section title="💡 福费廷适用场景">
        <div style={{ background: '#eff6ff', padding: 16, borderRadius: 8, fontSize: 13, lineHeight: 1.8 }}>
          ✓ 您是<strong>出口商</strong>，在 L/C 项下产生远期应收账款（90/180/360 天）<br />
          ✓ 希望<strong>立即获得</strong>大部分款项（贴现率 = 信用风险 + 国别 + 期限）<br />
          ✓ 不希望应收账款回款不确定影响财务报表<br />
          ✓ 银行<strong>买断</strong>该应收，对您<strong>无追索权</strong>（即使买方违约也不追您）
        </div>
      </Section>

      <Section title="申请福费廷">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">基础 L/C 编号</div><select className="b-form-input"><option>LC2026-0192 · 90 天远期 · EUR 1.2M · XYZ GmbH (DE)</option><option>LC2026-0184 · 即期 · USD 2.8 M</option></select></div>
            <div className="b-form-group"><div className="b-form-label">融资金额</div>
              <div style={{ display: 'flex', gap: 8 }}><select className="b-form-input" style={{ width: 100 }}><option>EUR</option></select><input className="b-form-input" defaultValue="1,200,000" /></div>
            </div>
            <div className="b-form-group"><div className="b-form-label">期限</div><input className="b-form-input" defaultValue="90 天" readOnly /></div>
            <div className="b-form-group"><div className="b-form-label">买方国别</div><input className="b-form-input" defaultValue="🇩🇪 德国 (低风险)" readOnly /></div>
            <div className="b-form-group"><div className="b-form-label">开证行评级</div><input className="b-form-input" defaultValue="Deutsche Bank · AA-" readOnly /></div>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#f8fafc' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>💰 报价</div>
            <table style={{ width: '100%', fontSize: 13 }}>
              <tbody>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>面值</td><td style={{ textAlign: 'right' }}>EUR 1,200,000.00</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>基础利率 (EURIBOR 3M)</td><td style={{ textAlign: 'right' }}>3.42%</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>+ 国别加点 (DE)</td><td style={{ textAlign: 'right' }}>+0.20%</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>+ 银行加点 (DB AA-)</td><td style={{ textAlign: 'right' }}>+0.80%</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>+ 业务利润</td><td style={{ textAlign: 'right' }}>+1.20%</td></tr>
                <tr style={{ borderTop: '1px solid #e2e8f0' }}><td style={{ fontWeight: 700, padding: '8px 0' }}>合计贴现率</td><td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>5.62%</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>贴息总额</td><td style={{ textAlign: 'right' }}>EUR 16,860</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>承诺费 / 选择权费</td><td style={{ textAlign: 'right' }}>EUR 480</td></tr>
                <tr><td style={{ fontWeight: 700, fontSize: 16, color: '#22c55e', padding: '10px 0' }}>实付您</td><td style={{ textAlign: 'right', fontWeight: 700, fontSize: 18, color: '#22c55e' }}>EUR 1,182,660</td></tr>
              </tbody>
            </table>
            <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 14 }}>接受报价并融资</button>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 11. 保理
export function Factoring() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🧾" title="保理 (Factoring)" sub="正向 · 反向 · 池保理 · 国内 / 国际 · GRIF 国际保理规则" color="#0e7490" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="保理余额" value="¥ 1,840 M" sub="184 家供应商 · 1,840 张应收" />
        <Stat label="本月新增" value="¥ 280 M" sub="↑ 22% MoM" color="#22c55e" />
        <Stat label="平均融资率" value="LPR + 80bp" sub="约 4.75%" />
      </div>

      <Section title="3 种保理模式">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '📥', n: '正向保理', d: '您（卖方）将应收转让给银行，银行先付款，到期向买方收款。', use: '出口贸易 / 长账期客户' },
            { i: '🔄', n: '反向保理 (供应链保理)', d: '您（核心买方）确认对供应商的应付，供应商凭此到银行融资。', use: '帮助上游小供应商 · 享您评级' },
            { i: '🌊', n: '池保理 (Bulk)', d: '将一批应收账款打包给银行授信，分批转让，灵活操作。', use: '应收笔数多的核心企业' },
          ].map(p => (
            <div key={p.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{p.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, minHeight: 60 }}>{p.d}</div>
              <span className="b-badge b-badge-info">{p.use}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="活跃保理应收账款">
        <table className="b-table">
          <thead><tr><th>编号</th><th>模式</th><th>核心方</th><th>融资方</th><th>金额</th><th>账期</th><th>融资率</th><th>状态</th></tr></thead>
          <tbody>
            {[
              { i: 'FA-26-018', m: '正向', c: 'BankerOS → DE Buyer', f: 'BankerOS', a: 'EUR 0.8 M', d: '120 天', r: 'EURIBOR+2%', s: '融资中' },
              { i: 'FA-26-017', m: '反向', c: '招商局港口 (买方)', f: '上海钢联 (供应商)', a: '¥ 4.2 M', d: '90 天', r: 'LPR+30bp', s: '已付供应商' },
              { i: 'FA-26-016', m: '反向', c: '招商局港口', f: '江苏联东电子', a: '¥ 2.8 M', d: '60 天', r: 'LPR+50bp', s: '已付' },
              { i: 'FA-26-015', m: '池保理', c: '招商局港口 池', f: 'BankerOS', a: '¥ 80 M', d: '可循环', r: 'LPR+80bp', s: '运行中' },
            ].map(r => (
              <tr key={r.i}>
                <td style={{ fontFamily: 'monospace' }}>{r.i}</td><td><span className="b-badge b-badge-info">{r.m}</span></td>
                <td>{r.c}</td><td>{r.f}</td><td style={{ fontWeight: 600 }}>{r.a}</td><td>{r.d}</td><td>{r.r}</td>
                <td><span className="b-badge b-badge-success">{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 12. 进出口押汇
export function TradeLoans() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🚢" title="进出口押汇 (Trade Loans)" sub="出口押汇 / 进口押汇 / 打包贷款 · 短期贸易融资" color="#0e7490" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="押汇余额" value="USD 8.4 M" sub="12 笔 · 平均期限 105 天" />
        <Stat label="本月新增" value="USD 1.8 M" sub="3 笔" color="#22c55e" />
        <Stat label="加权融资成本" value="SOFR + 180bp" />
      </div>

      <div className="b-grid-2">
        <Section title="📤 出口押汇 (Export Loan)">
          <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 6, fontSize: 12, marginBottom: 14, lineHeight: 1.8 }}>
            <strong>定义：</strong>在 L/C 项下，您（出口商）交单后，银行先垫付货款（折扣面值），到期收回开证行付款。<br />
            <strong>用途：</strong>解决出口商发货后到收汇之间的资金占用。
          </div>
          <table className="b-table">
            <thead><tr><th>编号</th><th>L/C</th><th>金额</th><th>期限</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>EX-26-018</td><td>LC2026-0184</td><td>USD 2.6 M</td><td>90 天</td><td><span className="b-badge b-badge-success">已融资</span></td></tr>
              <tr><td>EX-26-017</td><td>LC2026-0182</td><td>USD 1.2 M</td><td>60 天</td><td><span className="b-badge b-badge-success">已融资</span></td></tr>
              <tr><td>EX-26-016</td><td>LC2026-0180</td><td>EUR 0.8 M</td><td>120 天</td><td><span className="b-badge b-badge-warn">审核中</span></td></tr>
            </tbody>
          </table>
          <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12 }}>+ 新申请出口押汇</button>
        </Section>

        <Section title="📥 进口押汇 (Import Loan)">
          <div style={{ background: '#fffbeb', padding: 14, borderRadius: 6, fontSize: 12, marginBottom: 14, lineHeight: 1.8 }}>
            <strong>定义：</strong>您（进口商）需立即付汇赎单提货但暂无资金，银行先垫付，您在约定期限后还款。<br />
            <strong>用途：</strong>抓住低价采购机会，延长融资期。
          </div>
          <table className="b-table">
            <thead><tr><th>编号</th><th>L/C</th><th>金额</th><th>期限</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>IM-26-014</td><td>LC2026-0190</td><td>USD 3.2 M</td><td>120 天</td><td><span className="b-badge b-badge-success">已融资</span></td></tr>
              <tr><td>IM-26-013</td><td>LC2026-0188</td><td>USD 1.6 M</td><td>90 天</td><td><span className="b-badge b-badge-success">已融资</span></td></tr>
              <tr><td>IM-26-012</td><td>—</td><td>USD 0.8 M</td><td>60 天</td><td><span className="b-badge b-badge-warn">提单担保提货</span></td></tr>
            </tbody>
          </table>
          <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 12 }}>+ 新申请进口押汇</button>
        </Section>
      </div>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ SCF 子页面
// ════════════════════════════════════════════════════════════════════

// 13. SCF 应收账款融资
export function ScfReceivable() {
  return (
    <BankingLayout variant="business">
      <Hero icon="📥" title="应收账款融资 / 反向保理" sub="184 家供应商 · 累计放款 ¥3.2 亿 · 帮助供应商降低融资成本 60%" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="活跃供应商" value="184 家" sub="↑ 18 本月" />
        <Stat label="融资余额" value="¥ 320 M" />
        <Stat label="供应商平均融资率" value="LPR + 80bp" sub="vs 自融 LPR+400bp 节省 80%" color="#22c55e" />
      </div>

      <Section title="🔄 业务流程">
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['📦 供应商发货', '#94a3b8'],
            ['📄 您确认应付账款', '#3b82f6'],
            ['💰 供应商凭确认到银行融资', '#22c55e'],
            ['🏦 银行立即付款给供应商', '#22c55e'],
            ['📅 到期您付款给银行', '#0891b2'],
          ].map(([s, c], i, arr) => (
            <div key={s as string} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, padding: 12, background: c as string, color: '#fff', borderRadius: 6, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{s}</div>
              {i < arr.length - 1 && <div style={{ width: 16, textAlign: 'center', color: '#94a3b8' }}>→</div>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="待您确认的应付账款" extra={<span className="b-badge b-badge-warn">4 笔待确认</span>}>
        <table className="b-table">
          <thead><tr><th>供应商</th><th>PO #</th><th>应付金额</th><th>到期日</th><th>合同 / 发票</th><th>操作</th></tr></thead>
          <tbody>
            {[
              ['江苏联东电子', 'PO-2026-0420', '¥ 2,840,000', '2026-09-04', '✓ 已上传'],
              ['浙江华盾包装', 'PO-2026-0419', '¥ 1,200,000', '2026-08-22', '✓ 已上传'],
              ['福建恒泰物流', 'PO-2026-0418', '¥ 480,000', '2026-08-15', '✓ 已上传'],
              ['广东智造科技', 'PO-2026-0417', '¥ 6,400,000', '2026-10-10', '✓ 已上传'],
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r[0]}</td><td style={{ fontFamily: 'monospace' }}>{r[1]}</td>
                <td style={{ fontWeight: 700 }}>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td>
                <td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>✓ 确认</button> <button className="b-btn b-btn-ghost" style={{ fontSize: 11, padding: '4px 10px', marginLeft: 4 }}>拒绝</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="供应商融资排行">
        <table className="b-table">
          <thead><tr><th>排名</th><th>供应商</th><th>已合作年限</th><th>融资余额</th><th>本年累计</th><th>融资率</th></tr></thead>
          <tbody>
            {[
              { r: 1, n: '上海钢联材料', y: 8, b: '¥ 42 M', t: '¥ 184 M' },
              { r: 2, n: '广东智造科技', y: 5, b: '¥ 28 M', t: '¥ 122 M' },
              { r: 3, n: '江苏联东电子', y: 4, b: '¥ 18 M', t: '¥ 84 M' },
              { r: 4, n: '浙江华盾包装', y: 6, b: '¥ 12 M', t: '¥ 62 M' },
            ].map(s => (
              <tr key={s.r}>
                <td>{s.r}</td><td style={{ fontWeight: 600 }}>{s.n}</td><td>{s.y} 年</td>
                <td style={{ fontWeight: 600 }}>{s.b}</td><td>{s.t}</td><td>LPR+80bp</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 14. SCF 应付账款融资
export function ScfPayable() {
  return (
    <BankingLayout variant="business">
      <Hero icon="📤" title="应付账款融资 / 动态贴现" sub="延长账期但供应商立即拿货款 · 您赚账期收益 · 双赢" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="动态贴现累计" value="¥ 184 M" sub="YTD" />
        <Stat label="账期延长收益" value="¥ 2.4 M" sub="累计获得贴现折扣" color="#22c55e" />
        <Stat label="电子银承余额" value="¥ 28 M" sub="18 张可拆分流转" />
      </div>

      <Section title="💡 动态贴现 (Dynamic Discounting)">
        <div style={{ background: '#eff6ff', padding: 16, borderRadius: 8, fontSize: 13, lineHeight: 1.8 }}>
          <strong>原理：</strong>您原本 60 天付款，供应商如果想提前到 30 天拿款，需向您支付一笔贴现费（约 1-2%）。<br />
          <strong>结果：</strong>您赚到这笔贴现费 vs 把钱放在活期账户（息差 ~3% 年化），<strong>实际收益率 ~12% 年化</strong>。<br />
          <strong>对供应商：</strong>提前拿款，避免找银行借（节省 4-8% 融资成本）。
        </div>
      </Section>

      <Section title="动态贴现方案">
        <table className="b-table">
          <thead><tr><th>供应商</th><th>原账期</th><th>可提前到</th><th>贴现率</th><th>本月节省</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>上海钢联</td><td>60 天</td><td>15-45 天可选</td><td>0.05% / 天</td><td>¥ 38K (帮您赚到)</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
            <tr><td>江苏联东</td><td>90 天</td><td>30-60 天可选</td><td>0.06% / 天</td><td>¥ 24K</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
            <tr><td>浙江华盾</td><td>60 天</td><td>15-45 天可选</td><td>0.05% / 天</td><td>¥ 12K</td><td><span className="b-badge b-badge-success">运行中</span></td></tr>
            <tr><td>广东智造</td><td>90 天</td><td>30-60 天</td><td>0.07% / 天</td><td>¥ 0</td><td><span className="b-badge b-badge-warn">招商中</span></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="📜 电子银承票据流转">
        <div style={{ background: '#fffbeb', padding: 14, borderRadius: 6, marginBottom: 14, fontSize: 12, lineHeight: 1.8 }}>
          您持有的银行承兑汇票可在线<strong>拆分、背书、流转</strong>给上游供应商，无需现金支付。
        </div>
        <table className="b-table">
          <thead><tr><th>票号</th><th>面值</th><th>承兑行</th><th>到期日</th><th>当前持有 / 已拆分</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>BA240501-001</td><td>¥ 2.0 M</td><td>工行 上海分行</td><td>2026-08-15</td><td>剩余 ¥ 1.6 M / 拆出 ¥0.4 M</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>拆分流转</button></td></tr>
            <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>BA240501-002</td><td>¥ 5.0 M</td><td>招行 深圳分行</td><td>2026-09-30</td><td>剩余 ¥ 2.4 M / 拆出 ¥2.6 M</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>拆分流转</button></td></tr>
            <tr><td style={{ fontFamily: 'monospace', fontSize: 11 }}>BA240601-022</td><td>¥ 4.5 M</td><td>建行 北京</td><td>2026-10-10</td><td>剩余 ¥ 4.5 M / 未拆</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>拆分流转</button></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 15. SCF 经销商网络
export function ScfDistributor() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🚚" title="经销商网络融资 (Distributor Finance)" sub="284 家经销商 · 订单融资 + 库存融资 · 加速回款" color="#0891b2" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="经销商数量" value="284 家" sub="覆盖 7 大区域" />
        <Stat label="订单融资余额" value="¥ 240 M" />
        <Stat label="库存融资余额" value="¥ 80 M" sub="质押在银行监管仓" />
      </div>

      <Section title="🚛 区域经销商分布与融资">
        <ResponsiveContainer width="100%" height={280}>
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

      <Section title="经销商订单融资 (Order Finance)">
        <div style={{ background: '#eff6ff', padding: 12, borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
          经销商凭您的提货订单，银行预付 70-80% 给您，经销商分期还款给银行
        </div>
        <table className="b-table">
          <thead><tr><th>经销商</th><th>区域</th><th>订单金额</th><th>融资比例</th><th>已放款</th><th>还款期</th></tr></thead>
          <tbody>
            <tr><td>苏州东港物流</td><td>华东</td><td>¥ 4.2 M</td><td>80%</td><td>¥ 3.36 M</td><td>90 天</td></tr>
            <tr><td>佛山顺德机械</td><td>华南</td><td>¥ 2.8 M</td><td>75%</td><td>¥ 2.10 M</td><td>60 天</td></tr>
            <tr><td>武汉中部物流</td><td>华中</td><td>¥ 1.6 M</td><td>80%</td><td>¥ 1.28 M</td><td>90 天</td></tr>
            <tr><td>沈阳东北港务</td><td>东北</td><td>¥ 0.8 M</td><td>70%</td><td>¥ 0.56 M</td><td>60 天</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="📦 库存融资（监管仓 / 浮动质押）">
        <div className="b-grid-3">
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>📦 静态质押</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>固定货物 · 银行监管仓 · 凭仓单融资</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginTop: 10 }}>¥ 48 M</div>
          </div>
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>🔄 动态质押</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>货物可流转 · 维持最低质押率</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginTop: 10 }}>¥ 28 M</div>
          </div>
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>🚢 在途质押</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>海运 / 陆运在途货物质押</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginTop: 10 }}>¥ 4 M</div>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ TREASURY 子页面
// ════════════════════════════════════════════════════════════════════

// 16. FX 汇率锁定
export function FxHedging() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🛡" title="汇率锁定 / 套保 (FX Hedging)" sub="远期 / 期权 / 区间远期 / NDF · 4 大对冲工具" color="#ec4899" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="未平仓敞口 USD" value="USD 18.4 M" />
        <Stat label="已对冲" value="USD 11.8 M" sub="对冲率 64%" color="#22c55e" />
        <Stat label="未对冲风险敞口" value="USD 6.6 M" sub="若贬值 1% 损失 ¥473K" color="#f59e0b" />
      </div>

      <Section title="4 种主流对冲工具对比">
        <table className="b-table">
          <thead><tr><th>工具</th><th>定价</th><th>最大收益</th><th>最大损失</th><th>适合场景</th></tr></thead>
          <tbody>
            <tr><td><strong>Forward 远期</strong></td><td>0 (锁定汇率)</td><td>固定 (锁定值)</td><td>无 (锁定值)</td><td>确定的未来收付</td></tr>
            <tr><td><strong>Call/Put Option 期权</strong></td><td>1.5-3% (期权费)</td><td>无限 (放弃执行)</td><td>期权费</td><td>不确定但需保底</td></tr>
            <tr><td><strong>Range Forward 区间远期</strong></td><td>0 (零成本)</td><td>有上限</td><td>有下限</td><td>方向不确定 · 容忍区间</td></tr>
            <tr><td><strong>NDF 无本金交割</strong></td><td>0</td><td>固定</td><td>固定</td><td>受限货币 (CNH/INR/KRW)</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="活跃对冲头寸">
        <table className="b-table">
          <thead><tr><th>编号</th><th>工具</th><th>到期</th><th>名义本金</th><th>执行价</th><th>市场价</th><th>MTM 损益</th></tr></thead>
          <tbody>
            <tr><td>HEDGE-001</td><td>Fwd USD Buy</td><td>2026-08-15</td><td>USD 5 M</td><td>7.1820</td><td>7.1835</td><td className="b-amount-pos">+¥ 142 K</td></tr>
            <tr><td>HEDGE-002</td><td>Call Opt USD</td><td>2026-09-30</td><td>USD 2 M</td><td>7.2000</td><td>7.1835</td><td className="b-amount-pos">+¥ 28 K</td></tr>
            <tr><td>HEDGE-003</td><td>CCS USD/CNY 2Y</td><td>2027-12-31</td><td>USD 10 M</td><td>SOFR+50</td><td>SOFR+45</td><td className="b-amount-pos">+¥ 880 K</td></tr>
            <tr><td>HEDGE-004</td><td>Range Fwd</td><td>2026-08-30</td><td>USD 3 M</td><td>7.15-7.25</td><td>7.1835</td><td className="b-amount-neg">-¥ 12 K</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="🆕 立即询价 (RFQ)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">对冲方向</div><select className="b-form-input"><option>买入 USD (我支付外币)</option><option>卖出 USD (我收外币)</option></select></div>
            <div className="b-form-group"><div className="b-form-label">工具</div><select className="b-form-input"><option>Forward</option><option>Call Option</option><option>Put Option</option><option>Range Forward</option><option>NDF</option></select></div>
            <div className="b-form-group"><div className="b-form-label">名义本金</div>
              <div style={{ display: 'flex', gap: 8 }}><select className="b-form-input" style={{ width: 100 }}><option>USD</option><option>EUR</option><option>JPY</option></select><input className="b-form-input" defaultValue="5,000,000" /></div>
            </div>
            <div className="b-form-group"><div className="b-form-label">到期日</div><input type="date" className="b-form-input" defaultValue="2026-08-15" /></div>
            <button className="b-btn b-btn-primary" style={{ width: '100%' }}>📞 询价 RFQ (10 秒响应)</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fdf2f8' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>💰 报价（示例）</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>USD 5M · 2026-08-15 · Forward Buy</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 12, color: '#ec4899' }}>7.1782</div>
            <div style={{ fontSize: 12 }}>vs 即期 7.1835 = <strong style={{ color: '#22c55e' }}>节省 ¥26,500</strong></div>
            <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 14, background: '#ec4899' }}>✓ 接受报价</button>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 17. 利率互换 IRS
export function IrsDesk() {
  return (
    <BankingLayout variant="business">
      <Hero icon="〽" title="利率互换 IRS (Interest Rate Swap)" sub="固息 ↔ 浮息 · LPR / SOFR / EURIBOR · 利率风险对冲" color="#ec4899" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="浮息贷款敞口" value="¥ 580 M" sub="LPR 浮动" color="#f59e0b" />
        <Stat label="已锁定 IRS" value="¥ 348 M" sub="占比 60%" color="#22c55e" />
        <Stat label="本月 MTM 盈亏" value="+¥ 184 K" color="#22c55e" />
      </div>

      <Section title="💡 IRS 工作原理">
        <div style={{ background: '#fdf2f8', padding: 16, borderRadius: 8, fontSize: 13, lineHeight: 1.8 }}>
          您贷款 ¥348M 按 LPR 浮动付息（当前 3.95%）。担心未来利率上行。<br />
          → 与银行签 5 年 IRS：您<strong>收 LPR、付固定 3.85%</strong>。<br />
          → 您贷款的浮息成本被对冲掉，实际成本锁定为 <strong>3.85%</strong>。<br />
          → LPR 涨到 5%？您从 IRS 多收 1.15%，刚好抵消贷款多付 1.15%。
        </div>
      </Section>

      <Section title="IRS 头寸">
        <table className="b-table">
          <thead><tr><th>编号</th><th>名义本金</th><th>期限</th><th>收</th><th>付</th><th>起息</th><th>MTM</th></tr></thead>
          <tbody>
            <tr><td>IRS-001</td><td>¥ 200 M</td><td>5 年</td><td>LPR</td><td>3.85%</td><td>2025-12-01</td><td className="b-amount-pos">+¥ 124 K</td></tr>
            <tr><td>IRS-002</td><td>¥ 100 M</td><td>3 年</td><td>LPR</td><td>3.78%</td><td>2026-01-15</td><td className="b-amount-pos">+¥ 38 K</td></tr>
            <tr><td>IRS-003</td><td>¥ 48 M</td><td>2 年</td><td>LPR</td><td>3.72%</td><td>2026-03-20</td><td className="b-amount-pos">+¥ 22 K</td></tr>
            <tr><td>IRS-USD-001</td><td>USD 20 M</td><td>5 年</td><td>SOFR</td><td>4.80%</td><td>2025-08-10</td><td className="b-amount-pos">+¥ 880 K</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="📈 LPR vs 锁定 3.85% 对比">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={Array.from({ length: 60 }, (_, i) => ({ m: `M${i}`, float: 3.95 + Math.sin(i / 8) * 0.4, fixed: 3.85 }))}>
            <XAxis dataKey="m" interval={11} fontSize={10} /><YAxis />
            <Tooltip contentStyle={tipStyle} formatter={(v: any) => `${v.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="float" name="LPR 浮动" stroke="#dc2626" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fixed" name="IRS 锁定 3.85%" stroke="#22c55e" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Section>
    </BankingLayout>
  );
}

// 18. 大宗商品套保
export function CommodityHedge() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🛢" title="大宗商品套保 (Commodity Hedging)" sub="原油 · 铜铝 · 铁矿石 · 大豆 · 黄金 · CFTC/SHFE 双市场" color="#ec4899" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="商品敞口名义" value="¥ 1,840 M" sub="燃油 + 铁矿石" />
        <Stat label="已套保比例" value="58%" sub="政策要求 ≥ 50%" color="#22c55e" />
        <Stat label="本月套保盈亏" value="+¥ 4.2 M" sub="抵消现货波动" color="#22c55e" />
      </div>

      <Section title="主要套保商品">
        <table className="b-table">
          <thead><tr><th>商品</th><th>用途</th><th>年用量</th><th>当前价</th><th>套保仓位</th><th>套保比例</th></tr></thead>
          <tbody>
            <tr><td>🛢 燃料油 (船用)</td><td>港口船队</td><td>120 万吨</td><td>USD 480/桶</td><td>多头 60 万桶</td><td>50%</td></tr>
            <tr><td>⛓ 铁矿石</td><td>港口装卸 / 加工</td><td>800 万吨</td><td>USD 110/吨</td><td>多头 500 万吨</td><td>62%</td></tr>
            <tr><td>🥇 黄金 (储备资产)</td><td>财务储备</td><td>—</td><td>USD 2,640/oz</td><td>多头 1,200 oz</td><td>—</td></tr>
            <tr><td>🔋 铜</td><td>电缆 / 设备</td><td>2 万吨</td><td>USD 9,800/吨</td><td>多头 1.2 万吨</td><td>60%</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="活跃合约">
        <table className="b-table">
          <thead><tr><th>编号</th><th>商品</th><th>交易所</th><th>方向</th><th>数量</th><th>开仓价</th><th>当前价</th><th>盈亏</th></tr></thead>
          <tbody>
            <tr><td>CM-001</td><td>SC 上海原油</td><td>SHFE</td><td>买入 (套保)</td><td>200 手 (20 万桶)</td><td>¥ 540</td><td>¥ 562</td><td className="b-amount-pos">+¥ 4.4 M</td></tr>
            <tr><td>CM-002</td><td>IO 铁矿石</td><td>SGX</td><td>买入 (套保)</td><td>500 万吨</td><td>USD 108</td><td>USD 110</td><td className="b-amount-pos">+USD 1.0 M</td></tr>
            <tr><td>CM-003</td><td>CU 铜</td><td>SHFE</td><td>买入 (套保)</td><td>240 手 (1200 吨)</td><td>¥ 68,400</td><td>¥ 69,200</td><td className="b-amount-pos">+¥ 960 K</td></tr>
            <tr><td>CM-004</td><td>AU 黄金</td><td>SHFE</td><td>买入 (储备)</td><td>40 手</td><td>¥ 580/克</td><td>¥ 612/克</td><td className="b-amount-pos">+¥ 128 K</td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ API BANKING 子页面
// ════════════════════════════════════════════════════════════════════

// 19. API 文档
export function ApiDocs() {
  const [active, setActive] = useState('accounts');
  const ENDPOINTS: Record<string, any[]> = {
    accounts: [
      { m: 'GET', p: '/v1/accounts', d: '列出所有账户' },
      { m: 'GET', p: '/v1/accounts/{id}/balance', d: '查询账户余额' },
      { m: 'GET', p: '/v1/accounts/{id}/transactions', d: '查询交易明细' },
      { m: 'GET', p: '/v1/accounts/{id}/statements', d: '下载对账单' },
    ],
    payments: [
      { m: 'POST', p: '/v1/payments/domestic', d: '境内单笔支付' },
      { m: 'POST', p: '/v1/payments/cross-border', d: '跨境 SWIFT' },
      { m: 'POST', p: '/v1/payments/batch', d: '批量支付（最多 10K 笔）' },
      { m: 'POST', p: '/v1/payments/rtp', d: '实时支付 RTP' },
      { m: 'GET', p: '/v1/payments/{id}', d: '支付状态查询' },
    ],
    fx: [
      { m: 'GET', p: '/v1/fx/rates', d: '12 货币对实时牌价' },
      { m: 'POST', p: '/v1/fx/spot', d: '即期换汇' },
      { m: 'POST', p: '/v1/fx/forward', d: '远期换汇' },
      { m: 'POST', p: '/v1/fx/rfq', d: '询价 RFQ' },
    ],
    trade: [
      { m: 'POST', p: '/v1/trade-finance/lc', d: '开立 L/C' },
      { m: 'POST', p: '/v1/trade-finance/guarantee', d: '开立保函' },
      { m: 'GET', p: '/v1/trade-finance/lc/{id}/status', d: 'L/C 状态' },
    ],
  };

  return (
    <BankingLayout variant="business">
      <Hero icon="📖" title="API 文档 (Developer Docs)" sub="REST · OAuth 2.0 · OpenAPI 3.0 · 100+ 接口 · 7 SDK" color="#7c3aed" />

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
        <div className="b-card" style={{ padding: 12, height: 'fit-content' }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', padding: 6 }}>API 分类</div>
          {[['accounts', '账户 Accounts'], ['payments', '支付 Payments'], ['fx', '外汇 FX'], ['trade', '贸易 Trade']].map(([k, l]) => (
            <button key={k} onClick={() => setActive(k as string)}
              style={{
                display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left',
                background: active === k ? '#7c3aed' : 'transparent',
                color: active === k ? '#fff' : '#0f172a',
                border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: active === k ? 700 : 500,
              }}>
              {l}
            </button>
          ))}
        </div>
        <div>
          <Section title={`${active.toUpperCase()} API 端点`}>
            <table className="b-table">
              <thead><tr><th>方法</th><th>端点</th><th>描述</th><th>试用</th></tr></thead>
              <tbody>
                {ENDPOINTS[active].map((e, i) => (
                  <tr key={i}>
                    <td><span className="b-badge" style={{ background: e.m === 'GET' ? '#dcfce7' : '#dbeafe', color: e.m === 'GET' ? '#15803d' : '#1d4ed8', fontFamily: 'monospace' }}>{e.m}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.p}</td>
                    <td>{e.d}</td>
                    <td><button className="b-btn b-btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>🧪 试用</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="🧪 示例：查询账户余额">
            <pre style={{ fontSize: 12, fontFamily: 'monospace', background: '#0f172a', color: '#e2e8f0', padding: 16, borderRadius: 6, overflow: 'auto', lineHeight: 1.6 }}>{`curl -X GET https://api.bankeros.com/v1/accounts/ACC_8801_0001/balance \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "X-Idempotency-Key: $(uuidgen)"

# Response (200 OK)
{
  "account_id": "ACC_8801_0001",
  "currency": "CNY",
  "balance": "248400000.00",
  "available": "248400000.00",
  "last_updated": "2026-05-31T09:42:18+08:00"
}`}</pre>
          </Section>

          <Section title="📚 SDK">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Java', 'Python', 'Node.js', 'Go', 'PHP', 'C# .NET', 'Ruby'].map(s => (
                <button key={s} className="b-btn b-btn-ghost">{s} SDK ⬇</button>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </BankingLayout>
  );
}

// 20. ERP 集成
export function ErpIntegration() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🔄" title="ERP 直连 (ERP Integration)" sub="SAP / Oracle / 金蝶 / 用友 · 即插即用适配器 · 2-4 周上线" color="#7c3aed" />

      <Section title="支持的 ERP 系统">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { l: 'SAP S/4HANA', s: '✓ 生产', desc: 'FI / TR / CO 模块直连 · IDoc + REST' },
            { l: 'SAP ECC 6.0', s: '✓ 生产', desc: '经典版本 · BAPI / RFC' },
            { l: 'Oracle Fusion', s: '✓ 生产', desc: 'AR / AP / GL 直连 · BIP 报表' },
            { l: 'Oracle EBS', s: '✓ 生产', desc: 'iByte 集成' },
            { l: '金蝶 EAS / 云星空', s: '✓ 生产', desc: '财务 + 资金管理对接' },
            { l: '用友 NC / U8', s: '✓ 生产', desc: '账户对账 · 自动凭证' },
            { l: 'Workday', s: '○ Beta', desc: '工资代发 · HR' },
            { l: 'Microsoft Dynamics 365', s: '○ Beta', desc: 'F&O 模块' },
            { l: '自定义 ERP', s: '✓ 通用', desc: '通过 REST API + Webhook' },
          ].map(e => (
            <div key={e.l} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{e.l}</div>
              <span className={`b-badge ${e.s.startsWith('✓') ? 'b-badge-success' : 'b-badge-warn'}`}>{e.s}</span>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="我的 ERP 集成">
        <table className="b-table">
          <thead><tr><th>系统</th><th>版本</th><th>连接方式</th><th>同步频率</th><th>最近同步</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>SAP S/4HANA</td><td>2022 FPS01</td><td>REST + IDoc</td><td>实时</td><td>5 分钟前</td><td><span className="b-badge b-badge-success">✓ 健康</span></td></tr>
            <tr><td>金蝶云星空 (子公司)</td><td>v8.2</td><td>REST API</td><td>每 15 分钟</td><td>8 分钟前</td><td><span className="b-badge b-badge-success">✓ 健康</span></td></tr>
            <tr><td>北森 HR Cloud</td><td>v3.0</td><td>SCIM API</td><td>每日 00:00</td><td>昨天</td><td><span className="b-badge b-badge-success">✓ 健康</span></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="🔄 同步的数据流">
        <div className="b-grid-2">
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>📥 银行 → ERP</div>
            <ul style={{ marginTop: 10, paddingLeft: 20, fontSize: 12, lineHeight: 1.8 }}>
              <li>账户余额（实时）</li>
              <li>交易明细（实时）</li>
              <li>对账单（每日 23:30）</li>
              <li>汇率（每小时）</li>
              <li>付款回执（实时 Webhook）</li>
            </ul>
          </div>
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>📤 ERP → 银行</div>
            <ul style={{ marginTop: 10, paddingLeft: 20, fontSize: 12, lineHeight: 1.8 }}>
              <li>付款指令（实时）</li>
              <li>批量付款文件（每日 14:00）</li>
              <li>工资代发文件（每月 25 日）</li>
              <li>FX 询价（实时）</li>
              <li>L/C / 保函申请（实时）</li>
            </ul>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 21. Host-to-Host
export function HostToHost() {
  return (
    <BankingLayout variant="business">
      <Hero icon="🖥" title="Host-to-Host (H2H) 主机直联" sub="SFTP · MQ · ISO 20022 XML · 大型企业首选 · 7×24 自动化" color="#7c3aed" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="每日文件传输" value="184 个" sub="入站 84 · 出站 100" />
        <Stat label="日均交易量" value="¥ 4.2 亿" sub="工资 · 付款 · 对账" />
        <Stat label="成功率" value="99.98%" sub="SLA 99.95%" color="#22c55e" />
      </div>

      <Section title="🔌 连接方式">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '📁', n: 'SFTP', d: '加密文件传输 · 标准协议', port: 'sftp.bankeros.com:22' },
            { i: '📨', n: 'IBM MQ', d: '可靠消息队列 · 银行级', port: 'mq.bankeros.com:1414' },
            { i: '🔗', n: 'AS2 / AS4', d: 'EDI 加密消息', port: 'as2.bankeros.com:443' },
            { i: '📞', n: 'SWIFT FileAct', d: 'SWIFT 网络文件传输', port: 'SWIFT BIC' },
            { i: '⚡', n: 'Webhook (HTTPS)', d: '事件推送', port: 'your-endpoint.com' },
            { i: '🔄', n: 'API Polling', d: '定时拉取', port: 'api.bankeros.com' },
          ].map(c => (
            <div key={c.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{c.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{c.d}</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', marginTop: 8, color: '#dc2626' }}>{c.port}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📋 支持的文件格式">
        <table className="b-table">
          <thead><tr><th>方向</th><th>格式</th><th>用途</th><th>调度</th></tr></thead>
          <tbody>
            <tr><td>📤 上传</td><td>ISO 20022 <code>pain.001</code></td><td>付款指令 (Customer Credit Transfer Initiation)</td><td>实时 / 每日</td></tr>
            <tr><td>📤 上传</td><td>CSV / Excel</td><td>批量付款文件</td><td>每日 14:00</td></tr>
            <tr><td>📤 上传</td><td>ISO 20022 <code>pacs.008</code></td><td>SWIFT 跨境支付</td><td>实时</td></tr>
            <tr><td>📥 下载</td><td>ISO 20022 <code>camt.053</code></td><td>每日对账单</td><td>每日 23:30</td></tr>
            <tr><td>📥 下载</td><td>ISO 20022 <code>camt.054</code></td><td>实时收付通知</td><td>实时</td></tr>
            <tr><td>📥 下载</td><td>ISO 20022 <code>pain.002</code></td><td>付款状态报告</td><td>实时</td></tr>
            <tr><td>📤📥</td><td>SWIFT MT940 / 942</td><td>SWIFT 兼容（兼容 ISO）</td><td>每日</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="📊 文件传输监控">
        <table className="b-table">
          <thead><tr><th>时间</th><th>方向</th><th>文件名</th><th>大小</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>今天 09:42</td><td>📥</td><td><code>camt054_20260531_094200.xml</code></td><td>248 KB</td><td><span className="b-badge b-badge-success">✓ 成功</span></td></tr>
            <tr><td>今天 09:00</td><td>📤</td><td><code>pain001_BATCH_20260531_001.xml</code></td><td>1.8 MB</td><td><span className="b-badge b-badge-success">✓ 已处理 248 笔</span></td></tr>
            <tr><td>今天 08:00</td><td>📤</td><td><code>payroll_20260601.csv</code></td><td>820 KB</td><td><span className="b-badge b-badge-warn">⏳ 审批中</span></td></tr>
            <tr><td>昨天 23:30</td><td>📥</td><td><code>camt053_20260530.xml</code></td><td>4.2 MB</td><td><span className="b-badge b-badge-success">✓ 对账完成</span></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}
