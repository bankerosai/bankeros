---
name: npl-explain
description: Explain a movement in BankerOS non-performing loan (NPL) numbers — at portfolio, industry, branch, or single-borrower level. Decomposes the change into vintage, industry concentration, migration matrix, large-name effects, and provisioning impact under IFRS 9 staging. Use when a CRO, risk analyst, or board member asks "why did NPL move", "what's driving the increase in {sector}", "explain {borrower}'s migration to Stage 3", or "decompose the NPL change month-over-month".
---

# NPL Movement Explainer

## Overview

NPL numbers move for many reasons: new defaults, recoveries, migrations between IFRS 9 stages, write-offs, sales of impaired loans, FX translation. Without decomposition, the CRO can't tell whether a 5bp uptick is noise or the start of a trend. This skill produces a **NPL bridge** that explains the movement in plain language with numbers traceable to BankerOS.

**Scope:** read-only analysis. This skill does not change ratings, post provisions, or move loans between stages.

## When to invoke

- "Why did NPL go from 1.58% to 1.61%?"
- "Decompose the increase in real-estate NPL"
- "What happened to {borrower} this month?"
- "Show me the IFRS 9 stage migration matrix"
- "NPL bridge for {branch} Q2"

## Data sources

| Source | Path |
|--------|------|
| Loan book | `GET /risk/credit/portfolio?asOf={date}&groupBy={dim}` |
| Stage migrations | `GET /risk/ifrs9/migrations?from={date}&to={date}` |
| Write-offs | `GET /gl/writeoffs?period={range}` |
| Recoveries | `GET /gl/recoveries?period={range}` |
| Single name detail | `GET /risk/credit-rating/{cif}/history` |
| Industry rollup | `GET /risk/credit/portfolio?groupBy=industry` |
| Branch rollup | `GET /risk/credit/portfolio?groupBy=branch` |
| FX rates | `GET /fx/rates?date={date}` (for FX translation effect) |

## NPL bridge formula

NPL ratio is `NPL outstanding / Total loans`. Movement decomposes as:

```
ΔNPL_ratio = [
  +  new defaults (Stage 1/2 → Stage 3)
  +  pre-existing Stage 3 growth (interest accrual, additional drawdowns)
  -  recoveries (Stage 3 → Stage 2/1, cash collections)
  -  write-offs (Stage 3 → off-book)
  -  NPL sales / securitizations
  ±  FX translation
  ±  denominator effect (total loans growth/shrink)
] / Total loans
```

You MUST present each component with a signed number and one-sentence narrative.

## Output structure

```
1. HEADLINE                  ← One sentence: "NPL ratio moved from X% to Y%, an increase of Δbp"
2. BRIDGE TABLE              ← The 7 components above, with ¥ amounts and bp contribution
3. STAGE MIGRATION MATRIX    ← 3x3 IFRS 9 grid (Stage 1↔2↔3) with $ amounts
4. TOP 5 DEFAULT NAMES       ← Borrowers that newly migrated to Stage 3, with one-line context each
5. INDUSTRY CONCENTRATION    ← Which sectors drove the change
6. BRANCH HOT SPOTS          ← Top 3 branches by NPL contribution
7. PROVISION IMPACT          ← ECL change in ¥, with Stage breakdown
8. OUTLOOK                   ← Forward-looking: pipeline of watch-list names that could migrate next quarter
9. APPENDIX                  ← Methodology, data freshness
```

## IFRS 9 stage definitions (use these exactly)

| Stage | Definition | ECL | NPL? |
|-------|-----------|-----|------|
| **Stage 1** | Performing, no significant increase in credit risk (SICR) since origination | 12-month ECL | No |
| **Stage 2** | Performing but SICR observed (e.g. 30+ days past due, watch-list, rating downgrade by ≥3 notches) | Lifetime ECL | No |
| **Stage 3** | Credit-impaired (90+ days past due, restructured, bankruptcy, cross-default) | Lifetime ECL on net exposure | **YES** |

NPL = Stage 3 balance. Some regulators (CBIRC) also include certain Stage 2 cases; clarify which definition is being used.

## Critical rules

**Show denominator effect separately.** If total loans grew faster than NPL, the ratio can drop even though absolute NPL rose — and vice versa. Bankers get this wrong constantly.

**Name names.** Top 5 default contributors must be specifically identified (subject to user role permissions). Do not say "a large real-estate developer" if the user has access to see who it is.

**FX matters for cross-border banks.** If USD-denominated NPL stays flat in USD but CNY weakens 3%, the CNY-reported NPL grows 3% from FX alone. Strip this out.

**Watch-list pipeline.** A good NPL analysis ends with "what next" — list the top 5-10 Stage 2 names that are within 1-2 notches of Stage 3 migration. This gives the CRO leading indicators.

## Style

- Numbers > words. Tables > paragraphs.
- Every Δ has a sign (+/-) and a unit (bp, ¥M, %).
- Charts are nice but not required; one good table beats three pie charts.
- End with one concrete recommendation: e.g. "Consider tightening underwriting in 房地产 sector — concentration at 18% of corporate book and three watch-list names representing ¥420M of exposure."

## Worked example

User: `/npl-explain --period 2026-05-vs-2026-04 --segment corporate`

You:
1. Pull `/risk/credit/portfolio?asOf=2026-04-30&groupBy=industry,branch`
2. Pull same for 2026-05-31
3. Pull stage migrations between the two dates
4. Compute the bridge: corporate NPL ratio moved 1.78% → 1.84%, +6bp
5. Decompose:
   - New defaults: +¥124M (+8bp gross) — driven by 远洋集团 (real estate, ¥84M)
   - Recoveries: -¥18M (-1bp) — 上海某物流公司
   - Write-offs: -¥42M (-3bp) — 4 small names cleaned up
   - Denominator effect: +2bp — total corporate book grew slower than NPL
6. Stage migration matrix shows ¥204M moved S2→S3 (mostly real-estate)
7. ECL provision grew ¥38M
8. Watch-list pipeline: 3 more real-estate names at ¥320M, 2 quarters from likely migration
9. Recommendation: "Reduce new real-estate underwriting by 30% for Q3. Concentration approaching the 20% policy ceiling."
