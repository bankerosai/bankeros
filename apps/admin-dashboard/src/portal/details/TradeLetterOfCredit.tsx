/**
 * Trade Finance L/C deep dive
 * Benchmarked: HSBC Trade Solutions / Standard Chartered Documentary Trade / 招行 国际业务
 */

import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy, FaqAccordion, PricingTable,
} from '../ProductDetailPage';

export default function TradeLetterOfCredit() {
  return (
    <ProductDetailPage
      breadcrumbs={[
        { label: '企业银行' },
        { label: '贸易融资', to: '/products/business/trade-finance' },
        { label: '跟单信用证 L/C' },
      ]}
      sections={[
        { id: 'overview',  label: '什么是 L/C' },
        { id: 'types',     label: '产品类型' },
        { id: 'usecases',  label: '适用场景' },
        { id: 'structure', label: '交易结构' },
        { id: 'process',   label: '业务流程' },
        { id: 'case',      label: '客户案例' },
        { id: 'fees',      label: '费率说明' },
        { id: 'faq',       label: '常见问题' },
      ]}
      hero={{
        badge: 'UCP 600 国际通行',
        category: 'Documentary Letter of Credit',
        productName: '跟单信用证 L/C',
        tagline: '全球贸易最受信赖的支付与融资工具 · 银行信用替代商业信用 · 保障买卖双方利益',
        bullets: [
          'UCP 600 / ISBP 745 国际标准',
          '与全球 60+ 主要贸易港直连',
          'SWIFT MT700 / MT705 报文',
          '在线开立 · 4 小时审批',
          '配套押汇/福费廷融资',
          '币种覆盖 USD/EUR/GBP/JPY 等 12 种',
        ],
        background: 'navy',
        ctaPrimary: { label: '在线开立 L/C →', to: '/login' },
        ctaSecondary: { label: '咨询贸易专家', to: '/help' },
      }}>

      {/* ───── Overview ───── */}
      <Sect id="overview" eyebrow="What is L/C" title="什么是跟单信用证？"
        subtitle="国际贸易最经典的银行信用工具 — 让陌生的买卖双方安心达成交易">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 16 }}>
              <strong>跟单信用证 (Documentary Letter of Credit, L/C)</strong> 是国际贸易中应用最广泛的结算方式之一。
              它是由<strong>开证银行（通常为进口商所在地银行）</strong>应进口商申请，向出口商开立的、保证在符合
              信用证条款的前提下付款的<strong>书面承诺</strong>。
            </p>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 16 }}>
              通俗地说：买家不信任卖家敢不敢发货，卖家不信任买家会不会付款，于是请<strong>两家银行做担保</strong>。
              卖家发货后只需提交符合 L/C 条款的<strong>单据</strong>（提单、发票、保险单等），即可立即收款，
              无需等待买家实际付款。
            </p>

            <div style={{ background: 'rgba(0,41,102,0.05)', borderLeft: '4px solid var(--p-navy)', padding: 16, borderRadius: 4 }}>
              <h4 style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8, fontSize: 14 }}>📜 国际惯例</h4>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', margin: 0, lineHeight: 1.6 }}>
                BankerOS 信用证业务遵守国际商会 ICC 制定的 <strong>UCP 600</strong> (跟单信用证统一惯例) 和
                <strong> ISBP 745</strong> (国际标准银行实务) — 全球 175+ 国家银行通用标准。
              </p>
            </div>
          </div>

          <div style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>关键参数</h4>
            {[
              ['国际标准', 'UCP 600 / ISBP 745'],
              ['报文规范', 'SWIFT MT700 / MT705'],
              ['最低金额', 'USD 10,000 等值'],
              ['最高金额', '不设上限'],
              ['有效期',   '通常 90-180 天'],
              ['币种',     'USD/EUR/GBP/JPY 等'],
              ['开证时间', '4 小时-1 工作日'],
              ['交单审核', '5 个工作日内'],
              ['承兑/付款', '收单后立即'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-border)', fontSize: 12 }}>
                <span style={{ color: 'var(--p-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--p-navy)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      {/* ───── L/C Types ───── */}
      <Sect id="types" alt eyebrow="Product Types" title="信用证主要类型" subtitle="根据贸易特性选择合适的 L/C 类型">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {[
            { name: '即期信用证 (Sight L/C)', use: '出口商交单后银行立即付款',
              pros: ['出口商立即收款', '资金回笼最快', '减少信用风险'],
              suitable: '出口商优先选择 · 与新客户首次交易' },
            { name: '远期信用证 (Usance L/C)', use: '银行承兑后约定时间付款 (30/60/90/180 天)',
              pros: ['进口商有融资期', '可用于福费廷融资', '降低短期资金压力'],
              suitable: '大额耐用品 (机械/设备) · 长账期客户' },
            { name: '可转让信用证 (Transferable L/C)', use: '允许中间商将权利转让给最终供应商',
              pros: ['适用于中间贸易商', '一证多供应商', '保护商业机密'],
              suitable: '中间商/经销商 · 转口贸易' },
            { name: '循环信用证 (Revolving L/C)', use: '使用后自动恢复至原金额',
              pros: ['长期固定供应关系', '降低重复开证成本', '简化操作流程'],
              suitable: '长期稳定的大宗商品贸易' },
            { name: '背对背信用证 (Back-to-Back L/C)', use: '以原 L/C 为担保再开新 L/C',
              pros: ['中间商无需垫付资金', '保护客户与供应商关系'],
              suitable: '出口加工 · 转口贸易' },
            { name: '红条款信用证 (Red Clause L/C)', use: '允许出口商在装运前预支部分货款',
              pros: ['出口商可获得装运前融资', '增强商业灵活性'],
              suitable: '需要采购原材料的出口商' },
          ].map(t => (
            <div key={t.name} style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 10 }}>{t.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', marginBottom: 14, lineHeight: 1.6 }}>{t.use}</p>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-success)', marginBottom: 6 }}>核心优势</div>
                {t.pros.map(p => (
                  <div key={p} style={{ fontSize: 12, color: 'var(--p-text-soft)', padding: '3px 0' }}>✓ {p}</div>
                ))}
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--p-bg-section)', borderRadius: 4, fontSize: 11, color: 'var(--p-text-muted)' }}>
                💡 适合: {t.suitable}
              </div>
            </div>
          ))}
        </div>
      </Sect>

      {/* ───── Use Cases ───── */}
      <Sect id="usecases" eyebrow="Who's It For" title="典型适用场景">
        <UseCaseGrid items={[
          { persona: '进口商', icon: '📦',
            scenario: '从海外采购大宗设备/原材料，与卖家首次合作或交易金额较大',
            benefit: '只在收到符合要求的单据时银行才付款，保障货物质量',
            example: '某机械制造商首次从德国采购精密设备 €500K，使用 L/C 保障收到合格设备后才付款' },
          { persona: '出口商', icon: '🚢',
            scenario: '出口商品至海外新客户，担心买家不付款的风险',
            benefit: '银行信用替代买家信用，无须担心买家违约',
            example: '中国电子厂商出口至非洲新客户 USD 200K，L/C 保障发货后银行担保付款' },
          { persona: '中间贸易商', icon: '🔄',
            scenario: '撮合海外买卖双方，但不希望双方互相知道身份',
            benefit: '可转让信用证保护客户与供应商关系，无需垫付资金',
            example: '香港贸易公司撮合美国客户与越南工厂，使用 Back-to-Back L/C 完美撮合' },
          { persona: '大宗商品贸易', icon: '🛢',
            scenario: '原油/铁矿石/粮食等大宗商品长期固定供应',
            benefit: '循环信用证减少开证成本，简化业务流程',
            example: '某能源公司每月固定从中东进口原油 USD 5M，使用 Revolving L/C 自动循环' },
          { persona: '资金紧张的进口商', icon: '💰',
            scenario: '需要采购设备但短期资金不足',
            benefit: '远期 L/C 提供 90-180 天信用期，缓解资金压力',
            example: '某制造企业进口生产线 USD 2M，180 天远期 L/C，缓解半年现金流压力' },
          { persona: '出口加工企业', icon: '🏭',
            scenario: '收到出口订单但缺乏采购原材料的资金',
            benefit: '红条款 L/C 允许装运前预支部分货款',
            example: '服装出口企业接到 USD 500K 订单，红条款 L/C 提前支取 30% 用于原材料采购' },
        ]} />
      </Sect>

      {/* ───── Structure (visual) ───── */}
      <Sect id="structure" alt eyebrow="Transaction Structure" title="交易结构图" subtitle="L/C 涉及 5 个主要参与方 — 一张图看懂资金流与单据流">
        <div style={{ background: 'white', padding: 40, borderRadius: 12, border: '1px solid var(--p-border)' }}>
          {/* Diagram */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, background: 'var(--p-red)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 10px' }}>📦</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)' }}>进口商<br />(Applicant)</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 4 }}>申请开立 L/C</div>
            </div>

            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: 13, color: 'var(--p-text-muted)', marginBottom: 6 }}>↔</div>
              <div style={{ width: 100, height: 100, background: 'var(--p-navy)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 10px' }}>🏦</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)' }}>开证行<br />(Issuing Bank)</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 4 }}>BankerOS</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>↕ SWIFT MT700</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, background: 'var(--p-success)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 10px' }}>🚢</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)' }}>出口商<br />(Beneficiary)</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 4 }}>提交单据领款</div>
            </div>
          </div>

          {/* Secondary parties */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 60, paddingTop: 32, borderTop: '1px solid var(--p-border)' }}>
            {[
              { icon: '✉️', name: '通知行 (Advising Bank)', role: '通知出口商收到 L/C', detail: '出口地银行 (Cathay/HSBC)' },
              { icon: '✔️', name: '保兑行 (Confirming Bank)', role: '为开证行付款义务再担保', detail: '可选 · 增加保障' },
              { icon: '💳', name: '议付行 (Negotiating Bank)', role: '审核单据后向出口商付款', detail: '通常即通知行' },
            ].map(p => (
              <div key={p.name} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 4 }}>{p.name}</h4>
                <div style={{ fontSize: 11, color: 'var(--p-text-soft)', marginBottom: 4 }}>{p.role}</div>
                <div style={{ fontSize: 11, color: 'var(--p-text-muted)', fontStyle: 'italic' }}>{p.detail}</div>
              </div>
            ))}
          </div>

          {/* Flow legend */}
          <div style={{ marginTop: 32, padding: 20, background: 'var(--p-bg-section)', borderRadius: 8 }}>
            <h4 style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14, fontSize: 13 }}>资金流 / 单据流方向</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 12, color: 'var(--p-text-soft)' }}>
              <div>
                <strong style={{ color: 'var(--p-red)' }}>① 单据流：</strong> 出口商 → 议付行 → 开证行 → 进口商
              </div>
              <div>
                <strong style={{ color: 'var(--p-success)' }}>② 资金流：</strong> 进口商 → 开证行 → 议付行 → 出口商
              </div>
            </div>
          </div>
        </div>
      </Sect>

      {/* ───── Process Flow ───── */}
      <Sect id="process" eyebrow="Business Flow" title="L/C 业务全流程" subtitle="从签合同到结算，8 步标准流程">
        <ProcessFlow steps={[
          { step: '01', actor: '进出口商', title: '签订贸易合同',    desc: '约定使用 L/C 结算 · 明确金额/期限/条款' },
          { step: '02', actor: '进口商',   title: '申请开立 L/C',   desc: '向开证行 (BankerOS) 提交开证申请' },
          { step: '03', actor: '开证行',   title: '开立 L/C',       desc: 'SWIFT MT700 发送至通知行' },
          { step: '04', actor: '出口商',   title: '收到 L/C 并发货', desc: '审核条款无误 · 按约定发货并取得提单' },
          { step: '05', actor: '出口商',   title: '提交单据',       desc: '提单/发票/保险单/检验证书等' },
          { step: '06', actor: '议付行',   title: '审单议付',       desc: '审核单据 · 符合 L/C 即付款' },
          { step: '07', actor: '开证行',   title: '审单并通知付款', desc: '复审单据 · 通知进口商付款' },
          { step: '08', actor: '进口商',   title: '付款赎单',       desc: '付款给开证行 · 取得单据提货' },
        ]} />
      </Sect>

      {/* ───── Case Study ───── */}
      <Sect id="case" alt eyebrow="Customer Success" title="客户成功案例">
        <CaseStudy
          company="苏州精密机械有限公司"
          logo="🏭"
          industry="高端制造 · 年出口额 USD 80M · 出口德/美/日"
          challenge="2023 年公司接到德国 BMW 一笔 €4.2M 精密零部件订单，但 BMW 财务部要求 180 天付款。公司面临两大挑战：1) BMW 虽是全球巨头但首次合作信用未建立；2) 半年账期对公司现金流压力巨大。"
          solution="BankerOS 设计：BMW 申请开立 180 天远期信用证，苏州公司收到 L/C 后立即发货。发货后 30 天，苏州公司将 L/C 项下应收款卖给 BankerOS (福费廷 Forfaiting)，立即获得 €4.1M 资金 (扣除贴现息)，无追索权。"
          results={[
            { metric: '提前回款', value: '150 天' },
            { metric: '资金成本', value: 'EURIBOR + 80bp' },
            { metric: '订单金额', value: '€ 4.2M' },
            { metric: '后续合作', value: '5 年长期' },
          ]}
          quote="BankerOS 的贸易融资团队让我们既保住了 BMW 这个大客户，又解决了现金流问题。福费廷无追索权这一点尤为重要 — 即使将来 BMW 出现支付问题，我们也不承担风险。"
          quoteAuthor="李总 · 苏州精密机械 CFO"
        />
      </Sect>

      {/* ───── Pricing ───── */}
      <Sect id="fees" eyebrow="Pricing" title="费率说明">
        <PricingTable fees={[
          { item: '开证费',     amount: '0.125%', note: '按 L/C 金额计 · 最低 ¥ 500' },
          { item: '改证费',     amount: '¥ 300/笔', note: '不改金额/有效期的次要修改' },
          { item: '改证费 (重大)', amount: '0.05%', note: '修改金额或有效期 · 按增减金额计' },
          { item: '通知费',     amount: 'USD 50/笔', note: '通知行收取' },
          { item: '议付费',     amount: '0.1%',  note: '议付行收取 · 最低 USD 50' },
          { item: '保兑费',     amount: '0.15-0.25%/季', note: '根据进口商所在国风险等级' },
          { item: '不符点费',   amount: 'USD 75-150/项', note: '出口商单据不符时收取' },
          { item: '远期承兑费', amount: '0.05%/月', note: '远期信用证适用' },
          { item: '押汇利率',   amount: 'LIBOR + 50bp', note: '出口商需要立即收款时' },
        ]} />
      </Sect>

      {/* ───── FAQ ───── */}
      <Sect id="faq" alt eyebrow="FAQ" title="常见问题">
        <FaqAccordion items={[
          { q: 'L/C 与电汇 (T/T) 相比哪个更好？', a: 'T/T 操作简单费用低，适合长期信任的合作伙伴。L/C 保障性更强 (有银行信用)，适合新客户、大额交易或政治风险较高的国家。一般大宗商品和首次交易首选 L/C。' },
          { q: '开立 L/C 需要预存货款吗？', a: '通常需要缴存 10-30% 保证金 (具体根据进口商资信)。优质客户可获得 0 保证金的"无押金开证"额度。如使用银行授信，也可全额融资开证。' },
          { q: '出口商单据有不符点会怎样？', a: '开证行会通知进口商决定是否接受。如接受则继续付款。如拒绝则单据会被退回出口商。每项不符点收取 USD 75-150 不符点费。BankerOS 提供"单据预审"服务，帮助出口商避免不符点。' },
          { q: 'L/C 多久能开立？', a: '简单 L/C 在收齐资料后 4 小时-1 个工作日开立。复杂条款 (背对背/可转让等) 需 2-3 个工作日。Premier 客户走快速通道，2 小时内开立。' },
          { q: '可以撤销已开立的 L/C 吗？', a: 'UCP 600 默认所有 L/C 均为不可撤销 (Irrevocable)。开立后未经受益人 (出口商) 同意不得撤销。如需撤销必须经受益人书面同意。' },
          { q: 'BankerOS L/C 的优势是什么？', a: '① 与全球 60+ 主要贸易港直连； ② SWIFT GPI 全程可追踪； ③ 在线开证系统 24×7 可申请； ④ 配套押汇/福费廷/保理一站式融资； ⑤ 资深贸易专家 1v1 咨询。' },
        ]} />
      </Sect>

      <section className="p-section" style={{ background: 'var(--p-navy)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>开启全球贸易之旅</h2>
          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28 }}>资深贸易专家 30 分钟内回电 · 4 小时极速开证</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/login" className="p-btn" style={{ background: '#ffba00', color: '#000', padding: '14px 36px', fontWeight: 700, fontSize: 14 }}>在线开立 L/C →</a>
            <a href="/help" className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white', padding: '14px 36px', fontSize: 14 }}>咨询贸易专家</a>
          </div>
        </div>
      </section>
    </ProductDetailPage>
  );
}
