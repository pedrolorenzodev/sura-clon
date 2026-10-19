import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { LeaderboardCollection } from "@/components/sections/leaderboard-collection";
import { getLeaderboardViews } from "@/lib/supabase/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard | Sura Gaming",
  description: "La tabla de posiciones del ecosistema Sura Gaming.",
};

export const revalidate = 60;

export default async function LeaderboardPage() {
  const views = await getLeaderboardViews();
  return (
    <>
      <Header solid back />
      <RouteShell title="Leaderboard">
        <LeaderboardCollection views={views} />
      </RouteShell>
    </>
  );
}
