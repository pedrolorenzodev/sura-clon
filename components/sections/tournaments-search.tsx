"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

export function TournamentsSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center gap-1.5 rounded-pill bg-surface-2 px-4 py-2.5 ring-1 ring-inset ring-border-muted/25 transition-[--tw-ring-color] duration-200 focus-within:ring-border-light motion-reduce:transition-none desktop:max-w-1/2 desktop:py-2">
      <Image
        src="/assets/tournaments/search.svg"
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0"
      />

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar evento"
        aria-label="Buscar evento"
        className="min-w-px flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none desktop:text-base"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Limpiar búsqueda"
          className="flex shrink-0 cursor-pointer text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>
      )}
    </div>
  );
}
