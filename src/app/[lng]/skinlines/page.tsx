import { allowedLng, Langs, languages } from "@/data/constants";
import Skinlines from "@/app/[lng]/skinlines/skinlines";
import { getAddedSkins, local_fetch, LocalData } from "@/data/server";
import { Added, Champion, Skinline, Skins } from "@/types";
import { Common } from "@/layouts/common";
import NewAdditions from "@/components/new-additions";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

type PageProps = {
    params: Promise<{ lng: string }>
}

export default async function Page({ params }: PageProps) {
    const lng = (await params).lng as allowedLng;
    const skinlines = local_fetch<Langs<Skinline[]>>(LocalData.skinlines)[lng];
    const skins = local_fetch<Langs<Skins>>(LocalData.skins)[lng];
    const champions = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng];
    const added = local_fetch<Added>(LocalData.added);
    const addedSkins = getAddedSkins(added, skins, champions);
    return (
        <Common lng={lng} newAddidions={(
            <NewAdditions lng={lng} addedSkins={addedSkins} />
        )}>
            <div className="skinline-page">
                <Skinlines lng={lng} skinlines={skinlines} />
            </div>
        </Common>
    )
}