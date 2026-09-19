import { Header } from "@/components/layout/header";
import { Nav } from "@/components/layout/nav";
import { Hero } from "@/components/sections/hero";

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
      </main>
    </>
  );
}
