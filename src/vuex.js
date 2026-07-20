import { createStore } from "vuex";

/** Shared browser state for each asset gallery page */
function galleryState() {
  return {
    /** null = unset (do not use 0 — some icons legitimately have id 0) */
    previewIndex: null,
    page: 1,
    caches: {},
  };
}

export const store = createStore({
  state() {
    return {
      slider: {
        val: 3, // density M
      },
      settings: {
        sliderVal: 3,
        display: "none",
        language: "chinese",
      },
      // keys must match route meta.storeKey / ImgFrame `name` prop
      icons: galleryState(),
      emotes: galleryState(),
      wards: galleryState(),
      loot: galleryState(),
      champions: galleryState(),
      skins: galleryState(),
    };
  },
  mutations: {
    changeSliderVal(state, val) {
      if (val >= 1 && val <= 5) {
        state.slider.val = val;
        state.settings.sliderVal = val;
      }
    },
    toggleSettings(state) {
      state.settings.display =
        state.settings.display === "none" ? "block" : "none";
    },
    setGalleryCache(state, { storeKey, lang, data }) {
      if (!state[storeKey]) return;
      state[storeKey].caches[lang] = data;
    },
  },
});
