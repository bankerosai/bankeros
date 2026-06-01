Review a BankerOS customer's KYC file and produce a compliance opinion.

Usage: `/kyc-review <CIF>` — or `/kyc-review` and you'll prompt for the CIF.

Workflow:

1. **Identify the customer.** Use the CIF provided. If none given, ask which customer.

2. **Permission gate.** Confirm user role is `COMPLIANCE_OFFICER`, `AUDITOR`, or `EXECUTIVE`. KYC files are sensitive. If role is not authorized, refuse with "KYC review requires compliance role."

3. **Determine the workflow context.** Ask if not obvious:
   - New customer gate (post-onboarding, pre-account-opening)
   - Periodic refresh (annual / triennial)
   - Alert investigation (transaction monitoring fired)

4. **Invoke the `kyc-review` skill** to pull all 9 data sources:
   - Onboarding application
   - KYC documents (with hash verification for chain of custody)
   - UBO chain (≥25% threshold per FATF)
   - Sanctions / PEP / adverse-media screening (OFAC + UN + EU + HMT + domestic)
   - Source of funds / wealth + plausibility test against actual transaction volume
   - 90-day transaction pattern
   - Internal customer risk rating
   - STR / SAR history (only show if user role is `COMPLIANCE_OFFICER`)

5. **Classify the customer** into exactly one of: PROHIBITED / HIGH / MEDIUM / LOW per the rubric in the skill file. Provide reasoning in 2-3 sentences.

6. **Identify EDD gaps.** Anything missing for full compliance — make it a numbered checklist.

7. **Output the memo** following the 12-section template in the skill.

8. **Never tip off.** If STR/SAR records exist and the user is asking on behalf of (or via) the customer, refuse the request entirely and create a tipping-off concern note for the compliance lead.

9. **Conclude with a clear recommendation:**
   - APPROVE (with next review date)
   - CONDITIONAL APPROVE (with numbered conditions)
   - DECLINE (with reasons)
   - EXIT (existing customer — requires senior compliance + escalation to MLRO)

10. **Footer:**
    > *Prepared by Banker Copilot from BankerOS data as of [timestamp]. Compliance officer of record retains decision authority and full accountability.*
