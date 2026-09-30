const AWAY_ATTRIBUTE = "data-scrollbar-away";
const FAILSAFE_MS = 2500;
const SETTLE_FRAMES = 2;

let failsafe: number | undefined;
let wait = 0;

const root = () => document.documentElement;

export function showScrollbar() {
  window.clearTimeout(failsafe);
  cancelAnimationFrame(wait);
  root().removeAttribute(AWAY_ATTRIBUTE);
}

export function hideScrollbar() {
  cancelAnimationFrame(wait);
  root().setAttribute(AWAY_ATTRIBUTE, "");
  window.clearTimeout(failsafe);
  failsafe = window.setTimeout(showScrollbar, FAILSAFE_MS);
}

export function showScrollbarAfterTransition() {
  cancelAnimationFrame(wait);
  let frames = 0;
  const check = () => {
    frames += 1;
    if (frames > SETTLE_FRAMES && !root().matches(":active-view-transition")) {
      showScrollbar();
      return;
    }
    wait = requestAnimationFrame(check);
  };
  wait = requestAnimationFrame(check);
}
