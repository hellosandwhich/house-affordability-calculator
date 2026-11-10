/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';

interface StampDutyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StampDutyGuideModal: React.FC<StampDutyGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Singapore IRAS Stamp Duty & Lending Reference
              </h3>
              <p className="text-xs text-slate-500">
                Official statutory brackets for residential purchases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BSD Brackets */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Buyer's Stamp Duty (BSD) - Progressive Tier
          </h4>
          <p className="text-xs text-slate-600">
            BSD is payable on all residential property purchases in Singapore, regardless of citizenship or property count.
          </p>
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-50 text-slate-700 font-sans font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Purchase Price Portion</th>
                  <th className="py-2 px-3 text-right">BSD Rate</th>
                  <th className="py-2 px-3 text-right">Max Tax in Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2 px-3 font-sans">First S$180,000</td>
                  <td className="py-2 px-3 text-right">1%</td>
                  <td className="py-2 px-3 text-right">S$1,800</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Next S$180,000 (S$180,001 - S$360,000)</td>
                  <td className="py-2 px-3 text-right">2%</td>
                  <td className="py-2 px-3 text-right">S$3,600</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Next S$640,000 (S$360,001 - S$1,000,000)</td>
                  <td className="py-2 px-3 text-right">3%</td>
                  <td className="py-2 px-3 text-right">S$19,200</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Next S$500,000 (S$1,000,001 - S$1,500,000)</td>
                  <td className="py-2 px-3 text-right">4%</td>
                  <td className="py-2 px-3 text-right">S$20,000</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Next S$1,500,000 (S$1,500,001 - S$3,000,000)</td>
                  <td className="py-2 px-3 text-right">5%</td>
                  <td className="py-2 px-3 text-right">S$75,000</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2 px-3 font-sans font-semibold">Portion exceeding S$3,000,000</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">6%</td>
                  <td className="py-2 px-3 text-right">6% on excess</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ABSD Matrix */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Additional Buyer's Stamp Duty (ABSD) Matrix
          </h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left font-mono">
              <thead className="bg-slate-50 text-slate-700 font-sans font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Residency Profile</th>
                  <th className="py-2 px-3 text-right">1st Property</th>
                  <th className="py-2 px-3 text-right">2nd Property</th>
                  <th className="py-2 px-3 text-right">3rd+ Property</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2 px-3 font-sans">Singapore Citizens (SC)</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">0%</td>
                  <td className="py-2 px-3 text-right font-medium">20%</td>
                  <td className="py-2 px-3 text-right font-medium">30%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Permanent Residents (PR)</td>
                  <td className="py-2 px-3 text-right font-medium">5%</td>
                  <td className="py-2 px-3 text-right font-medium">30%</td>
                  <td className="py-2 px-3 text-right font-medium">35%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">SC + PR Married Couple</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">0% (Remission)</td>
                  <td className="py-2 px-3 text-right font-medium">30%</td>
                  <td className="py-2 px-3 text-right font-medium">35%</td>
                </tr>
                <tr className="bg-rose-50/40">
                  <td className="py-2 px-3 font-sans font-medium text-rose-950">Foreigners (Non-PR)</td>
                  <td colSpan={3} className="py-2 px-3 text-center text-rose-700 font-bold">
                    60% Flat on Any Residential Property
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CPF Rules */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-600">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider">
            CPF Ordinary Account (OA) Usage Rules
          </h4>
          <p>
            • <strong>Downpayment:</strong> Up to 20% of purchase price can be paid using CPF OA for bank loans (minimum 5% cash required). For HDB loans, up to the full 25% downpayment can come from CPF OA.
          </p>
          <p>
            • <strong>Stamp Duty:</strong> BSD and ABSD can be paid or reimbursed via CPF OA if sufficient balance exists in your Ordinary Account.
          </p>
          <p>
            • <strong>Valuation Limit (VL) & Housing Withdrawal Limit:</strong> For private properties and resale flats, CPF OA usage is capped at 100% of property valuation (VL) and up to 120% under the Available Housing Withdrawal Limit.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
