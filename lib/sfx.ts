import { sfxConfig, sfxSlotNames, sfxSlots, type SfxFormat, type SfxLane, type SfxSlot } from "@/lib/data/sfx";
import { prefersReducedMotion } from "@/lib/motion";

export type SfxEvent = "state" | "play";
export type SfxPlayOptions = { rate?: number; stack?: boolean };

type Voice = { source: AudioBufferSourceNode; gain: GainNode; end: number };
type KeepAlive = { tone: OscillatorNode; level: GainNode };
type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

const listeners = new Set<(event: SfxEvent) => void>();
const encoded = new Map<SfxSlot, Promise<ArrayBuffer | null>>();
const decoding = new Map<SfxSlot, Promise<AudioBuffer | null>>();
const decoded = new Map<SfxSlot, AudioBuffer>();
const lanes = new Map<SfxLane, Voice>();

let enabled: boolean | null = null;
let context: AudioContext | null = null;
let master: GainNode | null = null;
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

const readStoredPreference = () => {
  try {
    return localStorage.getItem(sfxConfig.storageKey) !== "off";
  } catch {
    return true;
  }
};

const storePreference = (value: boolean) => {
  try {
    localStorage.setItem(sfxConfig.storageKey, value ? "on" : "off");
  } catch {}
};

const reflectPreference = (value: boolean) => {
  document.documentElement.dataset.sound = value ? "on" : "off";
};

export function isSfxEnabled() {
  if (enabled === null) enabled = inBrowser() ? readStoredPreference() : true;
  return enabled;
}

export const getSfxEnabledSnapshot = isSfxEnabled;

export function subscribeSfx(listener: (event: SfxEvent) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const sfxUrl = (slot: SfxSlot, format: SfxFormat) => `${sfxConfig.basePath}/${slot}.${format}`;

const fetchEncoded = (slot: SfxSlot, format: SfxFormat): Promise<ArrayBuffer | null> =>
  fetch(sfxUrl(slot, format))
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

function decodeSlot(slot: SfxSlot): Promise<AudioBuffer | null> {
  const pending = decoding.get(slot);
  if (pending) return pending;
  const audio = context;
  if (!audio) return Promise.resolve(null);
  if (!encoded.has(slot)) encoded.set(slot, fetchEncoded(slot, sfxConfig.primaryFormat));
  const source = encoded.get(slot)!;

  const job = source
    .then((data) => decodeFrom(audio, data))
    .then(
      (buffer) =>
        buffer ?? fetchEncoded(slot, sfxConfig.fallbackFormat).then((data) => decodeFrom(audio, data)),
    )
    .then((buffer) => {
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
  if (!context || keepAlive || !isSfxEnabled()) return;
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

export function unlockSfx() {
  if (!inBrowser() || !isSfxEnabled()) return;
  clearTimeout(suspendTimer);

  if (!context) {
    const AudioContextClass = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      context = new AudioContextClass({ latencyHint: "interactive" });
    } catch {
      try {
        context = new AudioContextClass();
      } catch {
        return;
      }
    }
    master = context.createGain();
    master.gain.value = sfxConfig.masterGain;
    master.connect(context.destination);
    startFetching();
  }

  resumeContext();
  onActivity();
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
  source.playbackRate.value = rate;

  const gain = context.createGain();
  const volume = config.volume * (1 + spread() * sfxConfig.volumeJitter);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + sfxConfig.fadeInMs / 1000);

  source.connect(gain);
  gain.connect(master);
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
  };
  source.start(now);

  const voice: Voice = { source, gain, end: now + buffer.duration / rate };
  if (!options.stack) lanes.set(config.lane, voice);
  voices.push(voice);

  emit("play");
  return true;
}

function request(requested: SfxSlot, options: SfxPlayOptions, force: boolean) {
  if (!inBrowser()) return false;
  if (!force && !isSfxEnabled()) return false;
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
    if (performance.now() - askedAt > sfxConfig.latePlayMs) return;
    if ((!force && !isSfxEnabled()) || document.hidden || audio.state !== "running") return;
    fire(slot, options);
  });
  return true;
}

export const playSfx = (slot: SfxSlot, options: SfxPlayOptions = {}) => request(slot, options, false);

export function setSfxEnabled(value: boolean) {
  if (!inBrowser() || value === isSfxEnabled()) return;

  if (value) {
    enabled = true;
    storePreference(true);
    reflectPreference(true);
    emit("state");
    unlockSfx();
    request("on", {}, false);
    return;
  }

  request("off", {}, true);
  enabled = false;
  storePreference(false);
  reflectPreference(false);
  emit("state");
  stopKeepAlive();
  clearTimeout(suspendTimer);
  suspendTimer = setTimeout(() => {
    if (!isSfxEnabled() && context) settle(context.suspend());
  }, sfxConfig.suspendAfterOffMs);
}

export const toggleSfx = () => setSfxEnabled(!isSfxEnabled());

function onStorage(event: StorageEvent) {
  if (event.key !== sfxConfig.storageKey) return;
  const value = event.newValue !== "off";
  if (value === isSfxEnabled()) return;
  enabled = value;
  reflectPreference(value);
  emit("state");
  if (value) onActivity();
  else stopKeepAlive();
}

function onVisibilityChange() {
  if (!context) return;
  if (document.hidden) settle(context.suspend());
  else if (isSfxEnabled()) {
    resumeContext();
    onActivity();
  }
}

export function attachSfx() {
  if (!inBrowser()) return noop;
  attachments += 1;

  if (!detachWindow) {
    const gestures = ["pointerdown", "keydown", "touchend"] as const;
    const gestureOptions = { capture: true, passive: true };
    const activity = ["pointermove", "wheel", "touchstart"] as const;
    gestures.forEach((type) => window.addEventListener(type, unlockSfx, gestureOptions));
    activity.forEach((type) => window.addEventListener(type, onActivity, gestureOptions));
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("storage", onStorage);
    detachWindow = () => {
      gestures.forEach((type) => window.removeEventListener(type, unlockSfx, gestureOptions));
      activity.forEach((type) => window.removeEventListener(type, onActivity, gestureOptions));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
    };
  }

  preloadSfx();
  if (navigator.userActivation?.hasBeenActive) unlockSfx();

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
