"use client";

import { ChevronDown, X } from "lucide-react";
import Image from "next/image";

import { BrandCta } from "@/components/sections/brand-cta";
import { chipClassName } from "@/components/sections/filter-chips";
import { FlipList } from "@/components/sections/flip-list";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { facetLabel, gameFacets, type GameFacetId, type GameFacetValues } from "@/lib/data/games";
import { cn } from "@/lib/utils";

type FilterProps = {
  values: GameFacetValues;
  onToggle: (facet: GameFacetId, option: string) => void;
  onClearFacet: (facet: GameFacetId) => void;
  onClearAll: () => void;
};

const activeCount = (values: GameFacetValues) => Object.values(values).reduce((total, list) => total + list.length, 0);

export function GameFiltersDesktop({ values, onToggle, onClearFacet }: Omit<FilterProps, "onClearAll">) {
  return (
    <div className="hidden shrink-0 items-center gap-4 desktop:flex">
      {gameFacets.map((facet) => {
        const selected = values[facet.id];
        const label =
          selected.length === 0 ? facet.label : selected.length === 1 ? facetLabel(facet.id, selected[0]) : `${facet.label} · ${selected.length}`;

        return (
          <DropdownMenu key={facet.id}>
            <DropdownMenuTrigger
              data-sfx="click"
              aria-label={`Filtrar por ${facet.label.toLowerCase()}`}
              className={cn(
                "group/pill flex h-10 w-40.5 cursor-pointer items-center justify-between gap-2 rounded-pill bg-surface-2 px-4 text-sm font-medium transition-[color,box-shadow] duration-200 hover:text-foreground focus-visible:text-foreground data-popup-open:text-foreground motion-reduce:transition-none",
                selected.length ? "text-foreground ring-1 ring-inset ring-brand-vivid" : "text-muted-foreground",
              )}
            >
              <span className="truncate">{label}</span>
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-200 group-data-popup-open/pill:rotate-180 motion-reduce:transition-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {facet.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  data-sfx="click"
                  checked={selected.includes(option.id)}
                  onCheckedChange={() => onToggle(facet.id, option.id)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <div className="flex justify-between">
                <DropdownMenuItem
                  disabled={!selected.length}
                  onClick={() => onClearFacet(facet.id)}
                  className="px-2 py-1 text-xs text-muted-foreground data-disabled:cursor-default data-disabled:opacity-50"
                >
                  Limpiar
                </DropdownMenuItem>
                <DropdownMenuItem className="px-2 py-1 text-xs text-muted-foreground">Listo</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
}

export function GameFiltersSheet({
  values,
  onToggle,
  onClearAll,
  resultsCount,
}: Omit<FilterProps, "onClearFacet"> & { resultsCount: number }) {
  const count = activeCount(values);

  return (
    <Sheet>
      <SheetTrigger
        data-sfx="click"
        aria-label={count ? `Filtrar juegos, ${count} filtros activos` : "Filtrar juegos"}
        className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center transition-[filter] duration-200 hover:drop-shadow-link-hover focus-visible:drop-shadow-link-hover motion-reduce:transition-none desktop:hidden"
      >
        <Image src="/assets/games/filter.svg" alt="" width={40} height={40} className="size-10" />
        {count > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-vivid px-1 font-techno text-2xs leading-none text-sp-foreground">
            {count}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="gap-5 px-4 pt-3">
        <span aria-hidden className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border" />
        <SheetTitle className="font-techno text-title-sm uppercase text-foreground">Filtros</SheetTitle>

        {gameFacets.map((facet) => (
          <section key={facet.id} className="flex flex-col gap-2.5">
            <h3 className="font-techno text-xs uppercase text-muted-foreground">{facet.label}</h3>
            <ul className="flex flex-wrap gap-2">
              {facet.options.map((option) => {
                const isCurrent = values[facet.id].includes(option.id);
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      aria-pressed={isCurrent}
                      onClick={() => onToggle(facet.id, option.id)}
                      data-sfx="select"
                      className={chipClassName(isCurrent)}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <div className="sticky bottom-0 -mx-4 mt-1 flex gap-3 bg-surface-3 px-4 pt-3 pb-gutter-safe">
          <button
            type="button"
            onClick={onClearAll}
            disabled={!count}
            data-sfx="click"
            className="flex h-12 cursor-pointer items-center justify-center rounded-pill border border-border-dim px-5 text-sm text-subtle-foreground transition-colors duration-200 hover:border-brand/50 hover:text-brand focus-visible:border-brand/50 focus-visible:text-brand disabled:cursor-default disabled:opacity-50 disabled:hover:border-border-dim disabled:hover:text-subtle-foreground motion-reduce:transition-none"
          >
            Limpiar
          </button>
          <SheetClose render={<BrandCta label={`Ver ${resultsCount} ${resultsCount === 1 ? "juego" : "juegos"}`} className="flex h-12 flex-1" labelClassName="text-sm" />} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function GameActiveFilters({ values, onToggle, onClearAll }: Omit<FilterProps, "onClearFacet">) {
  const chips = gameFacets.flatMap((facet) => values[facet.id].map((option) => ({ facet: facet.id, option })));
  if (!chips.length) return null;

  return (
    <FlipList
      keys={[...chips.map((chip) => `${chip.facet}:${chip.option}`), "clear"]}
      className="flex flex-wrap items-center gap-2"
    >
      {chips.map((chip) => (
        <li key={`${chip.facet}:${chip.option}`}>
          <button
            type="button"
            onClick={() => onToggle(chip.facet, chip.option)}
            aria-label={`Quitar el filtro ${facetLabel(chip.facet, chip.option)}`}
            data-sfx="click"
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-pill bg-surface-2 pl-3 pr-2 text-xs text-foreground ring-1 ring-inset ring-border-dim transition-shadow duration-200 hover:ring-muted-foreground focus-visible:ring-muted-foreground motion-reduce:transition-none"
          >
            {facetLabel(chip.facet, chip.option)}
            <X aria-hidden className="size-3 text-muted-foreground" />
          </button>
        </li>
      ))}
      <li key="clear">
        <button
          type="button"
          onClick={onClearAll}
          data-sfx-hover
          data-sfx="click"
          className="flex h-8 cursor-pointer items-center px-2 font-techno text-xs uppercase text-brand transition-[filter] duration-200 hover:drop-shadow-link-hover focus-visible:drop-shadow-link-hover motion-reduce:transition-none"
        >
          Limpiar filtros
        </button>
      </li>
    </FlipList>
  );
}
