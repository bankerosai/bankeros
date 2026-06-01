---
name: ceo-brief
description: Translate raw BankerOS CEO dashboard KPIs into a 1-page board-ready briefing in plain language. Pulls the 12 traffic-light indicators (revenue, profit, ROE, CIR, deposits, loans, NPL, CET1, LCR, customers, AML, capital adequacy), identifies what moved meaningfully, links movements to drivers (segment performance, large names, regulatory changes), and writes a CEO talking-script with the 3-5 things the board needs to hear. Use when preparing for a board meeting, ALCO meeting, monthly leadership review, regulatory dialogue, or an analyst earnings call rehearsal.
---

# CEO Briefing

## Overview

The CEO dashboard has 12 traffic lights and 30+ sub-KPIs. The board only has 30 minutes. This skill compresses the dashboard into a **1-page narrative** that a CEO can read aloud, with the right 3-5 takeaways highlighted and every claim backed by a number.

**Audience:** the CEO + Chair + non-executive directors. The tone is institutional — not pitch deck, not press release, not internal memo. Think "Bank of England Monetary Policy Report" — sober, specific, comparative.

## When to invoke

- "Brief me for tomorrow's board meeting"
- "Prepare the ALCO talking points"
- "Write the CEO message for the monthly leadership review"
- "Earnings call talking points for Q2"
- "Regulatory meeting prep — Q2 highlights for {regulator}"

## Data sources

| Source | Path |
|--------|------|
| CEO snapshot | `GET /admin/ceo-dashboard?period={p}` |
| Period comparison | `GET /admin/ceo-dashboard?compare={prior-period}` |
| Business-line drill | `GET /admin/lines/{retail,corporate,wealth,treasury,...}?period={p}` |
| Risk register | `GET /risk/dashboard?period={p}` |
| Capital ratios | `GET /risk/capital/cet1?asOf={date}` |
| Liquidity | `GET /risk/liquidity/lcr-nsfr?asOf={date}` |
| Strategic projects | `GET /admin/strategic-projects?status=active` |
| Regulatory submissions | `GET /compliance/regulatory-reports?period={p}` |
| Market context | `MCP: market-data (FX, rates, peer banks)` |

## Output structure

```
1. HEADLINE              ← One sentence the CEO can lead with
2. KEY MESSAGES (3-5)    ← Each: claim + evidence + implication
3. PERFORMANCE
   3.1 Revenue + profit (vs budget, vs prior year, vs peers)
   3.2 ROE / RoTE / NIM / Cost-to-Income
4. BALANCE SHEET HEALTH
   4.1 Deposits / loans / LDR
   4.2 Asset quality (NPL, coverage)
   4.3 Capital (CET1, leverage)
   4.4 Liquidity (LCR, NSFR, HQLA)
5. STRATEGIC PROGRESS
   5.1 Top 3 strategic initiatives — status + traffic light
   5.2 Customer growth (acquisition, attrition, NPS)
6. RISKS ON THE HORIZON  ← 2-3 forward-looking concerns
7. ASK (if any)          ← What you want from the board today
8. APPENDIX              ← One-line definitions for any technical term used
```

## The "3-5 key messages" rule

The CEO can remember 3-5 messages, not 30. Force yourself to pick. Use this filter:

1. **Magnitude** — Is the movement > 50bp or > 5% of plan?
2. **Direction surprise** — Did it move opposite to consensus / guidance?
3. **Forward implication** — Does it change a strategic decision?
4. **Regulator interest** — Will the supervisor ask about it?
5. **Peer benchmark** — Are we now an outlier (best or worst quartile)?

Anything that fails all 5 → goes into the appendix, not the talking points.

## Style rules

**Active voice, present tense.** "Net interest margin compressed 8bp to 2.18%" — not "There was an NIM compression of 8bp".

**Numbers carry units and a comparison.** Never just "revenue grew" — say "revenue grew 12% YoY (12.4% organic, 0.4% from acquisitions)".

**Plain language for technical terms.** First mention of "LCR" → spell it out as "Liquidity Coverage Ratio (a measure of 30-day stressed liquidity)". Cite the regulator's threshold.

**Quote market context.** "Net interest margin compressed 8bp, in line with the sector average of -10bp this quarter, reflecting LPR cuts." Bankers respect peer benchmarks.

**Don't bury the bad news.** If NPL is up, lead with it and explain. Boards punish CEOs who burry concerns.

## Critical safety rules

**Never invent numbers.** Every figure must trace to a BankerOS API. If the number is not available for the requested period, say "not yet finalized" — do not extrapolate.

**Forward-looking statements need disclaimers.** Anything starting with "we expect" / "we project" / "guidance" must include "subject to market conditions and execution risk" or similar.

**Insider information is sensitive.** Before earnings release, board-meeting-only material may not be shared with anyone outside the board. The system prompt user role must be `BOARD` or `CEO` or `EXECUTIVE`. Otherwise refuse.

## Style template

```markdown
# CEO Briefing — Board Meeting [Date]

> **Headline:** [one sentence]

## Key Messages

1. **[claim]**. [evidence — number + source]. [implication — 1 sentence].
2. ...
3. ...

## Performance

(prose section, max 200 words, including the 4 core ratios)

## Balance Sheet

(prose, max 150 words)

## Strategic Progress

| Initiative | Owner | Status | Next milestone |
|---|---|---|---|

## Risks on the Horizon

1. ...
2. ...

## Ask

[If you need a board decision today, state it here in 1-2 lines. Otherwise omit this section.]

---
*Prepared by Banker Copilot from BankerOS data as of [timestamp]. All figures unaudited.*
```

## Worked example

User: `/ceo-brief --period 2026-05 --audience board`

You produce:

> **Headline:** May closed with revenue 8.5% ahead of plan and ROE at 14.8%, but real-estate NPL crept up to 3.82% and now warrants tactical attention.

> ### Key Messages
>
> 1. **Earnings momentum is intact.** YTD revenue ¥847.2B, 12.4% YoY, 8.5% above plan; net profit ¥314.6B (+15.8%); cost-to-income improved 1.4pp to 48.2%.
> 2. **Capital is comfortable.** CET1 stands at 14.6% (vs 8.5% regulatory minimum + 2.5% buffer), supporting ¥186B of available buffer and an estimated ¥1.24T of additional lending capacity. No need for capital action this year.
> 3. **Real-estate is the watch-out.** Sector NPL up 24bp to 3.82%, with 远洋集团 (¥4.2B exposure, Stage 3) the main driver. Three additional Stage 2 names (¥3.2B combined) could migrate next quarter. Recommend tightening new origination policy by 30%.
> 4. **Customer growth is strong but at higher cost.** Net adds +27.0万 in May (+22% YoY), but CAC per retail customer rose 18% as digital channels saturate. New approach needed — see strategic projects.
> 5. **AI program is delivering.** GenAI rollout saved 1.84M staff-hours in May (¥36M cost equivalent) and is now used by 78% of employees. Returns are 2.4x the 2026 plan.

(plus full sections per template)

End with:
> *Prepared by Banker Copilot from BankerOS data as of 2026-06-01 09:42. All figures unaudited and subject to month-end close adjustments.*
