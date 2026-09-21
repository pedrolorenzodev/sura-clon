import { cn } from "@/lib/utils";

import { missionFilters } from "@/lib/data/missions";

export function MissionFilters({ current }: { current: string }) {
  return (
    <ul className="no-scrollbar flex gap-2 overflow-x-auto">
      {missionFilters.map((filter) => {
        const isCurrent = filter.id === current;

        return (
          <li key={filter.id} className="shrink-0">
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
              {filter.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
