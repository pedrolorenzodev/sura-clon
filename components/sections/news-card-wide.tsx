import Image from "next/image";
import Link from "next/link";

import { NewsMeta } from "@/components/sections/news-meta";
import type { NewsItem } from "@/lib/data/news";

export function NewsCardWide({ item }: { item: NewsItem }) {
  return (
    <article className="flex h-full w-91.25">
      <Link
        href={`/news/${item.id}`}
        prefetch={false}
        className="group flex w-full items-center gap-4 rounded-xl bg-background py-3 pl-3 pr-4 transition-shadow duration-200 hover:shadow-brand-glow focus-visible:shadow-brand-glow motion-reduce:transition-none"
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
          <h3 className="line-clamp-3 font-techno text-xs uppercase text-foreground transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand motion-reduce:transition-none">
            {item.title}
          </h3>
          <NewsMeta item={item} />
        </div>
      </Link>
    </article>
  );
}
