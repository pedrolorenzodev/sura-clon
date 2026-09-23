import { HeaderDesktop } from "@/components/layout/header-desktop";
import { HeaderMobile } from "@/components/layout/header-mobile";
import { HeaderShell } from "@/components/layout/header-shell";

export function Header({ solid }: { solid?: boolean }) {
  return (
    <HeaderShell solid={solid}>
      <HeaderMobile className="flex desktop:hidden" />
      <HeaderDesktop className="hidden desktop:flex" />
    </HeaderShell>
  );
}
