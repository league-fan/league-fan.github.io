import "@/styles/globals.scss";
import { ReactNode } from "react";
import { dir } from "i18next";
import { allowedLng, fallbackLng, languages, ROOT } from "@/data/constants";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { languageZoneToBCP47 } from "@/types/languagezone";
import { poppins } from "../fonts";

export async function generateMetadata(
  params: Promise<{ lng: allowedLng }>,
): Promise<Metadata> {
  const lng = (await params).lng;

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
      languages: Object.fromEntries(
        languages.map((lng) => [languageZoneToBCP47[lng], `/${lng}/champions`]),
      ),
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
    <html lang={lng} dir={dir(lng)} className={poppins.className}>
      <head />
      <body>{children}</body>
    </html>
  );
}
