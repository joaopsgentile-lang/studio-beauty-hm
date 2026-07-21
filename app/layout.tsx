import type { Metadata, Viewport } from "next";
import { Cormorant, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiobeautyhm.com.br"),
  title: {
    default: "StudioBeautyHM — Design de Sobrancelhas em Santa Bárbara D'Oeste",
    template: "%s | StudioBeautyHM",
  },
  description:
    "Estúdio de design de sobrancelhas em Santa Bárbara D'Oeste - SP. Design personalizado, henna, brow lamination e micropigmentação. Agende seu horário.",
  keywords: [
    "design de sobrancelhas",
    "Santa Bárbara D'Oeste",
    "brow lamination",
    "micropigmentação de sobrancelhas",
    "studio de sobrancelhas",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StudioBeautyHM — Design de Sobrancelhas",
    description:
      "Estúdio de design de sobrancelhas em Santa Bárbara D'Oeste - SP. Agende seu horário online.",
    url: "https://studiobeautyhm.com.br",
    siteName: "StudioBeautyHM",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
