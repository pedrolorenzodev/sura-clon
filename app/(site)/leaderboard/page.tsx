import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { LeaderboardCollection } from "@/components/sections/leaderboard-collection";

export const metadata: Metadata = {
  title: "Leaderboard | Sura Gaming",
  description: "La tabla de posiciones del ecosistema Sura Gaming.",
};

export default function LeaderboardPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Leaderboard">
        <LeaderboardCollection />
      </RouteShell>
    </>
  );
}
