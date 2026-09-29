import type { DetailArt } from "@/lib/data/detail-art";
import { cn } from "@/lib/utils";

export function DetailHeroArt({ art }: { art: DetailArt }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-108.5 overflow-hidden desktop:h-131">
      <div className="absolute inset-x-0 -top-11 h-119.5 overflow-hidden desktop:-top-11.25 desktop:aspect-video desktop:h-auto">
        <picture>
          <source media="(min-width: 768px)" srcSet={art.desktop} />
          <img
            src={art.mobile}
            alt=""
            fetchPriority="high"
            className={cn("absolute max-w-none object-cover", art.className)}
          />
        </picture>
        <span className="absolute inset-0 bg-game-hero-scrim-mobile desktop:hidden" />
      </div>
      <span className="absolute inset-x-0 top-0 hidden h-137 bg-game-hero-scrim desktop:block" />
    </div>
  );
}
