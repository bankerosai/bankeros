---
name: fx-hedging-advisor
description: Given a BankerOS corporate client's FX exposure, recommend a hedging structure. Pulls the client's open FX positions, forecasted receipts/payments by currency and timing, current hedge book (forwards, options, swaps), and against current market (spot, forward points, vol surface) produces a sized hedging recommendation — instrument, tenor, strike/forward, expected MTM impact, and a one-page rationale for the corporate treasurer. Use when a treasury sales RM is preparing a client call, when a client requests hedging advice, when budgeted FX rates are at risk, or when board has set a new hedge ratio policy.
---

# FX Hedging Advisor

## Overview

Corporate clients (importers, exporters, multinationals with subsidiaries) carry FX exposure that can wreck their P&L. Hedging this exposure is one of the highest-margin services a corporate bank provides. But proposing a good hedge requires reconciling: (1) the client's exposure timeline, (2) their hedging policy and budget rate, (3) current market pricing, (4) their tolerance for upfront premium vs forgone upside.

This skill produces a **hedging proposal** — what to do, in what size, with what instrument, and why.

**Critical:** This skill recommends. It does not execute trades, lock prices, or commit capital. The trade is booked only after the client signs and the treasury desk executes.

## When to invoke

- "Build a hedge proposal for {client}"
- "{Client} has USD receivables in Q3 — what should we recommend?"
- "Hedge ratio for {client} is below policy — what to do?"
- "FX risk review for {strategic account}"
- "Prepare client call material on hedging"

## Data sources

### From BankerOS

| Source | Path |
|--------|------|
| Client exposure | `GET /trade-finance/exposure/{cif}?currency={c}` (LC, AR, AP timeline) |
| Existing hedges | `GET /treasury/hedges/{cif}` (forwards, options, swaps, MTM) |
| Cash flow forecast | `GET /finance/forecast/{cif}?horizon=12m` (client-provided or AI-projected) |
| Customer profile | `GET /customers/{cif}` (industry, hedging policy, budget rate) |
| Credit limits | `GET /risk/limits/{cif}?product=FX-DERIV` |

### From market data

| Source | Path |
|--------|------|
| Spot rates | `GET /fx/rates?pair={p}&type=spot` |
| Forward points | `GET /fx/forwards?pair={p}&tenor={t}` |
| Vol surface | `GET /fx/vols?pair={p}` (for options pricing) |
| Yield curves | `MCP: market-data --rates --curve {ccy}` |
| Historical volatility | `MCP: market-data --hist-vol {pair} --window 90d` |

## Hedging instrument selection

Match the instrument to the client's need:

| Need | Instrument | When |
|------|-----------|------|
| Lock a known future cash flow | **Forward** | Certain amount + certain date |
| Lock a probable cash flow with downside protection | **Vanilla Option** (Call/Put) | Probability < 100% or client wants upside |
| Reduce cost vs vanilla option | **Risk Reversal** (collar) | Willing to cap both upside and downside |
| Reduce cost further | **Knock-in / Knock-out** | Client comfortable with conditional triggers — disclose KI/KO risk loudly |
| Long-term structural hedge | **CCS** (Cross-Currency Swap) | Multi-year asset/liability mismatch |
| Periodic FX flows | **Forward Strip** | Monthly/quarterly recurring exposure |
| Non-deliverable currency | **NDF** | CNH/INR/KRW/BRL etc. with capital controls |

## Output structure

```
1. CLIENT SITUATION                  ← 1 paragraph: industry, FX flows, policy
2. EXPOSURE MAP                      ← Table: by currency × tenor × notional × certainty
3. CURRENT HEDGE BOOK                ← What's already in place, MTM, expiries
4. HEDGE RATIO ANALYSIS              ← Hedged % vs policy minimum
5. MARKET CONTEXT                    ← Spot, forwards, vols, our house view
6. PROPOSED HEDGES (1-3 options)
   For each:
   6.X.1 Structure                    ← Instrument, notional, tenor
   6.X.2 Pricing                      ← Strike/forward, premium
   6.X.3 Scenario analysis            ← P&L at -10% / -5% / 0 / +5% / +10%
   6.X.4 Pros / Cons
   6.X.5 Credit limit usage
7. RECOMMENDATION                    ← One pick, with reasoning
8. NEXT STEPS                        ← For client + for treasury desk
9. APPENDIX                          ← Termsheet draft, risk disclosures
```

