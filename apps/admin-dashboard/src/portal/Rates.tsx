import ProductPage, { Section, SectionHeader } from './ProductPage';

export default function Rates() {
  return (
    <ProductPage
      breadcrumbs={[{ label: '利率/汇率公告' }]}
      hero={{
        eyebrow: 'Rates & Tariffs',
        title: <>利率与汇率<br /><span className="accent">每日实时公告</span></>,
        subtitle: '存款利率 · 贷款利率 · 外汇牌价 · 贵金属牌价 · 信用卡分期费率',
      }}>

      <Section>
        <SectionHeader eyebrow="Deposit Rates" title="人民币存款利率" align="left" />
        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--p-bg-section)' }}>
              <tr>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)' }}>类型</th>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)' }}>期限</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>年利率</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>最低起存</th>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)' }}>备注</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['活期存款', '随时支取', '0.20%', '¥ 0',     '7×24 可取'],
                ['整存整取', '3 个月',  '1.20%', '¥ 50',    ''],
                ['整存整取', '6 个月',  '1.40%', '¥ 50',    ''],
                ['整存整取', '1 年',    '1.65%', '¥ 50',    '送积分'],
                ['整存整取', '2 年',    '2.10%', '¥ 50',    ''],
                ['整存整取', '3 年',    '2.40%', '¥ 50',    '送积分'],
                ['整存整取', '5 年',    '2.50%', '¥ 50',    ''],
                ['大额存单', '1 年',    '1.85%', '¥ 200,000', '可转让'],
                ['大额存单', '3 年',    '2.85%', '¥ 200,000', '可转让 · 利率上浮 35%'],
                ['通知存款', '1 天',    '0.55%', '¥ 50,000',  ''],
                ['通知存款', '7 天',    '1.10%', '¥ 50,000',  '提前通知支取'],
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--p-border-soft)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{row[0]}</td>
                  <td style={{ padding: 12 }}>{row[1]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--p-red)' }}>{row[2]}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>{row[3]}</td>
                  <td style={{ padding: 12, fontSize: 12, color: 'var(--p-text-muted)' }}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 10 }}>更新于 {new Date().toLocaleString('zh-CN')} · 实际利率以当日营业网点公布为准</div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Loan Rates" title="贷款利率公告 (LPR 基础)" align="left" />
        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--p-bg-section)' }}>
              <tr>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)' }}>产品</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>LPR</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>加点</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>实际利率</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>最高额度</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['首套房住房贷款',  '4.35%', '-30 bp', '4.05%', '¥ 20M'],
                ['二套房住房贷款',  '4.35%', '+60 bp', '4.95%', '¥ 15M'],
                ['个人消费贷',     '4.35%', '+240 bp', '6.75%', '¥ 1M'],
                ['闪贷',           '4.35%', '+285 bp', '7.20%', '¥ 300K'],
                ['汽车贷款',       '4.35%', '+165 bp', '6.00%', '¥ 1M'],
                ['信用卡分期 (12期)', '—',  '—',      '12.00%', '¥ 200K'],
                ['SME 经营贷',     '4.35%', '+85 bp', '5.20%', '¥ 50M'],
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--p-border-soft)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{row[0]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace' }}>{row[1]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-text-muted)' }}>{row[2]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--p-red)' }}>{row[3]}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="FX Rates" title="外汇牌价 (人民币每 100 单位)" align="left" />
        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--p-bg-section)' }}>
              <tr>
                <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)' }}>币种</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>现汇买入</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>现钞买入</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>现汇卖出</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>现钞卖出</th>
                <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)' }}>中间价</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['🇺🇸 美元 USD',     '725.38', '720.21', '726.20', '728.81', '725.79'],
                ['🇪🇺 欧元 EUR',     '787.21', '784.12', '788.40', '791.20', '787.80'],
                ['🇬🇧 英镑 GBP',     '918.45', '914.50', '919.20', '921.80', '918.82'],
                ['🇯🇵 日元 JPY',     '4.840',  '4.820',  '4.880',  '4.910',  '4.860'],
                ['🇭🇰 港币 HKD',     '92.75',  '92.58',  '92.90',  '93.18',  '92.82'],
                ['🇸🇬 新元 SGD',     '540.10', '538.22', '541.50', '544.20', '540.35'],
                ['🇦🇺 澳元 AUD',     '478.21', '476.50', '479.20', '481.80', '478.70'],
                ['🇨🇦 加元 CAD',     '531.05', '529.20', '532.10', '534.85', '531.20'],
              ].map(row => (
                <tr key={row[0]} style={{ borderTop: '1px solid var(--p-border-soft)' }}>
                  <td style={{ padding: 12, fontWeight: 600 }}>{row[0]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-success)' }}>{row[1]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-text-muted)' }}>{row[2]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-red)' }}>{row[3]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--p-text-muted)' }}>{row[4]}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: 'var(--p-text-muted)', marginTop: 10 }}>更新于 {new Date().toLocaleString('zh-CN')} · 实际交易汇率以银行实时报价为准</div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow="Precious Metals" title="贵金属牌价" align="left" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { name: '🟡 黄金 Au99.99', bid: '¥ 568.20/g', ask: '¥ 569.50/g', chg: '+1.2%', up: true },
            { name: '⚪ 白银 Ag99.99', bid: '¥ 7.21/g',   ask: '¥ 7.28/g',   chg: '+0.8%', up: true },
            { name: '🟠 铂金 Pt99.95', bid: '¥ 220.40/g', ask: '¥ 222.80/g', chg: '-0.5%', up: false },
            { name: '🟣 钯金 Pd99.95', bid: '¥ 195.80/g', ask: '¥ 198.20/g', chg: '+2.1%', up: true },
          ].map(m => (
            <div key={m.name} style={{ background: 'white', padding: 20, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 12 }}>{m.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>买入</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--p-success)' }}>{m.bid}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>卖出</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--p-red)' }}>{m.ask}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--p-border-soft)', paddingTop: 6, marginTop: 6, textAlign: 'right', fontSize: 12, fontWeight: 600, color: m.up ? 'var(--p-success)' : 'var(--p-red)' }}>{m.chg}</div>
            </div>
          ))}
        </div>
      </Section>
    </ProductPage>
  );
}
