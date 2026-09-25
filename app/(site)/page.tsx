import { ViewTransition } from "react";

import { Header } from "@/components/layout/header";
import { Eventos } from "@/components/sections/eventos";
import { Hero } from "@/components/sections/hero";
import { Leaderboard } from "@/components/sections/leaderboard";
import { Misiones } from "@/components/sections/misiones";
import { Juegos } from "@/components/sections/juegos";
import { SuraNews } from "@/components/sections/sura-news";

export default function Home() {
  return (
    <>
      <Header />
      <ViewTransition enter="route-in" exit="route-out" default="none">
        <main className="intro-veil-sections flex-1">
          <Hero />
          <Eventos />
          <Leaderboard />
          <Misiones />
          <SuraNews />
          <Juegos />
        </main>
      </ViewTransition>
    </>
  );
}
