import ProductPage, { Section, SectionHeader, FeatureGrid, BenefitList, CtaBanner } from '../ProductPage';

export function BusinessSme() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '企业银行' }, { label: '小微企业' }]}
      hero={{
        eyebrow: 'SME Banking · 年营业额 < 1 亿',
        title: <>小微企业银行<br /><span className="accent">让创业更简单</span></>,
        subtitle: '5 个工作日极速开户 · 一户多用 · 无最低存款要求 · 在线申请经营贷',
        ctaPrimary: { label: '在线开户 →', to: '/login?action=open' },
        ctaSecondary: { label: '咨询客户经理', to: '/help' },
        background: 'navy',
      }}>
      <Section>
        <SectionHeader eyebrow="Account Packages" title="3 档小微企业账户" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { name: '基础版', price: '¥ 0 / 月', target: '初创企业 · 自由职业者',
              perks: ['免最低存款', '基础对公账户 + 借记卡', '20 笔/月免费转账', '电子对账单', '手机银行 + Web 银行'] },
            { name: '专业版', price: '¥ 200 / 月', target: '成长期企业 · 月流水 50 万+',
              perks: ['基础版全部权益', '100 笔/月免费转账', '多人协作 + 审批工作流', '一户多用 (最多 5 个子账户)', '专属客户经理'], featured: true },
            { name: '尊享版', price: '¥ 800 / 月', target: '中型企业 · 月流水 500 万+',
              perks: ['专业版全部权益', '不限笔数免费转账', 'API 银行 (ERP 直连)', '多币种账户', '现金管理服务', 'VIP 客户经理 1v1'] },
          ].map(p => (
            <div key={p.name} style={{
              background: 'white', borderRadius: 10, padding: 28,
              border: p.featured ? '2px solid var(--p-red)' : '1px solid var(--p-border)',
              boxShadow: p.featured ? '0 8px 24px rgba(219,0,17,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              position: 'relative',
            }}>
              {p.featured && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--p-red)', color: 'white', padding: '4px 14px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>最受欢迎</div>}
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--p-navy)', marginBottom: 4 }}>{p.name}</h3>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--p-red)', marginBottom: 4 }}>{p.price}</div>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', marginBottom: 24 }}>{p.target}</p>
              <BenefitList items={p.perks} />
              <a href="/login?action=open" className="p-btn p-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>选择 {p.name}</a>
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="SME Loans" title="6 款融资方案 · 点击查看详情" subtitle="无抵押信用贷款 · 抵押贷款 · 供应链融资 · 多种产品" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '⚡', title: '小微闪贷',     desc: '无抵押信用贷 · 最高 500 万 · 在线申请 24 小时放款 · 利率 8% 起',     to: '/products/loans/flash' },
            { icon: '🏠', title: '抵押经营贷',   desc: '房产/股权/票据抵押 · 最高 5000 万 · 利率最低 4.5% · 期限最长 10 年', to: '/products/loans/business-owner' },
            { icon: '📦', title: '供应链金融',   desc: '应收账款融资 · 订单融资 · 保理 · 与核心企业合作池',                    to: '/products/business/sme/supply-chain' },
            { icon: '🚢', title: '进出口贸易贷', desc: '信用证项下融资 · 出口押汇 · 进口押汇 · 海外应收账款',                  to: '/products/business/trade-finance/export-financing' },
            { icon: '🏭', title: '设备融资',     desc: '设备分期 / 融资租赁 · 最高设备款 80% · 期限 1-5 年',                  to: '/products/business/sme/equipment' },
            { icon: '💰', title: '过桥贷款',     desc: 'IPO 前 / 融资过桥 · 期限 3-12 个月 · 灵活利率',                       to: '/products/business/sme/bridge-loan' },
          ].map(p => (
            <a key={p.title} href={p.to}
              style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 28, textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s', cursor: 'pointer' }}
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

      <Section>
        <SectionHeader eyebrow="One-Stop Services" title="小微企业一站式服务" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { icon: '🧾', title: '电子发票', desc: '与税务系统直连，自动开票/查验' },
            { icon: '👥', title: '薪资代发', desc: '员工工资秒到 · 自动公积金/社保' },
            { icon: '📊', title: '财务报表', desc: '自动生成现金流/利润/资产负债表' },
            { icon: '🔌', title: 'API 接入', desc: 'ERP / SaaS / 电商平台一键直连' },
            { icon: '🛡', title: '反欺诈',   desc: 'AI 反欺诈 · 异常交易实时告警' },
            { icon: '📞', title: '客户服务', desc: '专属客户经理 + 7×24 客服' },
            { icon: '🎓', title: '企业培训', desc: '财税合规/海外拓展培训' },
            { icon: '🤝', title: '商业生态', desc: '50+ 合作伙伴 (法律/会计/HR)' },
          ].map(s => (
            <div key={s.title} style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-soft)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner title="开启您的企业银行之旅" desc="在线提交资料，5 个工作日内完成开户 · 立享 6 个月免月费"
        primaryCta={{ label: '在线开户 →', to: '/login?action=open' }}
        secondaryCta={{ label: '电话咨询', to: '/help' }} />
    </ProductPage>
  );
}

