/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  TrendingUp,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Wifi,
  ExternalLink,
} from 'lucide-react';

interface LiveMarketDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrice: (price: number, flatType?: string) => void;
  onApplyInterestRate: (rate: number) => void;
}

interface HdbRecord {
  month: string;
  town: string;
  flatType: string;
  block: string;
  streetName: string;
  storeyRange: string;
  floorAreaSqm: number;
  flatModel: string;
  remainingLease: string;
  resalePrice: number;
}

interface SoraRates {
  date: string;
  dailySora: number;
  compounded1m: number;
  compounded3m: number;
  compounded6m: number;
}

export const LiveMarketDataModal: React.FC<LiveMarketDataModalProps> = ({
  isOpen,
  onClose,
  onApplyPrice,
  onApplyInterestRate,
}) => {
  const [activeTab, setActiveTab] = useState<'sora' | 'hdb' | 'health'>('sora');

  // SORA State
  const [soraData, setSoraData] = useState<SoraRates | null>(null);
  const [soraLoading, setSoraLoading] = useState(false);
  const [soraError, setSoraError] = useState<string | null>(null);

  // HDB State
  const [hdbRecords, setHdbRecords] = useState<HdbRecord[]>([]);
  const [hdbLoading, setHdbLoading] = useState(false);
  const [hdbError, setHdbError] = useState<string | null>(null);

  // Health State
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const fetchSoraRates = async () => {
    setSoraLoading(true);
    setSoraError(null);
    try {
      const res = await fetch('/api/massorarates');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to fetch SORA data`);
      }
      setSoraData(data.latestRate);
    } catch (err: any) {
      setSoraError(err.message || 'Error connecting to /api/massorarates');
    } finally {
      setSoraLoading(false);
    }
  };

  const fetchHdbPrices = async () => {
    setHdbLoading(true);
    setHdbError(null);
    try {
      const res = await fetch('/api/hdbresaleprices?limit=5');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to fetch HDB transactions`);
      }
      setHdbRecords(data.records || []);
    } catch (err: any) {
      setHdbError(err.message || 'Error connecting to /api/hdbresaleprices');
    } finally {
      setHdbLoading(false);
    }
  };

  const fetchHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setHealthError(err.message || 'Error connecting to /api/health');
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Data Gateway (MAS SORA & HDB Resale)
              </h3>
              <p className="text-xs text-slate-500">
                Direct serverless proxies querying MAS and data.gov.sg with AccountKey header
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

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setActiveTab('sora');
              if (!soraData) fetchSoraRates();
            }}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'sora'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MAS SORA Rates (/api/massorarates)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('hdb');
              if (hdbRecords.length === 0) fetchHdbPrices();
            }}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'hdb'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HDB Resale Prices (/api/hdbresaleprices)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('health');
              if (!healthData) fetchHealth();
            }}
            className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'health'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Health & Status
          </button>
        </div>

        {/* TAB 1: MAS SORA RATES */}
        {activeTab === 'sora' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-sans">
                Monetary Authority of Singapore (MAS) Domestic Interest Rates View
              </span>
              <button
                type="button"
                onClick={fetchSoraRates}
                disabled={soraLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${soraLoading ? 'animate-spin' : ''}`} />
                <span>{soraLoading ? 'Fetching...' : 'Fetch Live SORA'}</span>
              </button>
            </div>

            {soraError && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Endpoint Notice:</strong> {soraError}
                  <div className="text-[11px] text-amber-700 mt-1">
                    If this requires an authorized MAS API gateway key, configure your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ACCOUNT_KEY</code> in environment secrets.
                  </div>
                </div>
              </div>
            )}

            {soraData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">
                      Daily SORA
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                      {soraData.dailySora.toFixed(4)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">
                      1M Compounded
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                      {soraData.compounded1m.toFixed(4)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-[11px] font-semibold text-emerald-800 uppercase">
                      3M Compounded (Benchmark)
                    </div>
                    <div className="text-lg font-bold font-mono text-emerald-950 mt-1">
                      {soraData.compounded3m.toFixed(4)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">
                      6M Compounded
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                      {soraData.compounded6m.toFixed(4)}%
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-600 block">
                      Typical Singapore Bank Mortgage Package:
                    </span>
                    <strong className="text-slate-900">
                      3M Compounded SORA ({soraData.compounded3m.toFixed(2)}%) + 0.65% Spread ={' '}
                      {(soraData.compounded3m + 0.65).toFixed(2)}% p.a.
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const effectiveRate = Number((soraData.compounded3m + 0.65).toFixed(2));
                      onApplyInterestRate(effectiveRate);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shrink-0"
                  >
                    <span>Apply to Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : !soraLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-lg">
                Click <strong>Fetch Live SORA</strong> above to query <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/api/massorarates</code>.
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 2: HDB RESALE PRICES */}
        {activeTab === 'hdb' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-sans">
                data.gov.sg HDB Resale Prices (Dataset d_8b84c4ee58e3cfc0ece0d773c8ca6abc)
              </span>
              <button
                type="button"
                onClick={fetchHdbPrices}
                disabled={hdbLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${hdbLoading ? 'animate-spin' : ''}`} />
                <span>{hdbLoading ? 'Fetching...' : 'Fetch First 5 Transactions'}</span>
              </button>
            </div>

            {hdbError && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Endpoint Notice:</strong> {hdbError}
                  <div className="text-[11px] text-amber-700 mt-1">
                    Check network connectivity or supply your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ACCOUNT_KEY</code> in environment secrets if data.gov.sg requires it.
                  </div>
                </div>
              </div>
            )}

            {hdbRecords.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-50 text-slate-700 font-sans font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Town & Street</th>
                      <th className="py-2.5 px-3">Flat Type</th>
                      <th className="py-2.5 px-3 text-right">Floor Area</th>
                      <th className="py-2.5 px-3 text-right">Transacted Price</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {hdbRecords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-500">{item.month}</td>
                        <td className="py-2 px-3 font-sans">
                          <strong className="text-slate-900">{item.town}</strong>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Blk {item.block} {item.streetName}
                          </div>
                        </td>
                        <td className="py-2 px-3 font-sans">{item.flatType}</td>
                        <td className="py-2 px-3 text-right">{item.floorAreaSqm} sqm</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          S${item.resalePrice.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-sans">
                          <button
                            type="button"
                            onClick={() => {
                              onApplyPrice(item.resalePrice, item.flatType);
                              onClose();
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                          >
                            Use Price
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !hdbLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-lg">
                Click <strong>Fetch First 5 Transactions</strong> above to query <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/api/hdbresaleprices</code>.
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 3: HEALTH & STATUS */}
        {activeTab === 'health' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-800">API Health & Route Verification</span>
              <button
                type="button"
                onClick={fetchHealth}
                disabled={healthLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${healthLoading ? 'animate-spin' : ''}`} />
                <span>{healthLoading ? 'Pinging...' : 'Ping /api/health'}</span>
              </button>
            </div>

            {healthError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                {healthError}
              </div>
            )}

            {healthData && (
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-[11px] overflow-x-auto space-y-1">
                <div>// GET /api/health response:</div>
                <pre>{JSON.stringify(healthData, null, 2)}</pre>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-slate-600">
              <div className="font-semibold text-slate-800">Serverless Architecture Summary</div>
              <p>• <code className="font-mono text-slate-800">/api/health.ts</code>: Verified microservice health probe.</p>
              <p>• <code className="font-mono text-slate-800">/api/hdbresaleprices.ts</code>: Proxies HDB datastore with automatic AccountKey injection.</p>
              <p>• <code className="font-mono text-slate-800">/api/massorarates.ts</code>: Proxies MAS daily interest rate and SORA compounded views.</p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400">
            AccountKey header is handled server-side in /api without exposing secrets
          </span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
