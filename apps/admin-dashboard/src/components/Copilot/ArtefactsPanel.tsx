/**
 * ArtefactsPanel — list + open + manage artefacts produced by slash commands.
 * Sits inside CopilotSidebar when view === 'artefacts'.
 */
import { useEffect } from 'react';
import { useCopilot, CopilotArtefact } from './useCopilot';
import { Markdown } from './Markdown';

const STATUS_META: Record<CopilotArtefact['status'], { label: string; color: string; bg: string }> = {
  DRAFT: { label: '草稿', color: '#b45309', bg: 'rgba(217,119,6,0.10)' },
  REVIEWED: { label: '已复核', color: '#1d4ed8', bg: 'rgba(37,99,235,0.10)' },
  APPROVED: { label: '已批准', color: '#15803d', bg: 'rgba(22,163,74,0.10)' },
  DISCARDED: { label: '已弃', color: '#64748b', bg: 'rgba(100,116,139,0.10)' },
};

const SKILL_LABEL: Record<string, string> = {
  'credit-memo': '信贷备忘录',
  'kyc-review': 'KYC 评审',
  'npl-explain': 'NPL 分析',
  'ceo-brief': 'CEO 简报',
  'customer-360': '客户 360',
  'fx-hedge': 'FX 套保建议',
  'fx-hedging-advisor': 'FX 套保建议',
};

export function ArtefactsPanel() {
  const { artefacts, loadArtefacts, openArtefactId, openArtefact, setArtefactStatus } = useCopilot();

  useEffect(() => {
    void loadArtefacts();
  }, [loadArtefacts]);

  const open = artefacts.find((a) => a.id === openArtefactId);

  if (open) {
    return <ArtefactDetail artefact={open} onBack={() => openArtefact(null)} onStatus={setArtefactStatus} />;
  }

  return (
    <div style={{ padding: '16px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {artefacts.length === 0 && (
        <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
          <p style={{ marginBottom: 8 }}>暂无产出物。</p>
          <p style={{ fontSize: 11.5 }}>
            在聊天里发起 <code>/credit-memo</code>、<code>/kyc-review</code>、
            <code>/ceo-brief</code> 等斜杠命令，模型生成的备忘录/评审/简报会自动归档到这里。
          </p>
        </div>
      )}
      {artefacts.map((a) => (
        <button
          key={a.id}
          onClick={() => openArtefact(a.id)}
          style={{
            textAlign: 'left',
            background: '#fff',
            border: '1px solid #e6eaf0',
            borderRadius: 10,
            padding: 12,
            cursor: 'pointer',
            transition: 'all 120ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#002966';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e6eaf0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#db0011', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {SKILL_LABEL[a.skill] ?? a.skill}
            </span>
            <StatusBadge status={a.status} />
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#0b1220', marginBottom: 4 }}>
            {a.subject}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {new Date(a.createdAt).toLocaleString('zh-CN')} · {a.content.length.toLocaleString()} 字符
          </div>
        </button>
      ))}
    </div>
  );
}

function ArtefactDetail({
  artefact,
  onBack,
  onStatus,
}: {
  artefact: CopilotArtefact;
  onBack: () => void;
  onStatus: (id: string, status: CopilotArtefact['status']) => Promise<void>;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          padding: '10px 18px',
          borderBottom: '1px solid #e6eaf0',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: 13,
            padding: 4,
          }}
        >
          ← 返回列表
        </button>
        <span style={{ flex: 1 }} />
        <StatusBadge status={artefact.status} />
      </div>
      <div style={{ padding: '14px 18px 8px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#db0011', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {SKILL_LABEL[artefact.skill] ?? artefact.skill}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0b1220', marginBottom: 4 }}>
          {artefact.subject}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>
          生成于 {new Date(artefact.createdAt).toLocaleString('zh-CN')}
        </div>
      </div>
      <div style={{ padding: '4px 18px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid #f1f4f8' }}>
        <button
          onClick={() => copyToClipboard(artefact.content)}
          style={actionBtnStyle}
        >
          📋 复制 Markdown
        </button>
        <button
          onClick={() => downloadAsMd(artefact)}
          style={actionBtnStyle}
        >
          ⬇ 下载 .md
        </button>
        {artefact.status !== 'REVIEWED' && (
          <button onClick={() => onStatus(artefact.id, 'REVIEWED')} style={actionBtnStyle}>
            ✓ 标记已复核
          </button>
        )}
        {artefact.status !== 'APPROVED' && (
          <button
            onClick={() => onStatus(artefact.id, 'APPROVED')}
            style={{ ...actionBtnStyle, color: '#15803d', borderColor: 'rgba(22,163,74,0.3)' }}
          >
            ✓ 批准
          </button>
        )}
        {artefact.status !== 'DISCARDED' && (
          <button
            onClick={() => onStatus(artefact.id, 'DISCARDED')}
            style={{ ...actionBtnStyle, color: '#64748b' }}
          >
            ✕ 弃稿
          </button>
        )}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 18px 24px',
          background: '#f6f8fb',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #e6eaf0',
            borderRadius: 10,
            padding: '16px 18px',
          }}
        >
          <Markdown text={artefact.content} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CopilotArtefact['status'] }) {
  const m = STATUS_META[status];
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 100,
        background: m.bg,
        color: m.color,
        whiteSpace: 'nowrap',
      }}
    >
      {m.label}
    </span>
  );
}

const actionBtnStyle: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  padding: '5px 10px',
  background: '#fff',
  border: '1px solid #e6eaf0',
  borderRadius: 6,
  cursor: 'pointer',
  color: '#0b1220',
  transition: 'all 120ms',
};

function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {
    /* ignore */
  });
}

function downloadAsMd(a: CopilotArtefact) {
  const blob = new Blob(
    [`# ${a.subject}\n\n*${a.skill} · ${new Date(a.createdAt).toLocaleString('zh-CN')}*\n\n---\n\n${a.content}`],
    { type: 'text/markdown' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${a.skill}-${a.subject}-${new Date(a.createdAt).toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