export function BusinessCashManagement() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '企业银行' }, { label: '现金管理' }]}
      hero={{
        eyebrow: 'Cash & Liquidity Management',
        title: <>集团现金管理<br /><span className="accent">全球资金一手掌控</span></>,
        subtitle: '多账户实时归集 · 跨境资金池 · 名义轧差 · 智能预测 · 服务 7,200 家跨国集团',
        ctaPrimary: { label: '预约方案咨询 →', to: '/help' },
        background: 'navy',
      }}>
      <Section>
        <SectionHeader eyebrow="Core Solutions" title="6 大现金管理方案 · 点击查看详情" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🏦', title: '账户管理',     desc: '集团多账户视图 · 多公司/多币种/多地区统一管控',                    to: '/products/business/cash-management/accounts' },
            { icon: '💧', title: '资金池',       desc: '物理归集 + 名义归集 · 多达 7 级层级 · 最受欢迎方案',                to: '/products/business/cash-management/pool-details' },
            { icon: '💸', title: '智能支付',     desc: '批量支付 + 单笔支付 + 周期付款 + Maker-Checker 多级审批',           to: '/products/business/cash-management/smart-payment' },
            { icon: '📥', title: '收款管理',     desc: '虚拟账户 (VA) · 自动识别归属 · 应收账款自动对账',                   to: '/products/business/cash-management/receivables' },
            { icon: '📊', title: '流动性预测',   desc: 'AI 模型预测 30-365 天现金流 · 短缺/过剩自动告警',                   to: '/products/business/cash-management/liquidity-forecast' },
            { icon: '🔌', title: 'API & H2H',   desc: 'ISO 20022 标准 · ERP/SAP/Oracle 实时对接 · Host-to-Host',           to: '/products/business/api' },
          ].map(p => (
            <a key={p.title} href={p.to}
              style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 28, textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s', cursor: 'pointer' }}
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
        <SectionHeader eyebrow="Pool Architectures" title="3 种主流资金池架构" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { name: '物理资金池 (Zero Balancing)', desc: '日终自动将子账户余额清零归集至主账户。子账户次日有需要时自动从主账户拨款。',
              suit: '适合需要严格集中现金管理的集团', icon: '⬆️' },
            { name: '名义资金池 (Notional)', desc: '不发生实际资金转移，但银行按集团所有账户净额计算利息。轧差后净存款享更高利率，净贷款少付利息。',
              suit: '适合跨法人/跨国公司无法实际归集的场景', icon: '🔀' },
            { name: '目标余额池 (Target Balancing)', desc: '子账户始终维持设定的目标余额，溢出/不足自动从主账户清扫/补充。',
              suit: '适合分行/子公司需要保留运营资金', icon: '🎯' },
          ].map(p => (
            <div key={p.name} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 10 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>
              <div style={{ background: 'var(--p-bg-section)', padding: '8px 12px', borderRadius: 4, fontSize: 11, color: 'var(--p-text-muted)' }}>{p.suit}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Customer Success" title="客户案例" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { logo: '🏭', name: 'ACME 制造集团', desc: '12 国 38 家子公司 · 现金归集 99.5% · 节省利息支出 $4.2M/年' },
            { logo: '🚢', name: 'Gulf Trading FZE', desc: '阿联酋总部 · 全球 6 个贸易港 · 实时跨境支付 · DSO 缩短 18 天' },
            { logo: '💻', name: 'Tech Innovation Co.', desc: '中港新三地架构 · API 直连 ERP · 月对账人力节省 80%' },
          ].map(c => (
            <div key={c.name} style={{ background: 'white', padding: 28, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{c.logo}</div>
              <h4 style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{c.name}</h4>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner title="为您的集团定制现金管理方案" desc="资深现金管理专家 30 分钟内回电"
        primaryCta={{ label: '联系专家 →', to: '/help' }} />
    </ProductPage>
  );
}

export function BusinessTradeFinance() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '企业银行' }, { label: '贸易融资' }]}
      hero={{
        eyebrow: 'Trade Finance',
        title: <>全球贸易融资<br /><span className="accent">畅行 200+ 国家</span></>,
        subtitle: 'L/C · 保函 · 出口押汇 · 福费廷 · 保理 · 全球 60+ 主要贸易港覆盖',
        ctaPrimary: { label: '在线开立 L/C →', to: '/login' },
        background: 'navy',
      }}>
      <Section>
        <SectionHeader eyebrow="Trade Products" title="8 大贸易融资产品 · 点击查看详情" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { icon: '📄', title: '信用证 (L/C)', desc: '进口跟单信用证 / 出口议付 · UCP 600 标准 · SWIFT MT700', to: '/products/business/trade-finance/lc-details' },
            { icon: '🤝', title: '银行保函',     desc: '投标保函 / 履约保函 / 预付款保函 / 财务保函 · URDG 758',  to: '/products/business/trade-finance/bank-guarantee' },
            { icon: '💰', title: '出口押汇',     desc: '出口商凭单据从银行取得贸易融资 · 折扣率 LIBOR + 50bp 起', to: '/products/business/trade-finance/export-financing' },
            { icon: '📥', title: '进口押汇',     desc: '进口商赎单付款融资 · 30-180 天 · 灵活展期',              to: '/products/business/trade-finance/import-financing' },
            { icon: '🌐', title: '福费廷',       desc: '无追索权买断远期信用证下应收款 · 出口商立即收款',          to: '/products/business/trade-finance/forfaiting' },
            { icon: '📊', title: '出口保理',     desc: '基于应收账款的融资 · 含信用风险担保 · 国际保理协会',      to: '/products/business/trade-finance/export-factoring' },
            { icon: '🚢', title: '航运融资',     desc: '船舶购置 · 航运公司流动资金 · 海上保险',                  to: '/products/business/trade-finance/shipping-finance' },
            { icon: '🛂', title: '出口信贷',     desc: '配合出口信用保险 · 中长期项目融资 · OECD 框架',          to: '/products/business/trade-finance/export-credit' },
          ].map(p => (
            <a key={p.title} href={p.to}
              style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 22, textDecoration: 'none', color: 'var(--p-text)', display: 'block', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--p-red)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)'; }}
              onMouseOut={(e)  => { e.currentTarget.style.borderColor = 'var(--p-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6 }}>{p.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>{p.desc}</p>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-red)' }}>详情 →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Trade Network" title="全球贸易网络" subtitle="覆盖全球主要贸易港，与全球前 50 大银行直接代理关系" />
        <div style={{ background: 'white', padding: 40, borderRadius: 12, border: '1px solid var(--p-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              { region: '亚太', countries: ['🇨🇳 中国', '🇭🇰 香港', '🇸🇬 新加坡', '🇯🇵 日本', '🇰🇷 韩国', '🇮🇳 印度', '🇻🇳 越南', '🇹🇭 泰国'] },
              { region: '欧洲', countries: ['🇬🇧 英国', '🇩🇪 德国', '🇫🇷 法国', '🇮🇹 意大利', '🇪🇸 西班牙', '🇳🇱 荷兰', '🇨🇭 瑞士', '🇧🇪 比利时'] },
              { region: '美洲', countries: ['🇺🇸 美国', '🇨🇦 加拿大', '🇲🇽 墨西哥', '🇧🇷 巴西', '🇦🇷 阿根廷', '🇨🇱 智利', '🇨🇴 哥伦比亚'] },
              { region: '中东非洲', countries: ['🇦🇪 阿联酋', '🇸🇦 沙特', '🇿🇦 南非', '🇪🇬 埃及', '🇳🇬 尼日利亚', '🇰🇪 肯尼亚', '🇮🇱 以色列', '🇹🇷 土耳其'] },
            ].map(r => (
              <div key={r.region}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-red)', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid var(--p-bg-section)' }}>{r.region}</h4>
                {r.countries.map(c => (
                  <div key={c} style={{ padding: '6px 0', fontSize: 13, color: 'var(--p-text-soft)' }}>{c}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBanner title="贸易融资专家为您服务" desc="40+ 年经验的贸易融资专家，30 分钟回电"
        primaryCta={{ label: '在线申请 L/C →', to: '/login' }}
        secondaryCta={{ label: '电话咨询', to: '/help' }} />
    </ProductPage>
  );
}
