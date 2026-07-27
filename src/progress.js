import { create } from "zustand";

/**
 * Top-of-viewport load bar. Lives outside React so data loaders and image
 * `onLoad` handlers can drive it without prop drilling (replaces the Vue
 * `$Progress` global from vue3-progressbar).
 */

const TRICKLE_MS = 200;
const HIDE_DELAY_MS = 400;

let trickleTimer = null;
let hideTimer = null;

function stopTimers() {
  clearInterval(trickleTimer);
  clearTimeout(hideTimer);
  trickleTimer = null;
  hideTimer = null;
}

export const useProgress = create((set, get) => ({
  /** 0–100 */
  value: 0,
  visible: false,
  failed: false,

  start() {
    stopTimers();
    set({ value: 8, visible: true, failed: false });
    // Creep toward 90% so the bar keeps moving during a slow fetch
    trickleTimer = setInterval(() => {
      const { value, visible } = get();
      if (!visible) return;
      if (value >= 90) return;
      set({ value: value + Math.max(0.4, (90 - value) * 0.08) });
    }, TRICKLE_MS);
  },

  set(value) {
    const next = Math.min(100, Math.max(0, value));
    set({ value: next, visible: next > 0, failed: false });
  },

  increase(delta) {
    const next = Math.min(99, get().value + delta);
    set({ value: next, visible: next > 0 });
  },

  finish() {
    stopTimers();
    set({ value: 100 });
    hideTimer = setTimeout(() => set({ visible: false, value: 0 }), HIDE_DELAY_MS);
  },

  fail() {
    stopTimers();
    set({ value: 100, failed: true });
    hideTimer = setTimeout(
      () => set({ visible: false, value: 0, failed: false }),
      HIDE_DELAY_MS * 2,
    );
  },
}));

/** Imperative handle for non-component callers. */
export const progress = {
  start: () => useProgress.getState().start(),
  set: (v) => useProgress.getState().set(v),
  increase: (v) => useProgress.getState().increase(v),
  finish: () => useProgress.getState().finish(),
  fail: () => useProgress.getState().fail(),
};
