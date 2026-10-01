"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { layoutWidth } from "@/lib/css-zoom";
import { isAppReady } from "@/lib/motion";
import { useRevealOnView } from "@/lib/use-reveal-on-view";
import { cn } from "@/lib/utils";

const SUBPIXEL_SLACK = 2;

export function CardSlider({
  labels,
  className,
  viewportClassName,
  arrowClassName,
  arrowSides = { left: "-left-13.25", right: "-right-13.25" },
  fade,
  flush,
  reveal,
  children,
}: {
  labels: { prev: string; next: string };
  className?: string;
  viewportClassName: string;
  arrowClassName: string;
  arrowSides?: { left: string; right: string };
  fade?: boolean;
  flush?: boolean;
  reveal?: boolean;
  children: React.ReactNode;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const revealState = useRevealOnView(viewport, reveal ? "load" : "off");
  const [afterRoute] = useState(isAppReady);

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
    const amount = layoutWidth(slide) + gap;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * amount, behavior: reduce ? "instant" : "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewport}
        data-carousel
        onScroll={sync}
        data-at-start={atStart || undefined}
        data-at-end={atEnd || undefined}
        data-reveal={reveal ? (revealState === "entered" ? "shown" : revealState ?? undefined) : undefined}
        data-after-route={(reveal && afterRoute && revealState === "shown") || undefined}
        style={
          {
            "--clip-start": atStart ? "0px" : undefined,
            "--clip-end": atEnd ? "0px" : undefined,
          } as React.CSSProperties
        }
        /* no tocar: -mx-6/px-6 es aire para la sombra del hover y lift-clip es lo que evita que asome la card siguiente */
        className={cn(
          flush ? "lift-clip-flush" : "lift-clip",
          fade && "slider-fade",
          reveal && "slides-reveal",
          "no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 overflow-x-auto overscroll-x-none overflow-y-hidden px-6 *:snap-start *:snap-always",
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
      data-sfx="select"
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
