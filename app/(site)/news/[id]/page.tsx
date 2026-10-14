import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { Header } from "@/components/layout/header";
import { DetailHeroArt } from "@/components/sections/detail-hero-art";
import { NewsArticle } from "@/components/sections/news-article";
import { getNewsItem, getNews, getRelatedNews } from "@/lib/supabase/news";

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps<"/news/[id]">): Promise<Metadata> {
  const item = await getNewsItem((await params).id);
  return {
    title: `${item?.title ?? "Noticia"} | Sura News`,
    description: item?.body[0]?.text,
  };
}

export default async function NewsDetailPage({ params }: PageProps<"/news/[id]">) {
  const item = await getNewsItem((await params).id);
  if (!item) notFound();
  const related = await getRelatedNews(item);

  return (
    <>
      <Header back />
      <ViewTransition enter="route-in" exit="route-out" default="none">
        <main className="flex-1 overflow-x-clip px-route-gutter pb-route-edge pt-header-mobile desktop:px-route-edge desktop:pt-header-desktop">
          <DetailHeroArt art={{ desktop: item.imageSrc, mobile: item.imageSrc, className: "inset-0 size-full" }} />
          <NewsArticle item={item} relatedNews={related} />
        </main>
      </ViewTransition>
    </>
  );
}
