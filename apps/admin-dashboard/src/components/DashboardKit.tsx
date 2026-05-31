/**
 * DashboardKit — shared primitives for executive dashboards.
 * Used by CeoDashboard + ManagementDashboard (12 business-line views).
 */
import { ReactNode } from 'react';

export type Status = 'good' | 'watch' | 'alert';

export const STATUS_COLOR: Record<Status, string> = {
  good: '#22c55e',
  watch: '#f59e0b',
  alert: '#ef4444',
};
export const STATUS_LABEL: Record<Status, string> = {
  good: '✓ 健康',
  watch: '! 关注',
  alert: '⚠ 告警',
};

export function statusOf(
  value: number,
  opts: { goodAbove?: number; goodBelow?: number; watchBelow?: number; watchAbove?: number },
): Status {
  if (opts.goodAbove !== undefined) {
    if (value >= opts.goodAbove) return 'good';
    if (opts.watchBelow !== undefined && value >= opts.watchBelow) return 'watch';
    return 'alert';
  }
  if (opts.goodBelow !== undefined) {
    if (value <= opts.goodBelow) return 'good';
    if (opts.watchAbove !== undefined && value <= opts.watchAbove) return 'watch';
    return 'alert';
  }
  return 'good';
}

export const Light = ({ s }: { s: Status }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 600, color: STATUS_COLOR[s],
  }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[s], boxShadow: `0 0 8px ${STATUS_COLOR[s]}` }} />
    {STATUS_LABEL[s]}
  </span>
);

export const SignalKpi = ({
  label, value, unit, delta, status = 'good', target,
}: { label: string; value: string; unit?: string; delta?: string; status?: Status; target?: string }) => (
  <div className="card" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: STATUS_COLOR[status] }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <Light s={status} />
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
      {unit && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span>}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
      {delta && <span style={{ color: delta.startsWith('↑') ? STATUS_COLOR.good : delta.startsWith('↓') ? STATUS_COLOR.alert : 'var(--text-muted)' }}>{delta}</span>}
      {target && <span style={{ color: 'var(--text-muted)' }}>目标 {target}</span>}
    </div>
  </div>
);

export const SectionTitle = ({ idx, title, subtitle, icon }: { idx?: string; title: string; subtitle?: string; icon?: string }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '24px 0 14px', borderLeft: '3px solid var(--accent-blue)', paddingLeft: 12 }}>
    {idx && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.08em' }}>{idx}</span>}
    <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{icon} {title}</span>
    {subtitle && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</span>}
  </div>
);

export const ChartCard = ({ title, extra, children, height = 240 }: { title: string; extra?: ReactNode; children: ReactNode; height?: number }) => (
  <div className="card">
    <div className="section-header">
      <span className="section-title">{title}</span>
      {extra}
    </div>
    <div className="chart-wrap" style={{ height }}>{children}</div>
  </div>
);

export const tooltipStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text-primary)',
  fontSize: 12,
} as const;
