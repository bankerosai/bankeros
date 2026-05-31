import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import '../styles-portal.css';

type LoginType = 'personal' | 'business' | 'staff';

const TYPE_CONFIG = {
  personal: { title: '个人网上银行', sub: '管理您的存款、信用卡、理财与贷款', emailHint: 'name@example.com', destPath: '/personal', accent: 'var(--p-red)' },
  business: { title: '企业网上银行', sub: '现金管理、跨境支付、贸易融资',         emailHint: 'company@example.com', destPath: '/business', accent: 'var(--p-navy)' },
  staff:    { title: '银行员工系统', sub: 'BankerOS 内部运营管理后台',           emailHint: 'admin@bankeros.io', destPath: '/admin', accent: '#3b82f6' },
};

export default function PortalLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialType = (params.get('type') as LoginType) || 'personal';
  const [type, setType] = useState<LoginType>(initialType);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const login = useAuthStore((s) => s.login);
  const cfg = TYPE_CONFIG[type];

  // Pre-fill demo credentials per type
  useEffect(() => {
    if (type === 'staff')         { setEmail('admin@bankeros.io');        setPassword('Admin@BankerOS2024!'); }
    else if (type === 'personal') { setEmail('zhao.lei@example.com');     setPassword('Demo@Personal2024!'); }
    else                          { setEmail('finance@acme-corp.com');   setPassword('Demo@Business2024!'); }
    setErr('');
  }, [type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    await new Promise(r => setTimeout(r, 500));

    // Demo accept all of the pre-filled credentials
    if (email && password.length >= 8) {
      const role = type === 'staff' ? 'SUPER_ADMIN' : type === 'business' ? 'CORPORATE_CUSTOMER' : 'RETAIL_CUSTOMER';
      login('demo_jwt_' + type, { id: `usr_${type}`, email, role, mfaEnabled: false } as any);
      navigate(cfg.destPath);
    } else {
      setErr('邮箱或密码不正确');
      setLoading(false);
    }
  }

  return (
    <div className="portal-root" style={{ background: 'var(--p-bg-section)', minHeight: '100vh' }}>
      <header className="p-topbar">
        <Link to="/" className="p-logo">
          <div className="p-logo-mark">B</div>
          <div>
            <div className="p-logo-text">BankerOS</div>
            <span className="p-logo-sub">DIGITAL BANKING</span>
          </div>
        </Link>
        <div style={{ flex: 1 }} />
        <Link to="/" className="p-btn p-btn-ghost">返回首页</Link>
      </header>

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', minHeight: 'calc(100vh - 72px)' }}>
        <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left side: brand storytelling */}
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(219,0,17,0.08)', color: 'var(--p-red)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
              🔒 银行级安全保障 · TLS 1.3 端到端加密
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: 'var(--p-navy)', lineHeight: 1.15, marginBottom: 18, letterSpacing: '-0.02em' }}>
              欢迎回到<br />BankerOS 网上银行
            </h1>
            <p style={{ fontSize: 16, color: 'var(--p-text-soft)', lineHeight: 1.7, marginBottom: 32 }}>
              请使用您的注册邮箱与密码登录。 我们采用多因素身份验证保护您的账户安全。
            </p>

            <div style={{ background: 'white', borderRadius: 8, padding: 24, border: '1px solid var(--p-border)', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 12, fontSize: 14 }}>⚠️ 安全提示</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'BankerOS 工作人员不会以任何形式向您索取密码或短信验证码',
                  '请勿在公共电脑/网络环境下登录网银',
                  '如遇可疑情况，请立即拨打 24/7 客服电话 95588',
                ].map(t => (
                  <li key={t} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--p-text-soft)' }}>
                    <span style={{ color: 'var(--p-red)', fontWeight: 700, flexShrink: 0 }}>•</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--p-text-muted)' }}>
              <span>🛡 ISO 27001</span>
              <span>🛡 PCI DSS</span>
              <span>🛡 FIDO2</span>
              <span>🛡 SOC 2</span>
            </div>
          </div>

          {/* Right side: login card */}
          <div style={{ background: 'white', borderRadius: 12, padding: 40, boxShadow: '0 8px 32px rgba(0,41,102,0.08)', border: '1px solid var(--p-border)' }}>
            {/* Type selector */}
            <div style={{ display: 'flex', borderRadius: 6, background: 'var(--p-bg-section)', padding: 4, marginBottom: 28 }}>
              {(['personal', 'business', 'staff'] as LoginType[]).map(t => (
                <button key={t} onClick={() => setType(t)}
                  style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: 4, cursor: 'pointer',
                    background: type === t ? 'white' : 'transparent',
                    color: type === t ? 'var(--p-navy)' : 'var(--p-text-soft)',
                    fontWeight: type === t ? 700 : 500, fontSize: 13,
                    boxShadow: type === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}>
                  {t === 'personal' ? '个人' : t === 'business' ? '企业' : '员工'}
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 4 }}>{cfg.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--p-text-soft)', marginBottom: 28 }}>{cfg.sub}</p>

            <form onSubmit={handleSubmit}>
              {err && (
                <div style={{ background: 'rgba(219,0,17,0.08)', border: '1px solid rgba(219,0,17,0.2)', color: 'var(--p-red)', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 18 }}>
                  ⚠ {err}
                </div>
              )}

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--p-text-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>电子邮箱</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={cfg.emailHint}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--p-border)', borderRadius: 6, fontSize: 14, fontFamily: 'inherit' }} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--p-text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>登录密码</label>
                  <a href="#" style={{ fontSize: 12, color: cfg.accent, textDecoration: 'none', fontWeight: 600 }}>忘记密码？</a>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••••"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--p-border)', borderRadius: 6, fontSize: 14, fontFamily: 'inherit' }} />
              </div>

              {showOtp && (
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--p-text-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTP 验证码</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} placeholder="6 位数字"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--p-border)', borderRadius: 6, fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.3em', textAlign: 'center' }} />
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--p-text-soft)', marginBottom: 20, cursor: 'pointer' }}>
                <input type="checkbox" onChange={e => setShowOtp(e.target.checked)} />
                启用 TOTP 双因素验证（推荐）
              </label>

              <button type="submit" disabled={loading}
                className="p-btn p-btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, background: cfg.accent }}>
                {loading ? '正在验证…' : `登录${cfg.title}`}
              </button>

              <div style={{ marginTop: 20, padding: 14, background: 'var(--p-bg-section)', borderRadius: 6, fontSize: 12, color: 'var(--p-text-muted)' }}>
                <div style={{ fontWeight: 700, color: 'var(--p-text-soft)', marginBottom: 4 }}>演示账户（已自动填充）</div>
                <div>📧 {email}</div>
                <div>🔑 {password}</div>
              </div>

              {type !== 'staff' && (
                <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--p-border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--p-text-soft)' }}>还没有 BankerOS 账户？</span>
                  <Link to="/login?action=open" style={{ marginLeft: 8, color: cfg.accent, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                    立即开户 →
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
