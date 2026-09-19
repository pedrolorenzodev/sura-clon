import Image from "next/image";

import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";

export function NewsCardWide({ item }: { item: NewsItem }) {
  return (
    <article className="flex h-full w-91.25 items-center gap-4 rounded-xl bg-background py-3 pl-3 pr-4">
      <div className="relative aspect-[129/97] shrink-0 self-stretch overflow-hidden rounded-xl">
        <Image
          src={item.imageSrc}
          alt=""
          width={1280}
          height={720}
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h3 className="line-clamp-3 font-techno text-xs uppercase text-foreground">{item.title}</h3>
        <NewsMeta item={item} />
      </div>
    </article>
  );
}
