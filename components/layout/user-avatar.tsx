import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Foto de perfil redonda con su anillo.
 *
 * El anillo va en una capa encima de la foto: en Figma el stroke se dibuja
 * hacia adentro y la imagen ocupa el tamaño completo. En la capa, que está
 * posicionada, el `border` no le saca tamaño a nada.
 *
 * El header lo define en 1.5px, pero Chrome trunca `border-width` a píxeles
 * enteros y lo pintaba de 1. Se redondea para arriba, a 2 (decisión del
 * usuario, 2026-09-19): un borde entero se pinta como se pide y evita tener
 * que resolverlo con un `ring`. Los anillos de 0.7px del podio siguen la misma
 * regla y quedan en 1.
 */
export function UserAvatar({
  src,
  size = 40,
  ringClassName = "border-2 border-brand",
  className,
  children,
}: {
  src: string;
  /** Tamaño intrínseco que se le declara a `next/image`; el render lo fija `className`. */
  size?: number;
  /** Anillo del diseño. El default es el verde de marca del header. */
  ringClassName?: string;
  className?: string;
  /** Lo que se apoya encima de la foto: la medallita del podio, por ejemplo. */
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative size-10 shrink-0", className)}>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="size-full rounded-full object-cover"
      />
      <span className={cn("pointer-events-none absolute inset-0 rounded-full", ringClassName)} />
      {children}
    </div>
  );
}
