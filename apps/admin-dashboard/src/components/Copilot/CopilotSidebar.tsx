/**
 * CopilotSidebar — right-edge chat panel for BankerOS.
 *
 *  · Ctrl/Cmd+K to toggle
 *  · Tab switch: 聊天 (Chat) | 产出物 (Artefacts)
 *  · Streaming typewriter rendering via SSE
 *  · `/` slash-command palette
 *  · `@` mention picker (customer / loan / LC IDs)
 *  · Connection status pill (green/red/grey) with reason on hover
 *  · Friendly error cards
 *  · Markdown rendering of assistant replies
 *  · Auto-scroll, model badge, retry
 */
import { useEffect, useRef, useState } from 'react';
import { useCopilot } from './useCopilot';
import { Markdown } from './Markdown';
import { MentionPicker } from './MentionPicker';
import { ArtefactsPanel } from './ArtefactsPanel';
import './copilot.css';

const SIDEBAR_WIDTH = 460;

export default function CopilotSidebar() {
  const {
    isOpen,
    view,
    setView,
    toggle,
    close,
    send,
    messages,
    busy,
    error,
    commands,
    loadCatalog,
    checkConnection,
    loadArtefacts,
    sessionId,
    reset,
    retry,
    connection,
    modelLabel,
    pathname,
    artefacts,
    unreadCount,
  } = useCopilot();

  const [input, setInput] = useState('');
  const [showSlashPalette, setShowSlashPalette] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape' && isOpen && !mentionQuery) {
        close();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, mentionQuery, toggle, close]);

  // First open: probe health + load
  useEffect(() => {
    if (isOpen && connection.status === 'unknown') {
      void checkConnection();
      void loadCatalog();
      void loadArtefacts();
    }
  }, [isOpen, connection.status, checkConnection, loadCatalog, loadArtefacts]);

  // Autofocus on open
  useEffect(() => {
    if (isOpen && view === 'chat') setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen, view]);

  // Auto-scroll on new content
  useEffect(() => {
    if (view === 'chat') {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, busy, error, view]);

  // Detect @ to open mention picker; track the in-progress query
  const onInputChange = (val: string) => {
    setInput(val);
    setShowSlashPalette(val.startsWith('/'));
    const cursor = inputRef.current?.selectionStart ?? val.length;
    // Look backwards from cursor for an unbroken @<token>
    const slice = val.slice(0, cursor);
    const m = slice.match(/@([^\s@]*)$/);
    if (m) {
      setMentionQuery(m[1]);
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (insertion: string) => {
    const cursor = inputRef.current?.selectionStart ?? input.length;
    const before = input.slice(0, cursor).replace(/@([^\s@]*)$/, '');
    const after = input.slice(cursor);
    const next = `${before}${insertion}${after}`;
    setInput(next);
    setMentionQuery(null);
    // Restore caret to after the insertion
    setTimeout(() => {
      const pos = before.length + insertion.length;
      inputRef.current?.setSelectionRange(pos, pos);
      inputRef.current?.focus();
    }, 0);
  };

  const submit = () => {
    const v = input.trim();
    if (!v || busy || connection.status === 'down') return;
    setInput('');
    setShowSlashPalette(false);
    setMentionQuery(null);
    void send(v);
  };

  return (
    <>
      {!isOpen && (
        <div className="copilot-launcher" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 200 }}>
          {/* Soft pulse rings — only run when there's unread, otherwise calm. */}
          {unreadCount > 0 && (
            <>
              <span className="copilot-launcher-pulse" />
              <span className="copilot-launcher-pulse copilot-launcher-pulse-delayed" />
            </>
          )}
          <button
            onClick={toggle}
            title="Banker Copilot (Ctrl+K)"
            aria-label="Open Banker Copilot"
            style={floatingBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ✦
          </button>
          {unreadCount > 0 && (
            <span className="copilot-launcher-badge" aria-label={`${unreadCount} 条新消息`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      )}

      <aside
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          background: 'rgba(255,255,255,0.98)',
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
            padding: '12px 18px',
            borderBottom: '1px solid #e6eaf0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div style={logoStyle}>✦</div>
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
                  title={
                    connection.status === 'ok' && connection.forcedProviderOrder
                      ? `provider 强制顺序: ${connection.forcedProviderOrder.join(', ')}`
                      : modelLabel
                  }
                >
                  {modelLabel}
                  {connection.status === 'ok' && connection.forcedProviderOrder && (
                    <span style={{ color: '#15803d', marginLeft: 4 }}>✓ direct</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {sessionId && view === 'chat' && (
              <button onClick={reset} title="新对话" style={iconBtnStyle}>
                ⟲
              </button>
            )}
            <button onClick={close} title="关闭 (Esc)" style={iconBtnStyle}>
              ✕
            </button>
          </div>
        </header>

        {/* Tab strip */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e6eaf0',
            background: '#f8fafc',
          }}
        >
          <TabButton
            active={view === 'chat'}
            onClick={() => setView('chat')}
            label="聊天"
          />
          <TabButton
            active={view === 'artefacts'}
            onClick={() => setView('artefacts')}
            label={`产出物 ${artefacts.length > 0 ? `· ${artefacts.length}` : ''}`}
          />
        </div>

        {/* Page context chip — only in chat view */}
        {view === 'chat' && (
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
              当前页:{' '}
              <code style={{ color: '#334155', fontSize: 11 }}>{pathname}</code>
            </span>
          </div>
        )}

        {/* Body */}
        {view === 'chat' ? (
          <>
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
                <Bubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  streaming={m.streaming}
                  toolCalls={m.toolCalls}
                />
              ))}
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
              {showSlashPalette && commands.length > 0 && !mentionQuery && (
                <SlashPalette
                  commands={commands}
                  filter={input.trim()}
                  onPick={(c) => {
                    setInput(`/${c} `);
                    setShowSlashPalette(false);
                    inputRef.current?.focus();
                  }}
                />
              )}
              {mentionQuery !== null && (
                <MentionPicker
                  query={mentionQuery}
                  onPick={insertMention}
                  onClose={() => setMentionQuery(null)}
                />
              )}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onSelect={() => onInputChange(input)}
                onKeyDown={(e) => {
                  // Mention picker handles its own Enter/Tab/Arrow keys
                  if (mentionQuery !== null && ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
                    return;
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={3}
                placeholder={
                  connection.status === 'down'
                    ? '请先解决连接问题…'
                    : '输入消息，或 "/" 唤起命令、"@" 提及实体'
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
                  Enter 发送 · Shift+Enter 换行 · "/" 命令 · "@" 实体
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
                  {busy ? '生成中…' : '发送 →'}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <ArtefactsPanel />
        )}
      </aside>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// Subcomponents
// ════════════════════════════════════════════════════════════

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 12px',
        background: active ? '#fff' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #db0011' : '2px solid transparent',
        cursor: 'pointer',
        fontSize: 12.5,
        fontWeight: active ? 700 : 500,
        color: active ? '#0b1220' : '#64748b',
        transition: 'all 120ms',
      }}
    >
      {label}
    </button>
  );
}

function StatusPill({ connection }: { connection: any }) {
  if (connection.status === 'ok') {
    const title = `Provider: ${connection.provider} · Model: ${connection.model}${connection.keyConfigured ? '' : ' · ⚠ key not configured'}${connection.forcedProviderOrder ? ` · forced: ${connection.forcedProviderOrder.join(',')}` : ''}`;
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

function Bubble({
  role,
  content,
  streaming,
  toolCalls,
}: {
  role: string;
  content: string;
  streaming?: boolean;
  toolCalls?: { name: string; args: Record<string, unknown>; ok?: boolean; summary?: string }[];
}) {
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
        position: 'relative',
      }}
    >
      {/* Tool-call chips ABOVE the text, in the order they were emitted */}
      {toolCalls && toolCalls.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: content ? 10 : 0 }}>
          {toolCalls.map((tc, i) => (
            <ToolCallChip key={i} call={tc} />
          ))}
        </div>
      )}
      {content ? (
        <Markdown text={content} />
      ) : !toolCalls?.length ? (
        <span style={{ color: '#64748b', fontSize: 13 }}>思考中…</span>
      ) : null}
      {streaming && content && (
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 14,
            background: '#0b1220',
            marginLeft: 3,
            verticalAlign: -2,
            animation: 'copilot-caret 1s steps(1) infinite',
          }}
        />
      )}
      <style>{`
        @keyframes copilot-caret { 50% { opacity: 0 } }
      `}</style>
    </div>
  );
}

