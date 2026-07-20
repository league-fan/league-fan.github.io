import {
  createClient,
  splitSkinId,
  getRarityUrl,
  modelviewerUrl,
} from "@magicwenli/league-fan-assets";

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
    description: "rolesLabel",
  },
  skins: {
    id: "id",
    src: "tilePath",
    title: "name",
    description: "description",
  },
};

/** Human-readable rarity labels (fallback when getRarityUrl fails). */
export const RARITY_LABELS = {
  kNoRarity: "Default",
  kRare: "Rare",
  kEpic: "Epic",
  kLegendary: "Legendary",
  kMythic: "Mythic",
  kUltimate: "Ultimate",
  kTranscendent: "Transcendent",
  kExalted: "Exalted",
};

/**
 * Ordered property rows for the detail panel (human-facing only).
 * Omits contentId / alias / key / raw store ids and similar noise.
 * Each entry: [label, value getter, optional type]
 * type: "text" | "bool" | "link" | "html" | "image"
 * @type {Record<string, Array<[string, (item: any) => unknown, string?]>>}
 */
export const DETAIL_FIELDS = {
  skins: [
    ["ID", (i) => i.id],
    ["Name", (i) => i.name],
    ["Description", (i) => i.description],
    ["Rarity", (i) => i.rarityName || RARITY_LABELS[i.rarity] || i.rarity],
    ["Champion", (i) => i.championName],
    ["Skin Index", (i) => i.skinIndex],
    ["Series", (i) => (i.skinlineNames || []).join(", ")],
    [
      "Series Info",
      (i) => (i.skinlineDescriptions || []).filter(Boolean).join("\n"),
    ],
    ["Base Skin", (i) => i.isBase, "bool"],
    ["Legacy", (i) => i.isLegacy, "bool"],
    ["Skin Type", (i) => (i.skinType ? i.skinType : null)],
    ["Features", (i) => i.featuresText, "html"],
    [
      "Model Viewer",
      (i) => (i.id != null ? modelviewerUrl(i.id) : null),
      "link",
    ],
  ],
  "summoner-icons": [
    ["ID", (i) => i.id],
    ["Title", (i) => i.title],
    ["Description", (i) => i.description],
    ["Year Released", (i) => i.yearReleased],
    ["Legacy", (i) => i.isLegacy, "bool"],
    [
      "Regional Descriptions",
      (i) =>
        (i.descriptions || [])
          .map((d) => `${d.region}: ${d.description}`)
          .join("\n") || null,
    ],
  ],
  "summoner-emotes": [
    ["ID", (i) => i.id],
    ["Name", (i) => i.name],
    ["Description", (i) => i.description],
    [
      "Tagged Champions",
      (i) => (i.taggedChampionsIds || []).join(", ") || null,
    ],
  ],
  "ward-skins": [
    ["ID", (i) => i.id],
    ["Name", (i) => i.name],
    ["Description", (i) => i.description],
    ["Legacy", (i) => i.isLegacy, "bool"],
  ],
  loot: [
    ["ID", (i) => i.id],
    ["Name", (i) => i.name],
    ["Description", (i) => i.description],
    ["Type", (i) => i.type],
    ["Rarity", (i) => i.rarity],
    ["Start Date", (i) => i.startDate],
    ["End Date", (i) => i.endDate],
    ["Lifetime Max", (i) => i.lifetimeMax],
    ["Auto Redeem", (i) => i.autoRedeem, "bool"],
  ],
  champions: [
    ["ID", (i) => i.id],
    ["Name", (i) => i.name],
    ["Roles", (i) => (i.roles || []).join(", ")],
  ],
};

/**
 * Extra media groups for the right drawer (splash / chromas / …).
 * @param {Record<string, any>} item
 * @param {string} category
 * @returns {Array<{ key: string, label: string, items: Array<{ id: string, src: string, title?: string, caption?: string, colors?: string[] }> }>}
 */
export function buildMediaGroups(item, category) {
  if (!item) return [];
  /** @type {Array<{ key: string, label: string, items: any[] }>} */
  const groups = [];

  const push = (key, label, entries) => {
    const items = (entries || []).filter((e) => e && e.src);
    if (items.length) groups.push({ key, label, items });
  };

  const one = (src, title, caption) =>
    src ? [{ id: `${title || "img"}`, src, title, caption }] : [];

  switch (category) {
    case "skins": {
      push("tile", "Tile", one(item.tilePath, "Tile"));
      push(
        "splash",
        "Splash",
        [
          ...one(item.splashPath, "Centered splash"),
          ...one(item.uncenteredSplashPath, "Uncentered splash"),
        ],
      );
      push(
        "loadscreen",
        "Load screen",
        [
          ...one(item.loadScreenPath, "Load screen"),
          ...one(item.loadScreenVintagePath, "Vintage load screen"),
        ],
      );
      if (Array.isArray(item.chromas) && item.chromas.length) {
        push(
          "chromas",
          `Chromas (${item.chromas.length})`,
          item.chromas.map((ch) => ({
            id: `chroma-${ch.id}`,
            src: ch.chromaPath,
            title: ch.name,
            caption:
              ch.description ||
              (ch.descriptions && ch.descriptions[0]?.description) ||
              "",
            colors: ch.colors,
          })),
        );
      }
      push(
        "chroma-base",
        "Chroma preview",
        one(item.chromaPath, "Base chroma path"),
      );
      push(
        "rarity",
        "Rarity gem",
        one(item.rarityGemPath || item.rarityIcon, item.rarityName || "Rarity"),
      );
      if (Array.isArray(item.emblems) && item.emblems.length) {
        push(
          "emblems",
          "Emblems",
          item.emblems.flatMap((em, i) => {
            const out = [];
            if (em?.emblemPath?.large) {
              out.push({
                id: `em-l-${i}`,
                src: em.emblemPath.large,
                title: em.name || "Emblem large",
              });
            }
            if (em?.emblemPath?.small) {
              out.push({
                id: `em-s-${i}`,
                src: em.emblemPath.small,
                title: em.name || "Emblem small",
              });
            }
            return out;
          }),
        );
      }
      push(
        "videos",
        "Videos",
        [
          item.splashVideoPath && {
            id: "splash-video",
            src: item.splashVideoPath,
            title: "Splash video",
            kind: "video",
          },
          item.collectionSplashVideoPath && {
            id: "collection-splash-video",
            src: item.collectionSplashVideoPath,
            title: "Collection splash video",
            kind: "video",
          },
          item.collectionCardHoverVideoPath && {
            id: "card-hover-video",
            src: item.collectionCardHoverVideoPath,
            title: "Card hover video",
            kind: "video",
          },
          item.previewVideoUrl && {
            id: "preview-video",
            src: item.previewVideoUrl,
            title: "Preview video",
            kind: "video",
          },
        ].filter(Boolean),
      );
      break;
    }
    case "ward-skins":
      push("ward", "Ward", one(item.wardImagePath, item.name));
      push("shadow", "Shadow", one(item.wardShadowImagePath, "Shadow"));
      break;
    case "summoner-icons":
      push("icon", "Icon", one(item.imagePath, item.title));
      break;
    case "summoner-emotes":
      push("emote", "Emote", one(item.inventoryIcon, item.name));
      break;
    case "loot":
      push("loot", "Image", one(item.image, item.name));
      break;
    case "champions":
      push("portrait", "Portrait", one(item.squarePortraitPath, item.name));
      break;
    default:
      break;
  }

  return groups;
}

/** True when there is more than the primary thumbnail to show. */
export function hasExtraMedia(item, category) {
  const groups = buildMediaGroups(item, category);
  if (!groups.length) return false;
  // Primary gallery thumb already shows tile/icon — count extra groups/items
  if (category === "skins") {
    return groups.some((g) =>
      ["splash", "loadscreen", "chromas", "videos", "emblems"].includes(g.key),
    );
  }
  if (category === "ward-skins") {
    return groups.some((g) => g.key === "shadow");
  }
  return groups.length > 1;
}

/** @typedef {"default" | "time-asc" | "time-desc"} SortMode */

export const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "time-asc", label: "Time ascending" },
  { value: "time-desc", label: "Time descending" },
];

/**
 * Numeric-ish id for sorting (handles string ids like CHEST_96).
 * @param {unknown} id
 */
export function numericId(id) {
  if (typeof id === "number" && Number.isFinite(id)) return id;
  const n = Number(id);
  if (Number.isFinite(n)) return n;
  const m = String(id ?? "").match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

/**
 * Chronological proxy for an item.
 * Prefer explicit dates when present; otherwise use id (usually increases over time).
 * @param {Record<string, any>} item
 * @param {string} category
 */
export function getTimeSortValue(item, category) {
  if (!item) return 0;

  if (category === "summoner-icons") {
    const year = Number(item.yearReleased) || 0;
    return year * 1e9 + numericId(item.id);
  }

  if (category === "loot") {
    const start = item.startDate && String(item.startDate).trim();
    if (start) {
      const t = Date.parse(start);
      if (!Number.isNaN(t)) return t;
    }
    const end = item.endDate && String(item.endDate).trim();
    if (end) {
      const t = Date.parse(end);
      if (!Number.isNaN(t)) return t;
    }
  }

  // Precomputed on load when available
  if (typeof item._timeSort === "number") return item._timeSort;

  return numericId(item.id);
}

/**
 * Stamp load order + time key, then return list (mutates items lightly).
 * @param {any[]} list
 * @param {string} category
 */
export function finalizeList(list, category) {
  return list.map((item, index) => {
    const next = item;
    next._loadIndex = index;
    next._timeSort = getTimeSortValue(
      // avoid using stale _timeSort when computing
      { ...item, _timeSort: undefined },
      category,
    );
    return next;
  });
}

/**
 * Sort a filtered list by sort mode (stable for group reordering).
 * @param {any[]} list
 * @param {SortMode} sortMode
 * @param {string} category
 */
export function sortItems(list, sortMode, category) {
  if (!list.length || sortMode === "default") {
    // Preserve load / filter order; if _loadIndex exists, restore it
    if (list.some((i) => typeof i._loadIndex === "number")) {
      return [...list].sort(
        (a, b) => (a._loadIndex ?? 0) - (b._loadIndex ?? 0),
      );
    }
    return list;
  }
  const dir = sortMode === "time-asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    const ta = a._timeSort ?? getTimeSortValue(a, category);
    const tb = b._timeSort ?? getTimeSortValue(b, category);
    if (ta !== tb) return (ta - tb) * dir;
    const idDiff = (numericId(a.id) - numericId(b.id)) * dir;
    if (idDiff !== 0) return idDiff;
    return ((a._loadIndex ?? 0) - (b._loadIndex ?? 0)) * dir;
  });
}

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
 * Enrich skins with champion / skinline metadata and keep all raw fields.
 * @param {Record<string, any>} skinsMap
 * @param {any[]} champions
 * @param {any[]} skinlines
 */
function normalizeSkins(skinsMap, champions, skinlines) {
  const champById = new Map(champions.map((c) => [c.id, c]));
  const lineById = new Map(skinlines.map((l) => [l.id, l]));

  return Object.values(skinsMap)
    .map((s) => {
      const { champId, skinIndex } = splitSkinId(s.id);
      const champ = champById.get(champId);
      const lines = (s.skinLines || [])
        .map((ref) => lineById.get(ref.id))
        .filter(Boolean);
      const rarityInfo = s.rarity ? getRarityUrl(String(s.rarity)) : null;
      const tilePath = s.tilePath || s.splashPath || "";

      return {
        ...s,
        tilePath,
        champId,
        skinIndex,
        championName: champ?.name ?? `#${champId}`,
        championAlias: champ?.alias ?? "",
        championPortrait: champ?.squarePortraitPath ?? "",
        skinlineIds: lines.map((l) => l.id),
        skinlineNames: lines.map((l) => l.name?.trim() || `#${l.id}`),
        skinlineDescriptions: lines.map((l) => l.description || ""),
        rarityName: (() => {
          const key = String(s.rarity || "");
          if (RARITY_LABELS[key]) return RARITY_LABELS[key];
          if (rarityInfo?.name) return rarityInfo.name;
          // Strip leading k if present: kExalted → Exalted
          if (key.startsWith("k") && key.length > 1) return key.slice(1);
          return key;
        })(),
        rarityIcon: rarityInfo?.imgUrl || s.rarityGemPath || "",
        chromaCount: Array.isArray(s.chromas) ? s.chromas.length : 0,
      };
    })
    .filter((s) => s.tilePath)
    .sort((a, b) => b.id - a.id);
}

