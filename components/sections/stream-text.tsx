"use client";

import { useRef, useState } from "react";

import { isAppReady } from "@/lib/motion";
import { useRevealOnView } from "@/lib/use-reveal-on-view";

type StreamBlock = { heading: string; lines: string[] };

export function StreamText({ blocks, animate }: { blocks: StreamBlock[]; animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRevealOnView(ref, animate ? "load" : "off");
  const [afterRoute] = useState(isAppReady);
  let index = 0;

  const words = (text: string) =>
    text.split(" ").map((word, position) => (
      <span key={position}>
        {position > 0 && " "}
        <span className="stream-word" style={{ "--word-index": index++ } as React.CSSProperties}>
          {word}
        </span>
      </span>
    ));

  return (
    <div
      ref={ref}
      data-reveal={state === "entered" ? "shown" : (state ?? undefined)}
      data-after-route={(afterRoute && state === "shown") || undefined}
      className="flex flex-col gap-4 text-xs leading-5"
    >
      {blocks.map((block) => (
        <div key={block.heading}>
          <p className="text-foreground">{words(block.heading)}</p>
          {block.lines.map((line) => (
            <p key={line} className="text-muted-foreground">
              {words(line)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
