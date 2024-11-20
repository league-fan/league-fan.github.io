import { store } from "@/data2/store";
import { splitId } from "@/data2/helpers";
import { Skin } from "@/types";

export interface SkinWithKey extends Skin {
    $$key: string;
}

export async function prepareAdditions() {
    const { added, skins, champions } = store.patch;

    return added.skins
        .map((id) => skins[id])
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((skin) => {
            const cId = splitId(skin.id)[0];
            const champ = champions.find((c) => c.id === cId) || { key: "" };
            return { ...skin, $$key: champ.key };
        });
}