## Critical rules

**Net the exposure first.** A client with USD AR of 10M and USD AP of 4M has net 6M to hedge, not 14M. Always present gross AND net.

**Hedge ratio = (notional hedged) / (net exposure).** Policy is typically 50-80% — never hedge 100% of a forecast (forecast is uncertain).

**Show MTM impact, not just notional.** A 1% move on a USD 10M forward = ¥720K P&L impact. Treasurers think in P&L, not notional.

**Disclose all risks. Especially exotic risks.**
- For knock-out: state explicitly that the hedge can disappear at the worst possible moment
- For knock-in: state explicitly that the client could be obligated to transact at an unfavorable rate
- For CCS: state currency basis risk and funding cost basis
- For NDF: state non-deliverability and fix mechanism

**Credit limit must be checked first.** A FX derivative consumes PFE (Potential Future Exposure) limit, not just spot limit. If limit is insufficient, propose a structure that fits OR an inquiry to credit.

**Suitability and ISDA documentation.** Confirm the client has signed ISDA Master + CSA. If not, route via the Treasury sales lead.

**No proprietary trading suggestions.** This skill helps the client. Do NOT suggest structures designed to maximize bank P&L at client expense. The Treasury sales desk is held to suitability + best-execution standards.

## Style

- The treasurer is busy and skeptical. Open with the recommendation, justify it second.
- Tables with notional + tenor + price are mandatory.
- Scenario table (5 columns: -10%, -5%, base, +5%, +10%) for every proposed structure.
- Plain language for "the Greeks" — say "delta hedge" only after explaining what delta means in this trade.

## Worked example

User: `/fx-hedge CIF-884109 --horizon Q3-Q4`

You analyze:
1. Client is 浙江华盾包装, exports packaging to US/EU
2. Expected USD receipts: $4M Aug, $4M Oct, $3M Dec (90% probability per client forecast)
3. Existing hedges: USD 3M forward at 7.20 maturing Aug
4. Hedge ratio: 3M / 11M = 27% (policy minimum is 50%)
5. Market: spot 7.1835, 3M fwd 7.1685, 6M fwd 7.1542, 3M ATM vol 5.2%

Output (abbreviated):

> **Recommendation:** Layer two forwards to bring hedge ratio to 60%:
> - Sell USD 2M Forward, tenor 2M (Oct settlement), rate 7.1750
> - Sell USD 2M Forward, tenor 4M (Dec settlement), rate 7.1620
>
> **Why:** Client's policy floor is 50%. Adding USD 4M of forward gets to 64%. We avoid options because (a) client has stable receipts (no need for optionality), (b) options premium would cost ~70bp of notional versus the forward strategy which is zero-cost. We leave the next $4M unhedged to retain upside should USD strengthen further toward 7.30.
>
> **Sensitivity:** If USD/CNY ends Q4 at 7.00, hedged portion saves the client ¥640K vs being unhedged. If USD/CNY ends at 7.30, hedged portion forgoes ¥120K of upside vs unhedged. Net of the existing hedge book, the proposed structure has carry-positive P&L in 4 of 5 scenarios.
>
> **Credit:** PFE of USD 1.8M consumed; client has USD 4M derivative limit available.
>
> **Next step:** Client treasurer to confirm execution. Treasury desk to draft termsheet (template attached). Settlement: T+2.

---

End every output with:
> *Prepared by Banker Copilot. Indicative pricing only. Actual execution at then-prevailing market levels. Suitability assessment required prior to execution.*
