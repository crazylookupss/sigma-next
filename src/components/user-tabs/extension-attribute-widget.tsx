"use client";

import { Copy } from "lucide-react";

export function ExtensionAttributeWidget({
  name,
  value,
  copyable = false,
  copyHelper
}: {
  name: string;
  value: string | null;
  copyable?: boolean;
  copyHelper?: (text: string, label: string) => void;
}) {
  const isSet = value !== null && value !== undefined && value !== "";

  return (
    <div className={`p-2.5 rounded-lg border text-xs flex justify-between items-center transition-all ${
      isSet
        ? "bg-primary/5 border-primary/20 text-foreground"
        : "bg-accent/5 border-border/15 text-muted-foreground opacity-65"
    }`}>
      <div className="min-w-0 pr-2">
        <span className={`font-mono text-[9px] block uppercase ${isSet ? "text-primary/75 font-bold" : "text-muted-foreground/60"}`}>
          {name.replace("extensionAttribute", "Attr ")}
        </span>
        <span className={`font-medium block truncate ${isSet ? "text-foreground font-semibold" : "italic text-muted-foreground/50"}`}>
          {value ?? "Not configured"}
        </span>
      </div>
      {copyable && value && copyHelper && (
        <button
          onClick={() => copyHelper(value, name)}
          className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
          title={`Copy ${name}`}
        >
          <Copy className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
