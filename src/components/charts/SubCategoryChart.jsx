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
 * Chart 2: Profit by Sub-Category (Displayed in INR)
 * Horizontal bar chart sorted ascending by profit (lowest to highest).
 * Highlights loss-making items in red (#DC2626) and profitable items in green (#16A34A).
 */
export default function SubCategoryChart({ data = [] }) {
  const chartData = useMemo(() => {
    const map = {};
    data.forEach((row) => {
      const sub = row['Sub-Category'];
      if (!sub) return;
      if (!map[sub]) {
        map[sub] = { subCategory: sub, Profit: 0 };
      }
      map[sub].Profit += row.Profit * USD_TO_INR;
    });

    // Sort ascending: lowest profit (largest negative loss) to highest profit
    return Object.values(map).sort((a, b) => a.Profit - b.Profit);
  }, [data]);

  return (
    <div className="w-full h-[360px]">
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
            dataKey="subCategory"
            stroke="#64748B"
            fontSize={chartData.length > 10 ? 10 : 11}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: '#CBD5E1' }}
            width={95}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={1.5} />
          <Bar dataKey="Profit" name="Profit" radius={[0, 4, 4, 0]} maxBarSize={14}>
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
