import { defineStore } from "pinia";

const SETTINGS_STORAGE_KEY = "lf-settings";

/** Shared browser state for each asset gallery page */
function galleryState() {
  return {
    /** null = unset (do not use 0 — some icons legitimately have id 0) */
    previewIndex: null,
    caches: {},
  };
}

function loadSettings() {
  const defaults = {
    sliderVal: 3,
    language: "chinese",
    /** auto | global | cn — image CDN preference (see services/cdn.js) */
    imageCdn: "auto",
  };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    return {
      sliderVal:
        saved.sliderVal >= 1 && saved.sliderVal <= 5
          ? saved.sliderVal
          : defaults.sliderVal,
      language: ["chinese", "english"].includes(saved.language)
        ? saved.language
        : defaults.language,
      imageCdn: ["auto", "global", "cn"].includes(saved.imageCdn)
        ? saved.imageCdn
        : defaults.imageCdn,
    };
  } catch {
    return defaults;
  }
}

function persistSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* private mode / quota — non-fatal */
  }
}

export const GALLERY_KEYS = [
  "icons",
  "emotes",
  "wards",
  "loot",
  "champions",
  "skins",
  "skinlines",
];

export const useMainStore = defineStore("main", {
  state: () => {
    const base = {
      settings: loadSettings(),
    };
    // keys must match route meta.storeKey / ImgFrame `name` prop
    for (const key of GALLERY_KEYS) base[key] = galleryState();
    return base;
  },
  actions: {
    changeSliderVal(val) {
      if (val >= 1 && val <= 5) {
        this.settings.sliderVal = val;
        persistSettings(this.settings);
      }
    },
    setLanguage(lang) {
      if (!["chinese", "english"].includes(lang)) return;
      this.settings.language = lang;
      persistSettings(this.settings);
    },
    setImageCdn(mode) {
      if (!["auto", "global", "cn"].includes(mode)) return;
      this.settings.imageCdn = mode;
      persistSettings(this.settings);
    },
    setGalleryCache({ storeKey, cacheKey, data }) {
      if (!this[storeKey]) return;
      this[storeKey].caches[cacheKey] = data;
    },
    clearGalleryCaches() {
      for (const key of GALLERY_KEYS) {
        this[key].caches = {};
      }
    },
    setPreviewIndex({ storeKey, id }) {
      if (!this[storeKey]) return;
      this[storeKey].previewIndex = id;
    },
  },
});
