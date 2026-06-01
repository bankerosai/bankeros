Decompose and explain a movement in BankerOS NPL (non-performing loans).

Usage: `/npl-explain [--period <range>] [--segment <retail|sme|corporate|all>] [--dimension <industry|branch|product>]`

Example: `/npl-explain --period 2026-05-vs-2026-04 --segment corporate --dimension industry`

Workflow:

1. **Determine the scope.** If period not provided, default to "month-over-month vs prior month". If segment not provided, default to "all". If dimension not provided, default to "industry".

2. **Permission gate.** Allow `CRO`, `RISK_ANALYST`, `CREDIT_OFFICER`, `AUDITOR`, `EXECUTIVE`. Block other roles.

3. **Invoke the `npl-explain` skill.** Pull the loan book at both dates plus stage migrations + write-offs + recoveries.

4. **Build the NPL bridge** decomposing into:
   - New defaults (S1/S2 → S3)
   - Pre-existing S3 organic growth
   - Recoveries (S3 → S2/S1)
   - Write-offs (off-book)
   - NPL sales / securitizations
   - FX translation effect
   - Denominator effect (book growth/shrink)

5. **Build the IFRS 9 stage migration matrix** (3x3 grid: S1↔S2↔S3 with notional flows).

6. **Identify top 5 default contributors** by name. Each gets one line of context (industry, exposure, what triggered the migration).

7. **Industry + branch concentration** — which sectors/branches drove the change.

8. **Provision impact** — change in ECL with stage breakdown.

9. **Watch-list pipeline** — top 5-10 Stage 2 names that could migrate next quarter, with notional exposure.

10. **End with one concrete recommendation** — what underwriting / pricing / workout action should be taken.

11. **Output structure:**
    ```
    1. HEADLINE
    2. BRIDGE TABLE
    3. STAGE MIGRATION MATRIX
    4. TOP 5 DEFAULTS
    5. INDUSTRY CONCENTRATION
    6. BRANCH HOT SPOTS
    7. PROVISION IMPACT
    8. OUTLOOK (watch-list)
    9. APPENDIX (methodology + data freshness)
    ```

12. **Footer:**
    > *Prepared by Banker Copilot from BankerOS Risk Service as of [timestamp]. Figures unaudited. Methodology: IFRS 9 + CBIRC / HKMA / regulator-of-record definitions.*
