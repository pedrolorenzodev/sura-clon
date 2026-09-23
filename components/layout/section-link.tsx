"use client";

import Link from "next/link";

import { useSectionNav } from "@/components/layout/section-nav-context";

type SectionLinkProps = Omit<React.ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  sectionId: string;
};

export function SectionLink({ sectionId, ...props }: SectionLinkProps) {
  const { isHome, goTo } = useSectionNav();

  return (
    <Link
      {...props}
      href={`${isHome ? "" : "/"}#${sectionId}`}
      onNavigate={(event) => {
        event.preventDefault();
        goTo(sectionId);
      }}
    />
  );
}
