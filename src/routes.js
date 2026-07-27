/**
 * Gallery routes. Each entry drives three things: the header nav, the router,
 * and the AssetBrowserPage behaviour (which store slice and asset category to
 * load, plus the hover zoom factor that suits that art's aspect ratio).
 *
 * - storeKey: store slice key (icons | emotes | wards | …)
 * - category: @magicwenli/league-fan-assets category id
 */
export const GALLERIES = [
  {
    path: "/",
    label: "Icons",
    title: "Summoner Icons",
    storeKey: "icons",
    category: "summoner-icons",
    scale: 1.5,
  },
  {
    path: "/summoner-emotes",
    label: "Emotes",
    title: "Summoner Emotes",
    storeKey: "emotes",
    category: "summoner-emotes",
    scale: 1.5,
  },
  {
    path: "/ward-skins",
    label: "Wards",
    title: "Ward Skins",
    storeKey: "wards",
    category: "ward-skins",
    scale: 1.2,
  },
  {
    path: "/loot",
    label: "Loot",
    title: "Hextech Chests",
    storeKey: "loot",
    category: "loot",
    scale: 1.2,
  },
  {
    path: "/champions",
    label: "Champions",
    title: "Champions",
    storeKey: "champions",
    category: "champions",
    scale: 1.5,
  },
  {
    path: "/skins",
    label: "Skins",
    title: "Champion Skins",
    storeKey: "skins",
    category: "skins",
    scale: 1.1,
  },
  {
    path: "/skinlines",
    label: "Series",
    title: "Skin Series",
    storeKey: "skinlines",
    category: "skinlines",
    scale: 1.1,
  },
];

export const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || "League Fan";
