import { createClient } from "@magicwenli/league-fan-assets";

/** @typedef {"chinese" | "english"} UiLang */

const langMap = {
  chinese: "zh_cn",
  english: "default",
};

/**
 * Field mapping for ImgFrame (id / image src / title / description).
 * @type {Record<string, { id: string, src: string, title: string, description: string }>}
 */
export const CATEGORY_PROPS = {
  "summoner-icons": {
    id: "id",
    src: "imagePath",
    title: "title",
    description: "description",
  },
  "summoner-emotes": {
    id: "id",
    src: "inventoryIcon",
    title: "name",
    description: "description",
  },
  "ward-skins": {
    id: "id",
    src: "wardImagePath",
    title: "name",
    description: "description",
  },
  loot: {
    id: "id",
    src: "image",
    title: "name",
    description: "description",
  },
  champions: {
    id: "id",
    src: "squarePortraitPath",
    title: "name",
    description: "key",
  },
  skins: {
    id: "id",
    src: "tilePath",
    title: "name",
    description: "description",
  },
};

/**
 * @param {UiLang} uiLang
 */
export function getClient(uiLang = "chinese") {
  return createClient({
    lang: langMap[uiLang] ?? "default",
    // Browser: CDragon has CORS *. GH Release assets do not.
    source: { kind: "cdragon", patch: "latest" },
  });
}

/**
 * Load a category and normalize to a list suitable for ImgFrame.
 * @param {string} category
 * @param {UiLang} uiLang
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function loadCategoryList(category, uiLang = "chinese") {
  const client = getClient(uiLang);
  const raw = await client.load(/** @type {any} */ (category));

  switch (category) {
    case "summoner-icons":
      return /** @type {any[]} */ (raw).filter((i) => i.imagePath);
    case "summoner-emotes":
      return /** @type {any[]} */ (raw)
        .filter(
          (i) =>
            i.inventoryIcon && !String(i.inventoryIcon).includes("/lol-game-data/"),
        )
        .sort((a, b) => b.id - a.id);
    case "ward-skins":
      return /** @type {any[]} */ (raw)
        .filter((i) => i.wardImagePath)
        .sort((a, b) => b.id - a.id);
    case "loot":
      return /** @type {any[]} */ (raw).filter((i) => i.image);
    case "champions":
      return /** @type {any[]} */ (raw).filter((i) => i.squarePortraitPath);
    case "skins": {
      const map = /** @type {Record<string, any>} */ (raw);
      return Object.values(map)
        .map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description || s.rarity || "",
          tilePath: s.tilePath || s.splashPath || "",
          splashPath: s.splashPath,
          rarity: s.rarity,
          isBase: s.isBase,
        }))
        .filter((s) => s.tilePath)
        .sort((a, b) => b.id - a.id);
    }
    default:
      return Array.isArray(raw) ? raw : [];
  }
}
