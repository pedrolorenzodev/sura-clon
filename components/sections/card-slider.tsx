"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const SUBPIXEL_SLACK = 1;

export function CardSlider({
  labels,
  className,
  viewportClassName,
  arrowClassName,
  arrowSides = { left: "-left-13.25", right: "-right-13.25" },
  children,
}: {
  labels: { prev: string; next: string };
  className?: string;
  viewportClassName: string;
  arrowClassName: string;
  arrowSides?: { left: string; right: string };
  children: React.ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= SUBPIXEL_SLACK);
    setAtEnd(
      el.scrollLeft >= el.scrollWidth - el.clientWidth - SUBPIXEL_SLACK,
    );
  }, []);

  useEffect(sync, [sync]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = viewport.current;
    if (!el) return;
    const slide = el.firstElementChild;
    if (!slide) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    const amount = slide.getBoundingClientRect().width + gap;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewport}
        onScroll={sync}
        style={
          {
            "--clip-start": atStart ? "0px" : undefined,
            "--clip-end": atEnd ? "0px" : undefined,
          } as React.CSSProperties
        }
        /* no tocar: -mx-6/px-6 es aire para la sombra del hover y lift-clip es lo que evita que asome la card siguiente */
        className={cn(
          "lift-clip no-scrollbar -mx-6 flex overflow-x-auto overflow-y-hidden px-6",
          viewportClassName,
        )}
      >
        {children}
      </div>

      <SliderButton
        side="left"
        label={labels.prev}
        className={cn(arrowSides.left, arrowClassName)}
        disabled={atStart}
        onClick={() => scrollByCard(-1)}
      />
      <SliderButton
        side="right"
        label={labels.next}
        className={cn(arrowSides.right, arrowClassName)}
        disabled={atEnd}
        onClick={() => scrollByCard(1)}
      />
    </div>
  );
}

function SliderButton({
  side,
  label,
  className,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  className: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center transition-colors duration-200 motion-reduce:transition-none desktop:flex",
        className,
        disabled
          ? "cursor-default text-border-dim"
          : "text-foreground hover:text-brand focus-visible:text-brand",
      )}
    >
      <Icon className="size-8" strokeWidth={1.5} />
    </button>
  );
}
