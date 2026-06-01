---
name: kyc-review
description: Review a BankerOS customer's KYC file and produce a compliance opinion. Pulls identity documents, beneficial ownership chain, sanctions/PEP screening hits, transaction patterns, source-of-funds evidence, and any prior STR/SAR filings, then writes a structured KYC review with risk classification (Low / Medium / High / Prohibited) and a list of enhanced-due-diligence (EDD) gaps to close. Use when a compliance officer needs to (a) approve a new customer past the onboarding gate, (b) conduct periodic KYC refresh, or (c) investigate a transaction monitoring alert against the customer's profile.
---

# KYC Review

## Overview

This skill produces a **KYC review memo** for a single customer (CIF) by reading the BankerOS Onboarding + Compliance services. It is used in three workflows:

1. **New customer gate** — RM has uploaded all docs, compliance must sign off before opening
2. **Periodic KYC refresh** — annual / triennial review for existing customers (PBC Order 235 / HKMA SPM AML)
3. **Alert investigation** — transaction monitoring flagged a customer, compliance needs to look at the full profile

**Critical disclaimer:** This skill writes the compliance officer's *first draft*. The compliance officer is the named decision-maker, signs the file, and is personally accountable to the regulator.

## When to invoke

- "Review KYC for {cif}"
- "审一下 {客户} 的 KYC"
- "为什么 {客户} 被风控拦截了"
- "Periodic refresh due for {cif}"
- "Beneficial ownership of {entity}"

## Data sources

| Source | Path |
|--------|------|
| Onboarding | `GET /onboarding/applications/{cif}` |
| KYC docs | `GET /onboarding/kyc/{cif}/documents` |
| Beneficial owners | `GET /onboarding/kyc/{cif}/ubo-chain` |
| Sanctions / PEP | `GET /compliance/screening/{cif}` (OFAC / UN / EU / HMT / domestic) |
| Adverse media | `GET /compliance/adverse-media/{cif}` |
| Source of funds | `GET /onboarding/kyc/{cif}/sof` |
| Transaction patterns | `GET /payments/aggregates/{cif}?period=90d` |
| STR / SAR history | `GET /compliance/str/{cif}` (read-only — never list to non-compliance roles) |
| Risk rating | `GET /risk/customer-risk/{cif}` |

## Risk taxonomy

You must classify the customer into exactly one of:

| Class | Rule | Example |
|-------|------|---------|
| **PROHIBITED** | Hit on UN / OFAC / EU consolidated sanctions, OR resident in a fully sanctioned jurisdiction (Iran/North Korea/Crimea/Syria) | Bank must refuse / exit |
| **HIGH** | PEP, high-risk jurisdiction with permitted business, complex offshore structure, cash-intensive business, correspondent banking, virtual asset service provider | EDD required, senior management approval, annual review |
| **MEDIUM** | Cross-border, non-resident, opaque ownership > 2 layers, high-value private banking | Standard EDD, annual review |
| **LOW** | Resident retail customer, domestic SME, transparent ownership, simple business | CDD baseline, triennial review |

## Output structure

```
1. CUSTOMER SNAPSHOT          ← Name, CIF, segment, jurisdiction, onboarded date
2. RISK CLASSIFICATION        ← One of Low/Medium/High/Prohibited + reasoning
3. IDENTIFICATION
   3.1 Identity documents      ← passport/ID, expiry, verification status
   3.2 Address verification    ← utility bill / lease / etc.
   3.3 Tax residency (CRS / FATCA)
4. BENEFICIAL OWNERSHIP
   4.1 UBO chain (≥25% threshold per FATF)
   4.2 Control persons
   4.3 Group structure diagram (text representation)
5. SCREENING RESULTS
   5.1 Sanctions (per list: OFAC, UN, EU, HMT, MoFCom, local)
   5.2 PEP (self + family + close associates)
   5.3 Adverse media (last 24 months)
6. SOURCE OF FUNDS / WEALTH
   6.1 Stated source
   6.2 Evidence collected
   6.3 Plausibility assessment
7. TRANSACTION PROFILE
   7.1 Declared business activity
   7.2 Actual 90-day pattern (volume, geography, counterparties)
   7.3 Discrepancies (red flags)
8. EDD GAPS                    ← What's still needed for full compliance
9. COMPLIANCE OPINION          ← Approve / Conditional / Decline / Exit
10. CONDITIONS                  ← if Conditional
11. NEXT REVIEW DATE
12. APPENDIX
    A. Document hashes (chain of custody)
    B. Screening run log
    C. Internal queries answered
```

## Critical rules

**Never disclose STR/SAR existence to anyone outside compliance.** If the user role is not `COMPLIANCE_OFFICER` (check headers passed by API Gateway), the section "STR / SAR history" must read "Not authorized to view". Tipping off is a criminal offense under most AML regimes.

**Sanctions are binary.** A confirmed match on a primary sanctions list (OFAC SDN, UN consolidated, EU) → PROHIBITED, no discretion. Document the screening run timestamp + list version. False-positive resolution requires explicit comment with reasoning.

**UBO threshold default is 25%** but adjust to local rule:
- China PBC Order 235: 25% direct or indirect, OR control by other means
- HK AMLO: 25%
- US FinCEN CDD rule: 25% AND one control person
- UK 4MLD: 25%

**Source-of-funds plausibility test.** State the customer's claimed annual income/wealth and compare against the inflows you observe in `/payments/aggregates`. If inflows materially exceed claim (e.g. 3× SoW), flag as a HIGH risk red flag.

## Style

- Compliance officers read fast. Use bullets, not prose.
- Every claim cites a document or API call.
- End with a clear recommendation + a numbered checklist of conditions.
- No marketing language. No subjective judgments without evidence.

## Worked example

User: `/kyc-review CIF-884109` (compliance officer role)

You:
1. Pull all 9 sources above
2. Detect: customer is 浙江华盾包装, mainland China resident corporate, UBO chain 1 layer (founder 王志强 100%), no sanctions hits, no PEP, no adverse media, declared SoF "manufacturing revenue", 90-day inflows match declared revenue band
3. Classify: LOW
4. Identify gaps: tax residency certificate missing
5. Recommend: "Approve subject to provision of tax residency certificate (CRS Form). Next review: 2029-06-01 (triennial)."
