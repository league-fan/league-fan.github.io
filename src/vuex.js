import { createStore } from "vuex";

/** Shared browser state for each asset gallery page */
function galleryState() {
  return {
    previewIndex: 0,
    page: 1,
    caches: {},
  };
}

export const store = createStore({
  state() {
    return {
      slider: {
        val: 1,
      },
      settings: {
        sliderVal: 1,
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
      if (val >= 1 && val <= 6) {
        state.slider.val = val;
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
