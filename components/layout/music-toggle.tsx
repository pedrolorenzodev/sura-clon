"use client";

import { useRef, useState, useSyncExternalStore } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { musicConfig } from "@/lib/data/sfx";
import {
  getMusicLevelSnapshot,
  getMusicSnapshot,
  setMusicLevel,
  startBackgroundMusic,
  subscribeSfx,
  toggleMusic,
  type MusicState,
} from "@/lib/sfx";

const serverState = (): MusicState => "armed";
const serverLevel = () => musicConfig.volume;
const STEP_KEYS: Record<string, 1 | -1> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 };
const PERCENT_STEP = musicConfig.levelMax / 100;

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])";

const focusNextAfter = (element: HTMLElement | null) => {
  if (!element) return;
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (candidate) => candidate === element || candidate.checkVisibility(),
  );
  candidates[candidates.indexOf(element) + 1]?.focus();
};

const toPercent = (level: number) => Math.round((level / musicConfig.levelMax) * 100);
const percentLabel = (level: number) => `${toPercent(level)} %`;

export function MusicToggle() {
  const state = useSyncExternalStore(subscribeSfx, getMusicSnapshot, serverState);
  const level = useSyncExternalStore(subscribeSfx, getMusicLevelSnapshot, serverLevel);
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const armedAtPress = useRef(false);

  const closeToTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next, details) => {
        if (details.reason !== "trigger-press") setOpen(next);
      }}
    >
      <PopoverTrigger
        openOnHover
        delay={0}
        closeDelay={300}
        render={
          <button
            ref={triggerRef}
            type="button"
            aria-label="Música"
            aria-pressed={state !== "off"}
            data-sfx-hover
            data-playing={state === "playing" || undefined}
            data-music-toggle
            onPointerDown={() => {
              armedAtPress.current = getMusicSnapshot() === "armed";
            }}
            onClick={() => {
              const armed = armedAtPress.current || getMusicSnapshot() === "armed";
              armedAtPress.current = false;
              if (armed) {
                startBackgroundMusic();
                if (getMusicSnapshot() === "playing") return;
              }
              toggleMusic();
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) setOpen(true);
            }}
            onBlur={(event) => {
              if (!contentRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") armedAtPress.current = getMusicSnapshot() === "armed";
              if (event.key !== "Tab" || event.shiftKey || !open) return;
              const input = contentRef.current?.querySelector("input");
              if (!input) return;
              event.preventDefault();
              input.focus();
            }}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-surface-2 text-foreground ring-1 ring-inset ring-border-muted/25 outline-none transition-[color,box-shadow] duration-200 hover:ring-brand/45 focus-visible:ring-brand/45 music-on:hover:text-brand music-on:focus-visible:text-brand music-off:text-muted-foreground motion-reduce:transition-none"
          />
        }
      >
        <span aria-hidden className="music-bars flex h-4 w-4.5 items-end justify-center gap-0.5">
          <span className="music-bar" />
          <span className="music-bar" />
          <span className="music-bar" />
          <span className="music-bar" />
        </span>
      </PopoverTrigger>

      <PopoverContent
        ref={contentRef}
        side="bottom"
        align="start"
        sideOffset={10}
        initialFocus={false}
        finalFocus={false}
        className="w-52 gap-2.5 px-3.5 py-3"
      >
        <div className="flex items-baseline justify-between font-techno text-cta-sm uppercase text-muted-foreground">
          <span>Música</span>
          <output aria-live="polite" className="text-brand tabular-nums">
            {percentLabel(level)}
          </output>
        </div>
        <Slider
          value={level}
          min={0}
          max={musicConfig.levelMax}
          step={PERCENT_STEP}
          largeStep={musicConfig.levelStep}
          onValueChange={(value) => setMusicLevel(value as number)}
          thumbProps={{
            "aria-label": "Volumen de la música",
            getAriaValueText: (_formatted, value) => percentLabel(value),
            onKeyDown: (event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeToTrigger();
                return;
              }
              if (event.key === "Tab") {
                event.preventDefault();
                if (event.shiftKey) closeToTrigger();
                else {
                  setOpen(false);
                  focusNextAfter(triggerRef.current);
                }
                return;
              }
              const direction = STEP_KEYS[event.key];
              if (!direction) return;
              event.preventDefault();
              setMusicLevel(level + direction * musicConfig.levelStep);
            },
          }}
        />
        <div className="flex justify-between font-techno text-2xs uppercase text-muted-foreground">
          <span>0 %</span>
          <span>100 %</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
