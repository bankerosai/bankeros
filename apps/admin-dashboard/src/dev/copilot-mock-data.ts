/**
 * Mock data layer used by the dev Vite plugin to simulate BankerOS service
 * responses when the real microservices aren't running. Keeps the same
 * shape as the tool catalog declared in packages/mcp-bankeros so that
 * swapping the dev mock → real HTTP transport is a one-line change.
 *
 * Coverage: getCustomer, getKyc, getRiskRating, getLoanApplication, getExposure
 */

export interface MockResult {
  ok: boolean;
  result?: unknown;
  error?: string;
  status?: number;
}

// ─── Fixture data ────────────────────────────────────────────
const CUSTOMERS: Record<string, any> = {
  'CIF-884109': {
    cif: 'CIF-884109',
    legalName: '浙江华盾包装有限公司',
    legalNameEn: 'Zhejiang Huadun Packaging Co., Ltd.',
    type: 'CORPORATE',
    segment: 'SME',
    industry: '包装制造',
    industryCode: 'C2299',
    jurisdiction: 'CN',
    province: '浙江',
    city: '杭州',
    onboardedDate: '2018-04-15',
    rmName: '王明',
    rmId: 'RM-1024',
    rmTier: 'SENIOR',
    branchId: 'BR-HZ-005',
    relatedParties: [
      { cif: 'CIF-220184', name: '上海钢联材料', relationship: 'KEY_SUPPLIER' },
      { cif: 'CIF-440022', name: '深圳易达供应链', relationship: 'KEY_CUSTOMER' },
    ],
    foundedDate: '2015-08-10',
    registeredCapital: 'CNY 50,000,000',
    employees: 320,
    annualRevenueLatest: 'CNY 480,000,000',
    annualRevenueGrowth3y: '+12.4%',
    netProfitMarginLatest: '8.2%',
  },
  'CIF-220184': {
    cif: 'CIF-220184',
    legalName: '上海钢联材料股份有限公司',
    type: 'CORPORATE',
    segment: 'CORPORATE',
    industry: '钢材贸易',
    jurisdiction: 'CN',
    city: '上海',
    onboardedDate: '2014-06-20',
    rmName: '李静',
    rmTier: 'EXEC',
    relatedParties: [],
  },
  'CIF-330042': {
    cif: 'CIF-330042',
    legalName: '招商局港口控股有限公司',
    type: 'CORPORATE',
    segment: 'GROUP',
    industry: '港口物流',
    jurisdiction: 'HK',
    city: '香港',
    onboardedDate: '2011-01-15',
    rmName: '陈晓东',
    rmTier: 'GROUP_COVERAGE',
    relatedParties: [{ cif: 'CIF-330042-SH', name: '上海招港物流', relationship: 'SUBSIDIARY' }],
  },
};

const KYC: Record<string, any> = {
  'CIF-884109': {
    cif: 'CIF-884109',
    kycLevel: 'STANDARD',
    riskClassification: 'LOW',
    lastReviewDate: '2025-04-15',
    nextReviewDate: '2028-04-15',
    sanctionsScreen: { hit: false, lastScreened: '2026-05-30', lists: ['OFAC', 'UN', 'EU', 'PBoC'] },
    pepScreen: { hit: false, lastScreened: '2026-05-30' },
    adverseMedia: { findings: 0, lastScreened: '2026-05-30' },
    ubo: {
      threshold: 0.25,
      individuals: [{ name: '王志强', shareDirect: 1.0, role: 'FOUNDER_CHAIRMAN', nationality: 'CN' }],
    },
    sourceOfFunds: { declared: '制造业经营收入', verified: true, evidence: ['audited_statements_2023', 'tax_filings_2023'] },
    crsFatca: { crsStatus: 'CN_TAX_RESIDENT', fatcaStatus: 'NON_US_PERSON' },
    documents: [
      { type: 'BUSINESS_LICENSE', issuedBy: '杭州市市场监管局', expiry: '2030-08-10' },
      { type: 'ARTICLES_OF_ASSOCIATION', uploadedAt: '2018-04-15' },
      { type: 'BENEFICIAL_OWNER_DECLARATION', uploadedAt: '2025-04-15' },
    ],
  },
};

const RATINGS: Record<string, any> = {
  'CIF-884109': {
    cif: 'CIF-884109',
    internalRating: 'BBB+',
    ratingScale: 'INTERNAL_18_NOTCH',
    ratingDate: '2026-03-15',
    nextReviewDate: '2027-03-15',
    irb: { pd: 0.0084, lgd: 0.45, ead: 'CNY 42,000,000' },
    ifrs9Stage: 'STAGE_1',
    watchList: false,
    ratingHistory: [
      { date: '2023-03-15', rating: 'BB+' },
      { date: '2024-03-15', rating: 'BBB-' },
      { date: '2025-03-15', rating: 'BBB' },
      { date: '2026-03-15', rating: 'BBB+' },
    ],
    keyDrivers: [
      'Revenue CAGR 12.4% over 3 years',
      'Leverage 2.4x EBITDA (sector median 2.8x)',
      'Top-3 customer concentration declining',
    ],
  },
};

