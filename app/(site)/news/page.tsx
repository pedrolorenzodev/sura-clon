import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { NewsCollection } from "@/components/sections/news-collection";

export const metadata: Metadata = {
  title: "Sura News | Sura Gaming",
  description: "Noticias, leaks, updates y tendencias del mundo del gaming.",
};

export default function NewsPage() {
  return (
    <>
      <Header solid back />
      <RouteShell title="Sura News">
        <NewsCollection />
      </RouteShell>
    </>
  );
}
