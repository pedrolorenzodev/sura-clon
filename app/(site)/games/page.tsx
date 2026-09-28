import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { GamesBanner } from "@/components/sections/games-banner";
import { GamesCollection } from "@/components/sections/games-collection";
import { SelectPill } from "@/components/sections/select-pill";
import { gamesFilters } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Juegos | Sura Gaming",
  description: "El catálogo de juegos del ecosistema Sura Gaming.",
};

export default function GamesPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Juegos">
        <GamesCollection
          filters={
            <>
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
            </>
          }
          banner={<GamesBanner />}
        />
      </RouteShell>
    </>
  );
}
