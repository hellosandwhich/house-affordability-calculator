/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Printer, Building2, Wifi } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onPrint: () => void;
  onOpenLiveMarketData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onPrint, onOpenLiveMarketData }) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <a href="/" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <span>LionCity HomeAfford</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                SG IRAS/MAS
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation anchor links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#affordability-verdict" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Verdict
            </a>
            <a href="#out-of-pocket" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Out of Pocket
            </a>
            <a href="#monthly-cashflow" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Monthly Cashflow
            </a>
            <a href="#regulatory-limits" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              MSR & TDSR
            </a>
            <a href="#max-budget" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Max Purchasing Power
            </a>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenLiveMarketData}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Pull live data from HDB and MAS APIs"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-700" />
              <span>Live MAS & HDB Data</span>
            </button>
            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Reset to default values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onPrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
