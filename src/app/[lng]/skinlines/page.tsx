import { allowedLng, Langs, languages } from "@/data/constants";
import Skinlines from "@/app/[lng]/skinlines/skinlines";
import { getAddedSkins, local_fetch, LocalData } from "@/data/server";
import { Added, Champion, Skinline, Skins } from "@/types";
import { Common } from "@/components/layouts/common";
import NewAdditions from "@/components/new-additions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lng: allowedLng }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lng = (await params).lng as allowedLng;
  const skinlines = local_fetch<Langs<Skinline[]>>(LocalData.skinlines)[lng];

  return {
    title: "Skinlines",
    description:
      `Explore ` + skinlines.length + ` skinlines in League of Legends.`,
  };
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

type PageProps = {
  params: Promise<{ lng: string }>;
};

export default async function Page({ params }: PageProps) {
  const lng = (await params).lng as allowedLng;
  const skinlines = local_fetch<Langs<Skinline[]>>(LocalData.skinlines)[lng];
  const skins = local_fetch<Langs<Skins>>(LocalData.skins)[lng];
  const champions = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng];
  const added = local_fetch<Added>(LocalData.added);
  const addedSkins = getAddedSkins(added, skins, champions);
  const patch = local_fetch<{ [key: string]: string }>(
    LocalData.presistentVars,
  ).oldVersionString;
  return (
    <Common
      lng={lng}
      patch={patch}
      newAddidions={<NewAdditions lng={lng} addedSkins={addedSkins} />}
    >
      <div className="skinline-page">
        <Skinlines lng={lng} skinlines={skinlines} />
      </div>
    </Common>
  );
}
