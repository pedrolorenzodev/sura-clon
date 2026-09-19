import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Foto de perfil con el anillo verde de marca.
 *
 * El anillo va en una capa encima de la foto: en Figma el stroke se dibuja
 * hacia adentro y la imagen ocupa los 40px completos. En la capa, que está
 * posicionada, el `border` no le saca tamaño a nada.
 *
 * El Figma lo define en 1.5px, pero Chrome trunca `border-width` a píxeles
 * enteros y lo pintaba de 1. Se redondea para arriba, a 2 (decisión del
 * usuario, 2026-09-19): un borde entero se pinta como se pide y evita tener
 * que resolverlo con un `ring`.
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
      <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-brand" />
    </div>
  );
}
