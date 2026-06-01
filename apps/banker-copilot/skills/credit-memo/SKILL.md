---
name: credit-memo
description: Draft a credit-committee memo (IC memo) for a BankerOS loan application. Pulls applicant financials, collateral, credit history, internal rating, and external bureau pulls from the BankerOS LOS database, then synthesizes a structured memo with risk highlights, mitigants, covenants, and a recommended decision. Use when a credit officer or relationship manager needs to prepare a loan application for committee review, when the user asks to "draft an IC memo", "write a credit memo", or "prepare {borrower} for committee".
---

# Credit Memo Drafter

## Overview

This skill produces a one-to-three-page **Credit Committee (IC) Memo** for a loan application sitting in the BankerOS Lending Service. The memo follows a standardized template aligned with internal credit policy and Basel III / IFRS 9 risk taxonomy. Output is a *draft* — the credit officer must review, edit, and present.

**Critical disclaimer:** This skill drafts memos for human review only. It does NOT approve loans, change limits, post journal entries, or modify any BankerOS record. The credit officer and committee are the decision-makers of record.

## When to invoke

Invoke when:
- A user asks for an "IC memo", "credit memo", "审贷会材料", "审批意见书" for a specific loan application
- The user references a `loanApplicationId` and asks to "summarize", "prepare", "draft"
- An RM says "write up {borrower} for committee"

Do NOT invoke when:
- The user wants to *approve* a loan (that's the human's decision)
- The user wants generic credit policy guidance (use `/credit-policy` instead)

## Data sources

Read-only access to these BankerOS resources:

| Source | Path | What to extract |
|--------|------|-----------------|
| Lending service | `GET /loans/applications/{id}` | Amount, tenor, purpose, structure, pricing |
| Customer service | `GET /customers/{cif}` | Industry, group, related parties, history |
| Onboarding KYC | `GET /onboarding/kyc/{cif}` | KYC level, sanctions screen, beneficial owners |
| Risk service | `GET /risk/credit-rating/{cif}` | Internal rating (IRB PD/LGD/EAD), IFRS 9 stage |
| GL service | `GET /gl/exposure/{cif}` | Existing group exposure, concentration |
| External bureau (mocked) | `MCP: bureau-pull {cif}` | PBoC / 央行征信, court records, tax filings |
| Financial statements | `MCP: statement-spread {cif}` | 3 yrs P&L, balance sheet, cash flow |

## Output structure

The memo MUST follow this exact section order and headings:

```
1. EXECUTIVE SUMMARY              ← 5 bullets, max
2. BORROWER OVERVIEW              ← legal entity, ownership, business
3. TRANSACTION SUMMARY            ← amount, tenor, purpose, structure
4. FINANCIAL ANALYSIS             ← 3-yr trend, key ratios, peer comparison
5. CREDIT RISK ASSESSMENT
   5.1 Internal rating + IRB params
   5.2 Industry + group concentration
   5.3 Key risks (3-5)
   5.4 Mitigants (matched to each risk)
6. COLLATERAL / SECURITY          ← LTV, valuation source, perfection
7. COVENANTS                      ← financial + behavioral
8. PRICING                        ← RAROC math, peer benchmark
9. RECOMMENDATION                 ← Approve / Conditional / Decline
10. CONDITIONS PRECEDENT          ← if conditional
11. APPENDIX
    A. KYC summary
    B. Sanctions screen result
    C. Bureau pull excerpt
    D. Financial spreads
```

## Critical rules

**Numbers must be live, not generated.** Every ratio, every exposure number, every PD/LGD/EAD must come from a BankerOS API call. If a number is unavailable, say "Data not available" — do not estimate or hallucinate.

**Tone is institutional, not promotional.** This is going to committee. No marketing language ("excellent borrower", "great opportunity"). Use measured language: "borrower demonstrates", "trend is favorable", "mitigant is partial".

**Risks before mitigants, every time.** Each risk paragraph must explicitly answer: (a) what is the risk, (b) probability/severity, (c) what specific mitigant addresses it. Generic mitigants ("strong management") are unacceptable.

**Conflicts of interest must be flagged.** If the RM is also on the credit committee, or if the borrower is a related party to a board member (check `/customers/{cif}/related-parties`), insert a CONFLICT DISCLOSURE box at the top.

## Recommendation rubric

| Internal rating | Suggested decision posture |
|-----------------|----------------------------|
| AAA — AA-       | Approve as proposed (if within limits) |
| A+ — BBB-       | Approve with standard covenants |
| BB+ — BB-       | Conditional approve with strengthened covenants and/or collateral |
| B+ and below    | Decline, or escalate to special situations |

But the human committee decides. This skill **recommends**, never **decides**.

## Style

- Length: 1-3 pages of dense text + tables
- Tables for: financial spreads, exposure summary, covenant list, pricing comparison
- Numbers: always with units (¥M, %, bps, x), always with comparison (YoY / vs peer / vs covenant)
- One-line citation under every key claim: `[source: Risk Service /risk/credit-rating/{cif}, retrieved 2026-06-01 09:42]`

## Worked example

User: `/credit-memo APP-2026-0184`

You:
1. Pull all 7 data sources above
2. Detect: applicant is 浙江华盾包装 (CIF 884109), facility is ¥50M revolving for working capital, internal rating BBB+, IFRS 9 Stage 1, no sanctions hits, 3-yr revenue CAGR +12%, leverage 2.4x EBITDA
3. Produce a 2-page memo following the structure above
4. Recommendation: "Approve with standard covenants, with the additional condition of a personal guarantee from the founder limited to 30% of exposure, given group concentration in packaging sector now reaches 18% of corporate book"
5. End with: "Prepared by Banker Copilot from BankerOS data as of 2026-06-01 09:42. Decision rests with the Credit Committee."
