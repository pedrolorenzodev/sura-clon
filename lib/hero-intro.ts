import { hero } from "@/lib/data/hero";
import { settleIntroSound, startBackgroundMusic } from "@/lib/sfx";

export type IntroPhase = "pending" | "reveal";

const INTRO_ATTRIBUTE = "data-intro";
const STARTED_ATTRIBUTE = "data-intro-started";
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
d.setAttribute("${INTRO_ATTRIBUTE}","pending");
var h=history,z={top:0,behavior:"instant"};h.scrollRestoration="manual";scrollTo(z);
function t(){if(d.getAttribute("${INTRO_ATTRIBUTE}")==="pending"){if(scrollY)scrollTo(z)}else removeEventListener("scroll",t)}
addEventListener("scroll",t,{passive:true});
function e(){d.removeAttribute("${INTRO_ATTRIBUTE}");h.scrollRestoration="auto"}
setTimeout(function(){if(!d.hasAttribute("${STARTED_ATTRIBUTE}"))e()},${START_DEADLINE_MS});
setTimeout(e,${FAILSAFE_MS});
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
    attributeFilter: [INTRO_ATTRIBUTE, STARTED_ATTRIBUTE],
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
  settleIntroSound(skipped);
  document.documentElement.removeAttribute(INTRO_ATTRIBUTE);
  history.scrollRestoration = "auto";
  startBackgroundMusic();
}
