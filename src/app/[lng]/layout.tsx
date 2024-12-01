import "@/styles/globals.scss";
import { ReactNode } from "react";
import { dir } from "i18next";
import { allowedLng, fallbackLng, languages } from "@/data/constants";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(
  params: Promise<{ lng: string }>,
): Promise<Metadata> {
  const lng = (await params).lng;

  return {
    title: {
      default: "Explore latest Skins, Champions, and more",
      template: "%s | League Fan",
    },
    description:
      "Explore the latest skins, champions, and more in League of Legends. Get the latest news, updates, and more.",
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
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>{children}</body>
    </html>
  );
}
