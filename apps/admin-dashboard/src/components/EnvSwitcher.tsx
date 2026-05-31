/**
 * Floating environment switcher — quickly jump between
 * Public Portal · Personal Banking · Business Banking · Admin
 * Only visible in development / demo mode.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ENVIRONMENTS = [
  { path: '/',          label: '公共门户',     icon: '🌐', desc: 'BankerOS 官网' },
  { path: '/personal',  label: '个人网银',     icon: '👤', desc: '零售客户' },
  { path: '/business',  label: '企业网银',     icon: '🏢', desc: '公司客户' },
  { path: '/admin',     label: '员工后台',     icon: '👨‍💼', desc: '银行运营' },
];

export default function EnvSwitcher() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Hide the launcher when already on /login (avoid clashing with the form)
  if (location.pathname.startsWith('/login')) return null;

  const current = ENVIRONMENTS.find(e =>
    e.path === '/' ? location.pathname === '/' || location.pathname.startsWith('/products') || location.pathname.startsWith('/about')
    : location.pathname.startsWith(e.path),
  );

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 999 }}>
      {open && (
        <div style={{
          position: 'absolute', bottom: 56, right: 0, width: 280,
          background: 'white', borderRadius: 10, padding: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#5a6470', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ⚡ 演示快速切换
          </div>
          {ENVIRONMENTS.map(e => {
            const isCurrent = current?.path === e.path;
            return (
              <Link key={e.path} to={e.path} onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 6, textDecoration: 'none', color: '#1a1a1a',
                  background: isCurrent ? 'rgba(0,41,102,0.06)' : 'transparent',
                  border: isCurrent ? '1px solid rgba(0,41,102,0.15)' : '1px solid transparent',
                  marginBottom: 2, transition: 'background 0.12s',
                }}
                onMouseOver={(ev) => { if (!isCurrent) ev.currentTarget.style.background = '#f7f9fc'; }}
                onMouseOut={(ev)  => { if (!isCurrent) ev.currentTarget.style.background = 'transparent'; }}>
                <span style={{ fontSize: 20 }}>{e.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#002966' }}>{e.label}</div>
                  <div style={{ fontSize: 11, color: '#8a94a0' }}>{e.desc}</div>
                </div>
                {isCurrent && <span style={{ fontSize: 11, color: '#007a33', fontWeight: 700 }}>当前</span>}
              </Link>
            );
          })}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #e4e7ec', marginTop: 4, fontSize: 11, color: '#8a94a0' }}>
            演示账户已预填，直接点击即可
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, #002966, #001838)',
          color: 'white', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,41,102,0.35)',
          fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.15s',
        }}
        title="切换演示视图"
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseOut={(e)  => (e.currentTarget.style.transform = 'scale(1)')}>
        {open ? '✕' : '⚡'}
      </button>
    </div>
  );
}
