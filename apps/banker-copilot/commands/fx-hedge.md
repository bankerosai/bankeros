Produce a hedging proposal for a BankerOS corporate client's FX exposure.

Usage: `/fx-hedge <CIF> [--horizon <Q3-Q4 | next-12m | <custom-range>>]`

Example: `/fx-hedge CIF-884109 --horizon Q3-Q4`

Workflow:

1. **Permission gate.** Allow `TREASURY_SALES`, `RELATIONSHIP_MGR` (with treasury-sales endorsement), `CRO`, `EXECUTIVE`. Block others.

2. **Resolve the client.** Pull customer profile, industry, stated hedging policy, budget rate (the rate the client built their P&L plan around).

3. **Map the exposure.** Invoke the `fx-hedging-advisor` skill to assemble:
   - Forecasted cash flows by currency × tenor × probability
   - Net exposure (gross AR minus gross AP, by currency)
   - Existing hedge book + MTM
   - Available credit limit for derivatives (PFE)
   - ISDA documentation status

4. **Compute current hedge ratio** vs the client's policy minimum. State the gap explicitly.

5. **Pull current market** — spot, forwards out 12m, ATM vol, our house view on direction.

6. **Generate 1-3 proposed structures.** Match instrument to need:
   - **Forward** for certain known cash flows
   - **Vanilla option** if the cash flow is probable but not certain, OR client wants upside
   - **Risk reversal / collar** to reduce option premium cost
   - **CCS** for multi-year structural mismatch
   - **NDF** for non-deliverable pairs (CNH, INR, etc.)

7. **For each proposed structure, show:**
   - Notional + tenor + strike/forward
   - Premium / zero cost
   - Scenario table: P&L at -10%, -5%, base, +5%, +10%
   - Pros + Cons
   - Credit limit usage (PFE)

8. **Disclose all risks explicitly.** Especially:
   - Knock-out: "this hedge can disappear at the worst possible moment"
   - Knock-in: "the client may be obligated to transact at an unfavorable rate"
   - CCS: currency basis + funding cost basis
   - NDF: non-deliverability + fix mechanism

9. **Pick ONE recommendation.** Don't leave the client picking from a menu — that's our job. Justify with a 3-sentence rationale.

10. **Output structure:**
    1. Client Situation
    2. Exposure Map
    3. Current Hedge Book
    4. Hedge Ratio Analysis
    5. Market Context
    6. Proposed Hedges (1-3 options, full detail per #7 above)
    7. **RECOMMENDATION** (the chosen pick)
    8. Next Steps (for client + for treasury desk)
    9. Appendix (termsheet draft, ISDA confirmation, risk disclosures)

11. **Footer:**
    > *Prepared by Banker Copilot. Indicative pricing only — actual execution at then-prevailing market levels. Suitability assessment required prior to execution. Trade booked only after client signature and treasury desk confirmation.*
