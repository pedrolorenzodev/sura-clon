import Image from "next/image";

import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex h-full w-44 shrink-0 flex-col gap-3 rounded-xl bg-surface-3 p-3 desktop:bg-background desktop:w-70 desktop:gap-4">
      <div className="relative aspect-[256/193] w-full shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.imageSrc}
          alt=""
          width={1671}
          height={913}
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <h3 className="line-clamp-2 font-techno text-xs uppercase text-foreground desktop:text-sm">
        {item.title}
      </h3>

      <NewsMeta item={item} />
    </article>
  );
}
