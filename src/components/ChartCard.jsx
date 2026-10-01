import React from 'react';
import { BarChart2, AlertCircle } from 'lucide-react';

/**
 * Reusable Chart Container Card.
 * Hosts real Recharts visualizations.
 * Displays a clean empty message if filter combinations yield zero records.
 */
export default function ChartCard({
  title,
  description,
  badge = 'Interactive Chart',
  icon: Icon = BarChart2,
  isEmpty = false,
  children,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      
      {/* Header Area */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm sm:text-base font-semibold text-[#0F172A] tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-[#64748B] shrink-0">
          {badge}
        </span>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full mt-4 min-h-[300px] flex items-center justify-center relative">
        {isEmpty ? (
          <div className="w-full h-[280px] flex flex-col items-center justify-center p-6 text-center rounded-lg bg-[#F8FAFC] border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-[#0F172A]">
              No data available for the selected filters.
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Try adjusting or resetting your filter criteria to view analytics.
            </p>
          </div>
        ) : children ? (
          <div className="w-full h-full min-h-[300px]">
            {children}
          </div>
        ) : null}
      </div>

    </div>
  );
}
