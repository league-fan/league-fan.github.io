import { languages } from "@/data/constants";
import { ChampionPage } from "./championPage";
import { Champion } from "@/types";

export async function generateStaticParams() {
    const champs: {
        [key: string]: Champion[]
    } = await import("@/../.cache/champions.json").then((champs) => champs.default)
    return languages.map(lng => (
        champs[lng].map(champ => ({ champName: champ.alias, lng }))
    )).flat(1);
}

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    const champName = (await params).champName
    return (
        <ChampionPage champName={champName} />
    )
}