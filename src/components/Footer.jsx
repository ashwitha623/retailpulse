import React from 'react';
import { BarChart3, Database, ShieldCheck } from 'lucide-react';

/**
 * Universal Footer for RetailPulse Multi-Page Application.
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#0F172A] tracking-tight">
                RETAILPULSE
              </p>
              <p className="text-slate-400 text-[11px]">
                E-Commerce Sales & Profit Analytics
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Interactive Business Intelligence
          </div>

        </div>

        {/* Bottom Metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Cleaned E-Commerce Dataset &bull; Verified Portfolio</span>
          </div>

          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>React &bull; Tailwind CSS &bull; Recharts &bull; INR Formatting</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
