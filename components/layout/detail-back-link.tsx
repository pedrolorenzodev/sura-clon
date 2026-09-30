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
      className="group absolute left-0 top-4 z-10 inline-flex h-10 cursor-pointer items-center overflow-hidden rounded-lg bg-surface-2 text-foreground ring-1 ring-inset ring-border-dim outline-none transition-[box-shadow,color,scale] duration-200 focus-visible:text-brand focus-visible:ring-brand active:scale-97 motion-reduce:transition-none desktop:top-6 desktop:hover:text-brand desktop:hover:ring-brand"
    >
      <span className="grid size-10 shrink-0 place-items-center text-brand desktop:text-inherit">
        <ChevronLeft
          aria-hidden
          strokeWidth={1.8}
          className="size-4 transition-transform duration-300 ease-lock group-hover:-translate-x-0.5 motion-reduce:transition-none"
        />
      </span>
      <span className="max-w-60 whitespace-nowrap pr-3.5 font-techno text-cta-sm uppercase transition-[max-width,opacity,padding] duration-350 ease-lock motion-reduce:transition-none desktop:max-w-0 desktop:pr-0 desktop:opacity-0 desktop:group-hover:max-w-60 desktop:group-hover:pr-3.5 desktop:group-hover:opacity-100 desktop:group-focus-visible:max-w-60 desktop:group-focus-visible:pr-3.5 desktop:group-focus-visible:opacity-100 desktop:pointer-coarse:max-w-60 desktop:pointer-coarse:pr-3.5 desktop:pointer-coarse:opacity-100">
        {backLabel(backPath ?? "/")}
      </span>
    </button>
  );
}
