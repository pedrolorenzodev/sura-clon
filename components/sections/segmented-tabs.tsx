"use client";

import { cn } from "@/lib/utils";

type Segment = { id: string; label: string };

export function SegmentedTabs({
  items,
  value,
  onChange,
  label,
  className,
}: {
  items: Segment[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  className?: string;
}) {
  const index = Math.max(
    0,
    items.findIndex((item) => item.id === value),
  );

  return (
    <div
      role="tablist"
      aria-label={label}
      style={{ "--segment-index": index, "--segment-count": items.length } as React.CSSProperties}
      className={cn("relative flex rounded-full bg-surface-2 p-1 shadow-segment-inset", className)}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc((100%-var(--spacing)*2)/var(--segment-count))] translate-x-[calc(var(--segment-index)*100%)] rounded-full bg-surface-deep shadow-segment transition-transform duration-250 ease-in-out motion-reduce:transition-none"
      />
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            data-sfx="select"
            className={cn(
              "relative flex-1 cursor-pointer rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
