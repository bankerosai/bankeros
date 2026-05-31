import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function Login() {
  const [email, setEmail] = useState('admin@bankeros.io');
  const [password, setPassword] = useState('Admin@BankerOS2024!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In production: call /api/v1/iam/auth/tokens
    // Demo: accept hardcoded credentials
    await new Promise((r) => setTimeout(r, 800));

    if (email === 'admin@bankeros.io' && password === 'Admin@BankerOS2024!') {
      login('demo_jwt_token', { id: 'usr-001', email, role: 'SUPER_ADMIN', mfaEnabled: false });
      navigate('/');
    } else {
      setError('邮箱或密码错误');
    }
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-mark" style={{ width: 42, height: 42, fontSize: 22 }}>B</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>BankerOS</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Open Source Digital Banking Platform</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">电子邮箱</label>
            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bankeros.io" required />
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" required />
          </div>

          <button className="btn btn-primary login-btn" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" style={{ borderTopColor: '#fff' }} /> 验证中…</> : '登录'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: 14, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>演示账户</div>
          <div>邮箱：admin@bankeros.io</div>
          <div>密码：Admin@BankerOS2024!</div>
        </div>
      </div>
    </div>
  );
}
