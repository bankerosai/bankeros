# BankerOS Design System
**Version 2.0** · "Editorial Banking" — *trusted · luxurious · effortless*

> A design language for a digital bank that quietly outperforms HSBC, Citi, CMB, and ICBC — built for users who expect Apple-level polish on top of bank-grade trust.

---

## 0 · Philosophy

> **"A great bank's UI feels like a fine watch: every detail rewards inspection, nothing is loud, everything is exact."**

Five non-negotiable principles, in order of priority:

1. **Trust before delight** — every visual decision must reinforce safety. Money is at stake.
2. **Editorial calm** — generous whitespace, refined typography, never crowded. Pages should breathe.
3. **Earned color** — color is a signal, not decoration. A red number means *take action*.
4. **One canonical answer** — never two ways to do the same thing. One button shape, one card shape, one tone.
5. **Motion serves meaning** — animations explain causality (where did this come from? where did it go?). Never decorate.

### Anti-patterns we reject

| ❌ Don't | ✅ Do |
|---------|------|
| Skeumorphic credit card art everywhere | Restrained card art on dedicated card pages |
| Festival emojis and confetti | Quiet success states with subtle motion |
| Long gradient buttons | One solid primary, one ghost secondary |
| 8 shades of gray | A 6-step neutral ramp, used systematically |
| "Engagement" bait (red dots everywhere) | Earned notifications, dot only when real |

---

## 1 · Brand Foundation

### 1.1 Voice & tone

- **Statement, not exclamation.** "Your transfer succeeded." not "Transfer Successful! 🎉"
- **Precise numbers.** "¥128,420.50" not "about 128k". Always show currency symbol + locale formatting.
- **Plain Chinese / English.** Avoid 金融术语 unless the user role expects them (corp treasurer ≠ retail user).
- **Respect attention.** A modal interrupts; use a toast instead unless the action is destructive.

### 1.2 Logotype

```
B + "BankerOS"     ← stacked: monogram (gradient navy→red) + wordmark
```

- **Monogram**: 32×32, `linear-gradient(135deg, var(--accent-blue), var(--accent-purple))`, radius 8.
- **Wordmark**: 16/700 Inter, color `var(--text-primary)`.
- Pair with a 10/600 ALL-CAPS eyebrow (`PERSONAL ONLINE BANKING` / `HSBCnet`).

---

## 2 · Color System

### 2.1 The three palettes

We maintain **three independent palettes**, scoped by root class:

| Scope | Class | Use |
|-------|-------|-----|
| Admin (bank staff) | `:root[data-theme=*]` | CEO dashboards, ops. Supports light + dark. |
| Public portal (HSBC marketing) | `.portal-root` | Marketing site, product pages. Light only. |
| Online banking (logged-in customer) | `.banking-root` | Personal + Business banking. Light only (v2). |

### 2.2 Neutrals — the workhorse

Every page is 90% neutral. We use a **6-step ramp** (no more, no less):

```
ink     #0f172a  ← headings, primary text
slate   #334155  ← body
muted   #64748b  ← labels, captions
line    #e2e8f0  ← borders, dividers
canvas  #f7f9fc  ← page background (light)
paper   #ffffff  ← card surface
```

Dark theme inverts via CSS variables — never hard-coded.

### 2.3 Accent — the signals

| Token | Hex | Meaning | Where |
|-------|-----|---------|-------|
| `--accent-blue` | `#2563eb` | Primary action, links, info | Admin only |
| `--brand-red` | `#db0011` | Banking primary (HSBC red) | Banking only |
| `--brand-navy` | `#002966` | Banking secondary | Banking only |
| `--brand-gold` | `#ffba00` | Premier accent | Banking premier |
| `--ok` | `#16a34a` | Money in, success | All |
| `--warn` | `#d97706` | Caution, pending | All |
| `--danger` | `#dc2626` | Money out, error, NPL | All |
| `--violet` | `#9333ea` | Wealth / Premier | Banking wealth |
| `--cyan` | `#06b6d4` | Transaction banking | Banking biz |

**Rule:** Accent colors are **never** used for decoration. If a number is red, the user must act on it. If a card has a colored top bar, the color *means* a category.

### 2.4 Tier-specific palettes

Each customer tier gets a single gradient identity used only on tier hero cards:

```css
Standard   linear-gradient(135deg, #475569, #1e293b)
Premier    linear-gradient(135deg, #9333ea, #6b21a8)
Jade       linear-gradient(135deg, #16a34a, #064e3b)
Private    linear-gradient(135deg, #1e1b4b, #c026d3)   /* "midnight luxury" */
Corporate  linear-gradient(135deg, #002966, #1e3a8a)
```

---

## 3 · Typography

### 3.1 Type stack

