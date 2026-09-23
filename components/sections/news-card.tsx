import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";
import { detailHref } from "@/lib/routes";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex h-full w-44 shrink-0 desktop:w-70">
      <CardLink
        href={detailHref("news", item.id)}
        className="group flex w-full flex-col gap-3 rounded-xl bg-surface-3 p-3 transition-[translate,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:bg-surface-2 focus-visible:shadow-card-hover motion-reduce:transition-none desktop:gap-4 desktop:bg-background desktop:hover:bg-surface-3 desktop:focus-visible:bg-surface-3"
      >
        <div className="relative aspect-[256/193] w-full shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.imageSrc}
            alt=""
            width={1671}
            height={913}
            className="absolute inset-0 size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />
        </div>

        <h3 className="line-clamp-2 font-techno text-xs uppercase text-foreground desktop:text-sm">
          {item.title}
        </h3>

        <NewsMeta item={item} />
      </CardLink>
    </article>
  );
}
