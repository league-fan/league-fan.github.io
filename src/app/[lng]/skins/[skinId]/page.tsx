import { languages } from "@/data/constants";
import SkinPage from "./skinPage";
import { Champion, Skins } from "@/types";

export async function generateStaticParams() {
    const champs = (await import("@/../.cache/champions.json").then((champs) => champs.default)) as { [key: string]: Champion[] };
    const skins = (await import("@/../.cache/skins.json").then((skins) => skins.default)) as { [key: string]: Skins };
    const splitId = (id: number) => [Math.floor(id / 1000), id % 1000];
    const getSkinsOfChampionById = (champId: number, skins: Skins) => Object.values(skins).filter((skin) => splitId(skin.id)[0] === champId);

    const params = languages.map(lng => (
        champs[lng].map(champ => getSkinsOfChampionById(champ.id, skins[lng]).map(skin => ({ champName: champ.alias, skinId: skin.id.toString(), lng }))
        ).flat(1))).flat(1);
    return params;
}

export default async function Page({
    params,
}: {
    params: Promise<{ lng: string, champName: string, skinId: string }>
}) {
    const { lng, skinId } = await params;
    return (
        <>
            <SkinPage params={{ lng, skinId }} />
        </>
    )
}