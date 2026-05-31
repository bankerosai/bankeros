import { useState } from 'react';
import BankingLayout from './BankingLayout';

const FULL_TRANSACTIONS = [
  { date: '2026-05-31', desc: '工资入账 - ACME 科技公司',     amount: 25000.00,  currency: 'CNY', type: 'in',  category: '工资',   balance: 128420.50, ref: 'TXN20260531001' },
  { date: '2026-05-30', desc: '美团 - 外卖订单',              amount: -86.50,    currency: 'CNY', type: 'out', category: '餐饮',   balance: 103420.50, ref: 'TXN20260530987' },
  { date: '2026-05-30', desc: '招商证券 - 申购货币基金',      amount: -50000.00, currency: 'CNY', type: 'out', category: '投资',   balance: 103507.00, ref: 'TXN20260530852' },
  { date: '2026-05-29', desc: '跨境汇款 - Alice Chen',        amount: -2500.00,  currency: 'USD', type: 'out', category: '汇款',   balance: 153507.00, ref: 'TXN20260529741' },
  { date: '2026-05-29', desc: 'Apple Store - iPhone 15 Pro', amount: -8999.00,  currency: 'CNY', type: 'out', category: '购物',   balance: 162506.00, ref: 'TXN20260529620' },
  { date: '2026-05-28', desc: '利息收入 - 港币定期存款',      amount: 1250.00,   currency: 'HKD', type: 'in',  category: '利息',   balance: 171505.00, ref: 'TXN20260528510' },
  { date: '2026-05-28', desc: '滴滴出行 - 网约车',            amount: -42.00,    currency: 'CNY', type: 'out', category: '交通',   balance: 170255.00, ref: 'TXN20260528421' },
  { date: '2026-05-27', desc: '星巴克咖啡',                   amount: -45.00,    currency: 'CNY', type: 'out', category: '餐饮',   balance: 170297.00, ref: 'TXN20260527310' },
  { date: '2026-05-27', desc: '京东 - 数码产品',              amount: -1280.00,  currency: 'CNY', type: 'out', category: '购物',   balance: 170342.00, ref: 'TXN20260527291' },
  { date: '2026-05-26', desc: '电费缴纳 - 国家电网',          amount: -380.00,   currency: 'CNY', type: 'out', category: '生活',   balance: 171622.00, ref: 'TXN20260526180' },
  { date: '2026-05-25', desc: '中国移动充值',                 amount: -100.00,   currency: 'CNY', type: 'out', category: '通讯',   balance: 172002.00, ref: 'TXN20260525142' },
  { date: '2026-05-25', desc: '招行信用卡还款',               amount: -3580.00,  currency: 'CNY', type: 'out', category: '还款',   balance: 172102.00, ref: 'TXN20260525098' },
];

const CATEGORY_COLOR: Record<string, string> = {
  工资: 'var(--b-success)', 利息: 'var(--b-success)',
  餐饮: '#db0011', 购物: '#002966', 交通: '#007a33',
  投资: '#ffba00', 汇款: '#a855f7', 生活: '#d97706',
  通讯: '#06b6d4', 还款: '#5a6470',
};

