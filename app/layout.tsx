import type { Metadata } from "next";
import { Anybody, Inter, Martian_Mono } from "next/font/google";
import "./globals.css";

/* Sustituto libre de Monument Extended. El eje wdth se fija en el token
   --font-display de globals.css (wdth 120, wght 900). */
const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/* Sustituto libre de KH Interference (mono, mayúsculas). wdth 75 en el token. */
const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sura Gaming",
  description: "Ecosistema gaming de LATAM: torneos, rankings, misiones y noticias.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${anybody.variable} ${martianMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
