import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { TournamentsCollection } from "@/components/sections/tournaments-collection";

export const metadata: Metadata = {
  title: "Eventos | Sura Gaming",
  description: "Todos los eventos y torneos del ecosistema Sura Gaming.",
};

export default function TournamentsPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Eventos">
        <TournamentsCollection />
      </RouteShell>
    </>
  );
}
