import type { StandingTone } from "@/lib/data/leaderboard";

type Tone = { row: string; rank: string; avatar: string; veil: string; rankHover: string };

const RANK_LIT = "group-hover:text-foreground group-focus-visible:text-foreground";

const TONE: Record<StandingTone, Tone> = {
  gold: {
    row: "bg-row-gold shadow-row-gold ring-1 ring-inset ring-gold-bright",
    rank: "text-rank-gold",
    avatar: "border border-gold-bright",
    veil: "bg-white/4",
    rankHover: "",
  },
  silver: {
    row: "bg-row-silver shadow-row-silver ring-1 ring-inset ring-silver-bright",
    rank: "text-rank-silver",
    avatar: "border border-silver-bright",
    veil: "bg-white/4",
    rankHover: "",
  },
  bronze: {
    row: "bg-row-bronze shadow-row-bronze ring-1 ring-inset ring-bronze",
    rank: "text-rank-bronze",
    avatar: "border border-bronze",
    veil: "bg-white/4",
    rankHover: "",
  },
  me: {
    row: "bg-surface ring-1 ring-inset ring-brand-vivid transition-shadow duration-200 hover:shadow-row-me focus-visible:shadow-row-me motion-reduce:transition-none",
    rank: "text-muted-foreground",
    avatar: "border border-border",
    veil: "inset-px rounded-[calc(var(--radius-lg)-1px)] bg-surface-2",
    rankHover: RANK_LIT,
  },
};

const PLAIN: Tone = {
  row: "border-gradient-row bg-surface",
  rank: "text-muted-foreground",
  avatar: "border border-border",
  veil: "bg-surface-2",
  rankHover: RANK_LIT,
};

export const toneOf = (tone?: StandingTone) => (tone ? TONE[tone] : PLAIN);
