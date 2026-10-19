import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionNavProvider } from "@/components/layout/section-nav-context";
import { SfxListener } from "@/components/layout/sfx-listener";
import { MissionModalProvider } from "@/components/sections/mission-modal";
import { PlayerModalProvider } from "@/components/sections/player-modal";
import { getPlayerProfiles } from "@/lib/supabase/leaderboard";
import { getMissionDetails } from "@/lib/supabase/missions";
import { getCurrentUser } from "@/lib/supabase/user";
import { CurrentUserProvider } from "@/lib/use-current-user";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [profiles, currentUser, missions] = await Promise.all([getPlayerProfiles(), getCurrentUser(), getMissionDetails()]);
  return (
    <CurrentUserProvider user={currentUser}>
      <SectionNavProvider>
        <SfxListener />
        <div aria-hidden className="route-shutter" />
        {/* no tocar: Nav tiene que quedar hermano anterior del footer, que lee su estado con peer/bar */}
        <Nav />
        <PlayerModalProvider profiles={profiles}>
          <MissionModalProvider missions={missions}>{children}</MissionModalProvider>
        </PlayerModalProvider>
        <Footer />
      </SectionNavProvider>
    </CurrentUserProvider>
  );
}
