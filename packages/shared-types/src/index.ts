// ===== BankerOS Shared Types =====
// All domain types used across microservices

// -------- Enumerations --------

export enum Currency {
  USD = 'USD', EUR = 'EUR', GBP = 'GBP', JPY = 'JPY',
  CNY = 'CNY', HKD = 'HKD', SGD = 'SGD', AUD = 'AUD',
  CHF = 'CHF', CAD = 'CAD',
}

export enum AccountType {
  CURRENT    = 'CURRENT',
  SAVINGS    = 'SAVINGS',
  LOAN       = 'LOAN',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  NOSTRO     = 'NOSTRO',
  VOSTRO     = 'VOSTRO',
  GL         = 'GL',
}

export enum AccountStatus {
  PENDING   = 'PENDING',
  ACTIVE    = 'ACTIVE',
  DORMANT   = 'DORMANT',
  FROZEN    = 'FROZEN',
  CLOSED    = 'CLOSED',
}

export enum KycStatus {
  NOT_STARTED  = 'NOT_STARTED',
  IN_PROGRESS  = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED     = 'APPROVED',
  REJECTED     = 'REJECTED',
  EXPIRED      = 'EXPIRED',
}

export enum RiskLevel {
  LOW    = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH   = 'HIGH',
  PROHIBITED = 'PROHIBITED',
}

export enum LoanStatus {
  DRAFT       = 'DRAFT',
  SUBMITTED   = 'SUBMITTED',
  APPROVED    = 'APPROVED',
  REJECTED    = 'REJECTED',
  ACTIVE      = 'ACTIVE',
  OVERDUE     = 'OVERDUE',
  WRITTEN_OFF = 'WRITTEN_OFF',
  SETTLED     = 'SETTLED',
}

export enum PaymentStatus {
  INITIATED    = 'INITIATED',
  PENDING      = 'PENDING',
  PROCESSING   = 'PROCESSING',
  COMPLETED    = 'COMPLETED',
  FAILED       = 'FAILED',
  REVERSED     = 'REVERSED',
  CANCELLED    = 'CANCELLED',
}

export enum PaymentNetwork {
  INTERNAL = 'INTERNAL',
  ACH      = 'ACH',
  RTGS     = 'RTGS',
  SWIFT    = 'SWIFT',
  SEPA     = 'SEPA',
  FASTER_PAYMENTS = 'FASTER_PAYMENTS',
  CBDC     = 'CBDC',
}

export enum TransactionType {
  DEBIT  = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum JournalEntryStatus {
  PENDING   = 'PENDING',
  POSTED    = 'POSTED',
  REVERSED  = 'REVERSED',
}

export enum LcStatus {
  DRAFT       = 'DRAFT',
  APPLIED     = 'APPLIED',
  ISSUED      = 'ISSUED',
  ADVISED     = 'ADVISED',
  AMENDED     = 'AMENDED',
  PRESENTED   = 'PRESENTED',
  ACCEPTED    = 'ACCEPTED',
  SETTLED     = 'SETTLED',
  EXPIRED     = 'EXPIRED',
  CANCELLED   = 'CANCELLED',
}

export enum ComplianceCaseStatus {
  OPEN        = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ESCALATED   = 'ESCALATED',
  CLOSED_SAR  = 'CLOSED_SAR',
  CLOSED_NO_ACTION = 'CLOSED_NO_ACTION',
}

// -------- Core Domain Types --------

export interface Money {
  amount: string;   // Decimal string, never float
  currency: Currency;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;   // ISO 3166-1 alpha-2
}

export interface CustomerCIF {
  id: string;
  cifNumber: string;
  type: 'INDIVIDUAL' | 'CORPORATE';
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;       // ISO 8601
  nationality?: string;
  address: Address;
  kycStatus: KycStatus;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  cifId: string;
  type: AccountType;
  status: AccountStatus;
  currency: Currency;
  balance: string;            // Decimal string
  availableBalance: string;
  openedAt: string;
  closedAt?: string;
}

export interface JournalLine {
  accountCode: string;
  type: TransactionType;
  amount: string;             // Decimal string, always positive
  currency: Currency;
  description?: string;
}

export interface JournalEntry {
  id: string;
  referenceId: string;        // Business event ID (payment, loan disbursement, etc.)
  lines: JournalLine[];
  status: JournalEntryStatus;
  businessDate: string;       // YYYY-MM-DD
  postedAt?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  loanNumber: string;
  cifId: string;
  productId: string;
  principal: string;
  outstandingBalance: string;
  currency: Currency;
  interestRate: string;       // Annual percentage, decimal string
  termMonths: number;
  status: LoanStatus;
  disbursedAt?: string;
  maturityDate?: string;
  nextDueDate?: string;
}

export interface Payment {
  id: string;
  paymentReference: string;
  debtorAccountId: string;
  creditorAccountNumber: string;
  creditorBankBic?: string;
  amount: Money;
  network: PaymentNetwork;
  status: PaymentStatus;
  instructedAt: string;
  completedAt?: string;
  failureReason?: string;
}

// -------- API Response Wrappers --------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

// -------- Kafka Event Types --------

export interface BankerOSEvent<T = unknown> {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  occurredAt: string;
  version: number;
  payload: T;
  metadata: {
    correlationId: string;
    causationId?: string;
    userId?: string;
    serviceId: string;
  };
}

export type CustomerCreatedEvent   = BankerOSEvent<{ cifId: string; cifNumber: string }>;
export type AccountOpenedEvent     = BankerOSEvent<{ accountId: string; cifId: string; currency: Currency }>;
export type PaymentInitiatedEvent  = BankerOSEvent<{ paymentId: string; amount: Money }>;
export type PaymentCompletedEvent  = BankerOSEvent<{ paymentId: string }>;
export type LoanDisbursedEvent     = BankerOSEvent<{ loanId: string; amount: Money; cifId: string }>;
export type JournalPostedEvent     = BankerOSEvent<{ journalId: string; referenceId: string }>;
export type KycStatusChangedEvent  = BankerOSEvent<{ cifId: string; oldStatus: KycStatus; newStatus: KycStatus }>;
export type FraudAlertEvent        = BankerOSEvent<{ paymentId: string; score: number; blocked: boolean }>;
