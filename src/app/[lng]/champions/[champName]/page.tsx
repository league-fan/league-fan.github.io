import { languages } from "@/data/constants";
import { Champion } from "@/types";
import PageClient from "./pageClient";


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
    params: Promise<{ lng: string, champName: string }>
}) {
    const { lng, champName } = (await params)
    return (
        <PageClient params={{ lng, champName }} />
    )
}