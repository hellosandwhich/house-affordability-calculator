/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResult } from '../types/calculator';
import { Scale, ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

interface RegulatoryComplianceCardProps {
  result: CalculationResult;
}

export const RegulatoryComplianceCard: React.FC<RegulatoryComplianceCardProps> = ({
  result,
}) => {
  const { monthlyCashflow, inputs } = result;

  const msrBarWidth = Math.min(100, (monthlyCashflow.msrStress / 30) * 100);
  const tdsrBarWidth = Math.min(100, (monthlyCashflow.tdsrStress / 55) * 100);

  return (
    <div
      id="regulatory-limits"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Singapore MAS Regulatory Lending Rules (MSR & TDSR)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monetary Authority of Singapore (MAS) statutory borrowing limits evaluated under the official 4.00% stress-test rate.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Recognized Income (after 30% hair-cut)</span>
          <span className="text-sm font-bold font-mono text-slate-900">
            S${monthlyCashflow.recognizedMonthlyIncome.toLocaleString()}/mo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MSR Pillar */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Mortgage Servicing Ratio (MSR)
              </span>
              <span className="text-[11px] text-slate-500">
                {monthlyCashflow.msrApplicable
                  ? 'Applies to HDB BTO, Resale Flats & ECs'
                  : 'N/A for Private Property & Landed'}
              </span>
            </div>

            {monthlyCashflow.msrApplicable ? (
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  monthlyCashflow.msrPass
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {monthlyCashflow.msrPass ? 'PASSED (<30%)' : 'EXCEEDED (>30%)'}
              </span>
            ) : (
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                EXEMPT
              </span>
            )}
          </div>

          {monthlyCashflow.msrApplicable ? (
            <>
              {/* Progress gauge */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-600">
                    Stress Rate (4.0%):{' '}
                    <strong className="text-slate-900">
                      {monthlyCashflow.msrStress.toFixed(1)}%
                    </strong>
                  </span>
                  <span className="text-slate-500 font-semibold">Statutory Cap: 30.0%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
                  {/* 30% line marker */}
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-slate-500 z-10" />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      monthlyCashflow.msrStress <= 26
                        ? 'bg-emerald-600'
                        : monthlyCashflow.msrStress <= 30
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                    style={{ width: `${Math.min(100, (monthlyCashflow.msrStress / 30) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Mortgage at Stress Rate (4.0%):</span>
                  <span className="font-mono font-medium text-slate-900">
                    S${monthlyCashflow.monthlyMortgageStress.toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Monthly Mortgage Allowed (30% cap):</span>
                  <span className="font-mono font-medium text-slate-900">
                    S${Math.round(monthlyCashflow.recognizedMonthlyIncome * 0.3).toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Contract Rate MSR ({inputs.interestRate}%):</span>
                  <span className="font-mono font-medium text-slate-700">
                    {monthlyCashflow.msrActual.toFixed(1)}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-md bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
              MSR does not apply to private residential condominiums or landed properties. Only the 55% TDSR rule and standard credit underwriting govern your private home loan.
            </div>
          )}
        </div>

        {/* TDSR Pillar */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Total Debt Servicing Ratio (TDSR)
              </span>
              <span className="text-[11px] text-slate-500">
                Mandatory for ALL residential properties in SG
              </span>
            </div>

            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                monthlyCashflow.tdsrPass
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {monthlyCashflow.tdsrPass ? 'PASSED (<55%)' : 'EXCEEDED (>55%)'}
            </span>
          </div>

          {/* Progress gauge */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-600">
                Stress Rate (4.0%):{' '}
                <strong className="text-slate-900">
                  {monthlyCashflow.tdsrStress.toFixed(1)}%
                </strong>
              </span>
              <span className="text-slate-500 font-semibold">Statutory Cap: 55.0%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  monthlyCashflow.tdsrStress <= 48
                    ? 'bg-emerald-600'
                    : monthlyCashflow.tdsrStress <= 55
                    ? 'bg-amber-500'
                    : 'bg-rose-600'
                }`}
                style={{ width: `${Math.min(100, (monthlyCashflow.tdsrStress / 55) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <div className="flex justify-between">
              <span>Mortgage (Stress 4.0%) + Debts:</span>
              <span className="font-mono font-medium text-slate-900">
                S$
                {(
                  monthlyCashflow.monthlyMortgageStress +
                  monthlyCashflow.totalExistingMonthlyDebts
                ).toLocaleString()}
                /mo
              </span>
            </div>
            <div className="flex justify-between">
              <span>Max Allowable Total Debt Service (55% cap):</span>
              <span className="font-mono font-medium text-slate-900">
                S${Math.round(monthlyCashflow.recognizedMonthlyIncome * 0.55).toLocaleString()}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Monthly Borrowing Headroom:</span>
              <span
                className={`font-mono font-bold ${
                  monthlyCashflow.tdsrPass ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                S$
                {Math.max(
                  0,
                  Math.round(
                    monthlyCashflow.recognizedMonthlyIncome * 0.55 -
                      (monthlyCashflow.monthlyMortgageStress +
                        monthlyCashflow.totalExistingMonthlyDebts)
                  )
                ).toLocaleString()}
                /mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Underwriting Rules Explanatory Box */}
      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
          <span>MAS Credit Underwriting Invariants</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>
            <strong>Variable Income 30% Haircut:</strong> Variable earnings (performance bonus, sales commissions, overtime) are legally discounted by 30% by Singapore lenders before computing MSR and TDSR.
          </li>
          <li>
            <strong>Medium-Term Stress Interest Rate (4.00% p.a.):</strong> Banks in Singapore must stress-test residential borrowers at a minimum interest rate floor of 4.00% (or actual rate + benchmark margin, whichever is higher) to ensure resilience against rising interest rates.
          </li>
        </ul>
      </div>
    </div>
  );
};
