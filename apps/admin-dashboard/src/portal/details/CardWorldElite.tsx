/**
 * Card detail page: 环球白金信用卡 (World Elite Platinum)
 * Benchmarked against HSBC Premier MasterCard / 招行 AE 白 / 渣打 Visa Infinite
 */

import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy,
  FaqAccordion, PricingTable,
} from '../ProductDetailPage';

const cardVisual = (
  <div style={{
    background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
    borderRadius: 16, padding: 32, color: 'white',
    aspectRatio: '1.586', position: 'relative',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
    maxWidth: 420, margin: '0 auto',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.16em', textTransform: 'uppercase' }}>BankerOS</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>环球白金信用卡</div>
        <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>World Elite Platinum</div>
      </div>
      <div style={{ fontSize: 36, color: '#ffba00' }}>👑</div>
    </div>

    {/* Chip */}
    <div style={{ width: 44, height: 32, background: 'linear-gradient(135deg, #c0c0c0, #888)', borderRadius: 5, marginTop: 32 }} />

    {/* Card number */}
    <div style={{ marginTop: 16, fontSize: 18, fontFamily: 'monospace', letterSpacing: '0.18em', opacity: 0.92 }}>
      4889 ••• ••• 8801
    </div>

    {/* Bottom row */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 18 }}>
      <div>
        <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.1em' }}>CARDHOLDER</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>ZHAO LEI</div>
      </div>
      <div>
        <div style={{ fontSize: 9, opacity: 0.6, letterSpacing: '0.1em' }}>VALID THRU</div>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>12/30</div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.05em', color: '#ffba00' }}>VISA</div>
    </div>
  </div>
);

export default function CardWorldElite() {
  return (
    <ProductDetailPage
      breadcrumbs={[{ label: '个人银行', to: '/products/personal' }, { label: '信用卡', to: '/products/cards' }, { label: '环球白金信用卡' }]}
      sections={[
        { id: 'overview',   label: '产品概述' },
        { id: 'features',   label: '核心权益' },
        { id: 'usecases',   label: '适用场景' },
        { id: 'rewards',    label: '积分回馈' },
        { id: 'case',       label: '客户案例' },
        { id: 'apply',      label: '申请流程' },
        { id: 'fees',       label: '费率说明' },
        { id: 'faq',        label: '常见问题' },
      ]}
      hero={{
        badge: 'Premier 客户专享 · 全球限量',
        category: 'World Elite Credit Card',
        productName: '环球白金信用卡',
        tagline: '不仅是一张卡 — 一种全球生活方式。专为高净值客户打造的顶级信用卡。',
        bullets: [
          '基础消费 12 倍积分',
          '全球机场休息室无限次 (LoungeKey)',
          '24/7 礼宾服务 (Concierge)',
          '$500K 海外医疗保险',
          '高尔夫预订 30 次/年',
          '免费海外紧急现金支援',
        ],
        background: 'black',
        ctaPrimary: { label: '立即申请 →', to: '/login?action=open' },
        ctaSecondary: { label: '咨询客户经理', to: '/help' },
        visual: cardVisual,
      }}>

      {/* ───── Overview ───── */}
      <Sect id="overview" eyebrow="What is World Elite" title="一张真正属于全球公民的信用卡"
        subtitle="对标 HSBC Premier MasterCard、招商银行 AE 白金卡、渣打 Visa Infinite — 涵盖商旅、消费、保障、礼遇全场景">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>什么是环球白金信用卡？</h3>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.7, marginBottom: 14 }}>
              环球白金信用卡 (World Elite Platinum) 是 BankerOS 与 VISA / MasterCard 联名发行的最高级别信用卡，
              专为日均资产达 500 万元以上的 <strong>Premier / Jade 客户</strong> 设计。
            </p>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.7 }}>
              卡片采用 <strong>金属材质</strong>，配备 NFC 闪付芯片，支持 Apple Pay / Samsung Pay / 银联云闪付，
              在全球 200+ 国家任意 POS 机、ATM、电商均可使用，且海外消费<strong>免 1.5% 货币转换费</strong>。
            </p>
          </div>

          <div style={{ background: 'var(--p-bg-section)', padding: 28, borderRadius: 10 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>关键参数</h4>
            {[
              ['卡片类型', 'VISA Infinite / MasterCard World Elite'],
              ['卡片材质', '24g 金属卡片 (拉丝黑金)'],
              ['年费',     '¥ 3,600 (Premier 客户首年免)'],
              ['信用额度', '¥ 50,000 - ¥ 5,000,000'],
              ['境外消费返现', '3%'],
              ['免息期',   '最长 56 天'],
              ['货币转换费', '免 (节省 1.5%)'],
              ['免费支付方式', 'Apple Pay / Samsung Pay / 银联云闪付'],
              ['客户专线',  '24/7 专属客服'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-border)', fontSize: 13 }}>
                <span style={{ color: 'var(--p-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--p-navy)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      {/* ───── Features ───── */}
      <Sect id="features" alt eyebrow="Core Benefits" title="9 大旗舰级权益">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: '✈️', name: '环球机场休息室', detail: 'LoungeKey 计划 · 全球 1,300+ 机场休息室 · 无限次使用 · 可携带 1 位同伴 (1 同伴免费)' },
            { icon: '🎩', name: '24/7 礼宾服务',  detail: '专属 Concierge 团队 · 餐厅预订/演出门票/旅行规划/特别礼物 · 中英双语 · 全年无休' },
            { icon: '🏥', name: '$500K 医疗保险', detail: '海外旅行期间紧急医疗 + 紧急转运 + 直系亲属覆盖 · 与 International SOS 合作' },
            { icon: '⛳', name: '高尔夫预订',    detail: '全球 700+ 高端球场预订 · 30 次/年免果岭费 · 含装备租赁' },
            { icon: '🍷', name: '米其林餐饮',    detail: '50+ 米其林星级餐厅 · 9 折优惠 · 优先订位 · 私享品鉴会 6 次/年' },
            { icon: '🏨', name: '酒店升级',     detail: 'IHG / Marriott / Hilton / Hyatt 金卡会籍 · 免费房型升级 · 早餐免费' },
            { icon: '🚗', name: '机场接送',     detail: '全球 30+ 国家机场免费接送 · 12 次/年 · 豪华专车 (Audi A6 级)' },
            { icon: '🎁', name: '生日礼遇',     detail: '生日月双倍积分 + 米其林餐厅免费晚宴 + 蛋糕配送' },
            { icon: '💼', name: '紧急援助',    desc: '海外丢失卡片 24 小时全球补办 · 紧急现金 $5,000 USD' },
          ].map(b => (
            <div key={b.name} style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{b.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{b.name}</h4>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: 0 }}>{b.detail || b.desc}</p>
            </div>
          ))}
        </div>
      </Sect>

      {/* ───── Use Cases ───── */}
      <Sect id="usecases" eyebrow="Who's It For" title="谁最适合使用环球白金卡" subtitle="6 类典型客户画像 · 您是其中之一吗？">
        <UseCaseGrid items={[
          { persona: '跨国企业高管', icon: '👔',
            scenario: '每月出差 2-3 次海外，需要频繁机场休息室、商务舱、跨境消费',
            benefit: '年均节省 ¥80,000+ 出行费用',
            example: '某 500 强公司 CFO，年消费 80 万：仅机场休息室一项即省 ¥36,000，积分兑换商旅 ¥45,000' },
          { persona: '私营企业主', icon: '🏢',
            scenario: '高净值人士，常出席商务宴请、礼品采购、私人会所消费',
            benefit: '12 倍积分快速累积，礼遇彰显身份',
            example: '科技公司创始人，年消费 200 万：可累积 2,400 万积分，可兑换头等舱往返欧洲 5 次' },
          { persona: '高级专业人士', icon: '⚖️',
            scenario: '律师/医生/咨询师，工作繁忙，需 Concierge 处理预订、礼品、旅行规划',
            benefit: '节省 5-10 小时/周时间成本',
            example: '资深律师，使用 Concierge 替代秘书：演唱会订位、商务酒店预订、礼品配送一站搞定' },
          { persona: '环球商旅客', icon: '✈️',
            scenario: '每年商旅航班 50+ 次，需要全球范围机场休息室、酒店升级、紧急医疗',
            benefit: '出行品质大幅提升，紧急情况有保障',
            example: '某外贸总监，每月 4-5 次海外行：1,300+ 机场休息室无限用，海外突发疾病保险 $500K 全包' },
          { persona: '高净值理财客户', icon: '💎',
            scenario: 'Premier / Jade 客户，希望最大化银行综合权益',
            benefit: '叠加 Premier 优越理财礼遇',
            example: 'Premier 客户：信用卡积分 + 理财增值 + 全球账户互通 = 一站式财富管理' },
          { persona: '高端家庭', icon: '👨‍👩‍👧‍👦',
            scenario: '需要为全家提供医疗保障、海外旅游、子女教育消费一体化',
            benefit: '$500K 医疗险全家覆盖 · 子女附属卡免费',
            example: '某双职工家庭：父母旅游、子女留学消费、家庭医疗保障一卡通；附属卡免费给配偶' },
        ]} />
      </Sect>

      {/* ───── Rewards Program ───── */}
      <Sect id="rewards" alt eyebrow="Rewards" title="积分回馈体系" subtitle="您消费的每一分都将累积价值 — 兑换航空里程、酒店住宿、商品、生活体验">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>积分累积规则</h3>
            <div style={{ background: 'white', borderRadius: 10, padding: 24, border: '1px solid var(--p-border)' }}>
              {[
                ['境内消费',     '12 倍积分',   '每消费 ¥1 = 12 积分'],
                ['境外消费',     '12 倍积分 + 3% 返现', '双重收益叠加'],
                ['生日月消费',   '24 倍积分',   '双倍积分礼遇'],
                ['餐饮娱乐',     '20 倍积分',   '米其林餐厅/影院/酒吧'],
                ['航空/酒店',    '15 倍积分',   '机票/住宿/邮轮'],
                ['加油站',       '5 倍积分',    '与中石化/中石油合作'],
                ['超市/百货',    '5 倍积分',    '日常消费'],
                ['公益捐赠',     '0 积分',     '免手续费'],
              ].map(([scenario, rate, note]) => (
                <div key={scenario} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--p-border-soft)', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{scenario}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--p-red)' }}>{rate}</div>
                    <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>积分兑换比例</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                { icon: '✈️', name: '航空里程', rate: '8 积分 = 1 里程', detail: '国航/南航/东航/Cathay/Singapore Airlines/JAL' },
                { icon: '🏨', name: '酒店积分', rate: '10 积分 = 1 IHG 点', detail: 'IHG/Marriott/Hilton/Hyatt 互通' },
                { icon: '🎁', name: '商品兑换', rate: '100 积分 = ¥1', detail: '5000+ 件精选商品' },
                { icon: '🎫', name: '生活体验', rate: '可变', detail: '高端餐厅 / 演唱会 / SPA / 赛事门票' },
                { icon: '💳', name: '抵扣消费', rate: '100 积分 = ¥1', detail: '账单直抵' },
                { icon: '❤️', name: '公益捐赠', rate: '100 积分 = ¥1', detail: '慈善机构合作' },
              ].map(e => (
                <div key={e.name} style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--p-border)' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{e.icon}</div>
                  <div style={{ fontWeight: 700, color: 'var(--p-navy)', fontSize: 13, marginBottom: 4 }}>{e.name}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--p-red)', marginBottom: 4 }}>{e.rate}</div>
                  <div style={{ fontSize: 10, color: 'var(--p-text-muted)' }}>{e.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, var(--p-navy), var(--p-navy-dark))', color: 'white', padding: 32, borderRadius: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ffba00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>积分价值案例</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>年消费 80 万 = 兑换头等舱往返欧洲 3 次</h3>
          <p style={{ fontSize: 14, opacity: 0.85, maxWidth: 720, margin: '0 auto' }}>
            年消费 800,000 × 12 倍 = 9,600,000 积分 → 兑换 1,200,000 国航里程 → 兑换 头等舱中欧往返 3 次 (单程 200,000 里程)
          </p>
        </div>
      </Sect>

      {/* ───── Case Study ───── */}
      <Sect id="case" eyebrow="Customer Story" title="真实客户故事">
        <CaseStudy
          company="王先生 (跨国制造企业 CFO)"
          logo="👔"
          industry="50 岁 · 上海 · 年消费 ¥120 万 · Premier 客户 5 年"
          challenge="作为某跨国企业 CFO，王先生每年出差海外 30+ 次（美国/欧洲/东南亚），过去使用 3 张不同信用卡分别处理商旅、消费、紧急医疗，账单管理复杂，年均出行费用支出超过 ¥150,000，且无统一保障。"
          solution="2021 年升级为 BankerOS Premier 客户，办理环球白金信用卡。一张卡覆盖所有商旅消费 + 紧急医疗 + 礼宾服务。"
          results={[
            { metric: '年均节省', value: '¥ 84,000' },
            { metric: '机场休息室使用', value: '47 次/年' },
            { metric: '积分累积', value: '14.4M 分' },
            { metric: '兑换里程', value: '商务舱 5 次' },
          ]}
          quote="升级环球白金卡是我近年来最满意的金融决策。过去出差时焦虑的'卡能不能用'、'医保够不够'问题都没了。今年带家人去意大利度假，米其林餐厅订位、酒店升级、机场专车 — Concierge 全程包办。"
          quoteAuthor="王先生 · BankerOS Premier 客户"
        />
      </Sect>

      {/* ───── Application Process ───── */}
      <Sect id="apply" alt eyebrow="How to Apply" title="申请流程" subtitle="5 步轻松搞定 · 全程线上 · 7-14 天发卡">
        <ProcessFlow steps={[
          { step: '01', title: '在线提交申请',  desc: '填写基本信息 + 上传身份证 + 财力证明', actor: '客户' },
          { step: '02', title: 'KYC 资格审核',  desc: 'AI 自动审核 + 制裁名单筛查 (1-3 工作日)', actor: '系统' },
          { step: '03', title: '资信调查',     desc: '征信查询 + 资产证明审核 + 工作单位核实', actor: '风控' },
          { step: '04', title: '授信审批',     desc: '专员授信复核 + 客户经理面签 (Premier 加速通道)', actor: '银行' },
          { step: '05', title: '制卡发卡',     desc: '金属卡片定制 + 顺丰加急 7 天送达 + 激活', actor: '客户' },
        ]} />

        <div style={{ marginTop: 32, padding: 24, background: 'white', borderRadius: 10, border: '1px solid var(--p-border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 12 }}>申请条件</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--p-red)', marginBottom: 6 }}>资产门槛</div>
              <div style={{ fontSize: 14 }}>日均总资产 ¥ 500,000+ 或月薪 ¥ 30,000+</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--p-red)', marginBottom: 6 }}>年龄</div>
              <div style={{ fontSize: 14 }}>22-60 周岁 · 主卡持有人</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--p-red)', marginBottom: 6 }}>征信</div>
              <div style={{ fontSize: 14 }}>无 M3 以上逾期 · 综合信用分 ≥ 700</div>
            </div>
          </div>
        </div>
      </Sect>

      {/* ───── Pricing ───── */}
      <Sect id="fees" eyebrow="Fees & Charges" title="费率说明">
        <PricingTable fees={[
          { item: '年费 (主卡)', amount: '¥ 3,600', note: 'Premier 客户首年免年费 · 年消费满 ¥ 30 万续年免年费' },
          { item: '年费 (附属卡)', amount: '¥ 0', note: '最多 4 张附属卡 · 全部永久免年费' },
          { item: '取现手续费', amount: '免', note: '透支取现日利率 0.05% (其他卡通常 3%)' },
          { item: '货币转换费', amount: '免', note: '海外刷卡免 1.5% 货币转换费' },
          { item: '挂失补卡费', amount: '免', note: '24 小时全球紧急补办' },
          { item: '滞纳金', amount: '最低还款额 5%', note: '宽限期 3 天 · 全额还款无利息' },
          { item: '溢缴款手续费', amount: '免', note: '随时全额取出多缴款' },
          { item: '账单分期手续费', amount: '0.45%/月', note: '3/6/12/24 期可选' },
        ]} />
      </Sect>

      {/* ───── FAQ ───── */}
      <Sect id="faq" alt eyebrow="FAQ" title="常见问题">
        <FaqAccordion items={[
          { q: '我需要满足什么资格才能申请？', a: '需为 22-60 岁，无 M3 以上征信逾期记录，且日均总资产达 ¥50 万或月薪达 ¥3 万。Premier / Jade 客户可走快速通道，3 个工作日批卡。' },
          { q: '机场休息室如何使用？', a: '激活后您将收到 LoungeKey 数字凭证，全球 1,300+ 机场休息室直接刷卡进入。可携带 1 位同伴免费 (额外同伴 $32 USD/人/次)。' },
          { q: '海外消费真的免货币转换费吗？', a: '是的。在 200+ 国家任意 POS 机或电商使用，按 VISA / MasterCard 当日中间汇率结算，不收取 1.5% 货币转换费（行业标准）。' },
          { q: '$500K 医疗保险覆盖哪些情况？', a: '保险覆盖海外旅行期间的突发疾病、意外伤害、紧急医疗运送 (含国际 SOS 直升机救援)、遗体运回等。前提是使用本卡支付了至少一段往返机票 50% 费用。' },
          { q: 'Concierge 礼宾服务能做什么？', a: '帮您：餐厅预订 (含米其林)、机票/酒店预订、演唱会/赛事门票获取、礼品采购配送、旅行规划、私人司机安排、医生预约、机场快速通关等。' },
          { q: '如果遇到欺诈交易怎么办？', a: '立即拨打 95588 (24×7)。我们承诺：经核实非客户原因损失，48 小时内 100% 全额赔付，不要求客户先垫付。' },
          { q: '能否申请附属卡给家人？', a: '可申请最多 4 张附属卡 (配偶/父母/成年子女)，全部免年费。附属卡共享主卡的医疗保险、机场休息室、积分累积，独立账单管理。' },
          { q: '积分有效期是多久？', a: '积分有效期 3 年（按每笔交易日期起算）。Premier 客户可申请延长至 5 年。' },
        ]} />
      </Sect>

      {/* ───── Final CTA ───── */}
      <section className="p-section" style={{ background: 'linear-gradient(135deg, #1a1a1a, #000)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>开启您的环球白金生活</h2>
          <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 28, maxWidth: 600, margin: '0 auto 28px' }}>
            一张金属卡 · 12 倍积分 · 1,300 个机场休息室 · 24/7 礼宾 · $500K 医疗保险
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/login?action=open" className="p-btn" style={{ background: '#ffba00', color: '#000', padding: '14px 36px', fontSize: 14, fontWeight: 700 }}>立即申请 →</a>
            <a href="/help" className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white', padding: '14px 36px', fontSize: 14 }}>客户经理一对一</a>
          </div>
        </div>
      </section>
    </ProductDetailPage>
  );
}
