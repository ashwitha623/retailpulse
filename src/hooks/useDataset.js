import { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';

/**
 * Shared Dataset Hook for RetailPulse Multi-Page Application.
 * Centralizes data loading, PapaParse execution, dynamic filter derivation,
 * multi-dimensional filtering, and executive KPI computations.
 */
export function useDataset() {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Active filter state (Central Source of Truth)
  const [filters, setFilters] = useState({
    region: 'All',
    category: 'All',
    segment: 'All',
    discountLevel: 'All',
    shipMode: 'All',
  });

  // Load and parse CSV dataset inside useEffect to prevent cascading render warnings
  useEffect(() => {
    let isMounted = true;

    Papa.parse(`${import.meta.env.BASE_URL}final_dataset.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!isMounted) return;
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('Parsed dataset contains no records.');
          }

          // Clean, validate and explicitly cast numeric and string fields
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
          setLoadError(null);
        } catch (err) {
          console.error('Error processing dataset:', err);
          setLoadError(err.message || 'Failed to process dataset.');
          setIsLoading(false);
        }
      },
      error: (err) => {
        if (!isMounted) return;
        console.error('CSV fetch error:', err);
        setLoadError(`Failed to load CSV: ${err.message || 'Unknown network error'}`);
        setIsLoading(false);
      },
    });

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger]);

  const loadDataset = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setReloadTrigger((prev) => prev + 1);
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

  return {
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
  };
}
