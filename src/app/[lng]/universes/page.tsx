import Universes from "@/app/[lng]/universes/universes";
import { allowedLng, Langs, languages } from "@/data/constants";
import { getAddedSkins, local_fetch, LocalData } from "@/data/server";
import { Added, Champion, Skinline, Skins, Universe } from "@/types";
import { Common } from "@/layouts/common";
import NewAdditions from "@/components/new-additions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ lng: allowedLng }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const lng = (await params).lng as allowedLng;
  const universes = local_fetch<Langs<Universe[]>>(LocalData.universes)[lng];

  return {
    title: "Universes",
    description:
      `Explore ` + universes.length + ` universes in League of Legends.`,
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
  const universes = local_fetch<Langs<Universe[]>>(LocalData.universes)[lng];
  const skins = local_fetch<Langs<Skins>>(LocalData.skins)[lng];
  const champions = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng];
  const added = local_fetch<Added>(LocalData.added);
  const patch = local_fetch<{ [key: string]: string }>(
    LocalData.presistentVars,
  ).oldVersionString;

  const addedSkins = getAddedSkins(added, skins, champions);
  return (
    <Common
      lng={lng}
      patch={patch}
      newAddidions={<NewAdditions lng={lng} addedSkins={addedSkins} />}
    >
      <div className="universe-page">
        <Universes lng={lng} skinlines={skinlines} universes={universes} />
      </div>
    </Common>
  );
}
