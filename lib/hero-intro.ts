import { hero } from "@/lib/data/hero";
import { settleIntroSound } from "@/lib/sfx";

export type IntroPhase = "pending" | "reveal";

const INTRO_ATTRIBUTE = "data-intro";
const STARTED_ATTRIBUTE = "data-intro-started";
const RUN_ATTRIBUTE = "data-intro-run";
const START_DEADLINE_MS = 2000;
const FAILSAFE_MS = 7000;

const defaultSlide = hero.slides[hero.activeSlide];
const hasIntro = defaultSlide.framing === "loop" && Boolean(defaultSlide.loop.intro);

let withSound = false;

export const hasHeroIntro = hasIntro;

export const introBootScript = hasIntro
  ? `(function(){try{
var d=document.documentElement;
if(location.pathname!=="/"||location.hash)return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var c=navigator.connection;if(c&&c.saveData)return;
d.setAttribute("${INTRO_ATTRIBUTE}","pending");
setTimeout(function(){if(!d.hasAttribute("${STARTED_ATTRIBUTE}"))d.removeAttribute("${INTRO_ATTRIBUTE}")},${START_DEADLINE_MS});
setTimeout(function(){if(!d.hasAttribute("${RUN_ATTRIBUTE}"))d.removeAttribute("${INTRO_ATTRIBUTE}")},${FAILSAFE_MS});
}catch(e){}})();`
  : "";

export function readIntroPhase(): IntroPhase | null {
  const value = document.documentElement.getAttribute(INTRO_ATTRIBUTE);
  return value === "pending" || value === "reveal" ? value : null;
}

export const readIntroStarted = () => document.documentElement.hasAttribute(STARTED_ATTRIBUTE);

export const readIntroRun = () => Number(document.documentElement.getAttribute(RUN_ATTRIBUTE) ?? 0);

export function subscribeIntroPhase(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [INTRO_ATTRIBUTE, STARTED_ATTRIBUTE, RUN_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

export function markIntroStarted() {
  document.documentElement.setAttribute(STARTED_ATTRIBUTE, "");
}

export function revealIntro() {
  if (readIntroPhase() === "pending") {
    document.documentElement.setAttribute(INTRO_ATTRIBUTE, "reveal");
  }
}

export function endIntro(skipped = false) {
  if (withSound) settleIntroSound(skipped);
  withSound = false;
  document.documentElement.removeAttribute(INTRO_ATTRIBUTE);
}

export const isIntroWithSound = () => withSound;

export function replayIntroWithSound() {
  if (!hasIntro) return;
  withSound = true;
  const root = document.documentElement;
  root.setAttribute(RUN_ATTRIBUTE, String(readIntroRun() + 1));
  root.setAttribute(INTRO_ATTRIBUTE, "pending");
}
