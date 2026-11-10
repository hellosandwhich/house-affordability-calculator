/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PRESET_SCENARIOS } from '../utils/presets';
import { PresetScenario } from '../types/calculator';
import { Sparkles } from 'lucide-react';

interface PresetBarProps {
  activePresetId: string | null;
  onSelectPreset: (preset: PresetScenario) => void;
}

export const PresetBar: React.FC<PresetBarProps> = ({
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Singapore Archetype Presets:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {PRESET_SCENARIOS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all border ${
                    isActive
                      ? 'bg-white text-slate-900 border-slate-300 shadow-xs ring-1 ring-slate-900/10'
                      : 'bg-white/60 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span>{preset.tag}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
