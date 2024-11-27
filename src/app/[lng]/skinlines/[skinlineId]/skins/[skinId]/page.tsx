import { Champion, Skinline, Skins } from "@/types";
import { languages } from "@/data/constants";



export async function generateStaticParams() {
    const champs = (await import("@/../.cache/champions.json").then((champs) => champs.default)) as { [key: string]: Champion[] };
    const skinlines = (await import("@/../.cache/skinlines.json").then((item) => item.default)) as { [key: string]: Skinline[] };
    const skins = (await import("@/../.cache/skins.json").then((item) => item.default)) as { [key: string]: Skins };
    const splitId = (id: number) => [Math.floor(id / 1000), id % 1000];
    const skinlineSkins = (id: number, skins: Skins, champions: Champion[]) => {
        return Object.values(skins)
            .filter((skin) => skin.skinLines?.some((line) => line.id === id))
            .sort((a, b) => {
                const aId = splitId(a.id)[0];
                const bId = splitId(b.id)[0];
                const aIndex = champions.findIndex((c) => c.id === aId);
                const bIndex = champions.findIndex((c) => c.id === bId);
                return aIndex - bIndex;
            });
    }

    const params = languages.map(lng => (
        skinlines[lng].map(sl =>
            skinlineSkins(sl.id, skins[lng], champs[lng])
                .map(skin => (
                    {
                        skinlineId: sl.id.toString(),
                        skinId: skin.id.toString(),
                        lng
                    }))
        ).flat(1))).flat(1);
    return params;
}

export default async function Page({
    params,
}: {
    params: Promise<{ lng: string, skinlineId: string }>
}) {
    const { lng, skinlineId } = (await params)
    return (
        <div>{lng}{skinlineId}</div>
    )
}