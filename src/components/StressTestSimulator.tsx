/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import { calculateMonthlyInstallment } from '../utils/calculator';
import { Activity, AlertTriangle, Shield, Gauge } from 'lucide-react';

interface StressTestSimulatorProps {
  result: CalculationResult;
}

export const StressTestSimulator: React.FC<StressTestSimulatorProps> = ({
  result,
}) => {
  const { inputs, outOfPocket, monthlyCashflow } = result;

  const [simulatedRateDelta, setSimulatedRateDelta] = useState<number>(1.0); // +1.0%
  const [incomeShockPct, setIncomeShockPct] = useState<number>(0); // 0% drop

  const simulatedInterestRate = Math.max(1.0, inputs.interestRate + simulatedRateDelta);
  const simulatedLoanAmount = outOfPocket.maxLoanAmount;
  const simulatedTenure = inputs.loanTenureYears;

  const simulatedMortgage = calculateMonthlyInstallment(
    simulatedLoanAmount,
    simulatedInterestRate,
    simulatedTenure
  );

  const monthlyMortgageDelta = simulatedMortgage - monthlyCashflow.monthlyMortgageActual;

  // Stressed income
  const stressedHouseholdIncome =
    monthlyCashflow.grossMonthlyIncome * (1 - incomeShockPct / 100);

  // Stressed cash top-up
  const stressedCpfOa = monthlyCashflow.combinedMonthlyCpfOa * (1 - incomeShockPct / 100);
  const stressedCpfUsed = Math.min(simulatedMortgage, stressedCpfOa);
  const stressedCashTopUp = Math.max(0, simulatedMortgage - stressedCpfUsed);

  // Remaining safety runway
  const remainingLiquidFunds = Math.max(0, outOfPocket.cashShortfallOrSurplus);
  const remainingCpfBalance = Math.max(0, outOfPocket.cpfShortfallOrSurplus);
  const totalContingencyReserves = remainingLiquidFunds + remainingCpfBalance;

  // How many months can total reserves pay the mortgage if total income dropped to zero?
  const runwayMonths =
    simulatedMortgage > 0
      ? Math.floor(totalContingencyReserves / simulatedMortgage)
      : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Financial Stress Tester & Safety Runway Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate rising SORA interest rates or an unexpected income contraction to test household resilience.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Emergency Reserve Runway</span>
          <span
            className={`text-sm font-bold font-mono px-2.5 py-1 rounded inline-block ${
              runwayMonths >= 12
                ? 'bg-emerald-100 text-emerald-900'
                : runwayMonths >= 6
                ? 'bg-amber-100 text-amber-900'
                : 'bg-rose-100 text-rose-900'
            }`}
          >
            {runwayMonths} Months of Mortgage Cushion
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50/70 rounded-lg border border-slate-200">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Interest Rate Shift (SORA Benchmark)
            </label>
            <span className="text-xs font-mono font-bold text-slate-900">
              {simulatedRateDelta >= 0 ? `+${simulatedRateDelta.toFixed(1)}%` : `${simulatedRateDelta.toFixed(1)}%`}{' '}
              ({simulatedInterestRate.toFixed(2)}% effective)
            </span>
          </div>
          <input
            type="range"
            min={-1.0}
            max={3.0}
            step={0.25}
            value={simulatedRateDelta}
            onChange={(e) => setSimulatedRateDelta(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>-1.0% Rate Cut</span>
            <span>Current ({inputs.interestRate}%)</span>
            <span>+3.0% Spike</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              Household Income Shock
            </label>
            <span className="text-xs font-mono font-bold text-slate-900">
              {incomeShockPct === 0 ? 'No reduction (100%)' : `-${incomeShockPct}% Pay Cut`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={incomeShockPct}
            onChange={(e) => setIncomeShockPct(Number(e.target.value))}
            className="w-full accent-slate-800"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Normal</span>
            <span>-25% One income impacted</span>
            <span>-50% Halved</span>
          </div>
        </div>
      </div>

      {/* Simulated Outcomes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Simulated Monthly Mortgage
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            S${simulatedMortgage.toLocaleString()}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-[11px] font-mono mt-0.5">
            {monthlyMortgageDelta >= 0 ? (
              <span className="text-rose-700 font-medium">
                +S${monthlyMortgageDelta.toLocaleString()}/mo increase
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                -S${Math.abs(monthlyMortgageDelta).toLocaleString()}/mo decrease
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Simulated Cash Top-Up
          </div>
          <div
            className={`text-lg font-bold font-mono mt-1 ${
              stressedCashTopUp === 0 ? 'text-emerald-700' : 'text-slate-900'
            }`}
          >
            S${stressedCashTopUp.toLocaleString()}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            CPF OA offset: S${stressedCpfUsed.toLocaleString()}/mo
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Post-Purchase Liquid Safety Pool
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            S${totalContingencyReserves.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Cash: S${remainingLiquidFunds.toLocaleString()} · CPF OA: S${remainingCpfBalance.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
