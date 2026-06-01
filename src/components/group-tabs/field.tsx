export function Field({
  label,
  value,
  mono = false
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-b-0 text-xs">
      <span className="text-muted-foreground pr-2">{label}</span>
      <span className={`font-medium text-right select-all pl-2 max-w-[65%] truncate ${
        mono ? "font-mono text-muted-foreground text-[10px]" : "text-foreground"
      }`}>
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </span>
    </div>
  );
}
