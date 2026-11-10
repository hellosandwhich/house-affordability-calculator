/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  PropertyType,
  BuyerCitizenship,
  PropertyCount,
  LoanType,
  UserFinancialInput,
} from '../types/calculator';
import { Building, Info, Percent } from 'lucide-react';
import { getAbsdRate } from '../utils/calculator';

interface PropertyProfileInputProps {
  input: UserFinancialInput;
  onChange: (updater: (prev: UserFinancialInput) => UserFinancialInput) => void;
  onOpenStampDutyGuide: () => void;
}

export const PropertyProfileInput: React.FC<PropertyProfileInputProps> = ({
  input,
  onChange,
  onOpenStampDutyGuide,
}) => {
  const currentAbsdRate = getAbsdRate(input.buyerCitizenship, input.propertyCount);

  const handlePropertyTypeChange = (type: PropertyType) => {
    onChange((prev) => {
      let nextLoan = prev.loanType;
      let nextTenure = prev.loanTenureYears;
      let nextInterest = prev.interestRate;

      // HDB loans are not available for EC, Private, or Landed
      if (type === 'ec' || type === 'private_condo' || type === 'landed') {
        nextLoan = 'bank_loan';
        if (nextInterest === 2.6) nextInterest = 3.0;
      } else {
        // For HDB
        if (nextLoan === 'hdb_loan') {
          nextInterest = 2.6;
          nextTenure = Math.min(25, nextTenure);
        }
      }

      return {
        ...prev,
        propertyType: type,
        loanType: nextLoan,
        loanTenureYears: nextTenure,
        interestRate: nextInterest,
      };
    });
  };

  const handlePriceChange = (amount: number) => {
    onChange((prev) => ({
      ...prev,
      purchasePrice: Math.max(100000, amount),
    }));
  };

  const adjustPrice = (delta: number) => {
    onChange((prev) => ({
      ...prev,
      purchasePrice: Math.max(100000, prev.purchasePrice + delta),
    }));
  };

  const isHdbEligible =
    input.propertyType === 'hdb_bto' || input.propertyType === 'hdb_resale';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <Building className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            1. Property & Financing Details
          </h2>
        </div>
        <button
          onClick={onOpenStampDutyGuide}
          type="button"
          className="text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>IRAS Stamp Duty Guide</span>
        </button>
      </div>

      {/* Property Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Property Classification
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'hdb_bto', label: 'HDB BTO', note: 'New build' },
            { id: 'hdb_resale', label: 'HDB Resale', note: 'Open market' },
            { id: 'ec', label: 'Exec Condo', note: 'EC 30% MSR' },
            { id: 'private_condo', label: 'Private Condo', note: 'Private apt' },
            { id: 'landed', label: 'Landed', note: 'Terrace/Semi-D' },
          ].map((item) => {
            const isSelected = input.propertyType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePropertyTypeChange(item.id as PropertyType)}
                className={`py-2 px-3 text-left rounded-lg border transition-all text-xs ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-medium text-slate-900">{item.label}</div>
                <div className="text-[11px] text-slate-500">{item.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purchase Price Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Target Purchase Price (SGD)
          </label>
          <span className="text-xs text-slate-500 font-mono">
            S${input.purchasePrice.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
              S$
            </span>
            <input
              type="number"
              min={100000}
              step={10000}
              value={input.purchasePrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-base font-semibold text-slate-900 font-mono rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => adjustPrice(-50000)}
              className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700"
            >
              -$50k
            </button>
            <button
              type="button"
              onClick={() => adjustPrice(-10000)}
              className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700"
            >
              -$10k
            </button>
            <button
              type="button"
              onClick={() => adjustPrice(10000)}
              className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700"
            >
              +$10k
            </button>
            <button
              type="button"
              onClick={() => adjustPrice(50000)}
              className="px-2.5 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700"
            >
              +$50k
            </button>
          </div>
        </div>
      </div>

      {/* Buyer Profile & ABSD Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Buyer Residency / Citizenship
          </label>
          <select
            value={input.buyerCitizenship}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                buyerCitizenship: e.target.value as BuyerCitizenship,
              }))
            }
            className="w-full py-2 px-3 text-xs font-medium text-slate-800 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          >
            <option value="sc_couple">Singapore Citizen (Couple / Joint)</option>
            <option value="sc_single">Singapore Citizen (Single / Sole)</option>
            <option value="sc_pr">SC + Singapore Permanent Resident (PR)</option>
            <option value="pr_pr">Permanent Resident Couple (PR + PR)</option>
            <option value="pr_single">Permanent Resident (Single)</option>
            <option value="foreigner">Foreigner (Non-Resident / Non-PR)</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Residential Property Count
            </label>
            <span className="text-xs font-medium text-slate-500">
              ABSD: {(currentAbsdRate * 100).toFixed(0)}%
            </span>
          </div>
          <select
            value={input.propertyCount}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                propertyCount: e.target.value as PropertyCount,
              }))
            }
            className="w-full py-2 px-3 text-xs font-medium text-slate-800 rounded-lg border border-slate-300 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          >
            <option value="first">1st Property (Primary / First Home)</option>
            <option value="second">2nd Property (Subject to ABSD)</option>
            <option value="third_or_more">3rd Property or Subsequent</option>
          </select>
        </div>
      </div>

      {/* Loan Type & Terms */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Mortgage Financing Scheme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            disabled={!isHdbEligible}
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                loanType: 'hdb_loan',
                interestRate: 2.6,
                loanTenureYears: Math.min(25, prev.loanTenureYears),
              }))
            }
            className={`p-3 text-left rounded-lg border transition-all text-xs ${
              !isHdbEligible
                ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                : input.loanType === 'hdb_loan'
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="font-semibold text-slate-900 flex items-center justify-between">
              <span>HDB Concessionary Loan</span>
              <span className="text-xs font-mono font-medium text-emerald-700">2.60% p.a.</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              75% LTV · Max 25 yrs · Up to 100% CPF OA downpayment (0% mandatory cash)
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                loanType: 'bank_loan',
                interestRate: prev.interestRate === 2.6 ? 3.0 : prev.interestRate,
              }))
            }
            className={`p-3 text-left rounded-lg border transition-all text-xs ${
              input.loanType === 'bank_loan'
                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="font-semibold text-slate-900 flex items-center justify-between">
              <span>Commercial Bank Loan</span>
              <span className="text-xs font-mono font-medium text-slate-700">~3.00% p.a.</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              75% LTV · Min 5% cash downpayment + 20% CPF OA · MAS Stress Rate 4.0%
            </div>
          </button>
        </div>

        {/* Tenure and Interest rates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600 uppercase">
                Loan Tenure
              </label>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {input.loanTenureYears} Years
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={input.propertyType === 'private_condo' || input.propertyType === 'landed' ? 30 : 25}
              value={input.loanTenureYears}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  loanTenureYears: Number(e.target.value),
                }))
              }
              className="w-full accent-emerald-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>10y</span>
              <span>
                {input.propertyType === 'private_condo' || input.propertyType === 'landed' ? '30y max' : '25y HDB max'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600 uppercase">
                Contract Rate
              </label>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {input.interestRate.toFixed(2)}%
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step={0.05}
                min={1.0}
                max={8.0}
                value={input.interestRate}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    interestRate: Number(e.target.value),
                  }))
                }
                className="w-full py-1.5 px-3 text-xs font-mono text-slate-800 rounded-lg border border-slate-300 outline-none focus:border-emerald-600"
              />
              <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600 uppercase">
                MAS Stress Rate
              </label>
              <span className="text-xs font-mono font-semibold text-slate-800">
                {input.stressTestInterestRate.toFixed(2)}%
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step={0.1}
                min={3.5}
                max={7.0}
                value={input.stressTestInterestRate}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    stressTestInterestRate: Number(e.target.value),
                  }))
                }
                className="w-full py-1.5 px-3 text-xs font-mono text-slate-800 rounded-lg border border-slate-300 outline-none focus:border-emerald-600"
              />
              <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
