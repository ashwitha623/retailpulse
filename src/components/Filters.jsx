import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * Filter control bar for RetailPulse.
 * Dynamically populated with unique dimension values from the dataset.
 * Supports multi-filter intersection (AND logic) and reset functionality.
 */
export default function Filters({
  filters = {
    region: 'All',
    category: 'All',
    segment: 'All',
    discountLevel: 'All',
    shipMode: 'All',
  },
  options = {
    region: [],
    category: [],
    segment: [],
    discountLevel: [],
    shipMode: [],
  },
  onFilterChange = () => {},
  onResetFilters = () => {},
  disabled = false,
}) {
  const filterDefinitions = [
    {
      id: 'region',
      label: 'Region',
      value: filters.region,
      rawOptions: options.region || [],
    },
    {
      id: 'category',
      label: 'Category',
      value: filters.category,
      rawOptions: options.category || [],
    },
    {
      id: 'segment',
      label: 'Segment',
      value: filters.segment,
      rawOptions: options.segment || [],
    },
    {
      id: 'discountLevel',
      label: 'Discount Level',
      value: filters.discountLevel,
      rawOptions: options.discountLevel || [],
    },
    {
      id: 'shipMode',
      label: 'Ship Mode',
      value: filters.shipMode,
      rawOptions: options.shipMode || [],
    },
  ];

  const getOptionLabel = (filterId, opt, label) => {
    if (opt === 'All') {
      if (filterId === 'category') return 'All Categories';
      if (filterId === 'discountLevel') return 'All Discount Levels';
      if (filterId === 'shipMode') return 'All Ship Modes';
      return `All ${label}s`;
    }
    return opt;
  };

  const activeFilterCount = Object.values(filters).filter((val) => val !== 'All').length;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-[#0F172A]">
          <Filter className="w-4 h-4 text-[#2563EB]" />
          <h2 className="text-sm font-semibold tracking-tight text-[#0F172A] uppercase">
            FILTERS
          </h2>
          <span className="text-xs text-[#64748B] font-normal">
            (Choose filters to explore the data)
          </span>
          {activeFilterCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB]">
              {activeFilterCount} {activeFilterCount === 1 ? 'Filter Applied' : 'Filters Applied'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          disabled={disabled || activeFilterCount === 0}
          className={`inline-flex items-center space-x-1.5 text-xs font-medium transition-colors self-start sm:self-auto ${
            activeFilterCount > 0
              ? 'text-[#2563EB] hover:text-[#1d4ed8] font-semibold cursor-pointer'
              : 'text-slate-400 cursor-not-allowed opacity-70'
          }`}
          title="Reset all filters to All"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {filterDefinitions.map((filter) => {
          const selectOptions = ['All', ...filter.rawOptions.filter((opt) => opt !== 'All')];

          return (
            <div key={filter.id} className="flex flex-col space-y-1.5">
              <label
                htmlFor={`filter-${filter.id}`}
                className="text-xs font-medium text-[#64748B] flex items-center justify-between"
              >
                <span>{filter.label}</span>
                {filter.value !== 'All' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                )}
              </label>
              <div className="relative">
                <select
                  id={`filter-${filter.id}`}
                  value={filter.value}
                  disabled={disabled}
                  onChange={(e) => onFilterChange(filter.id, e.target.value)}
                  className={`w-full text-xs font-medium border rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-colors appearance-none cursor-pointer ${
                    filter.value !== 'All'
                      ? 'bg-blue-50/60 border-blue-300 text-[#0F172A] font-semibold'
                      : 'bg-[#F8FAFC] hover:bg-slate-100/70 text-[#0F172A] border-slate-200'
                  }`}
                >
                  {selectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {getOptionLabel(filter.id, opt, filter.label)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
