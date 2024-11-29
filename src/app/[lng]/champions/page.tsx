import NewAdditions from "@/components/new-additions";
import Champions from "./champions";
import { allowedLng, Langs, languages } from "@/data/constants";
import { Common } from "@/layouts/common";
import { Added, Champion, Skins } from "@/types";
import { getAddedSkins, local_fetch, LocalData } from "@/data/server";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

type PageProps = {
    params: Promise<{ lng: string }>
}

export default async function Page({ params }: PageProps) {
    const lng = (await params).lng as allowedLng;
    const skins = local_fetch<Langs<Skins>>(LocalData.skins)[lng];
    const champions = local_fetch<Langs<Champion[]>>(LocalData.champions)[lng];
    const added = local_fetch<Added>(LocalData.added);
    const patch = local_fetch<{ [key: string]: string }>(LocalData.presistentVars).oldVersionString;

    const addedSkins = getAddedSkins(added, skins, champions);

    return (
        <Common lng={lng} patch={patch} newAddidions={(
            <NewAdditions lng={lng} addedSkins={addedSkins} />
        )}>
            <div className="champions-page">
                <Champions lng={lng} champions={champions} />
            </div>
        </Common>
    )
}