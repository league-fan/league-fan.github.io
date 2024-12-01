import { allowedLng, Langs, languages } from "@/data/constants";
import SkinGridPage from "./skinGridPage";
import { Suspense } from "react";
import { local_fetch, LocalData } from "@/data/server";
import { Champion, Skinline, Skins, Universe } from "@/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: allowedLng }>;
}): Promise<Metadata> {
  const { lng } = await params;
  const defaultMetadata = {
    title: "Skins",
    description: "Explore all the skins in League of Legends",
  };
  // const tempMetadata = (s: string) => ({
  //   title: `${s} Skins`,
  //   description: `Explore all the skins for ${s} in League of Legends`,
  // });

  // if (!type || !id) {
  //   return defaultMetadata;
  // }
  // if (type === "champion") {
  //   const champion = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng].find(
  //     (champion) => champion.alias === id,
  //   );
  //   if (!champion) return defaultMetadata;
  //   else return tempMetadata(champion.name);
  // } else if (type === "skinline") {
  //   const skinline = local_fetch<Langs<Skinline[]>>(LocalData.skinlines)[lng].find(
  //     (skinline) => skinline.id.toString() === id,
  //   );
  //   if (!skinline) return defaultMetadata;
  //   else return tempMetadata(skinline.name);
  // } else if (type === "universe") {
  //   const universe = local_fetch<Langs<Universe[]>>(LocalData.universes)[lng].find(
  //     (universe) => universe.id.toString() === id,
  //   );
  //   if (!universe) return defaultMetadata
  //   else return tempMetadata(universe.name);
  // }

  return defaultMetadata;
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const lng = (await params).lng as allowedLng;
  const skinlines = local_fetch<Langs<Skinline[]>>(LocalData.skinlines)[lng];
  const skinsDict = local_fetch<Langs<Skins>>(LocalData.skins)[lng];
  const champions = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng];
  const universes = local_fetch<Langs<Universe[]>>(LocalData.universes)[lng];
  const skins = Object.values(skinsDict);
  const patch = local_fetch<{ [key: string]: string }>(
    LocalData.presistentVars,
  ).oldVersionString;

  return (
    <Suspense>
      <SkinGridPage
        patch={patch}
        lng={lng}
        skinlines={skinlines}
        skins={skins}
        champions={champions}
        universes={universes}
      />
    </Suspense>
  );
}
