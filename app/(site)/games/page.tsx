import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { GamesBanner } from "@/components/sections/games-banner";
import { GamesCollection } from "@/components/sections/games-collection";
import { getGames } from "@/lib/supabase/games";

export const metadata: Metadata = {
  title: "Juegos | Sura Gaming",
  description: "El catálogo de juegos del ecosistema Sura Gaming.",
};

export const revalidate = 60;

export default async function GamesPage() {
  const games = await getGames();
  return (
    <>
      <Header solid back />
      <RouteShell title="Juegos">
        <GamesCollection games={games} banner={<GamesBanner />} />
      </RouteShell>
    </>
  );
}
