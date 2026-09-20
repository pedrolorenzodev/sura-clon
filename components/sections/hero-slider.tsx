"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

import { useHeroSlide } from "@/components/sections/hero-slide-context";
import { hero } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

function SliderArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Ver el juego anterior" : "Ver el juego siguiente"}
      className="flex shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-brand focus-visible:text-brand motion-reduce:transition-none desktop:w-15"
    >
      {isPrev ? (
        <>
          <ChevronLeft className="size-6 desktop:hidden" strokeWidth={1.5} />
          <ChevronUp
            className="hidden size-7 desktop:block"
            strokeWidth={1.5}
          />
        </>
      ) : (
        <>
          <ChevronRight className="size-6 desktop:hidden" strokeWidth={1.5} />
          <ChevronDown
            className="hidden size-7 desktop:block"
            strokeWidth={1.5}
          />
        </>
      )}
    </button>
  );
}

export function HeroSlider() {
  const { activeSlide, select, setHeld } = useHeroSlide();

  return (
    <div
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      className="flex shrink-0 items-center justify-center gap-1 desktop:w-gutter-desktop desktop:flex-col desktop:items-start desktop:gap-1.5 desktop:pl-11"
    >
      <SliderArrow direction="prev" onClick={() => select(activeSlide - 1)} />

      <ul
        aria-label="Juegos destacados"
        className="flex shrink-0 justify-center gap-3 desktop:flex-col desktop:gap-2.25"
      >
        {hero.slides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <li
              key={slide.game}
              style={{ "--thumb-index": index } as React.CSSProperties}
              className="thumb-reveal relative size-8 shrink-0 overflow-hidden rounded-xs bg-thumb-dim shadow-thumb-mobile desktop:size-15 desktop:rounded-lg desktop:shadow-thumb"
            >
              <button
                type="button"
                onClick={() => select(index)}
                aria-pressed={isActive}
                className="group block size-full cursor-pointer"
              >
                <span className="sr-only">Ver el arte de </span>
                <Image
                  src={slide.thumbnailSrc}
                  alt={slide.game}
                  width={60}
                  height={60}
                  fetchPriority={isActive ? undefined : "low"}
                  className={cn(
                    "size-full object-cover transition-opacity duration-200 motion-reduce:transition-none",
                    !isActive && "opacity-40 group-hover:opacity-70",
                  )}
                />
                {isActive ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xs border border-brand-legacy desktop:rounded-lg desktop:border-2"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <SliderArrow direction="next" onClick={() => select(activeSlide + 1)} />
    </div>
  );
}
