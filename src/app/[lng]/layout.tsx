import "@/styles/globals.scss";
import { ReactNode } from "react";
import { allowedLng, fallbackLng, languages, ROOT } from "@/data/constants";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { languageZoneToBCP47 } from "@/types/languagezone";
import { poppins } from "../fonts";
import { GoogleAnalytics } from "@next/third-parties/google";

export function generateMetadata(): Metadata {
  const langdict = Object.fromEntries(
    languages.map((l) => [languageZoneToBCP47[l], `/${l}/champions`]),
  );

  return {
    title: {
      default: "Explore latest Skins, Champions, and more",
      template: "%s | League Fan",
    },
    description:
      "Explore the latest skins, champions, and more in League of Legends. Get the latest news, updates, and more.",
    generator: "Next.js",
    applicationName: "League Fan",
    keywords: [
      "League of Legends",
      "LOL",
      "Skins",
      "Champions",
      "Universe",
      "Skinline",
      "Riot Games",
      "Game",
    ],
    metadataBase: new URL(ROOT),
    alternates: {
      canonical: "/",
      languages: langdict,
    },
  };
}

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ lng: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const lng = (await params).lng;
  if (!languages.includes(lng as allowedLng)) {
    redirect(`/${fallbackLng}/champions`);
  }

  return (
    <html lang={lng} className={poppins.className}>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-BHM49VD1L8" />
    </html>
  );
}
