"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useHeroSlide } from "@/components/sections/hero-slide-context";
import { hero, type HeroLoop, type HeroLoopSource, type HeroLoopVariant } from "@/lib/data/hero";
import { endIntro, isIntroWithSound, markIntroStarted, readIntroPhase, revealIntro } from "@/lib/hero-intro";
import { subscribeSlideRequests, warmSlide } from "@/lib/hero-preload";
import { playIntroSound } from "@/lib/sfx";
import { useIntroPhase, useIntroRun } from "@/lib/use-intro-phase";
import { cn } from "@/lib/utils";

type NetworkInformation = { saveData?: boolean };
type Breakpoint = "mobile" | "desktop" | "desktopHiDpi";

const INTRO_START_TIMEOUT_MS = 1500;
const INTRO_STALL_GRACE_MS = 1500;
const SWAP_WAIT_MS = 300;
const INTRO_CHIP_SELECTOR = "[data-intro-chip]";
const HI_DPI_MIN_DEVICE_WIDTH = 2200;
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

const posterImage = ({ poster }: HeroLoopVariant, hiDpi?: HeroLoopVariant) =>
  hiDpi
    ? `image-set(url("${poster.avif}") type("image/avif") 1x, url("${hiDpi.poster.avif}") type("image/avif") 2x, url("${poster.webp}") type("image/webp") 1x, url("${hiDpi.poster.webp}") type("image/webp") 2x)`
    : `image-set(url("${poster.avif}") type("image/avif"), url("${poster.webp}") type("image/webp"))`;

function useLoopBreakpoint(eager: boolean, hasHiDpi: boolean) {
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
      if (!desktop.matches) {
        setBreakpoint("mobile");
        return;
      }
      const deviceWidth = window.innerWidth * window.devicePixelRatio;
      setBreakpoint(hasHiDpi && deviceWidth >= HI_DPI_MIN_DEVICE_WIDTH ? "desktopHiDpi" : "desktop");
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
  }, [eager, hasHiDpi]);

  return breakpoint;
}

function LoopVideo({
  sources,
  hold,
  rewind,
  className,
}: {
  sources: HeroLoopSource[];
  hold: boolean;
  rewind: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (hold) {
      video.pause();
      if (rewind) video.currentTime = 0;
      return;
    }

    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);

    return () => observer.disconnect();
  }, [hold, rewind]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onPlaying={() => setPlaying(true)}
      className={cn(
        "absolute inset-0 size-full opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
        className,
        playing && "opacity-100",
      )}
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
    let stallTimer: number | undefined;
    const finish = () => endIntro();
    const startTimer = window.setTimeout(finish, INTRO_START_TIMEOUT_MS);
    const onPlaying = () => {
      window.clearTimeout(startTimer);
      if (readIntroPhase() !== "pending") return;
      markIntroStarted();
      setVisible(true);
      onStarted();
      if (isIntroWithSound()) playIntroSound(video.currentTime);
      revealTimer = window.setTimeout(
        revealIntro,
        Math.max(0, (revealAt - video.currentTime) * 1000),
      );
      if (Number.isFinite(video.duration)) {
        stallTimer = window.setTimeout(
          finish,
          Math.max(0, (video.duration - video.currentTime) * 1000) + INTRO_STALL_GRACE_MS,
        );
      }
    };
    const skip = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(INTRO_CHIP_SELECTOR)) return;
      if (readIntroPhase() === "pending") endIntro(true);
    };

    video.muted = true;
    video.addEventListener("playing", onPlaying, { once: true });
    video.addEventListener("ended", finish);
    for (const type of SKIP_EVENTS) window.addEventListener(type, skip, { passive: true });
    video.play().catch(finish);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(stallTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", finish);
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

function HeroLoopArt({ loop, active, videoAllowed }: { loop: HeroLoop; active: boolean; videoAllowed: boolean }) {
  const introPhase = useIntroPhase();
  const introRun = useIntroRun();
  const introActive = Boolean(loop.intro) && introPhase !== null;
  const breakpoint = useLoopBreakpoint(introActive, Boolean(loop.desktopHiDpi));
  const variant =
    breakpoint === "desktopHiDpi" ? (loop.desktopHiDpi ?? loop.desktop) : breakpoint && loop[breakpoint];
  const introSources =
    loop.intro && breakpoint
      ? breakpoint === "desktopHiDpi"
        ? (loop.intro.desktopHiDpi ?? loop.intro.desktop)
        : loop.intro[breakpoint]
      : null;
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
          "--hero-poster-desktop": posterImage(loop.desktop, loop.desktopHiDpi),
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
      {variant && (active || videoAllowed) && (!introActive || introStarted) && (
        <LoopVideo
          key={`loop-${breakpoint}`}
          sources={variant.sources}
          hold={introActive || !active}
          rewind={introActive}
          className={videoFit}
        />
      )}
      {introSources && introActive && loop.intro && (
        <IntroVideo
          key={`intro-${breakpoint}-${introRun}`}
          sources={introSources}
          revealAt={loop.intro.revealAt}
          onStarted={markIntroStarted}
          className={videoFit}
        />
      )}
    </div>
  );
}

