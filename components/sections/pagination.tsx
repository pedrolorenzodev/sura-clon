"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const COMPACT =
  "flex size-8 cursor-pointer items-center justify-center text-foreground transition-colors duration-200 not-disabled:hover:text-brand not-disabled:focus-visible:text-brand disabled:cursor-default disabled:text-border-dim motion-reduce:transition-none";

const CONTROL =
  "wipe flex h-9 cursor-pointer items-center justify-center gap-1 rounded-sm border px-3 py-2 text-sm transition-[color,border-color,scale] duration-200 [--wipe-fill:var(--color-surface-2)] not-disabled:active:scale-97 motion-reduce:transition-none";

const IDLE =
  "border-border-dim text-muted-foreground hover:border-border-muted hover:text-foreground focus-visible:border-border-muted focus-visible:text-foreground";

export function Pagination({
  pages,
  current,
  label,
  compactOnMobile,
  className,
}: {
  pages: number;
  current: number;
  label: string;
  compactOnMobile?: boolean;
  className?: string;
}) {
  const [page, setPage] = useState(current);
  const windowStart = Math.min(Math.max(page - 1, 1), Math.max(pages - 2, 1));

  return (
    <nav aria-label={label} className={cn("flex justify-center pt-3", className)}>
      {compactOnMobile && (
        <div className="flex items-center justify-center gap-6 desktop:hidden">
          <button type="button" data-sfx="click" onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Página anterior" className={COMPACT}>
            <ChevronLeft className="size-8" strokeWidth={2} aria-hidden />
          </button>
          <p className="flex items-center gap-1.5 text-base">
            <span className="font-semibold text-foreground">{page}</span>
            <span className="text-muted-foreground">/ {pages}</span>
          </p>
          <button type="button" data-sfx="click" onClick={() => setPage(page + 1)} disabled={page === pages} aria-label="Página siguiente" className={COMPACT}>
            <ChevronRight className="size-8" strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}

      <ul className={cn("flex items-center gap-3", compactOnMobile && "hidden desktop:flex")}>
        <li>
          <button
            type="button"
            data-sfx="click"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={cn(
              CONTROL,
              page === 1
                ? "cursor-not-allowed border-surface-2 text-border-dim"
                : IDLE,
            )}
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            Atrás
          </button>
        </li>

        {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
          <li
            key={number}
            className={cn(
              (number < windowStart || number > windowStart + 2) && "hidden desktop:block",
            )}
          >
            <button
              type="button"
              data-sfx="click"
              onClick={() => setPage(number)}
              aria-current={number === page ? "page" : undefined}
              className={cn(
                CONTROL,
                number === page
                  ? "wipe-on border-muted-foreground font-bold text-foreground"
                  : IDLE,
              )}
            >
              {number}
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            data-sfx="click"
            onClick={() => setPage(page + 1)}
            disabled={page === pages}
            className={cn(CONTROL, page === pages ? "cursor-not-allowed border-surface-2 text-border-dim" : IDLE)}
          >
            Siguiente
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}
