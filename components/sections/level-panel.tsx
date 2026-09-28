import Image from "next/image";

import { LevelIcon } from "@/components/sections/level-icon";
import { levels, type LevelId } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

const FILLED = "bg-brand-vivid bg-none shadow-level-segment";
const EMPTY = "bg-transparent bg-level-segment shadow-none";
const FILLED_DESKTOP = "desktop:bg-brand-vivid desktop:bg-none desktop:shadow-level-segment";
const EMPTY_DESKTOP = "desktop:bg-transparent desktop:bg-level-segment desktop:shadow-none";

export function LevelPanel({
  level,
  nextLevel,
  points,
  goal,
  progress,
  segments,
  variant = "modal",
  className,
}: {
  level: LevelId;
  nextLevel: LevelId;
  points: string;
  goal: string;
  progress: number;
  segments: { mobile: number; desktop: number };
  variant?: "modal" | "profile";
  className?: string;
}) {
  const profile = variant === "profile";
  const total = Math.max(segments.mobile, segments.desktop);
  const filledMobile = Math.round(progress * segments.mobile);
  const filledDesktop = Math.round(progress * segments.desktop);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LevelIcon level={level} className={cn("size-9", profile && "drop-shadow-level-current")} />

      <div className="flex min-w-0 flex-1 flex-col gap-1 desktop:gap-2">
        {profile ? (
          <div className="flex items-center justify-between gap-2 whitespace-nowrap font-techno text-note uppercase text-brand">
            <p>Nivel: {levels[level].label}</p>
            <p>
              {points} SP<span className="text-brand/40">/{goal} SP</span>
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 whitespace-nowrap text-2xs desktop:text-xs">
            <p className="font-medium text-foreground">Nivel: {levels[level].label}</p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{points} SP</span> / {goal} SP
            </p>
          </div>
        )}

        <div
          role="progressbar"
          aria-label="Progreso al siguiente nivel"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="flex h-3.5 gap-0.75 px-0.5"
        >
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={[
                "min-w-0 flex-1 -skew-x-16 rounded-xs",
                index >= segments.mobile && "hidden desktop:block",
                index >= segments.desktop && "desktop:hidden",
                index < filledMobile ? FILLED : EMPTY,
                index < filledDesktop ? FILLED_DESKTOP : EMPTY_DESKTOP,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="relative size-9 shrink-0" aria-hidden>
        <LevelIcon level={nextLevel} className="size-9 opacity-50" />
        <Image
          src="/assets/leaderboard/modal/lock-level.webp"
          alt=""
          width={56}
          height={37}
          className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-4 opacity-75"
        />
      </div>
    </div>
  );
}
