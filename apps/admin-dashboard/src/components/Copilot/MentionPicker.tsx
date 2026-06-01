/**
 * MentionPicker — autocomplete popover triggered by typing `@` in the composer.
 * Hits /v1/copilot/mentions?q=... and lets the user insert an entity reference.
 */
import { useEffect, useState } from 'react';
import { useCopilot, CopilotMention } from './useCopilot';

interface Props {
  query: string;          // text after the @ (without the @ itself)
  onPick: (insertion: string) => void;
  onClose: () => void;
}

const KIND_LABEL: Record<CopilotMention['kind'], string> = {
  customer: '客户',
  loan: '贷款',
  lc: '信用证',
};
const KIND_COLOR: Record<CopilotMention['kind'], string> = {
  customer: '#002966',
  loan: '#db0011',
  lc: '#7c3aed',
};

export function MentionPicker({ query, onPick, onClose }: Props) {
  const { searchMentions } = useCopilot();
  const [items, setItems] = useState<CopilotMention[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hits = await searchMentions(query);
      if (!cancelled) {
        setItems(hits);
        setActive(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, searchMentions]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(items.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        const sel = items[active];
        if (sel) {
          e.preventDefault();
          onPick(`@${sel.id} (${sel.label}) `);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', fn, true);
    return () => window.removeEventListener('keydown', fn, true);
  }, [items, active, onPick, onClose]);

  if (!items.length) return null;

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
        maxHeight: 260,
        overflow: 'auto',
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: 10.5, color: '#94a3b8', padding: '8px 12px', borderBottom: '1px solid #f1f4f8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        提及实体 · ↑↓ 选择 · Enter 插入
      </div>
      {items.map((m, i) => (
        <button
          key={m.id}
          onClick={() => onPick(`@${m.id} (${m.label}) `)}
          onMouseEnter={() => setActive(i)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '8px 12px',
            background: i === active ? '#f6f8fb' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            color: '#0b1220',
            borderBottom: '1px solid #f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 4,
                background: `${KIND_COLOR[m.kind]}1a`,
                color: KIND_COLOR[m.kind],
                flexShrink: 0,
              }}
            >
              {KIND_LABEL[m.kind]}
            </span>
            <span style={{ fontFamily: 'ui-monospace, monospace', color: '#475569', fontSize: 11 }}>
              {m.id}
            </span>
            <span style={{ fontWeight: 600 }}>{m.label}</span>
          </div>
          {m.meta && (
            <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2, paddingLeft: 4 }}>{m.meta}</div>
          )}
        </button>
      ))}
    </div>
  );
}
