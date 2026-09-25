import { useSyncExternalStore } from "react";

import { readIntroPhase, subscribeIntroPhase, type IntroPhase } from "@/lib/hero-intro";

const serverPhase = (): IntroPhase | null => null;

export function useIntroPhase() {
  return useSyncExternalStore(subscribeIntroPhase, readIntroPhase, serverPhase);
}
