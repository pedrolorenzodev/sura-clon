import { HeaderDesktop } from "@/components/layout/header-desktop";
import { HeaderMobile } from "@/components/layout/header-mobile";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <HeaderMobile className="flex desktop:hidden" />
      <HeaderDesktop className="hidden desktop:flex" />
    </header>
  );
}
