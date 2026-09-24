import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { GameCard } from "@/components/sections/game-card";
import { GamesBanner } from "@/components/sections/games-banner";
import { Pagination } from "@/components/sections/pagination";
import { SearchField } from "@/components/sections/search-field";
import { SelectPill } from "@/components/sections/select-pill";
import { gamesCatalog, gamesFilters } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Juegos | Sura Gaming",
  description: "El catálogo de juegos del ecosistema Sura Gaming.",
};

export default function GamesPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Juegos">
        <div className="flex flex-col gap-6 desktop:gap-12">
          <div className="flex items-center gap-3 desktop:gap-6">
            <SearchField placeholder="Buscar juego" className="min-w-px flex-1" />

            <button
              type="button"
              aria-label="Filtrar juegos"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center transition-[filter] duration-200 hover:drop-shadow-link-hover focus-visible:drop-shadow-link-hover motion-reduce:transition-none desktop:hidden"
            >
              <Image
                src="/assets/games/filter.svg"
                alt=""
                width={40}
                height={40}
                className="size-10"
              />
            </button>

            <div className="hidden shrink-0 items-center gap-4 desktop:flex">
              {gamesFilters.map((filter) => (
                <SelectPill key={filter} label={filter} />
              ))}
            </div>
          </div>

          <GamesBanner />

          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-2 gap-4 desktop:grid-cols-4 desktop:gap-6">
              {gamesCatalog.map((game) => (
                <GameCard key={game.id} game={game} largeTitle />
              ))}
            </ul>

            <Pagination
              pages={5}
              current={1}
              label="Paginación de juegos"
              compactOnMobile
              className="pt-0"
            />
          </div>
        </div>
      </RouteShell>
    </>
  );
}
