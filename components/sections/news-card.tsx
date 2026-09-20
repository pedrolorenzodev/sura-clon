import Image from "next/image";
import Link from "next/link";

import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex h-full w-44 shrink-0 desktop:w-70">
      <Link
        href={`/news/${item.id}`}
        prefetch={false}
        className="group flex w-full flex-col gap-3 rounded-xl bg-surface-3 p-3 transition-shadow duration-200 hover:shadow-brand-glow focus-visible:shadow-brand-glow motion-reduce:transition-none desktop:gap-4 desktop:bg-background"
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

        <h3 className="line-clamp-2 font-techno text-xs uppercase text-foreground transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand motion-reduce:transition-none desktop:text-sm">
          {item.title}
        </h3>

        <NewsMeta item={item} />
      </Link>
    </article>
  );
}
