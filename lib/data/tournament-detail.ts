import { rotate, seeded } from "@/lib/collection";
import type { DetailArt } from "@/lib/data/detail-art";
import { ME, MY_PLAYER_ID, standings, type Standing } from "@/lib/data/leaderboard";
import { tournaments, type Tournament } from "@/lib/data/tournaments";

export type TournamentDetail = Tournament & {
  art: DetailArt;
  bannerSrc: string;
  startsInSeconds: number;
  joined: number;
  capacity: number;
};

const FEATURED_IDS = ["contenders-training-center-110", "fortnite-tournament"];

function detailFromTournament(tournament: Tournament): TournamentDetail {
  const noise = seeded(`${tournament.id}:detail`);
  const players = tournament.badges.find((badge) => badge.icon === "players")?.label ?? "0/0";
  const [joined, capacity] = players.split("/").map(Number);
  const featured = FEATURED_IDS.some((id) => tournament.id.startsWith(id));
  const heroSrc = featured ? "/assets/tournaments/detail/hero-fortnite.webp" : tournament.imageSrc;

  return {
    ...tournament,
    badges: tournament.badges.map((badge) =>
      badge.icon === "players" ? { ...badge, label: `${capacity} participantes` } : badge,
    ),
    art: {
      desktop: heroSrc,
      mobile: heroSrc,
      className: featured ? "inset-0 size-full desktop:-translate-y-[29.75%]" : "inset-0 size-full",
    },
    bannerSrc: featured ? "/assets/tournaments/detail/banner-fortnite.webp" : tournament.imageSrc,
    startsInSeconds: 3600 + Math.floor(noise() * 11 * 3600),
    joined,
    capacity,
  };
}

const details = new Map(tournaments.map((tournament) => [tournament.id, detailFromTournament(tournament)]));

export const tournamentDetailIds = [...details.keys()];

export const getTournamentDetail = (id: string) => details.get(id);

export const tournamentSponsors = [
  { name: "Oculus", src: "/assets/tournaments/detail/sponsor-oculus.webp", width: 159, height: 48, className: "h-6", dim: true },
  { name: "Activision", src: "/assets/tournaments/detail/sponsor-activision.webp", width: 165, height: 40, className: "h-5", dim: true },
  { name: "Red Bull", src: "/assets/tournaments/detail/sponsor-redbull.svg", width: 42, height: 24, className: "h-6", dim: false },
  { name: "Valve", src: "/assets/tournaments/detail/sponsor-valve.webp", width: 128, height: 40, className: "h-5", dim: true },
  { name: "Acer", src: "/assets/tournaments/detail/sponsor-acer.webp", width: 119, height: 40, className: "h-5", dim: true },
  { name: "Riot Games", src: "/assets/tournaments/detail/sponsor-riot.webp", width: 143, height: 40, className: "h-5", dim: true },
];

export const tournamentDescription = [
  {
    heading: "Noches de Juego de SURA",
    lines: ["Es el momento de unir a la comunidad. Únete a Discord y disfruta de horas de pura diversión, desafíos y muchas risas."],
  },
  {
    heading: "👉 ¿Cómo funciona?",
    lines: [
      "Cada noche hay un juego o modo diferente para que todos exploren.",
      "Todos pueden participar, sin importar su nivel.",
      "Las partidas son informales, pero siempre hay un ambiente competitivo saludable.",
      "El objetivo es simple: divertirse, conocer gente nueva y fortalecer la comunidad.",
      "💡 ¡Aporta energía, invita a tus amigos y ven a crear recuerdos con SURA! ¡Al fin y al cabo, es la noche de los gamers!",
    ],
  },
  {
    heading: "Reglas del evento",
    lines: [
      "Respeto ante todo 🎤 Prohibido usar malas palabras o comportamiento tóxico. Todos estamos aquí para divertirnos, así que mantén un ambiente relajado y agradable.",
      "Evita saturar el chat con spam 💬 Evita saturarlo con mensajes repetitivos, enlaces innecesarios o sonidos que interfieran con tu voz.",
      "Micrófono bajo control 🎧 Usa la función de pulsar para hablar o silencia el micrófono cuando no hables para evitar ruidos innecesarios.",
      "Deportividad 🏆 Ganar o perder es parte del juego. Valora la diversión, no solo la victoria.",
    ],
  },
];

export const tournamentFaqs = [
  {
    question: "¿Cómo me registro?",
    answer:
      "Si nunca jugaste tenés que ingresar al sitio, desde tu computadora o celular y registrarte. Podés hacerlo con tu cuenta de Google o bien con tus datos personales creando una cuenta en el sitio. Además, deberás definir el nombre de tu equipo de fantasía.",
  },
  {
    question: "¿Cómo sé si me inscribí?",
    answer:
      "Cuando te unís, el botón pasa a decir «Inscripto» y el contador de participantes suma tu lugar. También vas a aparecer en la lista de participantes del evento.",
  },
  {
    question: "¿Qué pasa si no me puedo inscribir?",
    answer:
      "Si el cupo está completo, el botón se desactiva. Podés anotarte en otro evento del mismo juego o escribirnos a help@suragaming.com.",
  },
];

export function tournamentPrizes(prize: string) {
  const [amount, unit] = prize.split(" ");
  const total = Number(amount);
  const shares = [1, 0.4, 0.2, 0.1, 0.08, 0.06, 0.04, 0.02, 0, 0];
  return shares.map((share, index) => ({
    position: index + 1,
    prize: share ? `${Math.max(1, Math.round(total * share))} ${unit}` : null,
  }));
}

export type TournamentParticipant = Pick<Standing, "id" | "name" | "avatarSrc" | "level">;

const OTHER_PLAYERS: TournamentParticipant[] = standings
  .filter((player) => player.id !== MY_PLAYER_ID)
  .map(({ id, name, avatarSrc, level }) => ({ id, name, avatarSrc, level }));

export const ME_AS_PARTICIPANT: TournamentParticipant = {
  id: ME.id,
  name: ME.name,
  avatarSrc: ME.avatarSrc,
  level: ME.level,
};

export function tournamentParticipants(tournament: TournamentDetail) {
  const offset = Math.floor(seeded(`${tournament.id}:participants`)() * OTHER_PLAYERS.length);
  return rotate(OTHER_PLAYERS, offset).slice(0, tournament.joined);
}

export const PARTICIPANTS_PER_PAGE = 10;
