import { languages } from "@/data/constants";
import { ChampionPage } from "./championPage";

export async function generateStaticParams() {
    const champs: {
        [key: string]: {
            name: string
        }[]
    } = await import("@/../.cache/champions.json").then((champs) => champs.default)
    return languages.map(lang => (
        champs[lang].map(champ => ({ champName: champ.name, lang }))
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