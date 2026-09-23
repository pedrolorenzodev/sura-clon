import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";
import { detailHref } from "@/lib/routes";

export function NewsCardWide({ item }: { item: NewsItem }) {
  return (
    <article className="flex h-full w-91.25">
      <CardLink
        href={detailHref("news", item.id)}
        className="group flex w-full items-center gap-4 rounded-xl bg-background py-3 pl-3 pr-4 transition-[translate,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-surface-3 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:bg-surface-3 focus-visible:shadow-card-hover motion-reduce:transition-none"
      >
        <div className="relative aspect-[129/97] shrink-0 self-stretch overflow-hidden rounded-xl">
          <Image
            src={item.imageSrc}
            alt=""
            width={1280}
            height={720}
            className="absolute inset-0 size-full object-cover transition-transform duration-250 ease-reveal group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h3 className="line-clamp-3 font-techno text-xs uppercase text-foreground">
            {item.title}
          </h3>
          <NewsMeta item={item} />
        </div>
      </CardLink>
    </article>
  );
}
