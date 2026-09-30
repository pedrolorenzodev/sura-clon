import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import { CardBrackets } from "@/components/sections/card-brackets";
import { NewsCategoryBadge } from "@/components/sections/news-category-badge";
import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";
import { detailHref } from "@/lib/routes";

export function NewsFeature({ item }: { item: NewsItem }) {
  return (
    <CardLink
      href={detailHref("news", item.id)}
      className="group relative block transition-[translate,box-shadow,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover active:scale-99 motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl desktop:aspect-[3/1]">
        <Image
          src={item.imageSrc}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 1360px, 100vw"
          className="object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
        />
        <span className="absolute inset-0 bg-news-feature-scrim" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 desktop:max-w-190 desktop:gap-4 desktop:p-10">
          <NewsCategoryBadge category={item.category} />
          <h2 className="line-clamp-4 font-display text-banner-title-sm uppercase text-foreground desktop:line-clamp-3 desktop:text-banner-title">
            {item.title}
          </h2>
          <NewsMeta item={item} />
        </div>
      </div>
      <CardBrackets />
    </CardLink>
  );
}
