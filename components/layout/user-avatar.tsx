import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Foto de perfil con el anillo verde de marca.
 *
 * El anillo va en una capa encima de la foto, no como `border`: en Figma el
 * stroke se dibuja hacia adentro y la imagen ocupa los 40px completos. Un
 * `border` en CSS achicaría la foto a 37px.
 */
export function UserAvatar({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn("relative size-10 shrink-0", className)}>
      <Image
        src={src}
        alt=""
        width={40}
        height={40}
        className="size-full rounded-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full border-[length:var(--border-thin)] border-brand" />
    </div>
  );
}
