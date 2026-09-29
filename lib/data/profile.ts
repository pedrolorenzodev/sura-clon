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

export type ProfileFieldInput = "name" | "date" | "country" | "email";

export type ProfileField = {
  id: string;
  label: string;
  value?: string;
  done?: boolean;
  rewardPoints?: number;
  showAvatar?: boolean;
  info?: string;
  input?: ProfileFieldInput;
  placeholder?: string;
  autoComplete?: string;
};

export const PROFILE_FIELD_REWARD = 20;

export const profileFields: ProfileField[] = [
  { id: "avatar", label: "Tu avatar", done: true, showAvatar: true },
  { id: "usuario", label: "Usuario", value: currentUser.name, done: true },
  { id: "nombre", label: "Nombre", rewardPoints: PROFILE_FIELD_REWARD, input: "name", placeholder: "Tu nombre", autoComplete: "given-name" },
  { id: "apellido", label: "Apellido", rewardPoints: PROFILE_FIELD_REWARD, input: "name", placeholder: "Tu apellido", autoComplete: "family-name" },
  { id: "nacimiento", label: "Fecha de nacimiento", rewardPoints: PROFILE_FIELD_REWARD, input: "date", placeholder: "dd/mm/aaaa", autoComplete: "bday" },
  {
    id: "pais",
    label: "País",
    rewardPoints: PROFILE_FIELD_REWARD,
    info: "Lo usamos para mostrarte los eventos de tu región.",
    input: "country",
    placeholder: "Argentina",
    autoComplete: "country-name",
  },
  { id: "email", label: "Email", value: "jmg1996@gmail.com", done: true, input: "email", placeholder: "tu@email.com", autoComplete: "email" },
];

export const profileCountries = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
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
