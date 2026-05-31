import { useState } from 'react';
import BankingLayout from './BankingLayout';

const PAYEES = [
  { id: 'p1', name: 'Alice Chen',   bank: 'HSBC Hong Kong',  account: '004-123-456789-001', currency: 'HKD', last: '2026-05-20' },
  { id: 'p2', name: '王芳 / Wang Fang', bank: '招商银行',         account: '6225 ··· 1234',       currency: 'CNY', last: '2026-05-15' },
  { id: 'p3', name: 'Acme Trading Ltd', bank: 'Standard Chartered', account: 'GB29NWBK60161331926819', currency: 'GBP', last: '2026-04-28' },
  { id: 'p4', name: '父亲 / Zhao Sr.',  bank: '中国工商银行',     account: '6222 ··· 8801',       currency: 'CNY', last: '2026-04-15' },
];

type Step = 'form' | 'review' | 'otp' | 'success';

export default function PersonalTransfer() {
  const [step, setStep] = useState<Step>('form');
  const [fromAccount, setFromAccount] = useState('a1');
  const [transferType, setTransferType] = useState<'internal' | 'domestic' | 'cross-border'>('internal');
  const [amount, setAmount] = useState('1000');
  const [payee, setPayee] = useState(PAYEES[0]);
  const [purpose, setPurpose] = useState('个人转账');
  const [memo, setMemo] = useState('');
  const [otp, setOtp] = useState('');

  const fee = transferType === 'cross-border' ? '50.00' : transferType === 'domestic' ? '2.00' : '0.00';
  const totalCost = (parseFloat(amount || '0') + parseFloat(fee)).toFixed(2);

  function next() {
    if (step === 'form') setStep('review');
    else if (step === 'review') setStep('otp');
    else if (step === 'otp' && otp.length === 6) setStep('success');
  }
  function back() {
    if (step === 'review') setStep('form');
    else if (step === 'otp') setStep('review');
  }
  function reset() {
    setStep('form'); setAmount('1000'); setOtp(''); setMemo('');
  }

  return (
    <BankingLayout variant="personal">
      <h1 className="b-page-title">转账汇款</h1>
      <p className="b-page-sub">境内实时到账 · 跨境最快 6 小时 · 每笔限额 50 万元</p>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['form', 'review', 'otp', 'success'] as Step[]).map((s, i) => {
          const labels = { form: '填写信息', review: '确认信息', otp: '安全验证', success: '完成' };
          const idx = ['form', 'review', 'otp', 'success'].indexOf(step);
          const isDone = i < idx;
          const isActive = i === idx;
          return (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: isDone || isActive ? 'var(--b-navy)' : 'var(--b-border)',
                marginBottom: 8, transition: 'background 0.3s',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isDone ? 'var(--b-success)' : isActive ? 'var(--b-navy)' : 'var(--b-border)',
                  color: isDone || isActive ? 'white' : 'var(--b-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--b-navy)' : 'var(--b-text-muted)' }}>
                  {labels[s]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="b-grid-2">
        {/* Main form */}
        <div className="b-card">
          <div className="b-card-body">

            {step === 'form' && (
              <>
                <div className="b-form-group">
                  <label className="b-form-label">付款账户</label>
                  <select className="b-form-input" value={fromAccount} onChange={e => setFromAccount(e.target.value)}>
                    <option value="a1">一卡通主账户 (CNY) - 余额 ¥128,420.50</option>
                    <option value="a2">美元活期账户 (USD) - 余额 $18,420.00</option>
                    <option value="a4">欧元结算账户 (EUR) - 余额 €8,920.00</option>
                  </select>
                </div>

                <div className="b-form-group">
                  <label className="b-form-label">转账类型</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {([
                      { v: 'internal',     label: '本行转账', sub: '实时 · 0 费率' },
                      { v: 'domestic',     label: '境内跨行', sub: '实时 · ¥2/笔' },
                      { v: 'cross-border', label: '跨境汇款', sub: '6h · ¥50/笔' },
                    ] as const).map(t => (
                      <button key={t.v} type="button" onClick={() => setTransferType(t.v)}
                        style={{
                          padding: 14, borderRadius: 6, cursor: 'pointer',
                          border: transferType === t.v ? '2px solid var(--b-navy)' : '1px solid var(--b-border)',
                          background: transferType === t.v ? 'rgba(0,41,102,0.04)' : 'white',
                          color: 'var(--b-text)', textAlign: 'left',
                        }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--b-navy)' }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--b-text-muted)', marginTop: 2 }}>{t.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="b-form-group">
                  <label className="b-form-label">收款人</label>
                  <select className="b-form-input" value={payee.id} onChange={e => setPayee(PAYEES.find(p => p.id === e.target.value)!)}>
                    {PAYEES.map(p => <option key={p.id} value={p.id}>{p.name} - {p.bank} ({p.account})</option>)}
                  </select>
                </div>

                <div className="b-form-group">
                  <label className="b-form-label">转账金额</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--b-text-muted)', fontWeight: 700 }}>¥</span>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                      className="b-form-input" style={{ paddingLeft: 30, fontSize: 18, fontWeight: 700 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {[1000, 5000, 10000, 50000].map(v => (
                      <button key={v} type="button" onClick={() => setAmount(String(v))}
                        style={{ padding: '4px 10px', border: '1px solid var(--b-border)', background: 'white', borderRadius: 12, fontSize: 11, cursor: 'pointer', color: 'var(--b-text-soft)' }}>
                        ¥{v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="b-form-group">
                  <label className="b-form-label">转账用途</label>
                  <select className="b-form-input" value={purpose} onChange={e => setPurpose(e.target.value)}>
                    <option>个人转账</option><option>商务付款</option><option>贸易货款</option>
                    <option>家庭赡养</option><option>留学学费</option><option>其他</option>
                  </select>
                </div>

                <div className="b-form-group">
                  <label className="b-form-label">附言（可选）</label>
                  <input className="b-form-input" placeholder="给收款人的留言..." value={memo} onChange={e => setMemo(e.target.value)} />
                </div>

                <button className="b-btn b-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }} onClick={next}>
                  下一步：确认信息 →
                </button>
              </>
            )}

            {step === 'review' && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--b-navy)', marginBottom: 18 }}>请确认转账信息</h3>
                {[
                  ['付款账户', '一卡通主账户'],
                  ['收款人',   payee.name],
                  ['收款行',   payee.bank],
                  ['收款账号', payee.account],
                  ['转账金额', `¥ ${parseFloat(amount || '0').toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`],
                  ['手续费',   `¥ ${fee}`],
                  ['合计扣款', `¥ ${parseFloat(totalCost).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`, true],
                  ['转账方式', { internal: '本行转账（实时到账）', domestic: '境内跨行（实时到账）', 'cross-border': '跨境汇款（6小时内到账）' }[transferType]],
                  ['转账用途', purpose],
                  ['附言',     memo || '无'],
                ].map(([k, v, highlight]: any) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--b-border)', fontSize: 14 }}>
                    <span style={{ color: 'var(--b-text-muted)' }}>{k}</span>
                    <span style={{ fontWeight: highlight ? 800 : 600, color: highlight ? 'var(--b-red)' : 'var(--b-text)', fontSize: highlight ? 16 : 14 }}>{v}</span>
                  </div>
                ))}

                <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', padding: 12, borderRadius: 6, fontSize: 12, color: 'var(--b-warn)', margin: '20px 0' }}>
                  ⚠ 请仔细核对收款人信息。转账成功后无法撤销。
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="b-btn b-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={back}>返回修改</button>
                  <button className="b-btn b-btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={next}>确认无误，继续 →</button>
                </div>
              </>
            )}

            {step === 'otp' && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--b-navy)', marginBottom: 8 }}>请输入安全验证码</h3>
                <p style={{ fontSize: 13, color: 'var(--b-text-soft)', marginBottom: 24 }}>
                  我们已向您注册手机 138****4821 发送 6 位短信验证码
                </p>

                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  style={{
                    width: '100%', padding: '20px', border: '2px solid var(--b-navy)', borderRadius: 8,
                    fontSize: 28, fontFamily: 'monospace', letterSpacing: '0.5em', textAlign: 'center',
                    fontWeight: 700, color: 'var(--b-navy)',
                  }} />

                <div style={{ textAlign: 'center', margin: '16px 0', fontSize: 13, color: 'var(--b-text-soft)' }}>
                  没收到验证码？<a href="#" style={{ color: 'var(--b-navy)', fontWeight: 600 }}>重新发送（59s）</a>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="b-btn b-btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={back}>返回</button>
                  <button className="b-btn b-btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={next} disabled={otp.length !== 6}>
                    确认转账 ✓
                  </button>
                </div>
              </>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--b-success)', color: 'white', fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--b-navy)', marginBottom: 8 }}>转账成功</h3>
                <p style={{ fontSize: 14, color: 'var(--b-text-soft)', marginBottom: 24 }}>
                  ¥ {parseFloat(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })} 已成功转账至 {payee.name}
                </p>
                <div style={{ background: 'var(--b-bg)', padding: 16, borderRadius: 6, marginBottom: 20, fontSize: 13, color: 'var(--b-text-soft)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span>交易流水号</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--b-navy)' }}>TXN{Date.now()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>完成时间</span>
                    <span>{new Date().toLocaleString('zh-CN')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="b-btn b-btn-ghost" onClick={() => window.print()}>下载回单</button>
                  <button className="b-btn b-btn-primary" onClick={reset}>继续转账</button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Side panel */}
        <div>
          <div className="b-card" style={{ marginBottom: 16 }}>
            <div className="b-card-header"><span className="b-card-title">常用收款人</span></div>
            <div className="b-card-body" style={{ padding: 0 }}>
              {PAYEES.map(p => (
                <div key={p.id} onClick={() => setPayee(p)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px',
                  borderBottom: '1px solid var(--b-border)', cursor: 'pointer',
                  background: payee.id === p.id ? 'rgba(0,41,102,0.04)' : 'transparent',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--b-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--b-navy)' }}>
                    {p.name.slice(0, 1)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--b-text-muted)' }}>{p.bank} · {p.currency}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--b-text-muted)' }}>{p.last}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="b-card">
            <div className="b-card-body">
              <h4 style={{ fontSize: 13, color: 'var(--b-navy)', marginBottom: 12, fontWeight: 700 }}>🛡 转账安全提示</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 12, color: 'var(--b-text-soft)', lineHeight: 1.7 }}>
                <li>• 仔细核对收款人姓名与账号</li>
                <li>• 警惕"客服人员"主动来电索要验证码</li>
                <li>• 单笔超过 5 万元请考虑使用 U-Key 认证</li>
                <li>• 异常情况请拨打 95588 立即冻结账户</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BankingLayout>
  );
}
