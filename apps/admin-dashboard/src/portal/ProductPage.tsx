/**
 * Generic ProductPage layout — used for all sub-product pages.
 * Renders: breadcrumb + hero + tabs/features/cards/CTA.
 * Each product page configures its content via props.
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';

export interface BreadcrumbItem { label: string; to?: string; }

export interface ProductHero {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  ctaPrimary?: { label: string; to: string };
  ctaSecondary?: { label: string; to: string };
  side?: ReactNode;
  background?: 'navy' | 'gold' | 'red' | 'black' | 'gradient';
}

interface Props {
  breadcrumbs?: BreadcrumbItem[];
  hero: ProductHero;
  children: ReactNode;
}

const BG_STYLES: Record<string, React.CSSProperties> = {
  navy: { background: 'linear-gradient(135deg, var(--p-navy) 0%, var(--p-navy-dark) 100%)' },
  gold: { background: 'linear-gradient(135deg, #b8860b 0%, #8b6914 100%)' },
  red:  { background: 'linear-gradient(135deg, var(--p-red) 0%, #a00010 100%)' },
  black: { background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)' },
  gradient: { background: 'linear-gradient(135deg, #002966 0%, #db0011 100%)' },
};

export default function ProductPage({ breadcrumbs, hero, children }: Props) {
  return (
    <PortalLayout>
      {breadcrumbs && breadcrumbs.length > 0 && (
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
      )}

      <section className="p-hero" style={{ padding: '60px 48px', ...BG_STYLES[hero.background ?? 'navy'] }}>
        <div className="p-hero-inner" style={{ gridTemplateColumns: hero.side ? '1.3fr 1fr' : '1fr', gap: 48, alignItems: 'center' }}>
          <div>
            {hero.eyebrow && (
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 14 }}>
                {hero.eyebrow}
              </div>
            )}
            <h1 className="p-hero-title" style={{ fontSize: 44 }}>{hero.title}</h1>
            {hero.subtitle && <p className="p-hero-subtitle">{hero.subtitle}</p>}
            <div className="p-hero-ctas">
              {hero.ctaPrimary && <Link to={hero.ctaPrimary.to} className="p-btn p-btn-primary">{hero.ctaPrimary.label}</Link>}
              {hero.ctaSecondary && (
                <Link to={hero.ctaSecondary.to} className="p-btn" style={{ background: 'transparent', color: 'white', border: '1.5px solid white' }}>
                  {hero.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
          {hero.side && <div>{hero.side}</div>}
        </div>
      </section>

      <div>{children}</div>
    </PortalLayout>
  );
}

// ─────────────────────────────────────────────────────────────────
// Reusable section helpers
// ─────────────────────────────────────────────────────────────────

export function Section({ children, alt, narrow }: { children: ReactNode; alt?: boolean; narrow?: boolean }) {
  return (
    <section className="p-section" style={{ background: alt ? 'var(--p-bg-section)' : undefined }}>
      <div className="p-section-inner" style={narrow ? { maxWidth: 960 } : undefined}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center' }: { eyebrow?: string; title: string; subtitle?: string; align?: 'left' | 'center' }) {
  return (
    <div className="p-section-header" style={{ textAlign: align, margin: align === 'left' ? '0 0 32px' : undefined }}>
      {eyebrow && <div className="p-section-eyebrow">{eyebrow}</div>}
      <h2 className="p-section-title" style={{ textAlign: align }}>{title}</h2>
      {subtitle && <p className="p-section-subtitle" style={{ textAlign: align, margin: align === 'left' ? '0' : undefined }}>{subtitle}</p>}
    </div>
  );
}

export function FeatureGrid({ items, cols = 3 }: { items: { icon?: string; title: string; desc: string }[]; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}>
      {items.map(item => (
        <div key={item.title} style={{ background: 'white', border: '1px solid var(--p-border)', borderRadius: 8, padding: 28 }}>
          {item.icon && <div className="p-product-icon" style={{ marginBottom: 14 }}>{item.icon}</div>}
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{item.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function BenefitList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map(item => (
        <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: 'var(--p-text-soft)' }}>
          <span style={{ color: 'var(--p-success)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaBanner({ title, desc, primaryCta, secondaryCta, bg = 'navy' }: { title: string; desc?: string; primaryCta: { label: string; to: string }; secondaryCta?: { label: string; to: string }; bg?: 'navy' | 'red' }) {
  return (
    <section className="p-section" style={{ background: bg === 'red' ? 'var(--p-red)' : 'var(--p-navy)', color: 'white', textAlign: 'center' }}>
      <div className="p-section-inner">
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{title}</h2>
        {desc && <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 24 }}>{desc}</p>}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={primaryCta.to} style={{ background: 'white', color: 'var(--p-navy)', padding: '14px 32px', borderRadius: 4, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>{primaryCta.label}</Link>
          {secondaryCta && (
            <Link to={secondaryCta.to} style={{ background: 'transparent', color: 'white', padding: '14px 32px', borderRadius: 4, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1.5px solid white' }}>{secondaryCta.label}</Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function ComparisonTable({ tiers }: { tiers: { name: string; tagline: string; minBalance: string; color: string; perks: string[]; cta: string; ctaLink: string; featured?: boolean }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiers.length}, 1fr)`, gap: 20 }}>
      {tiers.map(t => (
        <div key={t.name} style={{
          background: 'white',
          border: t.featured ? `2px solid ${t.color}` : '1px solid var(--p-border)',
          borderRadius: 10, padding: 28, position: 'relative', transition: 'all 0.2s',
          boxShadow: t.featured ? `0 8px 24px ${t.color}33` : '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {t.featured && (
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: t.color, color: 'white', padding: '4px 14px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
              最受欢迎
            </div>
          )}
          <div style={{ width: 56, height: 56, borderRadius: 8, background: `${t.color}22`, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>★</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: t.color, marginBottom: 4 }}>{t.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--p-text-soft)', marginBottom: 14, minHeight: 36 }}>{t.tagline}</p>
          <div style={{ fontSize: 11, color: 'var(--p-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>入门资产</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--p-navy)', marginBottom: 20 }}>{t.minBalance}</div>
          <BenefitList items={t.perks} />
          <Link to={t.ctaLink} className="p-btn p-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>{t.cta}</Link>
        </div>
      ))}
    </div>
  );
}
