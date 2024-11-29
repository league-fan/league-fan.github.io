import { Added, Champion, Skin, Skins } from "@/types";
import { use } from 'react';
import presistentVars from "@/../.cache/persistentVars.json";
import supportedLanguages from "@/../.cache/supportedLanguages.json";
import champions from "@/../.cache/champions.json";
import skinlines from "@/../.cache/skinlines.json";
import universes from "@/../.cache/universes.json";
import skins from "@/../.cache/skins.json";
import added from "@/../.cache/added.json";
import changes from "@/../.cache/changes.json";
import { CDRAGON, fallbackLng } from "./constants";
import { RarityEnum } from "@/types/skins";

const CACHE = "@/../.cache";
export enum LocalData {
    presistentVars,
    supportedLanguages,
    champions,
    skinlines,
    universes,
    skins,
    added,
    changes
}

export const raritiesMap: Partial<Record<RarityEnum, [string, string]>> = {
    [RarityEnum.KUltimate]: ["ultimate.png", "Ultimate"],
    [RarityEnum.KMythic]: ["mythic.png", "Mythic"],
    [RarityEnum.KLegendary]: ["legendary.png", "Legendary"],
    [RarityEnum.KEpic]: ["epic.png", "Epic"],
    [RarityEnum.KTranscendent]: ["transcendent.png", "Transcendent"],
};


export function local_fetch<T>(data: LocalData) {
    switch (data) {
        case LocalData.presistentVars:
            return presistentVars as T;
        case LocalData.supportedLanguages:
            return supportedLanguages as T;
        case LocalData.champions:
            return champions as T;
        case LocalData.skinlines:
            return skinlines as T;
        case LocalData.universes:
            return universes as T;
        case LocalData.skins:
            return skins as T;
        case LocalData.added:
            return added as T;
        case LocalData.changes:
            return changes as T;
    }
}

export function splitSkinId(id: number) {
    return {
        champId: Math.floor(id / 1000),
        skinId: id % 1000
    };
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
        .filter((skin) => skin !== null)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((skin) => {
            if (!skin.id) {
                console.error("Missing skin id", skin);
                return null;
            }
            const cId = splitSkinId(skin.id).champId;
            const champ = champions.find((c) => c.id === cId)
            if (!champ) {
                console.error("Missing champ", cId);
                return null;
            }
            return { ...skin, $$alias: champ.alias };
        })
        .filter((skin) => skin !== null);
}

export function dataRoot({ patch, lang }: { patch?: string, lang?: string }) {
    const effectivePatch = patch || "pbe";
    const effectiveLang = lang || "default";
    return `${CDRAGON}/${effectivePatch}/plugins/rcp-be-lol-game-data/global/${effectiveLang}`;
}

export function modelviewerUrl(skinId: number) {
    return `https://www.modelviewer.lol/en-US/model-viewer?id=${skinId}`;
    // const skinId = splitId(skin.id)[1];
    // return `https://teemo.gg/model-viewer?game=league-of-legends&type=champions&object=${champion.alias.toLowerCase()}&skinid=${champion.alias.toLowerCase()}-${skinId}`;
}

export function asset(path: string, { patch, lang }: { patch?: string, lang?: string }) {
    return path.replace("/lol-game-data/assets", dataRoot({ patch, lang })).toLowerCase();
}

export function getRarityOfSkin(rarity: String) {
    const skinRarity = rarity as RarityEnum;
    if (!skinRarity || !(skinRarity in raritiesMap)) {
        return null;
    }
    const rarityInfo = raritiesMap[skinRarity];
    if (!rarityInfo) {
        return null;
    }
    const [imgName, name] = rarityInfo;
    const imgUrl = `${dataRoot({})}/v1/rarity-gem-icons/${imgName}`;
    return {
        imgUrl,
        name,
    };
}

export function sortSkins(sortByRarity: boolean, skins: Skin[]) {
    if (sortByRarity) {
        const keys = Object.keys(raritiesMap).reverse();
        return skins
            .slice()
            .sort((a, b) => keys.indexOf(b.rarity) - keys.indexOf(a.rarity));
    }
    return skins;
}