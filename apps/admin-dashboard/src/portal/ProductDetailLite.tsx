/**
 * Data-driven product detail page.
 * Pass a config object and get a full HSBC-style product detail page.
 */

import { ReactNode } from 'react';
import ProductDetailPage, {
  DetailSectionEl as Sect, UseCaseGrid, ProcessFlow, CaseStudy, FaqAccordion, PricingTable,
} from './ProductDetailPage';

export interface ProductConfig {
  // Breadcrumb
  breadcrumbs: { label: string; to?: string }[];

  // Hero
  category: string;
  productName: string;
  tagline: string;
  badge?: string;
  bullets: string[];
  background?: 'navy' | 'gradient' | 'gold' | 'red' | 'black';
  ctaPrimary?: { label: string; to: string };
  ctaSecondary?: { label: string; to: string };
  visual?: ReactNode;

  // Sections
  overview: { description: string; benchmark?: string; params: Array<[string, string]> };
  features: Array<{ icon: string; title: string; desc: string }>;
  useCases: Array<{ persona: string; icon: string; scenario: string; benefit: string; example?: string }>;
  process?: Array<{ step: string; title: string; desc: string; actor?: string }>;
  caseStudy: {
    company: string; logo: string; industry: string;
    challenge: string; solution: string;
    results: Array<{ metric: string; value: string }>;
    quote?: string; quoteAuthor?: string;
  };
  fees?: Array<{ item: string; amount: string; note?: string }>;
  faq?: Array<{ q: string; a: string }>;

  // CTA
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: { label: string; to: string };
}

export default function ProductDetailLite(cfg: ProductConfig) {
  return (
    <ProductDetailPage
      breadcrumbs={cfg.breadcrumbs}
      sections={[
        { id: 'overview', label: '产品概述' },
        { id: 'features', label: '核心特性' },
        { id: 'usecases', label: '适用场景' },
        ...(cfg.process ? [{ id: 'process', label: '业务流程' }] : []),
        { id: 'case',     label: '客户案例' },
        ...(cfg.fees ? [{ id: 'fees', label: '费率说明' }] : []),
        ...(cfg.faq  ? [{ id: 'faq',  label: '常见问题' }] : []),
      ]}
      hero={{
        badge: cfg.badge,
        category: cfg.category,
        productName: cfg.productName,
        tagline: cfg.tagline,
        bullets: cfg.bullets,
        background: cfg.background ?? 'navy',
        ctaPrimary: cfg.ctaPrimary,
        ctaSecondary: cfg.ctaSecondary,
        visual: cfg.visual,
      }}>

      <Sect id="overview" eyebrow="Overview" title={`什么是${cfg.productName}?`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
          <div>
            <p style={{ fontSize: 15, color: 'var(--p-text-soft)', lineHeight: 1.8, marginBottom: 16, whiteSpace: 'pre-line' }}>{cfg.overview.description}</p>
            {cfg.overview.benchmark && (
              <div style={{ background: 'rgba(0,41,102,0.05)', borderLeft: '4px solid var(--p-navy)', padding: 16, borderRadius: 4 }}>
                <h4 style={{ fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8, fontSize: 14 }}>📊 国际对标</h4>
                <p style={{ fontSize: 13, color: 'var(--p-text-soft)', margin: 0, lineHeight: 1.6 }}>{cfg.overview.benchmark}</p>
              </div>
            )}
          </div>
          <div style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>关键参数</h4>
            {cfg.overview.params.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-border)', fontSize: 13 }}>
                <span style={{ color: 'var(--p-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--p-navy)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      <Sect id="features" alt eyebrow="Key Features" title="核心特性">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(cfg.features.length, 3)}, 1fr)`, gap: 20 }}>
          {cfg.features.map(f => (
            <div key={f.title} style={{ background: 'white', padding: 24, borderRadius: 10, border: '1px solid var(--p-border)' }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--p-navy)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--p-text-soft)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Sect>

      <Sect id="usecases" eyebrow="Who's It For" title="适用场景与人群">
        <UseCaseGrid items={cfg.useCases} />
      </Sect>

      {cfg.process && (
        <Sect id="process" alt eyebrow="How It Works" title="业务流程">
          <ProcessFlow steps={cfg.process} />
        </Sect>
      )}

      <Sect id="case" eyebrow="Customer Story" title="客户案例">
        <CaseStudy {...cfg.caseStudy} />
      </Sect>

      {cfg.fees && (
        <Sect id="fees" alt eyebrow="Pricing" title="费率说明">
          <PricingTable fees={cfg.fees} />
        </Sect>
      )}

      {cfg.faq && (
        <Sect id="faq" eyebrow="FAQ" title="常见问题">
          <FaqAccordion items={cfg.faq} />
        </Sect>
      )}

      <section className="p-section" style={{ background: 'var(--p-navy)', color: 'white', textAlign: 'center' }}>
        <div className="p-section-inner">
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{cfg.ctaTitle}</h2>
          <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 24 }}>{cfg.ctaDesc}</p>
          <a href={cfg.ctaButton.to} className="p-btn" style={{ background: '#ffba00', color: '#000', padding: '14px 36px', fontWeight: 700, fontSize: 14 }}>
            {cfg.ctaButton.label} →
          </a>
        </div>
      </section>
    </ProductDetailPage>
  );
}
