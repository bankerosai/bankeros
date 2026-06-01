/**
 * CopilotSidebar — right-edge chat panel for BankerOS.
 *
 *  · Ctrl/Cmd+K to toggle
 *  · Connection status pill (green/red/grey) with reason on hover
 *  · Friendly error cards instead of opaque JSON-parse failures
 *  · Markdown rendering of assistant replies (headings, tables, code…)
 *  · Auto-scroll on new content
 *  · Slash-command palette
 *  · Page context chip + auto-injection
 *  · "New conversation" reset that keeps the panel open
 */
import { useEffect, useRef, useState } from 'react';
import { useCopilot } from './useCopilot';
import { Markdown } from './Markdown';
import './copilot.css';

const SIDEBAR_WIDTH = 440;

export default function CopilotSidebar() {
  const {
    isOpen,
    toggle,
    close,
    send,
    messages,
    busy,
    error,
    commands,
    loadCatalog,
    checkConnection,
    sessionId,
    reset,
    retry,
    connection,
    modelLabel,
    pathname,
  } = useCopilot();

  const [input, setInput] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, toggle, close]);

  // On first open: probe health + load catalog
  useEffect(() => {
    if (isOpen && connection.status === 'unknown') {
      void checkConnection();
      void loadCatalog();
    }
  }, [isOpen, connection.status, checkConnection, loadCatalog]);

  // Autofocus on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, busy, error]);

  const submit = () => {
    const v = input.trim();
    if (!v || busy) return;
    setInput('');
    setShowPalette(false);
    void send(v);
  };

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <button
          onClick={toggle}
          title="Banker Copilot (Ctrl+K)"
          aria-label="Open Banker Copilot"
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 200,
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #db0011, #002966)',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(15,23,42,0.25)',
            fontSize: 24,
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ✦
        </button>
      )}

      {/* Sidebar */}
      <aside
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderLeft: '1px solid rgba(15,23,42,0.08)',
          boxShadow: '0 24px 60px rgba(15,23,42,0.15)',
          transform: isOpen ? 'translateX(0)' : `translateX(${SIDEBAR_WIDTH}px)`,
          transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 199,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, "PingFang SC", system-ui, sans-serif',
          color: '#0b1220',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #e6eaf0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #db0011, #002966)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              ✦
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Banker Copilot</span>
                <StatusPill connection={connection} />
              </div>
              {modelLabel && (
                <div
                  style={{
                    fontSize: 10.5,
                    color: '#64748b',
                    fontFamily: 'ui-monospace, monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={modelLabel}
                >
                  {modelLabel}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {sessionId && (
              <button onClick={reset} title="新对话" style={iconBtnStyle}>
                ⟲
              </button>
            )}
            <button onClick={close} title="关闭 (Esc)" style={iconBtnStyle}>
              ✕
            </button>
          </div>
        </header>

        {/* Page context chip */}
        <div
          style={{
            padding: '8px 18px',
            borderBottom: '1px solid #f1f4f8',
            fontSize: 11,
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📍</span>
          <span>
            当前页: <code style={{ color: '#334155', fontSize: 11 }}>{pathname}</code>
          </span>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 18px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {connection.status === 'down' && (
            <ConnectionDownCard reason={connection.reason} onRetry={retry} />
          )}
          {messages.length === 0 && !busy && connection.status !== 'down' && (
            <EmptyState commands={commands} onPick={(c) => setInput(`/${c} `)} />
          )}
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} content={m.content} />
          ))}
          {busy && <ThinkingBubble />}
          {error && !busy && <ErrorCard message={error} onRetry={retry} />}
        </div>

        {/* Composer */}
        <footer
          style={{
            padding: '10px 14px 14px',
            borderTop: '1px solid #e6eaf0',
            position: 'relative',
          }}
        >
          {showPalette && commands.length > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                bottom: '100%',
                marginBottom: 8,
                background: '#fff',
                borderRadius: 10,
                border: '1px solid #e6eaf0',
                boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
                maxHeight: 240,
                overflow: 'auto',
              }}
            >
              {commands
                .filter((c) => ('/' + c.name).startsWith(input.trim()))
                .map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setInput(`/${c.name} `);
                      setShowPalette(false);
                      inputRef.current?.focus();
                    }}
                    style={paletteRowStyle}
                  >
                    <span
                      style={{
                        color: '#db0011',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      /{c.name}
                    </span>
                  </button>
                ))}
            </div>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowPalette(e.target.value.startsWith('/'));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={3}
            placeholder={
              connection.status === 'down' ? '请先解决连接问题…' : '输入消息，或 "/" 唤起命令'
            }
            disabled={connection.status === 'down'}
            style={{
              width: '100%',
              resize: 'none',
              border: '1px solid #e6eaf0',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 13.5,
              fontFamily: 'inherit',
              color: '#0b1220',
              background: connection.status === 'down' ? '#f6f8fb' : '#fff',
              outline: 'none',
              transition: 'border-color 120ms',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#002966')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e6eaf0')}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 6,
            }}
          >
            <span style={{ fontSize: 10.5, color: '#94a3b8' }}>
              Enter 发送 · Shift+Enter 换行 · "/" 命令
            </span>
            <button
              onClick={submit}
              disabled={busy || !input.trim() || connection.status === 'down'}
              style={{
                background:
                  busy || !input.trim() || connection.status === 'down'
                    ? '#cbd5e1'
                    : '#db0011',
                color: '#fff',
                border: 'none',
                padding: '7px 16px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 12.5,
                cursor:
                  busy || !input.trim() || connection.status === 'down'
                    ? 'not-allowed'
                    : 'pointer',
                transition: 'background 120ms',
              }}
            >
              {busy ? '思考中…' : '发送 →'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════

const iconBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  cursor: 'pointer',
  fontSize: 14,
};

const paletteRowStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 14px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12.5,
};

function StatusPill({ connection }: { connection: any }) {
  if (connection.status === 'ok') {
    const title = `Provider: ${connection.provider} · Model: ${connection.model}${connection.keyConfigured ? '' : ' · ⚠ key not configured'}`;
    return (
      <span className="copilot-status-pill ok" title={title}>
        <span className="dot" />
        在线
      </span>
    );
  }
  if (connection.status === 'down') {
    return (
      <span className="copilot-status-pill down" title={connection.reason}>
        <span className="dot" />
        离线
      </span>
    );
  }
  return (
    <span className="copilot-status-pill unknown">
      <span className="dot" />
      连接中
    </span>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === 'USER';
  if (isUser) {
    return (
      <div
        style={{
          alignSelf: 'flex-end',
          maxWidth: '90%',
          padding: '10px 14px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #002966, #1e3a8a)',
          color: '#fff',
          fontSize: 13.5,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </div>
    );
  }
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        maxWidth: '95%',
        padding: '12px 14px',
        borderRadius: 14,
        background: '#f6f8fb',
        border: '1px solid #e6eaf0',
        wordBreak: 'break-word',
      }}
    >
      <Markdown text={content} />
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        padding: '8px 14px',
        borderRadius: 14,
        background: '#f6f8fb',
        border: '1px solid #e6eaf0',
        color: '#64748b',
        fontSize: 12,
      }}
    >
      <span className="copilot-dots">●●●</span>
      <style>{`
        @keyframes copilot-thinking { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
        .copilot-dots { animation: copilot-thinking 1.2s ease-in-out infinite; letter-spacing: 2px; }
      `}</style>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="copilot-error-card">
      <strong>出错了</strong>
      <pre>{message}</pre>
      <button onClick={onRetry}>重试连接</button>
    </div>
  );
}

function ConnectionDownCard({
  reason,
  onRetry,
}: {
  reason: string;
  onRetry: () => void;
}) {
  const noKey = /OPENROUTER_API_KEY/i.test(reason) || /NO_API_KEY/.test(reason);
  return (
    <div className="copilot-error-card">
      <strong>Copilot 服务未就绪</strong>
      <div style={{ marginTop: 6, color: '#7f1d1d' }}>
        {noKey ? (
          <>
            <p>
              没找到 <code>OPENROUTER_API_KEY</code>。在仓库根 <code>.env</code> 里加：
            </p>
            <pre>{`OPENROUTER_API_KEY=sk-or-v1-...
COPILOT_MODEL=anthropic/claude-sonnet-4.5`}</pre>
            <p>然后重启 <code>pnpm dev</code>（Vite 启动时才会读 .env）。</p>
          </>
        ) : (
          <>
            <p>无法连接到 Copilot 后端：</p>
            <pre>{reason}</pre>
            <p>
              开发模式下 Copilot 跑在 Vite 内置插件里，应该自动可用。
              如果一直离线，重启 <code>pnpm dev</code>。
            </p>
          </>
        )}
      </div>
      <button onClick={onRetry}>重新检测</button>
    </div>
  );
}

function EmptyState({
  commands,
  onPick,
}: {
  commands: { name: string }[];
  onPick: (name: string) => void;
}) {
  return (
    <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.6 }}>
      <p style={{ marginBottom: 12 }}>
        我是 <strong>Banker Copilot</strong>。我能查 BankerOS 数据，按内部规范帮你起草
        信贷备忘录、KYC 评审、NPL 报告、董事会简报等。
      </p>
      <p style={{ marginBottom: 8, color: '#94a3b8', fontSize: 11 }}>常用斜杠命令：</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {commands.slice(0, 6).map((c) => (
          <button
            key={c.name}
            onClick={() => onPick(c.name)}
            style={{
              ...paletteRowStyle,
              padding: '6px 10px',
              border: '1px solid #e6eaf0',
              borderRadius: 8,
              background: '#fff',
            }}
          >
            <span
              style={{
                color: '#db0011',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              /{c.name}
            </span>
          </button>
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: '#94a3b8' }}>
        提示：Ctrl/Cmd + K 任意页面唤起。
      </p>
    </div>
  );
}
