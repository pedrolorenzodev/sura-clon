import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const monument = localFont({
  src: "./fonts/MonumentExtended-Ultrabold.ttf",
  variable: "--font-monument",
  weight: "900",
  display: "swap",
});

const khInterference = localFont({
  src: "./fonts/KHInterferenceTRIAL-Regular.otf",
  variable: "--font-kh",
  weight: "400",
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
      className={`${monument.variable} ${khInterference.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
