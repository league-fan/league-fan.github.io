import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

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

function initialGalleries() {
  const galleries = {};
  // keys must match route meta.storeKey
  for (const key of GALLERY_KEYS) galleries[key] = galleryState();
  return galleries;
}

export const useMainStore = create((set, get) => ({
  settings: loadSettings(),
  galleries: initialGalleries(),

  changeSliderVal(val) {
    if (val < 1 || val > 5) return;
    const settings = { ...get().settings, sliderVal: val };
    persistSettings(settings);
    set({ settings });
  },

  setLanguage(lang) {
    if (!["chinese", "english"].includes(lang)) return;
    const settings = { ...get().settings, language: lang };
    persistSettings(settings);
    set({ settings });
  },

  setImageCdn(mode) {
    if (!["auto", "global", "cn"].includes(mode)) return;
    const settings = { ...get().settings, imageCdn: mode };
    persistSettings(settings);
    set({ settings });
  },

  setGalleryCache({ storeKey, cacheKey, data }) {
    const gallery = get().galleries[storeKey];
    if (!gallery) return;
    set((state) => ({
      galleries: {
        ...state.galleries,
        [storeKey]: {
          ...gallery,
          caches: { ...gallery.caches, [cacheKey]: data },
        },
      },
    }));
  },

  clearGalleryCaches() {
    set((state) => {
      const galleries = {};
      for (const key of GALLERY_KEYS) {
        galleries[key] = { ...state.galleries[key], caches: {} };
      }
      return { galleries };
    });
  },

  setPreviewIndex({ storeKey, id }) {
    const gallery = get().galleries[storeKey];
    if (!gallery) return;
    if (gallery.previewIndex === id) return;
    set((state) => ({
      galleries: {
        ...state.galleries,
        [storeKey]: { ...gallery, previewIndex: id },
      },
    }));
  },
}));

/** Persisted user settings + their setters, in one shallow-compared slice. */
export function useSettings() {
  return useMainStore(
    useShallow((s) => ({
      settings: s.settings,
      setLanguage: s.setLanguage,
      setImageCdn: s.setImageCdn,
      changeSliderVal: s.changeSliderVal,
    })),
  );
}
