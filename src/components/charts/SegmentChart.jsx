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
 * Chart 5: Sales & Profit by Customer Segment (Displayed in INR)
 * Grouped bar chart comparing sales and profit across Consumer, Corporate, and Home Office segments.
 */
export default function SegmentChart({ data = [] }) {
  const chartData = useMemo(() => {
    const segments = ['Consumer', 'Corporate', 'Home Office'];
    const map = {};
    segments.forEach((seg) => {
      map[seg] = { segment: seg, Sales: 0, Profit: 0 };
    });

    data.forEach((row) => {
      if (map[row.Segment]) {
        map[row.Segment].Sales += row.Sales * USD_TO_INR;
        map[row.Segment].Profit += row.Profit * USD_TO_INR;
      }
    });

    return segments
      .map((seg) => map[seg])
      .filter((item) => item.Sales > 0 || item.Profit !== 0 || data.some((r) => r.Segment === item.segment));
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
            dataKey="segment"
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
