import { allowedLng, Langs, languages } from "@/data/constants";
import SkinGridPage from "./skinGridPage";
import { Suspense } from "react";
import { local_fetch, LocalData } from "@/data/server";
import { Champion, Skinline, Skins, Universe } from "@/types";

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
