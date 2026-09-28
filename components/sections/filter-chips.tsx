"use client";

import { cn } from "@/lib/utils";

type ChipOption = { id: string; label: string };

export function FilterChips({
  items,
  value: selected,
  onChange,
  label,
  className,
}: {
  items: ChipOption[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  className?: string;
}) {

  return (
    <ul aria-label={label} className={cn("no-scrollbar flex gap-2 overflow-x-auto overscroll-x-none", className)}>
      {items.map((chip) => {
        const isCurrent = chip.id === selected;

        return (
          <li key={chip.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onChange(chip.id)}
              aria-pressed={isCurrent}
              data-sfx="click"
              className={cn(
                "wipe flex h-9 cursor-pointer items-center justify-center rounded-pill border-2 px-4 text-sm font-medium transition-[color,border-color,scale] duration-200 [--wipe-fill:var(--color-surface-2)] active:scale-97 motion-reduce:transition-none",
                isCurrent
                  ? "wipe-on border-muted-foreground text-foreground"
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
