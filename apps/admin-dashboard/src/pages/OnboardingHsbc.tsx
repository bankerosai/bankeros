/**
 * Banker-facing Enhanced Onboarding Wizard.
 * HSBC / 招行 standard: 7 steps covering personal info, KYC, FATCA/CRS,
 * PEP self-declaration, source of funds, risk assessment, and final review.
 */

import { useState } from 'react';

type Step = 'personal' | 'address' | 'kyc' | 'economic' | 'tax' | 'risk' | 'review';

const STEPS: { id: Step; label: string; icon: string; desc: string }[] = [
  { id: 'personal', icon: '①', label: '个人信息',     desc: '基本身份信息' },
  { id: 'address',  icon: '②', label: '联系地址',     desc: '居住地址与联系方式' },
  { id: 'kyc',      icon: '③', label: 'KYC 证件',     desc: '身份证件与活体检测' },
  { id: 'economic', icon: '④', label: '经济状况',     desc: '职业、收入、资产来源' },
  { id: 'tax',      icon: '⑤', label: '税务与 PEP',  desc: 'FATCA / CRS / 政治公众人物声明' },
  { id: 'risk',     icon: '⑥', label: '风险评估',     desc: '投资经验与风险偏好问卷' },
  { id: 'review',   icon: '⑦', label: '提交审核',     desc: '确认信息并发送至合规审批' },
];

const COUNTRIES = ['CN', 'HK', 'TW', 'SG', 'MY', 'JP', 'KR', 'GB', 'US', 'CA', 'AU', 'DE', 'FR', 'AE', 'IN'];
const OCCUPATIONS = ['科技/IT', '金融/银行', '医疗/健康', '教育/科研', '制造业', '零售/贸易', '法律/咨询', '建筑/房地产', '政府/公务员', '军队', '学生', '退休', '其他'];

