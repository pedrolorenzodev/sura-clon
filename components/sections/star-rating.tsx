import Image from "next/image";

import { starFill } from "@/lib/data/game-detail";
import { cn } from "@/lib/utils";

const STAR_ART = {
  brand: {
    full: "/assets/games/detail/star-brand.svg",
    half: "/assets/games/detail/star-brand-half.svg",
    empty: "/assets/games/detail/star-muted-empty.svg",
  },
  muted: {
    full: "/assets/games/detail/star-muted.svg",
    half: "/assets/games/detail/star-muted-half.svg",
    empty: "/assets/games/detail/star-muted-empty.svg",
  },
  "muted-sm": {
    full: "/assets/games/detail/star-muted-sm.svg",
    half: "/assets/games/detail/star-muted-sm.svg",
    empty: "/assets/games/detail/star-muted-sm-empty.svg",
  },
};

export function StarRating({
  value,
  tone,
  className,
  starClassName,
}: {
  value: number;
  tone: keyof typeof STAR_ART;
  className?: string;
  starClassName: string;
}) {
  return (
    <span role="img" aria-label={`${value} de 5 estrellas`} className={cn("flex items-center", className)}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Image
          key={index}
          src={STAR_ART[tone][starFill(value, index)]}
          alt=""
          width={20}
          height={20}
          className={cn("shrink-0", starClassName)}
        />
      ))}
    </span>
  );
}
