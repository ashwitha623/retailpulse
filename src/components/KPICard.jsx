import React from 'react';

/**
 * Reusable KPI Card Component
 * Formatted with modern corporate analytics styling.
 * Displays real computed values, exact hover tooltips, and positive/negative indicators.
 */
export default function KPICard({
  label,
  value,
  exactValue,
  icon: Icon,
  iconBgClass = 'bg-blue-50 text-[#2563EB]',
  variant = 'default', // 'default' | 'positive' | 'negative'
  subtext,
  badge,
  isLoading = false,
}) {
  // Determine value text color based on metric variant
  const getValueColor = () => {
    if (value === null || value === undefined) return 'text-[#64748B]';
    if (variant === 'positive') return 'text-[#16A34A]';
    if (variant === 'negative') return 'text-[#DC2626]';
    return 'text-[#0F172A]';
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
      title={exactValue ? `Exact Value: ${exactValue}` : undefined}
    >
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase">
          {label}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBgClass}`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Main Value Area */}
      <div className="mt-3 mb-1">
        {isLoading ? (
          <div className="h-9 w-28 bg-slate-100 rounded animate-pulse my-0.5"></div>
        ) : (
          <div className={`text-2xl sm:text-3xl font-bold tracking-tight font-sans ${getValueColor()}`}>
            {value !== null && value !== undefined ? (
              <span>{value}</span>
            ) : (
              <span className="text-slate-400 font-normal text-2xl tracking-normal flex items-center space-x-2">
                <span>—</span>
                <span className="text-xs font-normal text-slate-400/80 bg-slate-100 px-2 py-0.5 rounded">
                  Pending CSV
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom row: Subtext or contextual indicator */}
      <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <span className="truncate mr-2" title={subtext}>
          {subtext || 'Ready for dataset computation'}
        </span>
        {badge && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
