"use client";

import { useCallback, useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function TokenValue({ name }: { name: string }) {
  const value = useSyncExternalStore(
    subscribe,
    useCallback(
      () =>
        getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim() || "—",
      [name],
    ),
    () => "",
  );

  return (
    <span className="font-mono text-2xs text-muted-foreground">
      {value || " "}
    </span>
  );
}
