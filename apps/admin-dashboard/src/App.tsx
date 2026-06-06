import { Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import './styles-banking-v2.css';
import './styles-portal-v2.css';
import './styles-contrast-fix.css'; // must be last — overrides any leftover dark-on-dark / white-on-white
import './styles-wukong-site.css';
import { applyTheme, getInitialTheme } from './components/ThemeToggle';
import CopilotSidebar from './components/Copilot/CopilotSidebar';

// Apply theme as early as possible to avoid flash of wrong theme
applyTheme(getInitialTheme());

import { useAuthStore } from './store/auth';
import { ErrorBoundary } from './components/ErrorBoundary';
import EnvSwitcher from './components/EnvSwitcher';

// Public portal (HSBC-style)
import Home from './portal/Home';
import ProductPersonal from './portal/ProductPersonal';
import ProductBusiness from './portal/ProductBusiness';
import PortalLogin from './portal/PortalLogin';

// Detailed product pages
import Accounts from './portal/products/Accounts';
import Cards from './portal/products/Cards';
import { Mortgage, PersonalLoan } from './portal/products/Loans';
import { WealthPremier, WealthJade, WealthPrivate } from './portal/products/Wealth';
import { BusinessSme, BusinessCashManagement, BusinessTradeFinance } from './portal/products/Business';
import { GlobalMultiCurrency, PremierGlobal, GlobalRemittance } from './portal/products/Global';
import { AboutPage, Innovation, Esg } from './portal/About';
import Rates from './portal/Rates';
import Help from './portal/Help';

// L2 product detail pages (premium handwritten)
import CardWorldElite from './portal/details/CardWorldElite';
import TradeLetterOfCredit from './portal/details/TradeLetterOfCredit';
import MBridgeCBDC from './portal/details/MBridgeCBDC';
import MortgageFirstHome from './portal/details/MortgageFirstHome';
import WealthRoboAdvisor from './portal/details/WealthRoboAdvisor';
import CashPoolDetail from './portal/details/CashPoolDetail';

// L2 batch detail pages (data-driven via ProductDetailLite)
import { CardTravel, CardGold, CardCoBrand, CardYoung, CardCorporatePurchasing } from './portal/details/AllCards';
import {
  MortgageSecondHome, MortgageOverseas,
  LoanFlash, LoanEducation, LoanRenovation, LoanMedical, LoanAutoDetail,
  LoanWedding, LoanBusinessOwner,
} from './portal/details/AllLoans';
import {
  AccountAllInOne, SavingsCertificate, SavingsStructured,
  FxExchangeDetail, PreciousMetalsDetail,
  InsuranceLife, InsuranceHealth, InsuranceTravel,
} from './portal/details/AllAccountsDeposits';
import {
  WealthFunds, WealthBonds, WealthStructured,
  WealthTrust, WealthMigration, WealthInheritance,
} from './portal/details/AllWealth';
import {
  BusinessCommercial, BusinessCorporate,
  BusinessCrossBorder, BusinessPayroll, BusinessApiBank,
  BusinessIpo, BusinessMAndA, BusinessBonds,
} from './portal/details/AllBusiness';
import {
  GlobalOffshore, GlobalStudyAbroad, GlobalImmigration,
} from './portal/details/AllGlobal';
import {
  TfBankGuarantee, TfExportFinancing, TfImportFinancing, TfForfaiting,
  TfExportFactoring, TfShippingFinance, TfExportCredit,
} from './portal/details/AllTradeFinance';
import {
  CmAccountMgmt, CmSmartPayment, CmReceivables, CmLiquidityForecast,
  SmeSupplyChain, SmeEquipment, SmeBridgeLoan,
} from './portal/details/AllCashAndSme';

// HR & Admin (Group Services)
import OrganizationStructure from './pages/hr/OrganizationStructure';
import EmployeeManagement from './pages/hr/EmployeeManagement';
import BranchNetwork from './pages/hr/BranchNetwork';
import { RolesPermissions, PerformanceManagement, TrainingManagement } from './pages/hr/RolesPerformance';

// Credit Workflow (LOS - Loan Origination System)
import CreditWorkbench from './pages/credit/CreditWorkbench';
import LoanApplicationDetail from './pages/credit/LoanApplicationDetail';
import ExternalDataHub from './pages/credit/ExternalDataHub';
import CreditCommittee from './pages/credit/CreditCommittee';

// Risk & Compliance modules (8 modules)
import RiskDashboard from './pages/risk/RiskDashboard';
import CreditRisk from './pages/risk/CreditRisk';
import MarketRisk from './pages/risk/MarketRisk';
import OperationalRisk from './pages/risk/OperationalRisk';
import { LiquidityRisk, CapitalManagement, RegulatoryReporting, InternalAudit } from './pages/risk/LiquidityCapitalReg';

// Customer banking (personal & business)
import PersonalDashboard from './banking/PersonalDashboard';
import PersonalTransfer from './banking/PersonalTransfer';
import PersonalStatements from './banking/PersonalStatements';
import BusinessDashboard from './banking/BusinessDashboard';
import {
  AccountsCenter, CardsCenter, WealthCenter, FxGlobal,
  LoansCenter, PayLifestyle, SecurityCenter, PremierLounge,
} from './banking/PersonalPages';
import {
  PayeesManager,
  CardBills, CardRewards, CardInstalment, DebitCards, CardIssue,
  FundsCenter, WmProducts, StructuredProducts, InsuranceCenter, PreciousMetals, RoboAdvisor,
  GlobalAccount, OverseasRemittance, FxRatesAlerts,
  MortgageCenter, ConsumerLoan, AutoLoan, LoanCalculator,
  TravelHotel, DiningReservation,
} from './banking/PersonalSubPages';
import {
  CashManagement, BatchPayments, TradeCenter, TreasuryDesk,
  SupplyChainFinance, PayrollCenter, ApiBankingConsole, ApprovalCenter,
} from './banking/BusinessPages';
import {
  CashPooling, VirtualAccount, CashForecast,
  SinglePayment, XBorderPayment, InstantPayment,
  BankGuarantee, TradeCollection, BillDiscount, Forfaiting, Factoring, TradeLoans,
  ScfReceivable, ScfPayable, ScfDistributor,
  FxHedging, IrsDesk, CommodityHedge,
  ApiDocs, ErpIntegration, HostToHost,
} from './banking/BusinessSubPages';

// Admin (existing — bankers' workstation)
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import CeoDashboard from './pages/CeoDashboard';
import ManagementDashboard from './pages/ManagementDashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import OnboardingHsbc from './pages/OnboardingHsbc';
import Payments from './pages/Payments';
import GL from './pages/GL';
import FX from './pages/FX';
import Compliance from './pages/Compliance';
import Loans from './pages/Loans';
import Syndication from './pages/Syndication';
import Products from './pages/Products';
import TradeFinance from './pages/TradeFinance';
import Wealth from './pages/Wealth';
import Liquidity from './pages/Liquidity';
import DigitalAssets from './pages/DigitalAssets';
import Batch from './pages/Batch';
import OpenBanking from './pages/OpenBanking';
import MiddleOffice from './pages/MiddleOffice';
import WukongSite from './pages/WukongSite';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  if (!isAuth) return <Navigate to="/login?type=staff" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </div>
      <CopilotSidebar />
    </div>
  );
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  if (!isAuth) return <Navigate to="/login" replace />;
  return (
    <>
      <ErrorBoundary>{children}</ErrorBoundary>
      <CopilotSidebar />
    </>
  );
}

