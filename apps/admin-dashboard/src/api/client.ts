import axios from 'axios';
import { useAuthStore } from '../store/auth';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
  },
);

// ---- Mock data for standalone demo (no backend required) ----
export const MOCK = {
  kpis: {
    totalDeposits: '2,847,391,240.00',
    totalLoans: '1,923,847,110.00',
    activeCustomers: 48_291,
    todayPayments: 12_847,
    todayPaymentVolume: '847,293,110.00',
    aum: '934,182,000.00',
    openComplianceCases: 23,
    overdueLoans: 147,
  },
  customers: [
    { id: 'c1', cifNumber: 'CIF20240001', fullName: 'Zhao Lei', email: 'zhao.lei@example.com', kycStatus: 'APPROVED', riskLevel: 'LOW', country: 'CN', createdAt: '2024-01-15' },
    { id: 'c2', cifNumber: 'CIF20240002', fullName: 'Sarah Mitchell', email: 's.mitchell@acme.com', kycStatus: 'APPROVED', riskLevel: 'MEDIUM', country: 'GB', createdAt: '2024-02-03' },
    { id: 'c3', cifNumber: 'CIF20240003', fullName: 'Ahmad Al-Rashid', email: 'a.rashid@gulf.ae', kycStatus: 'PENDING_REVIEW', riskLevel: 'HIGH', country: 'AE', createdAt: '2024-03-21' },
    { id: 'c4', cifNumber: 'CIF20240004', fullName: 'Priya Sharma', email: 'priya@infra.in', kycStatus: 'APPROVED', riskLevel: 'LOW', country: 'IN', createdAt: '2024-04-10' },
    { id: 'c5', cifNumber: 'CIF20240005', fullName: 'Carlos Mendoza', email: 'cmendoza@lat.co', kycStatus: 'REJECTED', riskLevel: 'HIGH', country: 'MX', createdAt: '2024-04-28' },
  ],
  payments: [
    { id: 'p1', paymentReference: 'PAY4A7B2C1D', debtorName: 'Zhao Lei', creditorName: 'HSBC HK', amount: '1,250,000.00', currency: 'USD', network: 'SWIFT', status: 'COMPLETED', fraudScore: '0.12', instructedAt: '2024-05-30T09:14:22Z' },
    { id: 'p2', paymentReference: 'PAY8E3F9G2H', debtorName: 'Sarah Mitchell', creditorName: 'Barclays UK', amount: '84,500.00', currency: 'GBP', network: 'FASTER_PAYMENTS', status: 'COMPLETED', fraudScore: '0.05', instructedAt: '2024-05-30T10:02:11Z' },
    { id: 'p3', paymentReference: 'PAY1K7L0M5N', debtorName: 'Ahmad Al-Rashid', creditorName: 'Unknown Beneficiary', amount: '3,800,000.00', currency: 'USD', network: 'SWIFT', status: 'FAILED', fraudScore: '0.94', instructedAt: '2024-05-30T11:37:44Z' },
    { id: 'p4', paymentReference: 'PAYQR2S6T0U', debtorName: 'Priya Sharma', creditorName: 'Amazon Pay', amount: '12,400.00', currency: 'USD', network: 'ACH', status: 'COMPLETED', fraudScore: '0.03', instructedAt: '2024-05-30T12:09:05Z' },
    { id: 'p5', paymentReference: 'PAYVW4X8Y9Z', debtorName: 'Carlos Mendoza', creditorName: 'Shell Trading', amount: '620,000.00', currency: 'EUR', network: 'SEPA', status: 'PROCESSING', fraudScore: '0.31', instructedAt: '2024-05-30T13:55:18Z' },
  ],
  loans: [
    { id: 'l1', loanNumber: 'LN8834920011', customerName: 'Zhao Lei', productName: 'Personal Loan – Fixed Rate', principalAmount: '50,000.00', outstandingBalance: '38,421.50', currency: 'USD', interestRate: '8.90', status: 'ACTIVE', nextDueDate: '2024-06-15' },
    { id: 'l2', loanNumber: 'LN7712038294', customerName: 'Priya Sharma', productName: 'SME Revolving Credit Facility', principalAmount: '2,500,000.00', outstandingBalance: '1,980,000.00', currency: 'USD', interestRate: '6.50', status: 'ACTIVE', nextDueDate: '2024-06-01' },
    { id: 'l3', loanNumber: 'LN6691847023', customerName: 'Carlos Mendoza', productName: 'Personal Loan – Fixed Rate', principalAmount: '30,000.00', outstandingBalance: '28,100.00', currency: 'USD', interestRate: '8.90', status: 'OVERDUE', nextDueDate: '2024-05-01' },
  ],
  complianceCases: [
    { id: 'cc1', caseNumber: 'FRAUD-1716480000', type: 'SAR', status: 'OPEN', riskScore: '0.94', description: 'Automated fraud flag: large cross-border transfer to non-KYC counterparty', createdAt: '2024-05-30T11:37:44Z' },
    { id: 'cc2', caseNumber: 'EDD-1716393600', type: 'EDD', status: 'UNDER_REVIEW', riskScore: '0.75', description: 'Enhanced Due Diligence triggered: High-risk jurisdiction (AE)', createdAt: '2024-05-29T09:00:00Z' },
    { id: 'cc3', caseNumber: 'SANC-1716307200', type: 'SANCTIONS_HIT', status: 'CLOSED_NO_ACTION', riskScore: '0.45', description: 'Potential partial name match resolved – false positive confirmed', createdAt: '2024-05-28T14:22:00Z' },
  ],
  fxRates: [
    { pair: 'EUR/USD', bid: '1.0851', ask: '1.0857', mid: '1.0854', change: '+0.12%' },
    { pair: 'GBP/USD', bid: '1.2671', ask: '1.2677', mid: '1.2674', change: '-0.08%' },
    { pair: 'USD/JPY', bid: '149.84', ask: '149.90', mid: '149.87', change: '+0.34%' },
    { pair: 'USD/CNY', bid: '7.2538', ask: '7.2544', mid: '7.2541', change: '-0.05%' },
    { pair: 'USD/HKD', bid: '7.8149', ask: '7.8153', mid: '7.8151', change: '+0.01%' },
    { pair: 'USD/SGD', bid: '1.3419', ask: '1.3423', mid: '1.3421', change: '+0.03%' },
  ],
  paymentTrend: [
    { hour: '00:00', volume: 12, amount: 4_200_000 },
    { hour: '02:00', volume: 8, amount: 2_800_000 },
    { hour: '04:00', volume: 5, amount: 1_900_000 },
    { hour: '06:00', volume: 31, amount: 8_100_000 },
    { hour: '08:00', volume: 184, amount: 62_400_000 },
    { hour: '10:00', volume: 421, amount: 148_000_000 },
    { hour: '12:00', volume: 612, amount: 204_000_000 },
    { hour: '14:00', volume: 538, amount: 189_000_000 },
    { hour: '16:00', volume: 394, amount: 141_000_000 },
    { hour: '18:00', volume: 287, amount: 98_000_000 },
    { hour: '20:00', volume: 103, amount: 38_000_000 },
    { hour: '22:00', volume: 47, amount: 16_200_000 },
  ],
  glAccounts: [
    { code: '1000', name: 'Cash & Central Bank',          type: 'ASSET',    debitTotal: '5,847,200,000.00', creditTotal: '2,100,000,000.00', netBalance: '3,747,200,000.00' },
    { code: '1100', name: 'Loans to Customers',           type: 'ASSET',    debitTotal: '1,923,847,110.00', creditTotal: '0.00',            netBalance: '1,923,847,110.00' },
    { code: '2000', name: 'Customer Deposits – Current',  type: 'LIABILITY', debitTotal: '0.00',            creditTotal: '1,924,381,240.00', netBalance: '-1,924,381,240.00' },
    { code: '2100', name: 'Customer Deposits – Savings',  type: 'LIABILITY', debitTotal: '0.00',            creditTotal: '923,010,000.00',   netBalance: '-923,010,000.00' },
    { code: '3000', name: 'Share Capital',                type: 'EQUITY',   debitTotal: '0.00',            creditTotal: '2,000,000,000.00', netBalance: '-2,000,000,000.00' },
    { code: '3100', name: 'Retained Earnings',            type: 'EQUITY',   debitTotal: '0.00',            creditTotal: '794,684,870.00',   netBalance: '-794,684,870.00' },
    { code: '4000', name: 'Interest Income – Loans',      type: 'INCOME',   debitTotal: '0.00',            creditTotal: '48,291,000.00',    netBalance: '-48,291,000.00' },
    { code: '5000', name: 'Interest Expense – Deposits',  type: 'EXPENSE',  debitTotal: '19,320,000.00',   creditTotal: '0.00',            netBalance: '19,320,000.00' },
  ],
};