```
font-family:
  'Inter', 'HSBC Sans', -apple-system, BlinkMacSystemFont,
  'Segoe UI', 'PingFang SC', 'Helvetica Neue', sans-serif;

font-feature-settings: 'tnum' 1, 'cv11' 1, 'ss01' 1;   /* tabular numerals always */
```

- **Tabular numerals** are mandatory on every money display so digits align in columns.
- Chinese fallback: PingFang SC (macOS/iOS) → Microsoft YaHei (Windows) → Source Han Sans (web font).

### 3.2 Scale

A **modular scale of 1.25** (major third) — 7 sizes, nothing in between:

| Token | px | Use |
|-------|----|----|
| `--text-display` | 32 / 800 | Hero headline (page-level) |
| `--text-h1` | 24 / 700 | Section title |
| `--text-h2` | 18 / 700 | Card title |
| `--text-body` | 14 / 400 | Default body |
| `--text-sm` | 12 / 500 | Captions, secondary |
| `--text-xs` | 11 / 600 | Eyebrow, badges |
| `--text-money-xl` | 28 / 700 | Hero KPI numbers (tabular) |

Line-heights: 1.2 for display/headings, 1.5 for body. Letter-spacing `-0.01em` for ≥18px, `+0.08em` for eyebrow/badges.

---

## 4 · Spacing & Layout

### 4.1 4-pt grid

All spacing is a multiple of 4px. Use semantic tokens — never hard-code px:

```
--space-1  4px      --space-5  20px
--space-2  8px      --space-6  24px
--space-3  12px     --space-8  32px
--space-4  16px     --space-12 48px
                    --space-16 64px
```

### 4.2 Layout grid

- **Page max-width**: 1440px (admin), 1280px (banking)
- **Side padding**: 32px desktop, 16px mobile
- **Card gap**: 20px between siblings, 16px inside a card
- **Section vertical rhythm**: 32px between major sections, 16px between sub-sections

### 4.3 Radius

Four sizes only:

```
--r-sm  6px    pills, badges
--r-md  10px   buttons, inputs
--r-lg  14px   cards
--r-xl  20px   hero panels, modals
```

---

## 5 · Elevation & Surfaces

We use **3 elevation levels** — not Material's 24.

| Level | Use | Shadow |
|-------|-----|--------|
| `e0` | Page bg | none |
| `e1` | Cards, inputs | `0 1px 2px rgba(15,23,42,0.04), 0 1px 1px rgba(15,23,42,0.06)` |
| `e2` | Dropdowns, popovers | `0 12px 32px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)` |
| `e3` | Modals, large cards on hover | `0 24px 60px rgba(15,23,42,0.12), 0 8px 16px rgba(15,23,42,0.06)` |

Hover lift: `e1 → e2` with `transform: translateY(-2px)`, 180ms ease.

---

## 6 · Motion

### 6.1 Durations

```
--motion-fast    120ms    hover, focus, toggles
--motion-base    200ms    most state changes
--motion-slow    320ms    panel slides, modals
--motion-page    480ms    page transitions
```

### 6.2 Easing

```
--ease-out   cubic-bezier(0.16, 1, 0.3, 1)    default — strong start, soft end
--ease-in    cubic-bezier(0.7, 0, 0.84, 0)    elements leaving
--ease-spring cubic-bezier(0.5, 1.6, 0.4, 1)  delightful confirms (use sparingly)
```

### 6.3 Patterns

- **Numbers count up** on first paint (480ms, `easeOutCubic`) for KPI values ≥ 1000.
- **Cards fade-up** in staggered 40ms intervals when a section first mounts.
- **Money in/out** uses a 200ms green/red flash on row insertion in transaction lists.
- **Loading**: never spin a generic spinner — use a 1px progress bar at the top of the page, or skeleton shapes that match the eventual content.

### 6.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7 · Components

### 7.1 Buttons

| Variant | Use | Style |
|---------|-----|-------|
| **Primary** | One per screen — the main action | Solid `var(--brand-red)`, white text, 10/600 |
| **Secondary** | Adjacent action | Ghost border `var(--line)`, ink text |
| **Tertiary** | Inline / table actions | Text only, `var(--brand-red)` |
| **Destructive** | Delete / cancel transfer | Solid `var(--danger)` |
| **Icon** | Toolbar | 32×32, ghost, radius 8 |

**Sizes:** sm 28px / md 36px / lg 44px height. Padding: 14px / 18px / 24px horizontal.

**State:** hover lifts 1px + darkens 4%, active sinks 1px, focus gets 2px `var(--accent-blue)` ring at 2px offset, disabled = 50% opacity + `cursor: not-allowed`.

### 7.2 Cards

Three card flavors, no more:

| Class | Use |
|-------|-----|
| `.card-flat` | Default — paper bg, e1 shadow |
| `.card-stat` | KPI card — top accent line (color = signal) |
| `.card-hero` | Page-top dramatic card — tier gradient, larger padding |