export default function App() {
  return (
    <>
    <Routes>
      {/* ───── PUBLIC PORTAL (HSBC/招行 style) ───── */}
      <Route path="/"                  element={<WukongSite lang="zh" page="home" />} />
      <Route path="/en"                element={<WukongSite lang="en" page="home" />} />
      <Route path="/platform"          element={<WukongSite lang="zh" page="platform" />} />
      <Route path="/en/platform"       element={<WukongSite lang="en" page="platform" />} />
      <Route path="/open-source"       element={<WukongSite lang="zh" page="openSource" />} />
      <Route path="/en/open-source"    element={<WukongSite lang="en" page="openSource" />} />
      <Route path="/developers"        element={<WukongSite lang="zh" page="developers" />} />
      <Route path="/en/developers"     element={<WukongSite lang="en" page="developers" />} />
      <Route path="/data-health"       element={<WukongSite lang="zh" page="dataHealth" />} />
      <Route path="/en/data-health"    element={<WukongSite lang="en" page="dataHealth" />} />
      <Route path="/ai"                element={<WukongSite lang="zh" page="ai" />} />
      <Route path="/en/ai"             element={<WukongSite lang="en" page="ai" />} />
      <Route path="/pricing"           element={<WukongSite lang="zh" page="pricing" />} />
      <Route path="/en/pricing"        element={<WukongSite lang="en" page="pricing" />} />
      <Route path="/products/personal" element={<ProductPersonal />} />
      <Route path="/products/business" element={<ProductBusiness />} />
      <Route path="/login"             element={<PortalLogin />} />

      {/* Personal banking products — Overview + Detail */}
      <Route path="/products/accounts"            element={<Accounts />} />
      <Route path="/products/accounts/all-in-one" element={<AccountAllInOne />} />
      <Route path="/products/cards"               element={<Cards />} />
      <Route path="/products/savings"             element={<Accounts />} />
      <Route path="/products/savings/certificate" element={<SavingsCertificate />} />
      <Route path="/products/savings/structured"  element={<SavingsStructured />} />
      <Route path="/products/payments"            element={<Accounts />} />
      <Route path="/products/fx"                  element={<FxExchangeDetail />} />
      <Route path="/products/precious-metals"     element={<PreciousMetalsDetail />} />

      {/* All Credit Card details */}
      <Route path="/products/cards/world-elite"            element={<CardWorldElite />} />
      <Route path="/products/cards/travel"                 element={<CardTravel />} />
      <Route path="/products/cards/gold"                   element={<CardGold />} />
      <Route path="/products/cards/cobranded"              element={<CardCoBrand />} />
      <Route path="/products/cards/young"                  element={<CardYoung />} />
      <Route path="/products/cards/corporate-purchasing"   element={<CardCorporatePurchasing />} />

      {/* Loans + L2 details */}
      <Route path="/products/loans"                       element={<PersonalLoan />} />
      <Route path="/products/loans/mortgage"              element={<Mortgage />} />
      <Route path="/products/loans/mortgage/first-home"  element={<MortgageFirstHome />} />
      <Route path="/products/loans/mortgage/second-home" element={<MortgageSecondHome />} />
      <Route path="/products/loans/mortgage/overseas"    element={<MortgageOverseas />} />
      <Route path="/products/loans/personal"              element={<PersonalLoan />} />
      <Route path="/products/loans/flash"                 element={<LoanFlash />} />
      <Route path="/products/loans/education"             element={<LoanEducation />} />
      <Route path="/products/loans/wedding"               element={<LoanWedding />} />
      <Route path="/products/loans/medical"               element={<LoanMedical />} />
      <Route path="/products/loans/renovation"            element={<LoanRenovation />} />
      <Route path="/products/loans/business-owner"        element={<LoanBusinessOwner />} />
      <Route path="/products/loans/auto"                  element={<LoanAutoDetail />} />

      {/* Insurance details */}
      <Route path="/products/insurance/life"   element={<InsuranceLife />} />
      <Route path="/products/insurance/health" element={<InsuranceHealth />} />
      <Route path="/products/insurance/travel" element={<InsuranceTravel />} />

      {/* Wealth tiered products + investment + services */}
      <Route path="/products/wealth"                       element={<WealthPremier />} />
      <Route path="/products/wealth/premier"               element={<WealthPremier />} />
      <Route path="/products/wealth/jade"                  element={<WealthJade />} />
      <Route path="/products/wealth/private"               element={<WealthPrivate />} />
      <Route path="/products/wealth/funds"                 element={<WealthFunds />} />
      <Route path="/products/wealth/bonds"                 element={<WealthBonds />} />
      <Route path="/products/wealth/structured"            element={<WealthStructured />} />
      <Route path="/products/wealth/robo-advisor"          element={<WealthRoboAdvisor />} />
      <Route path="/products/wealth/robo-advisor/details"  element={<WealthRoboAdvisor />} />
      <Route path="/products/wealth/trust"                 element={<WealthTrust />} />
      <Route path="/products/wealth/migration"             element={<WealthMigration />} />
      <Route path="/products/wealth/inheritance"           element={<WealthInheritance />} />

      {/* Business products full lineup */}
      <Route path="/products/business/sme"                             element={<BusinessSme />} />
      <Route path="/products/business/commercial"                      element={<BusinessCommercial />} />
      <Route path="/products/business/corporate"                       element={<BusinessCorporate />} />
      <Route path="/products/business/cash-management"                 element={<BusinessCashManagement />} />
      <Route path="/products/business/cash-management/pool-details"   element={<CashPoolDetail />} />
      <Route path="/products/business/trade-finance"                   element={<BusinessTradeFinance />} />
      <Route path="/products/business/trade-finance/lc-details"        element={<TradeLetterOfCredit />} />
      <Route path="/products/business/cross-border"                    element={<BusinessCrossBorder />} />
      <Route path="/products/business/payroll"                         element={<BusinessPayroll />} />
      <Route path="/products/business/api"                             element={<BusinessApiBank />} />
      <Route path="/products/business/ipo"                             element={<BusinessIpo />} />
      <Route path="/products/business/m-and-a"                         element={<BusinessMAndA />} />
      <Route path="/products/business/bonds"                           element={<BusinessBonds />} />

      {/* Global & cross-border */}
      <Route path="/products/global/multi-currency" element={<GlobalMultiCurrency />} />
      <Route path="/products/global/premier-global" element={<PremierGlobal />} />
      <Route path="/products/global/offshore"       element={<GlobalOffshore />} />
      <Route path="/products/global/remittance"     element={<GlobalRemittance />} />
      <Route path="/products/global/study-abroad"   element={<GlobalStudyAbroad />} />
      <Route path="/products/global/immigration"    element={<GlobalImmigration />} />
      <Route path="/products/global/cbdc/mbridge"   element={<MBridgeCBDC />} />

      {/* Trade Finance L2 details (7 products) */}
      <Route path="/products/business/trade-finance/bank-guarantee"   element={<TfBankGuarantee />} />
      <Route path="/products/business/trade-finance/export-financing" element={<TfExportFinancing />} />
      <Route path="/products/business/trade-finance/import-financing" element={<TfImportFinancing />} />
      <Route path="/products/business/trade-finance/forfaiting"       element={<TfForfaiting />} />
      <Route path="/products/business/trade-finance/export-factoring" element={<TfExportFactoring />} />
      <Route path="/products/business/trade-finance/shipping-finance" element={<TfShippingFinance />} />
      <Route path="/products/business/trade-finance/export-credit"    element={<TfExportCredit />} />

      {/* Cash Management L2 details (4 products) */}
      <Route path="/products/business/cash-management/accounts"          element={<CmAccountMgmt />} />
      <Route path="/products/business/cash-management/smart-payment"     element={<CmSmartPayment />} />
      <Route path="/products/business/cash-management/receivables"       element={<CmReceivables />} />
      <Route path="/products/business/cash-management/liquidity-forecast" element={<CmLiquidityForecast />} />

      {/* SME Financing L2 details (3 products) */}
      <Route path="/products/business/sme/supply-chain" element={<SmeSupplyChain />} />
      <Route path="/products/business/sme/equipment"    element={<SmeEquipment />} />
      <Route path="/products/business/sme/bridge-loan"  element={<SmeBridgeLoan />} />

      {/* About & support pages */}
      <Route path="/about"             element={<AboutPage />} />
      <Route path="/about/leadership"  element={<AboutPage />} />
      <Route path="/about/awards"      element={<AboutPage />} />
      <Route path="/about/innovation"  element={<Innovation />} />
      <Route path="/about/esg"         element={<Esg />} />
      <Route path="/about/philanthropy"  element={<Esg />} />
      <Route path="/about/financials"  element={<AboutPage />} />
      <Route path="/about/governance"  element={<AboutPage />} />
      <Route path="/careers"           element={<AboutPage />} />

      <Route path="/rates"             element={<Rates />} />
      <Route path="/help"              element={<Help />} />
      <Route path="/branches"          element={<Help />} />
      <Route path="/security"          element={<Help />} />
      <Route path="/contact"           element={<Help />} />

      {/* ───── PERSONAL CUSTOMER BANKING ───── */}
      <Route path="/personal"                  element={<CustomerRoute><PersonalDashboard /></CustomerRoute>} />
      <Route path="/personal/transfer"         element={<CustomerRoute><PersonalTransfer /></CustomerRoute>} />
      <Route path="/personal/statements"       element={<CustomerRoute><PersonalStatements /></CustomerRoute>} />
      {/* Accounts */}
      <Route path="/personal/accounts"         element={<CustomerRoute><AccountsCenter /></CustomerRoute>} />
      <Route path="/personal/accounts/manage"  element={<CustomerRoute><AccountsCenter /></CustomerRoute>} />
      <Route path="/personal/payees"           element={<CustomerRoute><PayeesManager /></CustomerRoute>} />
      {/* Cards — each sub-item has dedicated page */}
      <Route path="/personal/cards"            element={<CustomerRoute><CardsCenter /></CustomerRoute>} />
      <Route path="/personal/cards/bills"      element={<CustomerRoute><CardBills /></CustomerRoute>} />
      <Route path="/personal/cards/rewards"    element={<CustomerRoute><CardRewards /></CustomerRoute>} />
      <Route path="/personal/cards/instalment" element={<CustomerRoute><CardInstalment /></CustomerRoute>} />
      <Route path="/personal/cards/debit"      element={<CustomerRoute><DebitCards /></CustomerRoute>} />
      <Route path="/personal/cards/issue"      element={<CustomerRoute><CardIssue /></CustomerRoute>} />
      {/* Wealth — each product has dedicated page */}
      <Route path="/personal/wealth"           element={<CustomerRoute><WealthCenter /></CustomerRoute>} />
      <Route path="/personal/wealth/funds"     element={<CustomerRoute><FundsCenter /></CustomerRoute>} />
      <Route path="/personal/wealth/wm"        element={<CustomerRoute><WmProducts /></CustomerRoute>} />
      <Route path="/personal/wealth/structured" element={<CustomerRoute><StructuredProducts /></CustomerRoute>} />
      <Route path="/personal/wealth/insurance" element={<CustomerRoute><InsuranceCenter /></CustomerRoute>} />
      <Route path="/personal/wealth/gold"      element={<CustomerRoute><PreciousMetals /></CustomerRoute>} />
      <Route path="/personal/wealth/robo"      element={<CustomerRoute><RoboAdvisor /></CustomerRoute>} />
      <Route path="/personal/premier"          element={<CustomerRoute><PremierLounge /></CustomerRoute>} />
      {/* FX & Global */}
      <Route path="/personal/fx"               element={<CustomerRoute><FxGlobal /></CustomerRoute>} />
      <Route path="/personal/fx/global-account" element={<CustomerRoute><GlobalAccount /></CustomerRoute>} />
      <Route path="/personal/fx/remittance"    element={<CustomerRoute><OverseasRemittance /></CustomerRoute>} />
      <Route path="/personal/fx/rates"         element={<CustomerRoute><FxRatesAlerts /></CustomerRoute>} />
      {/* Loans */}
      <Route path="/personal/loans"            element={<CustomerRoute><LoansCenter /></CustomerRoute>} />
      <Route path="/personal/loans/mortgage"   element={<CustomerRoute><MortgageCenter /></CustomerRoute>} />
      <Route path="/personal/loans/personal"   element={<CustomerRoute><ConsumerLoan /></CustomerRoute>} />
      <Route path="/personal/loans/auto"       element={<CustomerRoute><AutoLoan /></CustomerRoute>} />
      <Route path="/personal/loans/calculator" element={<CustomerRoute><LoanCalculator /></CustomerRoute>} />
      {/* Lifestyle */}
      <Route path="/personal/lifestyle"        element={<CustomerRoute><PayLifestyle /></CustomerRoute>} />
      <Route path="/personal/lifestyle/travel" element={<CustomerRoute><TravelHotel /></CustomerRoute>} />
      <Route path="/personal/lifestyle/dining" element={<CustomerRoute><DiningReservation /></CustomerRoute>} />
      <Route path="/personal/security"         element={<CustomerRoute><SecurityCenter /></CustomerRoute>} />

      {/* ───── CORPORATE CUSTOMER BANKING ───── */}
      <Route path="/business"                 element={<CustomerRoute><BusinessDashboard /></CustomerRoute>} />
      {/* Cash Management */}
      <Route path="/business/cash"            element={<CustomerRoute><CashManagement /></CustomerRoute>} />
      <Route path="/business/cash/pooling"    element={<CustomerRoute><CashPooling /></CustomerRoute>} />
      <Route path="/business/cash/virtual"    element={<CustomerRoute><VirtualAccount /></CustomerRoute>} />
      <Route path="/business/cash/forecast"   element={<CustomerRoute><CashForecast /></CustomerRoute>} />
      {/* Payments */}
      <Route path="/business/payments"        element={<CustomerRoute><SinglePayment /></CustomerRoute>} />
      <Route path="/business/payments/batch"  element={<CustomerRoute><BatchPayments /></CustomerRoute>} />
      <Route path="/business/payments/payroll" element={<CustomerRoute><PayrollCenter /></CustomerRoute>} />
      <Route path="/business/payments/xborder" element={<CustomerRoute><XBorderPayment /></CustomerRoute>} />
      <Route path="/business/payments/instant" element={<CustomerRoute><InstantPayment /></CustomerRoute>} />
      {/* Trade Finance */}
      <Route path="/business/trade"           element={<CustomerRoute><TradeCenter /></CustomerRoute>} />
      <Route path="/business/trade/guarantee" element={<CustomerRoute><BankGuarantee /></CustomerRoute>} />
      <Route path="/business/trade/collection" element={<CustomerRoute><TradeCollection /></CustomerRoute>} />
      <Route path="/business/trade/discount"  element={<CustomerRoute><BillDiscount /></CustomerRoute>} />
      <Route path="/business/trade/forfaiting" element={<CustomerRoute><Forfaiting /></CustomerRoute>} />
      <Route path="/business/trade/factoring" element={<CustomerRoute><Factoring /></CustomerRoute>} />
      <Route path="/business/trade/loans"     element={<CustomerRoute><TradeLoans /></CustomerRoute>} />
      {/* Supply Chain Finance */}
      <Route path="/business/scf"             element={<CustomerRoute><SupplyChainFinance /></CustomerRoute>} />
      <Route path="/business/scf/receivable"  element={<CustomerRoute><ScfReceivable /></CustomerRoute>} />
      <Route path="/business/scf/payable"     element={<CustomerRoute><ScfPayable /></CustomerRoute>} />
      <Route path="/business/scf/distributor" element={<CustomerRoute><ScfDistributor /></CustomerRoute>} />
      {/* Treasury */}
      <Route path="/business/treasury"          element={<CustomerRoute><TreasuryDesk /></CustomerRoute>} />
      <Route path="/business/treasury/hedge"    element={<CustomerRoute><FxHedging /></CustomerRoute>} />
      <Route path="/business/treasury/irs"      element={<CustomerRoute><IrsDesk /></CustomerRoute>} />
      <Route path="/business/treasury/commodity" element={<CustomerRoute><CommodityHedge /></CustomerRoute>} />
      {/* Payroll */}
      <Route path="/business/payroll"          element={<CustomerRoute><PayrollCenter /></CustomerRoute>} />
      {/* API Banking */}
      <Route path="/business/api"              element={<CustomerRoute><ApiBankingConsole /></CustomerRoute>} />
      <Route path="/business/api/docs"         element={<CustomerRoute><ApiDocs /></CustomerRoute>} />
      <Route path="/business/api/erp"          element={<CustomerRoute><ErpIntegration /></CustomerRoute>} />
      <Route path="/business/api/host2host"    element={<CustomerRoute><HostToHost /></CustomerRoute>} />
      {/* Approval */}
      <Route path="/business/approval"         element={<CustomerRoute><ApprovalCenter /></CustomerRoute>} />

      {/* ───── ADMIN (bank staff dashboard) ───── */}
      <Route path="/admin"               element={<AdminLayout><CeoDashboard /></AdminLayout>} />
          <Route path="/admin/ops-dashboard"  element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/lines"          element={<AdminLayout><ManagementDashboard /></AdminLayout>} />
      <Route path="/admin/customers"     element={<AdminLayout><Customers /></AdminLayout>} />
      <Route path="/admin/customers/:id" element={<AdminLayout><CustomerDetail /></AdminLayout>} />
      <Route path="/admin/onboarding"    element={<AdminLayout><OnboardingHsbc /></AdminLayout>} />
      <Route path="/admin/loans"         element={<AdminLayout><Loans /></AdminLayout>} />
      <Route path="/admin/syndication"   element={<AdminLayout><Syndication /></AdminLayout>} />
      <Route path="/admin/products"      element={<AdminLayout><Products /></AdminLayout>} />
      <Route path="/admin/payments"      element={<AdminLayout><Payments /></AdminLayout>} />
      <Route path="/admin/open-banking"  element={<AdminLayout><OpenBanking /></AdminLayout>} />
      <Route path="/admin/fx"            element={<AdminLayout><FX /></AdminLayout>} />
      <Route path="/admin/wealth"        element={<AdminLayout><Wealth /></AdminLayout>} />
      <Route path="/admin/liquidity"     element={<AdminLayout><Liquidity /></AdminLayout>} />
      <Route path="/admin/trade-finance" element={<AdminLayout><TradeFinance /></AdminLayout>} />
      <Route path="/admin/compliance"    element={<AdminLayout><Compliance /></AdminLayout>} />
      <Route path="/admin/digital-assets" element={<AdminLayout><DigitalAssets /></AdminLayout>} />
      <Route path="/admin/batch"         element={<AdminLayout><Batch /></AdminLayout>} />
      <Route path="/admin/gl"            element={<AdminLayout><GL /></AdminLayout>} />
      <Route path="/admin/middle-office" element={<AdminLayout><MiddleOffice /></AdminLayout>} />

      {/* ───── HR & ADMIN (Group Services) ───── */}
      <Route path="/admin/hr/organization" element={<AdminLayout><OrganizationStructure /></AdminLayout>} />
      <Route path="/admin/hr/employees"    element={<AdminLayout><EmployeeManagement /></AdminLayout>} />
      <Route path="/admin/hr/branches"     element={<AdminLayout><BranchNetwork /></AdminLayout>} />
      <Route path="/admin/hr/roles"        element={<AdminLayout><RolesPermissions /></AdminLayout>} />
      <Route path="/admin/hr/performance"  element={<AdminLayout><PerformanceManagement /></AdminLayout>} />
      <Route path="/admin/hr/training"     element={<AdminLayout><TrainingManagement /></AdminLayout>} />

      {/* ───── CREDIT WORKFLOW (Loan Origination System) ───── */}
      <Route path="/admin/credit-workflow/workbench"            element={<AdminLayout><CreditWorkbench /></AdminLayout>} />
      <Route path="/admin/credit-workflow/new"                  element={<AdminLayout><LoanApplicationDetail /></AdminLayout>} />
      <Route path="/admin/credit-workflow/application/:id"      element={<AdminLayout><LoanApplicationDetail /></AdminLayout>} />
      <Route path="/admin/credit-workflow/external-data"        element={<AdminLayout><ExternalDataHub /></AdminLayout>} />
      <Route path="/admin/credit-workflow/committee"            element={<AdminLayout><CreditCommittee /></AdminLayout>} />

      {/* ───── RISK MANAGEMENT (3rd line of defense) ───── */}
      <Route path="/admin/risk"             element={<AdminLayout><RiskDashboard /></AdminLayout>} />
      <Route path="/admin/risk/credit"      element={<AdminLayout><CreditRisk /></AdminLayout>} />
      <Route path="/admin/risk/market"      element={<AdminLayout><MarketRisk /></AdminLayout>} />
      <Route path="/admin/risk/operational" element={<AdminLayout><OperationalRisk /></AdminLayout>} />
      <Route path="/admin/risk/liquidity"   element={<AdminLayout><LiquidityRisk /></AdminLayout>} />
      <Route path="/admin/risk/capital"     element={<AdminLayout><CapitalManagement /></AdminLayout>} />
      <Route path="/admin/risk/regulatory"  element={<AdminLayout><RegulatoryReporting /></AdminLayout>} />
      <Route path="/admin/risk/audit"       element={<AdminLayout><InternalAudit /></AdminLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <EnvSwitcher />
    </>
  );
}
