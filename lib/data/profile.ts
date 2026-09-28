import { medals, type Medal } from "@/lib/data/medals";
import { currentUser } from "@/lib/data/user";

export type ProfileMedalState = "claimed" | "claimable" | "locked";

export type ProfileMedal = Medal & { state: ProfileMedalState; reward: string; rewardPoints: number };

const CLAIMABLE = new Set(["devocion-diaria", "ranking"]);

export const MEDAL_REWARD_POINTS = 100;

export const profileMedals: ProfileMedal[] = medals.map((medal) => ({
  ...medal,
  state: medal.locked ? "locked" : CLAIMABLE.has(medal.id) ? "claimable" : "claimed",
  reward: `+${MEDAL_REWARD_POINTS}`,
  rewardPoints: MEDAL_REWARD_POINTS,
}));

export type ProfileField = {
  id: string;
  label: string;
  done?: boolean;
  reward?: string;
  showAvatar?: boolean;
  info?: string;
};

export const profileFields: ProfileField[] = [
  { id: "avatar", label: "Tu avatar", done: true, showAvatar: true },
  { id: "usuario", label: `Usuario: ${currentUser.name}`, done: true },
  { id: "nombre", label: "Nombre", reward: "+20" },
  { id: "apellido", label: "Apellido", reward: "+20" },
  { id: "nacimiento", label: "Fecha de nacimiento", reward: "+20" },
  { id: "pais", label: "País", reward: "+20", info: "Lo usamos para mostrarte los eventos de tu región." },
  { id: "email", label: "Email: jmg1996@gmail.com" },
];

export const profileTabs = [
  { id: "medallas", label: "Medallas" },
  { id: "trofeos", label: "Trofeos" },
];

export const profileMobileTabs = [
  { id: "logros", label: "Logros" },
  { id: "perfil", label: "Mi Perfil" },
  { id: "referidos", label: "Referidos" },
];

export const referral = {
  label: "Referir a un amigo",
  copiedLabel: "Link copiado",
  shareText: "Sumate a Sura Gaming con mi link y ganamos SP los dos",
  copy: "Compartí tu link de referido. Cada amigo que complete su perfil te suma puntos a vos también.",
};

export const deleteAccount = {
  title: "Eliminar cuenta",
  email: "help@suragaming.com",
};

export const noTrophies = "Todavía no ganaste trofeos. Los vas a ver acá cuando termines tu primer torneo.";
