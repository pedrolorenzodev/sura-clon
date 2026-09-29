"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  side = "bottom",
  sideOffset = 8,
  className,
  ...props
}: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="isolate z-50 outline-none" align={align} side={side} sideOffset={sideOffset}>
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 flex max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-y-auto rounded-xl border border-border bg-tooltip p-1.5 text-foreground shadow-nav outline-none",
            "duration-150 ease-reveal data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-98 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-98 data-open:slide-in-from-top-1 motion-reduce:animate-none!",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

const ITEM =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-subtle-foreground outline-none select-none transition-colors duration-150 data-highlighted:bg-surface-2 data-highlighted:text-foreground motion-reduce:transition-none";

function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cn(ITEM, className)} {...props} />;
}

function DropdownMenuCheckboxItem({ className, children, ...props }: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(ITEM, "data-checked:text-foreground", className)}
      {...props}
    >
      <span className="flex size-4 shrink-0 items-center justify-center rounded-sm ring-1 ring-inset ring-border transition-colors duration-150 in-data-checked:bg-brand-vivid in-data-checked:ring-brand-vivid motion-reduce:transition-none">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-3 text-sp-foreground" strokeWidth={3} />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1.5 my-1.5 h-px bg-foreground/5", className)} {...props} />;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator };
