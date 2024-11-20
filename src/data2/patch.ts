'use client'

import { Champion, Skinline, Universe, Skins, Added } from "@/types";
import { CDRAGON } from "./constants";
import presistentVars from "@/../.cache/persistentVars.json";
import supportedLanguages from "@/../.cache/supportedLanguages.json";
import champions from "@/../.cache/champions.json";
import skinlines from "@/../.cache/skinlines.json";
import universes from "@/../.cache/universes.json";
import skins from "@/../.cache/skins.json";
import added from "@/../.cache/added.json";
import { Role } from "@/types/champion";


interface Assets {
    champions: { [key: string]: Champion[] };
    skins: { [key: string]: Skins };
    skinlines: { [key: string]: Skinline[] };
    universes: { [key: string]: Universe[] };
}

function convertRoles(champions: any): { [key: string]: Champion[] } {
    const result: { [key: string]: Champion[] } = {}
    for (const key in champions) {
        result[key] = champions[key].map((champ: any) => ({
            ...champ,
            roles: champ.roles.map((role: string) => role as Role)
        }))
    }
    return result
}

export class Patch {
    fullVersionString = presistentVars.oldVersionString;
    supportedLanguages = supportedLanguages;

    currLang = "zh_cn";
    added: Added = added;
    assets: Assets = {
        champions: convertRoles(champions),
        skins: skins as { [key: string]: Skins },
        skinlines: skinlines,
        universes: universes,
    }

    url(path: string, name = 'pbe') {
        return `${CDRAGON}/${name}${path}`;
    }

    data(path: string) {
        return this.url(`/plugins/rcp-be-lol-game-data/global/default${path}`);
    }

    asset(path: string) {
        return this.data(path.replace("/lol-game-data/assets", "").toLowerCase());
    }

    get champions() {
        return this.assets.champions[this.currLang];
    }

    get skinlines() {
        return this.assets.skinlines[this.currLang];
    }

    get universes() {
        return this.assets.universes[this.currLang];
    }

    get skins() {
        return this.assets.skins[this.currLang];
    }
}
