"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface LineChartProps {
  data: { date: string; count: number }[];
  dataKey?: string;
  color?: string;
}

export function LineChart({
  data,
  dataKey = "count",
  color = "var(--primary)",
}: LineChartProps) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
            animationDuration={1000}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
