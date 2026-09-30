import Image from "next/image";

import { medalStack } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

const MEDAL_LAYER = ["z-3", "z-2", "z-1"];

export function MedalStack() {
  return (
    <span className="flex items-center">
      {medalStack.map((src, index) => (
        <span
          key={src}
          className={cn(
            "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-brand-vivid/30 bg-surface",
            MEDAL_LAYER[index],
            index < medalStack.length - 1 && "-mr-2.5",
          )}
        >
          <Image src={src} alt="" width={2048} height={2048} className="size-3" />
        </span>
      ))}
    </span>
  );
}
