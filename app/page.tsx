import { Header } from "@/components/layout/header";
import { Nav } from "@/components/layout/nav";
import { Eventos } from "@/components/sections/eventos";
import { Hero } from "@/components/sections/hero";
import { Leaderboard } from "@/components/sections/leaderboard";

/**
 * El `<main>` no lleva padding lateral: el hero es full-bleed y cada sección se
 * hace cargo de su propio gutter.
 */
export default function Home() {
  return (
    <>
      <Header />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Eventos />
        <Leaderboard />
      </main>
    </>
  );
}
