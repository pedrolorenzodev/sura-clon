import { GameBanner } from "@/components/sections/game-banner";
import { GameCard } from "@/components/sections/game-card";
import { SectionHeader } from "@/components/sections/section-header";
import { getGames } from "@/lib/supabase/games";

export async function Juegos() {
  const games = (await getGames()).slice(0, 8);
  return (
    <section
      id="juegos"
      /* no tocar: overflow-x-clip evita el scroll lateral en los anchos sin diseño */
      className="mt-section-gap-mobile scroll-mt-header-mobile overflow-x-clip px-gutter desktop:mt-section-gap desktop:scroll-mt-header-desktop desktop:px-gutter-desktop"
    >
      <div className="mx-auto flex max-w-page flex-col gap-6 desktop:gap-12.5">
        <SectionHeader title="Juegos" href="/games" />

        <GameBanner />

        <ul className="card-grid grid gap-3 desktop:grid-cols-4 desktop:gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      </div>
    </section>
  );
}
