/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResult } from '../types/calculator';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface MonthlyCashflowCardProps {
  result: CalculationResult;
}

export const MonthlyCashflowCard: React.FC<MonthlyCashflowCardProps> = ({
  result,
}) => {
  const { monthlyCashflow, inputs, outOfPocket } = result;

  const totalHouseholdGross = monthlyCashflow.grossMonthlyIncome;
  const cpfDeductionRate =
    totalHouseholdGross > 0
      ? Math.round((monthlyCashflow.combinedMonthlyCpfOa / totalHouseholdGross) * 100)
      : 0;

  const mortgagePortionPct =
    totalHouseholdGross > 0
      ? Math.round((monthlyCashflow.monthlyMortgageActual / totalHouseholdGross) * 100)
      : 0;

  const existingDebtPct =
    totalHouseholdGross > 0
      ? Math.round((monthlyCashflow.totalExistingMonthlyDebts / totalHouseholdGross) * 100)
      : 0;

  const netCashPct =
    totalHouseholdGross > 0
      ? Math.max(0, Math.round((monthlyCashflow.netRemainingMonthlyCash / totalHouseholdGross) * 100))
      : 0;

  return (
    <div
      id="monthly-cashflow"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Monthly Cashflow & Mortgage Servicing Dynamics
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing whether monthly CPF OA contributions cover the mortgage installment and your remaining take-home cash.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Net Monthly Free Cash</span>
          <span
            className={`text-xl font-bold font-mono ${
              monthlyCashflow.netRemainingMonthlyCash >= 1500
                ? 'text-emerald-700'
                : monthlyCashflow.netRemainingMonthlyCash > 0
                ? 'text-amber-700'
                : 'text-rose-700'
            }`}
          >
            S${monthlyCashflow.netRemainingMonthlyCash.toLocaleString()}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </span>
        </div>
      </div>

      {/* Visual Servicing Mechanism: CPF OA vs Hard Cash */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Mortgage Servicing Split: S${monthlyCashflow.monthlyMortgageActual.toLocaleString()}/month
          </span>
          <span className="text-xs font-mono text-slate-500">
            Loan: S${outOfPocket.maxLoanAmount.toLocaleString()} @ {inputs.interestRate}%
          </span>
        </div>

        {/* Visual Stacked Bar */}
        <div className="w-full h-8 bg-slate-200 rounded-lg overflow-hidden flex mb-2">
          {monthlyCashflow.monthlyCpfOaUsed > 0 && (
            <div
              className="bg-blue-600 h-full flex items-center justify-center text-white text-xs font-semibold font-mono transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (monthlyCashflow.monthlyCpfOaUsed / monthlyCashflow.monthlyMortgageActual) * 100
                )}%`,
              }}
              title={`CPF OA portion: S$${monthlyCashflow.monthlyCpfOaUsed.toLocaleString()}`}
            >
              CPF OA S${monthlyCashflow.monthlyCpfOaUsed.toLocaleString()}
            </div>
          )}

          {monthlyCashflow.monthlyCashOutOfPocketRequired > 0 && (
            <div
              className="bg-emerald-600 h-full flex items-center justify-center text-white text-xs font-semibold font-mono transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (monthlyCashflow.monthlyCashOutOfPocketRequired /
                    monthlyCashflow.monthlyMortgageActual) *
                    100
                )}%`,
              }}
              title={`Cash top-up: S$${monthlyCashflow.monthlyCashOutOfPocketRequired.toLocaleString()}`}
            >
              Cash S${monthlyCashflow.monthlyCashOutOfPocketRequired.toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-600 font-sans pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
            <span>
              <strong>CPF OA Contribution Used:</strong> S$
              {monthlyCashflow.monthlyCpfOaUsed.toLocaleString()}/mo (
              {(
                (monthlyCashflow.monthlyCpfOaUsed /
                  Math.max(1, monthlyCashflow.monthlyMortgageActual)) *
                100
              ).toFixed(0)}
              %)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
            <span>
              <strong>Out-of-Pocket Cash Top-Up:</strong> S$
              {monthlyCashflow.monthlyCashOutOfPocketRequired.toLocaleString()}/mo
            </span>
          </div>
        </div>

        {monthlyCashflow.monthlyCashOutOfPocketRequired === 0 ? (
          <div className="mt-3 p-2.5 rounded bg-emerald-100/60 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Zero Cash Top-Up Required:</strong> Your combined monthly CPF OA accrual (S$
              {monthlyCashflow.combinedMonthlyCpfOa.toLocaleString()}) fully absorbs the entire monthly mortgage installment!
            </span>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span>
              You will need to pay <strong>S${monthlyCashflow.monthlyCashOutOfPocketRequired.toLocaleString()}</strong> from take-home bank cash each month after exhausting CPF OA accrual.
            </span>
          </div>
        )}
      </div>

      {/* Monthly Household Cashflow Waterfall Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inflows & Deductions */}
        <div className="border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Household Monthly Inflows & Forced Savings
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">Applicant 1 Gross Income:</span>
            <span className="font-mono font-semibold text-slate-900">
              S$
              {(
                inputs.applicant1.monthlyFixedIncome +
                inputs.applicant1.monthlyVariableIncome
              ).toLocaleString()}
            </span>
          </div>

          {inputs.isDualApplicant && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Applicant 2 Gross Income:</span>
              <span className="font-mono font-semibold text-slate-900">
                S$
                {(
                  inputs.applicant2.monthlyFixedIncome +
                  inputs.applicant2.monthlyVariableIncome
                ).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100 font-medium">
            <span className="text-slate-900">Total Gross Household Income:</span>
            <span className="font-mono font-bold text-slate-900">
              S${monthlyCashflow.grossMonthlyIncome.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-blue-700 bg-blue-50/50 p-2 rounded">
            <span>Combined CPF OA Monthly Accrual:</span>
            <span className="font-mono font-bold">
              +S${monthlyCashflow.combinedMonthlyCpfOa.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Monthly Outflows & Net Balance */}
        <div className="border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Household Monthly Debt & Cash Outflows
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">Mortgage Cash Top-Up:</span>
            <span className="font-mono font-semibold text-slate-900">
              S${monthlyCashflow.monthlyCashOutOfPocketRequired.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">Car Loans, Cards & Personal Debts:</span>
            <span className="font-mono font-semibold text-slate-900">
              S${monthlyCashflow.totalExistingMonthlyDebts.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100 font-medium">
            <span className="text-slate-900">Total Monthly Debt Service:</span>
            <span className="font-mono font-bold text-slate-900">
              S${monthlyCashflow.totalMonthlyObligations.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-emerald-800 bg-emerald-50/60 p-2 rounded">
            <span>Remaining Take-Home Household Cash:</span>
            <span className="font-mono font-bold text-base">
              S${monthlyCashflow.netRemainingMonthlyCash.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
