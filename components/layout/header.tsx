import { HeaderDesktop } from "@/components/layout/header-desktop";
import { HeaderMobile } from "@/components/layout/header-mobile";
import { HeaderShell } from "@/components/layout/header-shell";
import { getCurrentUser } from "@/lib/supabase/user";

export async function Header({ solid, back }: { solid?: boolean; back?: boolean }) {
  const currentUser = await getCurrentUser();
  return (
    <HeaderShell solid={solid}>
      <HeaderMobile currentUser={currentUser} back={back} className="flex desktop:hidden" />
      <HeaderDesktop currentUser={currentUser} className="hidden desktop:flex" />
    </HeaderShell>
  );
}
