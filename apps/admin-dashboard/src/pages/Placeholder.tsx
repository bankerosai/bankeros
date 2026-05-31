interface Props { title: string; module: string; apis: string[]; }

export default function Placeholder({ title, module, apis }: Props) {
  return (
    <div>
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(59,130,246,0.3)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 32 }}>🔧</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {module} · 后端服务已实现，前端界面建设中
            </div>
            <span className="badge badge-blue">API 就绪</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>已实现 API 端点</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {apis.map((api) => {
            const [method, ...pathParts] = api.split(' ');
            const path = pathParts.join(' ');
            const color = method === 'GET' ? 'var(--accent-green)' : method === 'POST' ? 'var(--accent-blue)' : method === 'PATCH' ? 'var(--accent-amber)' : 'var(--accent-red)';
            return (
              <div key={api} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
                <span style={{ color, fontWeight: 700, minWidth: 52 }}>{method}</span>
                <span style={{ color: 'var(--text-primary)' }}>{path}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
