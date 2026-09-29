import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import { CardSlider } from "@/components/sections/card-slider";
import { GameAside } from "@/components/sections/game-aside";
import { GameReviews } from "@/components/sections/game-reviews";
import { suggestedGames, type GameDetail } from "@/lib/data/game-detail";
import { detailHref } from "@/lib/routes";

const ARROWS = {
  sides: { left: "left-3.5", right: "right-2" },
  className: "top-1/2 disabled:text-foreground/50 [&_svg]:stroke-[1.33]",
};

export function GameBody({ game }: { game: GameDetail }) {
  return (
    <div className="mt-10 flex flex-col px-2 desktop:mt-12 desktop:flex-row desktop:items-start desktop:gap-6 desktop:px-0">
      <div className="flex min-w-0 flex-1 flex-col gap-10 desktop:gap-8">
        <GameSection title="Acerca del juego">
          <p className="text-sm text-muted-foreground">{game.about}</p>
        </GameSection>

        {game.gallery.length > 0 && (
          <GameSection title="Galería">
            <CardSlider
              labels={{ prev: "Ver imagen anterior", next: "Ver imagen siguiente" }}
              viewportClassName="gap-3"
              arrowClassName={ARROWS.className}
              arrowSides={ARROWS.sides}
              fade
              flush
              reveal
            >
              {game.gallery.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative aspect-[640/360] w-full shrink-0 overflow-hidden rounded-xl bg-surface desktop:w-[84.77%] desktop:rounded-2xl"
                >
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 640px, 343px" className="object-cover" />
                </div>
              ))}
            </CardSlider>
          </GameSection>
        )}

        <GameSection title="También te puede interesar">
          <CardSlider
            labels={{ prev: "Ver juegos anteriores", next: "Ver más juegos" }}
            viewportClassName="lift-room gap-3 desktop:gap-6"
            arrowClassName={ARROWS.className}
            arrowSides={ARROWS.sides}
            fade
            flush
            reveal
          >
            {suggestedGames(game.id).map((suggestion) => (
              <CardLink
                key={suggestion.id}
                href={detailHref("games", suggestion.id)}
                className="group relative flex aspect-[3/4] w-30 shrink-0 bg-surface flex-col justify-end overflow-hidden rounded-lg transition-[translate,box-shadow,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover active:scale-98 motion-reduce:transition-none desktop:slide-quarter desktop:rounded-xl"
              >
                <Image
                  src={suggestion.imageSrc}
                  alt=""
                  width={1920}
                  height={1080}
                  className="absolute inset-0 size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-suggestion-scrim" />
                <p className="relative truncate px-2 pb-3 text-sm font-semibold leading-4 text-foreground desktop:px-3 desktop:pb-5.5">
                  {suggestion.title}
                </p>
              </CardLink>
            ))}
          </CardSlider>
        </GameSection>

        <GameReviews game={game} />
      </div>

      <GameAside game={game} />
    </div>
  );
}

export function GameSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 desktop:gap-3">
      <h2 className="font-techno text-base uppercase text-foreground desktop:text-card-title">{title}</h2>
      {children}
    </section>
  );
}
