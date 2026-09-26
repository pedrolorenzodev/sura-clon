export const sfxSlotNames = [
  "hover",
  "click",
  "select",
  "route",
  "back",
  "claim",
  "tick",
  "deny",
  "on",
  "off",
] as const;

export type SfxSlot = (typeof sfxSlotNames)[number];

export type SfxLane = "hover" | "ui" | "route" | "reward" | "tick";

export type SfxSlotConfig = {
  volume: number;
  lane: SfxLane;
  jitter: number;
};

export type SfxFormat = "webm" | "m4a";

export type SfxConfig = {
  basePath: string;
  primaryFormat: SfxFormat;
  fallbackFormat: SfxFormat;
  storageKey: string;
  masterGain: number;
  maxVoices: number;
  volumeJitter: number;
  fadeInMs: number;
  laneFadeOutMs: number;
  hoverLimitMs: number;
  latePlayMs: number;
  idleTimeoutMs: number;
  suspendAfterOffMs: number;
  keepAliveGain: number;
  keepAliveHz: number;
  keepAliveIdleMs: number;
};

export const sfxSlots: Record<SfxSlot, SfxSlotConfig> = {
  hover: { volume: 0.16, lane: "hover", jitter: 0.04 },
  click: { volume: 0.42, lane: "ui", jitter: 0.03 },
  select: { volume: 0.5, lane: "ui", jitter: 0.02 },
  deny: { volume: 0.5, lane: "ui", jitter: 0.02 },
  on: { volume: 0.45, lane: "ui", jitter: 0 },
  off: { volume: 0.45, lane: "ui", jitter: 0 },
  route: { volume: 0.55, lane: "route", jitter: 0 },
  back: { volume: 0.55, lane: "route", jitter: 0 },
  claim: { volume: 0.8, lane: "reward", jitter: 0 },
  tick: { volume: 0.2, lane: "tick", jitter: 0 },
};

export const sfxConfig: SfxConfig = {
  basePath: "/assets/sfx",
  primaryFormat: "webm",
  fallbackFormat: "m4a",
  storageKey: "sura-sound",
  masterGain: 0.9,
  maxVoices: 6,
  volumeJitter: 0.06,
  fadeInMs: 4,
  laneFadeOutMs: 18,
  hoverLimitMs: 110,
  latePlayMs: 500,
  idleTimeoutMs: 2000,
  suspendAfterOffMs: 1500,
  keepAliveGain: 0.0001,
  keepAliveHz: 30,
  keepAliveIdleMs: 300000,
};

export const isSfxSlot = (value: string | null): value is SfxSlot =>
  value !== null && (sfxSlotNames as readonly string[]).includes(value);
