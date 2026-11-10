/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserFinancialInput, ApplicantProfile } from '../types/calculator';
import { Wallet, Users, User, ShieldAlert, Sparkles } from 'lucide-react';

interface FinancialProfileInputProps {
  input: UserFinancialInput;
  onChange: (updater: (prev: UserFinancialInput) => UserFinancialInput) => void;
}

export const FinancialProfileInput: React.FC<FinancialProfileInputProps> = ({
  input,
  onChange,
}) => {
  const updateApplicant = (
    key: 'applicant1' | 'applicant2',
    field: keyof ApplicantProfile,
    value: number
  ) => {
    onChange((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: Math.max(0, value),
      },
    }));
  };

  // Auto-estimate CPF OA contribution (~23% of salary capped at current CPF monthly wage ceiling $6,800-$8,000)
  const autoEstimateCpfOa = (key: 'applicant1' | 'applicant2') => {
    const salary = input[key].monthlyFixedIncome;
    const cappedWage = Math.min(salary, 6800);
    // OA rate for < 35 is 23%
    const estimatedOa = Math.round(cappedWage * 0.23);
    updateApplicant(key, 'monthlyCpfContribution', estimatedOa);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <Wallet className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            2. Household Cashflow & Capital
          </h2>
        </div>

        {/* Dual vs Single applicant toggle */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, isDualApplicant: false }))}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              !input.isDualApplicant
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Single</span>
          </button>
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, isDualApplicant: true }))}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              input.isDualApplicant
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Joint (2 Buyers)</span>
          </button>
        </div>
      </div>

      {/* Applicant 1 Inputs */}
      <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
            Applicant 1 (Main Earner)
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Age: {input.applicant1.age}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Fixed Salary (Monthly)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={100}
                value={input.applicant1.monthlyFixedIncome}
                onChange={(e) =>
                  updateApplicant('applicant1', 'monthlyFixedIncome', Number(e.target.value))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Variable (Bonus/Comms)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={100}
                value={input.applicant1.monthlyVariableIncome}
                onChange={(e) =>
                  updateApplicant('applicant1', 'monthlyVariableIncome', Number(e.target.value))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600">
                Monthly CPF OA
              </label>
              <button
                type="button"
                onClick={() => autoEstimateCpfOa('applicant1')}
                className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5"
                title="Auto calculate ~23% of wage"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Auto</span>
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={50}
                value={input.applicant1.monthlyCpfContribution}
                onChange={(e) =>
                  updateApplicant('applicant1', 'monthlyCpfContribution', Number(e.target.value))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Existing Debts / Month
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={50}
                value={input.applicant1.existingMonthlyDebts}
                onChange={(e) =>
                  updateApplicant('applicant1', 'existingMonthlyDebts', Number(e.target.value))
                }
                placeholder="Car / Cards"
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Applicant 2 Inputs (Conditional on Joint) */}
      {input.isDualApplicant && (
        <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Applicant 2 (Co-Borrower)
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Age: {input.applicant2.age}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Fixed Salary (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  step={100}
                  value={input.applicant2.monthlyFixedIncome}
                  onChange={(e) =>
                    updateApplicant('applicant2', 'monthlyFixedIncome', Number(e.target.value))
                  }
                  className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Variable (Bonus/Comms)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  step={100}
                  value={input.applicant2.monthlyVariableIncome}
                  onChange={(e) =>
                    updateApplicant('applicant2', 'monthlyVariableIncome', Number(e.target.value))
                  }
                  className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Monthly CPF OA
                </label>
                <button
                  type="button"
                  onClick={() => autoEstimateCpfOa('applicant2')}
                  className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5"
                  title="Auto calculate ~23% of wage"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Auto</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  step={50}
                  value={input.applicant2.monthlyCpfContribution}
                  onChange={(e) =>
                    updateApplicant('applicant2', 'monthlyCpfContribution', Number(e.target.value))
                  }
                  className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Existing Debts / Month
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  $
                </span>
                <input
                  type="number"
                  step={50}
                  value={input.applicant2.existingMonthlyDebts}
                  onChange={(e) =>
                    updateApplicant('applicant2', 'existingMonthlyDebts', Number(e.target.value))
                  }
                  placeholder="Car / Cards"
                  className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-medium rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Savings & Capital */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Initial Available Capital (For Downpayment & Expenses)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Liquid Cash Savings
              </label>
              <span className="text-[11px] text-slate-500">Bank deposits / cash</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
                S$
              </span>
              <input
                type="number"
                step={5000}
                value={input.availableCashSavings}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    availableCashSavings: Number(e.target.value),
                  }))
                }
                className="w-full pl-9 pr-3 py-2 text-sm font-semibold font-mono text-slate-900 rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                CPF Ordinary Account (OA) Balance
              </label>
              <span className="text-[11px] text-slate-500">Combined CPF OA</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">
                S$
              </span>
              <input
                type="number"
                step={5000}
                value={input.availableCpfOa}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    availableCpfOa: Number(e.target.value),
                  }))
                }
                className="w-full pl-9 pr-3 py-2 text-sm font-semibold font-mono text-slate-900 rounded-md border border-slate-300 bg-white outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Incidental Out-of-Pocket Outlays */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Incidental & Move-in Expenses
          </label>
          <span className="text-[11px] text-slate-500">
            Hard out-of-pocket costs to budget for
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Renovation & Furnishing
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={2000}
                value={input.renovationBudget}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    renovationBudget: Number(e.target.value),
                  }))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono rounded-md border border-slate-300 bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Legal Conveyancing Fee
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={200}
                value={input.conveyancingLegalFee}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    conveyancingLegalFee: Number(e.target.value),
                  }))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono rounded-md border border-slate-300 bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Bank / HDB Valuation Fee
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={50}
                value={input.valuationFee}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    valuationFee: Number(e.target.value),
                  }))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono rounded-md border border-slate-300 bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Emergency Moving Buffer
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                $
              </span>
              <input
                type="number"
                step={1000}
                value={input.miscMovingReserve}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    miscMovingReserve: Number(e.target.value),
                  }))
                }
                className="w-full pl-6 pr-2 py-1.5 text-xs font-mono rounded-md border border-slate-300 bg-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
