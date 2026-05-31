import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'fraud' | 'payment' | 'kyc' | 'compliance' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  urgent?: boolean;
}

const INITIAL: Notification[] = [
  { id: 'n1', type: 'fraud',      title: '🚨 欺诈拦截',         body: '支付 PAY1K7L0M5N 欺诈分 0.94 — 已自动阻断',     time: '刚刚',   read: false, urgent: true  },
  { id: 'n2', type: 'kyc',        title: '⚠️ KYC 待审核',       body: 'Omar Hassan (AE) 高风险 — 需要人工复核',          time: '3分钟前', read: false               },
  { id: 'n3', type: 'payment',    title: '✓ SWIFT 到账',        body: '$1.25M USD 已入账 · MT103 DEUT/HSBC',           time: '8分钟前', read: false               },
  { id: 'n4', type: 'compliance', title: '案件 FRAUD-0841',     body: '欺诈案件评分 0.94 — 请尽快处理',                  time: '12分钟前',read: true                },
  { id: 'n5', type: 'system',     title: 'EOD 批处理完成',      body: '2024-05-30 日终处理: 48,291 账户 · 0 错误',        time: '1小时前', read: true                },
];

const STREAM_EVENTS: Partial<Notification>[] = [
  { type: 'payment',    title: '✓ ACH 支付完成',     body: '$84,200 ACH 批次清算完成',          urgent: false },
  { type: 'fraud',      title: '⚠️ 高频交易预警',     body: '账户 ACC8841 触发速率限制 (>10/hr)', urgent: true  },
  { type: 'kyc',        title: '✓ KYC 自动通过',     body: 'Wang Fang (CN) 制裁筛查通过',        urgent: false },
  { type: 'payment',    title: '$ FX 成交确认',       body: '5,000,000 EUR/USD @ 1.0854',         urgent: false },
  { type: 'compliance', title: '📋 SAR 待提交',       body: '案件 FRAUD-0841 需在 24h 内上报',    urgent: true  },
];

const typeIcon: Record<string, string> = { fraud: '🚨', payment: '💸', kyc: '👤', compliance: '⚑', system: '⚙️' };
const typeBg: Record<string, string>   = { fraud: 'rgba(239,68,68,0.1)', payment: 'rgba(34,197,94,0.08)', kyc: 'rgba(245,158,11,0.08)', compliance: 'rgba(168,85,247,0.08)', system: 'rgba(100,116,139,0.08)' };

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Notification[]>(INITIAL);

  const unread = notes.filter(n => !n.read).length;

  // Simulate live event stream (WebSocket stub)
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const evt = STREAM_EVENTS[idx % STREAM_EVENTS.length];
      idx++;
      const newNote: Notification = {
        id: `live-${Date.now()}`,
        type: evt.type as any,
        title: evt.title!,
        body: evt.body!,
        time: '刚刚',
        read: false,
        urgent: evt.urgent,
      };
      setNotes(prev => [newNote, ...prev].slice(0, 20));
    }, 15000); // new event every 15s
    return () => clearInterval(interval);
  }, []);

  const markAllRead = useCallback(() => {
    setNotes(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}
      >
        🔔
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--accent-red)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 149 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: 44, width: 380, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow)', zIndex: 150, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 700 }}>实时通知</span>
                {unread > 0 && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--accent-blue)' }}>{unread} 条未读</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  实时
                </span>
                <button onClick={markAllRead} style={{ fontSize: 11, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer' }}>全部已读</button>
              </div>
            </div>
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {notes.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)}
                  style={{ padding: '12px 16px', borderBottom: '1px solid rgba(45,49,72,0.5)', cursor: 'pointer', background: n.read ? 'transparent' : n.urgent ? 'rgba(239,68,68,0.05)' : typeBg[n.type], transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: n.read ? 400 : 600, fontSize: 13 }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{n.body}</div>
                  {!n.read && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.urgent ? 'var(--accent-red)' : 'var(--accent-blue)', position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button style={{ fontSize: 12, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer' }}>查看全部通知</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
