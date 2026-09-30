import type { Metadata } from "next";
import Image from "next/image";

import { Header } from "@/components/layout/header";
import { RouteShell } from "@/components/layout/route-shell";
import { ProfileView } from "@/components/sections/profile-view";

export const metadata: Metadata = {
  title: "Mi perfil | Sura Gaming",
  description: "Tu perfil, tus medallas y tus datos en Sura Gaming.",
};

export default function ProfilePage() {
  return (
    <>
      <Header back />
      <RouteShell
        title="Mi perfil"
        backdrop={
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-profile-banner overflow-hidden desktop:block">
            <span className="absolute inset-0 bg-profile-banner-tint" />
            <Image
              src="/assets/profile/banner.webp"
              alt=""
              width={1024}
              height={576}
              priority
              className="absolute inset-0 size-full object-cover object-bottom opacity-30"
            />
            <span className="absolute inset-0 bg-profile-banner-fade" />
          </div>
        }
      >
        <ProfileView />
      </RouteShell>
    </>
  );
}
