import { PropsContext } from "@/data/propsContext";
import { prepareCollection, SkinWithMeta } from "@/components/skin-viewer/helpers";
import { getChampionById, getSkinsOfChampionById, splitId } from "@/data/helpers";
import { Skin } from "@/types";
import { createContext, ReactNode, useContext } from "react";

interface SkinContextType {
    name: string;
    alias: string;
    skin: SkinWithMeta | null;
    prev: SkinWithMeta | null;
    next: SkinWithMeta | null;
    patch: string;
}

const value: SkinContextType = {
    name: "",
    alias: "",
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
        type?: 'champion' | 'skinline' | 'universe',
    }
}) {
    const { skins, champions, patch } = useContext(PropsContext);
    const type = value.type ?? 'champion'
    if (type === 'universe') {
        return
    } else if (type === 'skinline') {
        return
    } else {
        const champId = splitId(value.skin.id)[0]
        const champ = getChampionById(champId, champions) ?? champions[0]
        const champSkins = getSkinsOfChampionById(champId, skins)
        const currIdx = champSkins.findIndex(skin => skin.id === value.skin.id)
        const { skin, prev, next } = prepareCollection(currIdx, champSkins)
        const props: SkinContextType = {
            name: champ.name,
            alias: champ.alias,
            skin,
            prev,
            next,
            patch,
        }
        return <SkinContext.Provider value={props} > {children} </SkinContext.Provider>
    }
}

export { SkinContext, SkinProvider }