export default function OnboardingHsbc() {
  const [step, setStep] = useState<Step>('personal');
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // Step 1 — personal
    type: 'INDIVIDUAL' as 'INDIVIDUAL' | 'CORPORATE',
    title: 'Mr',
    fullName: '',
    chineseName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: 'CN',
    gender: 'M',
    maritalStatus: 'SINGLE',

    // Step 2 — address
    addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', country: 'CN',
    yearsAtAddress: '5+',
    sameAsMailingAddress: true,

    // Step 3 — KYC
    docType: 'PASSPORT' as 'PASSPORT' | 'NATIONAL_ID' | 'DRIVING_LICENSE',
    docNumber: '',
    docCountry: 'CN',
    docExpiry: '',
    livenessScore: 0.0,
    documentsUploaded: 0,

    // Step 4 — economic
    occupation: '',
    employer: '',
    employerCountry: 'CN',
    yearsAtJob: '3-5',
    annualIncome: '500K-1M',
    netWorth: '1M-5M',
    sourceOfFunds: [] as string[],
    sourceOfWealth: '',

    // Step 5 — tax + PEP
    fatcaUsPerson: false,
    fatcaW9Provided: false,
    crsResidencies: [{ country: 'CN', tin: '' }],
    pepSelfDeclaration: 'NONE' as 'NONE' | 'SELF' | 'FAMILY' | 'ASSOCIATE',
    pepDetails: '',

    // Step 6 — risk
    investmentExperience: 'NONE' as 'NONE' | 'LIMITED' | 'AVERAGE' | 'EXTENSIVE',
    riskTolerance: 'MODERATE' as 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE',
    investmentHorizon: '5-10Y',
    primaryGoal: 'WEALTH_PRESERVATION',
    productSuitability: [] as string[],

    // Misc
    initialCurrency: 'USD',
    initialProducts: ['SAVINGS'] as string[],
    referralSource: 'WEBSITE',
    relationshipManagerId: '',
  });

  const stepIdx = STEPS.findIndex(s => s.id === step);
  const progressPct = ((stepIdx + 1) / STEPS.length) * 100;

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function next() {
    const order = STEPS.map(s => s.id);
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  }
  function prev() {
    const order = STEPS.map(s => s.id);
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  // Compute risk score
  const computedRisk =
    form.pepSelfDeclaration !== 'NONE' ? 'HIGH' :
    ['IR', 'KP', 'SY', 'CU'].includes(form.country) ? 'HIGH' :
    ['AE', 'RU', 'NG'].includes(form.country) || form.fatcaUsPerson ? 'MEDIUM' :
    'LOW';

  const requiresEdd = computedRisk === 'HIGH';
  const requiresFatcaW9 = form.fatcaUsPerson;

  if (submitted) {
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--accent-green)', color: 'white', fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            ✓
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-green)', marginBottom: 8 }}>开户申请已提交合规审批</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            客户编号: <code style={{ color: 'var(--accent-cyan)' }}>CIF{Date.now().toString().slice(-10)}</code>
            <br />
            系统已自动启动制裁筛查、PEP 检查与适合性评估。
            {requiresEdd && (
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: 'var(--accent-red)' }}>
                ⚠ 该客户已自动标记为高风险，需启动 EDD 增强尽职调查流程
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => { setSubmitted(false); setStep('personal'); }}>继续新开户申请</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue"><div className="kpi-label">今日开户</div><div className="kpi-value">84</div></div>
        <div className="kpi-card green"><div className="kpi-label">自动通过</div><div className="kpi-value">71</div><div className="kpi-delta up">84.5%</div></div>
        <div className="kpi-card amber"><div className="kpi-label">待审核</div><div className="kpi-value">9</div></div>
        <div className="kpi-card red"><div className="kpi-label">高风险 / EDD</div><div className="kpi-value">4</div></div>
      </div>

      <div className="grid-2">
        {/* Wizard */}
        <div className="card">
          {/* Step indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>HSBC 标准开户流程</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>步骤 {stepIdx + 1} / {STEPS.length}</span>
          </div>
          <div className="progress-bar" style={{ height: 6, marginBottom: 16 }}>
            <div className="progress-fill" style={{ width: `${progressPct}%`, background: 'var(--accent-blue)' }} />
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: i === stepIdx ? 'var(--accent-blue)' : i < stepIdx ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: i === stepIdx ? 700 : 400 }}>
                {i < stepIdx ? '✓' : s.icon} {s.label}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {STEPS[stepIdx].label}
            </h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{STEPS[stepIdx].desc}</div>
          </div>

          {/* ── STEP 1: Personal ───────────────────────────────────── */}
          {step === 'personal' && (
            <div>
              <div className="form-group">
                <label className="form-label">客户类型</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['INDIVIDUAL', 'CORPORATE'] as const).map(t => (
                    <button key={t} onClick={() => update('type', t)} className="btn"
                      style={{ flex: 1, justifyContent: 'center', background: form.type === t ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)', color: form.type === t ? 'var(--accent-blue)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {t === 'INDIVIDUAL' ? '👤 个人客户' : '🏢 企业客户'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">称谓</label>
                  <select className="form-input" value={form.title} onChange={e => update('title', e.target.value as any)}>
                    <option>Mr</option><option>Ms</option><option>Mrs</option><option>Dr</option><option>Prof</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">姓名 (拼音/英文)</label>
                  <input className="form-input" value={form.fullName} onChange={e => update('fullName', e.target.value as any)} placeholder="Zhao Lei" />
                </div>
                <div className="form-group">
                  <label className="form-label">中文姓名</label>
                  <input className="form-input" value={form.chineseName} onChange={e => update('chineseName', e.target.value as any)} placeholder="赵磊" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">电子邮箱</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => update('email', e.target.value as any)} placeholder="name@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">手机号码</label>
                  <input className="form-input" value={form.phone} onChange={e => update('phone', e.target.value as any)} placeholder="+86 138 0000 0000" />
                </div>
              </div>

              {form.type === 'INDIVIDUAL' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">出生日期</label>
                    <input className="form-input" type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value as any)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">性别</label>
                    <select className="form-input" value={form.gender} onChange={e => update('gender', e.target.value as any)}>
                      <option value="M">男</option><option value="F">女</option><option value="O">其他</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">婚姻状况</label>
                    <select className="form-input" value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value as any)}>
                      <option value="SINGLE">未婚</option><option value="MARRIED">已婚</option>
                      <option value="DIVORCED">离异</option><option value="WIDOWED">丧偶</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">国籍</label>
                    <select className="form-input" value={form.nationality} onChange={e => update('nationality', e.target.value as any)}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Address ─────────────────────────────────────── */}
          {step === 'address' && (
            <div>
              <div className="form-group">
                <label className="form-label">国家 / 地区</label>
                <select className="form-input" value={form.country} onChange={e => update('country', e.target.value as any)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">详细地址（街道 / 楼号）</label>
                <input className="form-input" value={form.addressLine1} onChange={e => update('addressLine1', e.target.value as any)} placeholder="上海市浦东新区世纪大道 1500 号" />
              </div>
              <div className="form-group">
                <label className="form-label">地址行 2（可选）</label>
                <input className="form-input" value={form.addressLine2} onChange={e => update('addressLine2', e.target.value as any)} placeholder="环球金融中心 28 楼" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">城市</label>
                  <input className="form-input" value={form.city} onChange={e => update('city', e.target.value as any)} placeholder="上海" />
                </div>
                <div className="form-group">
                  <label className="form-label">省/州</label>
                  <input className="form-input" value={form.state} onChange={e => update('state', e.target.value as any)} placeholder="上海" />
                </div>
                <div className="form-group">
                  <label className="form-label">邮编</label>
                  <input className="form-input" value={form.postalCode} onChange={e => update('postalCode', e.target.value as any)} placeholder="200120" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">居住时长</label>
                <select className="form-input" value={form.yearsAtAddress} onChange={e => update('yearsAtAddress', e.target.value as any)}>
                  <option>少于 1 年</option><option>1-3 年</option><option>3-5 年</option><option>5+</option>
                </select>
              </div>

              {['IR', 'KP', 'SY', 'CU'].includes(form.country) && (
                <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 12, color: 'var(--accent-red)' }}>
                  ⚠ <strong>高风险司法管辖区</strong>：该客户将自动触发增强尽职调查（EDD）和强制制裁名单实时筛查
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: KYC ────────────────────────────────────────── */}
          {step === 'kyc' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">证件类型</label>
                  <select className="form-input" value={form.docType} onChange={e => update('docType', e.target.value as any)}>
                    <option value="PASSPORT">护照</option>
                    <option value="NATIONAL_ID">身份证</option>
                    <option value="DRIVING_LICENSE">驾驶证</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">签发国家</label>
                  <select className="form-input" value={form.docCountry} onChange={e => update('docCountry', e.target.value as any)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">证件号码</label>
                  <input className="form-input" value={form.docNumber} onChange={e => update('docNumber', e.target.value as any)} placeholder="G12345678" />
                </div>
                <div className="form-group">
                  <label className="form-label">证件有效期至</label>
                  <input className="form-input" type="date" value={form.docExpiry} onChange={e => update('docExpiry', e.target.value as any)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                {['证件正面', '证件背面', '人脸活体'].map(label => (
                  <div key={label} style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: 18, textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>📷</div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>点击上传</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 6, padding: 12, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 4 }}>🤖 AI 活体检测 + OCR 识别</div>
                <div style={{ color: 'var(--text-secondary)' }}>系统将自动比对证件照片与活体视频。失败率低于 0.3%。所有生物特征数据使用 AES-256 加密存储。</div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Economic Profile ───────────────────────────── */}
          {step === 'economic' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">职业</label>
                  <select className="form-input" value={form.occupation} onChange={e => update('occupation', e.target.value as any)}>
                    <option value="">选择...</option>
                    {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">雇主名称</label>
                  <input className="form-input" value={form.employer} onChange={e => update('employer', e.target.value as any)} placeholder="ACME Technology" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">雇主所在国家</label>
                  <select className="form-input" value={form.employerCountry} onChange={e => update('employerCountry', e.target.value as any)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">在职年限</label>
                  <select className="form-input" value={form.yearsAtJob} onChange={e => update('yearsAtJob', e.target.value as any)}>
                    <option>少于 1 年</option><option>1-3</option><option>3-5</option><option>5-10</option><option>10+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">年收入区间 (CNY)</label>
                  <select className="form-input" value={form.annualIncome} onChange={e => update('annualIncome', e.target.value as any)}>
                    <option>少于 100K</option><option>100K-500K</option><option>500K-1M</option>
                    <option>1M-5M</option><option>5M-10M</option><option>10M+</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">净资产区间 (CNY)</label>
                <select className="form-input" value={form.netWorth} onChange={e => update('netWorth', e.target.value as any)}>
                  <option>少于 500K</option><option>500K-1M</option><option>1M-5M</option>
                  <option>5M-10M</option><option>10M-50M</option><option>50M+</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">资金来源（可多选）</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['工资收入', '经营所得', '投资收益', '继承遗产', '不动产销售', '股票/期权'].map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 8, border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: form.sourceOfFunds.includes(s) ? 'rgba(59,130,246,0.08)' : 'var(--bg-secondary)' }}>
                      <input type="checkbox" checked={form.sourceOfFunds.includes(s)} onChange={() => {
                        const next = form.sourceOfFunds.includes(s) ? form.sourceOfFunds.filter(x => x !== s) : [...form.sourceOfFunds, s];
                        update('sourceOfFunds', next as any);
                      }} />
                      {s}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">财富累积说明 (Source of Wealth)</label>
                <textarea className="form-input" rows={3} value={form.sourceOfWealth} onChange={e => update('sourceOfWealth', e.target.value as any)}
                  placeholder="请详细说明客户主要财富的累积来源，如：在 XX 公司任高级管理职位 10 年，累积工资与股票期权约 500 万元..." />
              </div>
            </div>
          )}

          {/* ── STEP 5: Tax (FATCA/CRS) + PEP ──────────────────────── */}
          {step === 'tax' && (
            <div>
              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>🇺🇸 FATCA 美国税务身份声明</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.fatcaUsPerson} onChange={e => update('fatcaUsPerson', e.target.checked as any)} />
                  <span>本客户为美国税务居民 (US Person under FATCA)</span>
                </label>
                {form.fatcaUsPerson && (
                  <div style={{ marginTop: 12, padding: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, fontSize: 12 }}>
                    ⚠ 该客户须提供 W-9 表格，并将根据 FATCA 协议向 IRS 报送账户信息。
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>🌐 CRS 共同申报准则 - 税务居民身份</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>请声明客户所有税务居民身份（OECD CRS 要求）</div>
                {form.crsResidencies.map((r, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8, marginBottom: 6 }}>
                    <select className="form-input" value={r.country} onChange={e => {
                      const next = [...form.crsResidencies]; next[i].country = e.target.value;
                      update('crsResidencies', next as any);
                    }}>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input className="form-input" placeholder="税务识别号 (TIN)" value={r.tin} onChange={e => {
                      const next = [...form.crsResidencies]; next[i].tin = e.target.value;
                      update('crsResidencies', next as any);
                    }} />
                    {i > 0 && (
                      <button onClick={() => update('crsResidencies', form.crsResidencies.filter((_, j) => j !== i) as any)}
                        style={{ background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '6px 10px', borderRadius: 4, cursor: 'pointer' }}>×</button>
                    )}
                  </div>
                ))}
                <button onClick={() => update('crsResidencies', [...form.crsResidencies, { country: '', tin: '' }] as any)}
                  className="btn btn-ghost" style={{ fontSize: 12, marginTop: 8 }}>+ 增加税务居住地</button>
              </div>

              <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>⚑ 政治公众人物 (PEP) 自我声明</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>客户或其家属/同事是否担任或曾担任重要政治职务？</div>
                {[
                  { v: 'NONE',    label: '否，本人/家属/同事均非政治公众人物' },
                  { v: 'SELF',    label: '是，本人为政治公众人物 (Domestic / Foreign PEP)' },
                  { v: 'FAMILY',  label: '是，家庭成员（配偶/父母/子女/兄弟姐妹）为 PEP' },
                  { v: 'ASSOCIATE', label: '是，密切的工作/商业伙伴为 PEP' },
                ].map(opt => (
                  <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderRadius: 4, background: form.pepSelfDeclaration === opt.v ? 'rgba(59,130,246,0.08)' : 'transparent', marginBottom: 4 }}>
                    <input type="radio" name="pep" checked={form.pepSelfDeclaration === opt.v} onChange={() => update('pepSelfDeclaration', opt.v as any)} />
                    {opt.label}
                  </label>
                ))}
                {form.pepSelfDeclaration !== 'NONE' && (
                  <div style={{ marginTop: 10 }}>
                    <textarea className="form-input" rows={2} placeholder="请填写 PEP 详情：姓名、职务、所在国家、任期..."
                      value={form.pepDetails} onChange={e => update('pepDetails', e.target.value as any)} />
                    <div style={{ marginTop: 8, padding: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, fontSize: 12, color: 'var(--accent-red)' }}>
                      ⚠ 该客户将自动启动 EDD 增强尽职调查，需要高级合规人员审批
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 6: Risk Assessment ────────────────────────────── */}
          {step === 'risk' && (
            <div>
              <div className="form-group">
                <label className="form-label">投资经验</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {(['NONE', 'LIMITED', 'AVERAGE', 'EXTENSIVE'] as const).map(v => (
                    <button key={v} type="button" onClick={() => update('investmentExperience', v)}
                      style={{ padding: '10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        border: form.investmentExperience === v ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                        background: form.investmentExperience === v ? 'rgba(59,130,246,0.08)' : 'var(--bg-secondary)',
                        color: form.investmentExperience === v ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      }}>
                      {{ NONE: '无经验', LIMITED: '有限', AVERAGE: '中等', EXTENSIVE: '丰富' }[v]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">风险偏好</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] as const).map(v => (
                    <button key={v} type="button" onClick={() => update('riskTolerance', v)}
                      style={{ padding: '12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        border: form.riskTolerance === v ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                        background: form.riskTolerance === v ? 'rgba(59,130,246,0.08)' : 'var(--bg-secondary)',
                        color: form.riskTolerance === v ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        textAlign: 'left',
                      }}>
                      <div>{{ CONSERVATIVE: '🛡 保守型', MODERATE: '⚖ 稳健型', AGGRESSIVE: '🚀 进取型' }[v]}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                        {{ CONSERVATIVE: '不能接受本金损失', MODERATE: '可承受 10-20% 波动', AGGRESSIVE: '追求高回报，可承受 30%+ 回撤' }[v]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">投资期限</label>
                <select className="form-input" value={form.investmentHorizon} onChange={e => update('investmentHorizon', e.target.value as any)}>
                  <option value="UNDER_1Y">少于 1 年（短期）</option>
                  <option value="1-3Y">1-3 年</option>
                  <option value="3-5Y">3-5 年</option>
                  <option value="5-10Y">5-10 年</option>
                  <option value="OVER_10Y">10 年以上（长期）</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">首要投资目标</label>
                <select className="form-input" value={form.primaryGoal} onChange={e => update('primaryGoal', e.target.value as any)}>
                  <option value="WEALTH_PRESERVATION">财富保值</option>
                  <option value="INCOME">稳定收益</option>
                  <option value="GROWTH">财富增值</option>
                  <option value="EDUCATION">子女教育</option>
                  <option value="RETIREMENT">退休规划</option>
                </select>
              </div>

              <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 6, padding: 12, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-purple)', marginBottom: 6 }}>📊 系统判定客户适合性</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  根据 MiFID II / KYP 标准，该客户可投资产品级别: <strong style={{ color: form.riskTolerance === 'AGGRESSIVE' ? 'var(--accent-red)' : form.riskTolerance === 'MODERATE' ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                  {{ CONSERVATIVE: 'PR1-PR2 (低-中低风险)', MODERATE: 'PR1-PR3 (低-中等风险)', AGGRESSIVE: 'PR1-PR5 (全部风险等级)' }[form.riskTolerance]}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: Review ─────────────────────────────────────── */}
          {step === 'review' && (
            <div>
              <div style={{ marginBottom: 16, padding: 14, background: 'var(--bg-secondary)', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>系统自动风险评级</span>
                  <span className={`badge badge-${computedRisk === 'LOW' ? 'green' : computedRisk === 'MEDIUM' ? 'amber' : 'red'}`}>{computedRisk}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  根据国籍 ({form.nationality})、居住国 ({form.country})、PEP 状态 ({form.pepSelfDeclaration})、FATCA ({form.fatcaUsPerson ? 'US' : '非美'}) 综合判定
                </div>
              </div>

              {requiresEdd && (
                <div style={{ marginBottom: 16, padding: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: 13, marginBottom: 6 }}>⚠ 需要 EDD 增强尽职调查</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    该客户提交后将进入合规审批队列。需要至少 2 名合规专员双重签字 (Maker-Checker)。预计审批时长 2-5 个工作日。
                  </div>
                </div>
              )}

              <div style={{ fontSize: 13 }}>
                {[
                  ['客户类型', form.type === 'INDIVIDUAL' ? '个人' : '企业'],
                  ['姓名', `${form.title} ${form.fullName} (${form.chineseName})`],
                  ['邮箱', form.email],
                  ['手机', form.phone],
                  ['国籍 / 居住国', `${form.nationality} / ${form.country}`],
                  ['职业 / 雇主', `${form.occupation} @ ${form.employer}`],
                  ['年收入区间', `${form.annualIncome} CNY`],
                  ['净资产区间', `${form.netWorth} CNY`],
                  ['资金来源', form.sourceOfFunds.join(', ')],
                  ['税务居民身份', form.crsResidencies.map(r => `${r.country}`).join(' + ')],
                  ['FATCA US Person', form.fatcaUsPerson ? '是 (需 W-9)' : '否'],
                  ['PEP 状态', form.pepSelfDeclaration],
                  ['投资经验 / 风险偏好', `${form.investmentExperience} / ${form.riskTolerance}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid rgba(45,49,72,0.4)' }}>
                    <span style={{ color: 'var(--text-muted)', width: 140, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" onClick={prev} disabled={stepIdx === 0}>← 上一步</button>
            {step !== 'review'
              ? <button className="btn btn-primary" onClick={next}>下一步 →</button>
              : <button className="btn btn-primary" onClick={() => setSubmitted(true)} style={{ background: requiresEdd ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                  {requiresEdd ? '⚠ 提交至 EDD 审批' : '✓ 提交开户申请'}
                </button>
            }
          </div>
        </div>

        {/* Side panel: risk preview + standards reference */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>实时风险预览</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: computedRisk === 'LOW' ? 'rgba(34,197,94,0.15)' : computedRisk === 'MEDIUM' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                color: computedRisk === 'LOW' ? 'var(--accent-green)' : computedRisk === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800,
                flexShrink: 0,
              }}>
                {computedRisk}
              </div>
              <div style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{
                  computedRisk === 'LOW' ? '低风险客户 — 标准 CDD' :
                  computedRisk === 'MEDIUM' ? '中等风险 — 加强监控' :
                  '高风险 — 必须 EDD'
                }</div>
                <div>客户将在 {requiresEdd ? '5 个工作日' : computedRisk === 'MEDIUM' ? '1 个工作日' : '8 分钟'} 内完成审批</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              该评级符合 巴塞尔协议、FATF Recommendation 10 和 中国《反洗钱法》客户身份识别要求。
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>合规标准参考</div>
            {[
              { std: 'FATF',     desc: '反洗钱金融行动特别工作组建议' },
              { std: 'CRS',     desc: 'OECD 共同申报准则（税务信息交换）' },
              { std: 'FATCA',   desc: '美国海外账户税收合规法案' },
              { std: 'MiFID II', desc: '欧盟金融工具市场指令第二版' },
              { std: 'GDPR / PDPA', desc: '欧盟通用数据保护条例 / 新加坡个人数据保护法' },
              { std: 'BSA',     desc: '美国银行保密法' },
            ].map(s => (
              <div key={s.std} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <span className="badge badge-blue" style={{ fontSize: 10, height: 'fit-content' }}>{s.std}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
