"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const URL_STATE_EVENT = "sura:url-state";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_STATE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_STATE_EVENT, onChange);
  };
}

const readSearch = () => window.location.search;
const readServerSearch = () => "";

export function useUrlState<T extends Record<string, string>>(defaults: T) {
  const search = useSyncExternalStore(subscribe, readSearch, readServerSearch);

  const state = useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(
      Object.entries(defaults).map(([key, fallback]) => [key, params.get(key) ?? fallback]),
    ) as T;
  }, [search, defaults]);

  const update = useCallback(
    (patch: Partial<T>) => {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === "" || value === defaults[key]) params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
      window.dispatchEvent(new Event(URL_STATE_EVENT));
    },
    [defaults],
  );

  return [state, update] as const;
}
