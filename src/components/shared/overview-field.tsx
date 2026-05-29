import { Copy } from "lucide-react";

interface OverviewFieldProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  onCopy?: () => void;
}

export function OverviewField({ label, value, mono, copyable, onCopy }: OverviewFieldProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span
          className={`text-sm font-medium text-foreground ${
            mono ? "font-mono text-xs text-muted-foreground" : ""
          }`}
        >
          {value ?? "—"}
        </span>
        {copyable && onCopy && value && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onCopy();
            }}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title={`Copy ${label}`}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

