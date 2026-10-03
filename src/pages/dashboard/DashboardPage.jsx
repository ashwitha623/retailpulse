import React, { useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filters from '../../components/Filters';
import KPICards from '../../components/KPICards';
import { useDataset } from '../../hooks/useDataset';
import { formatCompactINR, formatPercent, USD_TO_INR } from '../../utils/formatters';
import { getPageUrl } from '../../utils/navigation';
import {
  RotateCw,
  AlertTriangle,
  Layers,
  MapPin,
  Users,
  LineChart,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

/**
 * Page 2: Dashboard Page for RetailPulse.
 * Dedicated Executive Dashboard featuring only dashboard details:
 * - 4 Primary KPI cards
 * - 5 Dynamic filters & Reset
 * - 4 Secondary executive operational metrics
 * - Dimensional breakdown summaries (Category, Region, Customer Segment)
 * - Clean cross-navigation to Charts and Insights
 */
export default function DashboardPage() {
  const {
    rawData,
    filteredData,
    isLoading,
    loadError,
    filters,
    filterOptions,
    kpiMetrics,
    handleFilterChange,
    handleResetFilters,
    loadDataset,
    isDataEmpty,
  } = useDataset();

  // Compute operational details & dimensional breakdowns for the dashboard
  const dashboardDetails = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null;

    const count = filteredData.length;
    const categoryMap = {};
    const regionMap = {};
    const segmentMap = {};

    for (let i = 0; i < count; i++) {
      const row = filteredData[i];
      const salesINR = (row.Sales || 0) * USD_TO_INR;
      const profitINR = (row.Profit || 0) * USD_TO_INR;

      // Group Category
      const cat = row.Category || 'Unknown';
      if (!categoryMap[cat]) categoryMap[cat] = { name: cat, sales: 0, profit: 0, count: 0 };
      categoryMap[cat].sales += salesINR;
      categoryMap[cat].profit += profitINR;
      categoryMap[cat].count += 1;

      // Group Region
      const reg = row.Region || 'Unknown';
      if (!regionMap[reg]) regionMap[reg] = { name: reg, sales: 0, profit: 0, count: 0 };
      regionMap[reg].sales += salesINR;
      regionMap[reg].profit += profitINR;
      regionMap[reg].count += 1;

      // Group Segment
      const seg = row.Segment || 'Unknown';
      if (!segmentMap[seg]) segmentMap[seg] = { name: seg, sales: 0, profit: 0, count: 0 };
      segmentMap[seg].sales += salesINR;
      segmentMap[seg].profit += profitINR;
      segmentMap[seg].count += 1;
    }

    return {
      categories: Object.values(categoryMap).sort((a, b) => b.sales - a.sales),
      regions: Object.values(regionMap).sort((a, b) => b.sales - a.sales),
      segments: Object.values(segmentMap).sort((a, b) => b.sales - a.sales),
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      
      {/* Universal Header */}
      <Header
        currentPage="dashboard"
        totalCount={rawData.length}
        filteredCount={filteredData.length}
        isLoading={isLoading}
        error={loadError}
      />

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
        
        {/* Error Notification Banner if CSV fails to load */}
        {loadError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Dataset Loading Error</p>
                <p className="text-xs text-red-600 mt-0.5">{loadError}</p>
              </div>
            </div>
            <button
              onClick={loadDataset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 1. FILTER SECTION */}
        <section aria-label="Dashboard Filters">
          <Filters
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            disabled={isLoading || !!loadError}
          />
        </section>

        {/* 2. PRIMARY KPI CARDS SECTION */}
        <section aria-label="Key Performance Indicators">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
              QUICK SUMMARY
            </h2>
            {rawData.length > 0 && (
              <span className="text-xs text-[#64748B]">
                Showing <strong className="text-[#0F172A] font-semibold">{filteredData.length.toLocaleString()}</strong> of <strong className="text-[#0F172A] font-semibold">{rawData.length.toLocaleString()}</strong> records
              </span>
            )}
          </div>
          
          <KPICards
            metrics={kpiMetrics}
            isLoading={isLoading}
          />
        </section>

        {/* 3. PERFORMANCE BREAKDOWN TABLES (Dashboard Details) */}
        {!isDataEmpty && dashboardDetails && (
          <section aria-label="Dimensional Breakdown Details" className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Breakdown Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Category Performance Summary
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {dashboardDetails.categories.length} Categories
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="py-2 px-2">Category</th>
                        <th className="py-2 px-2 text-right">Records</th>
                        <th className="py-2 px-2 text-right">Total Sales</th>
                        <th className="py-2 px-2 text-right">Profit</th>
                        <th className="py-2 px-2 text-right">Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardDetails.categories.map((cat) => {
                        const margin = cat.sales !== 0 ? (cat.profit / cat.sales) * 100 : 0;
                        return (
                          <tr key={cat.name} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2 px-2 font-medium text-[#0F172A]">
                              {cat.name}
                            </td>
                            <td className="py-2 px-2 text-right text-slate-500">
                              {cat.count.toLocaleString()}
                            </td>
                            <td className="py-2 px-2 text-right font-medium text-[#0F172A]">
                              {formatCompactINR(cat.sales, false)}
                            </td>
                            <td className={`py-2 px-2 text-right font-semibold ${
                              cat.profit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}>
                              {formatCompactINR(cat.profit, false)}
                            </td>
                            <td className={`py-2 px-2 text-right font-medium ${
                              margin >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}>
                              {formatPercent(margin)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Region Breakdown Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Regional Territory Summary
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {dashboardDetails.regions.length} Territories
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="py-2 px-2">Territory</th>
                        <th className="py-2 px-2 text-right">Records</th>
                        <th className="py-2 px-2 text-right">Total Sales</th>
                        <th className="py-2 px-2 text-right">Profit</th>
                        <th className="py-2 px-2 text-right">Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dashboardDetails.regions.map((reg) => {
                        const margin = reg.sales !== 0 ? (reg.profit / reg.sales) * 100 : 0;
                        return (
                          <tr key={reg.name} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2 px-2 font-medium text-[#0F172A]">
                              {reg.name}
                            </td>
                            <td className="py-2 px-2 text-right text-slate-500">
                              {reg.count.toLocaleString()}
                            </td>
                            <td className="py-2 px-2 text-right font-medium text-[#0F172A]">
                              {formatCompactINR(reg.sales, false)}
                            </td>
                            <td className={`py-2 px-2 text-right font-semibold ${
                              reg.profit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}>
                              {formatCompactINR(reg.profit, false)}
                            </td>
                            <td className={`py-2 px-2 text-right font-medium ${
                              margin >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}>
                              {formatPercent(margin)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Customer Segment Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Customer Segment Summary
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {dashboardDetails.segments.length} Customer Segments
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardDetails.segments.map((seg) => {
                  const margin = seg.sales !== 0 ? (seg.profit / seg.sales) * 100 : 0;
                  return (
                    <div key={seg.name} className="bg-[#F8FAFC] rounded-lg p-3.5 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#0F172A]">{seg.name}</span>
                        <span className="text-[11px] text-slate-500">{seg.count.toLocaleString()} records</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xs text-slate-500">Sales:</span>
                        <span className="font-bold text-sm text-[#0F172A]">{formatCompactINR(seg.sales, false)}</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs text-slate-500">Profit:</span>
                        <span className={`font-semibold text-xs ${
                          seg.profit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                        }`}>
                          {formatCompactINR(seg.profit, false)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-slate-200/60">
                        <span className="text-xs text-slate-500">Margin:</span>
                        <span className={`font-semibold text-xs flex items-center space-x-0.5 ${
                          margin >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                        }`}>
                          {margin >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{formatPercent(margin)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </section>
        )}

        {/* 5. EXPLORATION CALLOUT BANNERS (Cross-Navigation) */}
        <section aria-label="Explore Visualizations and Insights" className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          <div className="bg-gradient-to-br from-blue-50/80 to-white rounded-xl border border-blue-200/80 p-5 flex items-center justify-between">
            <div className="space-y-1 pr-3">
              <div className="flex items-center space-x-2 text-blue-700 font-semibold text-xs">
                <LineChart className="w-4 h-4" />
                <span>Visual Analytics</span>
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Explore Interactive Charts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View all 6 business Recharts visualizations comparing categories, sub-categories, discount impact, regions, segments, and states / locations.
              </p>
            </div>
            <a
              href={getPageUrl('charts/')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 inline-flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <span>Go to Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-gradient-to-br from-amber-50/80 to-white rounded-xl border border-amber-200/80 p-5 flex items-center justify-between">
            <div className="space-y-1 pr-3">
              <div className="flex items-center space-x-2 text-amber-700 font-semibold text-xs">
                <Lightbulb className="w-4 h-4" />
                <span>Executive Takeaways</span>
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Explore Key Insights
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read dynamically computed business findings across product lines, top-earning sub-categories, discount performance, and top states / locations.
              </p>
            </div>
            <a
              href={getPageUrl('insights/')}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 inline-flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <span>Go to Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </section>

      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
