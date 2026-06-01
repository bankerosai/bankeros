import { z } from 'zod';
import { BankerTool, ROLES } from '../types';
import { bankerosGet } from '../http';

export const getLoanApplication: BankerTool = {
  name: 'bankeros_get_loan_application',
  description:
    'Read a BankerOS loan application by ID. Returns amount, currency, tenor, ' +
    'purpose, structure, pricing, current state, applicant CIF. Use when you need ' +
    'to understand the basic terms of a loan facility — typically the first call ' +
    'when drafting a credit memo.',
  parameters: z.object({
    applicationId: z
      .string()
      .describe('Loan application ID, e.g. APP-2026-0184'),
  }),
  requiredRoles: [
    ROLES.RELATIONSHIP_MGR,
    ROLES.CREDIT_OFFICER,
    ROLES.RISK_ANALYST,
    ROLES.CRO,
    ROLES.EXECUTIVE,
    ROLES.AUDITOR,
    ROLES.SUPER_ADMIN,
  ],
  handler: async (p, ctx) =>
    bankerosGet(`/v1/loans/applications/${encodeURIComponent(p.applicationId)}`, ctx),
};

export const getExposure: BankerTool = {
  name: 'bankeros_get_exposure',
  description:
    "Read the total credit exposure and concentration for a customer (and " +
    "optionally for their group). Returns outstanding balances by product " +
    '(loans, lines, trade finance, derivatives PFE), industry concentration, ' +
    'and group rollup. Critical for credit-decision sizing.',
  parameters: z.object({
    cif: z.string().describe('Customer Identification File, e.g. CIF-884109'),
    includeGroup: z
      .boolean()
      .optional()
      .default(true)
      .describe('Roll up exposure across the customer’s related-party group'),
  }),
  requiredRoles: [
    ROLES.RELATIONSHIP_MGR,
    ROLES.CREDIT_OFFICER,
    ROLES.RISK_ANALYST,
    ROLES.CRO,
    ROLES.EXECUTIVE,
    ROLES.AUDITOR,
    ROLES.SUPER_ADMIN,
  ],
  handler: async (p, ctx) =>
    bankerosGet(
      `/v1/risk/exposure/${encodeURIComponent(p.cif)}?group=${p.includeGroup ?? true}`,
      ctx,
    ),
};
