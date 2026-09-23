"use client";

import { useScrolled } from "@/lib/use-scrolled";
import { cn } from "@/lib/utils";

export function HeaderShell({ solid, children }: { solid?: boolean; children: React.ReactNode }) {
  const scrolled = useScrolled();

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn("group fixed inset-x-0 top-0 z-50", solid && "desktop:bg-background")}
    >
      {children}
    </header>
  );
}
