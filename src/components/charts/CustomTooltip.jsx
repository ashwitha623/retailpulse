import React from 'react';
import { formatINR } from '../../utils/formatters';

/**
 * Standardized Custom Tooltip for Recharts visualizations.
 * Displays bold category labels and formatted exact INR Rupee values (₹).
 */
export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-lg border border-slate-200 shadow-lg text-xs font-sans">
      {label && (
        <p className="font-semibold text-[#0F172A] border-b border-slate-100 pb-1.5 mb-2">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const isNegative = typeof item.value === 'number' && item.value < 0;
          return (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color || item.fill }}
                />
                <span>{item.name}:</span>
              </span>
              <span
                className={`font-semibold tabular-nums ${
                  isNegative
                    ? 'text-[#DC2626]'
                    : item.name === 'Profit' || item.name === 'Total Profit'
                    ? 'text-[#16A34A]'
                    : 'text-[#0F172A]'
                }`}
              >
                {formatINR(item.value, false)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
