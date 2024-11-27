
'use client'

import { useEffect, useState } from "react";
import { CDRAGON, fallbackLng } from "./constants";
import { useRouter } from "next/navigation";
import { Added, Champion, Skin, Skins } from "@/types";
import { RarityEnum } from "@/types/skins";

export const raritiesMap: Partial<Record<RarityEnum, [string, string]>> = {
    [RarityEnum.KUltimate]: ["ultimate.png", "Ultimate"],
    [RarityEnum.KMythic]: ["mythic.png", "Mythic"],
    [RarityEnum.KLegendary]: ["legendary.png", "Legendary"],
    [RarityEnum.KEpic]: ["epic.png", "Epic"],
    [RarityEnum.KTranscendent]: ["transcendent.png", "Transcendent"],
};

export function getRarityOfSkin(skin: Skin) {
    if (!skin.rarity || !(skin.rarity in raritiesMap)) {
        return null;
    }
    const rarityInfo = raritiesMap[skin.rarity];
    if (!rarityInfo) {
        return null;
    }
    const [imgName, name] = rarityInfo;
    const imgUrl = `${dataRoot()}/v1/rarity-gem-icons/${imgName}`;
    return {
        imgUrl,
        name,
    };
}

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
            const champ = champions.find((c) => c.id === cId) || champions[0];
            return { ...skin, $$alias: champ.alias };
        });
}

export function skinlineSkins(id: number, skins: Skins, champions: Champion[]) {
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

export function getSkinsOfChampionById(id: number, skins: Skins) {
    return Object.values(skins).filter((skin) => splitId(skin.id)[0] === id);
}

export function getChampionByName(name: string, champions: Champion[]) {
    return champions.find((champ) => champ.alias.toLowerCase() === name.toLowerCase());
}

export function getChampionById(id: number, champions: Champion[]) {
    return champions.find((champ) => champ.id === id);
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

export function useLocalStorageState(name: string, initialValue: any) {
    const [value, _setValue] = useState(initialValue);
    useEffect(() => {
        localStorage[name] && _setValue(JSON.parse(localStorage[name]));
    }, [name]);

    const setValue = (v: any) => {
        _setValue(v);
        localStorage[name] = JSON.stringify(v);
    };
    return [value, setValue];
}

interface AssetOptions {
    patch?: string;
    lang?: string;
}

export function dataRoot({ patch, lang }: AssetOptions = { patch: "pbe", lang: "default" }) {
    const effectivePatch = patch || "pbe";
    const effectiveLang = lang || "default";
    return `${CDRAGON}/${effectivePatch}/plugins/rcp-be-lol-game-data/global/${effectiveLang}`;
}

export function modelviewerUrl(skin: Skin) {
    return `https://www.modelviewer.lol/en-US/model-viewer?id=${skin.id}`;
    // const skinId = splitId(skin.id)[1];
    // return `https://teemo.gg/model-viewer?game=league-of-legends&type=champions&object=${champion.alias.toLowerCase()}&skinid=${champion.alias.toLowerCase()}-${skinId}`;
}

export function asset(path: string, { patch, lang }: AssetOptions = { patch: "pbe", lang: "default" }) {
    return path.replace("/lol-game-data/assets", dataRoot({ patch, lang })).toLowerCase();
}

function isTextBox(element: Element | null) {
    if (!element) return false;
    var tagName = element.tagName.toLowerCase();
    if (tagName === "textarea") return true;
    if (tagName !== "input") return false;
    var type = element.getAttribute("type")?.toLowerCase() || "",
        // if any of these input types is not supported by a browser, it will behave as input type text.
        inputTypes = [
            "text",
            "password",
            "number",
            "email",
            "tel",
            "url",
            "search",
            "date",
            "datetime",
            "datetime-local",
            "time",
            "month",
            "week",
        ];
    return inputTypes.indexOf(type) >= 0;
}

export function useEscapeTo(url: string) {
    const router = useRouter();
    useEffect(() => {
        function onKeyDown(e: { code: string; preventDefault: () => void; }) {
            if (isTextBox(document.activeElement)) return; // Ignore events when an input is active.
            if (e.code === "Escape") {
                router.push(url);
                e.preventDefault();
            }
        }

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [router, url]);
}
