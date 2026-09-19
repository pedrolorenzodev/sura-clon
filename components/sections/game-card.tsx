import Image from "next/image";

import type { Game } from "@/lib/data/games";
import { cn } from "@/lib/utils";

export function GameCard({ game }: { game: Game }) {
  return (
    <li className="relative flex aspect-[268/357] flex-col justify-end overflow-hidden rounded-xl">
      <Image
        src={game.imageSrc}
        alt=""
        width={1920}
        height={1080}
        className={cn("absolute max-w-none object-cover", game.imageClass ?? "inset-0 size-full")}
      />

      <div className="relative flex min-h-23.5 w-full flex-col justify-between gap-2 desktop:justify-start rounded-xl border border-border-muted/50 bg-overlay p-3 backdrop-blur-card desktop:min-h-31.5 desktop:gap-4 desktop:p-5">
        <p className="line-clamp-2 text-sm font-medium text-foreground desktop:text-base">{game.title}</p>

        <ul className="flex items-center gap-1 desktop:gap-2">
          {game.badges.map((badge, index) => (
            <li
              key={`${badge}-${index}`}
              className={cn(
                "flex items-center justify-center rounded-xs border border-muted-foreground px-1.5 py-1 text-2xs leading-2.5 text-muted-foreground desktop:px-2 desktop:py-1.5",
                index > 1 && "hidden desktop:flex",
              )}
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
