/**
 * Standardized Level-2 Product Detail Page.
 * Structure (HSBC/Standard Chartered/CMB style):
 *   Sticky sub-nav  → Overview → Key Features → Who's It For
 *   → How It Works (transaction flow)  → Case Studies → Pricing/Fees
 *   → FAQ → Apply CTA
 */

import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';

export interface DetailSection { id: string; label: string; }

export interface DetailHero {
  category: string;       // e.g. "信用卡"
  productName: string;    // e.g. "环球白金信用卡 World Elite"
  tagline: string;
  bullets: string[];
  background?: 'navy' | 'gradient' | 'gold' | 'red' | 'black';
  badge?: string;         // e.g. "Premier 专享"
  ctaPrimary?: { label: string; to: string };
  ctaSecondary?: { label: string; to: string };
  visual?: ReactNode;
}

interface Props {
  breadcrumbs: { label: string; to?: string }[];
  hero: DetailHero;
  sections: DetailSection[];
  children: ReactNode;
}

const BG: Record<string, React.CSSProperties> = {
  navy: { background: 'linear-gradient(135deg, var(--p-navy), var(--p-navy-dark))' },
  gradient: { background: 'linear-gradient(135deg, var(--p-navy), var(--p-red))' },
  gold: { background: 'linear-gradient(135deg, #b8860b, #8b6914)' },
  red:  { background: 'linear-gradient(135deg, var(--p-red), #a00010)' },
  black: { background: 'linear-gradient(135deg, #1a1a1a, #000)' },
};

