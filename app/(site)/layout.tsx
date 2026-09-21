import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
