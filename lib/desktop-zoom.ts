export const DESKTOP_MIN_WIDTH = 768;
export const DESKTOP_LAYOUT_WIDTH = 1100;

export const desktopZoomScript = `(function(){try{
var d=document.documentElement;
var range=window.matchMedia("(min-width: ${DESKTOP_MIN_WIDTH}px) and (max-width: ${DESKTOP_LAYOUT_WIDTH - 0.02}px)");
var fit=function(){
if(range.matches)d.style.setProperty("--desktop-zoom",String(d.clientWidth/${DESKTOP_LAYOUT_WIDTH}));
else d.style.removeProperty("--desktop-zoom");};
fit();range.addEventListener("change",fit);window.addEventListener("resize",fit);
}catch(e){}})();`;
