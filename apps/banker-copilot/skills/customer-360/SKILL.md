---
name: customer-360
description: Synthesize a complete view of a single BankerOS customer across all services — accounts, cards, loans, wealth holdings, FX, trade finance, payments behavior, KYC status, risk rating, NPS, complaint history, RM coverage — into one screen the relationship manager can read in 60 seconds before a meeting. Use when an RM is preparing a client call, an executive is reviewing a strategic account, a service team is responding to a complaint, or a CRO is investigating a name. Replaces the painful "open 8 tabs and reconcile by hand" workflow.
---

# Customer 360 View

## Overview

BankerOS data about a customer lives in 8+ services. The RM, the CRO, the complaint handler, and the executive each want a single screen. This skill assembles the **definitive customer file** — current state, last 90 days, lifetime view — with a built-in commentary on what matters most.

**Read-only.** This skill does not change customer data, classifications, or pricing. It only assembles existing data and writes commentary.

## When to invoke

- "Pull customer 360 for {name}" / "Show me 客户360 for CIF-{x}"
- "Brief me before my call with {client}"
- "What's the latest on {strategic account}"
- "Investigate complaint #{n}"
- "Why did {client} reduce balances last month?"

## Data sources (8 services)

| Domain | Source |
|--------|--------|
| Identity & KYC | `GET /customers/{cif}` + `GET /onboarding/kyc/{cif}` |
| Accounts | `GET /accounts?cif={cif}` (multi-currency) |
| Deposits balance trend | `GET /accounts/{cif}/balance-history?days=90` |
| Cards | `GET /cards?cif={cif}` (debit + credit + spend pattern) |
| Loans | `GET /loans?cif={cif}` (active + history + arrears) |
| Wealth | `GET /wealth/holdings?cif={cif}` (AUM + NAV trend) |
| FX | `GET /fx/transactions?cif={cif}&period=90d` |
| Trade finance | `GET /trade-finance?cif={cif}` (active LC, BG, factoring) |
| Payments | `GET /payments/aggregates/{cif}?period=90d` |
| Risk | `GET /risk/customer-risk/{cif}` + `/risk/credit-rating/{cif}` |
| Engagement | `GET /crm/{cif}/interactions?period=12m` (calls, meetings, NPS) |
| Complaints | `GET /crm/{cif}/complaints?period=24m` |
| Profitability | `GET /finance/customer-pnl/{cif}?period=12m` |

## Output structure

```
┌─ SNAPSHOT (top of screen, dense) ───────────────────────────┐
│ Customer: [name + legal entity]  CIF: [id]                  │
│ Segment: [Retail/SME/Corp/Premier/Jade/Private/FI]          │
│ Onboarded: [date]   RM: [name + tier]                       │
│ Total relationship value: ¥X (deposits + loans + AUM)       │
│ Customer P&L LTM: ¥Y (net contribution)                     │
│ Risk rating: [internal] / KYC: [LOW/MED/HIGH]               │
│ NPS: [score]   Last contact: [date + channel]               │
└─────────────────────────────────────────────────────────────┘

1. WALLET (current state)
   1.1 Accounts (multi-currency, balances)
   1.2 Loans (outstanding, rate, maturity)
   1.3 Wealth holdings (AUM, asset class mix, last trade)
   1.4 Cards (limit, utilization, spend categories)
   1.5 Trade finance (active LC, BG, factoring)

2. TRAJECTORY (90-day movement)
   2.1 Deposit trend chart (with explanation of dips/spikes)
   2.2 Loan utilization trend
   2.3 AUM trend
   2.4 FX activity (volume, predominant currencies)
   2.5 Cross-border flow heatmap

3. PROFITABILITY
   3.1 Revenue breakdown (NII, fees, FX, trade, wealth)
   3.2 Cost-to-serve (RM time, ops, capital)
   3.3 LTM net contribution + 3-yr trend

4. RISK + COMPLIANCE
   4.1 Internal rating + IFRS 9 stage
   4.2 KYC status + next review date
   4.3 Open AML alerts (if any, and user has permission)
   4.4 Limit utilization

5. ENGAGEMENT
   5.1 Last 5 interactions (date, type, summary)
   5.2 NPS trend
   5.3 Active service tickets / complaints
   5.4 Cross-sell penetration (products held vs eligible)

6. COMMENTARY (the value-add)
   6.1 What changed in last 30 days that matters
   6.2 Concentration / dependency risks
   6.3 Cross-sell opportunities (specific products)
   6.4 Suggested next action

7. APPENDIX (history, screening logs, full transaction lists)
```

## The commentary section — where this earns its keep

Anyone can show a list of accounts. The value is in the **6. COMMENTARY** section, which must be hand-written each time:

- **What changed:** "Deposits dropped 18% in May, traced to a one-time ¥48M transfer to a wealth purchase. Not attrition."
- **Concentration:** "82% of relationship revenue comes from FX. If their export business slows, our P&L from this client falls fast."
- **Cross-sell:** "Client has cards and accounts but no loan facility. With LTM revenue ¥4.2M from operations, plausible for ¥20M unsecured working capital line."
- **Suggested action:** "RM should schedule a quarterly review — last meeting was 8 months ago. Suggest leading with the new structured deposit product."

## Critical rules

**Permissions matter.** If the user role is not `RELATIONSHIP_MGR`, `EXECUTIVE`, `CRO`, `COMPLIANCE_OFFICER`, refuse. Customer data is sensitive.

**AML alerts are restricted.** Only show "Open AML alerts" if user role is `COMPLIANCE_OFFICER`. Otherwise render as "Not authorized".

**Don't hallucinate trends.** If 90-day data is unavailable, say "Insufficient history" — never extrapolate from less data.

**Profitability uses FTP, not gross spread.** Net contribution = revenue - direct cost - cost of funds (FTP) - capital charge. If FTP is unavailable, label numbers as "gross" and footnote.

**Annotate the chart points.** A dip in deposits should be explained — was it a wealth purchase, a tax payment, a redemption from us to a competitor? If unknown, label as "movement unexplained — RM action: investigate".

## Style

- Snapshot box at top is < 150 words, every line is "label: value".
- Sections 1-5 are tables, not paragraphs.
- Section 6 (Commentary) is 4 short paragraphs, each with a clear "so what".
- Footer: data freshness timestamp + RM name + skill version.

## Worked example

User: `/customer-360 CIF-884109` (RM role: 王明)

You produce:

```
┌─ SNAPSHOT ────────────────────────────────────────────────────┐
│ 浙江华盾包装有限公司 (CIF-884109)                              │
│ Segment: SME (Commercial Banking)                              │
│ Onboarded: 2018-04-15 (8.1 years)                              │
│ RM: 王明 (Senior, Hangzhou Sub-branch)                         │
│ Relationship value: ¥84.2M  (Deposits ¥38M + Loans ¥42M + AUM ¥4.2M) │
│ Customer P&L LTM: ¥4.2M (3.8% of RM book contribution)         │
│ Risk: BBB+ / KYC: LOW / NPS: 9 (Promoter)                      │
│ Last contact: 2026-04-22 by phone (王明)                       │
└────────────────────────────────────────────────────────────────┘

(then sections 1-5 as tables, then commentary, then appendix)
```

Commentary section ends with:
> Suggested next action: Schedule a Q3 review meeting. Lead with: (1) renewal of the ¥50M working-capital line due in October, (2) cross-sell of supply-chain finance for the upstream supplier network (8+ confirmed suppliers visible in AP data), (3) introduction to the wealth desk now that founder's personal liquidity exceeds ¥10M.
