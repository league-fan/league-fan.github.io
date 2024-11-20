import presistentVars from "@/../.cache/persistentVars.json";
import supportedLanguages from "@/../.cache/supportedLanguages.json";
import champions from "@/../.cache/champions.json";
import skinlines from "@/../.cache/skinlines.json";
import universes from "@/../.cache/universes.json";
import skins from "@/../.cache/skins.json";
import added from "@/../.cache/added.json";
import { Added, Champion, Skinline, Skins, Universe } from "@/types";

export const CDRAGON = "https://raw.communitydragon.org";
export const ROOT = "https://www.skinexplorer.lol";

export function splitId(id: number) {
    return [Math.floor(id / 1000), id % 1000];
}

class Patch {
    fullVersionString = presistentVars.oldVersionString;
    supportedLanguages = supportedLanguages;

    added = added as Added;
    assets = {
        champions: champions as { [key: string]: Champion[] },
        skins: skins as { [key: string]: Skins },
        skinlines: skinlines as { [key: string]: Skinline[] },
        universes: universes as { [key: string]: Universe[] },
    };
    lang = 'default';

    constructor(lang = 'default') {
        this.lang = lang;
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
        return this.assets.champions[this.lang];
    }

    get skinlines() {
        return this.assets.skinlines[this.lang];
    }

    get universes() {
        return this.assets.universes[this.lang];
    }

    get skins() {
        return this.assets.skins[this.lang];
    }

    get addedSkins() {
        return added.skins
            .map((id) => this.skins[id])
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((skin) => {
                const cId = splitId(skin.id)[0];
                const champ = this.champions.find((c) => c.id === cId) || { key: "" };
                return { ...skin, $$key: champ.key };
            });
    }
}

export default Patch;