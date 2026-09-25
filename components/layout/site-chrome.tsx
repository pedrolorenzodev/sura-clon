import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionNavProvider } from "@/components/layout/section-nav-context";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <SectionNavProvider>
      <div aria-hidden className="route-shutter" />
      {/* no tocar: Nav tiene que quedar hermano anterior del footer, que lee su estado con peer/bar */}
      <Nav />
      {children}
      <Footer />
    </SectionNavProvider>
  );
}
