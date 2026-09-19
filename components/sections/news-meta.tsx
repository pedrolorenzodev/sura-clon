import type { NewsItem } from "@/lib/data/news";

export function NewsMeta({ item }: { item: NewsItem }) {
  return (
    <div className="flex items-start gap-3 text-2xs font-medium text-subtle-foreground">
      <span className="flex items-center gap-1">
        <span className="icon-clock size-3 shrink-0 bg-subtle-foreground" />
        {item.readTime}
      </span>
      <span className="flex items-center gap-1">
        <span className="icon-calendar size-3 shrink-0 bg-subtle-foreground" />
        {item.date}
      </span>
    </div>
  );
}
