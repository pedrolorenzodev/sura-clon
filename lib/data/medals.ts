export type MedalArt =
  | "devocion"
  | "social"
  | "first-victory"
  | "consistencia"
  | "point-collector"
  | "sharpshooter"
  | "event-master"
  | "influencer"
  | "ranking";

export type Medal = {
  id: string;
  label: string;
  art: MedalArt;
  locked: boolean;
  sparkle: boolean;
};

export const medals: Medal[] = [
  { id: "devocion-diaria", label: "Devoción diaria", art: "devocion", locked: false, sparkle: false },
  { id: "social-butterfly", label: "Social Butterfly", art: "social", locked: true, sparkle: false },
  { id: "first-victory", label: "First Victory", art: "first-victory", locked: false, sparkle: true },
  { id: "consistencia", label: "Consistencia", art: "consistencia", locked: true, sparkle: false },
  { id: "point-collector", label: "Point Collector", art: "point-collector", locked: false, sparkle: true },
  { id: "sharpshooter", label: "Sharpshooter", art: "sharpshooter", locked: true, sparkle: false },
  { id: "event-master", label: "Event Master", art: "event-master", locked: false, sparkle: true },
  { id: "influencer", label: "Influencer", art: "influencer", locked: true, sparkle: false },
  { id: "ranking", label: "Ranking", art: "ranking", locked: false, sparkle: false },
];
