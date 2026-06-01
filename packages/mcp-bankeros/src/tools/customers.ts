import { z } from 'zod';
import { BankerTool, ROLES } from '../types';
import { bankerosGet } from '../http';

export const getCustomer: BankerTool = {
  name: 'bankeros_get_customer',
  description:
    'Read a BankerOS customer record. Returns legal name, type, segment, ' +
    "industry, jurisdiction, RM, onboarded date, and links to related " +
    'parties (parent / subsidiaries / UBOs). Use as the first lookup when ' +
    "asked about any customer or borrower.",
  parameters: z.object({
    cif: z.string().describe('Customer Identification File, e.g. CIF-884109'),
  }),
  requiredRoles: [
    ROLES.RELATIONSHIP_MGR,
    ROLES.CREDIT_OFFICER,
    ROLES.RISK_ANALYST,
    ROLES.CRO,
    ROLES.COMPLIANCE_OFFICER,
    ROLES.TREASURY_SALES,
    ROLES.EXECUTIVE,
    ROLES.AUDITOR,
    ROLES.SUPER_ADMIN,
  ],
  handler: async (p, ctx) =>
    bankerosGet(`/v1/customers/${encodeURIComponent(p.cif)}`, ctx),
};

export const getKyc: BankerTool = {
  name: 'bankeros_get_kyc',
  description:
    "Read a customer's KYC file: identification documents, beneficial-owner " +
    "chain, sanctions / PEP screening results, adverse media findings, " +
    'declared source of funds and last review date. The KYC summary may be ' +
    'restricted to compliance roles for certain customer types.',
  parameters: z.object({
    cif: z.string().describe('Customer Identification File'),
  }),
  requiredRoles: [
    ROLES.COMPLIANCE_OFFICER,
    ROLES.CREDIT_OFFICER,
    ROLES.RELATIONSHIP_MGR,
    ROLES.EXECUTIVE,
    ROLES.AUDITOR,
    ROLES.SUPER_ADMIN,
  ],
  handler: async (p, ctx) =>
    bankerosGet(`/v1/onboarding/kyc/${encodeURIComponent(p.cif)}`, ctx),
};

export const getRiskRating: BankerTool = {
  name: 'bankeros_get_risk_rating',
  description:
    "Read a customer's internal credit risk rating: IRB parameters (PD, LGD, " +
    'EAD), IFRS 9 stage (1 / 2 / 3), rating history, watch-list flags, and ' +
    'the last credit review date. Use when assessing credit quality or ' +
    'preparing decisions that depend on internal rating.',
  parameters: z.object({
    cif: z.string().describe('Customer Identification File'),
  }),
  requiredRoles: [
    ROLES.CREDIT_OFFICER,
    ROLES.RISK_ANALYST,
    ROLES.CRO,
    ROLES.RELATIONSHIP_MGR,
    ROLES.EXECUTIVE,
    ROLES.AUDITOR,
    ROLES.SUPER_ADMIN,
  ],
  handler: async (p, ctx) =>
    bankerosGet(`/v1/risk/credit-rating/${encodeURIComponent(p.cif)}`, ctx),
};
