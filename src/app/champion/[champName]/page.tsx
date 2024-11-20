import { championSkins } from "@/data2/helpers";
import { store } from "@/data2/store"


export async  function generateStaticParams() {
    const champions = store.patch.champions;
    console.log(champions)
    return champions.map((champ) => ({
        params: {
            champName: champ.name
        }
    }))
}

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    const champions = store.patch.champions;
    const champName = (await params).champName
    const champ = champions.find((champ) => champ.name.toLowerCase() === champName.toLowerCase())
    if (!champ) return <div>Champion not found</div>
    const skins = store.patch.skins;
    const champSkin = championSkins(champ.id, skins);
    return <textarea defaultValue={JSON.stringify(champSkin, null, 2)} />
}