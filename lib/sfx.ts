import {
  musicConfig,
  musicTracks,
  sfxConfig,
  sfxSlotNames,
  sfxSlots,
  type MusicTrack,
  type SfxFormat,
  type SfxLane,
  type SfxSlot,
} from "@/lib/data/sfx";
import { DESKTOP_MIN_WIDTH } from "@/lib/desktop-zoom";
import { prefersReducedMotion } from "@/lib/motion";

export type SfxEvent = "state" | "play" | "music";
export type SfxPlayOptions = { rate?: number; stack?: boolean; gain?: number; offset?: number };
export type MusicState = "off" | "armed" | "playing";

type Voice = { source: AudioBufferSourceNode; gain: GainNode; end: number };
type KeepAlive = { tone: OscillatorNode; level: GainNode };
type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
type NetworkInformation = { saveData?: boolean };

type MusicVoice = {
  track: MusicTrack;
  gain: GainNode;
  ready: Promise<boolean>;
  position: () => number;
  pause: () => void;
  resume: () => void;
  abandon: () => void;
  stop: () => void;
};
type MusicPlayOptions = { offset?: number; fadeIn?: number; fadeOut?: number; level?: number };
type StreamSource = { element: HTMLAudioElement; node: MediaElementAudioSourceNode; owner: number };

const listeners = new Set<(event: SfxEvent) => void>();
const encoded = new Map<SfxSlot, Promise<ArrayBuffer | null>>();
const decoding = new Map<SfxSlot, Promise<AudioBuffer | null>>();
const decoded = new Map<SfxSlot, AudioBuffer>();
const lanes = new Map<SfxLane, Voice>();
const musicBuffers = new Map<MusicTrack, Promise<AudioBuffer | null>>();
const streams = new Map<MusicTrack, StreamSource>();

let enabled: boolean | null = null;
let musicEnabled: boolean | null = null;
let musicLevel: number | null = null;
let context: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: { level: GainNode; duck: GainNode } | null = null;
let musicVoice: MusicVoice | null = null;
let musicIsIntro = false;
let musicGestured = false;
let introClock: (() => number) | null = null;
let introPending: () => boolean = () => false;
let bridgeTimer: ReturnType<typeof setInterval> | undefined;
let desktopMedia: MediaQueryList | null = null;
let voices: Voice[] = [];
let lastHoverAt = Number.NEGATIVE_INFINITY;
let preloadScheduled = false;
let suspendTimer: ReturnType<typeof setTimeout> | undefined;
let attachments = 0;
let keepAlive: KeepAlive | null = null;
let keepAliveTimer: ReturnType<typeof setTimeout> | undefined;
let lastActivityAt = 0;
let detachWindow: (() => void) | null = null;

const inBrowser = () => typeof window !== "undefined";
const noop = () => {};
const settle = (result: Promise<void> | undefined) => {
  if (result && typeof result.then === "function") result.catch(noop);
};
const spread = () => Math.random() * 2 - 1;

const emit = (event: SfxEvent) => listeners.forEach((listener) => listener(event));

const readStoredPreference = (key: string) => {
  try {
    return localStorage.getItem(key) !== "off";
  } catch {
    return true;
  }
};

const storePreference = (key: string, value: boolean) => {
  try {
    localStorage.setItem(key, value ? "on" : "off");
  } catch {}
};

const reflectPreference = (value: boolean) => {
  document.documentElement.dataset.sound = value ? "on" : "off";
};

const reflectMusicPreference = (value: boolean) => {
  document.documentElement.dataset.music = value ? "on" : "off";
};

const clampLevel = (value: number) =>
  Math.min(musicConfig.levelMax, Math.max(0, Math.round(value * 1000) / 1000));

const readStoredLevel = () => {
  try {
    const stored = Number.parseFloat(localStorage.getItem(musicConfig.levelStorageKey) ?? "");
    return Number.isFinite(stored) ? clampLevel(stored) : musicConfig.volume;
  } catch {
    return musicConfig.volume;
  }
};

const storeLevel = (value: number) => {
  try {
    localStorage.setItem(musicConfig.levelStorageKey, String(value));
  } catch {}
};

