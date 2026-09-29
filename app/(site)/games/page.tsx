import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { GamesBanner } from "@/components/sections/games-banner";
import { GamesCollection } from "@/components/sections/games-collection";

export const metadata: Metadata = {
  title: "Juegos | Sura Gaming",
  description: "El catálogo de juegos del ecosistema Sura Gaming.",
};

export default function GamesPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Juegos">
        <GamesCollection banner={<GamesBanner />} />
      </RouteShell>
    </>
  );
}
