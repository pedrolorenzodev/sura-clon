"use client";

import { useRef } from "react";

import { useFlipList } from "@/lib/use-flip-list";
import { cn } from "@/lib/utils";

export function FlipList({
  keys,
  className,
  wrapperClassName,
  listRef,
  children,
}: {
  keys: string[];
  className?: string;
  wrapperClassName?: string;
  listRef?: React.RefObject<HTMLUListElement | null>;
  children: React.ReactNode;
}) {
  const ownList = useRef<HTMLUListElement>(null);
  const list = listRef ?? ownList;
  const ghosts = useRef<HTMLDivElement>(null);
  useFlipList(list, ghosts, keys);

  return (
    <div className={cn("relative", wrapperClassName)}>
      <ul ref={list} className={className}>
        {children}
      </ul>
      <div ref={ghosts} aria-hidden data-flip-ghosts className="pointer-events-none absolute inset-0 **:animate-none" />
    </div>
  );
}
