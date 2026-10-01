import React from 'react';
import { BarChart3, Database, Loader2, AlertCircle, Coins } from 'lucide-react';

/**
 * Header component for RetailPulse dashboard.
 * Uses navy theme (#0F172A) with clear typography, currency note, and dataset status badge.
 */
export default function Header({
  totalCount = 0,
  filteredCount = 0,
  isLoading = false,
  error = null,
}) {
  return (
    <header className="bg-[#0F172A] text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/15">
              <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white m-0">
                RETAILPULSE
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                E-Commerce Sales & Profit Analytics
              </p>
            </div>
          </div>

          {/* Right Meta Controls: Currency Note + Dataset Status */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            
            {/* Currency Note */}
            <div className="flex items-center space-x-2 bg-slate-800/90 px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Currency: <strong className="text-white font-medium">INR</strong></span>
              <span className="text-slate-500 font-light">|</span>
              <span className="text-slate-300">Fixed conversion: <strong className="text-white font-medium">1 USD = ₹96</strong></span>
            </div>

            {/* Dataset Status */}
            <div className="flex items-center space-x-2 bg-slate-800/90 px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-300">
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-[#0EA5E9] animate-spin" />
                  <span>Loading <span className="font-medium text-white">final_dataset.csv</span>...</span>
                </>
              ) : error ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span className="text-red-400">Failed to load CSV</span>
                </>
              ) : totalCount > 0 ? (
                <>
                  <Database className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>
                    Dataset:{' '}
                    <span className="font-medium text-white">
                      {filteredCount < totalCount
                        ? `${filteredCount.toLocaleString()} / ${totalCount.toLocaleString()} Rows`
                        : `${totalCount.toLocaleString()} Rows`}
                    </span>
                  </span>
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse ml-1"
                    title="Dataset connected and verified"
                  ></span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>Target: <span className="font-medium text-white">public/final_dataset.csv</span></span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 ml-1"></span>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
