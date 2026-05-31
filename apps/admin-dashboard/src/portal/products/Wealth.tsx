import ProductPage, { Section, SectionHeader, FeatureGrid, BenefitList, ComparisonTable, CtaBanner } from '../ProductPage';

export function WealthPremier() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '财富管理', to: '/products/wealth/premier' }, { label: 'Premier 优越理财' }]}
      hero={{
        eyebrow: 'BankerOS Premier',
        title: <>Premier 优越理财<br /><span className="accent">为您与家人的财富护航</span></>,
        subtitle: '日均资产 50 万元起 · 全球贵宾礼遇 · 专属客户经理 · 32 国账户互通',
        ctaPrimary: { label: '了解资格 →', to: '/help' },
        ctaSecondary: { label: '升级 Premier', to: '/login' },
        background: 'navy',
      }}>
      <Section narrow>
        <SectionHeader eyebrow="Eligibility" title="加入 Premier 的两种方式" subtitle="对标 HSBC Premier 资格标准" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 30 }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 12, border: '2px solid var(--p-navy)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💰</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>资产门槛</h3>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--p-red)', marginBottom: 6 }}>¥ 500,000+</div>
            <p style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>日均总资产 (存款 + 投资 + 保险) 达到 50 万元</p>
          </div>
          <div style={{ background: 'white', padding: 32, borderRadius: 12, border: '2px solid var(--p-navy)', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💼</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>收入门槛</h3>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--p-red)', marginBottom: 6 }}>¥ 30,000/月</div>
            <p style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>月薪入账连续 3 个月达到 3 万元 (或年薪 50 万+)</p>
          </div>
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Premier Benefits" title="9 大 Premier 专属礼遇 · 点击了解相关产品" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🌍', title: '全球账户互通',    desc: '32 国家 Premier 客户跨国转账免手续费，1 个客户经理服务全球', to: '/products/global/premier-global' },
            { icon: '👔', title: '专属客户经理',    desc: '1v1 资深理财师 · 7×24 直接联系 · 综合财富规划',                 to: '/help' },
            { icon: '✈️', title: '环球贵宾厅',      desc: '全球 1000+ 机场休息室无限次 (Priority Pass)',                   to: '/products/cards/world-elite' },
            { icon: '🏥', title: '高端医疗保险',    desc: 'Premier 客户专属 $500K 海外医疗保险 (含家人)',                  to: '/products/insurance/health' },
            { icon: '🎫', title: '专属投资产品',    desc: '私募基金、限量结构性产品、海外资产配置',                          to: '/products/wealth/structured' },
            { icon: '🏦', title: '专属网点服务',    desc: '免排队 · Premier Lounge · 周末预约开放',                          to: '/branches' },
            { icon: '💳', title: '环球白金信用卡',  desc: '免年费 · 12 倍积分 · 礼宾服务 24/7',                            to: '/products/cards/world-elite' },
            { icon: '🎓', title: '子女教育规划',    desc: '海外留学全方位规划 · 学费汇款免手续费',                          to: '/products/global/study-abroad' },
            { icon: '⚠️', title: '海外紧急支援',    desc: '海外丢失证件/卡片 24 小时全球补办 + 紧急现金',                  to: '/products/global/remittance' },
          ].map(b => (
            <a key={b.title} href={b.to}
              style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{b.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{b.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: '0 0 10px' }}>{b.desc}</p>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-red)', textTransform: 'uppercase' }}>了解详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <CtaBanner title="今天起，享 Premier 礼遇" desc="符合资格自动升级，无需额外申请，专属客户经理 1 周内主动联系"
        primaryCta={{ label: '查看资格 →', to: '/login' }} secondaryCta={{ label: '咨询客户经理', to: '/help' }} />
    </ProductPage>
  );
}

export function WealthJade() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '财富管理' }, { label: 'Jade 钻石客户' }]}
      hero={{
        eyebrow: 'BankerOS Jade',
        title: <>Jade<br /><span className="accent">尊享至臻服务</span></>,
        subtitle: '日均资产 600 万元起 · 资深财富顾问团 · 私人订制投资方案 · 全球身份规划',
        ctaPrimary: { label: '联系顾问 →', to: '/help' },
        background: 'gold',
      }}>
      <Section>
        <SectionHeader eyebrow="Jade Exclusive" title="对标 HSBC Jade · 招行钻石" />
        <ComparisonTable tiers={[
          { name: 'Premier', tagline: '优越理财', minBalance: '50 万', color: 'var(--p-navy)',
            perks: ['专属客户经理', '机场贵宾厅', '海外医疗保险 $500K'], cta: '查看 Premier', ctaLink: '/products/wealth/premier' },
          { name: 'Jade 钻石', tagline: '至臻钻石尊享', minBalance: '600 万', color: '#ffba00',
            perks: ['Premier 全部权益', '资深财富顾问团 (3-5 人)', '私募基金/对冲基金独家额度', 'Jade Lounge 私享商务空间', '艺术品/红酒/腕表收藏服务', '全球身份规划 (绿卡/护照)'], cta: '升级 Jade', ctaLink: '/login', featured: true },
          { name: '私人银行', tagline: 'Private Banking', minBalance: '3000 万', color: '#1a1a1a',
            perks: ['Jade 全部权益', '家族办公室服务', '家族信托设立'], cta: '查看私行', ctaLink: '/products/wealth/private' },
        ]} />
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Lifestyle Privileges" title="Jade 生活方式礼遇" subtitle="不只是银行服务，更是一种生活方式" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
          {[
            { icon: '🎨', title: '艺术与收藏', items: ['苏富比/佳士得拍卖会优先邀请', '艺术品鉴赏会 4 次/年', '艺术品融资与托管', '红酒投资与窖藏'] },
            { icon: '🌍', title: '环球生活', items: ['迪拜帆船酒店专属优惠', '私人飞机包机折扣', '游艇租赁优先', '米其林星级餐厅订位'] },
            { icon: '🎓', title: '子女教育', items: ['哈佛/牛津暑期游学', '海外名校择校咨询', '艺术/体育特长培养', '面试辅导 1v1'] },
            { icon: '🏥', title: '健康管理', items: ['全球顶级医院专家预约', '高端体检中心', '海外就医绿色通道', '基因检测与抗衰老'] },
          ].map(g => (
            <div key={g.title} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14 }}>{g.title}</h3>
              <BenefitList items={g.items} />
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner title="Jade — 尊崇为您" desc="资产达到 600 万自动升级，专属顾问 48 小时内联系"
        primaryCta={{ label: '了解资格 →', to: '/help' }} />
    </ProductPage>
  );
}

