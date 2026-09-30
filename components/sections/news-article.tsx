import { AsidePanel } from "@/components/sections/game-aside";
import { NewsCardWide } from "@/components/sections/news-card-wide";
import { NewsCategoryBadge } from "@/components/sections/news-category-badge";
import { NewsMeta } from "@/components/sections/news-meta";
import { ShareButtons } from "@/components/sections/share-buttons";
import { TitleSweep } from "@/components/sections/title-sweep";
import { relatedNews, type NewsBlock, type NewsItem } from "@/lib/data/news";

export function NewsArticle({ item }: { item: NewsItem }) {
  return (
    <div className="mx-auto flex w-full max-w-page flex-col">
      <header className="flex flex-col gap-4 pt-40">
        <NewsCategoryBadge category={item.category} />
        <h1 className="font-display text-banner-title-sm uppercase text-foreground desktop:text-game-hero">
          <TitleSweep onArrival>{item.title}</TitleSweep>
        </h1>
        <NewsMeta item={item} />
      </header>

      <div className="mt-10 flex flex-col gap-10 desktop:mt-12 desktop:flex-row desktop:items-start desktop:gap-6">
        <article className="flex min-w-0 max-w-170 flex-1 flex-col gap-4">
          {item.body.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </article>

        <aside className="flex w-full shrink-0 flex-col gap-6 desktop:ml-auto desktop:w-91.25">
          <AsidePanel title="Compartir">
            <ShareButtons path={`/news/${item.id}`} text={item.title} className="flex-wrap gap-3" />
          </AsidePanel>

          <section className="flex flex-col gap-3">
            <h2 className="font-techno text-base uppercase text-foreground">Relacionadas</h2>
            <ul className="flex flex-col gap-3">
              {relatedNews(item).map((related) => (
                <li key={related.id} className="flex">
                  <NewsCardWide item={related} fluid />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Block({ block }: { block: NewsBlock }) {
  if (block.type === "h")
    return <h2 className="mt-2 font-techno text-title-sm uppercase text-foreground">{block.text}</h2>;
  if (block.type === "quote")
    return (
      <blockquote className="my-2 border-l-2 border-brand-vivid py-1 pl-5 font-techno text-base uppercase text-foreground">
        {block.text}
      </blockquote>
    );
  return <p className="text-sm leading-6 text-subtle-foreground desktop:text-base desktop:leading-7">{block.text}</p>;
}
