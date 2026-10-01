import Image from "next/image";

import { CardLink } from "@/components/layout/card-link";
import { CardBrackets } from "@/components/sections/card-brackets";
import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";
import { detailHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function NewsCardWide({ item, fluid }: { item: NewsItem; fluid?: boolean }) {
  return (
    <article className={cn("flex h-full", "w-full")}>
      <CardLink
        href={detailHref("news", item.id)}
        className={cn(
          "group relative flex w-full items-center gap-4 rounded-xl py-3 pl-3 pr-4 transition-[translate,box-shadow,background-color,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover active:scale-98 motion-reduce:transition-none",
          fluid
            ? "bg-surface-3 hover:bg-surface-2 focus-visible:bg-surface-2"
            : "bg-background hover:bg-surface-3 focus-visible:bg-surface-3",
        )}
      >
        <div className="relative w-40 shrink-0 self-stretch overflow-hidden rounded-xl">
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
        <CardBrackets />
      </CardLink>
    </article>
  );
}
