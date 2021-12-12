import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      slider: {
        val: 1,
      },
      settings: {
        sliderVal: 1,
        language: "chinese",
      },
    };
  },
  mutations: {
    changeSliderVal(state, val) {
      if (val >= 1 && val <= 6) {
        state.slider.val = val;
      }
    },
  },
});
