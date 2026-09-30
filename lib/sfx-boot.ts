import { musicConfig, sfxConfig } from "@/lib/data/sfx";

export const soundBootScript = `(function(){try{
var d=document.documentElement;
d.setAttribute("data-sound",localStorage.getItem("${sfxConfig.storageKey}")==="off"?"off":"on");
d.setAttribute("data-music",localStorage.getItem("${musicConfig.storageKey}")==="off"?"off":"on");
}catch(e){}})();`;
