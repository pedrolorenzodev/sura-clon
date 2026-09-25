"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function SearchField({
  placeholder,
  className,
  inputClassName,
}: {
  placeholder: string;
  className?: string;
  inputClassName?: string;
}) {
  const [query, setQuery] = useState("");

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-pill bg-search-field px-4 py-2 transition-shadow duration-200 focus-within:ring-1 focus-within:ring-inset focus-within:ring-border-light motion-reduce:transition-none desktop:gap-3",
        className,
      )}
    >
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
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "min-w-px flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none",
          inputClassName,
        )}
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
