export const sfxSlotNames = [
  "hover",
  "click",
  "select",
  "route",
  "back",
  "claim",
  "deny",
  "type",
] as const;

export type SfxSlot = (typeof sfxSlotNames)[number];

export type SfxLane = "hover" | "ui" | "route" | "reward" | "type";

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
  softHoverGain: number;
  routeSwapWaitMs: number;
};

export const musicTrackNames = ["theme", "calm", "intro"] as const;

export type MusicTrack = (typeof musicTrackNames)[number];

export type MusicTrackConfig =
  | { file: string; kind: "stream" }
  | { file: string; kind: "buffer"; loop: boolean };

export type MusicBridge = {
  from: MusicTrack;
  at: number;
  into: MusicTrack;
  offset: number;
  fadeSeconds: number;
};

export type MusicConfig = {
  storageKey: string;
  levelStorageKey: string;
  volume: number;
  levelMax: number;
  levelStep: number;
  levelRampSeconds: number;
  desktopOnly: boolean;
  fadeInSeconds: number;
  fadeOutSeconds: number;
  themeIntroOffset: number;
  themeLeadGain: number;
  bridge: MusicBridge;
  introTrack: { desktop: MusicTrack; mobile: MusicTrack };
  introFadeInSeconds: number;
  introEndFadeSeconds: number;
  introSkipFadeSeconds: number;
  duckGain: number;
  duckAttackSeconds: number;
  duckReleaseSeconds: number;
  duckHoldMs: number;
};

export const sfxSlots: Record<SfxSlot, SfxSlotConfig> = {
  hover: { volume: 0.12, lane: "hover", jitter: 0.04 },
  click: { volume: 0.15, lane: "ui", jitter: 0.03 },
  select: { volume: 0.2, lane: "ui", jitter: 0.02 },
  deny: { volume: 0.1, lane: "ui", jitter: 0.02 },
  route: { volume: 0.25, lane: "route", jitter: 0 },
  back: { volume: 0.26, lane: "route", jitter: 0 },
  claim: { volume: 0.24, lane: "reward", jitter: 0 },
  type: { volume: 0.07, lane: "type", jitter: 0.05 },
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
  softHoverGain: 0.6,
  routeSwapWaitMs: 5000,
};

export const musicTracks: Record<MusicTrack, MusicTrackConfig> = {
  theme: { file: "bgm-yi", kind: "stream" },
  calm: { file: "bgm-yi-calm", kind: "buffer", loop: true },
  intro: { file: "intro", kind: "buffer", loop: false },
};

export const musicConfig: MusicConfig = {
  storageKey: "sura-music",
  levelStorageKey: "sura-music-level",
  volume: 0.15,
  levelMax: 0.3,
  levelStep: 0.05,
  levelRampSeconds: 0.05,
  desktopOnly: true,
  fadeInSeconds: 2,
  fadeOutSeconds: 0.8,
  themeIntroOffset: 3.064,
  themeLeadGain: 0.84,
  bridge: { from: "theme", at: 11.52, into: "calm", offset: 10.11, fadeSeconds: 3 },
  introTrack: { desktop: "theme", mobile: "intro" },
  introFadeInSeconds: 0.5,
  introEndFadeSeconds: 1,
  introSkipFadeSeconds: 0.2,
  duckGain: 0.4,
  duckAttackSeconds: 0.05,
  duckReleaseSeconds: 0.1,
  duckHoldMs: 640,
};

export const isSfxSlot = (value: string | null): value is SfxSlot =>
  value !== null && (sfxSlotNames as readonly string[]).includes(value);
