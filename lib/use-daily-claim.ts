"use client";

import { useSyncExternalStore } from "react";

import { currentUser, dailyClaim } from "@/lib/data/user";

type ClaimState = { claimed: boolean; points: number };

const initial: ClaimState = { claimed: false, points: currentUser.points };
let state = initial;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const claimDailyReward = () => {
  if (state.claimed) return;
  state = { claimed: true, points: state.points + dailyClaim.reward };
  listeners.forEach((listener) => listener());
};

export const useDailyClaim = () => useSyncExternalStore(subscribe, () => state, () => initial);
