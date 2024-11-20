import { getChampionSkinsById, getChampionByName } from "@/data/helpers";
import { useContext } from "react";
import { PropsContext } from "../../../props";

// export async function generateStaticParams() {
//     const { champions, lang } = useContext(PropsContext);
//     return champions.map((champ) => ({
//         lang,
//         champName: champ.alias
//     }))
// }

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    const champName = (await params).champName
    const { champions, skins } = useContext(PropsContext);
    const champ = getChampionByName(champName, champions);
    if (!champ) return <div>Champion not found</div>
    const champSkin = getChampionSkinsById(champ.id, skins);
    return <div>{JSON.stringify(champSkin, null, 2)}</div>
}