import { Champion, Skinline, Universe ,Skins, Added} from "@/types";
import { CDRAGON } from "./constants";

interface Assets {
    champions: { [key: string]: Champion[] };
    skins: { [key: string]: Skins };
    skinlines: { [key: string]: Skinline[] };
    universes: { [key: string]: Universe[] };
  }


export class Patch {
    fullVersionString = require("./.cache/persistentVars.json").oldVersionString;
    supportedLanguages = require("./.cache/supportedLanguages.json");

    currLang = "zh_cn";
    added: Added = require("./.cache/added.json");
    assets: Assets = {
        champions: require("./.cache/champions.json"),
        skins: require("./.cache/skins.json"),
        skinlines: require("./.cache/skinlines.json"),
        universes: require("./.cache/universes.json"),
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
