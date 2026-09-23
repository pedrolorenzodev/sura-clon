import Image from "next/image";
import Link from "next/link";

import type { Game } from "@/lib/data/games";
import { cn } from "@/lib/utils";

export function GameCard({ game, largeTitle }: { game: Game; largeTitle?: boolean }) {
  return (
    <li className="flex">
      <Link
        href={`/games/${game.id}`}
        prefetch={false}
        className="group relative flex aspect-[268/357] w-full flex-col justify-end overflow-hidden rounded-xl transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover motion-reduce:transition-none"
      >
        <Image
          src={game.imageSrc}
          alt=""
          width={1920}
          height={1080}
          className={cn(
            "absolute max-w-none object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none",
            game.imageClass ?? "inset-0 size-full",
          )}
        />

        <div className="border-gradient-card relative flex min-h-23.5 w-full flex-col justify-between gap-2 desktop:justify-start rounded-xl bg-overlay p-3 backdrop-blur-card desktop:min-h-31.5 desktop:gap-4 desktop:p-5">
          <p
            className={cn(
              "relative line-clamp-2 text-sm font-medium text-foreground",
              largeTitle ? "desktop:text-game-title" : "desktop:text-base",
            )}
          >
            {game.title}
          </p>

          <ul className="relative flex items-center gap-1 desktop:gap-2">
            {game.badges.map((badge, index) => (
              <li
                key={`${badge}-${index}`}
                className={cn(
                  "flex items-center justify-center rounded-xs border border-muted-foreground px-1.5 py-1 text-2xs leading-2.5 text-muted-foreground transition-colors duration-200 hover:border-border-light hover:text-subtle-foreground motion-reduce:transition-none desktop:px-2 desktop:py-1.5",
                  index > 1 && "hidden desktop:flex",
                )}
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </li>
  );
}
