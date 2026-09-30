import type { Metadata } from "next";
import { ViewTransition } from "react";

import { Header } from "@/components/layout/header";
import { MissingRouteMark } from "@/components/layout/missing-route-mark";
import { SiteChrome } from "@/components/layout/site-chrome";
import { LostArrival } from "@/components/sections/lost-arrival";
import { OffMap } from "@/components/sections/off-map";

export const metadata: Metadata = {
  title: "Página no encontrada | Sura Gaming",
  description: "La ruta que buscás no existe o se movió.",
};

export default function NotFound() {
  return (
    <SiteChrome>
      <MissingRouteMark />
      <Header solid back />
      <ViewTransition enter="route-in" exit="route-out" default="none">
        <LostArrival className="flex-1 overflow-x-clip px-route-gutter pb-route-edge pt-header-mobile desktop:px-route-edge desktop:pt-header-desktop">
          <OffMap />
        </LostArrival>
      </ViewTransition>
    </SiteChrome>
  );
}
