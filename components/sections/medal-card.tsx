"use client";

import Image from "next/image";
import { useState } from "react";

import type { Medal, MedalArt } from "@/lib/data/medals";
import { cn } from "@/lib/utils";

const ART: Record<MedalArt, { src: string; image: string }> = {
  devocion: {
    src: "/assets/home/medallas/sprite-gold-1.webp",
    image: "left-[-12.29%] top-[-14.38%] size-[244.15%]",
  },
  "first-victory": {
    src: "/assets/home/medallas/sprite-gold-1.webp",
    image: "left-[-7.87%] top-[-117.04%] h-[226.55%] w-[230.11%]",
  },
  "point-collector": {
    src: "/assets/home/medallas/sprite-gold-1.webp",
    image: "left-[-121.3%] top-[-118.51%] h-[226.55%] w-[230.11%]",
  },
  "event-master": {
    src: "/assets/home/medallas/sprite-gold-2.webp",
    image: "left-[-127.8%] top-[-125.93%] size-[239.25%]",
  },
  ranking: { src: "/assets/home/medallas/ranking.webp", image: "inset-0 size-full" },
  social: {
    src: "/assets/home/medallas/social.webp",
    image: "inset-0 size-full rotate-90 -scale-y-100",
  },
  consistencia: { src: "/assets/home/medallas/consistencia.webp", image: "inset-0 size-full" },
  sharpshooter: { src: "/assets/home/medallas/sharpshooter.webp", image: "inset-0 size-full" },
  influencer: { src: "/assets/home/medallas/influencer.webp", image: "inset-0 size-full" },
};

const TILT_RESET = { "--tilt-x": 0, "--tilt-y": 0 } as React.CSSProperties;

export function MedalCard({ medal }: { medal: Medal }) {
  const art = ART[medal.art];
  const [tilt, setTilt] = useState(TILT_RESET);

  const follow = (event: React.PointerEvent<HTMLLIElement>) => {
    if (medal.locked || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({
      "--tilt-x": ((event.clientX - rect.left) / rect.width) * 2 - 1,
      "--tilt-y": 1 - ((event.clientY - rect.top) / rect.height) * 2,
    } as React.CSSProperties);
  };

  return (
    <li
      onPointerMove={follow}
      onPointerLeave={() => setTilt(TILT_RESET)}
      style={tilt}
      className={cn(
        "group/medal flex flex-col items-center justify-end gap-3 rounded-lg p-2.5",
        !medal.locked && "bg-background",
      )}
    >
      <div className={cn("relative aspect-square w-full", !medal.locked && "transition-transform duration-200 ease-reveal group-hover/medal:medal-tilt motion-reduce:transition-none")}>
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-full",
            medal.locked ? "bg-medal-sheen-locked" : "border border-brand",
          )}
        >
          {!medal.locked && (
            <>
              <Image
                src="/assets/home/medallas/texture.webp"
                alt=""
                width={1920}
                height={1080}
                className="absolute left-[-4.74%] top-0 h-full w-[177.78%] max-w-none object-cover opacity-20"
              />
              <span className="absolute inset-0 bg-medal-sheen" />
              <span className="medal-glint absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/medal:opacity-100 motion-reduce:transition-none" />
            </>
          )}

          <span className="absolute inset-[11%] overflow-hidden rounded-full">
            <Image
              src={art.src}
              alt=""
              width={1024}
              height={1024}
              className={cn("absolute max-w-none", art.image)}
            />
            {medal.locked && (
              <span className="absolute inset-0 rounded-full bg-medal-veil mix-blend-darken" />
            )}
          </span>

          {medal.sparkle && (
            <Image
              src="/assets/home/sparkling.webp"
              alt=""
              width={736}
              height={736}
              className="absolute left-[12.7%] top-[12.7%] size-[25.4%] -rotate-12"
            />
          )}
        </div>

        {medal.locked && (
          <Image
            src="/assets/home/medallas/lock.svg"
            alt=""
            width={22}
            height={22}
            className="absolute bottom-0 right-0 size-[25.6%] group-hover/medal:deny-shake"
          />
        )}
      </div>

      <p
        className={cn(
          "w-full truncate text-center text-2xs",
          medal.locked ? "text-locked-foreground group-hover/medal:flicker" : "text-foreground",
        )}
      >
        {medal.label}
      </p>
    </li>
  );
}
