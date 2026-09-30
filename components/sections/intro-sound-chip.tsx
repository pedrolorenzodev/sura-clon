"use client";

import { Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { hasHeroIntro, replayIntroWithSound } from "@/lib/hero-intro";
import { readMs } from "@/lib/motion";
import { introSoundAllowed, isIntroSoundPlaying, subscribeSfx } from "@/lib/sfx";
import { useIntroPhase, useIntroRun, useIntroStarted } from "@/lib/use-intro-phase";

type ChipState = "hidden" | "shown" | "gone";

export function IntroSoundChip() {
  const phase = useIntroPhase();
  const started = useIntroStarted();
  const run = useIntroRun();
  const [state, setState] = useState<ChipState>("hidden");
  const dismissed = useRef(false);

  const dismiss = useCallback(() => {
    dismissed.current = true;
    setState((current) => (current === "shown" ? "gone" : current));
  }, []);

  useEffect(() => {
    if (navigator.userActivation?.hasBeenActive) dismissed.current = true;

    const unsubscribe = subscribeSfx((event) => {
      if (event === "play") return;
      if (!introSoundAllowed() || isIntroSoundPlaying()) dismiss();
    });

    return () => {
      unsubscribe();
    };
  }, [dismiss]);

  useEffect(() => {
    if (!started || run !== 0 || dismissed.current) return;
    const timer = window.setTimeout(() => {
      if (!dismissed.current && introSoundAllowed() && !isIntroSoundPlaying()) setState("shown");
    }, readMs("--intro-chip-delay"));
    return () => window.clearTimeout(timer);
  }, [started, run]);

  useEffect(() => {
    if (state !== "shown" || phase !== null) return;
    const timer = window.setTimeout(() => setState("gone"), readMs("--intro-chip-hold"));
    return () => window.clearTimeout(timer);
  }, [state, phase]);

  if (!hasHeroIntro) return null;

  const shown = state === "shown";

  return (
    <button
      type="button"
      data-intro-chip
      data-shown={shown || undefined}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      onClick={() => {
        dismissed.current = true;
        setState("gone");
        replayIntroWithSound();
      }}
      className="intro-chip absolute right-4 top-[calc(var(--spacing-header-mobile)+var(--spacing)*2.5)] z-10 inline-flex cursor-pointer items-center gap-2.5 rounded-pill bg-overlay px-4 py-2.5 font-techno text-cta-sm uppercase text-foreground ring-1 ring-inset ring-border outline-none backdrop-blur-nav transition-[box-shadow,color] duration-200 hover:text-brand hover:ring-brand focus-visible:text-brand focus-visible:ring-brand motion-reduce:transition-none desktop:right-14 desktop:top-[calc(var(--spacing-header-desktop)+var(--spacing)*8)]"
    >
      <Volume2 aria-hidden strokeWidth={1.8} className="size-4 text-brand" />
      Escuchar la intro
    </button>
  );
}
