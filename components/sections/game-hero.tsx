import { Fragment } from "react";

import { BrandCta } from "@/components/sections/brand-cta";
import { StarRating } from "@/components/sections/star-rating";
import { TitleSweep } from "@/components/sections/title-sweep";
import type { GameDetail } from "@/lib/data/game-detail";
import { cn } from "@/lib/utils";

export function GameHero({ game }: { game: GameDetail }) {
  return (
    <section className="flex flex-col pt-40">
      <h1 className="order-1 text-center font-display text-banner-title-sm uppercase text-foreground desktop:order-2 desktop:mt-3 desktop:text-left desktop:text-game-hero">
        <TitleSweep onArrival>
          {game.title.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </TitleSweep>
      </h1>

      <div className="order-2 mt-2 flex items-center justify-center gap-2 desktop:order-1 desktop:mt-0 desktop:justify-start">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold leading-4 text-brand-vivid desktop:text-title-sm desktop:leading-4">
            {game.rating.toFixed(1)}
          </span>
          <StarRating
            value={game.rating}
            tone="brand"
            className="gap-1 desktop:gap-1.25"
            starClassName="size-4 desktop:size-5"
          />
        </span>
        <span className="text-xs text-muted-foreground desktop:text-sm">({game.reviewsCount} reseñas)</span>
      </div>

      <ul className="order-3 mt-10 flex flex-wrap gap-2 px-2 desktop:mt-3 desktop:px-0">
        {game.tags.map((tag) => (
          <li
            key={tag}
            className="flex h-9 items-center justify-center rounded-pill border-2 border-border-dim px-4 text-sm font-medium text-muted-foreground"
          >
            {tag}
          </li>
        ))}
      </ul>

      <PlayButton className="order-4 mt-6 hidden desktop:flex" />
    </section>
  );
}

export function GamePlayBar() {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-10 px-4 pb-gutter-safe desktop:hidden">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48.5 bg-play-bar" />
      <PlayButton className="relative flex w-full" />
    </div>
  );
}

function PlayButton({ className }: { className: string }) {
  return <BrandCta label="Jugar ahora" className={cn("h-13.5 desktop:h-12 desktop:w-fit desktop:px-8", className)} />;
}
