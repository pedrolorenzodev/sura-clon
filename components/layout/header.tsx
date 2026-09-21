import { HeaderDesktop } from "@/components/layout/header-desktop";
import { HeaderMobile } from "@/components/layout/header-mobile";
import { cn } from "@/lib/utils";

export function Header({ solid }: { solid?: boolean }) {
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50", solid && "bg-background")}>
      <HeaderMobile className="flex desktop:hidden" />
      <HeaderDesktop className="hidden desktop:flex" />
    </header>
  );
}
