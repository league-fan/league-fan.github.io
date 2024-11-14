import pLimit from "p-limit";
import Fuse from "fuse.js";
import * as cheerio from "cheerio";
import axios from "axios";
import { splitId, parsePatch, comparePatches, substitute } from "./helpers";
import {
  CDRAGON,
  ALIASES,
  IGNORED_WARNINGS,
  MIN_SUPPORTED_VERSION,
  WIKI_SUBSTITUTIONS,
} from "./constants";
import { CDragonJson, Champion, Skinline, Skins, Universe } from "@/types";

const limit = pLimit(10);
const PATCH_REGEX = /^\d+\.\d+$/;

export async function fetchSkinChanges(champions: Champion[], skins: Skins) {
  console.log(`[Skin Changes] Retrieving patch list...`);
  let data: CDragonJson[] = (await axios.get(`${CDRAGON}/json`)).data;
  const patches = data
    .filter(
      (entry) => entry.type === "directory" && entry.name.match(PATCH_REGEX),
    )
    .map((e) => parsePatch(e.name))
    .sort((a, b) => -comparePatches(a, b));
  console.log(`[Skin Changes] Updating... (${champions.length} champions)`);
  const changes = {};
  let i = 0;
  await Promise.all(
    champions.map((c) =>
      limit(async () => {
        const wiki_c = Object.assign({}, c, {
          name: substitute(c.name, WIKI_SUBSTITUTIONS),
        });
        Object.assign(changes, await getSkinArtChanges(wiki_c, skins, patches));
        console.log(
          `[Skin Changes] Completed ${wiki_c.name}. (${++i}/${champions.length})`,
        );
      }),
    ),
  );
  console.log("[Skin Changes] Update complete.");
  return changes;
}

/**
 * Parse a champion's Patch History page from Fandom to find which patches had
 * changed skins.
 *
 * https://wiki.leagueoflegends.com/en-us/Ambessa/Patch_history
 */
async function getSkinArtChanges(
  champion: Champion,
  skins: Skins,
  patches: number[][],
) {
  const changes: { [key: number]: Set<string> } = {};
  const champSkins = new Fuse(
    Object.values(skins).filter((skin) => splitId(skin.id)[0] === champion.id),
    {
      keys: ["name"],
      threshold: 0.1,
    },
  );

  const response = await axios.get(
    `https://wiki.leagueoflegends.com/en-us/${champion.name}/Patch_history?action=render`,
  );

  const $ = cheerio.load(response.data);

  $("dl dt a")
    .toArray()
    .filter((el) => {
      const t = $(el).attr("title");
      if (!t?.startsWith("V")) return false;

      const split = t.slice(1).split(".");
      if (split.length != 2) return false;

      const patch = split.map((e) => parseInt(e, 10));
      if (comparePatches(patch, MIN_SUPPORTED_VERSION) <= 0) return false;

      return true;
    })
    .map((x) => {
      const t = $(x).parents("dl"),
        c = t.next(),
        subset = c.find(':contains(" art")');
      if (!subset.length) return;

      const title = t.find("a").attr("title");
      if (!title) return;

      const patch = parsePatch(title.slice(1));
      const prevPatch =
        patches[
          patches.findIndex((p) => comparePatches(p, patch) === 0) + 1
        ].join(".");
      subset.each((_, el) => {
        $(el)
          .find("a[href]")
          .each((_, link) => {
            const name = $(link).text().trim();
            if (!name) return;

            let matches = champSkins.search(name, { limit: 1 });
            if (!matches.length) {
              if (name.startsWith("Original ")) {
                matches = champSkins.search(name.slice(9), { limit: 1 });
              }
              if (ALIASES[name]) {
                matches = champSkins.search(ALIASES[name], { limit: 1 });
              }

              if (!matches.length) {
                if (!IGNORED_WARNINGS.includes(name)) {
                  console.error(
                    `Couldn't find a match for ${name} (${champion.name})`,
                  );
                }
                return;
              }
            }
            const skin = matches[0].item;
            changes[skin.id] = new Set([
              ...(changes[skin.id] ?? []),
              prevPatch,
            ]);
          });
      });
    });

  return Object.keys(changes).reduce(
    (obj, key) => ({
      ...obj,
      [key]: [...changes[Number(key)]].sort(
        (a, b) => -comparePatches(parsePatch(a), parsePatch(b)),
      ),
    }),
    {},
  );
}