**Anatomy:**
```
┌─────────────────────────────────┐
│ [eyebrow]                       │  ← 11/600 uppercase, muted
│ Card title                      │  ← 14/700, ink
├─────────────────────────────────┤
│ [body content with 20px pad]    │
└─────────────────────────────────┘
```

### 7.3 Forms

- **Label above input** (top-aligned), 12/600 muted.
- **Input height** 40px, radius 10, 1px line border, focus = 2px brand ring.
- **Helper text** below in 11/400 muted; error overrides to `var(--danger)`.
- **Required** is marked by a `*` after the label, never by changing color.
- **Validation** is inline, on blur (not on every keystroke).

### 7.4 Tables (money tables)

- **All money columns right-aligned** with tabular numerals.
- **First column sticky** on scroll (long horizontal tables).
- **Zebra OFF by default** — use row-hover instead (cleaner).
- **Row height** 44px (comfort) or 36px (dense).
- **Sort indicator** is a 8px chevron after the header label.

### 7.5 Charts (Recharts)

Color order is deterministic for consistency across the app:

```
1. brand-red      2. brand-navy    3. ok-green
4. violet         5. cyan          6. gold
7. muted          8. danger
```

- **Always** show units in tooltip (`¥`, `%`, `bp`).
- **Always** include legend if > 1 series.
- **Grid lines off** for area/line charts; light dashed for bar comparisons.
- **No 3D, no donut holes < 50%.**

### 7.6 Navigation

| Pattern | Use |
|---------|-----|
| **Mega menu** | Top-level navigation with grouped descriptions (HSBC pattern). 6-column max. |
| **Sidebar** | Admin dashboards with persistent context (business line). |
| **Tab strip** | Sibling pages or sub-views within a page (≤ 6 items). |
| **Breadcrumb** | Always shown below topbar so users know where they are. |

### 7.7 Empty / Loading / Error states

| State | Pattern |
|-------|---------|
| Empty | Centered, 64px illustration + headline + one-line explainer + primary CTA |
| Loading | Skeleton shapes matching final layout, never a generic spinner |
| Error | Inline red banner above content with retry link; never an alert() |
| Offline | Sticky top yellow strip with reconnect status |

---

## 8 · Architecture & Naming

### 8.1 Page taxonomy

```
/ (portal)              public marketing
  /personal             product L1
  /personal/cards/...   product L2 detail
  /business             biz product L1
  /login

/personal/*             personal online banking (after login)
/business/*             business online banking (after login)

/admin/*                bank staff workstation
  /admin                CEO dashboard
  /admin/lines          12 business-line dashboards
  /admin/risk/*         CRO toolkit
  /admin/credit-workflow/*  Lending LOS
  /admin/hr/*           Branch & people
```

### 8.2 Component naming

```
PascalCase            React components       (e.g. CashPooling)
kebab-case            CSS classes            (.card-stat)
camelCase             JS variables           (totalCny)
SCREAMING_SNAKE       constants              (PERSONAL_MENU)
```

Class prefix discipline:
- `.b-*` — banking layout (HSBC red/navy)
- `.p-*` — public portal
- `.card-*` `.btn-*` `.text-*` — design system primitives (unprefixed)

---

## 9 · Accessibility

- **Contrast** ≥ 4.5:1 for body text, 3:1 for large text & UI components (WCAG AA).
- **Focus** is always visible — a 2px brand ring at 2px offset. Never `outline: none` without replacement.
- **Hit target** ≥ 44×44px on touch (buttons, links, icons).
- **Keyboard** — every interactive element reachable via Tab; Esc closes overlays; Enter submits forms.
- **ARIA** — use semantic HTML first (`<button>` not `<div onClick>`); add `aria-label` only where text isn't visible.
- **Money screen-reader hint**: `<span aria-label="负 1,240 元">-¥1,240</span>` so it reads as "negative" not "minus".

---

## 10 · Page Patterns

### 10.1 Banking page archetype

Every banking page follows the same 5-layer rhythm:

```
┌────────────────────────────────────────┐
│  ① Topbar (sticky)                     │  64px · mega menu
├────────────────────────────────────────┤
│  ② Breadcrumb + Quick Actions          │  48px · always present
├────────────────────────────────────────┤
│  ③ Hero (page intro)                   │  variable · gradient tier or section
├────────────────────────────────────────┤
│  ④ KPI strip (3-6 stat cards)          │  optional · 20px gap
├────────────────────────────────────────┤
│  ⑤ Body sections (forms, tables, …)    │  20px gap between · max-width 1280
└────────────────────────────────────────┘
```

### 10.2 Admin dashboard archetype

```
Sidebar (260px)  │  Topbar (60px)
                 │  Hero strip (period selector + export)
                 │  KPI grid (12 traffic lights)
                 │  10 numbered sections
                 │  Footer (data freshness, source attribution)
```

