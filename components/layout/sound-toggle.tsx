"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { readMs } from "@/lib/motion";
import { getSfxEnabledSnapshot, subscribeSfx, toggleSfx } from "@/lib/sfx";

const serverSnapshot = () => true;

export function SoundToggle() {
  const enabled = useSyncExternalStore(subscribeSfx, getSfxEnabledSnapshot, serverSnapshot);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = subscribeSfx((event) => {
      const button = buttonRef.current;
      if (event !== "play" || !button) return;
      button.dataset.live = button.dataset.live === "a" ? "b" : "a";
      clearTimeout(timer);
      timer = setTimeout(
        () => delete button.dataset.live,
        readMs("--sound-live-duration") + readMs("--sound-live-stagger"),
      );
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Sonido"
      aria-pressed={enabled}
      data-sfx-hover
      onClick={toggleSfx}
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-surface-2 text-foreground ring-1 ring-inset ring-border-muted/25 outline-none transition-[color,box-shadow] duration-200 hover:ring-brand/45 focus-visible:ring-brand/45 sound-on:hover:text-brand sound-on:focus-visible:text-brand sound-off:text-muted-foreground motion-reduce:transition-none"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-5 overflow-visible"
      >
        <path d="M11 5 6 9H3v6h3l5 4Z" />
        <path className="sound-wave" d="M15 9.5a3.5 3.5 0 0 1 0 5" />
        <path className="sound-wave sound-wave-far" d="M18 6.5a8 8 0 0 1 0 11" />
        <path className="sound-cross" pathLength={1} d="m16 9 6 6m0-6-6 6" />
      </svg>
    </button>
  );
}