/**
 * Load a category and normalize to a list suitable for ImgFrame.
 * Preserves as many original fields as possible.
 * @param {string} category
 * @param {UiLang} uiLang
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function loadCategoryList(category, uiLang = "chinese") {
  const client = getClient(uiLang);
  const raw = await client.load(/** @type {any} */ (category));

  /** @type {any[]} */
  let list;
  switch (category) {
    case "summoner-icons":
      list = /** @type {any[]} */ (raw)
        .filter((i) => i.imagePath)
        .map((i) => ({ ...i }));
      break;
    case "summoner-emotes":
      list = /** @type {any[]} */ (raw)
        .filter(
          (i) =>
            i.inventoryIcon &&
            !String(i.inventoryIcon).includes("/lol-game-data/"),
        )
        .map((i) => ({ ...i }))
        .sort((a, b) => b.id - a.id);
      break;
    case "ward-skins":
      list = /** @type {any[]} */ (raw)
        .filter((i) => i.wardImagePath)
        .map((i) => ({ ...i }))
        .sort((a, b) => b.id - a.id);
      break;
    case "loot":
      list = /** @type {any[]} */ (raw)
        .filter((i) => i.image)
        .map((i) => ({ ...i }));
      break;
    case "champions":
      list = /** @type {any[]} */ (raw)
        .filter((i) => i.squarePortraitPath)
        .map((i) => ({
          ...i,
          roles: Array.isArray(i.roles) ? i.roles : [],
          rolesLabel: (Array.isArray(i.roles) ? i.roles : []).join(", "),
          primaryRole: (Array.isArray(i.roles) && i.roles[0]) || "unknown",
        }));
      break;
    case "skins": {
      // Parallel load related metadata for grouping & labels
      const [champions, skinlines] = await Promise.all([
        client.load("champions"),
        client.load("skinlines"),
      ]);
      list = normalizeSkins(
        /** @type {Record<string, any>} */ (raw),
        /** @type {any[]} */ (champions),
        /** @type {any[]} */ (skinlines),
      );
      break;
    }
    default:
      list = Array.isArray(raw) ? raw.map((i) => ({ ...i })) : [];
  }

  return finalizeList(list, category);
}

/**
 * Unique filter options derived from a skins list.
 * @param {any[]} items
 */
export function deriveSkinFilterOptions(items) {
  const rarities = new Map();
  const skinlines = new Map();
  const champions = new Map();

  for (const s of items) {
    if (s.rarity) {
      rarities.set(
        s.rarity,
        s.rarityName || RARITY_LABELS[s.rarity] || s.rarity,
      );
    }
    if (s.champId != null) {
      champions.set(s.champId, s.championName);
    }
    for (let i = 0; i < (s.skinlineIds || []).length; i++) {
      skinlines.set(s.skinlineIds[i], s.skinlineNames[i]);
    }
  }

  const sortByLabel = (a, b) =>
    String(a.label).localeCompare(String(b.label), "zh");

  return {
    rarities: [...rarities.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort(sortByLabel),
    skinlines: [...skinlines.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort(sortByLabel),
    champions: [...champions.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort(sortByLabel),
  };
}
