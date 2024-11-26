import { isDeepEqual } from "remeda";
import axios from "axios";
import axiosRetry from "axios-retry";
import { FileCache as Cache } from "./file-cache";
import { CDRAGON, SKIN_SCRAPE_INTERVAL } from "./constants";
import { fetchSkinChanges } from "./changes";
import { substitute } from "./helpers";
import { Champion, LanguageZone, Skinline, Skins, Universe } from "@/types";
import { exit } from "process";
import { ext_languages, LangAssets } from "@/types/languagezone";

axiosRetry(axios, {
    retries: 4,
    retryDelay: axiosRetry.exponentialDelay,
});

const cache = new Cache();

const dataURL = (p: string, patch = "pbe", lang = LanguageZone.Default) =>
    `${CDRAGON}/${patch}/plugins/rcp-be-lol-game-data/global/${lang}${p}`;

async function getLatestChampions(
    patch = "pbe",
    lang = LanguageZone.Default,
): Promise<Champion[]> {
    const data: Champion[] = (
        await axios.get(dataURL("/v1/champion-summary.json", patch, lang))
    ).data;
    console.log(`[CDragon] [${patch}] Loaded champions.`);
    return data
        .filter((d) => d.id !== -1)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((a) => ({ ...a, key: substitute(a.alias.toLowerCase()) }));
}

async function getLatestUniverses(
    patch = "pbe",
    lang = LanguageZone.Default,
): Promise<Universe[]> {
    const data: Universe[] = (
        await axios.get(dataURL("/v1/universes.json", patch, lang))
    ).data;
    console.log(`[CDragon] [${patch}] Loaded universes.`);

    return data
        .filter((d) => d.id !== 0)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
}

async function getLatestSkinlines(
    patch = "pbe",
    lang = LanguageZone.Default,
): Promise<Skinline[]> {
    const data: Skinline[] = (
        await axios.get(dataURL("/v1/skinlines.json", patch, lang))
    ).data;
    console.log(`[CDragon] [${patch}] Loaded skinlines.`);

    return data
        .filter((d) => d.id !== 0)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
}

async function getLatestSkins(
    patch = "pbe",
    lang = LanguageZone.Default,
): Promise<Skins> {
    const data: Skins = (await axios.get(dataURL("/v1/skins.json", patch, lang)))
        .data;
    console.log(`[CDragon] [${patch}] Loaded skins.`);

    Object.keys(data).map((id) => {
        const skin = data[id];
        if (skin.isBase) {
            skin.name = "Original " + skin.name;
        }
        if (skin.questSkinInfo) {
            // At the time of writing (12.1), only K/DA ALL OUT Seraphine (147001)
            const base = { ...skin };
            delete base.questSkinInfo;

            skin.questSkinInfo.tiers.map((tier) => {
                const s = { ...base, ...tier };
                data[s.id.toString()] = s;
            });
        }
    });
    return data;
}

async function getLatestPatchData(
    patch = "pbe",
    lang = LanguageZone.Default,
): Promise<[Champion[], Skinline[], Skins, Universe[]]> {
    return await Promise.all([
        getLatestChampions(patch, lang),
        getLatestSkinlines(patch, lang),
        getLatestSkins(patch, lang),
        getLatestUniverses(patch, lang),
    ]);
}

async function getAdded(
    champions: Champion[],
    skinlines: Skinline[],
    skins: Skins,
    universes: Universe[],
) {
    const [oldC, oldSl, oldS, oldU] = await getLatestPatchData("latest");
    const oldSkinIds = new Set(Object.keys(oldS)),
        oldChampionIds = new Set(oldC.map((c) => c.id)),
        oldSkinlineIds = new Set(oldSl.map((l) => l.id)),
        oldUniverseIds = new Set(oldU.map((u) => u.id));

    return {
        skins: Object.keys(skins).filter((i) => !oldSkinIds.has(i)),
        champions: champions.map((c) => c.id).filter((i) => !oldChampionIds.has(i)),
        skinlines: skinlines.map((l) => l.id).filter((i) => !oldSkinlineIds.has(i)),
        universes: universes.map((u) => u.id).filter((i) => !oldUniverseIds.has(i)),
    };
}

