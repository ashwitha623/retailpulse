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
 * Chart 4: Sales & Profit by Region (Displayed in INR)
 * Grouped bar chart comparing sales and profit across Central, East, South, and West.
 */
export default function RegionChart({ data = [] }) {
  const chartData = useMemo(() => {
    const regions = ['Central', 'East', 'South', 'West'];
    const map = {};
    regions.forEach((reg) => {
      map[reg] = { region: reg, Sales: 0, Profit: 0 };
    });

    data.forEach((row) => {
      if (map[row.Region]) {
        map[row.Region].Sales += row.Sales * USD_TO_INR;
        map[row.Region].Profit += row.Profit * USD_TO_INR;
      }
    });

    return regions
      .map((reg) => map[reg])
      .filter((item) => item.Sales > 0 || item.Profit !== 0 || data.some((r) => r.Region === item.region));
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
            dataKey="region"
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
            maxBarSize={40}
          />
          <Bar
            dataKey="Profit"
            name="Profit"
            fill="#16A34A"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
