import Image from "next/image";

import { tournamentSponsors } from "@/lib/data/tournament-detail";
import { cn } from "@/lib/utils";

export function TournamentSponsors() {
  return (
    <section className="mt-12 flex flex-col items-center gap-5 py-3">
      <h2 className="font-techno text-sm uppercase text-foreground">Sponsors:</h2>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 desktop:gap-x-17.75">
        {tournamentSponsors.map((sponsor) => (
          <li key={sponsor.name} className="flex h-6 items-center">
            <Image
              src={sponsor.src}
              alt={sponsor.name}
              width={sponsor.width}
              height={sponsor.height}
              className={cn("w-auto", sponsor.className, sponsor.dim && "opacity-50")}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