export function isSfxEnabled() {
  if (enabled === null) enabled = inBrowser() ? readStoredPreference(sfxConfig.storageKey) : true;
  return enabled;
}

export function isMusicEnabled() {
  if (musicEnabled === null) {
    musicEnabled = inBrowser() ? readStoredPreference(musicConfig.storageKey) : true;
  }
  return musicEnabled;
}

export function getMusicLevelSnapshot() {
  if (musicLevel === null) musicLevel = inBrowser() ? readStoredLevel() : musicConfig.volume;
  return musicLevel;
}

const anySoundEnabled = () => isSfxEnabled() || isMusicEnabled();

export const getSfxEnabledSnapshot = isSfxEnabled;

export const getMusicSnapshot = (): MusicState =>
  !isMusicEnabled() ? "off" : musicVoice ? "playing" : "armed";

export function subscribeSfx(listener: (event: SfxEvent) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const assetUrl = (file: string, format: SfxFormat) => `${sfxConfig.basePath}/${file}.${format}`;

const fetchEncoded = (file: string, format: SfxFormat): Promise<ArrayBuffer | null> =>
  fetch(assetUrl(file, format))
    .then((response) => (response.ok ? response.arrayBuffer() : null))
    .catch(() => null);

const decodeData = (audio: AudioContext, data: ArrayBuffer) =>
  new Promise<AudioBuffer>((resolve, reject) => {
    try {
      const result = audio.decodeAudioData(data, resolve, reject);
      if (result) result.then(resolve, reject);
    } catch (error) {
      reject(error);
    }
  });

const decodeFrom = (audio: AudioContext, data: ArrayBuffer | null) =>
  data ? decodeData(audio, data).catch(() => null) : Promise.resolve(null);

const decodeWithFallback = (audio: AudioContext, file: string, primary: Promise<ArrayBuffer | null>) =>
  primary
    .then((data) => decodeFrom(audio, data))
    .then(
      (buffer) =>
        buffer ?? fetchEncoded(file, sfxConfig.fallbackFormat).then((data) => decodeFrom(audio, data)),
    );

function decodeSlot(slot: SfxSlot): Promise<AudioBuffer | null> {
  const pending = decoding.get(slot);
  if (pending) return pending;
  const audio = context;
  if (!audio) return Promise.resolve(null);
  if (!encoded.has(slot)) encoded.set(slot, fetchEncoded(slot, sfxConfig.primaryFormat));

  const job = decodeWithFallback(audio, slot, encoded.get(slot)!).then((buffer) => {
    if (buffer) {
      decoded.set(slot, buffer);
    } else {
      decoding.delete(slot);
      encoded.delete(slot);
    }
    return buffer;
  });
  decoding.set(slot, job);
  return job;
}

const decodeAll = () => sfxSlotNames.forEach((slot) => void decodeSlot(slot));

function startFetching() {
  sfxSlotNames.forEach((slot) => {
    if (!encoded.has(slot)) encoded.set(slot, fetchEncoded(slot, sfxConfig.primaryFormat));
  });
  if (context) decodeAll();
}

export function preloadSfx() {
  if (!inBrowser() || preloadScheduled) return;
  preloadScheduled = true;

  const whenIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startFetching, { timeout: sfxConfig.idleTimeoutMs });
    } else {
      setTimeout(startFetching, 0);
    }
  };

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

function resumeContext() {
  if (context && context.state !== "running" && !document.hidden) settle(context.resume());
}

function stopKeepAlive() {
  clearTimeout(keepAliveTimer);
  if (!keepAlive) return;
  try {
    keepAlive.tone.stop();
  } catch {}
  keepAlive.tone.disconnect();
  keepAlive.level.disconnect();
  keepAlive = null;
}

function watchIdle() {
  clearTimeout(keepAliveTimer);
  const left = lastActivityAt + sfxConfig.keepAliveIdleMs - performance.now();
  if (left <= 0) stopKeepAlive();
  else keepAliveTimer = setTimeout(watchIdle, left);
}

