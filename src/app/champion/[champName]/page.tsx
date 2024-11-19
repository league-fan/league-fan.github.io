import { championSkins } from "@/data/helpers";
import { store } from "@/data/store"


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