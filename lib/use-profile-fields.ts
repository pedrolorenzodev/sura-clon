"use client";

import { useSyncExternalStore } from "react";

type ProfileValues = Readonly<Record<string, string>>;

const initial: ProfileValues = {};
let values = initial;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setProfileValue = (id: string, value: string) => {
  values = { ...values, [id]: value };
  listeners.forEach((listener) => listener());
};

export const useProfileValues = () => useSyncExternalStore(subscribe, () => values, () => initial);
