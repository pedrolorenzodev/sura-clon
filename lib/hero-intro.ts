import { hero } from "@/lib/data/hero";

export type IntroPhase = "pending" | "reveal";

const INTRO_ATTRIBUTE = "data-intro";
const STARTED_ATTRIBUTE = "data-intro-started";
const STORAGE_KEY = "sura-hero-intro";
const START_DEADLINE_MS = 2000;
const FAILSAFE_MS = 7000;

const defaultSlide = hero.slides[hero.activeSlide];
const hasIntro = defaultSlide.framing === "loop" && Boolean(defaultSlide.loop.intro);

export const introBootScript = hasIntro
  ? `(function(){try{
var d=document.documentElement;
if(location.pathname!=="/"||location.hash)return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var c=navigator.connection;if(c&&c.saveData)return;
if(sessionStorage.getItem("${STORAGE_KEY}"))return;
sessionStorage.setItem("${STORAGE_KEY}","1");
d.setAttribute("${INTRO_ATTRIBUTE}","pending");
setTimeout(function(){if(!d.hasAttribute("${STARTED_ATTRIBUTE}"))d.removeAttribute("${INTRO_ATTRIBUTE}")},${START_DEADLINE_MS});
setTimeout(function(){d.removeAttribute("${INTRO_ATTRIBUTE}")},${FAILSAFE_MS});
}catch(e){}})();`
  : "";

export function readIntroPhase(): IntroPhase | null {
  const value = document.documentElement.getAttribute(INTRO_ATTRIBUTE);
  return value === "pending" || value === "reveal" ? value : null;
}

export function subscribeIntroPhase(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [INTRO_ATTRIBUTE],
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

export function endIntro() {
  document.documentElement.removeAttribute(INTRO_ATTRIBUTE);
}
