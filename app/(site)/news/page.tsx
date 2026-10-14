import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { NewsCollection } from "@/components/sections/news-collection";
import { getNews } from "@/lib/supabase/news";

export const metadata: Metadata = {
  title: "Sura News | Sura Gaming",
  description: "Noticias, leaks, updates y tendencias del mundo del gaming.",
};

export const revalidate = 60;

export default async function NewsPage() {
  const news = await getNews();
  return (
    <>
      <Header solid back />
      <RouteShell title="Sura News">
        <NewsCollection news={news} />
      </RouteShell>
    </>
  );
}
