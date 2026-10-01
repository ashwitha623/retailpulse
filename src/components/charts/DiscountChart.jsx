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
 * Chart 3: Profit by Discount Level (Displayed in INR)
 * Bar chart presenting cumulative profit across four discount tiers.
 * Visually distinguishes positive profit tiers (#16A34A) from deficit tiers (#DC2626).
 */
export default function DiscountChart({ data = [] }) {
  const chartData = useMemo(() => {
    const levels = ['No Discount', 'Low', 'Medium', 'High'];
    const map = {};
    levels.forEach((lvl) => {
      map[lvl] = { discountLevel: lvl, Profit: 0, count: 0 };
    });

    data.forEach((row) => {
      const lvl = row.Discount_Level;
      if (map[lvl]) {
        map[lvl].Profit += row.Profit * USD_TO_INR;
        map[lvl].count += 1;
      }
    });

    return levels.map((lvl) => map[lvl]);
  }, [data]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="discountLevel"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            tickFormatter={(val) => formatCompactINR(val, false)}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1.5} />
          <Bar dataKey="Profit" name="Total Profit" radius={[4, 4, 0, 0]} maxBarSize={45}>
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
