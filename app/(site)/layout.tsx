import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SectionNavProvider } from "@/components/layout/section-nav-context";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <SectionNavProvider>
      <Nav />
      {children}
      <Footer />
    </SectionNavProvider>
  );
}
