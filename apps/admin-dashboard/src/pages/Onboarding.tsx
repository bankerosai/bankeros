import { useState } from 'react';

type Step = 'personal' | 'address' | 'kyc' | 'review';

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'personal', label: '个人信息', icon: '①' },
  { id: 'address',  label: '联系地址', icon: '②' },
  { id: 'kyc',     label: 'KYC 证件', icon: '③' },
  { id: 'review',  label: '提交审核', icon: '④' },
];

const COUNTRIES = ['CN', 'HK', 'SG', 'GB', 'US', 'AE', 'JP', 'AU', 'DE', 'FR'];
const RECENT_APPLICATIONS = [
  { cifNumber: 'CIF20240884', name: 'Wang Fang', email: 'wfang@sina.cn', country: 'CN', kycStatus: 'APPROVED', riskLevel: 'LOW', appliedAt: '10:42' },
  { cifNumber: 'CIF20240883', name: 'Raj Patel', email: 'raj@tata.in', country: 'IN', kycStatus: 'PENDING_REVIEW', riskLevel: 'MEDIUM', appliedAt: '10:31' },
  { cifNumber: 'CIF20240882', name: 'Aiko Tanaka', email: 'a.tanaka@sony.jp', country: 'JP', kycStatus: 'IN_PROGRESS', riskLevel: 'LOW', appliedAt: '09:58' },
  { cifNumber: 'CIF20240881', name: 'Omar Hassan', email: 'omar@gulf.ae', country: 'AE', kycStatus: 'PENDING_REVIEW', riskLevel: 'HIGH', appliedAt: '09:14' },
  { cifNumber: 'CIF20240880', name: 'Lucia Bianchi', email: 'l.bianchi@intesa.it', country: 'IT', kycStatus: 'APPROVED', riskLevel: 'LOW', appliedAt: '08:47' },
];

const kycColor: Record<string, string> = { APPROVED: 'green', PENDING_REVIEW: 'amber', IN_PROGRESS: 'blue', REJECTED: 'red', NOT_STARTED: 'gray' };
const riskColor: Record<string, string> = { LOW: 'green', MEDIUM: 'amber', HIGH: 'red' };

