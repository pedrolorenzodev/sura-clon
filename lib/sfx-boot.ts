import { sfxConfig } from "@/lib/data/sfx";

export const soundBootScript = `(function(){try{
document.documentElement.setAttribute("data-sound",localStorage.getItem("${sfxConfig.storageKey}")==="off"?"off":"on");
}catch(e){}})();`;
