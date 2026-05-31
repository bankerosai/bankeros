/**
 * mBridge CBDC deep dive — central bank digital currency cross-border settlement
 */

import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy, FaqAccordion,
} from '../ProductDetailPage';

export default function MBridgeCBDC() {
  return (
    <ProductDetailPage
      breadcrumbs={[
        { label: '关于我们' },
        { label: '科技与创新', to: '/about/innovation' },
        { label: 'mBridge 央行数字货币' },
      ]}
      sections={[
        { id: 'overview',   label: '什么是 mBridge' },
        { id: 'participants', label: '参与央行' },
        { id: 'tech',       label: '技术架构' },
        { id: 'compare',    label: '对比传统' },
        { id: 'usecases',   label: '适用场景' },
        { id: 'process',    label: '结算流程' },
        { id: 'case',       label: '客户案例' },
        { id: 'faq',        label: '常见问题' },
      ]}
      hero={{
        badge: '前沿创新 · 全球试点',
        category: 'Multi-CBDC Bridge',
        productName: 'mBridge 央行数字货币',
        tagline: '4 国央行 · 3 秒结算 · PvP 原子交收 · 突破代理行模式的下一代跨境支付',
        bullets: [
          '4 个央行直接参与 (人行/HKMA/CBUAE/BOT)',
          '4 种 CBDC: e-CNY / e-HKD / e-AED / e-THB',
          '平均结算 3 秒 (传统 SWIFT 1-5 天)',
          '近乎零手续费',
          'PvP 原子级交收 (无对手方风险)',
          '24×7 不间断运行',
        ],
        background: 'gradient',
        ctaPrimary: { label: '申请试点资格 →', to: '/help' },
        ctaSecondary: { label: '技术白皮书 (PDF)', to: '/about/innovation' },
      }}>

      {/* ───── Overview ───── */}
      <Sect id="overview" eyebrow="What is mBridge" title="mBridge 多边央行数字货币桥">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <div>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 16 }}>
              <strong>mBridge</strong> (multiple Central Bank Digital Currency Bridge) 是由<strong>国际清算银行 BIS 创新中心</strong>主导，
              联合<strong>中国人民银行、香港金管局 (HKMA)、阿联酋央行 (CBUAE)、泰国央行 (BOT)</strong> 共同发起的全球首个
              <strong>多边央行数字货币跨境结算平台</strong>。
            </p>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 16 }}>
              它打破传统跨境支付依赖<strong>代理行网络 (Correspondent Banking)</strong> 的模式，
              利用分布式账本技术 (DLT) 实现央行数字货币之间的<strong>实时点对点结算</strong>。
              单笔交易在 <strong>3 秒内完成</strong>，手续费近乎为零。
            </p>

            <div style={{ background: 'rgba(6,182,212,0.08)', borderLeft: '4px solid #06b6d4', padding: 16, borderRadius: 4 }}>
              <h4 style={{ fontWeight: 700, color: '#06b6d4', marginBottom: 8, fontSize: 14 }}>🌍 历史意义</h4>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', margin: 0, lineHeight: 1.6 }}>
                mBridge 是<strong>全球首个</strong>将多个央行数字货币（CBDC）直接互联互通的项目，
                被《经济学人》誉为"重塑国际支付体系的开端"。BankerOS 是首批获得央行授权的<strong>商业银行试点机构</strong>之一。
              </p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, var(--p-navy), var(--p-navy-dark))', color: 'white', padding: 24, borderRadius: 10 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffba00', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>关键技术指标</h4>
            {[
              ['平均结算时长', '3 秒'],
              ['交易峰值 (TPS)', '2,000+'],
              ['参与央行', '4 国 (扩展中)'],
              ['支持 CBDC', 'e-CNY / e-HKD / e-AED / e-THB'],
              ['日均交易量', '$2.4M (BankerOS)'],
              ['累计结算', '$1.2B (2024)'],
              ['节省成本', '约 50% vs SWIFT'],
              ['运行时间', '24/7 不间断'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: 13 }}>
                <span style={{ opacity: 0.75 }}>{k}</span>
                <span style={{ fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      {/* ───── Participants ───── */}
      <Sect id="participants" alt eyebrow="Central Banks" title="参与央行与货币">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { flag: '🇨🇳', cbdc: 'e-CNY', name: '数字人民币',  cb: '中国人民银行 PBoC', stage: '试点扩大', launch: '2020' },
            { flag: '🇭🇰', cbdc: 'e-HKD', name: '数字港元',    cb: '香港金管局 HKMA',  stage: '试点阶段', launch: '2023' },
            { flag: '🇦🇪', cbdc: 'e-AED', name: '数字迪拉姆',  cb: '阿联酋央行 CBUAE', stage: '试点阶段', launch: '2024' },
            { flag: '🇹🇭', cbdc: 'e-THB', name: '数字泰铢',    cb: '泰国央行 BOT',     stage: '试点阶段', launch: '2024' },
          ].map(c => (
            <div key={c.cbdc} style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>{c.flag}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--p-red)', marginBottom: 4 }}>{c.cbdc}</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginBottom: 8 }}>{c.cb}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--p-border)', fontSize: 11 }}>
                <span style={{ color: 'var(--p-text-muted)' }}>{c.launch} 启动</span>
                <span style={{ color: 'var(--p-success)', fontWeight: 600 }}>{c.stage}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, padding: 16, background: 'white', border: '1px dashed var(--p-border)', borderRadius: 8, fontSize: 13, color: 'var(--p-text-muted)', textAlign: 'center' }}>
          ⚡ 更多央行加入中：欧洲央行 (e-EUR)、新加坡 MAS (e-SGD)、英格兰银行 (digital pound) 处于谈判阶段
        </div>
      </Sect>

      {/* ───── Tech Architecture ───── */}
      <Sect id="tech" eyebrow="Technology" title="技术架构" subtitle="基于联盟链 (Permissioned DLT) · 各央行运行独立节点">
        <div style={{ background: 'white', padding: 36, borderRadius: 12, border: '1px solid var(--p-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            <div>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🏛</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 10 }}>央行节点层</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, marginBottom: 10 }}>
                每个参与央行运行独立验证节点，全程监管 CBDC 发行、销毁、跨境结算。
              </p>
              <div style={{ fontSize: 12, color: 'var(--p-text-muted)' }}>
                · 共识机制: HotStuff BFT<br />
                · 单点 TPS: 500+<br />
                · 数据加密: AES-256 + 国密 SM4
              </div>
            </div>
            <div>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🏦</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 10 }}>商业银行层</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, marginBottom: 10 }}>
                商业银行 (含 BankerOS) 作为参与方，为企业客户提供 mBridge 跨境结算服务。
              </p>
              <div style={{ fontSize: 12, color: 'var(--p-text-muted)' }}>
                · KYC / AML 银行执行<br />
                · 客户钱包托管<br />
                · 法币 ↔ CBDC 兑换
              </div>
            </div>
            <div>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🌐</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 10 }}>企业客户层</h3>
              <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, marginBottom: 10 }}>
                跨境贸易企业通过商业银行接入，无需了解底层 DLT 技术细节。
              </p>
              <div style={{ fontSize: 12, color: 'var(--p-text-muted)' }}>
                · API / Web 接入<br />
                · 兼容 ISO 20022 报文<br />
                · 单笔最高 $10M
              </div>
            </div>
          </div>
        </div>

        {/* PvP explanation */}
        <div style={{ marginTop: 24, padding: 28, background: 'var(--p-bg-section)', borderRadius: 10 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 12 }}>🔒 什么是 PvP 原子交收 (Payment versus Payment)？</h3>
          <p style={{ fontSize: 14, color: 'var(--p-text-soft)', lineHeight: 1.7 }}>
            传统跨境支付存在<strong>"赫斯塔特风险" (Herstatt Risk)</strong> — 即一方央行已支付货币，
            但另一方央行尚未支付对应货币时发生违约的风险（1974 年德国赫斯塔特银行倒闭事件）。
            mBridge 利用 DLT 的<strong>原子性</strong>，确保两个 CBDC 同步交换 — 要么同时成功，要么同时回滚，
            <strong>彻底消除赫斯塔特风险</strong>。
          </p>
        </div>
      </Sect>

      {/* ───── Comparison ───── */}
      <Sect id="compare" alt eyebrow="vs Traditional" title="对比传统 SWIFT 跨境支付">
        <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--p-bg-section)' }}>
              <tr>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 13, color: 'var(--p-text-muted)' }}>维度</th>
                <th style={{ padding: 14, textAlign: 'center', fontSize: 13, color: 'var(--p-text-muted)' }}>传统 SWIFT (Correspondent)</th>
                <th style={{ padding: 14, textAlign: 'center', fontSize: 13, color: '#06b6d4' }}>mBridge CBDC 🚀</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['结算时长',   '1-5 个工作日',  '3 秒'],
                ['手续费',    '$20-$50/笔 + 汇率差', '近乎零'],
                ['汇率',      '中间行多次加成', '央行间直接结算'],
                ['运行时间',  '银行营业时间 (T+1/T+2)', '24×7 不间断'],
                ['中介机构',  '2-5 家代理行', '0 (央行直连)'],
                ['可追溯性',  'SWIFT GPI (新)', '区块链全程可追溯'],
                ['赫斯塔特风险', '存在', '消除 (PvP 原子)'],
                ['合规审查',  '各代理行重复审查', '一次审查全链通过'],
                ['报文标准',  'MT103 → ISO 20022', 'ISO 20022 + DLT'],
                ['Tx 不可篡改', '中心化日志', '分布式账本 (不可篡改)'],
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--p-border-soft)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{row[0]}</td>
                  <td style={{ padding: 12, textAlign: 'center', color: 'var(--p-text-soft)' }}>{row[1]}</td>
                  <td style={{ padding: 12, textAlign: 'center', color: 'var(--p-success)', fontWeight: 700 }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sect>

      {/* ───── Use Cases ───── */}
      <Sect id="usecases" eyebrow="Use Cases" title="典型适用场景">
        <UseCaseGrid items={[
          { persona: '跨境贸易企业', icon: '🚢',
            scenario: '中国 ↔ 香港/泰国/阿联酋 贸易结算',
            benefit: '从 T+2 缩短至 3 秒 · 节省 50% 手续费',
            example: '中粮集团向泰国采购大米 USD 5M，3 秒结算到账' },
          { persona: '跨境电商', icon: '🛒',
            scenario: '海外采购小额高频订单',
            benefit: '24×7 实时清算 · 适合零售碎片化交易',
            example: 'Shein 在阿联酋采购布料 AED 50K/天，秒级到账' },
          { persona: '跨国集团内部结算', icon: '🏢',
            scenario: '集团内部跨境资金调拨',
            benefit: '替代昂贵的内部 SWIFT 转账',
            example: '华为深圳总部向迪拜分公司调拨运营资金' },
          { persona: '工程承包商', icon: '🏗',
            scenario: '海外项目当地工资发放',
            benefit: '员工当地银行账户秒级到账',
            example: '中铁建在沙特项目，向 800 名当地员工发放工资' },
          { persona: '能源/大宗商品贸易', icon: '🛢',
            scenario: 'BP/壳牌等向中东/俄罗斯采购原油',
            benefit: '减少中间行收费 · 锁定汇率',
            example: '中石化向阿联酋采购原油 USD 100M/月' },
          { persona: '央行/财政部', icon: '🏛',
            scenario: '主权基金/央行外汇储备调配',
            benefit: '央行直接结算 · 最高安全性',
            example: 'CBUAE 向 PBoC 调拨外汇储备 1B AED' },
        ]} />
      </Sect>

      {/* ───── Process ───── */}
      <Sect id="process" alt eyebrow="Settlement Flow" title="mBridge 结算流程">
        <ProcessFlow steps={[
          { step: '01', actor: '付款企业', title: '发起付款指令',  desc: 'API/Web 提交跨境付款请求' },
          { step: '02', actor: 'BankerOS', title: 'KYC/AML 审查',  desc: '本地 KYC + 制裁筛查 + 限额校验' },
          { step: '03', actor: 'BankerOS', title: '法币 → CBDC',  desc: '客户账户扣 CNY · 兑换为 e-CNY' },
          { step: '04', actor: 'PBoC',     title: '上链结算',     desc: '央行节点处理 e-CNY ↔ e-AED 兑换' },
          { step: '05', actor: 'CBUAE',    title: 'PvP 交收',      desc: '原子级同步交换 (3 秒内)' },
          { step: '06', actor: '收款行',   title: 'CBDC → 法币',  desc: '兑换为 AED 入收款企业账户' },
        ]} />
      </Sect>

      {/* ───── Case Study ───── */}
      <Sect id="case" eyebrow="Customer Success" title="客户案例">
        <CaseStudy
          company="中粮国际 (Cofco International)"
          logo="🌾"
          industry="全球大宗粮油贸易 · 业务覆盖 50+ 国家"
          challenge="中粮每月从泰国采购大米超过 USD 80M，传统 SWIFT 路径：人民币 → 美元 → 泰铢，途经 3 家代理行，平均 T+2 到账，单笔手续费 USD 35-50，且面临 USD/THB 双重汇率风险。"
          solution="2024 年 Q1 加入 BankerOS mBridge 试点。中粮在 BankerOS 开立 e-CNY 钱包，通过 mBridge 直接结算 e-CNY ↔ e-THB，从泰国合作社（同样使用泰国央行 e-THB）即时收款。"
          results={[
            { metric: '结算时长', value: '3 秒' },
            { metric: '节省手续费', value: '$420K/年' },
            { metric: '减少汇率风险', value: '日均 ¥2M' },
            { metric: '运营人力节省', value: '5 名 FTE' },
          ]}
          quote="mBridge 让我们的跨境支付从'隔夜任务'变成'即时操作'。最重要的是消除了赫斯塔特风险，会计部门再也不用追踪'在途资金'了。"
          quoteAuthor="林总 · 中粮国际财务总监"
        />
      </Sect>

      {/* ───── FAQ ───── */}
      <Sect id="faq" alt eyebrow="FAQ" title="常见问题">
        <FaqAccordion items={[
          { q: '什么企业能加入 mBridge？', a: '目前处于试点阶段，优先开放给：① 年跨境贸易额 USD 1M+ 的企业；② 注册地在 4 个参与国家的企业；③ 有真实贸易背景的客户。BankerOS 是首批商业银行试点之一。' },
          { q: '我的资金安全吗？', a: '极其安全。① 所有 CBDC 由央行直接发行担保 (不是稳定币)；② 分布式账本不可篡改；③ PvP 原子交收消除对手方风险；④ 商业银行托管，受银行存款保险保护。' },
          { q: '与稳定币 (USDT/USDC) 有什么区别？', a: 'CBDC 是央行直接发行的法定数字货币，具有完全的国家信用担保。稳定币是商业机构 (Tether/Circle) 发行的私人代币，需要储备金担保，存在挤兑和破产风险。CBDC = 法定货币的数字形态。' },
          { q: '需要懂区块链技术吗？', a: '不需要。BankerOS 提供 API 和 Web 界面，企业客户的操作体验与传统跨境付款完全一致，底层 DLT 技术对客户透明。' },
          { q: 'mBridge 是否合规？', a: '完全合规。该项目由 BIS 创新中心主导，4 国央行直接参与监管。所有交易实时上报央行，符合反洗钱、外汇管制和数据本地化要求。' },
          { q: '什么时候能商业化大规模使用？', a: '试点阶段已开放给特定企业。预计 2026 年扩展至全部参与国所有企业。2028 年欧元 / 英镑 / 新加坡元 CBDC 预计加入，形成全球网络。' },
          { q: '失败的交易会回滚吗？', a: '会。mBridge 使用原子事务 (atomic transaction)。如果任何环节失败，整笔交易自动回滚，资金原路返回，不会出现"一方付了款另一方没收到"的情况。' },
        ]} />
      </Sect>

      <section className="p-section" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>加入跨境支付的未来</h2>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 28 }}>申请 mBridge CBDC 试点资格 · BankerOS 全程技术支持</p>
          <a href="/help" className="p-btn" style={{ background: 'white', color: '#06b6d4', padding: '14px 36px', fontWeight: 700, fontSize: 14 }}>申请试点 →</a>
        </div>
      </section>
    </ProductDetailPage>
  );
}