export default function ProductDetailPage({ breadcrumbs, hero, sections, children }: Props) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <PortalLayout>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--p-bg-section)', padding: '12px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', fontSize: 13, color: 'var(--p-text-soft)' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>首页</Link>
          {breadcrumbs.map((b, i) => (
            <span key={i}>
              <span style={{ margin: '0 8px', color: 'var(--p-text-muted)' }}>›</span>
              {b.to ? <Link to={b.to} style={{ color: 'inherit', textDecoration: 'none' }}>{b.label}</Link> : <span style={{ color: 'var(--p-navy)', fontWeight: 600 }}>{b.label}</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="p-hero" style={{ padding: '60px 48px', ...BG[hero.background ?? 'navy'] }}>
        <div className="p-hero-inner" style={{ gridTemplateColumns: hero.visual ? '1.2fr 1fr' : '1fr', gap: 48 }}>
          <div>
            {hero.badge && (
              <span style={{ display: 'inline-block', background: '#ffba00', color: '#0f1117', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 14 }}>
                {hero.badge}
              </span>
            )}
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 8 }}>
              {hero.category}
            </div>
            <h1 className="p-hero-title" style={{ fontSize: 40, marginBottom: 14 }}>{hero.productName}</h1>
            <p className="p-hero-subtitle" style={{ fontSize: 17, marginBottom: 20 }}>{hero.tagline}</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {hero.bullets.map(b => (
                <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, opacity: 0.92 }}>
                  <span style={{ color: '#ffba00', fontWeight: 700 }}>✓</span> {b}
                </li>
              ))}
            </ul>

            <div className="p-hero-ctas">
              {hero.ctaPrimary && <Link to={hero.ctaPrimary.to} className="p-btn p-btn-primary">{hero.ctaPrimary.label}</Link>}
              {hero.ctaSecondary && (
                <Link to={hero.ctaSecondary.to} className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white' }}>
                  {hero.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
          {hero.visual && <div>{hero.visual}</div>}
        </div>
      </section>

      {/* Sticky sub-nav */}
      <div style={{ position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid var(--p-border)', zIndex: 90, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              style={{
                padding: '16px 14px', fontSize: 13, fontWeight: 600,
                color: activeSection === s.id ? 'var(--p-red)' : 'var(--p-text-soft)',
                borderBottom: activeSection === s.id ? '3px solid var(--p-red)' : '3px solid transparent',
                textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.15s',
              }}>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {children}
    </PortalLayout>
  );
}

// ─────────────────────────────────────────────────────────────────
// Detail-page specific section helpers
// ─────────────────────────────────────────────────────────────────

export function DetailSectionEl({ id, eyebrow, title, subtitle, alt, children }: { id: string; eyebrow?: string; title?: string; subtitle?: string; alt?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="p-section" style={{ background: alt ? 'var(--p-bg-section)' : undefined, scrollMarginTop: 60 }}>
      <div className="p-section-inner">
        {(eyebrow || title) && (
          <div className="p-section-header">
            {eyebrow && <div className="p-section-eyebrow">{eyebrow}</div>}
            {title && <h2 className="p-section-title">{title}</h2>}
            {subtitle && <p className="p-section-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function UseCaseGrid({ items }: { items: { persona: string; icon: string; scenario: string; benefit: string; example?: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
      {items.map(c => (
        <div key={c.persona} style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 10, padding: 28, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--p-border-soft)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--p-bg-section)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>典型客户</div>
              <div style={{ fontWeight: 700, color: 'var(--p-navy)' }}>{c.persona}</div>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--p-text-muted)', fontWeight: 600, marginBottom: 4 }}>使用场景</div>
            <div style={{ fontSize: 13, color: 'var(--p-text)', lineHeight: 1.6 }}>{c.scenario}</div>
          </div>
          <div style={{ marginBottom: c.example ? 12 : 0 }}>
            <div style={{ fontSize: 11, color: 'var(--p-text-muted)', fontWeight: 600, marginBottom: 4 }}>获得收益</div>
            <div style={{ fontSize: 13, color: 'var(--p-success)', lineHeight: 1.6, fontWeight: 600 }}>{c.benefit}</div>
          </div>
          {c.example && (
            <div style={{ padding: '8px 12px', background: 'var(--p-bg-section)', borderRadius: 4, fontSize: 11, color: 'var(--p-text-muted)', fontStyle: 'italic' }}>
              💡 例：{c.example}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProcessFlow({ steps }: { steps: { step: string; title: string; desc: string; actor?: string }[] }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 36, border: '1px solid var(--p-border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 0, alignItems: 'flex-start', position: 'relative' }}>
        {/* connector line */}
        <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 2, background: 'var(--p-border)' }} />

        {steps.map((s, i) => (
          <div key={s.step} style={{ position: 'relative', textAlign: 'center', padding: '0 8px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--p-navy)', color: 'white', margin: '0 auto 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, position: 'relative', zIndex: 1,
              border: '4px solid white',
            }}>
              {s.step}
            </div>
            {s.actor && (
              <div style={{ fontSize: 10, color: 'var(--p-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {s.actor}
              </div>
            )}
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 6 }}>{s.title}</h4>
            <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseStudy({ company, logo, industry, challenge, solution, results, quote, quoteAuthor }: {
  company: string; logo: string; industry: string; challenge: string; solution: string; results: { metric: string; value: string }[]; quote?: string; quoteAuthor?: string;
}) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 36, border: '1px solid var(--p-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--p-border-soft)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 10, background: 'var(--p-bg-section)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{logo}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 2 }}>{company}</h3>
          <div style={{ fontSize: 13, color: 'var(--p-text-muted)' }}>{industry}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>挑战</div>
          <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.7, margin: 0 }}>{challenge}</p>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-navy)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>BankerOS 解决方案</div>
          <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.7, margin: 0 }}>{solution}</p>
        </div>
      </div>

      <div style={{ background: 'var(--p-bg-section)', borderRadius: 8, padding: 20, marginBottom: quote ? 20 : 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-success)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>实施成果</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${results.length}, 1fr)`, gap: 16 }}>
          {results.map(r => (
            <div key={r.metric}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--p-success)', marginBottom: 2 }}>{r.value}</div>
              <div style={{ fontSize: 11, color: 'var(--p-text-muted)' }}>{r.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {quote && (
        <div style={{ borderLeft: '3px solid var(--p-red)', padding: '8px 18px' }}>
          <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--p-text)', lineHeight: 1.7, margin: 0 }}>"{quote}"</p>
          {quoteAuthor && <div style={{ fontSize: 12, color: 'var(--p-text-muted)', marginTop: 8 }}>— {quoteAuthor}</div>}
        </div>
      )}
    </div>
  );
}

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, border: '1px solid var(--p-border)', overflow: 'hidden' }}>
      {items.map((f, i) => (
        <details key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--p-border-soft)' }}>
          <summary style={{ padding: '18px 24px', cursor: 'pointer', fontWeight: 600, color: 'var(--p-navy)', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none' }}>
            {f.q}
            <span style={{ color: 'var(--p-text-muted)' }}>+</span>
          </summary>
          <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--p-text-soft)', lineHeight: 1.7 }}>{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function PricingTable({ fees }: { fees: { item: string; amount: string; note?: string }[] }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--p-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--p-bg-section)' }}>
          <tr>
            <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)', fontWeight: 600 }}>收费项目</th>
            <th style={{ padding: 14, textAlign: 'right', fontSize: 12, color: 'var(--p-text-muted)', fontWeight: 600 }}>标准</th>
            <th style={{ padding: 14, textAlign: 'left', fontSize: 12, color: 'var(--p-text-muted)', fontWeight: 600 }}>备注</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((f, i) => (
            <tr key={i} style={{ borderTop: '1px solid var(--p-border-soft)' }}>
              <td style={{ padding: 14, fontWeight: 600 }}>{f.item}</td>
              <td style={{ padding: 14, textAlign: 'right', fontFamily: 'monospace', color: f.amount.includes('免') || f.amount.includes('0') ? 'var(--p-success)' : 'var(--p-red)', fontWeight: 700 }}>{f.amount}</td>
              <td style={{ padding: 14, fontSize: 12, color: 'var(--p-text-muted)' }}>{f.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