function ToolCallChip({ call }: { call: { name: string; args: Record<string, unknown>; ok?: boolean; summary?: string } }) {
  const arg = Object.entries(call.args)[0];
  const argLabel = arg ? `${arg[0]}=${String(arg[1])}` : '';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 10px',
        background: call.ok ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)',
        border: `1px solid ${call.ok ? 'rgba(22,163,74,0.18)' : 'rgba(220,38,38,0.18)'}`,
        borderRadius: 8,
        fontSize: 11.5,
        color: call.ok ? '#15803d' : '#b91c1c',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      <span style={{ flexShrink: 0 }}>{call.ok ? '✓' : '✗'}</span>
      <span style={{ fontWeight: 700, color: '#334155' }}>{call.name}</span>
      {argLabel && <span style={{ color: '#64748b' }}>({argLabel})</span>}
      {call.summary && (
        <span style={{ color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          → {call.summary}
        </span>
      )}
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
            <p>然后重启 <code>pnpm dev</code>。</p>
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

function SlashPalette({
  commands,
  filter,
  onPick,
}: {
  commands: { name: string }[];
  filter: string;
  onPick: (name: string) => void;
}) {
  const filtered = commands.filter((c) => ('/' + c.name).startsWith(filter));
  if (!filtered.length) return null;
  return (
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
        boxShadow: '0 12px 32px rgba(15,23,42,0.14)',
        maxHeight: 240,
        overflow: 'auto',
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: 10.5, color: '#94a3b8', padding: '8px 12px', borderBottom: '1px solid #f1f4f8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        斜杠命令
      </div>
      {filtered.map((c) => (
        <button
          key={c.name}
          onClick={() => onPick(c.name)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '8px 14px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
          }}
        >
          <span style={{ color: '#db0011', fontFamily: 'ui-monospace, monospace' }}>/{c.name}</span>
        </button>
      ))}
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
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '6px 10px',
              border: '1px solid #e6eaf0',
              borderRadius: 8,
              background: '#fff',
              cursor: 'pointer',
              fontSize: 12.5,
            }}
          >
            <span style={{ color: '#db0011', fontFamily: 'ui-monospace, monospace' }}>/{c.name}</span>
          </button>
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: '#94a3b8' }}>
        提示：Ctrl/Cmd + K 任意页面唤起 · 输入 <code>@</code> 提及客户/贷款
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Inline styles
// ════════════════════════════════════════════════════════════

const floatingBtnStyle: React.CSSProperties = {
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
};

const logoStyle: React.CSSProperties = {
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
};

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
