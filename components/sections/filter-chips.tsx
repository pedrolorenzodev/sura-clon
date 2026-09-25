"use client";

import { useState } from "react";

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
  const [selected, setSelected] = useState(current);

  return (
    <ul aria-label={label} className={cn("no-scrollbar flex gap-2 overflow-x-auto overscroll-x-none", className)}>
      {items.map((chip) => {
        const isCurrent = chip.id === selected;

        return (
          <li key={chip.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setSelected(chip.id)}
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
