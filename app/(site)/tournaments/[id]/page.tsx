import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { Header } from "@/components/layout/header";
import { DetailHeroArt } from "@/components/sections/detail-hero-art";
import { TournamentHero } from "@/components/sections/tournament-hero";
import { TournamentSponsors } from "@/components/sections/tournament-sponsors";
import { TournamentTabs } from "@/components/sections/tournament-tabs";
import { getTournamentDetail, tournamentDetailIds } from "@/lib/data/tournament-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return tournamentDetailIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/tournaments/[id]">): Promise<Metadata> {
  const tournament = getTournamentDetail((await params).id);
  return {
    title: `${tournament?.title ?? "Evento"} | Sura Gaming`,
    description: tournament ? `${tournament.game} · ${tournament.date} · ${tournament.prize}` : undefined,
  };
}

export default async function TournamentDetailPage({ params }: PageProps<"/tournaments/[id]">) {
  const tournament = getTournamentDetail((await params).id);
  if (!tournament) notFound();

  return (
    <>
      <Header back />
      <ViewTransition enter="route-in" exit="route-out" default="none">
        <main className="flex-1 overflow-x-clip px-route-gutter pb-route-edge pt-header-mobile desktop:px-route-edge desktop:pt-header-desktop">
          <DetailHeroArt art={tournament.art} />
          <div className="mx-auto flex w-full max-w-page flex-col">
            <TournamentHero tournament={tournament} />
            <TournamentSponsors />
            <TournamentTabs tournament={tournament} />
          </div>
        </main>
      </ViewTransition>
    </>
  );
}
