import Fuse from "fuse.js";
import { Patch } from "./patch";
import { splitId } from "./helpers";
import { Champion, Skinline, Universe } from "@/types";
import { Skin } from "@/types/skins";

const FUSE_OPTIONS = { keys: ["name", "searchString"], threshold: 0.3 };
const NON_ALPHANUMERIC_REGEX = /[^A-Za-z0-9]/g;

interface SearchItem {
    id: number;
    key: string;
    name: string;
    image: string;
    type: string;
    searchString: string;
}

/**
 * Handle the logic behind cache invalidation and triggering all the datasets
 * to fetch new copies.
 */
export class Store {
    patch = new Patch();
    changes = require("./.cache/changes.json");
    fuse: Fuse<SearchItem> = new Fuse([], FUSE_OPTIONS);

    constructor() {
        const { champions, universes, skinlines, skins } = this.patch;

        const items: SearchItem[] = champions
            .map((c) => ({
                id: c.id,
                key: c.key,
                name: c.name,
                image: c.squarePortraitPath,
                type: "champion",
                searchString: c.name.replace(NON_ALPHANUMERIC_REGEX, ""),
            }))
            .concat(
                universes.map((u) => ({
                    id: u.id,
                    key: "",
                    name: u.name,
                    type: "universe",
                    image: u.imagePath,
                    searchString: u.name.replace(NON_ALPHANUMERIC_REGEX, ""),
                }))
            )
            .concat(
                skinlines.map((l) => ({
                    id: l.id,
                    key: "",
                    name: l.name,
                    type: "skinline",
                    image: "",
                    searchString: l.name.replace(NON_ALPHANUMERIC_REGEX, ""),
                }))
            )
            .concat(
                Object.values(skins).map((s) => {
                    const cId = splitId(s.id)[0];
                    const champ = champions.find((c) => c.id === cId);
                    return {
                        id: s.id,
                        key: champ?.key || "",
                        name: s.name,
                        image: s.tilePath,
                        type: "skin",
                        searchString: s.name.replace(NON_ALPHANUMERIC_REGEX, ""),
                    };
                })
            );

        this.fuse = new Fuse<SearchItem>(items, FUSE_OPTIONS);
    }
}

export const store = new Store();
