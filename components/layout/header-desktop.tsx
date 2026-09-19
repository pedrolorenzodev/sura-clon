import Image from "next/image";

import { UserAvatar } from "@/components/layout/user-avatar";
import { currentUser, dailyClaim } from "@/lib/data/user";
import { cn } from "@/lib/utils";

/** Contador de la pill: ícono + un chip interno con el valor. */
function Counter({
  iconSrc,
  value,
  bold,
}: {
  iconSrc: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className="flex w-29 items-center gap-2 rounded-lg bg-surface-2 py-1 pl-2 pr-1">
      <Image src={iconSrc} alt="" width={28} height={28} className="size-7 shrink-0" />
      <div className="flex min-w-px flex-1 items-center justify-center rounded-md bg-surface-3 px-2 py-1">
        <p className={cn("text-base text-foreground", bold ? "font-bold" : "font-medium")}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function HeaderDesktop({ className }: { className?: string }) {
  return (
    <div className={cn("items-center justify-between px-10 py-6", className)}>
      {/* El logo vuelve al hero, igual que el primer ítem del menú. Es un ancla
          y no un `Link` a `/`: el menú scrollea en vez de rutear (PRD § 5) y
          estamos parados en `/`, así que navegar no tendría a dónde ir.

          El `flex` no es decorativo: sin él el `<a>` es inline y le suma el
          espacio de descendente de la línea al alto del header.

          El nombre accesible del link lo pone el `alt` de la imagen. */}
      <a href="#home" className="flex">
        <Image
          src="/assets/home/logo-sura.svg"
          alt="Sura Gaming"
          width={164}
          height={40}
          className="h-10 w-41"
          priority
        />
      </a>

      <div className="flex items-center gap-3 rounded-xl bg-surface p-2">
        {/* El hover no está en el diseño (PRD § 6): el botón se ilumina con el
            mismo verde con el que el Figma ilumina el CTA del hero, y el label
            sube al verde aclarado. Dos señales coordinadas, cero movimiento.

            El glow va como `box-shadow` y la caída del diseño sigue siendo un
            `drop-shadow`, que es un filtro: no se pisan. */}
        <button
          type="button"
          className="group flex cursor-pointer items-center gap-2 rounded-lg bg-claim py-1 pl-3 pr-4 ring-1 ring-inset ring-brand drop-shadow-claim transition-shadow duration-200 hover:shadow-brand-glow focus-visible:shadow-brand-glow motion-reduce:transition-none"
        >
          <span className="relative size-8 shrink-0">
            <Image
              src={dailyClaim.gameIconSrc}
              alt=""
              width={36}
              height={32}
              className="absolute -left-0.5 top-0.5 h-8 w-9 max-w-none"
            />
            <Image
              src={dailyClaim.sparkleSrc}
              alt=""
              width={12}
              height={12}
              className="absolute left-3 top-0 size-3 object-contain"
            />
          </span>
          <span className="text-base font-semibold text-brand transition-colors duration-200 group-hover:text-brand-bright group-focus-visible:text-brand-bright motion-reduce:transition-none">
            {dailyClaim.label}
          </span>
        </button>

        <Counter iconSrc="/assets/home/fire.png" value={currentUser.streak} bold />
        <Counter iconSrc="/assets/home/sp-coin.png" value={currentUser.points} />

        {/* Avatar, nombre y nivel son UNA identidad, así que el hover toma los
            tres juntos y no cada uno por su lado.

            Va como `button` y no como `div`: es el elemento que en la app real
            abre el menú de perfil, y en Fase 1 queda inerte igual que el botón
            Reclamar. Cuando llegue el frame del drawer (bloque 4) ya tiene su
            trigger.

            El fondo es una CAPA ABSOLUTA y no padding del propio botón: el
            header está medido al píxel y un `px-2` le cambiaría el ancho a la
            pill entera. Pinta debajo porque los dos hijos están posicionados
            —`UserAvatar` ya era `relative`— y el aire que deja es el de la
            pill: 4px arriba y abajo, medio gap a la izquierda. */}
        <button
          type="button"
          className="group relative flex cursor-pointer items-center gap-3 pr-3 text-left"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-y-1 -left-2 right-0 rounded-lg bg-surface-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
          <UserAvatar src={currentUser.avatarSrc} />
          <div className="relative flex flex-col justify-center gap-0.5">
            <p className="text-ui font-semibold text-foreground">{currentUser.name}</p>
            <div className="flex items-center gap-1">
              <Image
                src={currentUser.levelBadgeSrc}
                alt=""
                width={20}
                height={20}
                className="size-5 drop-shadow-badge"
              />
              <p className="text-xs font-semibold leading-5 text-brand">
                {currentUser.levelLabel}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