function startKeepAlive() {
  if (!context || keepAlive || !anySoundEnabled()) return;
  const tone = context.createOscillator();
  tone.frequency.value = sfxConfig.keepAliveHz;
  const level = context.createGain();
  level.gain.value = sfxConfig.keepAliveGain;
  tone.connect(level);
  level.connect(context.destination);
  tone.start();
  keepAlive = { tone, level };
  watchIdle();
}

function onActivity() {
  lastActivityAt = performance.now();
  if (!keepAlive) startKeepAlive();
}

function createContext() {
  const AudioContextClass = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    return new AudioContextClass({ latencyHint: "interactive" });
  } catch {
    try {
      return new AudioContextClass();
    } catch {
      return null;
    }
  }
}

export function unlockSfx() {
  if (!inBrowser() || !anySoundEnabled()) return;
  clearTimeout(suspendTimer);

  if (!context) {
    context = createContext();
    if (!context) return;
    master = context.createGain();
    master.gain.value = sfxConfig.masterGain;
    master.connect(context.destination);
    context.addEventListener("statechange", startBackgroundMusic);
    startFetching();
  }

  resumeContext();
  onActivity();
}

function unlockFromGesture() {
  unlockSfx();
  musicGestured = true;
  startBackgroundMusic();
}

function fadeOut(voice: Voice, now: number) {
  const stopAt = now + sfxConfig.laneFadeOutMs / 1000;
  try {
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, stopAt);
    voice.source.stop(stopAt);
  } catch {}
  voice.end = Math.min(voice.end, stopAt);
}

function fire(slot: SfxSlot, options: SfxPlayOptions) {
  const buffer = decoded.get(slot);
  if (!context || !master || !buffer) return false;

  const config = sfxSlots[slot];
  const now = context.currentTime;

  if (!options.stack) {
    const previous = lanes.get(config.lane);
    if (previous && previous.end > now) fadeOut(previous, now);
  }

  voices = voices.filter((voice) => voice.end > now);
  while (voices.length >= sfxConfig.maxVoices) {
    const oldest = voices.shift();
    if (oldest) fadeOut(oldest, now);
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  const rate = (options.rate ?? 1) * (1 + spread() * config.jitter);
  const offset = Math.min(Math.max(options.offset ?? 0, 0), buffer.duration);
  source.playbackRate.value = rate;

  const gain = context.createGain();
  const volume = config.volume * (options.gain ?? 1) * (1 + spread() * sfxConfig.volumeJitter);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + sfxConfig.fadeInMs / 1000);

  source.connect(gain);
  gain.connect(master);
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
  };
  source.start(now, offset);

  const voice: Voice = { source, gain, end: now + (buffer.duration - offset) / rate };
  if (!options.stack) lanes.set(config.lane, voice);
  voices.push(voice);

  if (config.lane === "route") duckMusic();
  emit("play");
  return true;
}

function request(requested: SfxSlot, options: SfxPlayOptions) {
  if (!inBrowser() || !isSfxEnabled()) return false;
  const audio = context;
  if (!audio || document.hidden) return false;

  const slot = (requested === "route" || requested === "back") && prefersReducedMotion() ? "click" : requested;

  if (slot === "hover") {
    const at = performance.now();
    if (at - lastHoverAt < sfxConfig.hoverLimitMs) return false;
    const playing = lanes.get("hover");
    if (playing && playing.end > audio.currentTime) return false;
    lastHoverAt = at;
  }

  if (audio.state === "running" && decoded.has(slot)) return fire(slot, options);

  const askedAt = performance.now();
  const resumed = audio.state === "running" ? null : Promise.resolve(audio.resume()).catch(noop);
  Promise.all([decodeSlot(slot), resumed]).then(() => {
    const waited = performance.now() - askedAt;
    if (waited > sfxConfig.latePlayMs) return;
    if (!isSfxEnabled() || document.hidden || audio.state !== "running") return;
    fire(slot, options.offset === undefined ? options : { ...options, offset: options.offset + waited / 1000 });
  });
  return true;
}

export const playSfx = (slot: SfxSlot, options: SfxPlayOptions = {}) => request(slot, options);

function scheduleSuspend() {
  clearTimeout(suspendTimer);
  suspendTimer = setTimeout(() => {
    if (!anySoundEnabled() && context) settle(context.suspend());
  }, sfxConfig.suspendAfterOffMs);
}

export function setSfxEnabled(value: boolean) {
  if (!inBrowser() || value === isSfxEnabled()) return;

  enabled = value;
  storePreference(sfxConfig.storageKey, value);
  reflectPreference(value);
  emit("state");

  if (value) {
    unlockSfx();
    return;
  }
  if (!anySoundEnabled()) {
    stopKeepAlive();
    scheduleSuspend();
  }
}

export const toggleSfx = () => setSfxEnabled(!isSfxEnabled());

const isDesktopViewport = () => {
  if (!desktopMedia) desktopMedia = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
  return desktopMedia.matches;
};

const savesData = () =>
  Boolean((navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData);

const musicAllowed = () =>
  inBrowser() && isMusicEnabled() && !savesData() && (!musicConfig.desktopOnly || isDesktopViewport());

function ensureMusicBus() {
  if (!context || !master) return null;
  if (!musicBus) {
    const level = context.createGain();
    level.gain.value = getMusicLevelSnapshot();
    level.connect(master);
    const duck = context.createGain();
    duck.connect(level);
    musicBus = { level, duck };
  }
  return musicBus;
}

function loadMusicBuffer(track: MusicTrack) {
  const audio = context;
  if (!audio) return Promise.resolve(null);
  const pending = musicBuffers.get(track);
  if (pending) return pending;
  const { file } = musicTracks[track];
  const job = decodeWithFallback(audio, file, fetchEncoded(file, sfxConfig.primaryFormat)).then((buffer) => {
    if (!buffer) musicBuffers.delete(track);
    return buffer;
  });
  musicBuffers.set(track, job);
  return job;
}

function streamFor(track: MusicTrack): StreamSource {
  const existing = streams.get(track);
  if (existing) return existing;
  const element = new Audio();
  element.preload = "auto";
  const playsWebm = element.canPlayType('audio/webm; codecs="opus"') !== "";
  element.src = assetUrl(musicTracks[track].file, playsWebm ? sfxConfig.primaryFormat : sfxConfig.fallbackFormat);
  const stream = { element, node: context!.createMediaElementSource(element), owner: 0 };
  streams.set(track, stream);
  return stream;
}

function bufferVoice(track: MusicTrack, offset: number, gain: GainNode, loop: boolean): MusicVoice {
  const audio = context!;
  let source: AudioBufferSourceNode | null = null;
  let abandoned = false;
  let startedAt = 0;
  let duration = 0;
  const ready = loadMusicBuffer(track).then((buffer) => {
    if (!buffer || abandoned) return false;
    source = audio.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(gain);
    const from = offset % buffer.duration;
    source.start(0, from);
    startedAt = audio.currentTime - from;
    duration = buffer.duration;
    return true;
  });
  return {
    track,
    gain,
    ready,
    position: () => (source ? (audio.currentTime - startedAt) % duration : offset),
    pause: noop,
    resume: noop,
    abandon: () => {
      abandoned = true;
    },
    stop: () => {
      abandoned = true;
      try {
        source?.stop();
      } catch {}
      source?.disconnect();
      gain.disconnect();
    },
  };
}

function streamVoice(track: MusicTrack, offset: number, gain: GainNode): MusicVoice {
  const stream = streamFor(track);
  const { element, node } = stream;
  const owner = stream.owner + 1;
  stream.owner = owner;
  let paused = false;
  element.pause();
  node.disconnect();
  node.connect(gain);
  const seek = () => {
    try {
      element.currentTime = offset;
    } catch {}
  };
  if (element.readyState >= 1) seek();
  else element.addEventListener("loadedmetadata", seek, { once: true });
  const play = () => element.play().then(() => true, () => false);
  return {
    track,
    gain,
    ready: play(),
    position: () => element.currentTime,
    pause: () => {
      paused = true;
      if (stream.owner === owner) element.pause();
    },
    resume: () => {
      if (paused && stream.owner === owner) settle(play().then(noop));
      paused = false;
    },
    abandon: noop,
    stop: () => {
      try {
        node.disconnect(gain);
      } catch {}
      if (stream.owner === owner) element.pause();
      gain.disconnect();
    },
  };
}

function rampMusic(voice: MusicVoice, to: number, seconds: number) {
  const audio = context!;
  const param = voice.gain.gain;
  const now = audio.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(to, now + Math.max(0.02, seconds));
}

function stopMusic(seconds = musicConfig.fadeOutSeconds, quiet = false) {
  clearInterval(bridgeTimer);
  const voice = musicVoice;
  musicVoice = null;
  musicIsIntro = false;
  if (!voice) return;
  voice.abandon();
  rampMusic(voice, 0, seconds);
  setTimeout(voice.stop, seconds * 1000 + 60);
  if (!quiet) emit("music");
}

function watchBridge(voice: MusicVoice) {
  const { bridge } = musicConfig;
  if (voice.track !== bridge.from) return;
  clearInterval(bridgeTimer);
  bridgeTimer = setInterval(() => {
    if (musicVoice !== voice) {
      clearInterval(bridgeTimer);
      return;
    }
    if (voice.position() < bridge.at) return;
    clearInterval(bridgeTimer);
    playMusic(bridge.into, { offset: bridge.offset, fadeIn: bridge.fadeSeconds, fadeOut: bridge.fadeSeconds });
  }, 40);
}

function playMusic(track: MusicTrack, options: MusicPlayOptions = {}) {
  const bus = ensureMusicBus();
  if (!context || !bus || document.hidden) return;
  stopMusic(options.fadeOut ?? musicConfig.fadeOutSeconds, true);

  const gain = context.createGain();
  gain.gain.value = 0;
  gain.connect(bus.duck);
  const config = musicTracks[track];
  const offset = options.offset ?? 0;
  const voice =
    config.kind === "stream" ? streamVoice(track, offset, gain) : bufferVoice(track, offset, gain, config.loop);
  musicVoice = voice;
  voice.ready.then((ok) => {
    if (musicVoice !== voice) return;
    if (!ok) {
      stopMusic(0, true);
      emit("music");
      return;
    }
    rampMusic(voice, options.level ?? 1, options.fadeIn ?? musicConfig.fadeInSeconds);
  });
  watchBridge(voice);
  emit("music");
}

export function setIntroPendingProbe(probe: () => boolean) {
  introPending = probe;
}

export function setIntroClock(clock: () => number) {
  introClock = clock;
}

export const clearIntroClock = (clock: () => number) => {
  if (introClock === clock) introClock = null;
};

export const isIntroSoundPlaying = () => introClock !== null && musicVoice !== null;

export function startBackgroundMusic() {
  if (musicVoice) return;
  if (!musicGestured && context?.state !== "running") return;
  if (introClock) {
    playIntroSound(introClock());
    return;
  }
  if (introPending() || !musicAllowed()) return;
  playMusic(musicConfig.bridge.into);
}

function duckMusic() {
  if (!context || !musicBus || !musicVoice) return;
  const param = musicBus.duck.gain;
  const now = context.currentTime;
  param.cancelScheduledValues(now);
  param.setTargetAtTime(musicConfig.duckGain, now, musicConfig.duckAttackSeconds);
  param.setTargetAtTime(1, now + musicConfig.duckHoldMs / 1000, musicConfig.duckReleaseSeconds);
}

export function introSoundAllowed() {
  if (!inBrowser() || savesData()) return false;
  return isDesktopViewport() ? isMusicEnabled() : isSfxEnabled();
}

export function playIntroSound(atSeconds: number) {
  if (!introSoundAllowed()) return;
  unlockSfx();
  if (!context) return;
  const { introTrack, themeIntroOffset, themeLeadGain, introFadeInSeconds } = musicConfig;
  if (isDesktopViewport()) {
    playMusic(introTrack.desktop, {
      offset: themeIntroOffset + atSeconds,
      fadeIn: introFadeInSeconds,
      level: themeLeadGain,
    });
    musicIsIntro = false;
    return;
  }
  playMusic(introTrack.mobile, { offset: atSeconds, fadeIn: introFadeInSeconds });
  musicIsIntro = true;
}

export function settleIntroSound(skipped: boolean) {
  if (!musicIsIntro) return;
  stopMusic(skipped ? musicConfig.introSkipFadeSeconds : musicConfig.introEndFadeSeconds);
}

export function setMusicEnabled(value: boolean) {
  if (!inBrowser() || value === isMusicEnabled()) return;

  musicEnabled = value;
  storePreference(musicConfig.storageKey, value);
  reflectMusicPreference(value);

  if (value) {
    unlockSfx();
    startBackgroundMusic();
    emit("music");
    return;
  }
  stopMusic();
  emit("music");
  if (!anySoundEnabled()) {
    stopKeepAlive();
    scheduleSuspend();
  }
}

export const toggleMusic = () => setMusicEnabled(!isMusicEnabled());

function applyMusicLevel(value: number) {
  musicLevel = value;
  if (context && musicBus) {
    const param = musicBus.level.gain;
    param.cancelScheduledValues(context.currentTime);
    param.setTargetAtTime(value, context.currentTime, musicConfig.levelRampSeconds);
  }
}

export function setMusicLevel(requested: number) {
  if (!inBrowser()) return;
  const value = clampLevel(requested);
  if (value === getMusicLevelSnapshot()) return;
  applyMusicLevel(value);
  storeLevel(value);
  emit("music");
  if (value === 0) setMusicEnabled(false);
  else if (!isMusicEnabled()) setMusicEnabled(true);
}

export function toggleAllSound() {
  const next = !anySoundEnabled();
  setSfxEnabled(next);
  setMusicEnabled(next);
}

function onStorage(event: StorageEvent) {
  if (event.key === sfxConfig.storageKey) {
    const value = event.newValue !== "off";
    if (value === isSfxEnabled()) return;
    enabled = value;
    reflectPreference(value);
    emit("state");
  } else if (event.key === musicConfig.storageKey) {
    const value = event.newValue !== "off";
    if (value === isMusicEnabled()) return;
    musicEnabled = value;
    reflectMusicPreference(value);
    if (value) startBackgroundMusic();
    else stopMusic();
    emit("music");
  } else if (event.key === musicConfig.levelStorageKey) {
    const value = readStoredLevel();
    if (value === getMusicLevelSnapshot()) return;
    applyMusicLevel(value);
    emit("music");
  } else {
    return;
  }
  if (anySoundEnabled()) onActivity();
  else stopKeepAlive();
}

function onVisibilityChange() {
  if (!context) return;
  if (document.hidden) {
    musicVoice?.pause();
    settle(context.suspend());
  } else if (anySoundEnabled()) {
    resumeContext();
    musicVoice?.resume();
    onActivity();
  }
}

function onViewportChange() {
  if (!musicConfig.desktopOnly) return;
  if (isDesktopViewport()) startBackgroundMusic();
  else if (musicVoice && !musicIsIntro) stopMusic();
}

export function attachSfx() {
  if (!inBrowser()) return noop;
  attachments += 1;

  if (!detachWindow) {
    const gestures = ["pointerdown", "keydown", "touchend"] as const;
    const gestureOptions = { capture: true, passive: true };
    const activity = ["pointermove", "wheel", "touchstart"] as const;
    gestures.forEach((type) => window.addEventListener(type, unlockFromGesture, gestureOptions));
    activity.forEach((type) => window.addEventListener(type, onActivity, gestureOptions));
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("storage", onStorage);
    isDesktopViewport();
    desktopMedia?.addEventListener("change", onViewportChange);
    detachWindow = () => {
      gestures.forEach((type) => window.removeEventListener(type, unlockFromGesture, gestureOptions));
      activity.forEach((type) => window.removeEventListener(type, onActivity, gestureOptions));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
      desktopMedia?.removeEventListener("change", onViewportChange);
    };
  }

  preloadSfx();
  unlockSfx();
  startBackgroundMusic();

  let attached = true;
  return () => {
    if (!attached) return;
    attached = false;
    attachments -= 1;
    if (attachments === 0 && detachWindow) {
      detachWindow();
      detachWindow = null;
    }
  };
}
