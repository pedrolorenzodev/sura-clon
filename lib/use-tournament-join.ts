"use client";

import { useSyncExternalStore } from "react";

const empty: readonly string[] = [];
let joined = empty;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const toggleTournamentJoin = (id: string) => {
  joined = joined.includes(id) ? joined.filter((item) => item !== id) : [...joined, id];
  listeners.forEach((listener) => listener());
};

export const useTournamentJoined = (id: string) =>
  useSyncExternalStore(
    subscribe,
    () => joined.includes(id),
    () => false,
  );
