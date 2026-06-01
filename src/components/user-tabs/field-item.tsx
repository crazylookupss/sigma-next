"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function FieldItem({
  label,
  value,
  copyable = false,
  mono = false,
}: {
  label: string;
  value?: string | null;
  copyable?: boolean;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border/30 last:border-b-0">
      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">{label}</span>
      <div className="flex items-center gap-1.5 mt-1 sm:mt-0 max-w-full sm:max-w-[70%]">
        <span className={`text-xs font-semibold text-foreground select-all truncate ${
          mono ? "font-mono text-muted-foreground/90 bg-accent/20 px-1.5 py-0.5 rounded border border-border/10" : ""
        }`}>
          {value ?? "—"}
        </span>
        {copyable && value && (
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={`Copy ${label}`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
