import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { introBootScript } from "@/lib/hero-intro";

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

const description = "Ecosistema gaming de LATAM: torneos, rankings, misiones y noticias.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sura-clon.vercel.app"),
  title: "Sura Gaming",
  description,
  openGraph: {
    type: "website",
    siteName: "Sura Gaming",
    title: "Sura Gaming",
    description,
    locale: "es_AR",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sura Gaming",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${monument.variable} ${khInterference.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {introBootScript && <script dangerouslySetInnerHTML={{ __html: introBootScript }} />}
      </head>
      <body className="mx-auto flex min-h-full w-full max-w-mobile flex-col desktop:max-w-none">{children}</body>
    </html>
  );
}
