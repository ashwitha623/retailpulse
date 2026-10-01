import React from 'react';
import KPICard from './KPICard';
import { IndianRupee, TrendingUp, Package, Percent } from 'lucide-react';
import {
  formatCompactINR,
  formatINR,
  formatNumber,
  formatPercent,
} from '../utils/formatters';

/**
 * Quick Summary Cards Container
 * Renders the 4 primary business metrics with simple, friendly language:
 * 1. Total Sales ("Money generated from sales")
 * 2. Total Profit ("Profit from selected records")
 * 3. Total Quantity ("Number of items sold")
 * 4. Profit Margin ("Profit as a percentage of sales")
 */
export default function KPICards({
  metrics = null,
  isLoading = false,
}) {
  const isLoaded = metrics !== null && !isLoading;

  const cards = [
    {
      id: 'totalSales',
      label: 'TOTAL SALES',
      value: isLoaded ? formatCompactINR(metrics.totalSales) : null,
      exactValue: isLoaded ? formatINR(metrics.totalSales) : null,
      icon: IndianRupee,
      iconBgClass: 'bg-blue-50 text-[#2563EB]',
      variant: 'default',
      subtext: 'Money generated from sales',
      badge: 'Sales',
    },
    {
      id: 'totalProfit',
      label: 'TOTAL PROFIT',
      value: isLoaded ? formatCompactINR(metrics.totalProfit) : null,
      exactValue: isLoaded ? formatINR(metrics.totalProfit) : null,
      icon: TrendingUp,
      iconBgClass: isLoaded && metrics.totalProfit < 0 ? 'bg-red-50 text-[#DC2626]' : 'bg-emerald-50 text-[#16A34A]',
      variant: isLoaded
        ? metrics.totalProfit >= 0
          ? 'positive'
          : 'negative'
        : 'default',
      subtext: 'Profit from selected records',
      badge: 'Profit',
    },
    {
      id: 'totalQuantity',
      label: 'TOTAL QUANTITY',
      value: isLoaded ? formatNumber(metrics.totalQuantity) : null,
      exactValue: isLoaded ? `${formatNumber(metrics.totalQuantity)} items` : null,
      icon: Package,
      iconBgClass: 'bg-sky-50 text-[#0EA5E9]',
      variant: 'default',
      subtext: 'Number of items sold',
      badge: 'Quantity',
    },
    {
      id: 'profitMargin',
      label: 'PROFIT MARGIN',
      value: isLoaded ? formatPercent(metrics.profitMargin) : null,
      exactValue: isLoaded ? `${metrics.profitMargin.toFixed(4)}%` : null,
      icon: Percent,
      iconBgClass: isLoaded && metrics.profitMargin < 0 ? 'bg-red-50 text-[#DC2626]' : 'bg-indigo-50 text-[#2563EB]',
      variant: isLoaded
        ? metrics.profitMargin >= 0
          ? 'positive'
          : 'negative'
        : 'default',
      subtext: 'Profit as a percentage of sales',
      badge: 'Margin',
    },
  ];

  return (
    <section aria-label="Key Performance Indicators">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <KPICard
            key={card.id}
            label={card.label}
            value={card.value}
            exactValue={card.exactValue}
            icon={card.icon}
            iconBgClass={card.iconBgClass}
            variant={card.variant}
            subtext={card.subtext}
            badge={card.badge}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
}
