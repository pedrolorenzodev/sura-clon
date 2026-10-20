import type { MissionStatus } from "@/lib/supabase/missions";

export type MissionOption = {
  id: string;
  label: string;
};

export const missionTabs: MissionOption[] = [
  { id: "todas", label: "Todas" },
  { id: "sociales", label: "Sociales" },
  { id: "sura", label: "Sura" },
  { id: "eventos", label: "Eventos" },
];

export const missionFilters: MissionOption[] = [
  { id: "disponibles", label: "Disponibles" },
  { id: "completadas", label: "Completadas" },
  { id: "finalizadas", label: "Finalizadas" },
  { id: "todas", label: "Todas" },
];

export const MISSION_FILTER_STATUS: Record<string, MissionStatus | undefined> = {
  disponibles: "available",
  completadas: "completed",
  finalizadas: "ended",
};

export const MISSIONS_PER_PAGE = 16;

export const missionCopy = {
  subtitle: "Completa la misión y obtén los puntos:",
  subtitleMobile: "Completa la misión y obtén los puntos que te mostramos a continuación:",
  rewardLabel: "Conseguirás:",
  stepsTitle: "Pasos a seguir",
  play: "Jugar ahora",
  claim: "Reclamar",
  completed: "Completada",
  ended: "Finalizada",
};
