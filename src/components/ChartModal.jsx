import React, { useEffect } from 'react';
import { X, Info, Sparkles } from 'lucide-react';

/**
 * Chart Detail Modal for expanded chart viewing on the Charts Page.
 */
export default function ChartModal({
  isOpen,
  onClose,
  title,
  description,
  badge,
  takeaways = [],
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-chart-title"
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                {badge || 'Expanded Analysis'}
              </span>
              <span className="text-xs text-slate-400">&bull; Currency: INR (₹96 / USD)</span>
            </div>
            <h2 id="modal-chart-title" className="text-lg font-bold text-[#0F172A] mt-1">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>

          {/* Expanded Chart View */}
          <div className="bg-[#F8FAFC] rounded-xl border border-slate-200/80 p-4 min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
            <div className="w-full h-[360px] sm:h-[420px]">
              {children}
            </div>
          </div>

          {/* Key Analytical Takeaways */}
          {takeaways && takeaways.length > 0 && (
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Key Analytical Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {takeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold shrink-0">&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Interactive tooltip hovering active &bull; Press Esc to exit</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
