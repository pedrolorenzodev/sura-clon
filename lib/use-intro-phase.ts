import { useSyncExternalStore } from "react";

import {
  readIntroPhase,
  readIntroRun,
  readIntroStarted,
  subscribeIntroPhase,
  type IntroPhase,
} from "@/lib/hero-intro";

const serverPhase = (): IntroPhase | null => null;
const serverStarted = () => false;
const serverRun = () => 0;

export function useIntroPhase() {
  return useSyncExternalStore(subscribeIntroPhase, readIntroPhase, serverPhase);
}

export function useIntroStarted() {
  return useSyncExternalStore(subscribeIntroPhase, readIntroStarted, serverStarted);
}

export function useIntroRun() {
  return useSyncExternalStore(subscribeIntroPhase, readIntroRun, serverRun);
}