export default function Onboarding() {
  const [step, setStep] = useState<Step>('personal');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: 'INDIVIDUAL', fullName: '', email: '', phone: '',
    dateOfBirth: '', nationality: 'CN',
    addressLine1: '', city: '', postalCode: '', country: 'CN',
    docType: 'PASSPORT', docNumber: '', initialCurrency: 'USD',
  });

  const stepIdx = STEPS.findIndex(s => s.id === step);
  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function nextStep() {
    const order: Step[] = ['personal', 'address', 'kyc', 'review'];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  }
  function prevStep() {
    const order: Step[] = ['personal', 'address', 'kyc', 'review'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  if (submitted) {
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--accent-green)' }}>开户申请已提交</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            系统已自动启动 KYC 制裁筛查。预计 5-10 分钟完成自动审核。
            高风险客户将触发强化尽职调查（EDD）流程。
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => { setSubmitted(false); setStep('personal'); setForm({ type: 'INDIVIDUAL', fullName: '', email: '', phone: '', dateOfBirth: '', nationality: 'CN', addressLine1: '', city: '', postalCode: '', country: 'CN', docType: 'PASSPORT', docNumber: '', initialCurrency: 'USD' }); }}>
              继续开户
            </button>
            <button className="btn btn-ghost" onClick={() => window.location.href = '/customers'}>查看客户列表</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">今日开户申请</div><div className="kpi-value">84</div></div>
        <div className="kpi-card green"><div className="kpi-label">自动审批通过</div><div className="kpi-value">71</div><div className="kpi-delta up">84.5%</div></div>
        <div className="kpi-card amber"><div className="kpi-label">待人工审核</div><div className="kpi-value">9</div></div>
        <div className="kpi-card red"><div className="kpi-label">高风险 / EDD</div><div className="kpi-value">4</div></div>
      </div>

      <div className="grid-2">
        {/* Onboarding Form */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>数字开户流程</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>步骤 {stepIdx + 1} / {STEPS.length}</span>
            </div>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {STEPS.map((s, i) => (
                <div key={s.id} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: '100%', height: 3, borderRadius: 2, background: i <= stepIdx ? 'var(--accent-blue)' : 'var(--border)', marginBottom: 4, transition: 'background 0.3s' }} />
                  <div style={{ fontSize: 10, color: i === stepIdx ? 'var(--accent-blue)' : i < stepIdx ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: i === stepIdx ? 700 : 400 }}>
                    {i < stepIdx ? '✓' : s.icon} {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {step === 'personal' && (
            <div>
              <div className="form-group">
                <label className="form-label">客户类型</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['INDIVIDUAL', 'CORPORATE'].map(t => (
                    <button key={t} onClick={() => update('type', t)} className="btn" style={{ flex: 1, justifyContent: 'center', background: form.type === t ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)', color: form.type === t ? 'var(--accent-blue)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {t === 'INDIVIDUAL' ? '👤 个人客户' : '🏢 企业客户'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">姓名 / 企业全称</label>
                <input className="form-input" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="请输入真实姓名" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">电子邮箱</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="example@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">手机号码</label>
                  <input className="form-input" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+86 138 0000 0000" />
                </div>
              </div>
              {form.type === 'INDIVIDUAL' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">出生日期</label>
                    <input className="form-input" type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">国籍</label>
                    <select className="form-input" value={form.nationality} onChange={e => update('nationality', e.target.value)}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">初始账户币种</label>
                <select className="form-input" value={form.initialCurrency} onChange={e => update('initialCurrency', e.target.value)}>
                  {['USD', 'EUR', 'GBP', 'HKD', 'SGD', 'CNY', 'JPY'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 'address' && (
            <div>
              <div className="form-group">
                <label className="form-label">国家 / 地区</label>
                <select className="form-input" value={form.country} onChange={e => update('country', e.target.value)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">详细地址（街道 / 楼号）</label>
                <input className="form-input" value={form.addressLine1} onChange={e => update('addressLine1', e.target.value)} placeholder="123 Main Street, Apt 4B" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">城市</label>
                  <input className="form-input" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Shanghai" />
                </div>
                <div className="form-group">
                  <label className="form-label">邮政编码</label>
                  <input className="form-input" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} placeholder="200001" />
                </div>
              </div>
              {['IR', 'KP', 'SY', 'CU'].includes(form.country) && (
                <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--accent-red)' }}>
                  ⚠️ 高风险司法管辖区 — 该客户将自动触发增强尽职调查（EDD）流程，并进行强制制裁名单筛查。
                </div>
              )}
            </div>
          )}

          {step === 'kyc' && (
            <div>
              <div className="form-group">
                <label className="form-label">证件类型</label>
                <select className="form-input" value={form.docType} onChange={e => update('docType', e.target.value)}>
                  <option value="PASSPORT">护照</option>
                  <option value="NATIONAL_ID">身份证</option>
                  <option value="DRIVING_LICENSE">驾驶证</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">证件号码</label>
                <input className="form-input" value={form.docNumber} onChange={e => update('docNumber', e.target.value)} placeholder="G12345678" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {['证件正面', '证件背面'].map(label => (
                  <div key={label} style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>点击上传或拖拽</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: 12, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 6 }}>🤖 AI 活体检测</div>
                <div style={{ color: 'var(--text-secondary)' }}>系统将通过摄像头进行实时活体检测，确保申请人本人在场，防止身份冒用。生物特征数据加密存储，不会用于其他目的。</div>
              </div>
              <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 12 }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>✓ 制裁名单预筛查：</span>
                <span style={{ color: 'var(--text-secondary)' }}> OFAC · UN 1267 · EU 合并名单 · HMT — 将在提交时实时执行</span>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>请确认以下信息准确无误后提交开户申请：</div>
              {[
                ['客户类型', form.type === 'INDIVIDUAL' ? '个人客户' : '企业客户'],
                ['姓名', form.fullName || '(未填写)'],
                ['邮箱', form.email || '(未填写)'],
                ['国籍 / 注册地', form.nationality],
                ['居住国', form.country],
                ['城市', form.city || '(未填写)'],
                ['证件类型', form.docType],
                ['初始账户币种', form.initialCurrency],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(45,49,72,0.5)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                提交即代表客户同意《开户服务协议》及《隐私政策》。系统将依据 GDPR / PDPA 对个人信息进行合规处理。
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={prevStep} disabled={stepIdx === 0}>← 上一步</button>
            {step !== 'review'
              ? <button className="btn btn-primary" onClick={nextStep}>下一步 →</button>
              : <button className="btn btn-primary" onClick={() => setSubmitted(true)} style={{ background: 'var(--accent-green)' }}>✓ 提交开户申请</button>
            }
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>今日开户记录</div>
          {RECENT_APPLICATIONS.map((a) => (
            <div key={a.cifNumber} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: 600 }}>{a.name}</div>
                <span className={`badge badge-${kycColor[a.kycStatus] ?? 'gray'}`} style={{ fontSize: 10 }}>{a.kycStatus}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{a.email}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{ fontSize: 10, color: 'var(--accent-cyan)' }}>{a.cifNumber}</code>
                <span className="badge badge-gray" style={{ fontSize: 10 }}>{a.country}</span>
                <span className={`badge badge-${riskColor[a.riskLevel]}`} style={{ fontSize: 10 }}>{a.riskLevel}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{a.appliedAt}</span>
              </div>
            </div>
          ))}

          {/* Sanctions screening results */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>实时制裁筛查状态</div>
            {[
              { name: 'Wang Fang', result: 'PASS', score: '0.01', list: 'OFAC · UN · EU · HMT' },
              { name: 'Omar Hassan', result: 'REVIEW', score: '0.64', list: 'HMT (部分姓名匹配)' },
            ].map((r) => (
              <div key={r.name} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg-secondary)', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                  <span className={`badge badge-${r.result === 'PASS' ? 'green' : 'amber'}`}>{r.result}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>筛查名单: {r.list}</div>
                <div style={{ fontSize: 11, color: r.result === 'PASS' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>匹配分: {r.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
