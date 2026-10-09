import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { DetailBackLink } from "@/components/layout/detail-back-link";
import { Header } from "@/components/layout/header";
import { GameBody } from "@/components/sections/game-body";
import { DetailHeroArt } from "@/components/sections/detail-hero-art";
import { GameHero, GamePlayBar } from "@/components/sections/game-hero";
import { PROMO_GAME_ID, promoGame } from "@/lib/data/game-detail";
import { getGameDetail, getGames, getSuggestedGames } from "@/lib/supabase/games";

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  const games = await getGames();
  return [PROMO_GAME_ID, ...games.map((game) => game.id)].map((id) => ({ id }));
}

const findGame = async (id: string) => (id === PROMO_GAME_ID ? promoGame : getGameDetail(id));

export async function generateMetadata({ params }: PageProps<"/games/[id]">): Promise<Metadata> {
  const game = await findGame((await params).id);
  return {
    title: `${game?.title.join(" ") ?? "Juego"} | Sura Gaming`,
    description: game?.about,
  };
}

export default async function GameDetailPage({ params }: PageProps<"/games/[id]">) {
  const { id } = await params;
  const [game, suggestions] = await Promise.all([findGame(id), getSuggestedGames(id)]);
  if (!game) notFound();

  return (
    <>
      <Header back />
      <ViewTransition enter="route-in" exit="route-out" default="none">
        <main className="flex-1 overflow-x-clip px-route-gutter pb-route-edge pt-header-mobile desktop:px-route-edge desktop:pt-header-desktop">
          <DetailHeroArt art={game.art} />
          <div className="relative mx-auto flex w-full max-w-page flex-col">
            <DetailBackLink />
            <GameHero game={game} />
            <GameBody game={game} suggestions={suggestions} />
          </div>
          <GamePlayBar />
        </main>
      </ViewTransition>
    </>
  );
}
