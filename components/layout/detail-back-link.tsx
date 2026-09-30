"use client";

import { ChevronLeft } from "lucide-react";

import { useSectionNav } from "@/components/layout/section-nav-context";
import { backLabel } from "@/lib/data/navigation";

export function DetailBackLink() {
  const { backPath, goBack } = useSectionNav();

  return (
    <button
      type="button"
      onClick={goBack}
      data-sfx="back"
      className="absolute left-0 top-4 z-10 -ml-1 flex items-center gap-1 py-1 pr-2 text-sm text-foreground text-shadow-hero-copy transition-colors duration-200 hover:text-brand focus-visible:text-brand active:text-brand motion-reduce:transition-none desktop:top-6"
    >
      <ChevronLeft className="size-5" strokeWidth={1.5} />
      {backLabel(backPath ?? "/")}
    </button>
  );
}
