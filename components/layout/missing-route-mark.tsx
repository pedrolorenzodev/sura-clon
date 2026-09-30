"use client";

import { useEffect } from "react";

import { useSectionNav } from "@/components/layout/section-nav-context";

export function MissingRouteMark() {
  const { markMissing } = useSectionNav();

  useEffect(markMissing, [markMissing]);

  return null;
}
