"use client";

import { usePlayerModal } from "@/components/sections/player-modal";
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
