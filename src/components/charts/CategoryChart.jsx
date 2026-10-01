import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import { formatCompactINR, USD_TO_INR } from '../../utils/formatters';

/**
 * Chart 1: Sales & Profit by Category (Displayed in INR)
 * Grouped bar chart comparing Total Sales and Total Profit across categories.
 */
export default function CategoryChart({ data = [] }) {
  const chartData = useMemo(() => {
    const categories = ['Furniture', 'Office Supplies', 'Technology'];
    const map = {};
    categories.forEach((cat) => {
      map[cat] = { category: cat, Sales: 0, Profit: 0 };
    });

    data.forEach((row) => {
      if (map[row.Category]) {
        map[row.Category].Sales += row.Sales * USD_TO_INR;
        map[row.Category].Profit += row.Profit * USD_TO_INR;
      }
    });

    return categories
      .map((cat) => map[cat])
      .filter((item) => item.Sales > 0 || item.Profit !== 0 || data.some((r) => r.Category === item.category));
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
            dataKey="category"
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
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
          />
          <Bar
            dataKey="Sales"
            name="Sales"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
          <Bar
            dataKey="Profit"
            name="Profit"
            fill="#16A34A"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
