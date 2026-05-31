import ProductPage, { Section, SectionHeader, FeatureGrid, CtaBanner } from './ProductPage';

export function AboutPage() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '关于我们' }]}
      hero={{
        eyebrow: 'About BankerOS',
        title: <>我们的使命<br /><span className="accent">让每个人享受银行级的金融服务</span></>,
        subtitle: '成立于 1995 年 · 全球 64 个国家分支 · 服务 1,280 万个人客户与 7.2 万机构客户 · 资产管理规模 $284B',
        ctaPrimary: { label: '加入我们 →', to: '/careers' },
        background: 'navy',
      }}>
      <Section narrow>
        <SectionHeader eyebrow="Key Facts" title="BankerOS 数字" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            ['$284B+', '资产管理规模'], ['64', '国家与地区'],
            ['1,280 万', '个人客户'], ['7.2 万', '企业客户'],
            ['38,000+', '全球员工'], ['450+', '全球分行'],
            ['12 万亿', '年支付量 (RMB)'], ['99.999%', '系统可用性'],
          ].map(([num, label]) => (
            <div key={label as string} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--p-navy)', marginBottom: 4 }}>{num}</div>
              <div style={{ fontSize: 12, color: 'var(--p-text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Our Heritage" title="我们的历程" />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--p-border)', transform: 'translateX(-50%)' }} />
          {[
            { year: '1995', event: 'BankerOS 在上海成立，注册资本 50 亿元' },
            { year: '2003', event: '获得香港金融管理局牌照，开设香港分行' },
            { year: '2008', event: '推出第一代核心银行系统，服务突破 100 万客户' },
            { year: '2014', event: '通过 SOC 2 / ISO 27001 认证，跻身亚太前 20 大银行' },
            { year: '2018', event: '推出 Open Banking API，全面拥抱金融科技' },
            { year: '2021', event: '资产管理规模突破 $100B，进入福布斯全球银行 Top 100' },
            { year: '2024', event: '推出 mBridge 央行数字货币业务，全球首批试点之一' },
            { year: '2026', event: '资产规模 $284B，64 国分行，BCBS239 国际认证' },
          ].map((m, i) => (
            <div key={m.year} style={{ display: 'flex', alignItems: 'center', marginBottom: 28, justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
              <div style={{ width: '45%', background: 'white', padding: 20, borderRadius: 10, border: '1px solid var(--p-border)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--p-red)', marginBottom: 6 }}>{m.year}</div>
                <div style={{ fontSize: 13, color: 'var(--p-text)' }}>{m.event}</div>
              </div>
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: 'var(--p-red)', border: '4px solid white', boxShadow: '0 0 0 2px var(--p-red)' }} />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Core Values" title="我们的核心价值" />
        <FeatureGrid items={[
          { icon: '🛡', title: '客户至上',  desc: '一切围绕客户需求设计产品，用 NPS 衡量我们的成功' },
          { icon: '⚖️', title: '诚信合规',  desc: '严守 64 国监管要求，建立行业最高合规标准' },
          { icon: '💡', title: '科技创新',  desc: '研发投入年均 12%，全球 5 大研究中心' },
          { icon: '🌱', title: '可持续发展', desc: '承诺 2030 年实现运营碳中和，2050 年价值链碳中和' },
        ]} />
      </Section>

      <CtaBanner title="与我们一起塑造金融的未来" desc="38,000+ 全球同事 · 多元包容文化 · 招贤纳士"
        primaryCta={{ label: '招聘机会 →', to: '/careers' }} secondaryCta={{ label: '投资者关系', to: '/about/financials' }} />
    </ProductPage>
  );
}

export function Innovation() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '关于我们' }, { label: '科技与创新' }]}
      hero={{
        eyebrow: 'Innovation & Technology',
        title: <>下一代<br /><span className="accent">数字银行架构</span></>,
        subtitle: '基于 Open Banking、ISO 20022、BIAN 等国际标准 · 微服务架构 · 云原生部署 · 区块链与 CBDC 试点',
        background: 'gradient',
      }}>
      <Section>
        <SectionHeader eyebrow="Tech Stack" title="我们的技术栈" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { title: '微服务架构',  items: ['17 个独立微服务', 'Kubernetes 编排', 'Service Mesh (Istio)', 'API Gateway (Fastify)'] },
            { title: '数据与AI',  items: ['Apache Kafka 事件流', 'PostgreSQL + Redis', '反欺诈 ML 模型', '智能投顾 AI 引擎'] },
            { title: '安全与合规',  items: ['HSM 硬件加密', 'mTLS 服务间通信', 'JWT + MFA + FIDO2', 'BCBS 239 数据治理'] },
          ].map(c => (
            <div key={c.title} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14 }}>{c.title}</h3>
              {c.items.map(item => (
                <div key={item} style={{ padding: '6px 0', fontSize: 13, color: 'var(--p-text-soft)', borderBottom: '1px solid var(--p-border-soft)' }}>
                  <span style={{ color: 'var(--p-success)', marginRight: 8 }}>▸</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="CBDC & DLT" title="央行数字货币 mBridge 项目" subtitle="与全球 4 国央行合作，引领数字货币结算革命" />
        <div style={{ background: 'white', padding: 40, borderRadius: 12, border: '1px solid var(--p-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>什么是 mBridge?</h3>
              <p style={{ fontSize: 14, color: 'var(--p-text-soft)', lineHeight: 1.7, marginBottom: 16 }}>
                mBridge 是由人民银行、香港金管局、阿联酋央行、泰国央行联合发起的多边央行数字货币桥项目，
                突破传统跨境支付依赖代理行的模式，实现央行数字货币的实时跨境结算。
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                  ['🇨🇳', '数字人民币 e-CNY'],
                  ['🇭🇰', '数字港元 e-HKD'],
                  ['🇦🇪', '数字迪拉姆 e-AED'],
                  ['🇹🇭', '数字泰铢 e-THB'],
                ].map(([flag, name]) => (
                  <div key={name as string} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 28 }}>{flag}</span>
                    <span style={{ fontWeight: 600 }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--p-bg-section)', padding: 28, borderRadius: 10 }}>
              <h4 style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>关键技术指标</h4>
              {[
                ['结算时长', '3 秒', 'var(--p-success)'],
                ['手续费', '近乎零', 'var(--p-success)'],
                ['交收模式', 'PvP 原子', 'var(--p-navy)'],
                ['参与央行', '4 国', 'var(--p-navy)'],
                ['日均交易', '$2.4M', 'var(--p-red)'],
              ].map(([k, v, c]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--p-border-soft)' }}>
                  <span style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>{k}</span>
                  <span style={{ fontWeight: 700, color: c as string }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </ProductPage>
  );
}

export function Esg() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '关于我们' }, { label: 'ESG 战略' }]}
      hero={{
        eyebrow: 'Environmental · Social · Governance',
        title: <>负责任的<br /><span className="accent">可持续金融</span></>,
        subtitle: '承诺 2030 年运营碳中和 · $500B 绿色金融融资目标 · 联合国 PRB 创始签署方',
      }}>
      <Section>
        <SectionHeader eyebrow="Climate Commitment" title="我们的气候承诺" />
        <FeatureGrid items={[
          { icon: '🌱', title: '2030 运营碳中和', desc: '所有分行、办公楼、数据中心 100% 使用可再生能源' },
          { icon: '🌍', title: '2050 价值链碳中和', desc: '与所有上下游伙伴一起实现净零排放' },
          { icon: '💰', title: '$500B 绿色融资', desc: '到 2030 年累计支持新能源、电动车、绿色建筑 $5,000 亿' },
          { icon: '📊', title: 'TCFD 气候披露', desc: '按气候相关财务披露建议每年公开气候风险报告' },
        ]} />
      </Section>
    </ProductPage>
  );
}
