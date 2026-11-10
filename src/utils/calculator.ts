/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserFinancialInput,
  StampDutyBreakdown,
  OutOfPocketBreakdown,
  MonthlyCashflowBreakdown,
  AffordabilityVerdict,
  AffordabilityStatus,
  CalculationResult,
  PropertyType,
  BuyerCitizenship,
  PropertyCount,
} from '../types/calculator';

/**
 * Calculates Buyer's Stamp Duty (BSD) according to latest Singapore IRAS tax brackets.
 */
export function calculateBsd(purchasePrice: number): StampDutyBreakdown['bsdTiers'] {
  const tiers = [
    { bracket: 'First $180,000', rate: 0.01, threshold: 180000 },
    { bracket: 'Next $180,000 ($180k - $360k)', rate: 0.02, threshold: 180000 },
    { bracket: 'Next $640,000 ($360k - $1M)', rate: 0.03, threshold: 640000 },
    { bracket: 'Next $500,000 ($1M - $1.5M)', rate: 0.04, threshold: 500000 },
    { bracket: 'Next $1,500,000 ($1.5M - $3M)', rate: 0.05, threshold: 1500000 },
    { bracket: 'Amounts above $3,000,000', rate: 0.06, threshold: Infinity },
  ];

  let remaining = purchasePrice;
  const result: StampDutyBreakdown['bsdTiers'] = [];

  for (const tier of tiers) {
    if (remaining <= 0) {
      result.push({
        bracket: tier.bracket,
        rate: tier.rate,
        amountInTier: 0,
        tax: 0,
      });
      continue;
    }

    const taxableInThisTier = Math.min(remaining, tier.threshold);
    const tax = taxableInThisTier * tier.rate;
    result.push({
      bracket: tier.bracket,
      rate: tier.rate,
      amountInTier: taxableInThisTier,
      tax,
    });
    remaining -= taxableInThisTier;
  }

  return result;
}

/**
 * Determines Additional Buyer's Stamp Duty (ABSD) percentage based on IRAS Singapore rules.
 */
export function getAbsdRate(
  citizenship: BuyerCitizenship,
  propertyCount: PropertyCount
): number {
  if (citizenship === 'foreigner') {
    return 0.60; // 60% flat for foreigners
  }

  if (citizenship === 'sc_single' || citizenship === 'sc_couple') {
    if (propertyCount === 'first') return 0.0;
    if (propertyCount === 'second') return 0.20;
    return 0.30;
  }

  if (citizenship === 'sc_pr') {
    // SC + PR couple: 0% if first matrimonial home, 30% if second
    if (propertyCount === 'first') return 0.0;
    if (propertyCount === 'second') return 0.30;
    return 0.35;
  }

  if (citizenship === 'pr_single' || citizenship === 'pr_pr') {
    if (propertyCount === 'first') return 0.05; // 5% for PR 1st property
    if (propertyCount === 'second') return 0.30;
    return 0.35;
  }

  return 0.0;
}

/**
 * Monthly mortgage installment formula using standard amortization:
 * PMT = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
 */
export function calculateMonthlyInstallment(
  principal: number,
  annualInterestPercent: number,
  tenureYears: number
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  if (annualInterestPercent <= 0) {
    return principal / (tenureYears * 12);
  }

  const monthlyRate = annualInterestPercent / 100 / 12;
  const totalMonths = tenureYears * 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const installment = (principal * (monthlyRate * factor)) / (factor - 1);
  return Math.round(installment);
}

/**
 * Reverses amortization to determine maximum loan for a given monthly payment limit.
 * P = PMT * [ (1+r)^n - 1 ] / [ r(1+r)^n ]
 */