type LayerRole = "shown" | "leaving" | "hidden";

function HeroArt({
  index,
  role,
  entering,
  videoAllowed,
  onArrived,
}: {
  index: number;
  role: LayerRole;
  entering: boolean;
  videoAllowed: boolean;
  onArrived: () => void;
}) {
  const slide = hero.slides[index];

  return (
    <div
      onAnimationEnd={entering ? onArrived : undefined}
      className={cn(
        "absolute inset-0",
        role === "shown" && "z-2",
        role === "leaving" && "z-1",
        role === "hidden" && "invisible",
        entering && "hero-art-fade",
      )}
    >
      {slide.framing === "loop" ? (
        <HeroLoopArt loop={slide.loop} active={role === "shown"} videoAllowed={videoAllowed} />
      ) : (
        <div
          style={{ "--hero-art": `url("${slide.artSrc}")` } as React.CSSProperties}
          className="absolute inset-0 hero-art-cover"
        />
      )}
    </div>
  );
}

function useSlideWarmup(onRequest: (index: number) => void, onAllWarm: () => void) {
  const introPhase = useIntroPhase();

  useEffect(() => subscribeSlideRequests(onRequest), [onRequest]);

  useEffect(() => {
    if (introPhase === "pending") return;
    const { connection } = navigator as Navigator & { connection?: NetworkInformation };
    if (connection?.saveData) return;

    const warmAll = () => {
      hero.slides.forEach((_, index) => onRequest(index));
      Promise.all(hero.slides.map((_, index) => warmSlide(index))).then(onAllWarm);
    };
    if (document.readyState === "complete") {
      const timer = window.setTimeout(warmAll);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", warmAll, { once: true });
    return () => window.removeEventListener("load", warmAll);
  }, [introPhase, onRequest, onAllWarm]);
}

export function HeroBackground() {
  const { activeSlide } = useHeroSlide();
  const [shown, setShown] = useState(activeSlide);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [mounted, setMounted] = useState<number[]>([activeSlide]);
  const [videoAllowed, setVideoAllowed] = useState(false);

  if (!mounted.includes(activeSlide)) setMounted([...mounted, activeSlide]);

  const mount = useCallback((index: number) => {
    void warmSlide(index);
    setMounted((current) => (current.includes(index) ? current : [...current, index]));
  }, []);
  const allowVideo = useCallback(() => setVideoAllowed(true), []);
  useSlideWarmup(mount, allowVideo);

  const arrive = () => {
    const left = leaving;
    warmSlide(shown).then(() => setLeaving((current) => (current === left ? null : current)));
  };

  useEffect(() => {
    if (activeSlide === shown) return;
    let cancelled = false;
    const waited = new Promise((resolve) => window.setTimeout(resolve, SWAP_WAIT_MS));
    Promise.race([warmSlide(activeSlide), waited]).then(() => {
      if (cancelled) return;
      setLeaving(shown);
      setShown(activeSlide);
    });
    return () => {
      cancelled = true;
    };
  }, [activeSlide, shown]);

  useEffect(() => {
    if (activeSlide !== hero.activeSlide) endIntro();
  }, [activeSlide]);

  const roleOf = (index: number): LayerRole =>
    index === shown ? "shown" : index === leaving ? "leaving" : "hidden";

  return (
    <div
      aria-hidden
      /* no tocar: el -z-10 y el overflow-hidden van en esta capa, nunca en la <section> */
      className="absolute inset-x-0 top-4 -z-10 h-hero-mobile overflow-hidden bg-background desktop:top-0 desktop:h-hero-desktop"
    >
      <div className="hero-art-clip absolute inset-0 isolate opacity-75 desktop:opacity-100">
        {mounted.map((index) => (
          <HeroArt
            key={index}
            index={index}
            role={roleOf(index)}
            entering={index === shown && leaving !== null}
            videoAllowed={videoAllowed}
            onArrived={arrive}
          />
        ))}
      </div>
      <div className="bg-hero-scrim-mobile absolute inset-0 desktop:bg-hero-scrim" />
    </div>
  );
}
