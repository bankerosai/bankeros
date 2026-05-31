import { useState } from 'react';
import ProductPage, { Section, SectionHeader } from './ProductPage';

const FAQS = [
  { cat: '账户开户', q: '如何在线开户?', a: '访问首页"在线开户"，准备好身份证 + 手机号 + 人像照片，全流程 8 分钟。系统将自动完成 KYC 制裁筛查，通过后立即开户成功。' },
  { cat: '账户开户', q: '开户需要什么证件?', a: '个人客户：身份证 (中国) / 护照 (海外)。企业客户：营业执照 + 法人身份证 + 公司章程 + 银行开户许可证。' },
  { cat: '账户开户', q: '可以远程开户吗?', a: '可以。我们支持视频开户和电子签约，无需到访分行。海外客户可通过香港/新加坡分行远程开户。' },
  { cat: '支付转账', q: '跨境汇款多久到账?', a: '即时汇款 (< $50K) 1 小时内到账。SWIFT GPI 标准汇款 6 小时内到账。mBridge CBDC 3 秒到账（试点客户）。' },
  { cat: '支付转账', q: '单笔转账上限是多少?', a: '个人客户境内单笔 50 万。跨境单笔 $50K (普通) / $200K (Premier 客户)。企业客户根据账户级别可达 $10M+。' },
  { cat: '支付转账', q: '转错账户怎么办?', a: '立即拨打 95588 客服热线挂失。系统会尝试拦截资金（24 小时内成功率高）。如已入账对方，需对方银行配合或司法协助。' },
  { cat: '贷款服务', q: '个人贷款多久审批?', a: '消费贷 (闪贷) 最快 8 分钟在线放款。住房按揭审批 3-7 个工作日。SME 经营贷 1-3 个工作日。' },
  { cat: '贷款服务', q: '提前还款是否需要违约金?', a: '个人消费贷无违约金。住房按揭根据贷款合同，多数无违约金或仅前 3 年收取 1% 违约金。' },
  { cat: '贷款服务', q: '征信不良能贷款吗?', a: '严重不良记录 (M3+) 难以通过。轻微逾期可申请，但利率上浮。我们提供专属信用修复指导服务。' },
  { cat: '财富管理', q: '什么是 Premier 客户?', a: '日均资产 50 万元或月薪 3 万+ 的客户自动升级为 Premier，享专属客户经理、全球账户互通、机场贵宾厅等礼遇。' },
  { cat: '财富管理', q: '智能投顾怎么收费?', a: '智能投顾管理费 0.5%/年，远低于传统财富管理。无申购费、赎回费 (1 年以上)。' },
  { cat: '财富管理', q: 'Jade 钻石客户的入门门槛?', a: '日均总资产达 600 万元自动升级为 Jade，享 1v1 资深财富顾问、私募基金独家配额、Jade Lounge 等顶级服务。' },
  { cat: '安全防护', q: '账户被盗怎么办?', a: '立即拨打 95588 挂失（24×7）。手机银行内一键冻结。我们承诺：经核实非客户原因损失，48 小时内全额赔付。' },
  { cat: '安全防护', q: '如何辨别欺诈?', a: 'BankerOS 永不通过电话/短信索要密码或验证码。任何要求转账到"安全账户"的都是骗子。可疑请打 95588。' },
  { cat: '安全防护', q: '推荐启用哪些安全功能?', a: '强制开启: 短信交易提醒 + TOTP 双因素验证。Premier 客户建议: U-Key 硬件令牌 + 异常登录预警 + 地理围栏。' },
];

export default function Help() {
  const [activeCat, setActiveCat] = useState('全部');
  const [query, setQuery] = useState('');

  const categories = ['全部', ...Array.from(new Set(FAQS.map(f => f.cat)))];
  const filtered = FAQS.filter(f =>
    (activeCat === '全部' || f.cat === activeCat) &&
    (!query || f.q.includes(query) || f.a.includes(query))
  );

  return (
    <ProductPage
      breadcrumbs={[{ label: '帮助中心' }]}
      hero={{
        eyebrow: 'Customer Support',
        title: <>客户帮助中心<br /><span className="accent">7×24 为您服务</span></>,
        subtitle: '常见问题 · 在线咨询 · 客服热线 95588 · 全球分行 · 视频客服 · 智能机器人',
      }}>

      {/* Quick contact */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { icon: '📞', title: '电话客服', desc: '24×7 中文 + 英文', value: '95588 (境内) · +86 21 95588 (境外)' },
            { icon: '💬', title: '在线客服', desc: '工作日 8:00-22:00', value: '7×24 智能机器人答复' },
            { icon: '🎥', title: '视频客服', desc: 'Premier 专属', value: '高清视频 1v1 客户经理' },
            { icon: '🏦', title: '分行预约', desc: '450+ 全球分行', value: '在线预约免排队' },
          ].map(c => (
            <div key={c.title} style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 4 }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--p-text-muted)', marginBottom: 8 }}>{c.desc}</p>
              <p style={{ fontSize: 13, color: 'var(--p-text)' }}>{c.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ Search */}
      <Section alt>
        <SectionHeader eyebrow="FAQ" title="常见问题" />
        <input type="text" placeholder="搜索您遇到的问题..." value={query} onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', maxWidth: 520, margin: '0 auto 24px', padding: '14px 20px', border: '2px solid var(--p-border)', borderRadius: 8, fontSize: 14, display: 'block', fontFamily: 'inherit' }} />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className="p-btn"
              style={{ background: activeCat === c ? 'var(--p-red)' : 'white', color: activeCat === c ? 'white' : 'var(--p-text-soft)', border: `1px solid ${activeCat === c ? 'var(--p-red)' : 'var(--p-border)'}` }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--p-border)', overflow: 'hidden' }}>
          {filtered.map((f, i) => (
            <details key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--p-border-soft)' }}>
              <summary style={{ padding: '18px 24px', cursor: 'pointer', fontWeight: 600, color: 'var(--p-navy)', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><span style={{ color: 'var(--p-red)', marginRight: 8 }}>[{f.cat}]</span> {f.q}</span>
                <span style={{ color: 'var(--p-text-muted)' }}>+</span>
              </summary>
              <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--p-text-soft)', lineHeight: 1.7 }}>{f.a}</div>
            </details>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--p-text-muted)' }}>
            没有找到相关问题。请尝试其他关键词或<a href="#" style={{ color: 'var(--p-red)', marginLeft: 4 }}>联系在线客服</a>
          </div>
        )}
      </Section>
    </ProductPage>
  );
}
