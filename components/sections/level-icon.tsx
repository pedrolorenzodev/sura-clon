import Image from "next/image";

import { levels, type LevelId } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

export function LevelIcon({ level, className }: { level: LevelId; className?: string }) {
  const { iconSrc, iconWidth, iconHeight } = levels[level];

  return (
    <span className={cn("relative block size-4 shrink-0", className)}>
      <Image
        src={iconSrc}
        alt=""
        width={iconWidth}
        height={iconHeight}
        className="absolute left-0 top-0 h-auto w-full max-w-none"
      />
    </span>
  );
}
