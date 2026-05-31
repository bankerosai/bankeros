import ProductPage, { Section, SectionHeader, FeatureGrid, ComparisonTable, CtaBanner } from '../ProductPage';

export default function Accounts() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '个人银行', to: '/products/personal' }, { label: '银行账户' }]}
      hero={{
        eyebrow: 'Personal Accounts',
        title: <>开启您的<br /><span className="accent">数字财富之旅</span></>,
        subtitle: '从基础储蓄到全球多币种账户，三档产品满足从学生到富裕客户的全场景需求。',
        ctaPrimary: { label: '在线开户 →', to: '/login?action=open' },
        ctaSecondary: { label: '我已是客户，登录', to: '/login' },
      }}>
      <Section>
        <SectionHeader eyebrow="Choose Your Account" title="三档账户产品，匹配您的财富阶段" subtitle="对标 HSBC Premier / Advance / Personal 分层体系" />
        <ComparisonTable tiers={[
          { name: 'Classic 普通账户', tagline: '基础日常银行服务，适合首次开户', minBalance: '¥ 0', color: '#5a6470',
            perks: ['无最低存款要求', '基础储蓄账户 + 借记卡', '手机银行 + 移动支付', '境内 ATM 取现 4 次/月免费', '客服热线 24/7'], cta: '立即免费开户', ctaLink: '/login?action=open' },
          { name: 'Advance 进阶', tagline: '日均资产 5 万起 · 一卡通多币种账户', minBalance: '¥ 50,000', color: 'var(--p-navy)',
            perks: ['多币种账户 (USD/EUR/HKD)', '免费跨境汇款 5 次/年', '机场休息室 4 次/年', '专属客户服务热线', '账户管理费全免'], cta: '查看一卡通详情', ctaLink: '/products/accounts/all-in-one', featured: true },
          { name: 'Premier 优越', tagline: '日均资产 50 万起，全球贵宾礼遇', minBalance: '¥ 500,000', color: '#ffba00',
            perks: ['全球账户互通 (32 国)', '免费跨境汇款不限次', '环球机场贵宾厅', '专属客户经理 1v1', '免费海外紧急现金支援'], cta: '了解 Premier 详情', ctaLink: '/products/wealth/premier' },
        ]} />
      </Section>

      <Section alt>
        <SectionHeader eyebrow="One Card, Multiple Currencies" title="一卡通多币种账户" subtitle="一张卡片管理 12 种主流货币，全球 ATM 取现免手续费" />
        <FeatureGrid items={[
          { icon: '💱', title: '12 种货币',     desc: 'USD/EUR/GBP/JPY/HKD/SGD/AUD/CAD/CHF/CNY/CNH/NZD 主流货币全覆盖' },
          { icon: '🌐', title: '全球 ATM',     desc: '与 Plus/Cirrus/银联网络合作，全球 200+ 国家 100 万台 ATM 取现免手续费' },
          { icon: '⚡', title: '实时换汇',     desc: '7×24 小时实时换汇，汇率优于市场 80%，单笔最高 100 万美元' },
          { icon: '🏪', title: '海外消费',     desc: '海外刷卡免货币转换费 1.5%，POS 机商户全球可用' },
          { icon: '📱', title: '智能 App',     desc: '指纹/FaceID 登录，账户切换、跨币转账、外汇下单一应俱全' },
          { icon: '🛡', title: '存款保障',     desc: '存款保险保障最高 50 万元/账户，CCB / IDIC 双重保险' },
        ]} />
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="/products/accounts/all-in-one" className="p-btn p-btn-primary" style={{ padding: '12px 32px' }}>
            查看一卡通完整详情 →
          </a>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Account Features" title="基础账户标配服务" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { icon: '📲', title: '移动银行', desc: '功能完整的手机 App，支持指纹/人脸登录' },
            { icon: '💸', title: '即时转账', desc: '本行实时到账，境内跨行 5 秒到账' },
            { icon: '🧾', title: '电子对账单', desc: '每月 PDF / camt.053 标准报表免费下载' },
            { icon: '🔔', title: '智能预警', desc: '大额交易/异常登录/汇率波动短信邮件提醒' },
            { icon: '🤝', title: '客户服务', desc: '7×24 多语言客服 (中/英/粤/日/韩)' },
            { icon: '🔐', title: '账户保护', desc: '一键挂失冻结，可疑交易 30 秒内停止' },
            { icon: '💼', title: '理财直通', desc: '账户内一键购买基金/定期/结构性产品' },
            { icon: '🎁', title: '积分回馈', desc: '消费/转账自动累积积分，兑换商品/航空里程' },
          ].map(f => (
            <div key={f.title} style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--p-text-soft)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner title="立即开始" desc="8 分钟在线开户，无需到访分行 · 移动 App 立即可用"
        primaryCta={{ label: '在线开户 →', to: '/login?action=open' }}
        secondaryCta={{ label: '预约客户经理', to: '/help' }} />
    </ProductPage>
  );
}
