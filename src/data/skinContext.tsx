import { PropsContext } from "@/data/propsContext";
import { prepareCollection, SkinWithMeta } from "@/components/skin-viewer/helpers";
import { getChampionById, getChampionByName, getSkinlineById, getSkinsOfChampionById, getSkinsOfSkinline, splitId } from "@/data/helpers";
import { Skin, Skinline } from "@/types";
import { createContext, ReactNode, useContext } from "react";

interface SkinContextType {
    name: string;
    skin: SkinWithMeta | null;
    prev: SkinWithMeta | null;
    next: SkinWithMeta | null;
    patch: string;
}

const value: SkinContextType = {
    name: "",
    skin: null,
    prev: null,
    next: null,
    patch: "",
}

const SkinContext = createContext<SkinContextType>(value);
SkinContext.displayName = "SkinContext";

function SkinProvider({
    children, value
}: {
    children: ReactNode,
    value: {
        skin: Skin;
        type?: 'champion' | 'skinline',
        id?: string;
    }
}) {
    const { skins, champions, skinlines, patch } = useContext(PropsContext);
    const type = value.type ?? 'champion'
    const id = value.id ?? (type === 'champion' ? champions[0].alias.toString() : skins[0].id.toString())
    let skinsSet: Skin[] = [];
    let name = '';
    let currIdx = 0;

    if (type === 'skinline') {
        const skinline = getSkinlineById(Number(id), skinlines) ?? skinlines[0];
        skinsSet = getSkinsOfSkinline(skinline.id, skins, champions)
        name = skinline.name;
    } else {
        const champ = getChampionByName(id, champions) ?? champions[0];
        skinsSet = getSkinsOfChampionById(champ.id, skins)
        name = champ.name;
    }

    currIdx = skinsSet.findIndex(skin => skin.id === value.skin.id)
    const { skin, prev, next } = prepareCollection(currIdx, skinsSet)
    const props: SkinContextType = {
        name,
        skin,
        prev,
        next,
        patch,
    }
    return <SkinContext.Provider value={props} > {children} </SkinContext.Provider>
}

export { SkinContext, SkinProvider }