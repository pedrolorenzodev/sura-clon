import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { Header } from "@/components/layout/header";
import { GameBody } from "@/components/sections/game-body";
import { DetailHeroArt } from "@/components/sections/detail-hero-art";
import { GameHero, GamePlayBar } from "@/components/sections/game-hero";
import { gameDetailIds, getGameDetail } from "@/lib/data/game-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return gameDetailIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/games/[id]">): Promise<Metadata> {
  const game = getGameDetail((await params).id);
  return {
    title: `${game?.title.join(" ") ?? "Juego"} | Sura Gaming`,
    description: game?.about,
  };
}

export default async function GameDetailPage({ params }: PageProps<"/games/[id]">) {
  const game = getGameDetail((await params).id);
  if (!game) notFound();

  return (
    <>
      <Header back />
      <ViewTransition enter="route-in" exit="route-out" default="none">
        <main className="flex-1 overflow-x-clip px-route-gutter pb-route-edge pt-header-mobile desktop:px-route-edge desktop:pt-header-desktop">
          <DetailHeroArt art={game.art} />
          <div className="mx-auto flex w-full max-w-page flex-col">
            <GameHero game={game} />
            <GameBody game={game} />
          </div>
          <GamePlayBar />
        </main>
      </ViewTransition>
    </>
  );
}
