"use client";

import { useSyncExternalStore } from "react";

import { dailyClaim } from "@/lib/data/user";
import { useCurrentUser } from "@/lib/use-current-user";

type Gain = { id: number; amount: number };

type ClaimState = {
  claimed: boolean;
  earned: number;
  gain: Gain | null;
  rewards: readonly string[];
  started: readonly string[];
};

const initial: ClaimState = { claimed: false, earned: 0, gain: null, rewards: [], started: [] };
let state = initial;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const award = (amount: number, patch: Partial<ClaimState>) => {
  state = { ...state, ...patch, earned: state.earned + amount, gain: { id: (state.gain?.id ?? 0) + 1, amount } };
  listeners.forEach((listener) => listener());
};

export const claimDailyReward = () => {
  if (state.claimed) return;
  award(dailyClaim.reward, { claimed: true });
};

export const claimReward = (id: string, amount: number) => {
  if (state.rewards.includes(id)) return;
  award(amount, { rewards: [...state.rewards, id] });
};

export const startTask = (id: string) => {
  if (state.started.includes(id)) return;
  state = { ...state, started: [...state.started, id] };
  listeners.forEach((listener) => listener());
};

export const useDailyClaim = () => {
  const { points } = useCurrentUser();
  const claim = useSyncExternalStore(subscribe, () => state, () => initial);
  return { ...claim, points: points + claim.earned };
};
