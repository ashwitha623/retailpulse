import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Header from './components/Header';
import Filters from './components/Filters';
import KPICards from './components/KPICards';
import ChartCard from './components/ChartCard';
import Insights from './components/Insights';
import CategoryChart from './components/charts/CategoryChart';
import SubCategoryChart from './components/charts/SubCategoryChart';
import DiscountChart from './components/charts/DiscountChart';
import RegionChart from './components/charts/RegionChart';
import SegmentChart from './components/charts/SegmentChart';
import StateProfitChart from './components/charts/StateProfitChart';
import {
  Layers,
  TrendingUp,
  Percent,
  MapPin,
  Users,
  BarChart3,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

/**
 * RetailPulse — E-Commerce Sales & Profit Analytics
 * Stage 3: Interactive Recharts Visualizations Connected to Central filteredData State
 */
export default function App() {
  // Raw dataset state
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Active filter state (Central Source of Truth)
  const [filters, setFilters] = useState({
    region: 'All',
    category: 'All',
    segment: 'All',
    discountLevel: 'All',
    shipMode: 'All',
  });

  // Load and parse CSV dataset on mount
  const loadDataset = () => {
    setIsLoading(true);
    setLoadError(null);

    Papa.parse(`${import.meta.env.BASE_URL}final_dataset.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('Parsed dataset contains no records.');
          }

          // Clean, validate and explicitly cast numeric fields
          const sanitized = results.data
            .filter((row) => row && row.Category && row.Region) // filter malformed rows
            .map((row) => ({
              ...row,
              Sales: typeof row.Sales === 'number' ? row.Sales : parseFloat(row.Sales) || 0,
              Profit: typeof row.Profit === 'number' ? row.Profit : parseFloat(row.Profit) || 0,
              Quantity: typeof row.Quantity === 'number' ? row.Quantity : parseInt(row.Quantity, 10) || 0,
              Discount: typeof row.Discount === 'number' ? row.Discount : parseFloat(row.Discount) || 0,
              Profit_Margin: typeof row.Profit_Margin === 'number' ? row.Profit_Margin : parseFloat(row.Profit_Margin) || 0,
              Sales_Per_Item: typeof row.Sales_Per_Item === 'number' ? row.Sales_Per_Item : parseFloat(row.Sales_Per_Item) || 0,
              Discount_Level: String(row.Discount_Level || '').trim(),
              'Ship Mode': String(row['Ship Mode'] || '').trim(),
              Segment: String(row.Segment || '').trim(),
              Region: String(row.Region || '').trim(),
              Category: String(row.Category || '').trim(),
              'Sub-Category': String(row['Sub-Category'] || '').trim(),
              State: String(row.State || '').trim(),
              City: String(row.City || '').trim(),
              Country: String(row.Country || '').trim(),
              'Postal Code': row['Postal Code'],
            }));

          setRawData(sanitized);
          setIsLoading(false);
        } catch (err) {
          console.error('Error processing dataset:', err);
          setLoadError(err.message || 'Failed to process dataset.');
          setIsLoading(false);
        }
      },
      error: (err) => {
        console.error('CSV fetch error:', err);
        setLoadError(`Failed to load CSV: ${err.message || 'Unknown network error'}`);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    loadDataset();
  }, []);

  // Dynamically derive unique filter options from the dataset
  const filterOptions = useMemo(() => {
    if (!rawData.length) {
      return {
        region: [],
        category: [],
        segment: [],
        discountLevel: [],
        shipMode: [],
      };
    }

    const getUniques = (key) =>
      [...new Set(rawData.map((r) => r[key]).filter(Boolean))].sort();

    // Preserve logical hierarchy for discount tiers
    const discountOrder = ['No Discount', 'Low', 'Medium', 'High'];
    const rawDiscountLevels = [...new Set(rawData.map((r) => r.Discount_Level).filter(Boolean))];
    const sortedDiscountLevels = rawDiscountLevels.sort((a, b) => {
      const idxA = discountOrder.indexOf(a);
      const idxB = discountOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });

    return {
      region: getUniques('Region'),
      category: getUniques('Category'),
      segment: getUniques('Segment'),
      discountLevel: sortedDiscountLevels,
      shipMode: getUniques('Ship Mode'),
    };
  }, [rawData]);

  // Central filtered dataset (Applies all 5 active filters with AND logic)
  const filteredData = useMemo(() => {
    if (!rawData.length) return [];

    return rawData.filter((row) => {
      if (filters.region !== 'All' && row.Region !== filters.region) return false;
      if (filters.category !== 'All' && row.Category !== filters.category) return false;
      if (filters.segment !== 'All' && row.Segment !== filters.segment) return false;
      if (filters.discountLevel !== 'All' && row.Discount_Level !== filters.discountLevel) return false;
      if (filters.shipMode !== 'All' && row['Ship Mode'] !== filters.shipMode) return false;
      return true;
    });
  }, [rawData, filters]);

  // Calculate executive KPI metrics from filtered data
  const kpiMetrics = useMemo(() => {
    if (!rawData.length) return null;

    let totalSales = 0;
    let totalProfit = 0;
    let totalQuantity = 0;

    for (let i = 0; i < filteredData.length; i++) {
      const row = filteredData[i];
      totalSales += row.Sales;
      totalProfit += row.Profit;
      totalQuantity += row.Quantity;
    }

    // Overall profit margin: (Total Profit / Total Sales) * 100
    const profitMargin = totalSales !== 0 ? (totalProfit / totalSales) * 100 : 0;

    return {
      totalSales,
      totalProfit,
      totalQuantity,
      profitMargin,
      rowCount: filteredData.length,
      totalRowCount: rawData.length,
    };
  }, [rawData.length, filteredData]);

  // Filter change handler
  const handleFilterChange = (filterId, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  // Reset all filters to default 'All'
  const handleResetFilters = () => {
    setFilters({
      region: 'All',
      category: 'All',
      segment: 'All',
      discountLevel: 'All',
      shipMode: 'All',
    });
  };

  const isDataEmpty = !isLoading && rawData.length > 0 && filteredData.length === 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      
      {/* 1. HEADER */}
      <Header
        totalCount={rawData.length}
        filteredCount={filteredData.length}
        isLoading={isLoading}
        error={loadError}
      />

      {/* MAIN DASHBOARD CONTENT */}
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

        {/* 2. FILTER SECTION */}
        <section aria-label="Dashboard Filters">
          <Filters
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            disabled={isLoading || !!loadError}
          />
        </section>

        {/* 3. KPI CARDS SECTION */}
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

        {/* 4. CHART AREA: 6 Real Interactive Recharts Visualizations */}
        <section aria-label="Charts & Analysis" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
                CHARTS & ANALYSIS
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Compare sales, profit, regions, categories and discounts
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-blue-50 text-[#2563EB] self-start sm:self-auto border border-blue-100">
              6 Interactive Charts
            </span>
          </div>

          {/* 6 Reusable Chart Cards in a Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Sales & Profit by Category */}
            <ChartCard
              title="Sales & Profit by Category"
              description="Compare sales and profit across categories."
              badge="Grouped Bar Chart"
              icon={Layers}
              isEmpty={isDataEmpty}
            >
              <CategoryChart data={filteredData} />
            </ChartCard>

            {/* Chart 2: Profit by Sub-Category */}
            <ChartCard
              title="Profit by Sub-Category"
              description="See which sub-categories make or lose money."
              badge="Horizontal Bar Chart"
              icon={TrendingUp}
              isEmpty={isDataEmpty}
            >
              <SubCategoryChart data={filteredData} />
            </ChartCard>

            {/* Chart 3: Profit by Discount Level */}
            <ChartCard
              title="Profit by Discount Level"
              description="Compare profit across different discount levels."
              badge="Bar Chart"
              icon={Percent}
              isEmpty={isDataEmpty}
            >
              <DiscountChart data={filteredData} />
            </ChartCard>

            {/* Chart 4: Sales & Profit by Region */}
            <ChartCard
              title="Sales & Profit by Region"
              description="Compare sales and profit across regions."
              badge="Grouped Bar Chart"
              icon={MapPin}
              isEmpty={isDataEmpty}
            >
              <RegionChart data={filteredData} />
            </ChartCard>

            {/* Chart 5: Sales & Profit by Segment */}
            <ChartCard
              title="Sales & Profit by Segment"
              description="Compare performance across customer segments."
              badge="Grouped Bar Chart"
              icon={Users}
              isEmpty={isDataEmpty}
            >
              <SegmentChart data={filteredData} />
            </ChartCard>

            {/* Chart 6: Profit by State */}
            <ChartCard
              title="Profit by State"
              description="See which states make the most and least profit."
              badge="Horizontal Bar Chart"
              icon={BarChart3}
              isEmpty={isDataEmpty}
            >
              <StateProfitChart data={filteredData} />
            </ChartCard>

          </div>
        </section>

        {/* 5. KEY INSIGHTS SECTION */}
        <section aria-label="Key Insights">
          <Insights data={filteredData} />
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-[#0F172A] font-semibold">RetailPulse</strong> — Foundation of Data Science Project
          </p>
          <p className="text-slate-400">
            Real Dataset &bull; 9,977 Records &bull; 16 Columns &bull; Currency: INR (₹96 / USD) &bull; React + Vite + Tailwind CSS + Recharts
          </p>
        </div>
      </footer>

    </div>
  );
}
