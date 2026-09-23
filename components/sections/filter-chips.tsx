import { cn } from "@/lib/utils";

type ChipOption = { id: string; label: string };

export function FilterChips({
  items,
  current,
  label,
  className,
}: {
  items: ChipOption[];
  current: string;
  label: string;
  className?: string;
}) {
  return (
    <ul aria-label={label} className={cn("no-scrollbar flex gap-2 overflow-x-auto", className)}>
      {items.map((chip) => {
        const isCurrent = chip.id === current;

        return (
          <li key={chip.id} className="shrink-0">
            <button
              type="button"
              aria-pressed={isCurrent}
              className={cn(
                "flex h-9 cursor-pointer items-center justify-center rounded-pill border-2 px-4 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
                isCurrent
                  ? "border-muted-foreground bg-surface-2 text-foreground"
                  : "border-border-dim text-muted-foreground hover:border-border-muted hover:text-foreground focus-visible:border-border-muted focus-visible:text-foreground",
              )}
            >
              {chip.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