### 10.3 Money-display rules

- Whole numbers > 1,000 use locale grouping: `¥128,420.50`
- Negative amounts use prefix `-` AND `var(--danger)` color, never parens
- Currency symbol always **prefix** (¥, $, €), never suffix
- Show 2 decimals for money; 4 decimals for FX rates; 0 decimals for share counts
- Large summary numbers use suffix abbreviation: `¥8.40 万亿`, `USD 32.4 M`

---

## 11 · Tier & Segment Identity

Tier identity is the only place we use bold gradients and ornament. Every other surface stays restrained.

| Tier | Logo Color | Hero Pattern | Reserved For |
|------|-----------|--------------|--------------|
| Standard | navy `#002966` | flat | basic customers |
| Premier | violet `#9333ea` | subtle diagonal lines | AUM ¥1M+ |
| Jade | emerald `#16a34a` | jade-leaf SVG | AUM ¥5M+ |
| Private | midnight + magenta | constellation pattern | AUM ¥30M+ |
| Corporate | navy + blue | building blueprint pattern | all biz customers |

---

## 12 · Iconography

- **Source**: Phosphor Icons (regular, 16/20/24 sizes). Custom emoji is acceptable for category eyebrows.
- **Stroke**: 1.5px for 16-20px, 2px for 24+.
- **Color**: inherits text color by default; accent only when conveying status.
- **Never mix** icon sets within a page.

---

## 13 · Data Visualization

### 13.1 Chart types and when to use

| Chart | Use |
|-------|-----|
| Area | Trends over time with magnitude (revenue, balance) |
| Line | Trends over time without magnitude (rates, ratios) |
| Bar (vertical) | Comparing < 8 categories |
| Bar (horizontal) | Comparing > 8 categories or long labels |
| Pie/Donut | Composition with ≤ 6 slices, donut for big numbers in center |
| Sparkline | In-line trend in a stat card or table cell |
| Heatmap | Density (intraday FX volatility, risk concentration) |
| Funnel | Sales pipeline / conversion stages |

### 13.2 Forbidden charts

- Pie charts with > 6 slices
- 3D anything
- Dual y-axes unless absolutely necessary (and clearly labeled)
- Charts without units

### 13.3 Tooltips

```
┌──────────────────┐
│ 2026-06-08       │  ← label, 11/400 muted
│ 营业收入  ¥11.5B │  ← series name + value, 12/600 ink
│ 净利润    ¥4.6B  │
│ 预算      ¥9.4B  │
└──────────────────┘
```

White bg, 1px line border, 8px radius, 8px padding, e2 shadow.

---

## 14 · Trust Signals

Things we always show, because users need to feel safe:

| Where | What |
|-------|------|
| Topbar | Last login time + IP + device |
| Login | Bank license number, ICP record, deposit insurance logo |
| Money screens | "Real-time · 北京时间 09:42" timestamp |
| FX | Source bank for rate, freshness in seconds |
| Transfer confirm | Full recipient name + account + bank readback before submit |
| Sensitive screens | Watermark "BankerOS Confidential · {email}" |

---

## 15 · Implementation Map

| Layer | Files |
|-------|-------|
| Design tokens | `styles-design-system.css` (new) — CSS variables for everything in this doc |
| Admin styles | `styles.css` — uses tokens + theme override |
| Public portal | `styles-portal.css` — uses tokens, scoped by `.portal-root` |
| Banking shell | `BankingLayout.tsx` — mega menu, breadcrumb, quick actions, message center |
| Shared kit | `components/DashboardKit.tsx` — SignalKpi, Light, SectionTitle, ChartCard |
| Charts | Always Recharts; color array from `--chart-1..8` tokens |

---

## 16 · Quality Bar — Definition of Done

Before any page ships:

- [ ] Uses only design system tokens (no hard-coded hex, no hard-coded px)
- [ ] Renders correctly at 1280px, 1024px, 768px (graceful degradation)
- [ ] Passes WCAG AA contrast for all text + UI controls
- [ ] Every interactive element has visible focus state
- [ ] All money displays use tabular numerals + locale grouping
- [ ] Loading state shows skeleton, not spinner
- [ ] Empty state has illustration + CTA, not just text
- [ ] Light + Dark themes both work (admin)
- [ ] Animations honor `prefers-reduced-motion`
- [ ] No `alert()`, `confirm()`, or `prompt()` anywhere

---

## 17 · Versioning

| Version | Date | Highlight |
|---------|------|-----------|
| 1.0 | initial | HSBC red/navy + admin dark theme |
| **2.0** | **current** | Editorial Banking — tokenized design system, refined topbar, e1/e2/e3 elevation, motion grammar, accessibility, tier identity |

— End of `design.md` —
