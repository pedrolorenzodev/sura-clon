"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useHeroSlide } from "@/components/sections/hero-slide-context";
import { hero, type HeroLoop, type HeroLoopSource, type HeroLoopVariant } from "@/lib/data/hero";
import { endIntro, markIntroStarted, readIntroPhase, revealIntro } from "@/lib/hero-intro";
import { useIntroPhase } from "@/lib/use-intro-phase";
import { cn } from "@/lib/utils";

type NetworkInformation = { saveData?: boolean };
type Breakpoint = "mobile" | "desktop";

const INTRO_START_TIMEOUT_MS = 1500;
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

const posterImage = ({ poster }: HeroLoopVariant) =>
  `image-set(url("${poster.avif}") type("image/avif"), url("${poster.webp}") type("image/webp"))`;

function useLoopBreakpoint(eager: boolean) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const { connection } = navigator as Navigator & { connection?: NetworkInformation };
    if (connection?.saveData) return;

    const desktopWidth = getComputedStyle(document.documentElement)
      .getPropertyValue("--breakpoint-desktop")
      .trim();
    const desktop = window.matchMedia(`(min-width: ${desktopWidth})`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let started = false;

    const sync = () => {
      if (!started || reducedMotion.matches) {
        setBreakpoint(null);
        return;
      }
      setBreakpoint(desktop.matches ? "desktop" : "mobile");
    };
    const start = () => {
      started = true;
      sync();
    };

    const ready = eager || document.readyState === "complete";
    const timer = ready ? window.setTimeout(start) : undefined;
    if (!ready) window.addEventListener("load", start, { once: true });
    desktop.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
      desktop.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, [eager]);

  return breakpoint;
}

function LoopVideo({
  sources,
  hold,
  className,
}: {
  sources: HeroLoopSource[];
  hold: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || hold) return;

    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);

    return () => observer.disconnect();
  }, [hold]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onPlaying={() => setPlaying(true)}
      className={cn("absolute inset-0 size-full opacity-0", className, playing && "opacity-100")}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

function IntroVideo({
  sources,
  revealAt,
  onStarted,
  className,
}: {
  sources: HeroLoopSource[];
  revealAt: number;
  onStarted: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let revealTimer: number | undefined;
    const startTimer = window.setTimeout(endIntro, INTRO_START_TIMEOUT_MS);
    const onPlaying = () => {
      window.clearTimeout(startTimer);
      if (readIntroPhase() !== "pending") return;
      markIntroStarted();
      setVisible(true);
      onStarted();
      revealTimer = window.setTimeout(
        revealIntro,
        Math.max(0, (revealAt - video.currentTime) * 1000),
      );
    };
    const skip = () => {
      if (readIntroPhase() === "pending") endIntro();
    };

    video.muted = true;
    video.addEventListener("playing", onPlaying, { once: true });
    video.addEventListener("ended", endIntro);
    for (const type of SKIP_EVENTS) window.addEventListener(type, skip, { passive: true });
    video.play().catch(endIntro);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(revealTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", endIntro);
      for (const type of SKIP_EVENTS) window.removeEventListener(type, skip);
    };
  }, [revealAt, onStarted]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className={cn(
        "hero-intro-fade absolute inset-0 size-full motion-reduce:transition-none",
        className,
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

function HeroLoopArt({ loop }: { loop: HeroLoop }) {
  const introPhase = useIntroPhase();
  const introActive = Boolean(loop.intro) && introPhase !== null;
  const breakpoint = useLoopBreakpoint(introActive);
  const [introStarted, setIntroStarted] = useState(false);
  const markIntroStarted = useCallback(() => setIntroStarted(true), []);
  const cover = loop.fit === "cover";
  const videoFit = cover
    ? "object-cover hero-video-focus-mobile desktop:hero-video-focus-desktop"
    : undefined;

  return (
    <div
      style={
        {
          "--hero-poster-mobile": posterImage(loop.mobile),
          "--hero-poster-desktop": posterImage(loop.desktop),
          ...(loop.fit === "cover" && {
            "--hero-focus-mobile": loop.focus.mobile,
            "--hero-focus-desktop": loop.focus.desktop,
          }),
        } as React.CSSProperties
      }
      className={
        cover
          ? "absolute inset-0"
          : "absolute inset-x-0 top-0 aspect-hero-loop-mobile desktop:aspect-hero-loop-desktop"
      }
    >
      <div
        className={cn(
          "absolute inset-0",
          cover
            ? "hero-poster-cover-mobile desktop:hero-poster-cover-desktop"
            : "hero-poster-mobile desktop:hero-poster-desktop",
          loop.intro && "intro-pending:invisible",
        )}
      />
      {breakpoint && (!introActive || introStarted) && (
        <LoopVideo
          key={`loop-${breakpoint}`}
          sources={loop[breakpoint].sources}
          hold={introActive}
          className={videoFit}
        />
      )}
      {breakpoint && introActive && loop.intro && (
        <IntroVideo
          key={`intro-${breakpoint}`}
          sources={loop.intro[breakpoint]}
          revealAt={loop.intro.revealAt}
          onStarted={markIntroStarted}
          className={videoFit}
        />
      )}
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

  useEffect(() => {
    if (activeSlide !== hero.activeSlide) endIntro();
  }, [activeSlide]);

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
