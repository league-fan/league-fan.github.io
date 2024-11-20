'use client';

import { PropsContext } from "@/app/props";
import { getChampionByName, getChampionSkinsById } from "@/data/client_helpers";
import { useContext } from "react";

export default function ChampionPage({ champName }: { champName: string }) {
    const { champions, skins } = useContext(PropsContext);
    const champ = getChampionByName(champName, champions);
    if (!champ) return <div>Champion not found</div>
    const champSkin = getChampionSkinsById(champ.id, skins);
    return <div>{JSON.stringify(champSkin, null, 2)}</div>
}

