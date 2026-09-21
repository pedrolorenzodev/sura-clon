import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const CONTROL =
  "flex h-9 cursor-pointer items-center justify-center gap-1 rounded-sm border px-3 py-2 text-sm transition-colors duration-200 motion-reduce:transition-none";

const IDLE =
  "border-border-dim text-muted-foreground hover:border-border-muted hover:text-foreground focus-visible:border-border-muted focus-visible:text-foreground";

export function Pagination({
  pages,
  current,
  label,
}: {
  pages: number;
  current: number;
  label: string;
}) {
  return (
    <nav aria-label={label} className="flex justify-center pt-3">
      <ul className="flex items-center gap-3">
        <li>
          <button
            type="button"
            disabled={current === 1}
            className={cn(
              CONTROL,
              current === 1
                ? "cursor-not-allowed border-surface-2 text-border-dim"
                : IDLE,
            )}
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            Atrás
          </button>
        </li>

        {Array.from({ length: pages }, (_, index) => index + 1).map((page, index) => (
          <li key={page} className={cn(index > 2 && "hidden desktop:block")}>
            <button
              type="button"
              aria-current={page === current ? "page" : undefined}
              className={cn(
                CONTROL,
                page === current
                  ? "border-muted-foreground bg-surface-2 font-bold text-foreground"
                  : IDLE,
              )}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            disabled={current === pages}
            className={cn(CONTROL, current === pages ? "cursor-not-allowed border-surface-2 text-border-dim" : IDLE)}
          >
            Siguiente
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}
