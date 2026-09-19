import { GameBanner } from "@/components/sections/game-banner";
import { GameCard } from "@/components/sections/game-card";
import { SectionHeader } from "@/components/sections/section-header";
import { games } from "@/lib/data/games";

export function Juegos() {
  return (
    <section
      id="juegos"
      className="mt-section-gap-mobile scroll-mt-14 overflow-x-clip px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto flex max-w-page flex-col gap-6 desktop:gap-12.5">
        <SectionHeader title="Juegos" />

        <GameBanner />

        <ul className="grid grid-cols-2 gap-3 desktop:grid-cols-4 desktop:gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      </div>
    </section>
  );
}
