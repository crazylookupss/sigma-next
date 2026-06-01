"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  icon: React.ReactNode;
  accentColor: string;
  onClick?: () => void;
}

const accentBgMap: Record<string, string> = {
  blue: "rgba(59, 130, 246, 0.1)",
  purple: "rgba(168, 85, 247, 0.1)",
  teal: "rgba(20, 184, 166, 0.1)",
  amber: "rgba(245, 158, 11, 0.1)",
  indigo: "rgba(99, 102, 241, 0.1)",
};

const accentBorderMap: Record<string, string> = {
  blue: "border-l-[3px] border-l-blue-500",
  purple: "border-l-[3px] border-l-purple-500",
  teal: "border-l-[3px] border-l-teal-500",
  amber: "border-l-[3px] border-l-amber-500",
  indigo: "border-l-[3px] border-l-indigo-500",
};

export const MetricCard = memo(function MetricCard({
  title,
  value,
  icon,
  accentColor,
  onClick,
}: MetricCardProps) {
  const bg = accentBgMap[accentColor] || accentBgMap.blue;
  const border = accentBorderMap[accentColor] || accentBorderMap.blue;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass-card rounded-xl p-5 flex items-center gap-4 cursor-pointer",
        border
      )}
    >
      <div
        className="p-3 rounded-lg flex-shrink-0"
        style={{ background: bg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          {value ?? "—"}
        </p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );
});