export function WealthPrivate() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '财富管理' }, { label: '私人银行' }]}
      hero={{
        eyebrow: 'Private Banking',
        title: <>BankerOS 私人银行<br /><span className="accent">家族财富，传承百年</span></>,
        subtitle: '可投资资产 3000 万美元起 · 家族办公室级别服务 · 全球资产配置 · 财富代际传承',
        ctaPrimary: { label: '预约咨询 →', to: '/help' },
        background: 'black',
      }}>
      <Section>
        <SectionHeader eyebrow="Family Office Services" title="家族办公室级别服务 · 点击查看详情" subtitle="对标 UBS / Goldman Sachs Private Wealth / 摩根私行" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🏛', title: '家族信托',   desc: '资产隔离/避税优化/受益人指定 · 多层架构 (BVI/Cayman/Singapore/HK)', to: '/products/wealth/trust' },
            { icon: '📜', title: '遗产规划',   desc: '遗嘱信托/慈善基金/家族宪章 · 跨境合规规划',                          to: '/products/wealth/inheritance' },
            { icon: '🎯', title: '私募股权',   desc: '独家 PE/VC 项目 · 顶级 GP 合作 (红杉/Sequoia/Blackstone)',          to: '/products/wealth/structured' },
            { icon: '🌍', title: '海外资产',   desc: '美国/英国/新加坡/香港 多元化布局 · 7 大资产类别',                    to: '/products/wealth/migration' },
            { icon: '🛂', title: '身份规划',   desc: '美/加/欧/澳/港澳台居留权 · 投资移民全流程',                          to: '/products/global/immigration' },
            { icon: '📚', title: '下一代教育', desc: '继承人金融素养培训 · 家族企业接班规划 · 顶级商学院引荐',              to: '/products/global/study-abroad' },
          ].map(p => (
            <a key={p.title} href={p.to}
              style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 28, textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div className="p-product-icon" style={{ marginBottom: 14 }}>{p.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{p.desc}</p>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--p-red)', textTransform: 'uppercase' }}>查看详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Our Approach" title="私行服务方法论" />
        <div style={{ background: 'white', borderRadius: 12, padding: 40, border: '1px solid var(--p-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, alignItems: 'center' }}>
            {[
              { step: '01', title: '深度访谈', desc: '了解家族结构、财富来源、终极目标' },
              { step: '02', title: '资产体检', desc: '现有资产全维度审视，识别风险与机会' },
              { step: '03', title: '方案设计', desc: '团队协作 (理财/法律/税务/信托) 制定方案' },
              { step: '04', title: '执行落地', desc: '全球资产配置 + 法律架构搭建' },
              { step: '05', title: '持续优化', desc: '季度复盘 + 全球宏观策略调整' },
            ].map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--p-navy)', color: 'white', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>
                  {s.step}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 11, color: 'var(--p-text-soft)', lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Investment Universe" title="全球投资版图 · 点击查看具体产品" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { class: '股权', items: ['全球公募基金 5000+', 'PE/VC 项目独家', '上市前 Pre-IPO', '量化对冲基金'], to: '/products/wealth/funds' },
            { class: '债权', items: ['国债/金融债/公司债', '高收益债', '可转债/可交债', '私募信贷'], to: '/products/wealth/bonds' },
            { class: '另类', items: ['对冲基金 (含 Bridgewater)', '不动产 (商业/住宅)', '基础设施', 'REITs'], to: '/products/wealth/structured' },
            { class: '收藏', items: ['艺术品 (含古董/油画)', '红酒/威士忌', '腕表/珠宝', '汽车收藏'], to: '/products/wealth/trust' },
          ].map(c => (
            <a key={c.class} href={c.to}
              style={{ background: 'white', padding: 22, borderRadius: 8, border: '1px solid var(--p-border)', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-red)', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--p-border)' }}>{c.class}</h4>
              {c.items.map(item => (
                <div key={item} style={{ fontSize: 12, color: 'var(--p-text-soft)', padding: '6px 0' }}>• {item}</div>
              ))}
              <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: 'var(--p-red)' }}>查看详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <CtaBanner title="尊敬的客户，请预约保密咨询" desc="我们将安排资深私人银行顾问与您一对一深度沟通"
        primaryCta={{ label: '预约咨询 →', to: '/help' }} />
    </ProductPage>
  );
}
