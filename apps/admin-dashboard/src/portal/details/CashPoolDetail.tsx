/**
 * Detail page: Cash Pool / 资金池
 * Benchmarked: HSBC Liquidity Management / Citi Treasury & Trade Solutions
 */

import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy, FaqAccordion,
} from '../ProductDetailPage';

export default function CashPoolDetail() {
  return (
    <ProductDetailPage
      breadcrumbs={[
        { label: '企业银行' },
        { label: '现金管理', to: '/products/business/cash-management' },
        { label: '集团资金池' },
      ]}
      sections={[
        { id: 'overview',  label: '什么是资金池' },
        { id: 'types',     label: '池类型对比' },
        { id: 'benefits',  label: '核心收益' },
        { id: 'usecases',  label: '适用场景' },
        { id: 'structure', label: '架构图' },
        { id: 'case',      label: '客户案例' },
        { id: 'faq',       label: '常见问题' },
      ]}
      hero={{
        badge: '财务转型核心 · 服务 7,200 集团',
        category: 'Cash Pooling',
        productName: '集团资金池',
        tagline: '将分散的集团资金集中管理 — 提升资金使用效率 30%+，降低借款成本 40%+',
        bullets: [
          '物理 / 名义 / 目标余额 3 种方案',
          '最多支持 7 级层级 (跨国集团)',
          '12 种币种轧差计算',
          '实时归集 + 定时归集双模式',
          '与 SAP / Oracle / Kingdee 直连',
          '配套智能预测 + 反欺诈',
        ],
        background: 'navy',
        ctaPrimary: { label: '预约方案咨询 →', to: '/help' },
      }}>

      <Sect id="overview" eyebrow="What is Cash Pool" title="什么是集团资金池">
        <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 20 }}>
          <strong>资金池 (Cash Pool)</strong> 是将集团内多个法人/分公司/账户的资金<strong>集中归集</strong>到一个或多个<strong>主账户</strong>的现金管理工具。
          目的是<strong>消除内部资金孤岛</strong> — 避免一边公司账户上有大量闲置资金获得低息存款，另一边却需要从外部高息借款的情况。
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'rgba(239,68,68,0.05)', padding: 24, borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-red)', marginBottom: 12 }}>❌ 没有资金池</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'A 子公司账户 ¥1000 万闲置 · 仅活期利息 0.2%',
                'B 子公司同时从外部银行借款 ¥800 万 · 利率 5%',
                '年利息净支出 = (5% - 0.2%) × 800万 = ¥38.4 万',
                '财务部需手动跟踪 30+ 账户余额',
                '集团总裁无法实时了解全集团资金状况',
              ].map(p => (
                <li key={p} style={{ display: 'flex', gap: 8, padding: '6px 0', fontSize: 13, color: 'var(--p-text-soft)' }}>
                  <span style={{ color: 'var(--p-red)' }}>✗</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.05)', padding: 24, borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-success)', marginBottom: 12 }}>✅ 使用 BankerOS 资金池</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'A 子公司 ¥1000 万自动归集至总部主账户',
                'B 子公司从总部内部调拨 ¥800 万 (内部利率 1.5%)',
                '年内部利息收益 ¥12 万 + 节省外部借款息 ¥28 万',
                '财务部仪表盘看全集团 30+ 账户实时余额',
                '集团总裁手机 App 查看现金流',
              ].map(p => (
                <li key={p} style={{ display: 'flex', gap: 8, padding: '6px 0', fontSize: 13, color: 'var(--p-text-soft)' }}>
                  <span style={{ color: 'var(--p-success)' }}>✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sect>

      <Sect id="types" alt eyebrow="Pool Types" title="3 种资金池架构">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { name: '物理资金池 (Zero Balancing)', icon: '⬆️', color: '#002966',
              desc: '日终自动将子账户余额清零归集至主账户。次日子账户有需要时自动从主账户拨款。资金实际发生转移。',
              pros: ['资金高度集中', '便于统一调拨', '总部精确控制'],
              cons: ['影响子公司流动性', '需要跨账户转账记录'],
              fit: '严格集中管理的集团 · 国内单一法人' },
            { name: '名义资金池 (Notional)', icon: '🔀', color: '#ffba00',
              desc: '不发生实际资金转移，但银行按集团所有账户净额计算利息。子公司账户保留独立性，账面余额不变。',
              pros: ['保留子公司独立性', '不影响日常运营', '适合跨法人 / 跨国'],
              cons: ['需银行支持', '某些国家有合规限制'],
              fit: '跨法人集团 · 跨国公司 · 合资企业' },
            { name: '目标余额池 (Target Balancing)', icon: '🎯', color: '#a855f7',
              desc: '子账户始终维持设定的目标余额 (如 ¥500 万)，溢出/不足自动从主账户清扫/补充。',
              pros: ['保留运营资金', '兼顾灵活性', '减少调度频率'],
              cons: ['不如物理池高效', '设置较复杂'],
              fit: '分行 / 子公司需要保留运营资金' },
          ].map(p => (
            <div key={p.name} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{p.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: p.color, marginBottom: 12 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-success)', marginBottom: 6 }}>优势</div>
                {p.pros.map(x => <div key={x} style={{ fontSize: 12, color: 'var(--p-text-soft)', padding: '3px 0' }}>✓ {x}</div>)}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-warn)', marginBottom: 6 }}>劣势</div>
                {p.cons.map(x => <div key={x} style={{ fontSize: 12, color: 'var(--p-text-soft)', padding: '3px 0' }}>⚠ {x}</div>)}
              </div>

              <div style={{ padding: '8px 12px', background: 'var(--p-bg-section)', borderRadius: 4, fontSize: 11, color: 'var(--p-text-muted)' }}>
                💡 适合: {p.fit}
              </div>
            </div>
          ))}
        </div>
      </Sect>

      <Sect id="benefits" eyebrow="Benefits" title="4 大核心收益">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {[
            { title: '💰 降低融资成本',
              value: '↓ 40%',
              desc: '消除集团内部"一边存款一边借款"的低效状况。通常可将外部融资规模降低 30-50%。',
              example: '某集团 ¥30 亿外债减至 ¥18 亿，年节省利息支出 ¥6,000 万。' },
            { title: '📈 提升存款收益',
              value: '↑ 80%',
              desc: '主账户余额变大后议价能力提升，可获得超出活期 5-10 倍的协议存款利率。',
              example: '集团 ¥10 亿主账户存款利率从 0.2% 提升至 1.8%，年增收 ¥1,600 万。' },
            { title: '⚡ 提升现金流可视性',
              value: '↑ 100%',
              desc: '财务总监一个仪表盘看全集团实时资金状况，告别 Excel 跨表统计。',
              example: '财务部对账时间从 20 天/月缩短至 1 天/月，节省 4 名 FTE。' },
            { title: '🛡 强化合规风控',
              value: '↑ 200%',
              desc: '统一审批流程 + Maker-Checker 双人复核 + AI 反欺诈，杜绝资金挪用。',
              example: '某集团曾因子公司挪用 ¥800 万被审计发现 · 池化后此类事件 0 发生。' },
          ].map(b => (
            <div key={b.title} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)' }}>{b.title}</h3>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--p-success)' }}>{b.value}</div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, marginBottom: 12 }}>{b.desc}</p>
              <div style={{ background: 'var(--p-bg-section)', padding: 12, borderRadius: 4, fontSize: 12, color: 'var(--p-text-muted)' }}>
                💡 实例: {b.example}
              </div>
            </div>
          ))}
        </div>
      </Sect>

      <Sect id="usecases" alt eyebrow="Who's It For" title="适用场景">
        <UseCaseGrid items={[
          { persona: '跨国集团', icon: '🌍',
            scenario: '全球 N 国分公司 · 各持本地币种账户 · 需要全球资金调度',
            benefit: '名义资金池跨币种轧差 · 节省外汇及内部资金成本',
            example: '某科技集团 12 国 38 家子公司 · 总部仪表盘看全球现金' },
          { persona: '总分结构集团', icon: '🏛',
            scenario: '总部 + 多个事业部 / 分公司 · 资金集中管理',
            benefit: '物理池自动清扫 · 每日总部确切了解全集团现金',
            example: '制造业集团 · 30+ 分公司日终自动归集至总部' },
          { persona: '快速成长企业', icon: '🚀',
            scenario: '多轮融资后子公司增多 · 财务管理复杂度激增',
            benefit: '统一管理 + 标准流程 + 风控全覆盖',
            example: 'Pre-IPO 阶段企业 · 整合 10 家子公司财务' },
          { persona: '上市公司', icon: '📊',
            scenario: '合规要求 · 投资者关注 · 需要严格的资金管控',
            benefit: 'Maker-Checker 双人复核 · 满足 SOX 要求',
            example: 'A 股上市公司 · 满足证监会内控规范' },
          { persona: '贸易型企业', icon: '🚢',
            scenario: '收付频繁 · 多币种结算 · 应收应付管理复杂',
            benefit: '与 ERP 直连 · 自动对账 · 现金流预测',
            example: '大宗贸易公司 · ERP 对账自动化 95%' },
          { persona: '连锁经营', icon: '🏪',
            scenario: '大量分店 · POS 收款分散 · 需要每日资金归集',
            benefit: 'T+0 实时归集 · 总部当日确认营业收入',
            example: '某连锁餐饮 · 500 家门店每日营收实时入主账户' },
        ]} />
      </Sect>

      <Sect id="structure" eyebrow="Architecture" title="架构图">
        <div style={{ background: 'white', padding: 40, borderRadius: 12, border: '1px solid var(--p-border)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 20, textAlign: 'center' }}>4 级层级 · 多币种 · 实时归集</h3>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* Level 1: HQ */}
            <div style={{ background: 'var(--p-navy)', color: 'white', padding: '16px 32px', borderRadius: 10, fontWeight: 700, fontSize: 16 }}>
              🏛 集团总部主账户 (CNY)
            </div>
            <div style={{ color: 'var(--p-text-muted)' }}>↑↓ 实时归集</div>

            {/* Level 2: Regional HQs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%', maxWidth: 800 }}>
              {[
                { name: '中国区域中心', currency: 'CNY', color: 'var(--p-red)' },
                { name: '欧洲区域中心', currency: 'EUR', color: '#3b82f6' },
                { name: '美洲区域中心', currency: 'USD', color: '#ffba00' },
              ].map(r => (
                <div key={r.name} style={{ background: r.color, color: 'white', padding: '12px 16px', borderRadius: 8, textAlign: 'center', fontWeight: 600, fontSize: 13 }}>
                  {r.name}<br /><span style={{ fontSize: 11, opacity: 0.8 }}>({r.currency})</span>
                </div>
              ))}
            </div>

            <div style={{ color: 'var(--p-text-muted)' }}>↑↓</div>

            {/* Level 3: Subsidiaries */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, width: '100%', maxWidth: 800 }}>
              {[
                '北京', '上海', '深圳',
                '伦敦', '法兰克福', '巴黎',
                '纽约', '旧金山',
              ].slice(0, 8).map(c => (
                <div key={c} style={{ background: 'var(--p-bg-section)', padding: '8px 12px', borderRadius: 6, textAlign: 'center', fontSize: 11, color: 'var(--p-text-soft)', border: '1px solid var(--p-border)' }}>
                  📍 {c}
                </div>
              ))}
            </div>

            <div style={{ color: 'var(--p-text-muted)' }}>↑↓</div>

            {/* Level 4: Operation accounts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8, width: '100%', maxWidth: 800 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: 'white', padding: '6px', borderRadius: 4, textAlign: 'center', fontSize: 10, color: 'var(--p-text-muted)', border: '1px dashed var(--p-border)' }}>
                  💳 子账户 {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--p-bg-section)', borderRadius: 8, fontSize: 13, color: 'var(--p-text-soft)' }}>
            <strong style={{ color: 'var(--p-navy)' }}>资金流向：</strong> 子账户余额自动向上汇总至区域中心 → 区域中心向总部主账户归集 → 总部统一调度。
            <br /><strong style={{ color: 'var(--p-navy)' }}>跨币种处理：</strong> 名义池模式下，多币种按央行中间价折算 CNY 计算综合利息。
          </div>
        </div>
      </Sect>

      <Sect id="case" alt eyebrow="Case Study" title="客户成功案例">
        <CaseStudy
          company="ACME 国际制造集团 (虚拟示例)"
          logo="🏭"
          industry="全球制造业 · 年营收 ¥800 亿 · 12 国 38 家子公司"
          challenge="ACME 集团旗下子公司原本各自在不同银行开户，财务总监每月要从 16 家银行收集对账单。 集团总资金规模 ¥120 亿，但分散在 200+ 个账户。一边是国内子公司账户上有 ¥30 亿低息存款 (0.2%-1.5%)，另一边是海外子公司持续从当地银行借款 ¥25 亿，年利率高达 4.5%-6.8%。年净利息支出超 ¥1.5 亿。"
          solution="BankerOS 设计三层资金池架构：① 中国区域物理资金池 (8 家子公司日终归集)；② 欧美区域名义资金池 (合规约束跨国资金转移)；③ 总部级跨币种轧差计算。配套智能预测 + ERP 自动对账 + Maker-Checker 风控流程。"
          results={[
            { metric: '外部融资规模', value: '↓ 60%' },
            { metric: '年利息节省', value: '¥ 9,200 万' },
            { metric: '对账人力节省', value: '5 FTE' },
            { metric: '资金可视性', value: 'T+0' },
          ]}
          quote="原本以为资金池就是个技术工具，没想到真正落地后给我们带来的是财务组织的全面升级。 BankerOS 团队不仅给方案，还协助我们重新设计了 IFS、应付账款、现金预测的全流程。"
          quoteAuthor="陈总 · ACME 集团 CFO"
        />
      </Sect>

      <Sect id="faq" eyebrow="FAQ" title="常见问题">
        <FaqAccordion items={[
          { q: '资金池需要多少账户才划算？', a: '一般 5 个账户以上即可显著受益。10 个账户以上效益更显著，能节省 60% 以上的内部资金成本。BankerOS 起步价位适合 ¥5,000 万总资金以上的集团客户。' },
          { q: '跨法人之间资金转移合规吗？', a: '物理资金池涉及跨法人转移需视同"内部借贷"，要签订借款协议并按市场利率定价 (转让定价合规)。名义资金池不发生实际转移，合规性最高。' },
          { q: '跨国资金池有外汇管制问题吗？', a: '中国的外汇管制下，跨境资金池需要走"跨境资金集中运营管理"通道 (国家外汇管理局批准)。BankerOS 协助办理资质 (3-6 个月)，已为 200+ 家集团成功落地。' },
          { q: '与 ERP 系统怎么对接？', a: '提供 RESTful API + ISO 20022 标准报文 + Host-to-Host 文件传输 3 种方式。已预集成 SAP、Oracle、Kingdee、用友 4 大主流 ERP，对接周期 4-8 周。' },
          { q: '资金池有什么风险？', a: '主要风险：① 总部账户被冻结影响全集团 (对策：分散多家银行)；② 子公司过度依赖集团调拨 (对策：保留底线流动性)；③ 跨境合规风险 (对策：与 BankerOS 合规团队定期审视)。' },
          { q: '能否中途修改池配置？', a: '可以。增减子账户、调整目标余额、修改归集规则均可在 1-3 个工作日内完成。重大架构调整 (如物理转名义) 需 2-4 周项目实施。' },
        ]} />
      </Sect>

      <section className="p-section" style={{ background: 'var(--p-navy)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>为您的集团定制资金池</h2>
          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28 }}>资深现金管理专家 30 分钟内回电 · 免费方案设计</p>
          <a href="/help" className="p-btn" style={{ background: '#ffba00', color: '#000', padding: '14px 36px', fontWeight: 700, fontSize: 14 }}>预约专家咨询 →</a>
        </div>
      </section>
    </ProductDetailPage>
  );
}