export function calculatePrincipalFromInstallment(
  monthlyPayment: number,
  annualInterestPercent: number,
  tenureYears: number
): number {
  if (monthlyPayment <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualInterestPercent / 100 / 12;
  const totalMonths = tenureYears * 12;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const principal = (monthlyPayment * (factor - 1)) / (monthlyRate * factor);
  return Math.floor(principal);
}

/**
 * Performs full financial calculation for Singapore residential purchase.
 */
export function calculateAffordability(input: UserFinancialInput): CalculationResult {
  const {
    propertyType,
    purchasePrice,
    buyerCitizenship,
    propertyCount,
    loanType,
    loanTenureYears,
    interestRate,
    stressTestInterestRate,
    isDualApplicant,
    applicant1,
    applicant2,
    availableCashSavings,
    availableCpfOa,
    renovationBudget,
    conveyancingLegalFee,
    valuationFee,
    miscMovingReserve,
  } = input;

  // 1. STAMP DUTIES
  const bsdTiers = calculateBsd(purchasePrice);
  const bsd = Math.round(bsdTiers.reduce((acc, t) => acc + t.tax, 0));
  const absdRate = getAbsdRate(buyerCitizenship, propertyCount);
  const absd = Math.round(purchasePrice * absdRate);
  const totalStampDuty = bsd + absd;

  // 2. LTV & DOWNPAYMENT
  // HDB Concessionary Loan: LTV 75%, 25% downpayment (all CPF or Cash allowed, no 5% cash requirement)
  // Bank Loan: LTV 75%, 25% downpayment (minimum 5% cash mandatory, remaining 20% CPF or cash)
  const ltvPercentage = 0.75;
  const maxLoanAmount = Math.round(purchasePrice * ltvPercentage);
  const totalDownpayment = purchasePrice - maxLoanAmount;

  const minimumCashDownpayment =
    loanType === 'bank_loan'
      ? Math.round(purchasePrice * 0.05)
      : 0;

  const cpfOrCashDownpayment = totalDownpayment - minimumCashDownpayment;

  // Option to Purchase (OTP) Cash Flow
  // For Resale HDB: max $5,000 cash total ($1k option + $4k exercise)
  // For EC / Condo / Landed: typically 1% booking cash + 4% exercise cash (fits within 5% cash downpayment)
  const otpDepositCash =
    propertyType === 'hdb_resale'
      ? Math.min(1000, purchasePrice * 0.01)
      : Math.round(purchasePrice * 0.01);

  const otpExerciseCash =
    propertyType === 'hdb_resale'
      ? Math.min(4000, purchasePrice * 0.04)
      : Math.round(purchasePrice * 0.04);

  // Initial Out-Of-Pocket Breakdown
  // Stamp duty and CPF-eligible downpayment can utilize CPF OA if available.
  // Cash mandatory: minimum cash downpayment (5% if bank loan) + legal/valuation fees (cash upfront usually) + renovation + moving reserve.
  // Note: BSD & ABSD can be reimbursed or paid from CPF OA if OA balance covers it.
  
  // Total initial funds required
  const totalInitialRequired =
    totalDownpayment +
    totalStampDuty +
    conveyancingLegalFee +
    valuationFee +
    renovationBudget +
    miscMovingReserve;

  // CPF OA can fund: cpfOrCashDownpayment + BSD + ABSD + legalFee (if CPF lawyer used)
  const maximumCpfUsable = cpfOrCashDownpayment + totalStampDuty + conveyancingLegalFee;
  const actualCpfUsed = Math.min(availableCpfOa, maximumCpfUsable);
  
  // Remaining must be funded by cash
  const hardCashObligations =
    minimumCashDownpayment +
    valuationFee +
    renovationBudget +
    miscMovingReserve;

  const cpfFundingShortfallForEligibleItems = Math.max(0, maximumCpfUsable - actualCpfUsed);
  const totalCashRequired = hardCashObligations + cpfFundingShortfallForEligibleItems;
  const totalCpfRequired = actualCpfUsed;

  const cashShortfallOrSurplus = availableCashSavings - totalCashRequired;
  const cpfShortfallOrSurplus = availableCpfOa - actualCpfUsed;
  const isInitialCapitalSufficient = cashShortfallOrSurplus >= 0;

  const outOfPocket: OutOfPocketBreakdown = {
    minimumCashDownpayment,
    cpfOrCashDownpayment,
    totalDownpayment,
    ltvPercentage,
    maxLoanAmount,
    stampDuty: {
      bsd,
      bsdTiers,
      absdRate,
      absd,
      totalStampDuty,
    },
    legalFee: conveyancingLegalFee,
    valuationFee,
    renovationAndFurnishing: renovationBudget,
    miscReserve: miscMovingReserve,
    totalInitialRequired,
    totalCashRequired,
    totalCpfRequired,
    cashShortfallOrSurplus,
    cpfShortfallOrSurplus,
    isInitialCapitalSufficient,
    otpDepositCash,
    otpExerciseCash,
  };

  // 3. MONTHLY CASHFLOW & MORTGAGE
  const app1Gross = applicant1.monthlyFixedIncome + applicant1.monthlyVariableIncome;
  const app2Gross = isDualApplicant
    ? applicant2.monthlyFixedIncome + applicant2.monthlyVariableIncome
    : 0;
  const grossMonthlyIncome = app1Gross + app2Gross;

  // Recognized income with MAS 30% haircut on variable bonuses/commissions
  const app1Recognized =
    applicant1.monthlyFixedIncome + applicant1.monthlyVariableIncome * 0.7;
  const app2Recognized = isDualApplicant
    ? applicant2.monthlyFixedIncome + applicant2.monthlyVariableIncome * 0.7
    : 0;
  const recognizedMonthlyIncome = app1Recognized + app2Recognized;

  const combinedMonthlyCpfOa =
    applicant1.monthlyCpfContribution +
    (isDualApplicant ? applicant2.monthlyCpfContribution : 0);

  const totalExistingMonthlyDebts =
    applicant1.existingMonthlyDebts +
    (isDualApplicant ? applicant2.existingMonthlyDebts : 0);

  // Mortgage installments
  const monthlyMortgageActual = calculateMonthlyInstallment(
    maxLoanAmount,
    interestRate,
    loanTenureYears
  );

  const monthlyMortgageStress = calculateMonthlyInstallment(
    maxLoanAmount,
    stressTestInterestRate,
    loanTenureYears
  );

  // CPF OA contribution vs Out-of-pocket Cash needed for monthly installment
  const monthlyCpfOaUsed = Math.min(monthlyMortgageActual, combinedMonthlyCpfOa);
  const monthlyCashOutOfPocketRequired = Math.max(0, monthlyMortgageActual - monthlyCpfOaUsed);

  // Total monthly obligations
  const totalMonthlyObligations =
    monthlyCashOutOfPocketRequired + totalExistingMonthlyDebts;
  const netRemainingMonthlyCash =
    grossMonthlyIncome - combinedMonthlyCpfOa - totalMonthlyObligations;

  // 4. REGULATORY RATIOS (MAS & HDB)
  // MSR (Mortgage Servicing Ratio) applies to HDB BTO, HDB Resale, and EC: cap at 30% of recognized income at stress rate
  const msrApplicable =
    propertyType === 'hdb_bto' ||
    propertyType === 'hdb_resale' ||
    propertyType === 'ec';

  const msrActual = recognizedMonthlyIncome > 0
    ? (monthlyMortgageActual / recognizedMonthlyIncome) * 100
    : 0;
  const msrStress = recognizedMonthlyIncome > 0
    ? (monthlyMortgageStress / recognizedMonthlyIncome) * 100
    : 0;
  const msrPass = !msrApplicable || msrStress <= 30;

  // TDSR (Total Debt Servicing Ratio) applies to all loans: cap at 55% of recognized income at stress rate
  const tdsrActual = recognizedMonthlyIncome > 0
    ? ((monthlyMortgageActual + totalExistingMonthlyDebts) / recognizedMonthlyIncome) * 100
    : 0;
  const tdsrStress = recognizedMonthlyIncome > 0
    ? ((monthlyMortgageStress + totalExistingMonthlyDebts) / recognizedMonthlyIncome) * 100
    : 0;
  const tdsrPass = tdsrStress <= 55;

  const monthlyCashflow: MonthlyCashflowBreakdown = {
    grossMonthlyIncome,
    recognizedMonthlyIncome,
    combinedMonthlyCpfOa,
    totalExistingMonthlyDebts,
    monthlyMortgageActual,
    monthlyMortgageStress,
    monthlyCpfOaUsed,
    monthlyCashOutOfPocketRequired,
    totalMonthlyObligations,
    netRemainingMonthlyCash,
    msrActual,
    msrStress,
    msrApplicable,
    msrPass,
    msrLimit: 30,
    tdsrActual,
    tdsrStress,
    tdsrPass,
    tdsrLimit: 55,
  };

  // 5. MAX AFFORDABLE PRICE & BORROWING POWER
  // Max allowable monthly mortgage under TDSR:
  const maxMortgageByTdsr = Math.max(
    0,
    recognizedMonthlyIncome * 0.55 - totalExistingMonthlyDebts
  );

  // Max allowable monthly mortgage under MSR (if applicable):
  const maxMortgageByMsr = msrApplicable
    ? recognizedMonthlyIncome * 0.30
    : Infinity;

  const maxAllowableMortgage = Math.min(maxMortgageByTdsr, maxMortgageByMsr);
  
  const maxBorrowingPower = calculatePrincipalFromInstallment(
    maxAllowableMortgage,
    stressTestInterestRate,
    loanTenureYears
  );

  // Max purchase price supported by loan (75% LTV):
  const maxPriceByLoan = Math.round(maxBorrowingPower / ltvPercentage);

  // Max purchase price supported by total available capital (Cash + CPF OA):
  // Let total capital C = availableCashSavings + availableCpfOa - reno - legal - misc
  const netCapitalForProperty = Math.max(
    0,
    availableCashSavings +
      availableCpfOa -
      renovationBudget -
      conveyancingLegalFee -
      valuationFee -
      miscMovingReserve
  );
  // Roughly 25% downpayment + ~3-4% BSD => approx 29% of price needed upfront
  const estimatedUpfrontRatio = 0.285 + absdRate;
  const maxPriceByCapital = Math.round(netCapitalForProperty / estimatedUpfrontRatio);

  const maxAffordablePrice = Math.min(maxPriceByLoan, maxPriceByCapital);

  // 6. AFFORDABILITY VERDICT
  const reasons: AffordabilityVerdict['reasons'] = [];

  // Upfront capital check
  if (!isInitialCapitalSufficient) {
    reasons.push({
      type: 'danger',
      message: `Initial cash shortfall of $${Math.abs(cashShortfallOrSurplus).toLocaleString()} for downpayment, stamp duties, and renovation.`,
    });
  } else if (cashShortfallOrSurplus < 20000) {
    reasons.push({
      type: 'warning',
      message: `Remaining liquid cash buffer is low ($${cashShortfallOrSurplus.toLocaleString()}). Consider keeping 6 months of emergency reserves.`,
    });
  } else {
    reasons.push({
      type: 'success',
      message: `Upfront cash and CPF OA are fully sufficient with a healthy $${cashShortfallOrSurplus.toLocaleString()} liquid cash cushion.`,
    });
  }

  // MSR check
  if (msrApplicable) {
    if (!msrPass) {
      reasons.push({
        type: 'danger',
        message: `MSR of ${msrStress.toFixed(1)}% exceeds the statutory MAS 30% ceiling for HDB/EC at the 4.0% stress rate.`,
      });
    } else if (msrStress > 26) {
      reasons.push({
        type: 'warning',
        message: `MSR is ${msrStress.toFixed(1)}%, approaching the 30% regulatory ceiling.`,
      });
    } else {
      reasons.push({
        type: 'success',
        message: `MSR at ${msrStress.toFixed(1)}% is comfortably within the 30% MAS requirement.`,
      });
    }
  }

  // TDSR check
  if (!tdsrPass) {
    reasons.push({
      type: 'danger',
      message: `TDSR of ${tdsrStress.toFixed(1)}% exceeds the MAS 55% statutory limit due to mortgage and existing debts.`,
    });
  } else if (tdsrStress > 48) {
    reasons.push({
      type: 'warning',
      message: `TDSR is ${tdsrStress.toFixed(1)}%, close to the 55% cap. Reducing car or personal loans will expand borrowing power.`,
    });
  } else {
    reasons.push({
      type: 'success',
      message: `TDSR at ${tdsrStress.toFixed(1)}% easily satisfies the 55% MAS limit.`,
    });
  }

  // Monthly cashflow health check
  if (monthlyCashOutOfPocketRequired === 0) {
    reasons.push({
      type: 'success',
      message: `Monthly mortgage installment ($${monthlyMortgageActual.toLocaleString()}) is 100% covered by combined CPF OA monthly accrual! Zero cash top-up needed.`,
    });
  } else if (netRemainingMonthlyCash < 1000) {
    reasons.push({
      type: 'danger',
      message: `Net household cashflow after mortgage cash top-up ($${monthlyCashOutOfPocketRequired.toLocaleString()}/mo) and living costs is uncomfortably thin.`,
    });
  } else {
    reasons.push({
      type: 'success',
      message: `Monthly cash out-of-pocket top-up is manageable at $${monthlyCashOutOfPocketRequired.toLocaleString()}/mo, leaving $${netRemainingMonthlyCash.toLocaleString()}/mo free household cash.`,
    });
  }

  let status: AffordabilityStatus = 'comfortable';
  let headline = 'Comfortably Affordable';
  let summary =
    'Your financial profile satisfies all Singapore regulatory guidelines (MSR/TDSR), upfront capital reserves, and leaves positive monthly free cashflow.';

  const hasDanger = reasons.some((r) => r.type === 'danger');
  const hasWarning = reasons.some((r) => r.type === 'warning');

  if (hasDanger) {
    status = 'unaffordable';
    headline = 'Exceeds Feasibility Limits';
    summary =
      'This property does not currently pass MAS regulatory borrowing caps (MSR/TDSR) or has an upfront cash shortfall. Adjust purchase price, reduce debts, or increase cash downpayment.';
  } else if (hasWarning) {
    status = 'stretch';
    headline = 'Affordable with Financial Stretch';
    summary =
      'You qualify under MAS lending rules, but liquid reserves or monthly cashflow will be tight. Review contingency funds and interest rate sensitivity.';
  }

  const verdict: AffordabilityVerdict = {
    status,
    headline,
    summary,
    reasons,
    maxBorrowingPower,
    maxAffordablePrice,
  };

  return {
    inputs: input,
    outOfPocket,
    monthlyCashflow,
    verdict,
  };
}
