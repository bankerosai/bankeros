/**
 * Personal Online Banking — Focused Sub-Pages
 * Each menu sub-item gets its own dedicated focused page.
 * Modeled after HSBC One, CMB App, ICBC e-Life, BOC.
 *
 * Modules:
 *   Accounts: PayeesManager
 *   Cards   : CardBills · CardRewards · CardInstalment · DebitCards · CardIssue
 *   Wealth  : FundsCenter · WmProducts · StructuredProducts · InsuranceCenter · PreciousMetals · RoboAdvisor
 *   FX      : GlobalAccount · OverseasRemittance · FxRatesAlerts
 *   Loans   : MortgageCenter · ConsumerLoan · AutoLoan · LoanCalculator
 *   Pay     : TravelHotel · DiningReservation
 */
import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BankingLayout from './BankingLayout';

const tip = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 } as const;

const Hero = ({ title, sub, color = '#dc2626', icon }: { title: string; sub: string; color?: string; icon?: string }) => (
  <div style={{ background: `linear-gradient(120deg, ${color}, #002966)`, color: '#fff', padding: '28px 32px', borderRadius: 12, marginBottom: 24 }}>
    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{icon} {title}</div>
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
// ▌ ACCOUNTS · 收款人管理
// ════════════════════════════════════════════════════════════════════
export function PayeesManager() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="👥" title="收款人管理" sub="48 位常用收款人 · 智能分类 · 黑名单防欺诈" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="常用收款人" value="48 位" sub="↑ 4 本月新增" />
        <Stat label="境内 / 境外" value="42 / 6" />
        <Stat label="黑名单" value="3 个" sub="自动拦截" color="#dc2626" />
      </div>

      <Section title="收款人列表" extra={<button className="b-btn b-btn-primary">+ 新增收款人</button>}>
        <table className="b-table">
          <thead><tr><th>★</th><th>姓名 / 公司</th><th>账号</th><th>开户行</th><th>类别</th><th>累计转账</th><th>最近</th><th>操作</th></tr></thead>
          <tbody>
            {[
              { f: '⭐', n: '太太 王雪', a: '6225 ···· 9241', b: '招行', c: '亲属', t: '¥ 120,000', last: '今天' },
              { f: '⭐', n: '父母 赵建国', a: '6217 ···· 8801', b: '建行', c: '亲属', t: '¥ 48,000', last: '5/15' },
              { f: '⭐', n: '保姆 张阿姨', a: '6228 ···· 2284', b: '邮政', c: '工资', t: '¥ 8,400', last: '5/30' },
              { f: '', n: '上海某物业公司', a: '6225 ···· 0084', b: '工行', c: '生活缴费', t: '¥ 14,400', last: '5/01' },
              { f: '', n: '装修公司 - 红蚂蚁', a: '6228 ···· 8841', b: '招行', c: '商家', t: '¥ 280,000', last: '4/22' },
              { f: '', n: '儿子 (英国留学)', a: 'GB 03 NWBK ··· 12', b: 'NatWest UK', c: '境外', t: 'GBP 24,000', last: '5/22' },
              { f: '', n: 'Alice Chen (美国)', a: 'US CITI ··· 4421', b: 'Citibank NY', c: '境外', t: 'USD 12,400', last: '5/28' },
              { f: '🚫', n: '某可疑账户', a: '6228 ···· 9999', b: '未知', c: '黑名单', t: '—', last: '已拒绝 5 次' },
            ].map((p, i) => (
              <tr key={i} style={{ background: p.c === '黑名单' ? '#fef2f2' : 'transparent' }}>
                <td>{p.f}</td>
                <td style={{ fontWeight: 600 }}>{p.n}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.a}</td>
                <td>{p.b}</td>
                <td><span className={`b-badge ${p.c === '黑名单' ? '' : 'b-badge-info'}`} style={p.c === '黑名单' ? { background: '#fef2f2', color: '#dc2626' } : {}}>{p.c}</span></td>
                <td style={{ fontWeight: 600 }}>{p.t}</td>
                <td style={{ fontSize: 11, color: '#64748b' }}>{p.last}</td>
                <td style={{ fontSize: 12 }}><a href="#" style={{ color: '#dc2626' }}>转账</a> · 编辑 · 删除</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="🛡 防欺诈保护">
        <div style={{ background: '#fef9c3', padding: 14, borderRadius: 6, fontSize: 12, lineHeight: 1.8, color: '#854d0e' }}>
          ✓ <strong>新增收款人 24h 冷却期</strong>：单笔限额 ¥10,000<br />
          ✓ <strong>境外收款人</strong>：需短信 + 人脸双重验证<br />
          ✓ <strong>异常收款行为</strong>：5 分钟内同一账户多次失败将自动加入观察名单<br />
          ✓ <strong>AI 关联检测</strong>：系统识别同一受益人不同账号的尝试，阻止洗钱
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ CARDS · 子页面
// ════════════════════════════════════════════════════════════════════

// 信用卡账单与还款
export function CardBills() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="📄" title="账单与还款" sub="World Elite · 当期 ¥28,640 · 6/15 到期" color="#9333ea" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="当期账单合计" value="¥ 28,640.18" sub="6/15 到期 · 剩 8 天" color="#dc2626" />
        <Stat label="最低还款额" value="¥ 2,864.02" sub="避免逾期" />
        <Stat label="未出账消费" value="¥ 4,820.00" sub="将进入下期" />
      </div>

      <Section title="💳 立即还款" extra={<button className="b-btn b-btn-primary">全额还款 ¥28,640</button>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="b-card" style={{ padding: 16, border: '2px solid #dc2626' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>✓ 自动还款已开启</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>从一卡通 ···· 4821 全额扣款</div>
            <button className="b-btn b-btn-ghost" style={{ marginTop: 8, fontSize: 12 }}>修改 / 关闭</button>
          </div>
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>💰 自定义还款</div>
            <input className="b-form-input" placeholder="输入金额" style={{ marginTop: 8 }} />
            <button className="b-btn b-btn-primary" style={{ marginTop: 8, fontSize: 12, width: '100%' }}>还款</button>
          </div>
          <div className="b-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>📅 最低还款</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>¥ 2,864.02</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>剩余按 0.05%/日 计息</div>
            <button className="b-btn b-btn-ghost" style={{ marginTop: 8, fontSize: 12, width: '100%' }}>仅还最低</button>
          </div>
        </div>
      </Section>

      <Section title="6 月账单明细 - World Elite Mastercard">
        <table className="b-table">
          <thead><tr><th>日期</th><th>商户</th><th>类别</th><th>地点</th><th style={{ textAlign: 'right' }}>金额</th><th>积分</th><th>操作</th></tr></thead>
          <tbody>
            {[
              ['2026-06-08', 'Apple Store 浦东', '电子产品', '上海', 8999, 4500, '可分期'],
              ['2026-06-07', '上海希尔顿酒店', '住宿', '上海', 4800, 2400, '已分 6 期'],
              ['2026-06-05', '京东 - 戴森吹风机', '家电', '上海', 2980, 1490, '可分期'],
              ['2026-06-04', 'Lululemon', '服饰', '上海', 2680, 1340, '-'],
              ['2026-06-03', '星巴克(陆家嘴)', '餐饮', '上海', 86, 43, '-'],
              ['2026-06-02', 'Cathay Pacific 香港', '机票', '香港', 9097, 9097, '已分 12 期'],
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td><td>{r[1]}</td><td><span className="b-badge b-badge-info">{r[2]}</span></td><td>{r[3]}</td>
                <td style={{ textAlign: 'right' }} className="b-amount-neg">-¥{(r[4] as number).toLocaleString()}</td>
                <td style={{ color: '#f59e0b' }}>+{(r[5] as number).toLocaleString()}</td>
                <td style={{ fontSize: 11 }}>{r[6] === '可分期' ? <a href="#" style={{ color: '#dc2626' }}>{r[6]}</a> : r[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="📅 历史账单">
        <table className="b-table">
          <thead><tr><th>账单月</th><th>账单金额</th><th>到期日</th><th>已还</th><th>状态</th><th>对账单</th></tr></thead>
          <tbody>
            <tr><td>2026-05</td><td>¥ 24,820</td><td>5/15</td><td>¥ 24,820</td><td><span className="b-badge b-badge-success">✓ 全额</span></td><td><a href="#" style={{ color: '#dc2626' }}>下载 PDF</a></td></tr>
            <tr><td>2026-04</td><td>¥ 32,180</td><td>4/15</td><td>¥ 32,180</td><td><span className="b-badge b-badge-success">✓ 全额</span></td><td><a href="#" style={{ color: '#dc2626' }}>下载 PDF</a></td></tr>
            <tr><td>2026-03</td><td>¥ 18,420</td><td>3/15</td><td>¥ 18,420</td><td><span className="b-badge b-badge-success">✓ 全额</span></td><td><a href="#" style={{ color: '#dc2626' }}>下载 PDF</a></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 积分商城
export function CardRewards() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🎁" title="积分商城" sub="可用 275,400 积分 ≈ ¥2,754 · 即将过期 18,400 (12/31)" color="#f59e0b" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="可用积分" value="275,400" sub="≈ ¥2,754 · 1:0.01" color="#f59e0b" />
        <Stat label="本年累计获得" value="184,200" />
        <Stat label="即将过期 (12/31)" value="18,400" sub="请尽快兑换" color="#dc2626" />
      </div>

      <Section title="🔥 热门兑换">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '✈', n: '国航里程', d: '5:1 · 满 20,000 起兑', p: 20000, hot: true },
            { i: '🌐', n: '国泰亚洲万里通', d: '5:1', p: 20000, hot: true },
            { i: '🎫', n: '环球龙腾机场贵宾室', d: '单次通行证', p: 12000, hot: true },
            { i: '🎁', n: 'Apple AirPods Pro 2', d: '官方零售 ¥1,899', p: 189900 },
            { i: '🍷', n: '波尔多红酒礼盒 6 支', d: '法国进口', p: 88000 },
            { i: '💰', n: '抵扣账单', d: '1 积分 = ¥0.01', p: 100, hot: true },
            { i: '☕', n: '星巴克 200 元礼品卡', d: '电子券码', p: 20000 },
            { i: '🛢', n: '中石化 200 元加油卡', d: '电子券', p: 20000 },
            { i: '🍷', n: 'Tiffany 项链', d: '925 银 · 经典款', p: 320000 },
          ].map(r => (
            <div key={r.n} className="b-card" style={{ padding: 16, position: 'relative' }}>
              {r.hot && <span style={{ position: 'absolute', top: 8, right: 8, background: '#dc2626', color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>HOT</span>}
              <div style={{ fontSize: 32, marginBottom: 6 }}>{r.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{r.n}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{r.d}</div>
              <div style={{ marginTop: 10, fontSize: 14, color: '#dc2626', fontWeight: 700 }}>{r.p.toLocaleString()} 积分</div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 8, fontSize: 12 }}>立即兑换</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📜 积分明细 (最近 30 天)">
        <table className="b-table">
          <thead><tr><th>日期</th><th>来源</th><th>积分变化</th><th>余额</th></tr></thead>
          <tbody>
            {[
              ['2026-06-08', 'Apple Store 消费返积分', '+4,500', '275,400'],
              ['2026-06-05', '京东消费 ¥2,980', '+1,490', '270,900'],
              ['2026-05-30', '兑换星巴克礼品卡', '-20,000', '269,410'],
              ['2026-05-22', '生日双倍积分', '+8,200', '289,410'],
              ['2026-05-15', '6/15 账单全额还款 (1.5x)', '+12,400', '281,210'],
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td><td>{r[1]}</td>
                <td style={{ color: r[2].startsWith('+') ? '#22c55e' : '#dc2626', fontWeight: 600 }}>{r[2]}</td>
                <td>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 账单分期
export function CardInstalment() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🔢" title="账单分期" sub="3/6/12/24 期可选 · 月费率低至 0.50% · 申请即批" color="#9333ea" />

      <Section title="🧮 分期试算">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">分期金额（元）</div><input className="b-form-input" defaultValue="8,999" /></div>
            <div className="b-form-group"><div className="b-form-label">期数</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['3 期 0.65%', '6 期 0.60%', '12 期 0.55%', '24 期 0.50%'].map((t, i) => (
                  <button key={t} style={{
                    flex: 1, padding: '12px 8px', borderRadius: 6, fontSize: 12,
                    border: i === 2 ? '2px solid #9333ea' : '1px solid #e2e8f0',
                    background: i === 2 ? '#faf5ff' : '#fff', cursor: 'pointer',
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%', background: '#9333ea' }}>确认分期 12 期</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#faf5ff' }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>每月还款</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#9333ea' }}>¥ 799.42 <span style={{ fontSize: 14, fontWeight: 400 }}>/月</span></div>
            <div style={{ borderTop: '1px solid #e9d5ff', marginTop: 16, paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>本金/期</span><span>¥ 749.92</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>手续费/期</span><span>¥ 49.50</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>手续费总和</span><span>¥ 594.00</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#dc2626' }}><span>实际年化 (APR)</span><span>~ 7.32%</span></div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="📋 可分期的当期账单消费">
        <table className="b-table">
          <thead><tr><th>日期</th><th>商户</th><th>金额</th><th>建议期数</th><th>每期</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>6/08</td><td>Apple Store iPhone</td><td>¥ 8,999</td><td>12 期</td><td>¥ 799/月</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>分期</button></td></tr>
            <tr><td>6/05</td><td>京东 戴森吹风机</td><td>¥ 2,980</td><td>6 期</td><td>¥ 514/月</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>分期</button></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="📊 当前分期 (已生效)">
        <table className="b-table">
          <thead><tr><th>开始日</th><th>商品</th><th>原价</th><th>期数</th><th>已还/总</th><th>剩余</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>2025-12-22</td><td>Cathay Pacific 机票</td><td>¥ 9,097</td><td>12</td><td>6/12</td><td>¥ 4,549</td><td><a href="#" style={{ color: '#dc2626' }}>提前结清</a></td></tr>
            <tr><td>2025-08-15</td><td>希尔顿酒店</td><td>¥ 4,800</td><td>6</td><td>4/6</td><td>¥ 1,600</td><td><a href="#" style={{ color: '#dc2626' }}>提前结清</a></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 借记卡管理
export function DebitCards() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🏧" title="借记卡管理" sub="2 张借记卡 · 实时控制 · 全球 ATM 取现 0 手续费" color="#dc2626" />

      <div className="b-grid-2" style={{ marginBottom: 20 }}>
        {[
          { name: '一卡通主卡', n: '6225 8801 ···· 4821', img: 'linear-gradient(135deg, #dc2626, #002966)' },
          { name: '一卡通工资卡', n: '6225 8801 ···· 4838', img: 'linear-gradient(135deg, #002966, #1e40af)' },
        ].map(c => (
          <div key={c.n} style={{ background: c.img, color: '#fff', borderRadius: 16, padding: 22, minHeight: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.1em' }}>BankerOS DEBIT</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{c.name}</div>
            <div style={{ fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.08em', marginTop: 24 }}>{c.n}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 11 }}>
              <div>VALID THRU<br /><strong style={{ fontSize: 13 }}>12/28</strong></div>
              <div style={{ fontSize: 24, opacity: 0.4 }}>UnionPay</div>
            </div>
          </div>
        ))}
      </div>

      <Section title="🔧 卡片设置">
        <div className="b-grid-3" style={{ gap: 12 }}>
          {[
            ['🔒 临时冻结', '丢失立即停用 · 可解冻'],
            ['🚫 永久挂失', '不可恢复 · 补办新卡'],
            ['📊 调整每日限额', '消费 / 取现 / 转账'],
            ['🌍 境外消费开通', '逐国开通 · 加强防盗'],
            ['📱 设置交易密码', '6 位独立密码'],
            ['🔔 短信通知', '余额变动实时短信'],
            ['🏧 ATM 取现密码', 'PIN 修改'],
            ['💳 修改卡面', '主题卡 / 联名卡'],
            ['🔄 卡片续期', '到期前 60 天可办'],
          ].map(([t, d]) => (
            <button key={t as string} className="b-card" style={{ padding: 14, textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{d}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="📊 当前限额设置">
        <table className="b-table">
          <thead><tr><th>交易类型</th><th>单笔</th><th>每日</th><th>每月</th><th>本月已用</th><th>调整</th></tr></thead>
          <tbody>
            <tr><td>POS 消费</td><td>¥ 50,000</td><td>¥ 100,000</td><td>¥ 500,000</td><td>¥ 18,420</td><td><a href="#" style={{ color: '#dc2626' }}>调整</a></td></tr>
            <tr><td>ATM 取现</td><td>¥ 5,000</td><td>¥ 20,000</td><td>¥ 100,000</td><td>¥ 2,000</td><td><a href="#" style={{ color: '#dc2626' }}>调整</a></td></tr>
            <tr><td>境外消费</td><td>USD 5,000</td><td>USD 5,000</td><td>USD 30,000</td><td>USD 1,820</td><td><a href="#" style={{ color: '#dc2626' }}>调整</a></td></tr>
            <tr><td>快捷支付</td><td>¥ 5,000</td><td>¥ 20,000</td><td>不限</td><td>¥ 4,820</td><td><a href="#" style={{ color: '#dc2626' }}>调整</a></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 申请新卡
export function CardIssue() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="➕" title="申请新卡" sub="高端权益卡 · 主题联名卡 · 在线申请秒批 · 7 天到家" color="#9333ea" />

      <Section title="✨ 推荐高端卡（基于您 Premier 身份）">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { tag: '推荐', n: 'Visa Infinite 御玺', d: '机场贵宾 · 高尔夫 · 高端医疗', anu: '¥ 3,600', l: '¥30 万起', g: 'linear-gradient(135deg, #c026d3, #6b21a8)' },
            { tag: '热门', n: 'World Elite Mastercard', d: '全球 1000 家酒店礼遇', anu: '¥ 1,800', l: '¥20 万起', g: 'linear-gradient(135deg, #000, #1a1a1a)' },
            { tag: '', n: 'JCB The Class', d: '日本特色 · 米其林餐厅', anu: '¥ 5,000', l: '¥30 万起', g: 'linear-gradient(135deg, #f59e0b, #b45309)' },
          ].map(c => (
            <div key={c.n} className="b-card" style={{ padding: 18, overflow: 'hidden' }}>
              <div style={{ background: c.g, height: 100, borderRadius: 8, marginBottom: 12, padding: 12, color: '#fff' }}>
                <div style={{ fontSize: 11, opacity: 0.7 }}>BankerOS PREMIER</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>{c.n}</div>
              </div>
              {c.tag && <span className="b-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>{c.tag}</span>}
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, minHeight: 36 }}>{c.d}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 8 }}>
                <span>年费 <strong style={{ color: '#dc2626' }}>{c.anu}</strong></span>
                <span>额度 {c.l}</span>
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 10, fontSize: 12 }}>立即申请</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🎨 主题 / 联名卡">
        <div className="b-grid-3" style={{ gap: 12 }}>
          {[
            { i: '✈', n: '国航联名卡', d: '消费即返里程 · 1:1' },
            { i: '🚄', n: '12306 联名', d: '高铁购票免手续费' },
            { i: '🛒', n: '京东 PLUS 联名', d: '京东 95 折 + 88VIP' },
            { i: '🎬', n: '上海电影节联名', d: '影迷限量发行' },
            { i: '⚽', n: '上海申花联名', d: '球迷限定 + 比赛日折扣' },
            { i: '🐱', n: 'Hello Kitty 萌卡', d: '少女款限量' },
          ].map(c => (
            <div key={c.n} className="b-card" style={{ padding: 14 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{c.i}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{c.n}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{c.d}</div>
              <button className="b-btn b-btn-ghost" style={{ width: '100%', marginTop: 8, fontSize: 11 }}>了解 / 申请</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📝 在线申请流程">
        <div style={{ display: 'flex', gap: 0 }}>
          {[['1', '选择卡片'], ['2', '填写资料'], ['3', '人脸 + 身份证认证'], ['4', '系统审批 (秒批)'], ['5', '7 天到家']].map(([n, l], i, arr) => (
            <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#9333ea', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{n}</div>
              <div style={{ marginLeft: 8, fontSize: 13, fontWeight: 600 }}>{l}</div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: '#e9d5ff', margin: '0 10px' }} />}
            </div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ WEALTH · 6 子页面
// ════════════════════════════════════════════════════════════════════

// 基金中心
export function FundsCenter() {
  const [tab, setTab] = useState('holding');
  return (
    <BankingLayout variant="personal">
      <Hero icon="📈" title="基金中心" sub="3,820 只在售基金 · 招行专享 0 申购费 · 智能定投" color="#9333ea" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, padding: 6, background: '#f1f5f9', borderRadius: 8, width: 'fit-content' }}>
        {[['holding', '我的持仓'], ['shop', '基金超市'], ['rank', '业绩排行'], ['dca', '定投计划']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as string)} style={{
            padding: '8px 16px', background: tab === k ? '#fff' : 'transparent', border: 'none', borderRadius: 6,
            cursor: 'pointer', fontWeight: tab === k ? 700 : 500, fontSize: 13,
          }}>{l}</button>
        ))}
      </div>

      {tab === 'holding' && (
        <Section title="我的基金持仓（2 只 · 总市值 ¥36,944）">
          <table className="b-table">
            <thead><tr><th>基金代码</th><th>名称</th><th>类型</th><th>持仓份额</th><th>成本</th><th>最新净值</th><th>市值</th><th>盈亏</th><th>操作</th></tr></thead>
            <tbody>
              <tr>
                <td>519688</td><td>招商中证白酒指数</td><td>股票指数</td><td>12,000</td><td>1.8420</td><td>2.1840</td>
                <td>¥ 26,208</td><td className="b-amount-pos">+18.57%</td>
                <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>申购</a> · <a href="#" style={{ color: '#dc2626' }}>赎回</a></td>
              </tr>
              <tr>
                <td>161725</td><td>招商中证 1000 指数</td><td>股票指数</td><td>8,000</td><td>1.2200</td><td>1.3420</td>
                <td>¥ 10,736</td><td className="b-amount-pos">+10.00%</td>
                <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>申购</a> · <a href="#" style={{ color: '#dc2626' }}>赎回</a></td>
              </tr>
            </tbody>
          </table>
        </Section>
      )}

      {tab === 'shop' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {['全部', '股票型', '债券型', '混合型', '货币型', 'QDII', 'FOF', '指数', 'ETF'].map(t => (
              <button key={t} className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>{t}</button>
            ))}
          </div>
          <Section title="推荐基金（基于您 R3 风险偏好）">
            <table className="b-table">
              <thead><tr><th>★</th><th>代码</th><th>名称</th><th>类型</th><th>近 1 年</th><th>近 3 年</th><th>规模</th><th>评级</th><th>操作</th></tr></thead>
              <tbody>
                {[
                  ['⭐', '110011', '易方达优质精选', '混合', '+18.4%', '+62.4%', '¥84亿', '★★★★★'],
                  ['', '161725', '招商中证 1000', '指数', '+12.8%', '+38.4%', '¥42亿', '★★★★'],
                  ['⭐', '003547', '南方天天利货币', '货币', '+2.18%', '+6.84%', '¥1800亿', '★★★★★'],
                  ['', '519005', '海富通收益增长', '混合', '+22.4%', '+58.4%', '¥28亿', '★★★★'],
                  ['', '050025', '博时标普 500 ETF', 'QDII', '+24.8%', '+72.4%', '¥18亿', '★★★★★'],
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r[0]}</td><td style={{ fontFamily: 'monospace' }}>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td>
                    <td className="b-amount-pos">{r[4]}</td><td className="b-amount-pos">{r[5]}</td><td>{r[6]}</td>
                    <td style={{ color: '#f59e0b' }}>{r[7]}</td>
                    <td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>申购</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </>
      )}

      {tab === 'rank' && (
        <Section title="🏆 业绩排行榜">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: '招商白酒', y: 24.8 }, { name: '易方达优质', y: 18.4 },
              { name: '博时 S&P500', y: 24.8 }, { name: '中证 1000', y: 12.8 },
              { name: '南方天天利', y: 2.18 }, { name: '海富通收益', y: 22.4 },
            ]} layout="vertical">
              <XAxis type="number" /><YAxis dataKey="name" type="category" width={100} />
              <Tooltip contentStyle={tip} formatter={(v: any) => `${v}%`} />
              <Bar dataKey="y" fill="#9333ea" name="近 1 年收益" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {tab === 'dca' && (
        <Section title="🤖 智能定投计划">
          <div className="b-grid-2">
            <div>
              <div className="b-form-group"><div className="b-form-label">选择基金</div><select className="b-form-input"><option>110011 · 易方达优质精选</option></select></div>
              <div className="b-form-group"><div className="b-form-label">每期投入</div><input className="b-form-input" defaultValue="2,000" /></div>
              <div className="b-form-group"><div className="b-form-label">定投频率</div><select className="b-form-input"><option>每月发薪日 (25日)</option><option>每周一</option><option>每两周</option></select></div>
              <div className="b-form-group"><div className="b-form-label">智能定投 (AI 高低估调节)</div>
                <label><input type="checkbox" defaultChecked /> 启用 — 低估时增投 50%, 高估时减投 50%</label>
              </div>
              <button className="b-btn b-btn-primary">开始定投</button>
            </div>
            <div className="b-card" style={{ padding: 20, background: '#faf5ff' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📊 历史回测 (3 年)</div>
              <div style={{ fontSize: 12, lineHeight: 2 }}>
                月投 ¥2,000 · 共 36 期<br />
                投入本金: <strong>¥72,000</strong><br />
                期末资产: <strong style={{ color: '#22c55e' }}>¥96,840</strong><br />
                累计收益: <strong style={{ color: '#22c55e' }}>+¥24,840 (+34.5%)</strong><br />
                年化收益: <strong style={{ color: '#22c55e' }}>10.4%</strong>
              </div>
            </div>
          </div>
        </Section>
      )}
    </BankingLayout>
  );
}

// 理财产品
export function WmProducts() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="💰" title="理财产品 (Wealth Mgmt)" sub="净值型 · 现金管理类 · 固收 + · 多策略 · 中低风险首选" color="#9333ea" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="我持仓" value="¥ 200,000" sub="1 只 · 招睿稳健 365 天" />
        <Stat label="累计收益" value="+¥ 6,240" sub="+3.12%" color="#22c55e" />
        <Stat label="可投资金" value="¥ 128,420" sub="一卡通余额" />
      </div>

      <Section title="🔥 在售理财（按风险等级筛选）">
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['全部', 'R1 谨慎', 'R2 稳健', 'R3 平衡 ⭐ 您的等级', 'R4 进取', 'R5 激进'].map(r => (
            <button key={r} className="b-btn b-btn-ghost" style={{ fontSize: 12, background: r.includes('⭐') ? '#faf5ff' : '#fff' }}>{r}</button>
          ))}
        </div>
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { tag: 'R2 稳健', name: '招睿稳健 365 天', y: '4.85%', min: '¥ 1 万', t: '365 天', f: '0.3% 管理费' },
            { tag: 'R2 稳健', name: '招睿现金宝 7 天', y: '2.45%', min: '¥ 1 元', t: 'T+0 申赎', f: '0' },
            { tag: 'R3 平衡', name: '招睿启航 FOF', y: '6.20%', min: '¥ 1,000', t: '建议 1 年+', f: '0.5%' },
            { tag: 'R3 平衡', name: '固收 + 价值精选', y: '5.80%', min: '¥ 5 万', t: '180 天', f: '0.4%' },
            { tag: 'R1 谨慎', name: '现金类货币组合', y: '1.85%', min: '¥ 1 元', t: 'T+0', f: '0' },
            { tag: 'R4 进取', name: '招睿权益增强', y: '8.20%', min: '¥ 1 万', t: '建议 2 年+', f: '0.8% + 20% 业绩报酬' },
          ].map(p => (
            <div key={p.name} className="b-card" style={{ padding: 18 }}>
              <span className="b-badge b-badge-info">{p.tag}</span>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0' }}>{p.name}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>{p.y}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>业绩比较基准 (近 1 年)</div>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 10, paddingTop: 10, fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
                起购 {p.min}<br />期限 {p.t}<br />费用 {p.f}
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 10, fontSize: 12 }}>立即购买</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="我的理财">
        <table className="b-table">
          <thead><tr><th>产品</th><th>持有份额</th><th>持有市值</th><th>累计收益</th><th>到期日</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>招睿稳健 365 天</td><td>200,000</td><td>¥ 206,240</td><td className="b-amount-pos">+¥ 6,240</td><td>2026-12-22</td><td><span className="b-badge b-badge-success">运行中</span></td><td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>详情</a></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 结构化产品
export function StructuredProducts() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🧩" title="结构化产品" sub="挂钩股票 / 黄金 / FX · 鲨鱼鳍 / 雪球 / 双区间 · 保本浮动收益" color="#9333ea" />

      <Section title="💡 结构化产品类型">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '🦈', n: '鲨鱼鳍 (Shark Fin)', d: '区间内浮动收益 · 突破后保底固定收益', best: '震荡市' },
            { i: '❄', n: '雪球 (Snowball)', d: '高票息 · 月观察 · 触发敲入有本金风险', best: '看震荡不大跌' },
            { i: '↕', n: '双区间', d: '两个价格区间内不同收益率', best: '小幅波动' },
            { i: '⬆', n: '看涨', d: '挂钩标的上涨获取倍数收益', best: '强烈看涨' },
            { i: '⬇', n: '看跌', d: '挂钩标的下跌获取收益', best: '看跌避险' },
            { i: '🛡', n: '保本浮收', d: '100% 保本 + 浮动上限', best: '保守增值' },
          ].map(t => (
            <div key={t.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{t.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, minHeight: 36 }}>{t.d}</div>
              <span className="b-badge b-badge-info">{t.best}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="在售结构化产品">
        <table className="b-table">
          <thead><tr><th>名称</th><th>挂钩标的</th><th>预期收益</th><th>风险</th><th>期限</th><th>起购</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>挂钩沪深 300 鲨鱼鳍</td><td>HS300 指数</td><td>0% ~ 8.50%</td><td>R3</td><td>6 月</td><td>¥ 5 万</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>购买</button></td></tr>
            <tr><td>挂钩黄金双区间</td><td>COMEX 黄金</td><td>0% ~ 6.20%</td><td>R3</td><td>3 月</td><td>¥ 5 万</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>购买</button></td></tr>
            <tr><td>USD 雪球 (中证 500)</td><td>中证 500</td><td>USD 年化 12%</td><td>R4</td><td>24 月</td><td>USD 1 万</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>购买</button></td></tr>
            <tr><td>挂钩 EUR/USD 双向</td><td>EUR/USD</td><td>0% ~ 5.80%</td><td>R3</td><td>3 月</td><td>USD 1 万</td><td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>购买</button></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="📊 鲨鱼鳍产品收益结构示例（挂钩 HS300）">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={Array.from({ length: 41 }, (_, i) => {
            const change = -20 + i;
            let yld = 0;
            if (change <= -10 || change >= 20) yld = 2;
            else if (change < 0) yld = 2 + (Math.abs(change) / 10) * 4;
            else yld = 2 + (change / 20) * 6.5;
            return { x: `${change}%`, yld };
          })}>
            <XAxis dataKey="x" interval={4} />
            <YAxis label={{ value: '产品收益率%', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tip} formatter={(v: any) => `${v.toFixed(2)}%`} />
            <Line type="monotone" dataKey="yld" stroke="#9333ea" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
          横轴：挂钩标的（沪深 300）涨跌幅 · 纵轴：本产品收益。区间内收益随波动增加，超出区间则保底 2%。
        </div>
      </Section>
    </BankingLayout>
  );
}

// 保险中心
export function InsuranceCenter() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🛡" title="保险中心" sub="人寿 · 重疾 · 储蓄 · 意外 · 旅游 · 财产 · 自动续保 + 理赔直付" color="#16a34a" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="我的保单" value="3 份" sub="1 重疾 · 1 寿险 · 1 意外" />
        <Stat label="本年保费" value="¥ 18,420" sub="↓ 2.4% vs 上年" />
        <Stat label="总保额" value="¥ 5.20 M" color="#22c55e" />
      </div>

      <Section title="🛒 在售保险（按类别）">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '❤', n: '重疾险 (招商信诺 · 安享康健)', d: '110 种重疾 · 50 种轻症', price: '¥ 8,400 /年', amt: '¥ 50 万', age: '0-65 岁' },
            { i: '👨‍👩‍👧', n: '定期寿险', d: '保至 70 岁 · 身故 / 全残赔付', price: '¥ 1,800 /年', amt: '¥ 100 万', age: '18-55 岁' },
            { i: '💰', n: '增额终身寿', d: 'IRR 3.5% · 现金价值复利增长', price: '¥ 10 万 × 10 年', amt: '随时间增长', age: '0-70 岁' },
            { i: '🩺', n: '百万医疗险', d: '住院医疗 + 重大疾病 100% 报销', price: '¥ 480 /年', amt: '¥ 600 万', age: '0-65 岁' },
            { i: '✈', n: '旅游意外险', d: '全球 200+ 国家 · 紧急救援', price: '¥ 80 /次', amt: '¥ 200 万', age: '0-80 岁' },
            { i: '🚗', n: '车险 (平安好车主)', d: '交强险 + 商业险 + 增值服务', price: '¥ 4,800 起', amt: '按车型', age: '需驾照' },
          ].map(p => (
            <div key={p.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{p.i}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, minHeight: 32 }}>{p.d}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>{p.price}</span>
                <span>保 {p.amt}</span>
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 10, fontSize: 12, background: '#16a34a' }}>投保</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="我的保单">
        <table className="b-table">
          <thead><tr><th>保单号</th><th>险种</th><th>被保人</th><th>保额</th><th>年保费</th><th>到期日</th><th>状态</th></tr></thead>
          <tbody>
            <tr><td>INS-2025-184</td><td>重疾险</td><td>赵磊 (本人)</td><td>¥ 500,000</td><td>¥ 8,400</td><td>2055-08-12</td><td><span className="b-badge b-badge-success">生效</span></td></tr>
            <tr><td>INS-2024-022</td><td>定期寿险</td><td>赵磊 (本人)</td><td>¥ 1,000,000</td><td>¥ 1,800</td><td>2055-08-12</td><td><span className="b-badge b-badge-success">生效</span></td></tr>
            <tr><td>INS-2026-008</td><td>百万医疗</td><td>太太 王雪</td><td>¥ 6,000,000</td><td>¥ 480</td><td>2027-01-15</td><td><span className="b-badge b-badge-success">生效</span></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="🚑 一键理赔">
        <div style={{ background: '#dcfce7', padding: 16, borderRadius: 8, fontSize: 13, lineHeight: 1.8, color: '#15803d' }}>
          <strong>线上理赔 3 步：</strong><br />
          1️⃣ 上传 4 张照片（医院发票、诊断书、出院小结、身份证）<br />
          2️⃣ AI 自动审核（5 分钟内）<br />
          3️⃣ 理赔款 24 小时直付至您账户<br /><br />
          <button className="b-btn b-btn-primary" style={{ background: '#16a34a' }}>📷 立即上传理赔材料</button>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 黄金/贵金属
export function PreciousMetals() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🥇" title="黄金 / 贵金属" sub="积存金 · 实物金 · 黄金 ETF · 黄金期货 · 24 小时报价" color="#eab308" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="实时金价 (Au99.99)" value="¥ 612 /克" sub="↑ +0.42% 今日" color="#22c55e" />
        <Stat label="我的持仓" value="42 克" sub="积存金 · 平均成本 ¥580" />
        <Stat label="累计盈亏" value="+¥ 1,344" sub="+5.52%" color="#22c55e" />
      </div>

      <Section title="📊 黄金 30 天走势">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={Array.from({ length: 30 }, (_, i) => ({ d: `${i + 1}`, p: 590 + Math.sin(i / 4) * 15 + i * 0.8 }))}>
            <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eab308" stopOpacity={0.4} /><stop offset="100%" stopColor="#eab308" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="d" /><YAxis domain={['auto', 'auto']} />
            <Tooltip contentStyle={tip} formatter={(v: any) => `¥${v.toFixed(2)}/克`} />
            <Area type="monotone" dataKey="p" stroke="#eab308" fill="url(#gg)" strokeWidth={2} name="金价" />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      <div className="b-grid-2">
        <Section title="📅 积存金 (定投黄金)">
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>每月固定金额买入黄金，1 克起，平摊成本，长期增值。</div>
          <div className="b-form-group"><div className="b-form-label">每月扣款日</div><select className="b-form-input"><option>每月 25 日 (发薪日)</option><option>每月 1 日</option></select></div>
          <div className="b-form-group"><div className="b-form-label">每期金额</div><input className="b-form-input" defaultValue="1,200" /></div>
          <button className="b-btn b-btn-primary" style={{ width: '100%', background: '#eab308', color: '#fff' }}>开始积存</button>
          <div style={{ marginTop: 12, padding: 12, background: '#fef9c3', borderRadius: 6, fontSize: 11, color: '#854d0e' }}>
            积存满 100 克可申请提取实物金条（1g/5g/10g/20g/50g/100g 规格），加工费 ¥10/克
          </div>
        </Section>

        <Section title="🪙 实物金条">
          <div className="b-grid-2" style={{ gap: 12 }}>
            {[
              { w: '10 克', p: '¥ 6,180', s: '生肖 · 投资' },
              { w: '50 克', p: '¥ 30,800', s: '投资金条' },
              { w: '100 克', p: '¥ 61,500', s: '投资金条' },
              { w: '500 克', p: '¥ 306,500', s: '银行特供' },
            ].map(b => (
              <div key={b.w} className="b-card" style={{ padding: 14, background: 'linear-gradient(135deg, #fef9c3, #fef3c7)' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>🥇 {b.w}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{b.s}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8, color: '#a16207' }}>{b.p}</div>
                <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 6, fontSize: 11, background: '#eab308' }}>购买</button>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="📈 其他贵金属">
        <table className="b-table">
          <thead><tr><th>品种</th><th>实时价</th><th>日内%</th><th>用途</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>🥇 黄金 Au99.99</td><td>¥ 612 /克</td><td className="b-amount-pos">+0.42%</td><td>避险 · 增值</td><td><a href="#" style={{ color: '#dc2626' }}>买入</a></td></tr>
            <tr><td>🥈 白银</td><td>¥ 7.84 /克</td><td className="b-amount-pos">+0.84%</td><td>工业 + 投资</td><td><a href="#" style={{ color: '#dc2626' }}>买入</a></td></tr>
            <tr><td>⚪ 铂金</td><td>¥ 248 /克</td><td className="b-amount-neg">-0.22%</td><td>工业 · 首饰</td><td><a href="#" style={{ color: '#dc2626' }}>买入</a></td></tr>
            <tr><td>🟤 钯金</td><td>¥ 312 /克</td><td className="b-amount-pos">+1.24%</td><td>催化剂</td><td><a href="#" style={{ color: '#dc2626' }}>买入</a></td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 智能投顾
export function RoboAdvisor() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🤖" title="智能投顾 (BankerOS AI)" sub="AI 资产配置 · 全天候 24/7 监控 · 一键调仓 · 累计 ↑ 18.4%" color="#0ea5e9" />

      <Section title="📋 您的投资画像">
        <div className="b-grid-2">
          <div className="b-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>风险评级</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0ea5e9' }}>R3 · 平衡型</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>5 维评估：年龄 38 · 收入 高 · 投资经验 8 年 · 风险承受 中等 · 流动性 中</div>
            <button className="b-btn b-btn-ghost" style={{ marginTop: 12 }}>重新评估</button>
          </div>
          <div className="b-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>投资目标</div>
            <div style={{ fontSize: 16 }}>📚 子女教育金（10 年后用）</div>
            <div style={{ fontSize: 16, marginTop: 4 }}>🏖 退休补充（25 年期）</div>
            <button className="b-btn b-btn-ghost" style={{ marginTop: 12 }}>编辑目标</button>
          </div>
        </div>
      </Section>

      <Section title="🎯 AI 推荐资产配置 vs 当前">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: '中国 A 股', cur: 32, ai: 25 },
            { name: '中国港股', cur: 14, ai: 12 },
            { name: '美股 / QDII', cur: 8, ai: 18 },
            { name: '欧洲', cur: 4, ai: 8 },
            { name: '日股', cur: 2, ai: 6 },
            { name: '黄金', cur: 8, ai: 12 },
            { name: '债券', cur: 24, ai: 12 },
            { name: 'REITs', cur: 0, ai: 4 },
            { name: '现金', cur: 8, ai: 3 },
          ]}>
            <XAxis dataKey="name" /><YAxis />
            <Tooltip contentStyle={tip} formatter={(v: any) => `${v}%`} />
            <Legend />
            <Bar dataKey="cur" name="当前" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ai" name="AI 建议" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section title="💡 AI 建议详情">
        <div style={{ background: '#dbeafe', padding: 16, borderRadius: 8, fontSize: 13, lineHeight: 1.8, color: '#1e40af' }}>
          <strong>🤖 BankerOS AI 分析：</strong><br /><br />
          基于您 R3 风险偏好 + 子女教育金目标 + 当前市场环境，建议：<br /><br />
          🔻 <strong>减仓：</strong>A 股 -7%（估值偏高） · 债券 -12%（利率下行空间有限）<br />
          🔺 <strong>加仓：</strong>美股 +10%（科技板块景气）· 黄金 +4%（地缘风险）· REITs +4%（新增稳定现金流资产）<br />
          📊 <strong>预期效果：</strong>年化收益 8.2% → 9.6%，最大回撤 -18% → -12%
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button className="b-btn b-btn-primary" style={{ background: '#0ea5e9' }}>🎯 一键调仓（预计 7 笔交易）</button>
          <button className="b-btn b-btn-ghost">仅采纳部分</button>
          <button className="b-btn b-btn-ghost">忽略</button>
        </div>
      </Section>

      <Section title="📈 智能投顾历史业绩">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={Array.from({ length: 24 }, (_, i) => ({
            m: `M${i + 1}`,
            robo: 100 + i * 1.5 + Math.sin(i / 3) * 2,
            bench: 100 + i * 0.8 + Math.sin(i / 3) * 3,
          }))}>
            <XAxis dataKey="m" interval={2} /><YAxis />
            <Tooltip contentStyle={tip} />
            <Legend />
            <Line type="monotone" dataKey="robo" name="AI 组合" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="bench" name="沪深 300 基准" stroke="#94a3b8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ FX · 3 子页面
// ════════════════════════════════════════════════════════════════════

// 全球账户
export function GlobalAccount() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🌍" title="全球账户 (Global Account)" sub="一户管 12 种货币 · 海外消费免转换费 · 全球 ATM 取现 0 手续费" color="#002966" />

      <Section title="💼 我持有的多币种">
        <table className="b-table">
          <thead><tr><th>币种</th><th>账户</th><th style={{ textAlign: 'right' }}>余额</th><th style={{ textAlign: 'right' }}>折人民币</th><th>利率</th><th>操作</th></tr></thead>
          <tbody>
            {[
              ['🇺🇸 USD', '···· USD-0023', 18420, 7.18, '4.20%'],
              ['🇭🇰 HKD', '···· HKD-0184', 500000, 0.92, '3.85%'],
              ['🇪🇺 EUR', '···· EUR-0045', 8920, 7.82, '3.20%'],
              ['🇬🇧 GBP', '···· GBP-0088', 0, 9.05, '4.50%'],
              ['🇯🇵 JPY', '···· JPY-0142', 0, 0.047, '0.10%'],
              ['🇸🇬 SGD', '···· SGD-0200', 0, 5.32, '3.40%'],
              ['🇦🇺 AUD', '···· AUD-0244', 0, 4.79, '4.10%'],
              ['🇨🇭 CHF', '···· CHF-0288', 0, 8.09, '1.50%'],
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{r[0]}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r[1]}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{(r[2] as number).toLocaleString()}</td>
                <td style={{ textAlign: 'right', color: '#64748b' }}>¥ {((r[2] as number) * (r[3] as number)).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}</td>
                <td><span className="b-badge b-badge-success">{r[4]}</span></td>
                <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>{r[2] === 0 ? '开通' : '换汇'}</a> · 转出</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="🌟 全球账户特权">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '💳', n: '全球借记卡', d: '全球 200 万 ATM 免手续费取现' },
            { i: '🏨', n: '海外消费 0 转换费', d: '原币结算 · 比信用卡省 1.5%' },
            { i: '💱', n: 'Premier 优惠点差', d: '换汇点差 -10 bps' },
            { i: '🌐', n: 'SWIFT GPI', d: '跨境到账跟踪 · 95% T+0' },
            { i: '🏠', n: '海外购房按揭', d: '英美澳加 6 国 · 7 折利率' },
            { i: '📑', n: '资金证明', d: '在线申请 · 30 分钟出函' },
          ].map(p => (
            <div key={p.n} className="b-card" style={{ padding: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{p.i}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{p.d}</div>
            </div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}

// 出国留学汇款
export function OverseasRemittance() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="✈" title="出国留学 / 海外汇款" sub="学费 · 生活费 · 移民购房 · 全球 184 国可达 · SWIFT GPI 跟踪" color="#002966" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="本年累计汇出" value="USD 24,820" sub="个人年度结汇上限 USD 50,000" />
        <Stat label="剩余额度" value="USD 25,180" color="#22c55e" />
        <Stat label="最近一笔" value="GBP 8,000" sub="5/22 · 儿子学费 · 已到账" />
      </div>

      <Section title="💸 立即汇款">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">用途（决定结汇申报）</div>
              <select className="b-form-input">
                <option>🎓 留学学费 (291030)</option>
                <option>🍱 留学生活费 (291040)</option>
                <option>🏠 海外购房 (122100)</option>
                <option>💼 移民投资 (222010)</option>
                <option>👨‍👩‍👧 赡养亲属 (291020)</option>
                <option>🏥 海外医疗 (122050)</option>
                <option>✈ 旅游 (291010)</option>
              </select>
            </div>
            <div className="b-form-group"><div className="b-form-label">收款人 (Beneficiary)</div><input className="b-form-input" defaultValue="Zhao Yuxuan (儿子)" /></div>
            <div className="b-form-group"><div className="b-form-label">收款国 / 行</div><input className="b-form-input" defaultValue="🇬🇧 UK · NatWest Bank London" /></div>
            <div className="b-form-group"><div className="b-form-label">SWIFT BIC</div><input className="b-form-input" defaultValue="NWBKGB2L" style={{ fontFamily: 'monospace' }} /></div>
            <div className="b-form-group"><div className="b-form-label">IBAN</div><input className="b-form-input" defaultValue="GB29 NWBK 6016 1331 9268 19" style={{ fontFamily: 'monospace' }} /></div>
            <div className="b-form-group"><div className="b-form-label">金额</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="b-form-input" style={{ width: 100 }}><option>GBP</option><option>USD</option><option>EUR</option><option>JPY</option><option>AUD</option></select>
                <input className="b-form-input" defaultValue="8,000" />
              </div>
            </div>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#eff6ff' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 汇款预览</div>
            <table style={{ width: '100%', fontSize: 13 }}>
              <tbody>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>付款</td><td style={{ textAlign: 'right' }}>一卡通 ···· 4821</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>收款</td><td style={{ textAlign: 'right' }}>Zhao Yuxuan</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>金额</td><td style={{ textAlign: 'right', fontSize: 18, fontWeight: 700 }}>GBP 8,000</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>汇率 (实时 GBP/CNY)</td><td style={{ textAlign: 'right' }}>9.0420</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>折人民币扣款</td><td style={{ textAlign: 'right', fontWeight: 700 }}>¥ 72,336.00</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>手续费</td><td style={{ textAlign: 'right' }}>¥ 0 <span style={{ fontSize: 10, color: '#22c55e' }}>(Premier 免)</span></td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>电报费</td><td style={{ textAlign: 'right' }}>GBP 15</td></tr>
                <tr><td style={{ color: '#64748b', padding: '6px 0' }}>预计到账</td><td style={{ textAlign: 'right', color: '#22c55e' }}>T+0 (24 小时内)</td></tr>
              </tbody>
            </table>
            <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 14 }}>提交（U 盾 + 人脸双重认证）</button>
          </div>
        </div>
      </Section>

      <Section title="📜 汇款跟踪 (SWIFT GPI)">
        <table className="b-table">
          <thead><tr><th>UETR</th><th>日期</th><th>收款人</th><th>金额</th><th>到账状态</th></tr></thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'monospace', fontSize: 11 }}>UETR-A7F8E2D9</td>
              <td>2026-05-22</td><td>Zhao Yuxuan (UK)</td><td>GBP 8,000</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span className="b-badge b-badge-success">✓ 已到账</span>
                  <span style={{ color: '#64748b' }}>5/22 14:08 → NatWest 5/22 18:42</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'monospace', fontSize: 11 }}>UETR-B2C4F1A0</td>
              <td>2026-04-15</td><td>Alice Chen (US)</td><td>USD 2,500</td>
              <td><span className="b-badge b-badge-success">✓ 已到账 4/15 22:30</span></td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="🎓 留学专属服务">
        <div className="b-grid-3" style={{ gap: 12 }}>
          {[
            ['📑 资金证明', '英中双语 · 30 分钟出函'], ['💳 海外学生附属卡', '父母控额 · 实时短信'],
            ['🏠 海外房贷', '6 国合作 · 30 年期'], ['🛂 签证保险', 'I-20 / CAS 配套'],
            ['📞 24/7 紧急援助', '全球免费回拨'], ['💱 留学专户', '汇率锁定 + 多次分期'],
          ].map(([t, d]) => (
            <div key={t} style={{ padding: 12, background: '#eff6ff', borderRadius: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{d}</div>
            </div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}

// 汇率走势 / 提醒
export function FxRatesAlerts() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="📊" title="汇率走势 / 目标价提醒" sub="12 货币对 · 历史 5 年 · 目标价短信 / APP 推送" color="#002966" />

      <Section title="📈 主要货币对 7 天走势">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={Array.from({ length: 30 }, (_, i) => ({
            d: `D-${30 - i}`,
            usd: 7.18 + Math.sin(i / 4) * 0.04,
            eur: 7.82 + Math.cos(i / 5) * 0.06,
            hkd: 0.92 + Math.sin(i / 6) * 0.002,
            gbp: 9.04 + Math.cos(i / 4) * 0.05,
          }))}>
            <XAxis dataKey="d" interval={4} fontSize={10} /><YAxis yAxisId="L" /><YAxis yAxisId="R" orientation="right" />
            <Tooltip contentStyle={tip} />
            <Legend />
            <Line yAxisId="L" type="monotone" dataKey="usd" name="USD/CNY" stroke="#dc2626" dot={false} strokeWidth={2} />
            <Line yAxisId="L" type="monotone" dataKey="eur" name="EUR/CNY" stroke="#3b82f6" dot={false} strokeWidth={2} />
            <Line yAxisId="L" type="monotone" dataKey="gbp" name="GBP/CNY" stroke="#9333ea" dot={false} strokeWidth={2} />
            <Line yAxisId="R" type="monotone" dataKey="hkd" name="HKD/CNY" stroke="#22c55e" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <Section title="🔔 我的目标价提醒">
        <table className="b-table">
          <thead><tr><th>货币对</th><th>触发条件</th><th>目标价</th><th>当前价</th><th>距离</th><th>通知方式</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>USD/CNY</strong></td><td>跌破</td><td>7.1500</td><td>7.1835</td>
              <td style={{ color: '#dc2626' }}>-0.47%</td><td>📱 + 📨</td>
              <td><span className="b-badge b-badge-success">监控中</span></td>
              <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>修改</a></td>
            </tr>
            <tr>
              <td><strong>EUR/CNY</strong></td><td>突破</td><td>7.9000</td><td>7.8190</td>
              <td style={{ color: '#22c55e' }}>+1.04%</td><td>📱</td>
              <td><span className="b-badge b-badge-success">监控中</span></td>
              <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>修改</a></td>
            </tr>
            <tr>
              <td><strong>GBP/CNY</strong></td><td>跌破</td><td>8.8000</td><td>9.0500</td>
              <td style={{ color: '#dc2626' }}>-2.76%</td><td>📱 + 📨</td>
              <td><span className="b-badge b-badge-success">监控中 (留学汇款)</span></td>
              <td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>修改</a></td>
            </tr>
          </tbody>
        </table>
        <button className="b-btn b-btn-primary" style={{ marginTop: 12 }}>+ 新建提醒</button>
      </Section>

      <Section title="🆕 新建目标价提醒">
        <div className="b-grid-2">
          <div>
            <div className="b-form-group"><div className="b-form-label">货币对</div><select className="b-form-input"><option>USD/CNY</option><option>EUR/CNY</option><option>HKD/CNY</option><option>GBP/CNY</option><option>JPY/CNY</option></select></div>
            <div className="b-form-group"><div className="b-form-label">触发方向</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <label><input type="radio" name="dir" defaultChecked /> 跌破</label>
                <label><input type="radio" name="dir" /> 突破</label>
                <label><input type="radio" name="dir" /> 双向</label>
              </div>
            </div>
            <div className="b-form-group"><div className="b-form-label">目标价</div><input className="b-form-input" defaultValue="7.1000" /></div>
            <div className="b-form-group"><div className="b-form-label">通知方式</div>
              <label><input type="checkbox" defaultChecked /> 短信</label> &nbsp;
              <label><input type="checkbox" defaultChecked /> APP 推送</label> &nbsp;
              <label><input type="checkbox" /> 邮件</label>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%' }}>创建提醒</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#eff6ff' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>💡 智能建议</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8, lineHeight: 1.6 }}>
              基于过去 6 个月 USD/CNY 在 7.10-7.25 区间波动，7.10 是较好的换汇时点。
              <br /><br />
              如需立即锁定，可使用<strong>远期锁汇</strong>（1 月期 7.1782）或<strong>看涨期权</strong>（执行价 7.20，权利金 ¥0.024/USD）。
            </div>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ LOANS · 4 子页面
// ════════════════════════════════════════════════════════════════════

// 住房贷款
export function MortgageCenter() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🏡" title="住房按揭贷款" sub="首套 / 二套 / 抵押贷 · 最长 30 年 · LPR-20bp 起" color="#002966" />

      <Section title="🆕 申请新房贷">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { n: '首套房贷', d: '首付 ≥30% · LPR-20bp', r: '3.75%', max: '¥ 3,000 万' },
            { n: '二套房贷', d: '首付 ≥50% · LPR+50bp', r: '4.45%', max: '¥ 3,000 万' },
            { n: '商住两用', d: '首付 ≥50% · 10-20 年', r: '5.20%', max: '¥ 2,000 万' },
            { n: '抵押消费贷', d: '房产抵押 · 用途广', r: '3.80%', max: '¥ 1,500 万' },
            { n: '抵押经营贷', d: '法人 / 个体户专用', r: '3.50%', max: '¥ 2,000 万' },
            { n: '海外购房贷', d: '英 / 美 / 澳 / 加 / 新 / 港', r: 'SOFR+250bp', max: '当地评估' },
          ].map(p => (
            <div key={p.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, minHeight: 32 }}>{p.d}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#dc2626', marginTop: 8 }}>{p.r}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>起 · 最高 {p.max}</div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 10, fontSize: 12 }}>立即申请</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📊 我的房贷 - 浦东陆家嘴金茂府">
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
              <div><div style={{ color: '#64748b', fontSize: 11 }}>下月还款</div><div style={{ fontWeight: 700, color: '#dc2626' }}>¥ 12,840 · 6/22</div></div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="b-btn b-btn-primary">申请提前还款</button>
              <button className="b-btn b-btn-ghost">变更还款方式</button>
              <button className="b-btn b-btn-ghost">下载计划表</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={Array.from({ length: 30 }, (_, i) => ({ y: 2018 + i, bal: Math.max(0, 3200 - 88 * i) }))}>
              <XAxis dataKey="y" /><YAxis />
              <Tooltip contentStyle={tip} formatter={(v: any) => `¥${v.toFixed(0)}K`} />
              <Area type="monotone" dataKey="bal" stroke="#dc2626" fill="#fecaca" name="贷款余额(千元)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 消费贷
export function ConsumerLoan() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="💼" title="消费贷款" sub="装修 / 教育 / 婚庆 / 旅游 / 医疗 · 闪电贷秒批" color="#dc2626" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="可用信用额度" value="¥ 320,000" sub="预审批 · 秒批" color="#22c55e" />
        <Stat label="已用" value="¥ 0" sub="未使用" />
        <Stat label="参考利率" value="4.80% 起" sub="LPR + 加点" />
      </div>

      <Section title="🆕 消费贷产品">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { i: '⚡', n: '闪电贷', d: '纯线上 · 秒批 · 随借随还', amt: '¥ 30 万', r: '4.80% 起', t: '1-36 月' },
            { i: '🏠', n: '装修贷', d: '装修公司直付 · 利率优惠', amt: '¥ 80 万', r: '4.20% 起', t: '1-10 年' },
            { i: '🎓', n: '教育贷', d: '凭录取 / 学费单申请', amt: '¥ 100 万', r: '4.00% 起', t: '1-15 年' },
            { i: '💍', n: '婚庆贷', d: '婚礼一站式融资', amt: '¥ 20 万', r: '5.20% 起', t: '1-5 年' },
            { i: '✈', n: '旅游分期', d: '机票 / 酒店 / 跟团游', amt: '¥ 10 万', r: '5.50% 起', t: '3-24 月' },
            { i: '🏥', n: '医疗贷', d: '正规医院 · 大病 / 整形', amt: '¥ 30 万', r: '4.50% 起', t: '1-5 年' },
          ].map(p => (
            <div key={p.n} className="b-card" style={{ padding: 18 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{p.i}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{p.n}</div>
              <div style={{ fontSize: 11, color: '#64748b', minHeight: 32, marginTop: 4 }}>{p.d}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
                <span>额度 <strong>{p.amt}</strong></span>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>{p.r}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>期限 {p.t}</div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 10, fontSize: 12 }}>立即申请</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="⚡ 闪电贷申请（30 秒）">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">借款金额</div><input className="b-form-input" defaultValue="100,000" /></div>
            <div className="b-form-group"><div className="b-form-label">借款期限</div><select className="b-form-input"><option>12 月</option><option>24 月</option><option>36 月</option></select></div>
            <div className="b-form-group"><div className="b-form-label">还款方式</div><select className="b-form-input"><option>等额本息</option><option>等额本金</option><option>先息后本</option></select></div>
            <div className="b-form-group"><div className="b-form-label">资金到账账户</div><select className="b-form-input"><option>一卡通 ···· 4821 (CNY)</option></select></div>
            <button className="b-btn b-btn-primary" style={{ width: '100%' }}>⚡ 立即借款（人脸验证）</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fef2f2' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>每月还款</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>¥ 8,544.16</div>
            <div style={{ borderTop: '1px solid #fecaca', marginTop: 16, paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>总利息</span><span>¥ 2,529.92</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>实际年化 (APR)</span><span>4.80%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>放款时间</span><span style={{ color: '#22c55e' }}>实时（&lt; 1 分钟）</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>提前还款</span><span>无违约金</span></div>
            </div>
          </div>
        </div>
      </Section>
    </BankingLayout>
  );
}

// 车贷
export function AutoLoan() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🚗" title="汽车贷款" sub="4S 店合作 · 0 首付 · 新能源 / 进口 / 二手车均可" color="#dc2626" />

      <div className="b-grid-3" style={{ marginBottom: 20 }}>
        <Stat label="可贷额度" value="¥ 800,000" sub="基于您信用评分 A+" color="#22c55e" />
        <Stat label="首付比例" value="0%" sub="0-30% 灵活选择" />
        <Stat label="参考利率" value="4.50% 起" sub="新能源 4.00% 起" />
      </div>

      <Section title="🚗 推荐车型贷款方案">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { car: 'BMW iX3 (2026)', tag: '🌱 新能源', price: 50, dp: 10, mn: 8400, r: '4.00%' },
            { car: 'Mercedes EQE 350+', tag: '🌱 新能源', price: 56, dp: 11.2, mn: 9420, r: '4.00%' },
            { car: '理想 L9 Max', tag: '🌱 新能源', price: 46, dp: 9.2, mn: 7700, r: '4.00%' },
            { car: 'Porsche Macan', tag: '⛽ 燃油', price: 68, dp: 13.6, mn: 11200, r: '4.50%' },
            { car: 'Toyota Alphard 30', tag: '⛽ 燃油', price: 80, dp: 16, mn: 13400, r: '4.50%' },
            { car: 'Volkswagen ID.7', tag: '🌱 新能源', price: 24, dp: 4.8, mn: 4020, r: '4.00%' },
          ].map(c => (
            <div key={c.car} className="b-card" style={{ padding: 18 }}>
              <span className="b-badge b-badge-info">{c.tag}</span>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>{c.car}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>裸车价 ¥{c.price}万 · 首付 ¥{c.dp}万 (20%) · 3 年期</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginTop: 8 }}>¥ {c.mn.toLocaleString()} /月</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>利率 {c.r}</div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 8, fontSize: 12 }}>立即申请</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="✅ 申请流程">
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            ['1', '在线预审 (3 分钟)'], ['2', 'AI 审批 (5 分钟)'], ['3', '到 4S 店选车'],
            ['4', '签约 + 上牌'], ['5', '放款 + 提车'],
          ].map(([n, l], i, arr) => (
            <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{n}</div>
              <div style={{ marginLeft: 8, fontSize: 12, fontWeight: 600 }}>{l}</div>
              {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: '#fecaca', margin: '0 10px' }} />}
            </div>
          ))}
        </div>
      </Section>

      <Section title="🏪 合作 4S 店（您所在地）">
        <table className="b-table">
          <thead><tr><th>品牌</th><th>4S 店</th><th>地址</th><th>电话</th><th>专属优惠</th></tr></thead>
          <tbody>
            <tr><td>BMW</td><td>宝马上海宝信</td><td>浦东新区世纪大道 1500 号</td><td>021-58XXXXXX</td><td>BankerOS 客户 · 利率优惠 30bp</td></tr>
            <tr><td>Mercedes</td><td>奔驰仁孚浦东店</td><td>浦东新区龙阳路 800 号</td><td>021-50XXXXXX</td><td>免 1 年保养</td></tr>
            <tr><td>Porsche</td><td>保时捷上海中心</td><td>静安区延平路 1000 号</td><td>021-62XXXXXX</td><td>BankerOS Premier · 礼宾试驾</td></tr>
            <tr><td>理想 / 蔚来</td><td>多家门店</td><td>—</td><td>—</td><td>0 首付 · 利率 3.80%</td></tr>
          </tbody>
        </table>
      </Section>
    </BankingLayout>
  );
}

// 贷款计算器
export function LoanCalculator() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🧮" title="贷款计算器" sub="试算月供 · 总利息 · 等额本息 vs 等额本金对比 · 提前还款节省分析" />

      <Section title="🧮 月供试算">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div className="b-form-group"><div className="b-form-label">贷款金额（万元）</div><input className="b-form-input" defaultValue="300" /></div>
            <div className="b-form-group"><div className="b-form-label">贷款期限</div>
              <select className="b-form-input"><option>30 年 (360 期)</option><option>20 年</option><option>15 年</option><option>10 年</option><option>5 年</option></select>
            </div>
            <div className="b-form-group"><div className="b-form-label">年利率 (%)</div><input className="b-form-input" defaultValue="3.75" /></div>
            <div className="b-form-group"><div className="b-form-label">还款方式</div>
              <select className="b-form-input"><option>等额本息</option><option>等额本金</option><option>先息后本</option></select>
            </div>
            <button className="b-btn b-btn-primary" style={{ width: '100%' }}>开始试算</button>
          </div>
          <div className="b-card" style={{ padding: 20, background: '#fef2f2' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>每月还款</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#dc2626' }}>¥ 13,894</div>
            <div style={{ borderTop: '1px solid #fecaca', marginTop: 16, paddingTop: 16, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>总还款额</span><span>¥ 5,002,068</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>总利息</span><span style={{ color: '#dc2626' }}>¥ 2,002,068</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span>首月利息 / 本金</span><span>¥ 9,375 / ¥ 4,519</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>末月利息 / 本金</span><span>¥ 43 / ¥ 13,851</span></div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="📊 等额本息 vs 等额本金">
        <div className="b-grid-2">
          <div className="b-card" style={{ padding: 18, background: '#fef2f2' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>等额本息</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>每月还款固定 · 还款压力均匀</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12 }}>月供：<strong>¥ 13,894</strong> (固定)</div>
              <div style={{ fontSize: 12 }}>总利息：<strong style={{ color: '#dc2626' }}>¥ 2,002,068</strong></div>
              <div style={{ fontSize: 12 }}>适合：稳定收入 · 不想计算麻烦</div>
            </div>
          </div>
          <div className="b-card" style={{ padding: 18, background: '#dcfce7' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>等额本金</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>每月本金固定 · 利息递减 · 总利息更少</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12 }}>首月：<strong>¥ 17,708</strong> · 末月：<strong>¥ 8,360</strong></div>
              <div style={{ fontSize: 12 }}>总利息：<strong style={{ color: '#22c55e' }}>¥ 1,693,750 (省 ¥30.8 万)</strong></div>
              <div style={{ fontSize: 12 }}>适合：高收入早期 · 想省利息</div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="💡 提前还款节省分析">
        <div style={{ background: '#fffbeb', padding: 14, borderRadius: 6, fontSize: 13, lineHeight: 1.8, color: '#92400e' }}>
          假设 5 年后（已还 60 期）一次性提前还款 <strong>¥ 100 万</strong>：<br />
          → 剩余期数缩短 <strong>92 期</strong>（从 300 → 208 期）<br />
          → 总节省利息 <strong>¥ 84.2 万</strong><br />
          → 提前 7.6 年还清<br />
          → 折合年化收益率 <strong>4.18%</strong>（相当于把这 ¥100 万投资得到 4.18% 无风险收益）<br /><br />
          <strong>结论：</strong>如果您找不到稳定超过 4.18% 收益的投资品，提前还房贷是优选。
        </div>
      </Section>
    </BankingLayout>
  );
}

// ════════════════════════════════════════════════════════════════════
// ▌ LIFESTYLE · 2 子页面
// ════════════════════════════════════════════════════════════════════

// 机票/酒店
export function TravelHotel() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🛫" title="机票 · 酒店" sub="Premier 客户专属优惠 · 全球 1,000+ 五星酒店 · 里程兑换" color="#0ea5e9" />

      <Section title="✈ 机票预订">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div className="b-form-group"><div className="b-form-label">出发</div><input className="b-form-input" defaultValue="上海 (PVG)" /></div>
          <div className="b-form-group"><div className="b-form-label">到达</div><input className="b-form-input" defaultValue="东京 (HND)" /></div>
          <div className="b-form-group"><div className="b-form-label">出发日</div><input type="date" className="b-form-input" defaultValue="2026-08-15" /></div>
          <div className="b-form-group"><div className="b-form-label">舱位</div><select className="b-form-input"><option>商务舱</option><option>头等</option><option>经济</option></select></div>
          <button className="b-btn b-btn-primary" style={{ height: 38 }}>🔍 搜索</button>
        </div>
      </Section>

      <Section title="搜索结果 · PVG → HND · 8/15">
        <table className="b-table">
          <thead><tr><th>航司</th><th>航班</th><th>出发 / 到达</th><th>时长</th><th>舱位</th><th>价格</th><th>积分</th><th>操作</th></tr></thead>
          <tbody>
            <tr>
              <td>🇯🇵 ANA</td><td>NH922</td><td>09:00 → 13:25</td><td>3h25m</td><td>商务</td>
              <td><strong style={{ color: '#dc2626' }}>¥ 8,400</strong> <span style={{ fontSize: 10, color: '#22c55e' }}>(Premier -10%)</span></td>
              <td>+ 4,200</td>
              <td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>预订</button></td>
            </tr>
            <tr>
              <td>🇨🇳 国航</td><td>CA929</td><td>10:30 → 15:00</td><td>3h30m</td><td>商务</td>
              <td><strong>¥ 7,800</strong></td><td>+ 3,900</td>
              <td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>预订</button></td>
            </tr>
            <tr>
              <td>🇯🇵 JAL</td><td>JL876</td><td>13:00 → 17:25</td><td>3h25m</td><td>商务</td>
              <td><strong>¥ 8,900</strong></td><td>+ 4,450</td>
              <td><button className="b-btn b-btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}>预订</button></td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="🏨 五星级酒店推荐（东京）">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { n: 'The Peninsula Tokyo', d: '5 星 · 银座 · Premier 8 折', p: '¥ 4,800', s: '★ 5.0' },
            { n: 'Aman Tokyo', d: '5 星 · 大手町 · 顶级温泉', p: '¥ 6,200', s: '★ 5.0' },
            { n: 'Park Hyatt Tokyo', d: '5 星 · 新宿 · 迷失东京取景地', p: '¥ 3,800', s: '★ 4.9' },
            { n: 'Imperial Hotel', d: '4 星+ · 日比谷 · 百年历史', p: '¥ 2,400', s: '★ 4.8' },
            { n: 'Bulgari Hotel Tokyo', d: '5 星 · 东京站 · 新开业', p: '¥ 8,800', s: '★ 5.0' },
            { n: 'Hoshinoya Tokyo', d: '5 星 · 大手町 · 都市温泉旅馆', p: '¥ 5,200', s: '★ 4.9' },
          ].map(h => (
            <div key={h.n} className="b-card" style={{ padding: 16 }}>
              <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #1e40af)', height: 80, borderRadius: 8, marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 700 }}>{h.n}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{h.d}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>{h.p}/晚</span>
                <span style={{ color: '#f59e0b' }}>{h.s}</span>
              </div>
              <button className="b-btn b-btn-primary" style={{ width: '100%', marginTop: 8, fontSize: 12 }}>预订</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="💎 Premier 专属旅行权益">
        <div className="b-grid-3" style={{ gap: 12 }}>
          {[['🛂', '机场快速通关 (CIP)'], ['✈', '商务舱免费升级券 4 张/年'], ['🎫', '环球龙腾贵宾室 24 次/年'],
            ['🚗', '机场接送（一线城市 12 次/年）'], ['🛏', '酒店专属早餐 / 房型升级'], ['📞', '24/7 多语种礼宾热线'],
          ].map(([i, l]) => (
            <div key={l} style={{ padding: 12, background: '#dbeafe', borderRadius: 6, fontSize: 12 }}>
              <span style={{ fontSize: 18, marginRight: 8 }}>{i}</span><strong>{l}</strong>
            </div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}

// 餐饮订座
export function DiningReservation() {
  return (
    <BankingLayout variant="personal">
      <Hero icon="🍽" title="米其林 / Premier 餐厅订座" sub="100+ 米其林餐厅 · Premier 客户优先订座 · 7-9 折优惠" color="#dc2626" />

      <Section title="🌟 米其林 三星推荐（上海）">
        <div className="b-grid-3" style={{ gap: 16 }}>
          {[
            { n: 'Ultraviolet by Paul Pairet', d: '三星 · 概念料理 · 须提前 90 天', tag: '⭐⭐⭐' },
            { n: '甬府', d: '三星 · 宁波菜 · 当代演绎', tag: '⭐⭐⭐' },
            { n: 'Da Vittorio Shanghai', d: '二星 · 意大利 · 外滩景观', tag: '⭐⭐' },
            { n: '新荣记', d: '二星 · 台州海鲜 · 黄浦店', tag: '⭐⭐' },
            { n: '雍颐庭', d: '二星 · 法餐 · 浦东四季', tag: '⭐⭐' },
            { n: 'L\'Atelier de Joël Robuchon', d: '二星 · 法餐 · 黄浦', tag: '⭐⭐' },
          ].map(r => (
            <div key={r.n} className="b-card" style={{ padding: 16 }}>
              <span style={{ color: '#f59e0b', fontSize: 14 }}>{r.tag}</span>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{r.n}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{r.d}</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button className="b-btn b-btn-primary" style={{ flex: 1, fontSize: 12 }}>预订</button>
                <button className="b-btn b-btn-ghost" style={{ fontSize: 12 }}>详情</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🆕 在线预订">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: 12, alignItems: 'end' }}>
          <div className="b-form-group"><div className="b-form-label">餐厅</div><input className="b-form-input" defaultValue="甬府" /></div>
          <div className="b-form-group"><div className="b-form-label">日期</div><input type="date" className="b-form-input" defaultValue="2026-06-15" /></div>
          <div className="b-form-group"><div className="b-form-label">时间</div><select className="b-form-input"><option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option></select></div>
          <div className="b-form-group"><div className="b-form-label">人数</div><select className="b-form-input"><option>2 人</option><option>4 人</option><option>6 人</option><option>8 人</option></select></div>
          <div className="b-form-group"><div className="b-form-label">特殊要求</div><input className="b-form-input" placeholder="如靠窗 / 包厢" /></div>
          <button className="b-btn b-btn-primary" style={{ height: 38 }}>立即预订</button>
        </div>
      </Section>

      <Section title="📅 我的预订">
        <table className="b-table">
          <thead><tr><th>日期 / 时间</th><th>餐厅</th><th>人数</th><th>预付</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>2026-06-08 19:00</td><td>新荣记</td><td>4 人</td><td>¥ 2,400 (定金)</td><td><span className="b-badge b-badge-success">✓ 已确认</span></td><td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>修改</a> · 取消</td></tr>
            <tr><td>2026-06-15 18:30</td><td>Da Vittorio</td><td>2 人</td><td>—</td><td><span className="b-badge b-badge-warn">待餐厅确认</span></td><td style={{ fontSize: 11 }}><a href="#" style={{ color: '#dc2626' }}>取消</a></td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="🎁 Premier 餐饮特权">
        <div className="b-grid-3" style={{ gap: 12 }}>
          {[
            '🍷 米其林餐厅 7-9 折', '🎂 生日免费蛋糕 + 香槟', '🔓 网红餐厅优先订座',
            '👨‍🍳 主厨私房菜邀请', '🍵 私人酒窖品鉴会', '🌟 米其林颁奖晚宴邀请函',
          ].map(p => (
            <div key={p} style={{ padding: 12, background: '#fef2f2', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>{p}</div>
          ))}
        </div>
      </Section>
    </BankingLayout>
  );
}
