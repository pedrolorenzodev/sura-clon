export type FooterIcon = {
  id: string;
  label: string;
  iconSrc: string;
};

export type FooterLink = {
  id: string;
  label: string;
  icons?: FooterIcon[];
};

export type SocialGroup = {
  id: string;
  label: string;
  networks: FooterIcon[];
};

export type StoreBadge = {
  id: string;
  name: string;
  eyebrow: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  wordmarkSrc?: string;
};

const networks = (suffix: string): FooterIcon[] => [
  { id: `tiktok-${suffix}`, label: "TikTok", iconSrc: "/assets/home/footer/tiktok.svg" },
  { id: `x-${suffix}`, label: "X", iconSrc: "/assets/home/footer/x.svg" },
  { id: `youtube-${suffix}`, label: "YouTube", iconSrc: "/assets/home/footer/youtube.svg" },
  { id: `instagram-${suffix}`, label: "Instagram", iconSrc: "/assets/home/footer/instagram.svg" },
];

export const footerLinks: FooterLink[] = [
  { id: "about", label: "Sobre nosotros & Partnerships" },
  { id: "faq", label: "FAQ" },
  {
    id: "support",
    label: "Soporte:",
    icons: [
      { id: "email", label: "Soporte por correo", iconSrc: "/assets/home/footer/envelope.svg" },
      { id: "chat", label: "Soporte por chat", iconSrc: "/assets/home/footer/chats.svg" },
    ],
  },
  { id: "privacy", label: "Políticas de privacidad" },
];

export const storeBadges: StoreBadge[] = [
  {
    id: "google-play",
    name: "Google Play",
    eyebrow: "GET IT ON",
    iconSrc: "/assets/home/footer/playstore.svg",
    iconWidth: 17,
    iconHeight: 19,
    wordmarkSrc: "/assets/home/footer/google-play-wordmark.svg",
  },
  {
    id: "app-store",
    name: "App Store",
    eyebrow: "Download on the",
    iconSrc: "/assets/home/footer/apple.svg",
    iconWidth: 16,
    iconHeight: 19,
  },
];

export const socialGroups: SocialGroup[] = [
  { id: "pt", label: "Portugués:", networks: networks("pt") },
  { id: "es", label: "Español:", networks: networks("es") },
];

export const communityNetworks: FooterIcon[] = [
  { id: "discord", label: "Discord", iconSrc: "/assets/home/footer/discord.svg" },
  { id: "linkedin", label: "LinkedIn", iconSrc: "/assets/home/footer/linkedin.svg" },
];

export const legalNotice = "© 2026 Sura GG Corp. All rights reserved.";
