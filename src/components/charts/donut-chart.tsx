"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
}

export function DonutChart({ data }: DonutChartProps) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span style={{ color: "var(--foreground)", fontSize: "13px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
