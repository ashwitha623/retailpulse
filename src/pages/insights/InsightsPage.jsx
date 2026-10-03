import React, { useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filters from '../../components/Filters';
import { useDataset } from '../../hooks/useDataset';
import { formatCompactINR, USD_TO_INR } from '../../utils/formatters';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Layers,
  Percent,
  MapPin,
  Users,
  Landmark,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

/**
 * Page 4: Insights Page for RetailPulse.
 * Dedicated Executive Insights & Analytical Findings Page.
 * Computes dynamic conclusions in INR and updates instantaneously with filters.
 */
export default function InsightsPage() {
  const {
    rawData,
    filteredData,
    isLoading,
    loadError,
    filters,
    filterOptions,
    handleFilterChange,
    handleResetFilters,
  } = useDataset();

  // Helper function to group data and aggregate INR metrics
  const analysis = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null;

    const groupData = (key) => {
      const map = {};
      filteredData.forEach((row) => {
        const val = row[key];
        if (!val) return;
        if (!map[val]) {
          map[val] = { name: val, sales: 0, profit: 0, quantity: 0, count: 0 };
        }
        map[val].sales += (row.Sales || 0) * USD_TO_INR;
        map[val].profit += (row.Profit || 0) * USD_TO_INR;
        map[val].quantity += row.Quantity || 0;
        map[val].count += 1;
      });
      return Object.values(map);
    };

    // 1. Categories
    const categoriesBySales = groupData('Category').sort((a, b) => b.sales - a.sales);
    const topCategory = categoriesBySales[0] || null;

    // 2. Sub-Categories
    const subCategoriesByProfit = groupData('Sub-Category').sort((a, b) => b.profit - a.profit);
    const topSubCategory = subCategoriesByProfit[0] || null;
    const bottomSubCategory = subCategoriesByProfit[subCategoriesByProfit.length - 1] || null;

    // 3. Discount Levels
    const discountsByProfit = groupData('Discount_Level').sort((a, b) => b.profit - a.profit);
    const topDiscount = discountsByProfit[0] || null;
    const highDiscount = discountsByProfit.find((d) => d.name === 'High') || null;

    // 4. Regions
    const regionsBySales = groupData('Region').sort((a, b) => b.sales - a.sales);
    const topRegion = regionsBySales[0] || null;

    // 5. Segments
    const segmentsBySales = groupData('Segment').sort((a, b) => b.sales - a.sales);
    const topSegment = segmentsBySales[0] || null;

    // 6. States
    const statesByProfit = groupData('State').sort((a, b) => b.profit - a.profit);
    const topState = statesByProfit[0] || null;
    const bottomState = statesByProfit[statesByProfit.length - 1] || null;

    return {
      topCategory,
      topSubCategory,
      bottomSubCategory,
      topDiscount,
      highDiscount,
      topRegion,
      topSegment,
      topState,
      bottomState,
      totalCount: filteredData.length,
    };
  }, [filteredData]);

  const isEmpty = !isLoading && rawData.length > 0 && filteredData.length === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      <Header
        currentPage="insights"
        totalCount={rawData.length}
        filteredCount={filteredData.length}
        isLoading={isLoading}
        error={loadError}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
        
        {/* Page Title & Context Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Executive Findings
              </span>
              <span className="text-xs text-slate-400">&bull; Dynamic calculations from filtered dataset</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              KEY INSIGHTS & TAKEAWAYS
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Empirical observations derived from the Superstore retail transactions, computed in Indian Rupees (₹96 / USD).
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>7 KEY INSIGHTS</span>
            </span>
          </div>
        </div>

        {/* Dynamic Filters Section */}
        <section aria-label="Interactive Filters">
          <Filters
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            disabled={isLoading || !!loadError}
          />
        </section>

        {/* Empty State Banner */}
        {isEmpty && (
          <div className="rounded-xl bg-white border border-dashed border-slate-300 p-10 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-400 mb-3" />
            <h2 className="text-base font-semibold text-[#0F172A]">
              No transactions match the selected filter combination.
            </h2>
            <p className="text-xs text-[#64748B] max-w-md mt-1">
              Please adjust or reset your active filters to generate dynamic findings.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Dynamic Insights Content */}
        {!isEmpty && analysis && (
          <div className="space-y-8">
            
            {/* Core Findings Grid */}
            <section aria-label="Core Analytical Takeaways">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B] flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>CORE EMPIRICAL FINDINGS</span>
                </h2>
                <span className="text-xs text-slate-500">
                  Computed on {analysis.totalCount.toLocaleString()} records
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* 1. Category Finding */}
                {analysis.topCategory && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          TOP CATEGORY
                        </span>
                        <Layers className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.topCategory.name} has the highest sales
                      </h3>
                      <div className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCompactINR(analysis.topCategory.sales, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.topCategory.name} has the highest sales, with {formatCompactINR(analysis.topCategory.sales, false)} in sales and {formatCompactINR(analysis.topCategory.profit, false)} in profit.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>Transaction Volume: {analysis.topCategory.count.toLocaleString()} records</span>
                    </div>
                  </div>
                )}

                {/* 2. Top Profit Sub-Category */}
                {analysis.topSubCategory && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          TOP PROFIT
                        </span>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.topSubCategory.name} {analysis.topSubCategory.name.endsWith('s') ? 'have' : 'has'} the highest profit
                      </h3>
                      <div className="text-2xl font-bold text-[#16A34A] mt-2">
                        {formatCompactINR(analysis.topSubCategory.profit, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.topSubCategory.name} {analysis.topSubCategory.name.endsWith('s') ? 'have' : 'has'} the highest total profit at {formatCompactINR(analysis.topSubCategory.profit, false)}.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>Top profit earner across all sub-categories</span>
                    </div>
                  </div>
                )}

                {/* 3. Bottom Sub-Category (Biggest Loss) */}
                {analysis.bottomSubCategory && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          analysis.bottomSubCategory.profit < 0
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {analysis.bottomSubCategory.profit < 0 ? 'BIGGEST LOSS' : 'LOWEST PROFIT'}
                        </span>
                        {analysis.bottomSubCategory.profit < 0 ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.bottomSubCategory.profit < 0
                          ? `${analysis.bottomSubCategory.name} ${analysis.bottomSubCategory.name.endsWith('s') ? 'have' : 'has'} the biggest loss`
                          : `All sub-categories are profitable`}
                      </h3>
                      <div className={`text-2xl font-bold mt-2 ${
                        analysis.bottomSubCategory.profit < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}>
                        {formatCompactINR(analysis.bottomSubCategory.profit, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.bottomSubCategory.profit < 0
                          ? `${analysis.bottomSubCategory.name} ${analysis.bottomSubCategory.name.endsWith('s') ? 'have' : 'has'} the biggest cumulative loss at ${formatCompactINR(analysis.bottomSubCategory.profit, false)}.`
                          : `Every sub-category yields positive returns in this filtered view. Lowest is ${analysis.bottomSubCategory.name}.`}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>Lowest profit contributor</span>
                    </div>
                  </div>
                )}

                {/* 4. Discount Finding */}
                {analysis.topDiscount && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          DISCOUNT LEVEL
                        </span>
                        <Percent className="w-4 h-4 text-amber-600" />
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.topDiscount.name} has the highest total profit
                      </h3>
                      <div className="text-2xl font-bold text-[#16A34A] mt-2">
                        {formatCompactINR(analysis.topDiscount.profit, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.topDiscount.name} has the highest total profit at {formatCompactINR(analysis.topDiscount.profit, false)}. High Discount shows negative total profit in this selection.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>Non-causal empirical observation</span>
                    </div>
                  </div>
                )}

                {/* 5. Region Finding */}
                {analysis.topRegion && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                          TOP REGION
                        </span>
                        <MapPin className="w-4 h-4 text-sky-600" />
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.topRegion.name} has the highest sales and profit
                      </h3>
                      <div className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCompactINR(analysis.topRegion.sales, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.topRegion.name} has the highest sales and profit among regions, with {formatCompactINR(analysis.topRegion.sales, false)} in sales and {formatCompactINR(analysis.topRegion.profit, false)} in profit.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>Regional sales and profit leader</span>
                    </div>
                  </div>
                )}

                {/* 6. Customer Segment Finding */}
                {analysis.topSegment && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          TOP SEGMENT
                        </span>
                        <Users className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.topSegment.name} has the highest sales
                      </h3>
                      <div className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCompactINR(analysis.topSegment.sales, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.topSegment.name} has the highest sales among customer segments, generating {formatCompactINR(analysis.topSegment.sales, false)} in sales and {formatCompactINR(analysis.topSegment.profit, false)} in profit.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>Highest sales segment</span>
                    </div>
                  </div>
                )}

                {/* 7. State Level Finding */}
                {analysis.topState && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          TOP STATE / LOCATION
                        </span>
                        <Landmark className="w-4 h-4 text-slate-600" />
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">
                        {analysis.topState.name} has the highest state-level profit
                      </h3>
                      <div className="text-2xl font-bold text-[#16A34A] mt-2">
                        {formatCompactINR(analysis.topState.profit, false)}
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                        {analysis.topState.name} ranks highest in profit among state-level locations at {formatCompactINR(analysis.topState.profit, false)}.
                        {analysis.bottomState && analysis.bottomState.profit < 0 && (
                          <span> Meanwhile, {analysis.bottomState.name} shows the largest deficit at {formatCompactINR(analysis.bottomState.profit, false)}.</span>
                        )}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400">
                      <span>State-level location divergence</span>
                    </div>
                  </div>
                )}

              </div>
            </section>

            {/* Academic Rigor & Non-Causal Clarification Banner */}
            <section aria-label="Methodological Note" className="bg-blue-50/70 rounded-xl border border-blue-200 p-5">
              <div className="flex items-start space-x-3.5">
                <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-blue-900 leading-relaxed">
                  <p className="font-semibold text-sm text-blue-950">
                    Analytical Note on Correlation vs. Causation
                  </p>
                  <p>
                    In this dataset, <strong>High Discount shows negative total profit</strong>. This is an empirical observation of transaction records, not an assertion that discount alone causes negative profit. Confounding variables such as product clearance, high shipping fees, and sub-category pricing strategies contribute to these observed margins.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
