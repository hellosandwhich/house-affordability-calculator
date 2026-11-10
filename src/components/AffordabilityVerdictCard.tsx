/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResult } from '../types/calculator';
import { CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';

interface AffordabilityVerdictCardProps {
  result: CalculationResult;
}

export const AffordabilityVerdictCard: React.FC<AffordabilityVerdictCardProps> = ({
  result,
}) => {
  const { verdict, outOfPocket, monthlyCashflow, inputs } = result;

  const statusConfig = {
    comfortable: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    stretch: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-600',
      badgeText: 'text-white',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    unaffordable: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-200',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-600',
      badgeText: 'text-white',
      icon: XCircle,
      iconColor: 'text-rose-600',
    },
  }[verdict.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      id="affordability-verdict"
      className={`rounded-xl border ${statusConfig.border} ${statusConfig.bg} p-6 shadow-xs transition-all`}
    >
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <StatusIcon className={`w-7 h-7 ${statusConfig.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {verdict.headline}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${statusConfig.badgeBg} ${statusConfig.badgeText}`}
              >
                {verdict.status === 'comfortable'
                  ? 'Eligible & Healthy'
                  : verdict.status === 'stretch'
                  ? 'Tight Reserve'
                  : 'Action Needed'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
              {verdict.summary}
            </p>
          </div>
        </div>

        {/* Max Affordable Price Badge */}
        <div className="bg-white/90 rounded-lg p-3 border border-slate-200/80 shrink-0 self-start sm:self-auto min-w-[190px]">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Max Purchasing Power
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            S${verdict.maxAffordablePrice.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
            <span>Based on MSR/TDSR & funds</span>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Pillars */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-5 border-b border-slate-200/60">
        {/* Pillar 1: Monthly Mortgage */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Mortgage
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            S${monthlyCashflow.monthlyMortgageActual.toLocaleString()}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            @ {inputs.interestRate}% ({inputs.loanTenureYears} yrs)
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Stress rate (4.0%): S${monthlyCashflow.monthlyMortgageStress.toLocaleString()}/mo
          </div>
        </div>

        {/* Pillar 2: Cash Out-Of-Pocket Monthly */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Cash Top-Up
          </div>
          <div
            className={`text-lg font-bold font-mono mt-1 ${
              monthlyCashflow.monthlyCashOutOfPocketRequired === 0
                ? 'text-emerald-700'
                : 'text-slate-900'
            }`}
          >
            S${monthlyCashflow.monthlyCashOutOfPocketRequired.toLocaleString()}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            CPF OA offset: S${monthlyCashflow.monthlyCpfOaUsed.toLocaleString()}/mo
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {monthlyCashflow.monthlyCashOutOfPocketRequired === 0
              ? '✓ Fully paid by CPF OA'
              : 'Cash required to top up'}
          </div>
        </div>

        {/* Pillar 3: Total Initial Hard Cash */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Upfront Hard Cash
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            S${outOfPocket.totalCashRequired.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono mt-0.5">
            {outOfPocket.cashShortfallOrSurplus >= 0 ? (
              <span className="text-emerald-700 font-medium">
                Surplus: +S${outOfPocket.cashShortfallOrSurplus.toLocaleString()}
              </span>
            ) : (
              <span className="text-rose-700 font-bold">
                Shortfall: -S${Math.abs(outOfPocket.cashShortfallOrSurplus).toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Includes 5% cash, Reno & BSD
          </div>
        </div>

        {/* Pillar 4: Regulatory Headroom */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200/80">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            MAS Debt Ratios
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold font-mono text-slate-900">
              TDSR {monthlyCashflow.tdsrStress.toFixed(1)}%
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                monthlyCashflow.tdsrPass
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {monthlyCashflow.tdsrPass ? 'PASS' : 'FAIL'}
            </span>
          </div>
          {monthlyCashflow.msrApplicable ? (
            <div className="flex items-center gap-2 text-[11px] mt-0.5">
              <span className="text-slate-600 font-mono">
                MSR: {monthlyCashflow.msrStress.toFixed(1)}%
              </span>
              <span
                className={`text-[10px] px-1 rounded font-semibold ${
                  monthlyCashflow.msrPass
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {monthlyCashflow.msrPass ? 'PASS (<30%)' : 'EXCEEDED'}
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 mt-0.5">
              MSR N/A (Private property)
            </div>
          )}
          <div className="text-[10px] text-slate-400 mt-1">
            Evaluated at 4.0% stress rate
          </div>
        </div>
      </div>

      {/* Evaluated Decision Factors */}
      <div className="pt-4 space-y-2">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Diagnostic Assessment
        </div>
        <div className="space-y-1.5">
          {verdict.reasons.map((r, idx) => {
            const isDanger = r.type === 'danger';
            const isWarning = r.type === 'warning';
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-800 bg-white/70 rounded-md px-3 py-2 border border-slate-200/50"
              >
                {isDanger ? (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{r.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
