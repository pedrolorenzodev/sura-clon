import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { TournamentsCollection } from "@/components/sections/tournaments-collection";
import { getTournaments } from "@/lib/supabase/tournaments";

export const metadata: Metadata = {
  title: "Eventos | Sura Gaming",
  description: "Todos los eventos y torneos del ecosistema Sura Gaming.",
};

export const revalidate = 60;

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  return (
    <>
      <Header solid back />
      <RouteShell title="Eventos">
        <TournamentsCollection tournaments={tournaments} />
      </RouteShell>
    </>
  );
}
