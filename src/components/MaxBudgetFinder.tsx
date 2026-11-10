/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResult } from '../types/calculator';
import {
  calculatePrincipalFromInstallment,
  getAbsdRate,
} from '../utils/calculator';
import { Compass, Lightbulb, ArrowRight } from 'lucide-react';

interface MaxBudgetFinderProps {
  result: CalculationResult;
  onApplyPrice: (price: number) => void;
}

export const MaxBudgetFinder: React.FC<MaxBudgetFinderProps> = ({
  result,
  onApplyPrice,
}) => {
  const { inputs, monthlyCashflow } = result;

  const recognizedIncome = monthlyCashflow.recognizedMonthlyIncome;
  const existingDebts = monthlyCashflow.totalExistingMonthlyDebts;
  const stressRate = inputs.stressTestInterestRate;
  const absdRate = getAbsdRate(inputs.buyerCitizenship, inputs.propertyCount);

  // Available capital for property downpayment & stamp duties
  const liquidFunds = Math.max(
    0,
    inputs.availableCashSavings +
      inputs.availableCpfOa -
      inputs.renovationBudget -
      inputs.conveyancingLegalFee -
      inputs.valuationFee -
      inputs.miscMovingReserve
  );

  // Capital constrained max price: approx 25% downpayment + 3-4% BSD + ABSD
  const capitalMultiplier = 0.285 + absdRate;
  const maxPriceByCapital = Math.round(liquidFunds / capitalMultiplier);

  // Scenario 1: HDB BTO / Resale (25-year tenure max, 30% MSR cap)
  const hdbMaxMonthlyMortgage = recognizedIncome * 0.30;
  const hdbMaxLoan = calculatePrincipalFromInstallment(hdbMaxMonthlyMortgage, stressRate, 25);
  const hdbPriceByLoan = Math.round(hdbMaxLoan / 0.75);
  const hdbRealisticMax = Math.min(hdbPriceByLoan, maxPriceByCapital);

  // Scenario 2: Executive Condominium (30-year tenure max, 30% MSR cap)
  const ecMaxMonthlyMortgage = recognizedIncome * 0.30;
  const ecMaxLoan = calculatePrincipalFromInstallment(ecMaxMonthlyMortgage, stressRate, 30);
  const ecPriceByLoan = Math.round(ecMaxLoan / 0.75);
  const ecRealisticMax = Math.min(ecPriceByLoan, maxPriceByCapital);

  // Scenario 3: Private Condo (30-year tenure max, 55% TDSR cap, no MSR)
  const privateMaxMonthlyMortgage = Math.max(0, recognizedIncome * 0.55 - existingDebts);
  const privateMaxLoan = calculatePrincipalFromInstallment(
    privateMaxMonthlyMortgage,
    stressRate,
    30
  );
  const privatePriceByLoan = Math.round(privateMaxLoan / 0.75);
  const privateRealisticMax = Math.min(privatePriceByLoan, maxPriceByCapital);

  const bindingConstraint =
    maxPriceByCapital < privatePriceByLoan
      ? 'Liquid Capital / Downpayment (Cash + CPF OA)'
      : 'MAS Debt Servicing Ceiling (TDSR / MSR)';

  return (
    <div
      id="max-budget"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Maximum Purchasing Power Across Singapore Property Tiers
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reverse-engineered from your current household income, debt profile, and liquid capital reserves.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Primary Limiting Factor</span>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block mt-0.5">
            {bindingConstraint}
          </span>
        </div>
      </div>

      {/* Property Tiers Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: HDB Flat */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                HDB BTO / Resale
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                30% MSR · 25y
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              S${hdbRealisticMax.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Max theoretical loan: S${hdbMaxLoan.toLocaleString()}
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-2.5">
              <div className="flex justify-between">
                <span>Max MSR Installment:</span>
                <span className="font-mono text-slate-800">
                  S${Math.round(hdbMaxMonthlyMortgage).toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Downpayment:</span>
                <span className="font-mono text-slate-800">
                  S${Math.round(hdbRealisticMax * 0.25).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onApplyPrice(hdbRealisticMax)}
            className="mt-4 w-full py-2 px-3 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Test this Price ({hdbRealisticMax >= 1000000 ? `${(hdbRealisticMax / 1000000).toFixed(2)}M` : `${Math.round(hdbRealisticMax / 1000)}k`})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tier 2: Executive Condominium */}
        <div className="border border-emerald-300 rounded-lg p-4 bg-emerald-50/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Executive Condo (EC)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                30% MSR · 30y
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-emerald-950 mt-1">
              S${ecRealisticMax.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Max theoretical loan: S${ecMaxLoan.toLocaleString()}
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-emerald-200 pt-2.5">
              <div className="flex justify-between">
                <span>Max MSR Installment:</span>
                <span className="font-mono text-slate-800">
                  S${Math.round(ecMaxMonthlyMortgage).toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span>Min 5% Cash Down:</span>
                <span className="font-mono text-slate-800">
                  S${Math.round(ecRealisticMax * 0.05).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onApplyPrice(ecRealisticMax)}
            className="mt-4 w-full py-2 px-3 text-xs font-medium text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Test this Price ({ecRealisticMax >= 1000000 ? `${(ecRealisticMax / 1000000).toFixed(2)}M` : `${Math.round(ecRealisticMax / 1000)}k`})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tier 3: Private Condo */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Private Condo / Apt
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                55% TDSR · 30y
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              S${privateRealisticMax.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Max theoretical loan: S${privateMaxLoan.toLocaleString()}
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-2.5">
              <div className="flex justify-between">
                <span>Max TDSR Mortgage:</span>
                <span className="font-mono text-slate-800">
                  S${Math.round(privateMaxMonthlyMortgage).toLocaleString()}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. BSD + ABSD:</span>
                <span className="font-mono text-slate-800">
                  S${Math.round(privateRealisticMax * (0.035 + absdRate)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onApplyPrice(privateRealisticMax)}
            className="mt-4 w-full py-2 px-3 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Test this Price ({privateRealisticMax >= 1000000 ? `${(privateRealisticMax / 1000000).toFixed(2)}M` : `${Math.round(privateRealisticMax / 1000)}k`})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Strategies to Increase Purchasing Power */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2 text-xs">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>How to Expand Borrowing Capacity in Singapore</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-600">
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <strong className="text-slate-800 block mb-0.5">1. Clear Car Loans & Revolving Debt</strong>
            Every $500/month of existing debt commitment reduces your maximum housing loan by approximately ~$88,000 under TDSR.
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <strong className="text-slate-800 block mb-0.5">2. Add Working Co-Borrower</strong>
            Adding a spouse pools recognized income, directly elevating your MSR 30% and TDSR 55% monthly caps.
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <strong className="text-slate-800 block mb-0.5">3. Maintain Capital Buffer</strong>
            Remember to hold at least 6 months of living expenses + mortgage payments in liquid cash/CPF OA after completing your purchase.
          </div>
        </div>
      </div>
    </div>
  );
};
