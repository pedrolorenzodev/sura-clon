"use client";

import { ChevronLeft } from "lucide-react";

import { useSectionNav } from "@/components/layout/section-nav-context";

export function BackButton() {
  const { goBack } = useSectionNav();

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Volver"
      className="-ml-2 flex size-10 shrink-0 items-center justify-center text-foreground transition-colors duration-200 hover:text-brand focus-visible:text-brand active:text-brand motion-reduce:transition-none"
    >
      <ChevronLeft className="size-6" strokeWidth={1.5} />
    </button>
  );
}
