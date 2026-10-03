import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import { formatCompactINR, USD_TO_INR } from '../../utils/formatters';

/**
 * Chart 6: Top & Bottom States / Locations by Profit (Displayed in INR)
 * Horizontal diverging bar chart displaying the Top 5 and Bottom 5 state-level locations by profit.
 * Automatically switches locations dynamically based on active filter selections.
 */
export default function StateProfitChart({ data = [] }) {
  const chartData = useMemo(() => {
    const map = {};
    data.forEach((row) => {
      const state = row.State;
      if (!state) return;
      if (!map[state]) {
        map[state] = { state, Profit: 0 };
      }
      map[state].Profit += row.Profit * USD_TO_INR;
    });

    const stateList = Object.values(map);
    if (stateList.length <= 10) {
      return stateList.sort((a, b) => a.Profit - b.Profit);
    }

    // Sort descending by profit
    const sortedDesc = [...stateList].sort((a, b) => b.Profit - a.Profit);
    const top5 = sortedDesc.slice(0, 5);
    const bottom5 = sortedDesc.slice(-5);

    // Merge and deduplicate, sorted ascending (largest loss to highest profit)
    const combinedMap = new Map();
    bottom5.forEach((item) => combinedMap.set(item.state, item));
    top5.forEach((item) => combinedMap.set(item.state, item));

    return Array.from(combinedMap.values()).sort((a, b) => a.Profit - b.Profit);
  }, [data]);

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 25, left: 15, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
          <XAxis
            type="number"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            tickFormatter={(val) => formatCompactINR(val, false)}
          />
          <YAxis
            type="category"
            dataKey="state"
            stroke="#64748B"
            fontSize={11}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            width={95}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={1.5} />
          <Bar dataKey="Profit" name="Profit" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.Profit >= 0 ? '#16A34A' : '#DC2626'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
