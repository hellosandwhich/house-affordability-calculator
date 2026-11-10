/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetScenario } from '../types/calculator';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'bto_couple',
    title: 'First-Timer Couple: 4-Room BTO',
    subtitle: 'Standard HDB BTO Flat in Non-Mature Estate with HDB Housing Loan',
    propertyType: 'hdb_bto',
    tag: 'BTO Flat · S$460k',
    data: {
      propertyType: 'hdb_bto',
      purchasePrice: 460000,
      buyerCitizenship: 'sc_couple',
      propertyCount: 'first',
      loanType: 'hdb_loan',
      loanTenureYears: 25,
      interestRate: 2.6,
      stressTestInterestRate: 4.0,

      isDualApplicant: true,
      applicant1: {
        age: 29,
        monthlyFixedIncome: 5200,
        monthlyVariableIncome: 500,
        monthlyCpfContribution: 1200,
        existingMonthlyDebts: 0,
      },
      applicant2: {
        age: 28,
        monthlyFixedIncome: 4800,
        monthlyVariableIncome: 400,
        monthlyCpfContribution: 1100,
        existingMonthlyDebts: 350, // student loan
      },

      availableCashSavings: 55000,
      availableCpfOa: 75000,

      renovationBudget: 42000,
      conveyancingLegalFee: 1200,
      valuationFee: 150,
      miscMovingReserve: 5000,
    },
  },
  {
    id: 'resale_family',
    title: 'HDB Resale: 5-Room in Queenstown / Bishan',
    subtitle: 'Mature estate 5-Room flat with commercial bank loan and CPF OA usage',
    propertyType: 'hdb_resale',
    tag: 'Resale HDB · S$890k',
    data: {
      propertyType: 'hdb_resale',
      purchasePrice: 890000,
      buyerCitizenship: 'sc_couple',
      propertyCount: 'first',
      loanType: 'bank_loan',
      loanTenureYears: 25,
      interestRate: 3.0,
      stressTestInterestRate: 4.0,

      isDualApplicant: true,
      applicant1: {
        age: 34,
        monthlyFixedIncome: 7000,
        monthlyVariableIncome: 1200,
        monthlyCpfContribution: 1564,
        existingMonthlyDebts: 650, // car loan
      },
      applicant2: {
        age: 33,
        monthlyFixedIncome: 6200,
        monthlyVariableIncome: 800,
        monthlyCpfContribution: 1426,
        existingMonthlyDebts: 0,
      },

      availableCashSavings: 110000,
      availableCpfOa: 165000,

      renovationBudget: 60000,
      conveyancingLegalFee: 2000,
      valuationFee: 280,
      miscMovingReserve: 6000,
    },
  },
  {
    id: 'ec_upgrader',
    title: 'Executive Condominium (EC): New Launch',
    subtitle: 'Upgrader couple buying 3-Bedroom EC with MSR 30% qualification',
    propertyType: 'ec',
    tag: 'Executive Condo · S$1.45M',
    data: {
      propertyType: 'ec',
      purchasePrice: 1450000,
      buyerCitizenship: 'sc_couple',
      propertyCount: 'first',
      loanType: 'bank_loan',
      loanTenureYears: 30,
      interestRate: 3.0,
      stressTestInterestRate: 4.0,

      isDualApplicant: true,
      applicant1: {
        age: 36,
        monthlyFixedIncome: 8500,
        monthlyVariableIncome: 1500,
        monthlyCpfContribution: 1610,
        existingMonthlyDebts: 800, // car loan
      },
      applicant2: {
        age: 35,
        monthlyFixedIncome: 7500,
        monthlyVariableIncome: 1000,
        monthlyCpfContribution: 1520,
        existingMonthlyDebts: 0,
      },

      availableCashSavings: 180000,
      availableCpfOa: 220000,

      renovationBudget: 45000,
      conveyancingLegalFee: 2600,
      valuationFee: 350,
      miscMovingReserve: 8000,
    },
  },
  {
    id: 'private_ocr',
    title: 'Single Professional: 2-Bedder Condo (OCR)',
    subtitle: 'Outside Central Region new/resale condo under private TDSR (55%)',
    propertyType: 'private_condo',
    tag: 'Private Condo · S$1.35M',
    data: {
      propertyType: 'private_condo',
      purchasePrice: 1350000,
      buyerCitizenship: 'sc_single',
      propertyCount: 'first',
      loanType: 'bank_loan',
      loanTenureYears: 30,
      interestRate: 3.0,
      stressTestInterestRate: 4.0,

      isDualApplicant: false,
      applicant1: {
        age: 32,
        monthlyFixedIncome: 9800,
        monthlyVariableIncome: 1800,
        monthlyCpfContribution: 1564,
        existingMonthlyDebts: 450,
      },
      applicant2: {
        age: 30,
        monthlyFixedIncome: 0,
        monthlyVariableIncome: 0,
        monthlyCpfContribution: 0,
        existingMonthlyDebts: 0,
      },

      availableCashSavings: 140000,
      availableCpfOa: 130000,

      renovationBudget: 35000,
      conveyancingLegalFee: 2800,
      valuationFee: 350,
      miscMovingReserve: 5000,
    },
  },
  {
    id: 'prime_condo',
    title: 'Dual-Income Family: Prime Condo (CCR / RCR)',
    subtitle: 'Freehold/99-yr 3-bedroom city fringe home with high borrowing power',
    propertyType: 'private_condo',
    tag: 'Prime Condo · S$2.5M',
    data: {
      propertyType: 'private_condo',
      purchasePrice: 2500000,
      buyerCitizenship: 'sc_couple',
      propertyCount: 'first',
      loanType: 'bank_loan',
      loanTenureYears: 30,
      interestRate: 3.0,
      stressTestInterestRate: 4.0,

      isDualApplicant: true,
      applicant1: {
        age: 38,
        monthlyFixedIncome: 14500,
        monthlyVariableIncome: 3000,
        monthlyCpfContribution: 1564,
        existingMonthlyDebts: 1200,
      },
      applicant2: {
        age: 37,
        monthlyFixedIncome: 11000,
        monthlyVariableIncome: 2000,
        monthlyCpfContribution: 1564,
        existingMonthlyDebts: 0,
      },

      availableCashSavings: 380000,
      availableCpfOa: 320000,

      renovationBudget: 80000,
      conveyancingLegalFee: 3200,
      valuationFee: 450,
      miscMovingReserve: 10000,
    },
  },
];