export default function PersonalStatements() {
  const [account, setAccount] = useState('a1');
  const [period, setPeriod] = useState('30d');
  const [category, setCategory] = useState('全部');
  const [search, setSearch] = useState('');

  const filtered = FULL_TRANSACTIONS.filter(t =>
    (category === '全部' || t.category === category) &&
    (!search || t.desc.includes(search))
  );

  const totalIn = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <BankingLayout variant="personal">
      <h1 className="b-page-title">账单流水</h1>
      <p className="b-page-sub">查询、导出您的账户交易明细 · 支持 PDF / Excel / camt.053 标准报表</p>

      {/* Summary strip */}
      <div className="b-grid-3" style={{ marginBottom: 24 }}>
        <div className="b-card">
          <div className="b-card-body">
            <div style={{ fontSize: 12, color: 'var(--b-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>当前余额</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--b-navy)' }}>¥ 128,420.50</div>
            <div style={{ fontSize: 12, color: 'var(--b-text-muted)', marginTop: 4 }}>一卡通主账户 · CNY</div>
          </div>
        </div>
        <div className="b-card">
          <div className="b-card-body">
            <div style={{ fontSize: 12, color: 'var(--b-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>本期收入</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--b-success)' }}>+¥ {totalIn.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
            <div style={{ fontSize: 12, color: 'var(--b-text-muted)', marginTop: 4 }}>共 {filtered.filter(t => t.amount > 0).length} 笔交易</div>
          </div>
        </div>
        <div className="b-card">
          <div className="b-card-body">
            <div style={{ fontSize: 12, color: 'var(--b-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>本期支出</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--b-text)' }}>-¥ {totalOut.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
            <div style={{ fontSize: 12, color: 'var(--b-text-muted)', marginTop: 4 }}>共 {filtered.filter(t => t.amount < 0).length} 笔交易</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="b-card" style={{ marginBottom: 24 }}>
        <div className="b-card-body" style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto auto', gap: 12, alignItems: 'end' }}>
            <div className="b-form-group" style={{ marginBottom: 0 }}>
              <label className="b-form-label">账户</label>
              <select className="b-form-input" value={account} onChange={e => setAccount(e.target.value)}>
                <option value="a1">一卡通主账户 (CNY)</option>
                <option value="a2">美元活期账户 (USD)</option>
                <option value="a4">欧元结算账户 (EUR)</option>
              </select>
            </div>
            <div className="b-form-group" style={{ marginBottom: 0 }}>
              <label className="b-form-label">时间段</label>
              <select className="b-form-input" value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="7d">近 7 天</option><option value="30d">近 30 天</option>
                <option value="90d">近 3 个月</option><option value="365d">近 1 年</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div className="b-form-group" style={{ marginBottom: 0 }}>
              <label className="b-form-label">类别</label>
              <select className="b-form-input" value={category} onChange={e => setCategory(e.target.value)}>
                <option>全部</option><option>工资</option><option>餐饮</option><option>购物</option>
                <option>交通</option><option>投资</option><option>汇款</option><option>利息</option>
              </select>
            </div>
            <div className="b-form-group" style={{ marginBottom: 0 }}>
              <label className="b-form-label">关键字</label>
              <input className="b-form-input" placeholder="搜索描述..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="b-btn b-btn-ghost" style={{ height: 42 }}>📥 Excel</button>
            <button className="b-btn b-btn-primary" style={{ height: 42 }}>📄 PDF</button>
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="b-card">
        <table className="b-table">
          <thead>
            <tr>
              <th>交易日期</th><th>交易描述</th><th>类别</th>
              <th style={{ textAlign: 'right' }}>金额</th>
              <th style={{ textAlign: 'right' }}>余额</th>
              <th>流水号</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.ref}>
                <td style={{ color: 'var(--b-text-muted)', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 12 }}>{t.date}</td>
                <td style={{ fontWeight: 500 }}>{t.desc}</td>
                <td>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600, background: `${CATEGORY_COLOR[t.category]}22`, color: CATEGORY_COLOR[t.category] }}>
                    {t.category}
                  </span>
                </td>
                <td className={t.amount > 0 ? 'b-amount-pos' : 'b-amount-neg'} style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 14 }}>
                  {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} {t.currency}
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'var(--b-text-muted)' }}>
                  ¥ {t.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--b-text-muted)' }}>{t.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--b-border)', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--b-text-muted)' }}>
          <span>显示 1-{filtered.length} 共 {filtered.length} 条</span>
          <span>导出 camt.053 标准报表用于会计软件对账</span>
        </div>
      </div>
    </BankingLayout>
  );
}
