Translate the BankerOS CEO dashboard into a 1-page board-ready briefing.

Usage: `/ceo-brief [--period <month>] [--audience <board|alco|earnings|regulator>] [--ask <text>]`

Example: `/ceo-brief --period 2026-05 --audience board`

Workflow:

1. **Permission gate.** Allow `CEO`, `EXECUTIVE`, `BOARD`. Block others. CEO briefs may contain MNPI (material non-public information) before earnings.

2. **Period default.** If no period given, use the latest closed month with finalized numbers (check `/admin/ceo-dashboard?status=finalized`).

3. **Audience default.** If not specified, ask: "Is this for the board, ALCO, an earnings rehearsal, or a regulator meeting?" Different audiences need different tone.

4. **Invoke the `ceo-brief` skill** to pull the 12 traffic-light KPIs + segment drill-downs + strategic projects + risks + market context.

5. **Apply the "key messages" filter.** Keep only items that pass at least one of:
   - Magnitude > 50bp / 5% of plan
   - Direction surprise vs guidance
   - Forward strategic implication
   - Regulator interest
   - Peer benchmark outlier

6. **Write in CEO voice — institutional, sober, specific.** Active voice. Numbers with units and comparisons. Plain language for technical terms (LCR → spell out at first mention).

7. **Lead with bad news if any.** Boards punish CEOs who bury concerns. If NPL is up, real-estate is in trouble, or CET1 ratio is approaching a threshold — that's the headline.

8. **Output structure:**
    - Headline (one sentence)
    - 3-5 Key Messages
    - Performance (revenue, profit, ROE, CIR)
    - Balance Sheet (deposits, loans, asset quality, capital, liquidity)
    - Strategic Progress (top 3 initiatives, traffic-light status)
    - Risks on the Horizon (2-3 forward-looking concerns)
    - Ask (only if board decision needed today)
    - Appendix (definitions for technical terms)

9. **Forward-looking statements need disclaimers.** "We expect X subject to market conditions and execution risk."

10. **Footer:**
    > *Prepared by Banker Copilot from BankerOS data as of [timestamp]. All figures unaudited and may be revised at month-end close.*

11. **Follow-up offer:** "Want me to prepare the speaker notes for slides? Or model the next quarter under {scenario}?"
