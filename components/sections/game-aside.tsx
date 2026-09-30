import Image from "next/image";

import { communityRules } from "@/lib/data/community-rules";
import {
  gameNetwork,
  gameSocials,
  type GameDetail,
} from "@/lib/data/game-detail";
import { cn } from "@/lib/utils";

export function GameAside({ game }: { game: GameDetail }) {
  return (
    <aside className="hidden w-91.25 shrink-0 flex-col gap-6 desktop:flex">
      <AsidePanel title="Reglas de la comunidad">
        <CommunityRules />
      </AsidePanel>

      <AsidePanel title="Detalles">
        <dl className="flex flex-col gap-4">
          <AsideField label="Red" className="gap-3">
            <span className="flex size-10 items-center justify-center rounded-sm bg-search-field">
              <span className="relative size-6.5 overflow-hidden rounded-full">
                <Image
                  src={gameNetwork.logoSrc}
                  alt={gameNetwork.name}
                  width={150}
                  height={84}
                  className="absolute left-[-94.05%] top-[-30.76%] h-[161.87%] w-[288.29%] max-w-none"
                />
              </span>
            </span>
          </AsideField>

          <AsideField label="Plataformas">
            {game.platforms.length ? (
              <TagList tags={game.platforms} />
            ) : (
              <p className="text-2xs leading-3.5 text-muted-foreground">
                No hay plataformas disponibles.
              </p>
            )}
          </AsideField>

          <AsideField label="Sociales">
            <ul className="flex flex-wrap gap-x-2 gap-y-1">
              {gameSocials(game).map((social) => (
                <li key={social}>
                  <button
                    type="button"
                    data-sfx-hover
                    className="cursor-pointer text-2xs leading-5 text-brand-legacy transition-[filter] duration-200 hover:drop-shadow-link-hover focus-visible:drop-shadow-link-hover motion-reduce:transition-none"
                  >
                    {social}
                  </button>
                </li>
              ))}
            </ul>
          </AsideField>

          <AsideField label="Géneros" last>
            <TagList tags={game.tags} />
          </AsideField>
        </dl>
      </AsidePanel>
    </aside>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="flex h-7 items-center justify-center rounded-pill border-2 border-border-dim px-4 text-xs font-medium leading-5 text-muted-foreground"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function AsidePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border-panel bg-surface p-6">
      <h2 className="font-techno text-base uppercase text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AsideField({
  label,
  last,
  className,
  children,
}: {
  label: string;
  last?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 pb-4",
        !last && "border-b border-border-dim/30",
        className,
      )}
    >
      <dt className="text-2xs leading-3.5 text-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function CommunityRules() {
  return (
    <ul className="flex flex-col gap-3">
      {communityRules.map((rule) => (
        <li key={rule.text} className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-border-dim/50">
            <Image
              src={rule.iconSrc}
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          </span>
          <p className="text-2xs leading-3.5 text-muted-foreground">
            {rule.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
