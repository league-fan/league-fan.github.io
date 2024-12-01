import { allowedLng, Langs, languages } from "@/data/constants";
import SkinIdPage from "./skinIdPage";
import { Champion, Skin, Skinline, Skins, Universe } from "@/types";
import { Suspense } from "react";
import { local_fetch, LocalData, splitSkinId } from "@/data/server";
import NotFound from "@/components/notFound";
import { Popup } from "@/components/skin-viewer/popup";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: allowedLng; skinId: string }>;
}): Promise<Metadata> {
  const { lng, skinId } = await params;
  const tempMetadata = (skin: Skin, name: string) => ({
    title: `${skin.name}`,
    description: `Explore the ${skin.name} skin in League of Legends`,
  });
  const skin = local_fetch<Langs<Skins>>(LocalData.skins)[lng][skinId];

  return tempMetadata(skin, skin.name);
}

export async function generateStaticParams() {
  const skinsDict = local_fetch<Langs<Skins>>(LocalData.skins);
  const params = languages
    .map((lng) =>
      Object.keys(skinsDict[lng]).map((skinId) => ({ lng, skinId })),
    )
    .flat(1);
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lng: string; skinId: string }>;
}) {
  const lng = (await params).lng as allowedLng;
  const { skinId } = await params;
  const skinlines = local_fetch<Langs<Skinline[]>>(LocalData.skinlines)[lng];
  const skinsDict = local_fetch<Langs<Skins>>(LocalData.skins)[lng];
  const champions = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng];
  const universes = local_fetch<Langs<Universe[]>>(LocalData.universes)[lng];
  const skins = Object.values(skinsDict);
  const skin = skinsDict[skinId];
  const skinSkinlines = skinlines.filter((skinline) =>
    skin.skinLines?.flatMap((s) => s.id).includes(skinline.id),
  );
  let skinSkinlineSkins: { [key: string]: Skin[] } = {};
  for (let skinline of skinSkinlines) {
    skinSkinlineSkins[skinline.id] = skins.filter((skin) =>
      skin.skinLines?.flatMap((s) => s.id).includes(skinline.id),
    );
  }
  const skinChamp = champions.find(
    (c) => c.id === splitSkinId(skin.id).champId,
  );
  if (!skinChamp)
    return (
      <NotFound
        title="Champion not found"
        lng={lng}
        back={`/${lng}/champions`}
      />
    );
  const skinChampSkins =
    skins.filter((s) => splitSkinId(s.id).champId === skinChamp?.id) ?? [];
  const skinUniverse = universes.filter((u) =>
    skin.skinLines?.flatMap((s) => s.id).includes(u.id),
  );
  return (
    <>
      <Suspense>
        <SkinIdPage
          lng={lng}
          skin={skin}
          skinSkinlines={skinSkinlines}
          skinSkinlineSkins={skinSkinlineSkins}
          skinChamp={skinChamp}
          skinChampSkins={skinChampSkins}
          popup={
            <Popup
              lng={lng}
              skin={skin}
              skinChamp={skinChamp}
              skinSkinlines={skinSkinlines}
              skinUniverse={skinUniverse}
            />
          }
        />
      </Suspense>
    </>
  );
}