async function scrape(langs_extra: LanguageZone[] = []) {
    let shouldRebuild = false;
    const { lastUpdate, oldVersionString } = await cache.get("persistentVars", {
        lastUpdate: 0,
        oldVersionString: "",
    });
    const now = Date.now();

    let champions: Champion[] | null = null;
    let skinlines: Skinline[] | null = null;
    let skins: Skins | null = null;
    let universes: Universe[] | null = null;

    let champions_dict: LangAssets<Champion[]> = {};
    let skinlines_dict: LangAssets<Skinline[]> = {};
    let skins_dict: LangAssets<Skins> = {};
    let universes_dict: LangAssets<Universe[]> = {};

    const all_langs = langs_extra.concat(LanguageZone.Default);

    // Check to see if patch changed.
    const metadata: { version: String } = (
        await axios.get(CDRAGON + "/pbe/content-metadata.json")
    ).data;
    if (metadata.version === oldVersionString) {
        console.log(
            `[CDragon] Patch has not changed (${oldVersionString}). Skipping...`,
        );
    } else {
        // Patch changed!
        for (const lang of all_langs) {
            console.log(
                `[CDragon] Caching new patch data (${metadata.version}) for ${lang}...`,
            );
            const [champions, skinlines, skins, universes] = await getLatestPatchData(
                "pbe",
                lang,
            );

            if (lang === LanguageZone.Default) {
                const added = await getAdded(champions, skinlines, skins, universes);
                await cache.set("added", added);
                champions_dict[LanguageZone.EnglishDefault] = champions;
                skinlines_dict[LanguageZone.EnglishDefault] = skinlines;
                skins_dict[LanguageZone.EnglishDefault] = skins;
                universes_dict[LanguageZone.EnglishDefault] = universes;
            }

            champions_dict[lang] = champions;
            skinlines_dict[lang] = skinlines;
            skins_dict[lang] = skins;
            universes_dict[lang] = universes;
        }

        await Promise.all([
            cache.set("champions", champions_dict),
            cache.set("skinlines", skinlines_dict),
            cache.set("skins", skins_dict),
            cache.set("universes", universes_dict),
        ]);

        await cache.set(
            "supportedLanguages",
            langs_extra.concat(LanguageZone.Default),
        );
        console.log("[CDragon] Cache updated.");
        shouldRebuild = true;
    }

    if (now - lastUpdate < SKIN_SCRAPE_INTERVAL * 1000) {
        console.log(
            "[Skin Changes] Hasn't been 1 hour since last scrape. Exiting.",
        );
        return shouldRebuild;
    }

    if (!champions || !skins) {
        [champions, skins] = await Promise.all([
            getLatestChampions(),
            getLatestSkins(),
        ]);
    }
    const oldChanges = await cache.get("changes", {});
    const changes = await fetchSkinChanges(champions, skins);
    const haveNewChanges = !isDeepEqual(changes, oldChanges);
    shouldRebuild = shouldRebuild || haveNewChanges;

    if (haveNewChanges) {
        await cache.set("changes", changes);
        console.log("[Skin Changes] Cache updated.");
    } else {
        console.log("[Skin Changes] No new changes, exiting.");
    }
    await cache.set("persistentVars", {
        lastUpdate: now,
        oldVersionString: metadata.version,
    });

    return shouldRebuild;
}

async function main() {
    const langs_extra = ext_languages;
    const shouldRebuild = await scrape(langs_extra);
    if (shouldRebuild) {
        if (!process.env.DEPLOY_HOOK)
            return console.log("[Deploy] Need rebuild but no DEPLOY_HOOK provided.");
        console.log("[Deploy] Triggering rebuild...");
        const { job } = (await axios.post(process.env.DEPLOY_HOOK)).data;
        console.log(`Job ${job.id}, State: ${job.state}`);
    } else {
        console.log("[Deploy] Rebuild unnecessary.");
    }
}

main().then(() => {
    cache.destroy();
    console.log("[CDragon] Finished.");
    exit(0);
});
