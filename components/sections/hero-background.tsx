"use client";

import { useEffect, useRef, useState } from "react";

import { useHeroSlide } from "@/components/sections/hero-slide-context";
import { hero, type HeroLoop, type HeroLoopVariant } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

type NetworkInformation = { saveData?: boolean };

const posterImage = ({ poster }: HeroLoopVariant) =>
  `image-set(url("${poster.avif}") type("image/avif"), url("${poster.webp}") type("image/webp"))`;

function useLoopVariant(loop: HeroLoop) {
  const [variant, setVariant] = useState<HeroLoopVariant | null>(null);

  useEffect(() => {
    const { connection } = navigator as Navigator & { connection?: NetworkInformation };
    if (connection?.saveData) return;

    const breakpoint = getComputedStyle(document.documentElement)
      .getPropertyValue("--breakpoint-desktop")
      .trim();
    const desktop = window.matchMedia(`(min-width: ${breakpoint})`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let loaded = false;

    const sync = () => {
      if (!loaded || reducedMotion.matches) {
        setVariant(null);
        return;
      }
      setVariant(desktop.matches ? loop.desktop : loop.mobile);
    };
    const start = () => {
      loaded = true;
      sync();
    };

    const timer = document.readyState === "complete" ? window.setTimeout(start) : undefined;
    if (timer === undefined) window.addEventListener("load", start, { once: true });
    desktop.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
      desktop.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, [loop]);

  return variant;
}

function LoopVideo({ variant }: { variant: HeroLoopVariant }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onPlaying={() => setPlaying(true)}
      className={cn("absolute inset-0 size-full opacity-0", playing && "opacity-100")}
    >
      {variant.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

function HeroLoopArt({ loop }: { loop: HeroLoop }) {
  const variant = useLoopVariant(loop);

  return (
    <div
      style={
        {
          "--hero-poster-mobile": posterImage(loop.mobile),
          "--hero-poster-desktop": posterImage(loop.desktop),
        } as React.CSSProperties
      }
      className="absolute inset-x-0 top-0 aspect-hero-loop-mobile hero-poster-mobile desktop:aspect-hero-loop-desktop desktop:hero-poster-desktop"
    >
      {variant && <LoopVideo key={variant.poster.webp} variant={variant} />}
    </div>
  );
}

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
      onAnimationEnd={onArrived}
      className={cn("absolute inset-0", entering && "hero-art-fade")}
    >
      {slide.framing === "loop" ? (
        <HeroLoopArt loop={slide.loop} />
      ) : (
        <div
          style={{ "--hero-art": `url("${slide.artSrc}")` } as React.CSSProperties}
          className="absolute inset-0 hero-art-cover"
        />
      )}
    </div>
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