const LOAN_APPLICATIONS: Record<string, any> = {
  'APP-2026-0184': {
    applicationId: 'APP-2026-0184',
    cif: 'CIF-884109',
    borrowerName: '浙江华盾包装',
    product: 'WORKING_CAPITAL_REVOLVER',
    amount: 'CNY 50,000,000',
    tenor: '12M',
    purpose: '原材料采购+应收账款周转',
    pricing: { baseRate: 'LPR-5Y', spread: '+80bp', allInRate: '4.55%' },
    structure: {
      revolver: true,
      drawdownPeriod: '12M',
      repayment: 'INTEREST_QUARTERLY_PRINCIPAL_BULLET',
      collateral: 'TRADE_RECEIVABLES_FACTORING',
    },
    submittedBy: 'RM-1024 (王明)',
    submittedAt: '2026-05-28T09:42:00Z',
    state: 'CREDIT_REVIEW',
    committeeScheduledFor: '2026-06-08',
  },
  'APP-2026-0192': {
    applicationId: 'APP-2026-0192',
    cif: 'CIF-330042',
    borrowerName: '招商局港口控股',
    product: 'WORKING_CAPITAL_RENEWAL',
    amount: 'CNY 300,000,000',
    tenor: '36M',
    purpose: '集团流动资金循环续作',
    pricing: { baseRate: 'LPR-5Y', spread: '+25bp', allInRate: '4.00%' },
    state: 'CREDIT_REVIEW',
  },
};

const EXPOSURES: Record<string, any> = {
  'CIF-884109': {
    cif: 'CIF-884109',
    asOf: '2026-05-31',
    groupRollupApplied: true,
    totalOutstanding: 'CNY 42,000,000',
    totalLimit: 'CNY 80,000,000',
    utilisation: 0.525,
    byProduct: [
      { product: 'TERM_LOAN', outstanding: 'CNY 28,000,000', limit: 'CNY 50,000,000' },
      { product: 'TRADE_FINANCE', outstanding: 'CNY 14,000,000', limit: 'CNY 30,000,000' },
    ],
    industryConcentration: { industry: '包装制造', pctOfCorporateBook: 0.018 },
    groupConcentration: { groupName: '华盾系', totalGroupExposure: 'CNY 42,000,000' },
    relatedPartyExposure: 'CNY 0',
    creditRiskWeight: '100%',
    riskWeightedAssets: 'CNY 42,000,000',
  },
  'CIF-330042': {
    cif: 'CIF-330042',
    asOf: '2026-05-31',
    groupRollupApplied: true,
    totalOutstanding: 'CNY 6,200,000,000',
    totalLimit: 'CNY 8,500,000,000',
    utilisation: 0.729,
    industryConcentration: { industry: '港口物流', pctOfCorporateBook: 0.082 },
    largestExposure: true,
  },
};

// ─── Public API: execute a tool by name ──────────────────────
export function mockExecute(name: string, params: any): MockResult {
  try {
    switch (name) {
      case 'bankeros_get_customer':
        return lookup(CUSTOMERS, params.cif);
      case 'bankeros_get_kyc':
        return lookup(KYC, params.cif);
      case 'bankeros_get_risk_rating':
        return lookup(RATINGS, params.cif);
      case 'bankeros_get_loan_application':
        return lookup(LOAN_APPLICATIONS, params.applicationId);
      case 'bankeros_get_exposure':
        return lookup(EXPOSURES, params.cif);
      default:
        return { ok: false, error: `mock has no fixture for tool ${name}`, status: 501 };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e), status: 500 };
  }
}

function lookup(table: Record<string, any>, key: string | undefined): MockResult {
  if (!key) return { ok: false, error: 'missing identifier', status: 422 };
  const v = table[key];
  if (!v) {
    return {
      ok: false,
      error: `No fixture data for ${key}. Try: ${Object.keys(table).join(', ')}.`,
      status: 404,
    };
  }
  return { ok: true, result: v };
}

/** Tool catalogue exposed to the LLM. Mirrors packages/mcp-bankeros declarations
 *  but inline so the dev plugin has zero workspace coupling. */
export const MOCK_TOOLS = [
  {
    name: 'bankeros_get_customer',
    description:
      'Read a BankerOS customer (CIF) record: legal name, segment, industry, RM, related parties, basic financials.',
    parameters: {
      type: 'object',
      properties: { cif: { type: 'string', description: 'Customer Identification File, e.g. CIF-884109' } },
      required: ['cif'],
    },
  },
  {
    name: 'bankeros_get_kyc',
    description:
      "Read a customer's KYC file: risk classification, UBO chain, sanctions/PEP/adverse-media screening, source of funds, CRS/FATCA, documents.",
    parameters: {
      type: 'object',
      properties: { cif: { type: 'string' } },
      required: ['cif'],
    },
  },
  {
    name: 'bankeros_get_risk_rating',
    description:
      "Read a customer's internal credit rating: IRB parameters (PD/LGD/EAD), IFRS 9 stage, rating history, watch-list flag.",
    parameters: {
      type: 'object',
      properties: { cif: { type: 'string' } },
      required: ['cif'],
    },
  },
  {
    name: 'bankeros_get_loan_application',
    description:
      'Read a loan application by ID. Returns amount, tenor, purpose, structure, pricing, state, committee schedule.',
    parameters: {
      type: 'object',
      properties: { applicationId: { type: 'string', description: 'e.g. APP-2026-0184' } },
      required: ['applicationId'],
    },
  },
  {
    name: 'bankeros_get_exposure',
    description:
      "Read a customer's credit exposure with group rollup: total outstanding/limit by product, industry & group concentration, RWA.",
    parameters: {
      type: 'object',
      properties: {
        cif: { type: 'string' },
        includeGroup: { type: 'boolean', default: true },
      },
      required: ['cif'],
    },
  },
];
