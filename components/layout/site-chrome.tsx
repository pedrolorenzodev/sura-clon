import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionNavProvider } from "@/components/layout/section-nav-context";
import { SfxListener } from "@/components/layout/sfx-listener";
import { MissionModalProvider } from "@/components/sections/mission-modal";
import { PlayerModalProvider } from "@/components/sections/player-modal";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <SectionNavProvider>
      <SfxListener />
      <div aria-hidden className="route-shutter" />
      {/* no tocar: Nav tiene que quedar hermano anterior del footer, que lee su estado con peer/bar */}
      <Nav />
      <PlayerModalProvider>
        <MissionModalProvider>{children}</MissionModalProvider>
      </PlayerModalProvider>
      <Footer />
    </SectionNavProvider>
  );
}
