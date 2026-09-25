"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { SectionLink } from "@/components/layout/section-link";
import { CardBrackets } from "@/components/sections/card-brackets";
import { ScrambleText } from "@/components/sections/scramble-text";
import { TitleSweep } from "@/components/sections/title-sweep";
import {
  homeSpawn,
  mapPoints,
  notFoundCopy,
  playerPosition,
  playZone,
  spawnDistance,
  spawnPoints,
  type SpawnPoint,
  type SpawnPointId,
} from "@/lib/data/not-found";
import { isAppReady, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Aim = {
  onPointerEnter: (event: React.PointerEvent) => void;
  onPointerLeave: (event: React.PointerEvent) => void;
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerCancel: (event: React.PointerEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
};

const noSubscription = () => () => {};
const hasPreviousPage = () => window.history.length > 1;
const serverHasPreviousPage = () => false;

const readPath = (pathname: string) => {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
};

function SpawnLink({ point, className, children, ...props }: {
  point: SpawnPoint;
  className: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  if (point.id === "home") {
    return (
      <SectionLink sectionId="home" className={className} {...props}>
        {children}
      </SectionLink>
    );
  }
  return (
    <Link href={point.href} className={className} {...props}>
      {children}
    </Link>
  );
}

function RouteLine({ afterRoute }: { afterRoute: boolean }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span
        className={cn(
          "route-draw-y absolute left-[calc(var(--px)*1%)] top-[calc(var(--ty)*1%)] h-[calc((var(--py)-var(--ty))*1%)] w-0.5 -translate-x-1/2 bg-brand",
          afterRoute && "route-draw-after-route",
        )}
      />
      <span
        className={cn(
          "route-draw-x absolute left-[calc(var(--tx)*1%)] top-[calc(var(--ty)*1%)] h-0.5 w-[calc((var(--px)-var(--tx))*1%+var(--spacing)*0.25)] -translate-y-1/2 bg-brand",
          afterRoute && "route-draw-after-route",
        )}
      />
    </span>
  );
}

function MapNode({ point, locked, afterRoute, aim }: {
  point: SpawnPoint;
  locked: boolean;
  afterRoute: boolean;
  aim: Aim;
}) {
  const isHome = point.id === "home";

  return (
    <SpawnLink
      point={point}
      tabIndex={-1}
      aria-hidden
      data-locked={locked || undefined}
      style={{ "--x": point.x, "--y": point.y } as React.CSSProperties}
      className={cn(
        "group absolute right-[calc((100-var(--x))*1%-var(--spacing)*1.5-var(--m)/2)] top-[calc(var(--y)*1%)] flex -translate-y-1/2 items-center gap-2 p-1.5",
        isHome ? "[--m:calc(var(--spacing)*3.5)]" : "[--m:calc(var(--spacing)*2.5)]",
        afterRoute
          ? "[--bracket-lead:calc(var(--route-shutter-duration)+var(--route-draw-duration))]"
          : "[--bracket-lead:var(--route-draw-duration)]",
      )}
      {...aim}
    >
      <span
        className={cn(
          "font-techno uppercase transition-colors duration-200 group-data-locked:text-brand motion-reduce:transition-none",
          isHome ? "text-xs text-foreground desktop:text-sm" : "text-2xs text-subtle-foreground desktop:text-xs",
        )}
      >
        {point.label}
      </span>
      <span className="size-(--m) border-2 border-muted-foreground bg-surface-deep transition-colors duration-200 group-hover:border-brand group-data-locked:border-brand group-data-locked:bg-brand-deep motion-reduce:transition-none" />
      <CardBrackets />
    </SpawnLink>
  );
}

export function OffMap() {
  const pathname = usePathname();
  const router = useRouter();
  const canGoBack = useSyncExternalStore(noSubscription, hasPreviousPage, serverHasPreviousPage);
  const [hovered, setHovered] = useState<SpawnPointId | null>(null);
  const [focused, setFocused] = useState<SpawnPointId | null>(null);
  const [aimed, setAimed] = useState(false);
  const [arrival] = useState(() => isAppReady() && !prefersReducedMotion());

  const target = mapPoints.find((point) => point.id === (hovered ?? focused)) ?? homeSpawn;
  const afterRoute = arrival && !aimed;

  const aim = (id: SpawnPointId): Aim => {
    const lock = () => {
      setAimed(true);
      setHovered(id);
    };
    const release = () => setHovered((current) => (current === id ? null : current));
    return {
      onPointerEnter: (event) => event.pointerType === "mouse" && lock(),
      onPointerLeave: (event) => event.pointerType === "mouse" && release(),
      onPointerDown: (event) => event.pointerType !== "mouse" && lock(),
      onPointerCancel: release,
      onFocus: () => {
        setAimed(true);
        setFocused(id);
      },
      onBlur: () => setFocused((current) => (current === id ? null : current)),
    };
  };

  const mapVars = {
    "--px": playerPosition.x,
    "--py": playerPosition.y,
    "--tx": target.x,
    "--ty": target.y,
    "--zone-x": playZone.inset,
    "--zone-y": playZone.insetY,
    "--zone-y-desktop": playZone.insetYDesktop,
  } as React.CSSProperties;

  return (
    <div className="mx-auto grid max-w-page grid-cols-1 pt-4 desktop:grid-cols-[minmax(min-content,1fr)_minmax(0,var(--spacing-map))] desktop:grid-rows-[auto_auto_1fr] desktop:gap-x-16 desktop:pt-6">
      <div className="flex min-w-0 flex-col items-start">
        <p className="font-techno text-xs uppercase text-brand">{notFoundCopy.eyebrow}</p>
        <h1 className="mt-3 whitespace-nowrap font-display text-display-xs uppercase text-foreground desktop:mt-4 desktop:text-display">
          <TitleSweep onArrival>
            {notFoundCopy.titleLines[0]}
            <br />
            {notFoundCopy.titleLines[1]}
          </TitleSweep>
        </h1>
        <p className="mt-4 flex max-w-full gap-2 font-techno text-xs uppercase text-muted-foreground desktop:text-sm">
          <span>{notFoundCopy.pathLabel}</span>
          <ScrambleText decodeOnMount text={readPath(pathname)} className="min-w-0 truncate text-subtle-foreground" />
        </p>
        <p className="mt-4 text-sm text-subtle-foreground desktop:mt-6 desktop:text-base">{notFoundCopy.body}</p>
      </div>

      <div
        role="img"
        aria-label={notFoundCopy.mapLabel}
        style={mapVars}
        className="map-grid relative mt-6 h-map-mobile w-full overflow-hidden rounded-xl bg-surface-deep ring-1 ring-inset ring-border-dim desktop:col-start-2 desktop:row-span-3 desktop:row-start-1 desktop:mt-0 desktop:aspect-square desktop:h-auto desktop:self-start"
      >
        <span
          aria-hidden
          className="absolute inset-x-[calc(var(--zone-x)*1%)] inset-y-[calc(var(--zone-y)*1%)] rounded-sm border border-dashed border-border desktop:inset-y-[calc(var(--zone-y-desktop)*1%)]"
        >
          <span className="absolute left-2 top-2 font-techno text-2xs uppercase text-locked-foreground desktop:text-xs">
            {notFoundCopy.zone}
          </span>
        </span>

        <RouteLine key={target.id} afterRoute={afterRoute} />

        <p aria-hidden className="absolute left-3 top-3 font-techno text-2xs uppercase text-muted-foreground desktop:left-4 desktop:top-4 desktop:text-xs">
          {notFoundCopy.mapTitle}
        </p>
        <p aria-hidden className="absolute right-3 top-3 flex items-center gap-2 font-techno text-2xs uppercase text-muted-foreground desktop:right-4 desktop:top-4 desktop:text-xs">
          <span className="block h-1 w-10 border border-t-0 border-muted-foreground desktop:w-16.5" />
          {notFoundCopy.mapScale}
        </p>
        <p aria-hidden className="absolute bottom-3 left-3 flex items-center gap-2 whitespace-nowrap font-techno text-2xs uppercase text-muted-foreground desktop:bottom-4 desktop:left-4 desktop:text-xs">
          {notFoundCopy.coordinates}
          <span>›</span>
          <span className="text-foreground">{target.label}</span>
          <span className="text-brand">{spawnDistance(target)}</span>
        </p>

        {mapPoints.map((point) => (
          <MapNode
            key={point.id}
            point={point}
            locked={point.id === target.id}
            afterRoute={afterRoute}
            aim={aim(point.id)}
          />
        ))}

        <span aria-hidden className="flicker absolute left-[calc(var(--px)*1%)] top-[calc(var(--py)*1%)]">
          <span className="absolute right-4 top-0 -translate-y-1/2 whitespace-nowrap font-techno text-2xs uppercase text-brand desktop:text-xs">
            {notFoundCopy.player}
          </span>
          <span className="blip-blink absolute size-2.5 -translate-1/2 rounded-full bg-brand outline-1 outline-offset-3 outline-brand outline-solid" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-6 desktop:mt-8">
        <SectionLink
          sectionId="home"
          {...aim("home")}
          className="wipe inline-flex h-7.5 items-center self-start rounded-pill bg-brand px-4 font-techno text-cta-sm uppercase text-black shadow-cta-mobile transition-[box-shadow,translate] duration-200 hover:wipe-on hover:shadow-cta-hover focus-visible:wipe-on focus-visible:shadow-cta-hover active:translate-y-px motion-reduce:transition-none desktop:h-11.5 desktop:min-w-45.25 desktop:justify-center desktop:px-5 desktop:text-cta desktop:shadow-cta desktop:hover:shadow-cta-hover desktop:focus-visible:shadow-cta-hover"
        >
          <ScrambleText text={notFoundCopy.cta} />
        </SectionLink>
        {canGoBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className="hidden cursor-pointer items-center gap-1 font-techno text-sm uppercase text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none desktop:inline-flex"
          >
            <ChevronLeft aria-hidden className="size-4" strokeWidth={1.5} />
            <ScrambleText text={notFoundCopy.back} />
          </button>
        )}
      </div>

      <section aria-labelledby="spawns-title" className="mt-8 min-w-0 desktop:mt-10">
        <h2 id="spawns-title" className="font-techno text-xs uppercase text-muted-foreground">
          {notFoundCopy.spawnsTitle}
        </h2>
        <ul className="mt-3 border-t border-border-dim">
          {spawnPoints.map((point) => {
            const isTarget = point.id === target.id;
            return (
              <li key={point.id}>
                <Link
                  href={point.href}
                  {...aim(point.id)}
                  className="group/row flex h-11 items-center gap-3 border-b border-border-dim px-3 transition-colors duration-200 hover:bg-white/3 focus-visible:bg-white/3 motion-reduce:transition-none desktop:h-12 desktop:gap-4"
                >
                  <span aria-hidden className="flex size-6.5 shrink-0 items-center justify-center">
                    <span
                      className={cn(
                        "block transition-colors duration-200 group-hover/row:bg-brand group-focus-visible/row:bg-brand motion-reduce:transition-none",
                        point.icon,
                        point.iconSize,
                        isTarget ? "bg-brand" : "bg-foreground",
                      )}
                    />
                  </span>
                  <span className="font-techno text-sm uppercase text-foreground desktop:text-base">{point.label}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground desktop:text-sm">{point.href}</span>
                  <span
                    className={cn(
                      "font-techno text-xs uppercase tabular-nums transition-colors duration-200 motion-reduce:transition-none desktop:text-sm",
                      isTarget ? "text-brand" : "text-muted-foreground",
                    )}
                  >
                    {spawnDistance(point)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
