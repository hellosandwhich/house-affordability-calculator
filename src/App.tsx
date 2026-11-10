/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PRESET_SCENARIOS } from './utils/presets';
import { UserFinancialInput, PresetScenario } from './types/calculator';
import { calculateAffordability } from './utils/calculator';
import { Header } from './components/Header';
import { PresetBar } from './components/PresetBar';
import { PropertyProfileInput } from './components/PropertyProfileInput';
import { FinancialProfileInput } from './components/FinancialProfileInput';
import { AffordabilityVerdictCard } from './components/AffordabilityVerdictCard';
import { UpfrontExpenseBreakdown } from './components/UpfrontExpenseBreakdown';
import { MonthlyCashflowCard } from './components/MonthlyCashflowCard';
import { RegulatoryComplianceCard } from './components/RegulatoryComplianceCard';
import { MaxBudgetFinder } from './components/MaxBudgetFinder';
import { StressTestSimulator } from './components/StressTestSimulator';
import { StampDutyGuideModal } from './components/StampDutyGuideModal';
import { LiveMarketDataModal } from './components/LiveMarketDataModal';
import {
  Calculator,
  Compass,
  Activity,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function App() {
  const defaultPreset = PRESET_SCENARIOS[1]; // Resale 5-Room
  const [input, setInput] = useState<UserFinancialInput>(defaultPreset.data);
  const [activePresetId, setActivePresetId] = useState<string | null>(defaultPreset.id);
  const [activeTab, setActiveTab] = useState<'verdict' | 'max_budget' | 'stress_test'>('verdict');
  const [isStampDutyModalOpen, setIsStampDutyModalOpen] = useState(false);
  const [isLiveMarketModalOpen, setIsLiveMarketModalOpen] = useState(false);

  // Recalculate whenever inputs change
  const calculationResult = useMemo(() => {
    return calculateAffordability(input);
  }, [input]);

  const handleSelectPreset = (preset: PresetScenario) => {
    setInput(preset.data);
    setActivePresetId(preset.id);
  };

  const handleReset = () => {
    setInput(PRESET_SCENARIOS[0].data);
    setActivePresetId(PRESET_SCENARIOS[0].id);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyPrice = (price: number) => {
    setInput((prev) => ({
      ...prev,
      purchasePrice: price,
    }));
    setActiveTab('verdict');
    setActivePresetId(null);
  };

  const handleApplyLivePrice = (price: number, flatType?: string) => {
    setInput((prev) => {
      let propType = prev.propertyType;
      if (flatType) {
        propType = 'hdb_resale';
      }
      return {
        ...prev,
        purchasePrice: price,
        propertyType: propType,
      };
    });
    setActiveTab('verdict');
    setActivePresetId(null);
  };

  const handleApplyLiveInterestRate = (rate: number) => {
    setInput((prev) => ({
      ...prev,
      interestRate: rate,
    }));
    setActivePresetId(null);
  };

  const handleInputChange = (
    updater: (prev: UserFinancialInput) => UserFinancialInput
  ) => {
    setInput((prev) => {
      const next = updater(prev);
      setActivePresetId(null); // clear preset tag if user customizes
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Contract compliant Header */}
      <Header
        onReset={handleReset}
        onPrint={handlePrint}
        onOpenLiveMarketData={() => setIsLiveMarketModalOpen(true)}
      />

      {/* Preset Bar */}
      <PresetBar
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Editorial Subheader */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
              Singapore MAS & IRAS Financial Feasibility Framework
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Residential Property Affordability Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Evaluate whether you can afford an HDB BTO, Resale Flat, Executive Condominium (EC), or Private Condo based on statutory MSR & TDSR limits, out-of-pocket cash & CPF requirements, and monthly cashflow dynamics.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('verdict')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'verdict'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Full Affordability Report</span>
            </button>

            <button
              onClick={() => setActiveTab('max_budget')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'max_budget'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Max Purchasing Power</span>
            </button>

            <button
              onClick={() => setActiveTab('stress_test')}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'stress_test'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Stress Tester</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Panels (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <PropertyProfileInput
              input={input}
              onChange={handleInputChange}
              onOpenStampDutyGuide={() => setIsStampDutyModalOpen(true)}
            />

            <FinancialProfileInput
              input={input}
              onChange={handleInputChange}
            />
          </div>

          {/* Right Column: Dynamic Analysis Panels (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'verdict' && (
              <>
                <AffordabilityVerdictCard result={calculationResult} />
                <UpfrontExpenseBreakdown result={calculationResult} />
                <MonthlyCashflowCard result={calculationResult} />
                <RegulatoryComplianceCard result={calculationResult} />
              </>
            )}

            {activeTab === 'max_budget' && (
              <>
                <MaxBudgetFinder
                  result={calculationResult}
                  onApplyPrice={handleApplyPrice}
                />
                <RegulatoryComplianceCard result={calculationResult} />
                <UpfrontExpenseBreakdown result={calculationResult} />
              </>
            )}

            {activeTab === 'stress_test' && (
              <>
                <StressTestSimulator result={calculationResult} />
                <MonthlyCashflowCard result={calculationResult} />
                <RegulatoryComplianceCard result={calculationResult} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            LionCity HomeAfford · Singapore Property Affordability Engine
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>MAS TDSR Notice 645</span>
            <span aria-hidden="true">·</span>
            <span>HDB Housing Concessionary Scheme</span>
            <span aria-hidden="true">·</span>
            <span>IRAS Stamp Duties Act</span>
          </div>
        </div>
      </footer>

      {/* Stamp Duty Reference Modal */}
      <StampDutyGuideModal
        isOpen={isStampDutyModalOpen}
        onClose={() => setIsStampDutyModalOpen(false)}
      />

      {/* Live Market Data Modal (HDB & MAS SORA) */}
      <LiveMarketDataModal
        isOpen={isLiveMarketModalOpen}
        onClose={() => setIsLiveMarketModalOpen(false)}
        onApplyPrice={handleApplyLivePrice}
        onApplyInterestRate={handleApplyLiveInterestRate}
      />
    </div>
  );
}
