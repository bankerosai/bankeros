# Banker Copilot

> A Claude plugin that translates **BankerOS data** into the **artefacts bankers actually produce** — credit memos, KYC opinions, NPL explanations, CEO board briefs, customer 360 views, FX hedging recommendations.

Modeled on Anthropic's [`financial-services`](https://github.com/anthropics/financial-services) plugin format, but inverted: instead of giving an *external analyst* tools to research companies, this gives an *internal banker* tools to operate the bank.

---

## The relationship between three layers

```
┌─────────────────────────────────────────────────────────┐
│  Anthropic financial-services (their repo)              │  ← Analyst-facing
│  · Pitch Agent, DCF Builder, Earnings Reviewer          │     (IBD / PE / WM)
│  · Connects to S&P, Moody's, FactSet, LSEG              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Banker Copilot (this plugin)                           │  ← Banker-facing
│  · Credit Memo, KYC Review, NPL Explainer               │     (RM / Compliance /
│  · CEO Brief, Customer 360, FX Hedge Advisor            │      CRO / CEO)
│  · Connects to BankerOS internal services               │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│  BankerOS (this repo, parent project)                   │  ← Bank-of-record
│  · 17 microservices, double-entry GL, ISO 20022         │     (system of record)
│  · Personal + Business + Admin web portals              │
└─────────────────────────────────────────────────────────┘
```

---

## What's inside

### 6 Skills (`skills/<name>/SKILL.md`)

| Skill | Audience | What it does |
|-------|----------|--------------|
| **credit-memo** | RM / Credit Officer | Drafts a 1-3 page IC memo for a loan application: borrower, transaction, financials, risks, mitigants, covenants, pricing, recommendation |
| **kyc-review** | Compliance Officer | Reviews KYC file → classifies LOW/MED/HIGH/PROHIBITED, identifies EDD gaps, writes compliance opinion |
| **npl-explain** | CRO / Risk Analyst | Decomposes an NPL movement into 7 components (new defaults, recoveries, write-offs, FX, denominator…) + IFRS 9 migration matrix + watch-list pipeline |
| **ceo-brief** | CEO / Board | Compresses the 12-KPI CEO dashboard into a 1-page board briefing with 3-5 key messages |
| **customer-360** | RM / Service / CRO | Synthesizes a single customer across 8 BankerOS services into one screen, plus hand-written commentary |
| **fx-hedging-advisor** | Treasury Sales / RM | Proposes a hedging structure for a corporate client's FX exposure — instrument, sizing, scenario P&L, risk disclosures |

### 6 Slash commands (`commands/<name>.md`)

```
/credit-memo <APPLICATION_ID>
/kyc-review <CIF>
/npl-explain [--period <range>] [--segment <s>] [--dimension <d>]
/ceo-brief [--period <month>] [--audience <board|alco|earnings|regulator>]
/customer-360 <CIF>
/fx-hedge <CIF> [--horizon <range>]
```

---

## Design principles

1. **Read-only by default.** No skill changes BankerOS data. They draft artefacts for human review.
2. **Permission-gated.** Every skill checks the caller's role (`COMPLIANCE_OFFICER`, `CREDIT_OFFICER`, `CEO`, etc.). Bank data is not for everyone.
3. **Audit-quality citations.** Every number traces back to a BankerOS API call with timestamp. No invented figures.
4. **Bad news first.** When risks emerge — NPL up, concentration over limit, KYC red flag — the skill leads with them, never buries them.
5. **The human decides.** The credit committee approves loans, the compliance officer signs KYC, the CEO addresses the board. The skill drafts; the banker decides.

---

## Install (Claude Cowork)

```bash
# Add this repo as a marketplace
Settings → Plugins → Add marketplace → https://github.com/bankerosai/bankeros

# Then install the plugin
claude plugin install banker-copilot@bankerosai/bankeros
```

Or via CLI:

```bash
claude plugin install banker-copilot --source https://github.com/bankerosai/bankeros/tree/main/apps/banker-copilot
```

---

## Try it (without BankerOS running)

Each skill includes a **worked example** at the bottom of its `SKILL.md`. You can read these standalone to understand what the output looks like, even without the live BankerOS APIs.

For live connection, the skills expect the BankerOS API Gateway running at `http://localhost:3000` (see [parent README](../../README.md)). When BankerOS is up, the skills resolve real CIFs, loan IDs, and dashboard data.

---

## Directory layout

```
banker-copilot/
├── .claude-plugin/
│   └── plugin.json              ← manifest (name, version, author)
├── commands/                    ← slash commands (workflow prompts)
│   ├── credit-memo.md
│   ├── kyc-review.md
│   ├── npl-explain.md
│   ├── ceo-brief.md
│   ├── customer-360.md
│   └── fx-hedge.md
├── skills/                      ← skills (YAML frontmatter + markdown)
│   ├── credit-memo/SKILL.md
│   ├── kyc-review/SKILL.md
│   ├── npl-explain/SKILL.md
│   ├── ceo-brief/SKILL.md
│   ├── customer-360/SKILL.md
│   └── fx-hedging-advisor/SKILL.md
└── README.md (this file)
```

---

## License

Apache 2.0 — same as BankerOS parent project.

## Acknowledgements

Format inspired by Anthropic's [`anthropics/financial-services`](https://github.com/anthropics/financial-services). We adopted the `.claude-plugin/plugin.json` manifest format, the `commands/` + `skills/<name>/SKILL.md` directory layout, and the YAML frontmatter convention. The skills themselves are original work targeting bank-internal use cases (not external analyst use cases).
