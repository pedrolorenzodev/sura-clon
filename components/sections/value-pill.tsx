import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Moneda + Sura Points. Es el componente `Value` del Figma, el mismo que el
 * header usa para el saldo, con una variante de color por puesto del podio.
 *
 * El anillo va como `ring-inset` y no como `border`: el stroke del Figma se
 * dibuja hacia adentro, así que el pill mide 32 de alto y no 34.
 *
 * El número va en `font-techno`, que es lo que pide el frame desktop (decisión
 * del usuario, 2026-09-19). El pill del header quedó en Inter desde el bloque 1
 * y todavía no se alineó: está anotado como deuda en PRD § 6.
 */
export type ValuePillVariant = "neutral" | "gold" | "silver" | "bronze";

const VARIANT: Record<ValuePillVariant, string> = {
  neutral: "ring-muted-foreground/25 bg-surface-2",
  gold: "ring-gold bg-gold-deep",
  silver: "ring-silver bg-silver-deep",
  /* El bronce no tiene fondo propio: el Figma le pone el mismo #714900 del oro. */
  bronze: "ring-bronze bg-gold-deep",
};

export function ValuePill({
  points,
  variant = "neutral",
  small = false,
}: {
  points: string;
  variant?: ValuePillVariant;
  /** El podio mobile achica el número a 10px en el 2º y el 3º. La moneda no cambia. */
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-sm p-2 ring-1 ring-inset",
        VARIANT[variant],
      )}
    >
      <Image
        src="/assets/home/sp-coin.png"
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      <span
        className={cn(
          "font-techno uppercase text-foreground",
          small ? "text-2xs" : "text-xs",
        )}
      >
        {points}
      </span>
    </div>
  );
}
