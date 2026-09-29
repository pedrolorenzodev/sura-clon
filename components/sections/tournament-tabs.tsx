"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { EMPTY_RESULTS_KEY, EmptyResults } from "@/components/sections/empty-results";
import { AsidePanel, CommunityRules } from "@/components/sections/game-aside";
import { LevelIcon } from "@/components/sections/level-icon";
import { Pagination } from "@/components/sections/pagination";
import { PlayerLink } from "@/components/sections/player-link";
import { RevealList } from "@/components/sections/reveal-list";
import { RouteTabs } from "@/components/sections/route-tabs";
import { SearchField } from "@/components/sections/search-field";
import { StreamText } from "@/components/sections/stream-text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEARCH_SETTLE_MS, matchesQuery, paginate } from "@/lib/collection";
import { scrollToTopIfHidden } from "@/lib/css-zoom";
import { levels } from "@/lib/data/leaderboard";
import {
  ME_AS_PARTICIPANT,
  PARTICIPANTS_PER_PAGE,
  tournamentDescription,
  tournamentFaqs,
  tournamentParticipants,
  tournamentPrizes,
  type TournamentDetail,
} from "@/lib/data/tournament-detail";
import { useSettledValue } from "@/lib/use-settled-value";
import { useTournamentJoined } from "@/lib/use-tournament-join";
import { useUrlState } from "@/lib/use-url-state";
import { cn } from "@/lib/utils";

const DEFAULTS = { tab: "acerca", q: "", pagina: "1" };

export function TournamentTabs({ tournament }: { tournament: TournamentDetail }) {
  const [state, setState] = useUrlState(DEFAULTS);
  const joined = useTournamentJoined(tournament.id);
  const count = tournament.joined + (joined ? 1 : 0);
  const [aboutStreamed, setAboutStreamed] = useState(false);

  const tabs = [
    { id: "acerca", label: "Acerca" },
    { id: "participantes", label: `Participantes (${count}/${tournament.capacity})` },
    { id: "ganadores", label: "Ganadores" },
  ];
  const tab = tabs.some((item) => item.id === state.tab) ? state.tab : "acerca";

  return (
    <section className="mt-10 flex flex-col">
      <RouteTabs
        items={tabs}
        value={tab}
        onChange={(next) => {
          if (tab === "acerca" && next !== "acerca") setAboutStreamed(true);
          setState({ tab: next, q: "", pagina: "1" });
        }}
        label="Secciones del evento"
      />

      <div className="pt-10">
        {tab === "acerca" && <AboutPanel bannerSrc={tournament.bannerSrc} stream={!aboutStreamed} />}
        {tab === "participantes" && (
          <ParticipantsPanel tournament={tournament} joined={joined} state={state} setState={setState} />
        )}
        {tab === "ganadores" && <PrizesPanel prize={tournament.prize} />}
      </div>
    </section>
  );
}

