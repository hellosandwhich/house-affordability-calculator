/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PropertyType = 
  | 'hdb_bto'
  | 'hdb_resale'
  | 'ec'
  | 'private_condo'
  | 'landed';

export type BuyerCitizenship = 
  | 'sc_single'
  | 'sc_couple'
  | 'sc_pr'
  | 'pr_single'
  | 'pr_pr'
  | 'foreigner';

export type PropertyCount = 'first' | 'second' | 'third_or_more';

export type LoanType = 'bank_loan' | 'hdb_loan';

export interface ApplicantProfile {
  age: number;
  monthlyFixedIncome: number;
  monthlyVariableIncome: number; // typically haircut 30% by MAS
  monthlyCpfContribution: number; // CPF OA contribution
  existingMonthlyDebts: number; // car loans, student loans, credit cards
}

export interface UserFinancialInput {
  propertyType: PropertyType;
  purchasePrice: number;
  buyerCitizenship: BuyerCitizenship;
  propertyCount: PropertyCount;
  loanType: LoanType;
  loanTenureYears: number;
  interestRate: number; // e.g. 2.6 for HDB, 3.2 for Bank
  stressTestInterestRate: number; // MAS medium term floor, usually 4.0%

  isDualApplicant: boolean;
  applicant1: ApplicantProfile;
  applicant2: ApplicantProfile;

  availableCashSavings: number;
  availableCpfOa: number;

  renovationBudget: number;
  conveyancingLegalFee: number;
  valuationFee: number;
  miscMovingReserve: number;
}

export interface StampDutyBreakdown {
  bsd: number;
  bsdTiers: {
    bracket: string;
    rate: number;
    amountInTier: number;
    tax: number;
  }[];
  absdRate: number;
  absd: number;
  totalStampDuty: number;
}

export interface OutOfPocketBreakdown {
  minimumCashDownpayment: number;
  cpfOrCashDownpayment: number;
  totalDownpayment: number;
  ltvPercentage: number;
  maxLoanAmount: number;
  
  stampDuty: StampDutyBreakdown;
  legalFee: number;
  valuationFee: number;
  renovationAndFurnishing: number;
  miscReserve: number;
  
  totalInitialRequired: number;
  totalCashRequired: number;
  totalCpfRequired: number;
  
  cashShortfallOrSurplus: number; // positive = surplus, negative = shortfall
  cpfShortfallOrSurplus: number;
  isInitialCapitalSufficient: boolean;
  
  otpDepositCash: number; // 1% or fixed
  otpExerciseCash: number; // 4% or fixed
}

export interface MonthlyCashflowBreakdown {
  grossMonthlyIncome: number;
  recognizedMonthlyIncome: number; // variable income haircut 30%
  combinedMonthlyCpfOa: number;
  totalExistingMonthlyDebts: number;
  
  monthlyMortgageActual: number;
  monthlyMortgageStress: number;
  
  // How mortgage is serviced
  monthlyCpfOaUsed: number;
  monthlyCashOutOfPocketRequired: number;
  
  // Total living & debt obligations
  totalMonthlyObligations: number;
  netRemainingMonthlyCash: number;
  
  // Regulatory Ratios
  msrActual: number; // percentage, e.g. 28.5
  msrStress: number;
  msrApplicable: boolean;
  msrPass: boolean;
  msrLimit: number; // 30%
  
  tdsrActual: number; // percentage, e.g. 48.2
  tdsrStress: number;
  tdsrPass: boolean;
  tdsrLimit: number; // 55%
}

export type AffordabilityStatus = 'comfortable' | 'stretch' | 'unaffordable';

export interface AffordabilityVerdict {
  status: AffordabilityStatus;
  headline: string;
  summary: string;
  reasons: {
    type: 'success' | 'warning' | 'danger';
    message: string;
  }[];
  maxBorrowingPower: number;
  maxAffordablePrice: number;
}

export interface CalculationResult {
  inputs: UserFinancialInput;
  outOfPocket: OutOfPocketBreakdown;
  monthlyCashflow: MonthlyCashflowBreakdown;
  verdict: AffordabilityVerdict;
}

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  propertyType: PropertyType;
  tag: string;
  data: UserFinancialInput;
}
