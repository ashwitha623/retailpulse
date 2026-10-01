import React, { useMemo } from 'react';
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
} from 'lucide-react';
import { formatCompactINR, USD_TO_INR } from '../utils/formatters';

/**
 * Key Insights Section
 * Dynamically computes and displays natural, user-friendly business insights in INR.
 * Automatically updates when filters change.
 */
export default function Insights({ data = [] }) {
  const insights = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Helper to group by dimension and sum INR values
    const groupData = (key) => {
      const map = {};
      data.forEach((row) => {
        const val = row[key];
        if (!val) return;
        if (!map[val]) {
          map[val] = { name: val, sales: 0, profit: 0, count: 0 };
        }
        map[val].sales += (row.Sales || 0) * USD_TO_INR;
        map[val].profit += (row.Profit || 0) * USD_TO_INR;
        map[val].count += 1;
      });
      return Object.values(map);
    };

    const results = [];

    // 1. Highest-performing Category
    const categories = groupData('Category').sort((a, b) => b.sales - a.sales);
    if (categories.length > 0) {
      const topCat = categories[0];
      results.push({
        id: 'category',
        category: 'TOP CATEGORY',
        icon: Layers,
        badgeColor: 'bg-blue-50 text-[#2563EB] border-blue-200',
        title: `${topCat.name} has the highest sales`,
        highlight: formatCompactINR(topCat.sales, false),
        highlightType: 'neutral',
        description: `${topCat.name} generates ${formatCompactINR(topCat.sales, false)} in sales and ${formatCompactINR(topCat.profit, false)} in profit.`,
      });
    }

    // 2. Most Profitable Sub-Category
    const subCategories = groupData('Sub-Category').sort((a, b) => b.profit - a.profit);
    if (subCategories.length > 0) {
      const topSub = subCategories[0];
      const topVerb = topSub.name.endsWith('s') ? 'have' : 'has';
      const topBringVerb = topSub.name.endsWith('s') ? 'bring' : 'brings';
      results.push({
        id: 'top-sub',
        category: 'TOP PROFIT',
        icon: TrendingUp,
        badgeColor: 'bg-emerald-50 text-[#16A34A] border-emerald-200',
        title: `${topSub.name} ${topVerb} the highest profit`,
        highlight: formatCompactINR(topSub.profit, false),
        highlightType: 'positive',
        description: `${topSub.name} ${topBringVerb} in the most profit at ${formatCompactINR(topSub.profit, false)}.`,
      });

      // 3. Largest Loss-Making Sub-Category
      const bottomSub = subCategories[subCategories.length - 1];
      const bottomVerb = bottomSub.name.endsWith('s') ? 'have' : 'has';
      if (bottomSub.profit < 0) {
        results.push({
          id: 'bottom-sub',
          category: 'BIGGEST LOSS',
          icon: TrendingDown,
          badgeColor: 'bg-red-50 text-[#DC2626] border-red-200',
          title: `${bottomSub.name} ${bottomVerb} the biggest loss`,
          highlight: formatCompactINR(bottomSub.profit, false),
          highlightType: 'negative',
          description: `${bottomSub.name} ${bottomVerb} the largest loss of ${formatCompactINR(bottomSub.profit, false)}.`,
        });
      } else if (subCategories.length > 1) {
        results.push({
          id: 'bottom-sub',
          category: 'BIGGEST LOSS',
          icon: TrendingUp,
          badgeColor: 'bg-emerald-50 text-[#16A34A] border-emerald-200',
          title: 'All sub-categories are profitable',
          highlight: `Lowest: ${formatCompactINR(bottomSub.profit, false)}`,
          highlightType: 'positive',
          description: `All sub-categories are profitable in this selection. Lowest is ${bottomSub.name} (${formatCompactINR(bottomSub.profit, false)}).`,
        });
      }
    }

    // 4. Discount Impact
    const discounts = groupData('Discount_Level').sort((a, b) => b.profit - a.profit);
    if (discounts.length > 0) {
      const bestDiscount = discounts[0];
      const worstDiscount = discounts[discounts.length - 1];
      const hasNegative = worstDiscount.profit < 0;

      results.push({
        id: 'discount',
        category: 'DISCOUNT',
        icon: Percent,
        badgeColor: hasNegative ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-[#2563EB] border-blue-200',
        title: `${bestDiscount.name} has the highest profit`,
        highlight: formatCompactINR(bestDiscount.profit, false),
        highlightType: bestDiscount.profit >= 0 ? 'positive' : 'negative',
        description: discounts.length > 1
          ? `${bestDiscount.name} discount earns ${formatCompactINR(bestDiscount.profit, false)}, while ${worstDiscount.name} discount earns ${formatCompactINR(worstDiscount.profit, false)}.`
          : `Total profit with ${bestDiscount.name} discount is ${formatCompactINR(bestDiscount.profit, false)}.`,
      });
    }

    // 5. Regional Performance
    const regions = groupData('Region').sort((a, b) => b.sales - a.sales);
    if (regions.length > 0) {
      const topRegion = regions[0];
      results.push({
        id: 'region',
        category: 'TOP REGION',
        icon: MapPin,
        badgeColor: 'bg-sky-50 text-[#0EA5E9] border-sky-200',
        title: `${topRegion.name} has the highest sales`,
        highlight: formatCompactINR(topRegion.sales, false),
        highlightType: 'neutral',
        description: `${topRegion.name} leads with ${formatCompactINR(topRegion.sales, false)} in sales and ${formatCompactINR(topRegion.profit, false)} in profit.`,
      });
    }

    // 6. Segment Performance
    const segments = groupData('Segment').sort((a, b) => b.sales - a.sales);
    if (segments.length > 0) {
      const topSegment = segments[0];
      results.push({
        id: 'segment',
        category: 'TOP SEGMENT',
        icon: Users,
        badgeColor: 'bg-indigo-50 text-[#2563EB] border-indigo-200',
        title: `${topSegment.name} has the highest sales`,
        highlight: formatCompactINR(topSegment.sales, false),
        highlightType: 'neutral',
        description: `${topSegment.name} segment generates ${formatCompactINR(topSegment.sales, false)} in sales and ${formatCompactINR(topSegment.profit, false)} in profit.`,
      });
    }

    // 7. State Performance
    const states = groupData('State').sort((a, b) => b.profit - a.profit);
    if (states.length > 0) {
      const topState = states[0];
      const bottomState = states[states.length - 1];
      const hasDeficit = bottomState.profit < 0;

      results.push({
        id: 'state',
        category: 'TOP STATE',
        icon: Landmark,
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        title: `${topState.name} has the highest profit`,
        highlight: formatCompactINR(topState.profit, false),
        highlightType: 'positive',
        description: hasDeficit
          ? `${topState.name} makes the most profit (${formatCompactINR(topState.profit, false)}), while ${bottomState.name} has the biggest loss (${formatCompactINR(bottomState.profit, false)}).`
          : `${topState.name} makes the most profit (${formatCompactINR(topState.profit, false)}). All selected states are profitable.`,
      });
    }

    return results;
  }, [data]);

  const isEmpty = !data || data.length === 0;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6" aria-labelledby="insights-heading">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 id="insights-heading" className="text-base font-bold text-[#0F172A] tracking-tight">
              KEY INSIGHTS
            </h2>
            <p className="text-xs text-[#64748B]">
              Important takeaways from the selected data
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#0F172A] self-start sm:self-auto border border-slate-200">
          {isEmpty ? '0 Insights' : `${insights.length} Key Insights`}
        </span>
      </div>

      {/* Dynamic Insights Grid */}
      {isEmpty ? (
        <div className="rounded-lg bg-[#F8FAFC] border border-dashed border-slate-200 p-8 text-center flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
          <h3 className="text-sm font-semibold text-[#0F172A]">
            No data available for the selected filters.
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mt-1">
            Choose different filters or reset them to view insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-white hover:shadow-sm transition-all p-4 flex flex-col justify-between"
              >
                {/* Card Top: Category Badge & Icon */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200/80 flex items-center justify-center text-slate-500">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card Middle: Headline & Main Highlight Metric */}
                <div className="my-1">
                  <h3 className="text-xs font-semibold text-[#0F172A] line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-lg sm:text-xl font-bold font-sans tracking-tight mt-1">
                    <span
                      className={
                        item.highlightType === 'positive'
                          ? 'text-[#16A34A]'
                          : item.highlightType === 'negative'
                          ? 'text-[#DC2626]'
                          : 'text-[#2563EB]'
                      }
                    >
                      {item.highlight}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Contextual Description */}
                <p className="text-xs text-[#64748B] mt-2 pt-2 border-t border-slate-200/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