function AboutPanel({ bannerSrc, stream }: { bannerSrc: string; stream: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface desktop:aspect-[1064/173]">
        <Image src={bannerSrc} alt="" fill sizes="(min-width: 768px) 1064px, 100vw" className="object-cover object-center" />
      </div>

      <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3 desktop:p-6">
          <h2 className="font-techno text-base uppercase text-foreground">Descripción</h2>
          <StreamText blocks={tournamentDescription} animate={stream} />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-6 desktop:w-105.75">
          <AsidePanel title="Reglas">
            <CommunityRules />
          </AsidePanel>
          <AsidePanel title="Preguntas frecuentes">
            <Accordion defaultValue={[tournamentFaqs[0].question]}>
              {tournamentFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AsidePanel>
        </div>
      </div>
    </div>
  );
}

function ParticipantsPanel({
  tournament,
  joined,
  state,
  setState,
}: {
  tournament: TournamentDetail;
  joined: boolean;
  state: typeof DEFAULTS;
  setState: (patch: Partial<typeof DEFAULTS>) => void;
}) {
  const list = useRef<HTMLUListElement>(null);
  const query = useSettledValue(state.q, SEARCH_SETTLE_MS);
  const participants = [...(joined ? [ME_AS_PARTICIPANT] : []), ...tournamentParticipants(tournament)];
  const results = participants.filter((player) => matchesQuery(query, player.name));
  const { pageItems, page, pages } = paginate(results, state.pagina, PARTICIPANTS_PER_PAGE);

  const goToPage = (next: number) => {
    setState({ pagina: String(next) });
    scrollToTopIfHidden(list.current);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
        <h2 className="font-techno text-base uppercase text-foreground">Participantes</h2>
        <SearchField
          placeholder="Buscar usuario"
          value={state.q}
          onChange={(q) => setState({ q, pagina: "1" })}
          className="w-full desktop:w-105.75"
        />
      </div>

      <div className="rounded-2xl border border-border-panel bg-surface px-6 py-3">
        <RevealList
          onMount
          listRef={list}
          flipKeys={pageItems.length ? pageItems.map((player) => player.id) : [EMPTY_RESULTS_KEY]}
          className="flex scroll-mt-header-mobile flex-col desktop:scroll-mt-header-desktop"
        >
          {pageItems.length ? (
            pageItems.map((player, index) => (
              <li
                key={player.id}
                style={{ "--reveal-index": index } as React.CSSProperties}
                className={cn(
                  "row-reveal flex items-center gap-6 py-3",
                  index < pageItems.length - 1 && "border-b border-foreground/5",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-6">
                  <Image
                    src={player.avatarSrc}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0 truncate text-base font-medium text-foreground desktop:w-59 desktop:flex-none">
                    {player.name}
                  </span>
                  <span className="hidden items-center gap-3 desktop:flex">
                    <LevelIcon level={player.level} className="size-5" />
                    <span className="text-sm text-muted-foreground">{levels[player.level].label}</span>
                  </span>
                </div>
                <PlayerLink
                  playerId={player.id}
                  name={player.name}
                  className="flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-xs text-brand transition-[filter] duration-200 hover:drop-shadow-link-hover focus-visible:drop-shadow-link-hover motion-reduce:transition-none"
                >
                  <Eye aria-hidden className="size-3" />
                  <span>Ver participante</span>
                </PlayerLink>
              </li>
            ))
          ) : (
            <EmptyResults>No encontramos participantes para “{query}”.</EmptyResults>
          )}
        </RevealList>
      </div>

      <Pagination
        pages={Math.max(pages, 1)}
        page={page}
        onChange={goToPage}
        label="Paginación de participantes"
        compactOnMobile
        empty={pages === 0}
        className="pt-0"
      />
    </div>
  );
}

const PODIUM = [
  {
    label: "Primer puesto:",
    card: "bg-podium-gold border-gold-bright",
    pill: "bg-gold-deep border-gold",
    text: "bg-gold-text bg-clip-text text-transparent",
    trophy: true,
  },
  {
    label: "Segundo puesto:",
    card: "bg-podium-silver border-silver-bright",
    pill: "bg-silver-deep border-silver",
    text: "text-subtle-foreground",
    trophy: false,
  },
  {
    label: "Tercer puesto:",
    card: "bg-podium-bronze border-bronze",
    pill: "bg-gold-deep border-bronze",
    text: "bg-gold-text bg-clip-text text-transparent",
    trophy: false,
  },
];

function PrizesPanel({ prize }: { prize: string }) {
  const prizes = tournamentPrizes(prize);

  return (
    <div className="flex flex-col gap-6">
      <RevealList onMount className="grid gap-4 desktop:grid-cols-3 desktop:gap-4.5">
        {PODIUM.map((place, index) => (
          <li
            key={place.label}
            style={{ "--reveal-index": index } as React.CSSProperties}
            className={cn("row-reveal flex items-center gap-3 rounded-xl border p-6", place.card)}
          >
            <Image
              src={`/assets/tournaments/detail/medal-${index + 1}.webp`}
              alt=""
              width={80}
              height={80}
              className="size-20 shrink-0 drop-shadow-medal"
            />
            <div className="flex flex-col items-start gap-3">
              <p className="font-techno text-base uppercase text-foreground">{place.label}</p>
              <span className={cn("flex items-center gap-1 rounded-sm border px-3 py-2", place.pill)}>
                {place.trophy && (
                  <Image src="/assets/home/eventos/trophy.webp" alt="" width={18} height={18} className="size-4.5" />
                )}
                <span className={cn("font-techno text-base uppercase", place.text)}>{prizes[index].prize}</span>
              </span>
            </div>
          </li>
        ))}
      </RevealList>

      <div className="rounded-2xl border border-border-panel bg-surface p-6">
        <div className="flex justify-between pb-2 font-techno text-xs uppercase text-muted-foreground">
          <span>Posición</span>
          <span>Premio</span>
        </div>
        <RevealList onMount className="flex flex-col">
          {prizes.slice(3).map((row, index, rows) => (
            <li
              key={row.position}
              style={{ "--reveal-index": PODIUM.length + index } as React.CSSProperties}
              className={cn(
                "row-reveal flex justify-between py-3 text-xs text-foreground",
                index < rows.length - 1 && "border-b border-foreground/5",
              )}
            >
              <span>#{row.position}</span>
              <span className={cn(!row.prize && "text-muted-foreground")}>{row.prize ?? "—"}</span>
            </li>
          ))}
        </RevealList>
      </div>
    </div>
  );
}
