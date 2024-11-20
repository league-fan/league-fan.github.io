import { Added, Champion, Skin, Skins } from "@/types";

export function splitId(id: number) {
    return [Math.floor(id / 1000), id % 1000];
}

export function getAddedSkins(added: Added, skins: Skins, champions: Champion[]) {
    return added.skins
        .map((id) => {
            if (!skins[id]) {
                console.error("Missing skin", id);
                return null;
            }
            return skins[id];
        })
        .filter((skin): skin is Skin => skin !== null)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((skin) => {
            if (!skin.id) {
                console.error("Missing skin id", skin);
            }
            const cId = splitId(skin.id)[0];
            const champ = champions.find((c) => c.id === cId) || { key: "" };
            return { ...skin, $$key: champ.key };
        });
}