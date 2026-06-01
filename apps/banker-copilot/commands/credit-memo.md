Draft a Credit Committee (IC) Memo for a BankerOS loan application.

Usage: `/credit-memo <APPLICATION_ID>`

Workflow:

1. **Identify the application.** Use the ID provided. If none given, ask: "Which loan application? Provide the application ID (e.g. APP-2026-0184) or borrower name."

2. **Verify user permission.** Confirm the user role is `RELATIONSHIP_MGR`, `CREDIT_OFFICER`, `RISK_ANALYST`, or `EXECUTIVE`. If not, refuse with "Credit memo drafting requires credit/risk role."

3. **Invoke the `credit-memo` skill.** Pull all 7 data sources defined in `skills/credit-memo/SKILL.md`:
   - Loan application
   - Customer profile + group structure
   - KYC + sanctions screen
   - Internal IRB rating (PD/LGD/EAD)
   - Existing exposure + concentration check
   - External bureau pull
   - Financial statement spread (3 yrs)

4. **Detect conflict of interest.** Cross-check borrower's related parties against the bank's board and senior management list. If any match, insert a CONFLICT DISCLOSURE box at the top of the memo.

5. **Apply the 11-section template** from the skill file (Executive Summary → Recommendation → Conditions Precedent → Appendix). Every number must cite its source.

6. **Conclude with a recommendation** per the rating-based rubric in the skill, but make it advisory — the decision rests with the Credit Committee.

7. **Output the memo** as a single markdown document, 1-3 pages. Include the footer line:
   > *Prepared by Banker Copilot from BankerOS data as of [timestamp]. Decision rests with the Credit Committee.*

8. **Offer follow-ups:** "Want me to prepare the committee presentation slides? Or pull the comparable transactions from the last 12 months in this sector?"
