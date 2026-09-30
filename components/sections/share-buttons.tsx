"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

const SHARE_ICON =
  "flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-surface-2 transition-[translate,box-shadow,scale] duration-200 ease-reveal hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:shadow-card-hover active:scale-95 motion-reduce:transition-none";

export function ShareButtons({ path, text, className }: { path: string; text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = () => `${window.location.origin}${path}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: text, url: shareUrl() }).catch(() => {});
      return;
    }
    await copyLink();
  };

  const openShare = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <ul className={cn("flex items-center", className)}>
      <li>
        <button type="button" onClick={nativeShare} aria-label="Compartir en Instagram" data-sfx-hover data-sfx="click" className={SHARE_ICON}>
          <Image src="/assets/leaderboard/modal/share-instagram.svg" alt="" width={48} height={48} className="size-12" />
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => openShare(`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl())}`)}
          aria-label="Compartir en X"
          data-sfx-hover
          data-sfx="click"
          className={SHARE_ICON}
        >
          <Image src="/assets/leaderboard/modal/share-x.svg" alt="" width={22} height={20} className="h-5 w-auto" />
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`)}
          aria-label="Compartir en Facebook"
          data-sfx-hover
          data-sfx="click"
          className={SHARE_ICON}
        >
          <Image src="/assets/leaderboard/modal/share-facebook.webp" alt="" width={40} height={40} className="size-5" />
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={() => openShare(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl()}`)}`)}
          aria-label="Compartir en WhatsApp"
          data-sfx-hover
          data-sfx="click"
          className={SHARE_ICON}
        >
          <Image src="/assets/leaderboard/modal/share-whatsapp.svg" alt="" width={48} height={48} className="size-12" />
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={copyLink}
          aria-label={copied ? "Link copiado" : "Copiar link"}
          data-sfx-hover
          data-sfx="click"
          className={SHARE_ICON}
        >
          {copied ? (
            <Check className="size-5 text-brand" strokeWidth={2.5} aria-hidden />
          ) : (
            <Image src="/assets/leaderboard/modal/share-link.svg" alt="" width={20} height={20} className="size-5" />
          )}
        </button>
      </li>
    </ul>
  );
}
