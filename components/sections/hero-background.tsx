"use client";

import { useState } from "react";

import { useHeroSlide } from "@/components/sections/hero-slide-context";
import { hero } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

function HeroArt({
  index,
  entering,
  onArrived,
}: {
  index: number;
  entering?: boolean;
  onArrived?: () => void;
}) {
  const slide = hero.slides[index];

  return (
    <div
      style={{ "--hero-art": `url("${slide.artSrc}")` } as React.CSSProperties}
      onAnimationEnd={onArrived}
      className={cn(
        "absolute inset-0",
        slide.framing === "design"
          ? "hero-art-mobile desktop:hero-art-desktop"
          : "hero-art-cover",
        entering && "hero-art-fade",
      )}
    />
  );
}

export function HeroBackground() {
  const { activeSlide } = useHeroSlide();
  const [shown, setShown] = useState(activeSlide);
  const [leaving, setLeaving] = useState<number | null>(null);

  if (activeSlide !== shown) {
    setLeaving(shown);
    setShown(activeSlide);
  }

  return (
    <div
      aria-hidden
      /* no tocar: el -z-10 y el overflow-hidden van en esta capa, nunca en la <section> */
      className="absolute inset-x-0 top-4 -z-10 h-hero-mobile overflow-hidden bg-background desktop:top-0 desktop:h-hero-desktop"
    >
      <div className="absolute inset-0 opacity-75 desktop:opacity-100">
        {leaving !== null && <HeroArt key={leaving} index={leaving} />}
        <HeroArt
          key={shown}
          index={shown}
          entering={leaving !== null}
          onArrived={() => setLeaving(null)}
        />
      </div>
      <div className="bg-hero-scrim-mobile absolute inset-0 desktop:bg-hero-scrim" />
    </div>
  );
}
