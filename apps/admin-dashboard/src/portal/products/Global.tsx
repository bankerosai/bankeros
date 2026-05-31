import ProductPage, { Section, SectionHeader, FeatureGrid, BenefitList, CtaBanner } from '../ProductPage';

export function GlobalMultiCurrency() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '全球与跨境' }, { label: '多币种账户' }]}
      hero={{
        eyebrow: 'Multi-Currency Account',
        title: <>一个账户<br /><span className="accent">12 种货币</span></>,
        subtitle: '一张卡片 · 多币种存款 · 全球 ATM 取现 · 7×24 实时换汇 · 汇率优于市场 80%',
        ctaPrimary: { label: '在线开户 →', to: '/login?action=open' },
        background: 'navy',
      }}>
      <Section narrow>
        <SectionHeader eyebrow="Supported Currencies" title="支持 12 种主流货币" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginTop: 24 }}>
          {[
            { code: 'USD', flag: '🇺🇸', name: '美元' }, { code: 'EUR', flag: '🇪🇺', name: '欧元' },
            { code: 'GBP', flag: '🇬🇧', name: '英镑' }, { code: 'JPY', flag: '🇯🇵', name: '日元' },
            { code: 'CNY', flag: '🇨🇳', name: '人民币' }, { code: 'HKD', flag: '🇭🇰', name: '港币' },
            { code: 'SGD', flag: '🇸🇬', name: '新加坡元' }, { code: 'AUD', flag: '🇦🇺', name: '澳元' },
            { code: 'CAD', flag: '🇨🇦', name: '加元' }, { code: 'CHF', flag: '🇨🇭', name: '瑞郎' },
            { code: 'NZD', flag: '🇳🇿', name: '纽元' }, { code: 'AED', flag: '🇦🇪', name: '迪拉姆' },
          ].map(c => (
            <div key={c.code} style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid var(--p-border)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 4 }}>{c.flag}</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)' }}>{c.code}</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>{c.name}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Live FX Rates" title="实时汇率查询" />
        <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--p-bg-section)' }}>
              <tr>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)' }}>货币对</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>买入价</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>卖出价</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>中间价</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>涨跌</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['USD/CNY', '7.2538', '7.2620', '7.2579', '+0.05%', true],
                ['EUR/CNY', '7.8721', '7.8840', '7.8780', '+0.12%', true],
                ['GBP/CNY', '9.1845', '9.1920', '9.1882', '-0.08%', false],
                ['JPY/CNY', '0.0484', '0.0488', '0.0486', '+0.34%', true],
                ['HKD/CNY', '0.9275', '0.9290', '0.9282', '-0.02%', false],
                ['AUD/CNY', '4.7821', '4.7920', '4.7870', '+0.21%', true],
              ].map(([pair, bid, ask, mid, chg, up]) => (
                <tr key={pair as string} style={{ borderTop: '1px solid var(--p-border-soft)' }}>
                  <td style={{ padding: 14, fontWeight: 700, color: 'var(--p-navy)' }}>{pair}</td>
                  <td style={{ padding: 14, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-success)' }}>{bid}</td>
                  <td style={{ padding: 14, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-red)' }}>{ask}</td>
                  <td style={{ padding: 14, textAlign: 'right', fontFamily: 'monospace' }}>{mid}</td>
                  <td style={{ padding: 14, textAlign: 'right', color: up ? 'var(--p-success)' : 'var(--p-red)', fontWeight: 600 }}>{chg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 12, textAlign: 'right' }}>更新于 {new Date().toLocaleString('zh-CN')}</div>
      </Section>
    </ProductPage>
  );
}

export function PremierGlobal() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '全球与跨境' }, { label: 'Premier Global Account' }]}
      hero={{
        eyebrow: 'BankerOS Premier Global',
        title: <>一张卡<br /><span className="accent">畅行 32 国家</span></>,
        subtitle: '对标 HSBC Premier Global Account · 全球账户互通 · 跨国汇款免费 · 一位客户经理服务全球',
        ctaPrimary: { label: '升级 Premier Global →', to: '/products/wealth/premier' },
        background: 'navy',
      }}>
      <Section>
        <SectionHeader eyebrow="Global Coverage" title="32 个国家与地区，1 个账户" subtitle="您的账户随您出行，无论在哪里都享相同 Premier 礼遇" />
        <div style={{ background: 'white', padding: 40, borderRadius: 12, border: '1px solid var(--p-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 16 }}>
            {['🇨🇳', '🇭🇰', '🇹🇼', '🇸🇬', '🇯🇵', '🇰🇷', '🇲🇾', '🇮🇩', '🇮🇳', '🇦🇺', '🇳🇿', '🇺🇸', '🇨🇦', '🇲🇽', '🇧🇷', '🇦🇷', '🇬🇧', '🇩🇪', '🇫🇷', '🇮🇹', '🇪🇸', '🇨🇭', '🇳🇱', '🇧🇪', '🇦🇪', '🇸🇦', '🇿🇦', '🇪🇬', '🇶🇦', '🇰🇼', '🇧🇭', '🇴🇲'].map((flag, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 12, borderRadius: 8, background: 'var(--p-bg-section)' }}>
                <div style={{ fontSize: 28 }}>{flag}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Key Benefits" title="Premier Global 核心优势 · 点击了解相关产品" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🌐', title: '一卡通全球',         desc: '32 国 Premier 账户互联，单卡片可在全球分行办理业务', to: '/products/wealth/premier' },
            { icon: '💸', title: '免费跨境汇款',       desc: 'Premier 客户之间转账 0 手续费，最快 6 小时到账',     to: '/products/global/remittance' },
            { icon: '👔', title: '一个客户经理',       desc: '您的客户经理可协调 32 国分行为您服务',                to: '/products/wealth/premier' },
            { icon: '🏠', title: '海外按揭快速通道',   desc: '本国账户记录视同海外信用记录，按揭审批快 50%',         to: '/products/loans/mortgage/overseas' },
            { icon: '🎓', title: '子女留学全程服务',   desc: '学费汇款免费 · 海外开户陪同 · 紧急援助',              to: '/products/global/study-abroad' },
            { icon: '🏥', title: '全球医疗援助',       desc: '$500K 海外医疗保险 · 紧急转运 · 顶级医院直推',         to: '/products/insurance/health' },
          ].map(b => (
            <a key={b.title} href={b.to}
              style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{b.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{b.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: '0 0 10px' }}>{b.desc}</p>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-red)' }}>了解详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <CtaBanner title="升级到 Premier Global" desc="日均资产达 50 万元自动升级，全球贵宾礼遇等您"
        primaryCta={{ label: '了解 Premier →', to: '/products/wealth/premier' }} />
    </ProductPage>
  );
}

export function GlobalRemittance() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '全球与跨境' }, { label: '国际汇款' }]}
      hero={{
        eyebrow: 'International Remittance',
        title: <>跨境汇款<br /><span className="accent">200+ 国家 6 小时到账</span></>,
        subtitle: '基于 SWIFT GPI + ISO 20022 标准 · 实时追踪汇款进度 · 汇率优于市场 · 单笔最高 200 万美元',
        ctaPrimary: { label: '立即汇款 →', to: '/login' },
        background: 'navy',
      }}>
      <Section>
        <SectionHeader eyebrow="Remittance Channels" title="3 种跨境汇款方式 · 点击查看详情" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { type: '⚡ 即时汇款 (Real-time)', fee: '¥ 50/笔', time: '< 1 小时', amount: '< $50,000',
              channels: ['VISA Direct / MasterCard Send', 'Faster Payments (UK)', 'SEPA Instant (EU)'], note: '适合紧急小额汇款',
              to: '/products/business/cross-border' },
            { type: '🌐 SWIFT GPI (Standard)', fee: '¥ 50-200/笔', time: '< 6 小时', amount: '< $200K',
              channels: ['SWIFT GPI 全球追踪', 'ISO 20022 标准报文', '200+ 国家代理行'], note: '主流跨境汇款方式',
              to: '/products/business/cross-border' },
            { type: '🏛 mBridge CBDC', fee: '¥ 0 (试点期)', time: '< 3 秒', amount: '试点客户',
              channels: ['人民银行/HKMA/CBUAE/BOT', 'PvP 实时同步交收', '突破传统代理行模式'], note: '前沿央行数字货币网络',
              to: '/products/global/cbdc/mbridge' },
          ].map(p => (
            <a key={p.type} href={p.to}
              style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)', textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 16 }}>{p.type}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16, padding: '12px 0', borderTop: '1px solid var(--p-border)', borderBottom: '1px solid var(--p-border)' }}>
                <div><div style={{ fontSize: 10, color: 'var(--p-text-muted)' }}>手续费</div><div style={{ fontWeight: 700, color: 'var(--p-navy)', fontSize: 13 }}>{p.fee}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--p-text-muted)' }}>时效</div><div style={{ fontWeight: 700, color: 'var(--p-success)', fontSize: 13 }}>{p.time}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--p-text-muted)' }}>额度</div><div style={{ fontWeight: 700, fontSize: 13 }}>{p.amount}</div></div>
              </div>
              <BenefitList items={p.channels} />
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--p-bg-section)', borderRadius: 4, fontSize: 11, color: 'var(--p-text-muted)' }}>💡 {p.note}</div>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--p-red)', textTransform: 'uppercase' }}>查看详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Top Corridors" title="热门汇款通道" subtitle="覆盖中国对外汇款最常用的 10 大目的地" />
        <div style={{ background: 'white', borderRadius: 8, padding: 24, border: '1px solid var(--p-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {[
              { route: 'CN → US', amount: '$50K', rate: '7.2580', time: '4h' },
              { route: 'CN → HK', amount: 'HKD 100K', rate: '0.9282', time: '即时' },
              { route: 'CN → UK', amount: '£20K', rate: '9.1882', time: '6h' },
              { route: 'CN → SG', amount: 'SGD 30K', rate: '5.4035', time: '4h' },
              { route: 'CN → AU', amount: 'AUD 30K', rate: '4.7870', time: '6h' },
              { route: 'CN → JP', amount: '¥1M', rate: '0.0486', time: '4h' },
              { route: 'CN → CA', amount: 'CAD 30K', rate: '5.3120', time: '6h' },
              { route: 'CN → DE', amount: '€20K', rate: '7.8780', time: '6h' },
              { route: 'CN → AE', amount: 'AED 100K', rate: '1.9758', time: '8h' },
              { route: 'CN → NZ', amount: 'NZD 30K', rate: '4.4210', time: '8h' },
            ].map(c => (
              <div key={c.route} style={{ padding: 14, background: 'var(--p-bg-section)', borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6 }}>{c.route}</div>
                <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginBottom: 4 }}>汇率 {c.rate}</div>
                <div style={{ fontSize: 11, color: 'var(--p-success)' }}>{c.time} 到账</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBanner title="安全便捷的跨境汇款" desc="6 小时到账 200+ 国家 · 汇率优于市场 80%"
        primaryCta={{ label: '立即汇款 →', to: '/login' }} />
    </ProductPage>
  );
}
