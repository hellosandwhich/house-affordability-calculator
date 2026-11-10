/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  Coins,
  FileCheck2,
  Calendar,
  AlertCircle,
  Check,
} from 'lucide-react';

interface UpfrontExpenseBreakdownProps {
  result: CalculationResult;
}

export const UpfrontExpenseBreakdown: React.FC<UpfrontExpenseBreakdownProps> = ({
  result,
}) => {
  const [showBsdDetails, setShowBsdDetails] = useState(false);
  const { outOfPocket, inputs } = result;

  const cashCoveragePercent = Math.min(
    100,
    Math.round((inputs.availableCashSavings / Math.max(1, outOfPocket.totalCashRequired)) * 100)
  );

  const cpfCoveragePercent = Math.min(
    100,
    Math.round((inputs.availableCpfOa / Math.max(1, outOfPocket.totalCpfRequired)) * 100)
  );

  return (
    <div
      id="out-of-pocket"
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Banknote className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Out-of-Pocket Initial Expenses & Capital Required
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete upfront capital needed for downpayment, statutory stamp duties, legal fees, and renovations.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Capital Outlay</span>
          <span className="text-xl font-bold font-mono text-slate-900">
            S${outOfPocket.totalInitialRequired.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Cash vs CPF OA Readiness Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cash Readiness */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Coins className="w-4 h-4 text-emerald-700" />
              Hard Cash Readiness
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                outOfPocket.cashShortfallOrSurplus >= 0
                  ? 'text-emerald-700'
                  : 'text-rose-600'
              }`}
            >
              {outOfPocket.cashShortfallOrSurplus >= 0
                ? `+$${outOfPocket.cashShortfallOrSurplus.toLocaleString()} Surplus`
                : `-$${Math.abs(outOfPocket.cashShortfallOrSurplus).toLocaleString()} Shortfall`}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                outOfPocket.cashShortfallOrSurplus >= 0 ? 'bg-emerald-600' : 'bg-rose-500'
              }`}
              style={{ width: `${cashCoveragePercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-600">
            <span>Available: S${inputs.availableCashSavings.toLocaleString()}</span>
            <span>Needed: S${outOfPocket.totalCashRequired.toLocaleString()}</span>
          </div>
        </div>

        {/* CPF OA Readiness */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              CPF OA Balance Readiness
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                outOfPocket.cpfShortfallOrSurplus >= 0
                  ? 'text-blue-700'
                  : 'text-rose-600'
              }`}
            >
              {outOfPocket.cpfShortfallOrSurplus >= 0
                ? `+$${outOfPocket.cpfShortfallOrSurplus.toLocaleString()} Retained`
                : `-$${Math.abs(outOfPocket.cpfShortfallOrSurplus).toLocaleString()} Need Cash`}
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${cpfCoveragePercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-600">
            <span>Available: S${inputs.availableCpfOa.toLocaleString()}</span>
            <span>Utilized: S${outOfPocket.totalCpfRequired.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Granular Line-Item Ledger */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Expense Item</th>
              <th className="py-2.5 px-3 text-right">Estimated Amount</th>
              <th className="py-2.5 px-3 text-right">Funded By</th>
              <th className="py-2.5 px-3">Regulatory / Industry Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
            {/* Minimum Cash Downpayment */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium">
                Mandatory Cash Downpayment
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                S${outOfPocket.minimumCashDownpayment.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-800 font-sans font-medium">
                Hard Cash Only
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                {inputs.loanType === 'bank_loan'
                  ? 'MAS requires minimum 5% cash for bank loans'
                  : '0% mandatory cash for HDB loans'}
              </td>
            </tr>

            {/* CPF / Balance Downpayment */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium">
                Remaining Downpayment (20%)
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                S${outOfPocket.cpfOrCashDownpayment.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-blue-800 font-sans font-medium">
                CPF OA or Cash
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                Completes 25% equity (Loan is 75% LTV)
              </td>
            </tr>

            {/* Buyer's Stamp Duty */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium flex items-center justify-between">
                <span>Buyer's Stamp Duty (BSD)</span>
                <button
                  type="button"
                  onClick={() => setShowBsdDetails(!showBsdDetails)}
                  className="text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-0.5 text-[11px] font-sans"
                >
                  <span>{showBsdDetails ? 'Hide Tiers' : 'View Tiers'}</span>
                  {showBsdDetails ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                S${outOfPocket.stampDuty.bsd.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-blue-800 font-sans font-medium">
                CPF OA or Cash
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                IRAS Tiered Schedule (1% to 6%)
              </td>
            </tr>

            {/* Expandable BSD Tier Details */}
            {showBsdDetails && (
              <tr>
                <td colSpan={4} className="bg-slate-50 p-3">
                  <div className="bg-white rounded border border-slate-200 p-3 space-y-1.5 font-sans">
                    <div className="text-[11px] font-bold text-slate-700 uppercase">
                      IRAS Buyer's Stamp Duty (BSD) Progressive Breakdown
                    </div>
                    <div className="space-y-1 text-xs">
                      {outOfPocket.stampDuty.bsdTiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-slate-600 font-mono py-0.5 border-b border-slate-50 last:border-0"
                        >
                          <span className="font-sans">
                            {tier.bracket} ({(tier.rate * 100).toFixed(0)}%)
                          </span>
                          <span className="text-slate-500">
                            S${tier.amountInTier.toLocaleString()} taxable
                          </span>
                          <span className="font-bold text-slate-900">
                            S${Math.round(tier.tax).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {/* Additional Buyer's Stamp Duty */}
            {outOfPocket.stampDuty.absd > 0 && (
              <tr className="hover:bg-slate-50/80 bg-amber-50/30">
                <td className="py-2.5 px-3 font-sans font-medium text-amber-900">
                  Additional Buyer's Stamp Duty (ABSD)
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-900">
                  S${outOfPocket.stampDuty.absd.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right text-blue-800 font-sans font-medium">
                  CPF OA or Cash
                </td>
                <td className="py-2.5 px-3 font-sans text-amber-800">
                  {(outOfPocket.stampDuty.absdRate * 100).toFixed(0)}% for {inputs.buyerCitizenship} ({inputs.propertyCount} property)
                </td>
              </tr>
            )}

            {/* Conveyancing Legal Fee */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium">
                Legal Conveyancing Fees
              </td>
              <td className="py-2.5 px-3 text-right text-slate-800">
                S${outOfPocket.legalFee.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-slate-600 font-sans">
                Cash or CPF OA
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                Law firm handling title transfer & mortgage deed
              </td>
            </tr>

            {/* Valuation Fee */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium">
                Bank / HDB Valuation Fee
              </td>
              <td className="py-2.5 px-3 text-right text-slate-800">
                S${outOfPocket.valuationFee.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-800 font-sans font-medium">
                Hard Cash
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                Required by lender to endorse valuation
              </td>
            </tr>

            {/* Renovation Budget */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium">
                Renovation & Interior Furnishing
              </td>
              <td className="py-2.5 px-3 text-right text-slate-800">
                S${outOfPocket.renovationAndFurnishing.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-800 font-sans font-medium">
                Hard Cash Only
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                Carpentry, electrical, painting, and appliances
              </td>
            </tr>

            {/* Misc Moving Buffer */}
            <tr className="hover:bg-slate-50/80">
              <td className="py-2.5 px-3 font-sans font-medium">
                Moving & Contingency Buffer
              </td>
              <td className="py-2.5 px-3 text-right text-slate-800">
                S${outOfPocket.miscReserve.toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-emerald-800 font-sans font-medium">
                Hard Cash Only
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-500">
                Movers, utility deposits, stamp certificates
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Option to Purchase (OTP) Cash Flow Timeline */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Singapore Option to Purchase (OTP) Cash Milestones
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-md border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              1. Option Fee (Booking)
            </div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              S${outOfPocket.otpDepositCash.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-sans">
              Paid in cash to seller to secure exclusive right to buy (14 days validity for HDB, 14-21 days for private).
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              2. Exercise Fee (Signing)
            </div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              S${outOfPocket.otpExerciseCash.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-sans">
              Paid in cash upon signing the OTP. Combined with booking fee, completes the initial deposit.
            </div>
          </div>

          <div className="bg-white p-3 rounded-md border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              3. Completion & Stamp Duty
            </div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              S${(outOfPocket.totalInitialRequired - outOfPocket.otpDepositCash - outOfPocket.otpExerciseCash).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-sans">
              BSD/ABSD payable within 14 days of signing. Remaining 20% downpayment released on completion date (8–12 weeks).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
