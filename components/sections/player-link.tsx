"use client";

import Link from "next/link";

import { usePlayerModal } from "@/components/sections/player-modal";
import { MY_PLAYER_ID } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

export function PlayerLink({
  playerId,
  name,
  className,
  children,
}: {
  playerId: string;
  name: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = usePlayerModal();

  if (playerId === MY_PLAYER_ID) {
    return (
      <Link href="/profile" prefetch={false} aria-label="Ir a mi perfil" data-sfx-hover="soft" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open(playerId)}
      aria-label={`Ver el perfil de ${name}`}
      aria-haspopup="dialog"
      data-sfx-hover="soft"
      data-sfx="click"
      className={cn("cursor-pointer text-left", className)}
    >
      {children}
    </button>
  );
}
