"use client";

import { useSyncExternalStore } from "react";

import { getMusicSnapshot, subscribeSfx, toggleMusic, type MusicState } from "@/lib/sfx";

const serverSnapshot = (): MusicState => "armed";

export function MusicToggle() {
  const state = useSyncExternalStore(subscribeSfx, getMusicSnapshot, serverSnapshot);

  return (
    <button
      type="button"
      aria-label="Música"
      aria-pressed={state !== "off"}
      data-sfx-hover
      data-playing={state === "playing" || undefined}
      onClick={toggleMusic}
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-surface-2 text-foreground ring-1 ring-inset ring-border-muted/25 outline-none transition-[color,box-shadow] duration-200 hover:ring-brand/45 focus-visible:ring-brand/45 music-on:hover:text-brand music-on:focus-visible:text-brand music-off:text-muted-foreground motion-reduce:transition-none"
    >
      <span aria-hidden className="music-bars flex h-4 w-4.5 items-end justify-center gap-0.5">
        <span className="music-bar" />
        <span className="music-bar" />
        <span className="music-bar" />
        <span className="music-bar" />
      </span>
    </button>
  );
}
