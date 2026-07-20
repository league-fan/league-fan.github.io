import License from "./views/Licence.vue";
import NotFound from "./views/NotFound.vue";

const baseUrl = import.meta.env.VITE_BASE_URL || "";

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    path: baseUrl + "/",
    name: "icons",
    component: () => import("./views/AssetBrowserPage.vue"),
    meta: {
      title: "Summoner Icons",
      storeKey: "icons",
      category: "summoner-icons",
      scale: 1.5,
    },
  },
  {
    path: baseUrl + "/summoner-emotes",
    name: "emotes",
    component: () => import("./views/AssetBrowserPage.vue"),
    meta: {
      title: "Summoner Emotes",
      storeKey: "emotes",
      category: "summoner-emotes",
      scale: 1.5,
    },
  },
  {
    path: baseUrl + "/ward-skins",
    name: "wards",
    component: () => import("./views/AssetBrowserPage.vue"),
    meta: {
      title: "Ward Skins",
      storeKey: "wards",
      category: "ward-skins",
      scale: 1.2,
    },
  },
  {
    path: baseUrl + "/loot",
    name: "loot",
    component: () => import("./views/AssetBrowserPage.vue"),
    meta: {
      title: "Hextech Chests",
      storeKey: "loot",
      category: "loot",
      scale: 1.2,
    },
  },
  {
    path: baseUrl + "/champions",
    name: "champions",
    component: () => import("./views/AssetBrowserPage.vue"),
    meta: {
      title: "Champions",
      storeKey: "champions",
      category: "champions",
      scale: 1.5,
    },
  },
  {
    path: baseUrl + "/skins",
    name: "skins",
    component: () => import("./views/AssetBrowserPage.vue"),
    meta: {
      title: "Champion Skins",
      storeKey: "skins",
      category: "skins",
      scale: 1.1,
    },
  },
  {
    path: baseUrl + "/license",
    name: "license",
    meta: { title: "License" },
    component: License,
  },
  // legacy redirects
  {
    path: baseUrl + "/summoner-skins",
    redirect: baseUrl + "/skins",
  },
  { path: "/:path(.*)", component: NotFound },
];
