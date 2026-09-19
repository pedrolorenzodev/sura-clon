"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

/**
 * Tooltip de shadcn (estilo base-nova, sobre Base UI) re-estilado con nuestros
 * tokens. Los valores salen del tooltip del menú lateral de
 * `app.suragaming.com`: es el único lugar donde existe el elemento, porque el
 * Figma del rediseño no lo tiene (ver PRD § 6).
 *
 * Diferencias con lo que genera el CLI:
 * - `cn` se importa de `@/lib/utils`, no del paquete `cn`.
 * - Colores y geometría pasan a tokens del proyecto.
 * - Sin flecha: el tooltip de referencia no tiene. Se puede pedir con `arrow`.
 * - Solo fade: es la transición del elemento real (200ms), sin zoom ni slide.
 */

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  arrow = false,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> & {
    arrow?: boolean;
  }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 whitespace-nowrap rounded-xl border border-border bg-tooltip px-3 py-2 text-sm text-foreground shadow-nav",
            "duration-200 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
            className,
          )}
          {...props}
        >
          {children}
          {arrow && (
            <TooltipPrimitive.Arrow className="z-50 size-2.5 rotate-45 rounded-xs border border-border bg-tooltip data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2" />
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
