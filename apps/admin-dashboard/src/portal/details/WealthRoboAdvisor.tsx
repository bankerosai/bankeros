/**
 * Wealth detail: Robo-Advisor / 智能投顾
 * Benchmarked: Betterment / Wealthfront / 招行摩羯智投 / 工行 AI 投
 */

import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy, FaqAccordion, PricingTable,
} from '../ProductDetailPage';

export default function WealthRoboAdvisor() {
  return (
    <ProductDetailPage
      breadcrumbs={[
        { label: '财富管理' },
        { label: '投资产品', to: '/products/wealth/funds' },
        { label: '智能投顾' },
      ]}
      sections={[
        { id: 'overview',  label: '什么是智能投顾' },
        { id: 'how',       label: '工作原理' },
        { id: 'strategies', label: '投资策略' },
        { id: 'usecases',  label: '适用人群' },
        { id: 'process',   label: '使用流程' },
        { id: 'case',      label: '业绩与案例' },
        { id: 'fees',      label: '费率说明' },
        { id: 'faq',       label: '常见问题' },
      ]}
      hero={{
        badge: 'AI 驱动 · 1 万起投',
        category: 'AI Robo-Advisor',
        productName: '智能投顾',
        tagline: 'AI 算法 + 现代投资组合理论 (MPT) · 24×7 自动调仓 · 平均年化 8-12%',
        bullets: [
          '最低 ¥10,000 起投',
          '5 个风险等级 · 算法定制',
          'AI 自动再平衡 (季度调仓)',
          '管理费仅 0.5%/年 (传统理财 1-2%)',
          '全球资产配置 (股/债/REITs/商品)',
          '7×24 实时查看持仓',
        ],
        background: 'gradient',
        ctaPrimary: { label: '开始投资 →', to: '/login' },
        ctaSecondary: { label: '查看历史业绩', to: '#case' },
      }}>

      <Sect id="overview" eyebrow="What is Robo-Advisor" title="什么是智能投顾？">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <div>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 14 }}>
              <strong>智能投顾 (Robo-Advisor)</strong> 是利用 <strong>AI 算法</strong> 和 <strong>现代投资组合理论 (Modern Portfolio Theory)</strong>，
              为客户提供<strong>自动化的资产配置和组合管理</strong>服务。客户只需完成<strong>风险评估问卷</strong>，
              系统即生成<strong>个性化投资组合</strong>，并 24×7 自动监控、再平衡。
            </p>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 14 }}>
              传统财富管理需要 ¥500 万门槛 + 1-2% 管理费 + 客户经理人工干预。
              BankerOS 智能投顾打破门槛 — <strong>¥10,000 起投</strong>，
              <strong>0.5% 管理费</strong>，AI 替代人工，享受类似私人银行的资产配置服务。
            </p>

            <div style={{ background: 'rgba(168,85,247,0.05)', borderLeft: '4px solid #a855f7', padding: 16, borderRadius: 4 }}>
              <h4 style={{ fontWeight: 700, color: '#a855f7', marginBottom: 8, fontSize: 14 }}>🧠 算法基础</h4>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', margin: 0, lineHeight: 1.6 }}>
                BankerOS 智能投顾基于<strong>诺贝尔奖得主马科维茨的 MPT 理论</strong>，
                结合 BankerOS 自研的 <strong>BlackForest 量化模型</strong>，
                通过分析 5000+ 全球资产的历史相关性，构建<strong>给定风险下收益最大</strong>的有效前沿组合。
              </p>
            </div>
          </div>

          <div style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16, textTransform: 'uppercase' }}>关键参数</h4>
            {[
              ['最低起投',  '¥ 10,000'],
              ['追投门槛',  '¥ 1,000'],
              ['管理费',    '0.5%/年'],
              ['申购费',    '免'],
              ['赎回费',    '持有 >1 年免'],
              ['调仓频率',  '季度 + 重大波动'],
              ['底层资产',  '基金/ETF/债券'],
              ['风险等级',  '5 档 (R1-R5)'],
              ['T+1 赎回',  '工作日 15:00 前'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-border)', fontSize: 13 }}>
                <span style={{ color: 'var(--p-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--p-navy)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      <Sect id="how" alt eyebrow="How It Works" title="智能投顾工作原理" subtitle="AI 替代人工，5 步完成专业级资产配置">
        <ProcessFlow steps={[
          { step: '01', actor: '客户', title: '风险评估问卷',    desc: '12 题 5 分钟问卷 · 确定风险偏好' },
          { step: '02', actor: 'AI',   title: '算法生成方案',    desc: 'BlackForest 模型生成最优配置' },
          { step: '03', actor: '客户', title: '确认投资目标',    desc: '审阅配置 · 设定金额 · 一键执行' },
          { step: '04', actor: 'AI',   title: '24×7 监控市场',  desc: '实时跟踪 5000+ 资产 · 异常预警' },
          { step: '05', actor: 'AI',   title: '自动再平衡',     desc: '季度 + 重大波动时调仓 · 维持目标配置' },
        ]} />

        <div style={{ marginTop: 32, padding: 28, background: 'white', borderRadius: 10, border: '1px solid var(--p-border)' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>🔬 BlackForest 量化模型核心</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { name: '马科维茨 MPT', desc: '诺贝尔奖理论 · 有效前沿' },
              { name: 'Black-Litterman', desc: '主观观点 + 市场均衡' },
              { name: 'Monte Carlo', desc: '10,000 次模拟 · 压力测试' },
              { name: 'Risk Parity', desc: '风险均等 · 抗黑天鹅' },
            ].map(m => (
              <div key={m.name} style={{ padding: 16, background: 'var(--p-bg-section)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--p-red)', marginBottom: 4, fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      <Sect id="strategies" eyebrow="Strategies" title="5 档风险策略">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {[
            { level: 'R1 谨慎型', color: '#22c55e', exp: '4-5%', stock: 10, bond: 80, alt: 10,
              target: '保本为主 · 跑赢通胀', for: '退休客户/保守型' },
            { level: 'R2 稳健型', color: '#3b82f6', exp: '5-7%', stock: 25, bond: 65, alt: 10,
              target: '低波动 · 稳健增长', for: '中年家庭/资金保守' },
            { level: 'R3 平衡型', color: '#a855f7', exp: '7-9%', stock: 50, bond: 35, alt: 15,
              target: '风险与收益平衡', for: '中产 / 30-50 岁主力' },
            { level: 'R4 进取型', color: '#f59e0b', exp: '9-12%', stock: 70, bond: 15, alt: 15,
              target: '追求中长期增值', for: '年轻 / 长期持有' },
            { level: 'R5 激进型', color: '#ef4444', exp: '12-18%', stock: 85, bond: 5, alt: 10,
              target: '高风险高回报', for: '专业投资者' },
          ].map(s => (
            <div key={s.level} style={{ background: 'white', padding: 20, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${s.color}22`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>
                {s.level[1]}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.level}</h3>
              <p style={{ fontSize: 11, color: 'var(--p-text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{s.target}</p>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--p-navy)', marginBottom: 12 }}>{s.exp}<span style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>/年期</span></div>
              <div style={{ fontSize: 11, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: 'var(--p-text-muted)' }}>股票</span><span style={{ fontWeight: 600 }}>{s.stock}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: 'var(--p-text-muted)' }}>债券</span><span style={{ fontWeight: 600 }}>{s.bond}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span style={{ color: 'var(--p-text-muted)' }}>另类</span><span style={{ fontWeight: 600 }}>{s.alt}%</span>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: '6px 10px', background: 'var(--p-bg-section)', borderRadius: 4, fontSize: 10, color: 'var(--p-text-muted)' }}>
                💡 {s.for}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--p-text-muted)' }}>
          以上预期年化收益基于 2015-2024 历史回测，不构成未来业绩承诺。
        </div>
      </Sect>

      <Sect id="usecases" alt eyebrow="Who's It For" title="适用人群">
        <UseCaseGrid items={[
          { persona: '理财小白', icon: '🌱',
            scenario: '不懂股票/基金 · 想理财但不知从何开始',
            benefit: 'AI 一键搞定 · 无需学习',
            example: '小白用户 5 分钟问卷后立即获得专业组合 · 5 年年化 8.2%' },
          { persona: '上班族', icon: '💼',
            scenario: '工作忙碌 · 没时间盯盘 · 想长期稳健增值',
            benefit: '24×7 自动管理 · 完全省心',
            example: '某 IT 工程师 ¥10 万投入 R3 平衡型 · 3 年总收益 25%' },
          { persona: '理财进阶', icon: '📊',
            scenario: '有一定理财经验 · 希望专业化资产配置',
            benefit: '机构级配置算法 · 突破传统理财天花板',
            example: '理财老司机用 R4 进取型 · 全球分散 · 跑赢沪深 300' },
          { persona: '小额闲钱', icon: '💰',
            scenario: '闲钱 1-10 万 · 不够私人银行门槛 · 但想要专业服务',
            benefit: '1 万起投享受私行级服务',
            example: '应届毕业生 ¥30K 闲钱投入 · 比余额宝收益高 3 倍' },
          { persona: '父母养老金', icon: '👴',
            scenario: '父母退休金 · 怕风险 · 但活期太低',
            benefit: 'R1/R2 低风险产品 · 跑赢通胀',
            example: '父母 ¥200 万退休金投 R1 · 年收益 4.5% · 月领利息' },
          { persona: '子女教育金', icon: '🎓',
            scenario: '子女 5-15 年后留学 · 中长期规划',
            benefit: '长期持有 · 复利效应最大',
            example: '为 5 岁孩子规划 13 年后留学 · R3 配置 · 每月定投 ¥3000' },
        ]} />
      </Sect>

      <Sect id="process" eyebrow="Steps" title="使用流程">
        <ProcessFlow steps={[
          { step: '01', title: '完成风险评估',    desc: '12 题问卷 · 5 分钟' },
          { step: '02', title: '查看推荐组合',    desc: 'AI 生成 · 透明可解释' },
          { step: '03', title: '设定金额',       desc: '¥10K 起 · 一次性/定投' },
          { step: '04', title: '一键执行',       desc: '自动完成所有底层基金购买' },
          { step: '05', title: '持续跟踪',       desc: 'App 实时查看 · 月报推送' },
        ]} />
      </Sect>

      <Sect id="case" alt eyebrow="Performance" title="历史业绩">
        <CaseStudy
          company="李女士 (互联网公司中层)"
          logo="📈"
          industry="35 岁 · 上海 · 月薪 ¥35K · 智能投顾 5 年老客户"
          challenge="2019 年李女士有 ¥30 万闲钱，原本放在余额宝 (年化 2.5%)。希望提升收益但又不敢自己炒股 (担心亏损)。咨询过多家银行的传统理财，要么收益不到 4%，要么门槛 ¥100 万 起。"
          solution="BankerOS 推荐智能投顾。完成风险评估后系统判定为 R3 平衡型客户，配置：50% 全球股票指数 (沪深 300 + 标普 500 + 港股恒生) · 35% 高等级债券 · 15% 黄金/REITs 另类配置。"
          results={[
            { metric: '5 年累计收益', value: '+58.4%' },
            { metric: '年化收益', value: '9.6%' },
            { metric: '最大回撤', value: '12.3%' },
            { metric: '夏普比率', value: '1.42' },
          ]}
          quote="智能投顾让我这个理财小白也能享受到机构级别的资产配置。2022 年市场大跌时，AI 帮我自动加仓债券和黄金，反而抓住了反弹机会。5 年下来 30 万变 47.5 万。"
          quoteAuthor="李女士 · BankerOS 智能投顾 5 年客户"
        />
      </Sect>

      <Sect id="fees" eyebrow="Pricing" title="费率说明">
        <PricingTable fees={[
          { item: '管理费',  amount: '0.5%/年', note: '按日计提 · 行业最低 (传统理财 1-2%)' },
          { item: '申购费',  amount: '免',     note: '同业一般 0.6-1.5%' },
          { item: '赎回费',  amount: '持有 >1 年免', note: '<1 年收 0.5%' },
          { item: '调仓费',  amount: '免',     note: 'AI 自动调仓不收任何额外费用' },
          { item: '业绩报酬', amount: '免',     note: '无超额收益分成 (对冲基金常规 20%)' },
          { item: '账户管理费', amount: '免',   note: '无月费' },
        ]} />

        <div style={{ marginTop: 24, padding: 24, background: 'linear-gradient(135deg, var(--p-success), #047857)', color: 'white', borderRadius: 10 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>💡 费率对比</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { name: 'BankerOS 智能投顾', cost: '0.5%/年', color: 'white' },
              { name: '传统银行理财',     cost: '1.5%/年', color: 'rgba(255,255,255,0.7)' },
              { name: '私人银行',         cost: '2.0%/年 + 业绩分成', color: 'rgba(255,255,255,0.7)' },
            ].map(p => (
              <div key={p.name} style={{ padding: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: p.color }}>{p.cost}</div>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      <Sect id="faq" alt eyebrow="FAQ" title="常见问题">
        <FaqAccordion items={[
          { q: '智能投顾会亏损吗？', a: '会。任何投资都有风险，即使是 R1 谨慎型，也可能短期出现 1-3% 回撤。但长期（3-5 年以上）历史数据显示获得正收益概率超 90%。建议持有期 ≥ 3 年。' },
          { q: 'AI 能跑赢人工基金经理吗？', a: '过去 10 年数据显示：80% 的主动管理基金跑不赢指数。AI 智能投顾通过分散全球配置 + 低成本 + 自动再平衡，长期表现稳定优于大多数主动基金。' },
          { q: '调仓频率如何决定？', a: 'AI 每天监控市场，触发调仓的条件：① 季度定期调仓 (维持目标配置)；② 单一资产偏离目标 5% 以上；③ 黑天鹅事件 (VIX 突破 30 等)。年均调仓 4-6 次。' },
          { q: '能否中途修改风险等级？', a: '可以。在 App 内重新做风险评估即可。系统会在新评估后的下一个调仓周期 (最多 5 个工作日) 自动调整为新策略。' },
          { q: '相比直接买基金有什么优势？', a: '① 专业组合 (不止买一只基金)；② 自动再平衡 (人工很难做到)；③ 全球分散 (单独买海外基金成本高)；④ 业绩报告自动生成；⑤ 一键调仓 (避免逐只赎回)。' },
          { q: '如果遇到极端市场怎么办？', a: 'AI 内置压力测试机制。2020 年新冠、2022 年加息周期中，BlackForest 算法在 R3 组合中提前增配现金和黄金 5%，最大回撤控制在 -8% 以内 (沪深 300 同期 -22%)。' },
          { q: '资金安全吗？', a: '极其安全。① 资金存于客户独立托管账户 (非 BankerOS 自有资金)；② 底层资产为公募基金 (受证监会监管)；③ 即使 BankerOS 经营变化，客户资产可完整赎回。' },
        ]} />
      </Sect>

      <section className="p-section" style={{ background: 'linear-gradient(135deg, var(--p-navy), #a855f7)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>AI 让理财变简单</h2>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 28 }}>¥10,000 起投 · 0.5% 管理费 · 5 分钟问卷开始</p>
          <a href="/login" className="p-btn" style={{ background: '#ffba00', color: '#000', padding: '14px 36px', fontWeight: 700, fontSize: 14 }}>开始投资 →</a>
        </div>
      </section>
    </ProductDetailPage>
  );
}
