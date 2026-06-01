import { memo } from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "enabled" | "disabled" | "active" | "warning" | "error" | "unknown";
  label?: string;
}

const statusConfig = {
  enabled: { dot: "bg-success", text: "text-success", label: "Enabled" },
  active: { dot: "bg-success", text: "text-success", label: "Active" },
  disabled: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "Disabled" },
  warning: { dot: "bg-warning", text: "text-warning", label: "Warning" },
  error: { dot: "bg-destructive", text: "text-destructive", label: "Error" },
  unknown: { dot: "bg-muted-foreground/50", text: "text-muted-foreground", label: "Unknown" },
};

export const StatusBadge = memo(function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-block w-2 h-2 rounded-full", config.dot)} />
      <span className={cn("text-sm font-medium", config.text)}>
        {label ?? config.label}
      </span>
    </div>
  );
});
