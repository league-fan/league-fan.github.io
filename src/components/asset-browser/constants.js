/** Density = min card width; the grid always auto-fills the available space. */
export const DENSITY_OPTIONS = [
  { id: 1, name: "XS (dense)", minPx: 88 },
  { id: 2, name: "S", minPx: 110 },
  { id: 3, name: "M", minPx: 140 },
  { id: 4, name: "L", minPx: 180 },
  { id: 5, name: "XL", minPx: 240 },
];

export const PAGE_SIZE_OPTIONS = [48, 72, 96, 120, 160, 240];

export const INITIAL_FILTERS = {
  rarities: [],
  legacy: "all", // all | yes | no
  base: "hide", // all | hide | only
  hasChroma: "all", // all | yes | no
  championId: "",
  skinlineId: "",
};
