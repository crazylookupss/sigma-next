"use client";

import dynamic from "next/dynamic";

export const LazyLineChart = dynamic(
  () => import("@/components/charts/line-chart").then((mod) => mod.LineChart),
  { ssr: false }
);

export const LazyDonutChart = dynamic(
  () => import("@/components/charts/donut-chart").then((mod) => mod.DonutChart),
  { ssr: false }
);
