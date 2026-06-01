Assemble a complete customer view across all BankerOS services in 60 seconds.

Usage: `/customer-360 <CIF>` — or `/customer-360 <name>` and you'll resolve to a CIF.

Workflow:

1. **Identify the customer.** Resolve name → CIF if needed. If multiple matches, prompt with disambiguation list.

2. **Permission gate.** Allow `RELATIONSHIP_MGR`, `EXECUTIVE`, `CRO`, `COMPLIANCE_OFFICER`, `SERVICE_DESK` (for complaints). Block others.

3. **Workflow context.** Ask if not obvious:
   - "Pre-meeting briefing" (default — RM about to call client)
   - "Complaint investigation" (open active complaint, focus on service history)
   - "Strategic review" (executive wants overview of a top-N account)
   - "Risk investigation" (CRO investigating a name)

4. **Invoke the `customer-360` skill** to pull all 8 data domains (KYC, accounts, deposits, cards, loans, wealth, FX, trade, payments, risk, engagement, complaints, profitability).

5. **Render the SNAPSHOT box** at the top — dense, every line is "label: value", under 150 words.

6. **Render Sections 1-5 as tables** — wallet / trajectory / profitability / risk / engagement.

7. **Hand-write Section 6: COMMENTARY.** This is where you earn your keep:
   - What changed in the last 30 days that matters?
   - Concentration / dependency risks?
   - Cross-sell opportunities (specific products)?
   - Suggested next action for the RM?

8. **Restrict AML alerts.** Only show "Open AML alerts" if user role is `COMPLIANCE_OFFICER`. For others: "Not authorized to view AML alerts."

9. **Annotate chart anomalies.** Big dips or spikes in balance/utilization need a one-line explanation. If you can't explain it, label as "Movement unexplained — RM action: investigate".

10. **Footer:**
    > *Prepared by Banker Copilot from BankerOS data as of [timestamp]. RM: {name}. Skill version: customer-360 v0.1.0.*

11. **Follow-up offer:** Based on the commentary, suggest one of:
    - "/credit-memo {cif}" if you spotted a likely credit request
    - "/fx-hedge {cif}" if you spotted FX exposure
    - "/kyc-review {cif}" if KYC is due for refresh
