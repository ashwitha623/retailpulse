import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filters from '../../components/Filters';
import ChartCard from '../../components/ChartCard';
import ChartModal from '../../components/ChartModal';
import CategoryChart from '../../components/charts/CategoryChart';
import SubCategoryChart from '../../components/charts/SubCategoryChart';
import DiscountChart from '../../components/charts/DiscountChart';
import RegionChart from '../../components/charts/RegionChart';
import SegmentChart from '../../components/charts/SegmentChart';
import StateProfitChart from '../../components/charts/StateProfitChart';
import { useDataset } from '../../hooks/useDataset';
import {
  Layers,
  TrendingUp,
  Percent,
  MapPin,
  Users,
  BarChart3,
  AlertTriangle,
  RotateCw,
  Sparkles,
} from 'lucide-react';

/**
 * Page 3: Charts Page for RetailPulse.
 * Dedicated Visualizations Page featuring 6 interactive business charts,
 * active multi-dimensional filters, and clickable chart detail modal.
 */
export default function ChartsPage() {
  const {
    rawData,
    filteredData,
    isLoading,
    loadError,
    filters,
    filterOptions,
    handleFilterChange,
    handleResetFilters,
    loadDataset,
    isDataEmpty,
  } = useDataset();

  // Active chart detail modal state
  const [selectedChart, setSelectedChart] = useState(null);

  const chartDefinitions = [
    {
      id: 'category',
      title: 'Sales & Profit by Category',
      description: 'Comparative dual-bar chart showing aggregate sales volume alongside realized profit across Furniture, Office Supplies, and Technology.',
      badge: 'Grouped Bar Chart',
      icon: Layers,
      component: <CategoryChart data={filteredData} />,
      takeaways: [
        'Technology has the highest sales and profit among the three categories.',
        'Office Supplies produces positive profit with consistent volume.',
        'Furniture produces high sales volume but lower overall profit margins.',
      ],
    },
    {
      id: 'subcategory',
      title: 'Profit by Sub-Category',
      description: 'Horizontal ranking of all 17 sub-categories sorted ascending by profit. Immediately identifies deficit items in red and positive earnings in green.',
      badge: 'Horizontal Bar Chart',
      icon: TrendingUp,
      component: <SubCategoryChart data={filteredData} />,
      takeaways: [
        'Copiers, Phones, and Accessories generate the highest profit among sub-categories.',
        'Tables and Bookcases show cumulative net losses in the dataset.',
        'Paper and Binders also generate strong positive profit.',
      ],
    },
    {
      id: 'discount',
      title: 'Profit by Discount Level',
      description: 'Cumulative profit distribution across 4 distinct discount tiers: No Discount, Low (0-20%), Medium (20-40%), and High (>40%).',
      badge: 'Bar Chart',
      icon: Percent,
      component: <DiscountChart data={filteredData} />,
      takeaways: [
        'Transactions with "No Discount" produce the highest total profit.',
        'High Discount (>40%) transactions show negative cumulative profit in this dataset.',
        'Low Discount (0-20%) generates steady positive profit across transaction records.',
      ],
    },
    {
      id: 'region',
      title: 'Sales & Profit by Region',
      description: 'Geographic comparison of revenue and profitability across the 4 primary operational territories: Central, East, South, and West.',
      badge: 'Grouped Bar Chart',
      icon: MapPin,
      component: <RegionChart data={filteredData} />,
      takeaways: [
        'West has the highest sales and profit among regions.',
        'East ranks second in both sales and profit in this dataset.',
        'Central and South regions show positive total profit at lower volume.',
      ],
    },
    {
      id: 'segment',
      title: 'Sales & Profit by Segment',
      description: 'Customer segmentation breakdown comparing Consumer, Corporate, and Home Office business units in total sales and profit.',
      badge: 'Grouped Bar Chart',
      icon: Users,
      component: <SegmentChart data={filteredData} />,
      takeaways: [
        'Consumer has the highest sales among the three segments.',
        'Corporate and Home Office contribute positive sales and profit in the dataset.',
      ],
    },
    {
      id: 'state',
      title: 'Top & Bottom States / Locations by Profit',
      description: 'Horizontal diverging bar chart displaying the Top 5 and Bottom 5 state-level locations by profit to spotlight high-profit markets and regional losses.',
      badge: 'Diverging Bar Chart',
      icon: BarChart3,
      component: <StateProfitChart data={filteredData} />,
      takeaways: [
        'California and New York generate the largest share of profit among locations.',
        'Texas, Ohio, and Pennsylvania reflect negative cumulative profit in this dataset.',
        'District of Columbia and other small territories are included as state-level locations in this dataset.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      <Header
        currentPage="charts"
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
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Visual Analytics
              </span>
              <span className="text-xs text-slate-400">&bull; Click any chart to expand detail view</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              ANALYTICAL CHARTS
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Explore 6 interactive Recharts visualizations configured with Indian Rupee (₹96 / USD) currency scaling.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>6 Business Visualizations</span>
            </span>
          </div>
        </div>

        {/* Error Notification Banner */}
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

        {/* 6 Reusable Chart Cards in a Responsive Grid */}
        <section aria-label="6 Interactive Charts Grid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartDefinitions.map((chart) => {
              const Icon = chart.icon;
              return (
                <ChartCard
                  key={chart.id}
                  title={chart.title}
                  description={chart.description}
                  badge={chart.badge}
                  icon={Icon}
                  isEmpty={isDataEmpty}
                  onExpand={() => setSelectedChart(chart)}
                >
                  {chart.component}
                </ChartCard>
              );
            })}
          </div>
        </section>

      </main>

      {/* Chart Detail / Expanded Modal */}
      {selectedChart && (
        <ChartModal
          isOpen={!!selectedChart}
          onClose={() => setSelectedChart(null)}
          title={selectedChart.title}
          description={selectedChart.description}
          badge={selectedChart.badge}
          takeaways={selectedChart.takeaways}
        >
          {selectedChart.component}
        </ChartModal>
      )}

      <Footer />
    </div>
  );
}
