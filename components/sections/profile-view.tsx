"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { UserAvatar } from "@/components/layout/user-avatar";
import { LevelPanel } from "@/components/sections/level-panel";
import { MedalCard } from "@/components/sections/medal-card";
import { ProfileFields } from "@/components/sections/profile-fields";
import { RouteTabs } from "@/components/sections/route-tabs";
import { SegmentedTabs } from "@/components/sections/segmented-tabs";
import { PlayerStats } from "@/components/sections/stat-pill";
import { MY_PLAYER_ID, playerProfile } from "@/lib/data/leaderboard";
import {
  deleteAccount,
  noTrophies,
  profileMedals,
  profileMobileTabs,
  profileTabs,
  referral,
  type ProfileMedal,
} from "@/lib/data/profile";
import { currentUser } from "@/lib/data/user";
import { claimReward, useDailyClaim } from "@/lib/use-daily-claim";
import { cn } from "@/lib/utils";

const ME = playerProfile(MY_PLAYER_ID)!;
const LEVEL_GOAL = Number(ME.levelGoal.replace(/\./g, ""));

const withThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const medalRewardId = (medal: ProfileMedal) => `medal:${medal.id}`;

export function ProfileView() {
  const { points, rewards } = useDailyClaim();
  const [tab, setTab] = useState("medallas");
  const [mobileTab, setMobileTab] = useState("perfil");

  const medals = profileMedals.map((medal) =>
    medal.state === "claimable" && rewards.includes(medalRewardId(medal)) ? { ...medal, state: "claimed" as const } : medal,
  );
  const obtained = medals.filter((medal) => medal.state !== "locked").length;
  const pointsLabel = withThousands(points);
  const progress = Math.min(1, points / LEVEL_GOAL);

  const tabs = profileTabs.map((item) =>
    item.id === "medallas"
      ? {
          ...item,
          badge: (
            <span className="rounded-full bg-brand px-1.5 py-0.5 font-techno text-xs leading-4 text-background">
              {obtained}
              <span className="text-border-done">/{medals.length}</span>
            </span>
          ),
        }
      : item,
  );

  const summary = (
    <div className="flex flex-col gap-4">
      <UserSummary points={pointsLabel} />
      <LevelPanel
        variant="profile"
        level={ME.level}
        nextLevel={ME.nextLevel}
        points={pointsLabel}
        goal={ME.levelGoal}
        progress={progress}
        segments={{ mobile: 20, desktop: 18 }}
        className="rounded-lg bg-surface-deep px-3.5 py-4"
      />
    </div>
  );

  return (
    <>
      <div className="hidden items-start gap-6 desktop:flex">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <RouteTabs items={tabs} value={tab} onChange={setTab} label="Tus logros" />
          {tab === "medallas" ? (
            <MedalShelf medals={medals} className="p-6" listClassName="gap-y-3 medal-gap-3.5" cellClassName="medal-row-5" />
          ) : (
            <p className="rounded-lg bg-surface-deep px-6 py-16 text-center text-sm text-muted-foreground">{noTrophies}</p>
          )}
        </div>

        <aside className="flex w-profile-aside shrink-0 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-3 rounded-xl bg-surface-deep p-3">
              {summary}
              <ReferButton />
            </section>
            <ProfileFields className="rounded-2xl bg-surface-deep p-4" />
          </div>
          <DeleteAccount />
        </aside>
      </div>

      <div className="flex flex-col gap-6 desktop:hidden">
        {summary}
        <SegmentedTabs items={profileMobileTabs} value={mobileTab} onChange={setMobileTab} label="Secciones de tu perfil" />

        {mobileTab === "logros" && (
          <MedalShelf medals={medals} className="p-3" listClassName="gap-y-2 medal-gap-2" cellClassName="medal-row-3" />
        )}
        {mobileTab === "perfil" && (
          <>
            <ProfileFields />
            <DeleteAccount />
          </>
        )}
        {mobileTab === "referidos" && (
          <section className="flex flex-col gap-4 rounded-xl bg-surface-deep p-4">
            <p className="text-sm text-muted-foreground">{referral.copy}</p>
            <ReferButton />
          </section>
        )}
      </div>
    </>
  );
}

function UserSummary({ points }: { points: string }) {
  return (
    <div className="flex items-center gap-4">
      <UserAvatar src={currentUser.avatarSrc} size={82} ringClassName="border-2 border-border" className="size-20.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-4.5">
        <h2 className="truncate font-techno text-player-name uppercase text-foreground">{currentUser.name}</h2>
        <PlayerStats points={points} medals={ME.medals} streak={ME.streak} className="flex flex-wrap items-center gap-2.5 desktop:gap-3" />
      </div>
    </div>
  );
}

function MedalShelf({
  medals,
  className,
  listClassName,
  cellClassName,
}: {
  medals: ProfileMedal[];
  className?: string;
  listClassName?: string;
  cellClassName?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-surface-deep", className)}>
      <ul className={cn("flex flex-wrap justify-center", listClassName)}>
        {medals.map((medal) => (
          <MedalCard
            key={medal.id}
            medal={{ ...medal, locked: medal.state === "locked", sparkle: medal.sparkle && medal.state !== "locked" }}
            variant="profile"
            onClaim={medal.state === "claimable" ? () => claimReward(medalRewardId(medal), medal.rewardPoints) : undefined}
            className={cellClassName}
          />
        ))}
      </ul>
    </div>
  );
}

function ReferButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/?ref=${MY_PLAYER_ID}`;
    if (navigator.share) {
      await navigator.share({ title: referral.shareText, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      data-sfx-hover
      data-sfx="click"
      className="wipe flex h-11.5 w-full cursor-pointer items-center justify-center gap-3 rounded-pill bg-border-dim px-8 font-techno text-base uppercase text-foreground ring-1 ring-inset ring-border-muted/50 transition-[box-shadow,translate] duration-200 hover:wipe-on focus-visible:wipe-on active:translate-y-px motion-reduce:transition-none"
    >
      {copied ? referral.copiedLabel : referral.label}
      {copied ? (
        <Check className="size-6 text-brand" strokeWidth={2} aria-hidden />
      ) : (
        <Image src="/assets/profile/share.svg" alt="" width={24} height={24} className="size-6" />
      )}
    </button>
  );
}

function DeleteAccount() {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-note text-danger">{deleteAccount.title}</h3>
      <div className="flex items-center gap-3">
        <a
          href={`mailto:${deleteAccount.email}`}
          aria-label={`Escribir a ${deleteAccount.email} para pedir la baja`}
          data-sfx-hover
          className="flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-danger transition-colors duration-200 hover:bg-danger/10 focus-visible:bg-danger/10 motion-reduce:transition-none"
        >
          <Image src="/assets/profile/trash.svg" alt="" width={20} height={20} className="size-5" />
        </a>
        <p className="text-xs text-muted-foreground">
          Para solicitar la baja de tu cuenta, deberás enviar un mail a{" "}
          <span className="font-semibold">{deleteAccount.email}</span> solicitando el formulario.
        </p>
      </div>
    </section>
  );
}
