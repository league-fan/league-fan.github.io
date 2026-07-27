/**
 * Image CDN selection: international (CommunityDragon) vs China (Tencent gtimg).
 *
 * Modes:
 * - "auto"   — probe raw.communitydragon.org once per session; fall back to cn
 * - "global" — always CommunityDragon (URLs as shipped in the data)
 * - "cn"     — rewrite known image kinds to game.gtimg.cn (fast in mainland China)
 */

/** @typedef {"auto" | "global" | "cn"} ImageCdnSetting */
/** @typedef {"global" | "cn"} ImageCdnMode */

const GTIMG = "https://game.gtimg.cn/images/lol/act/img";

/** Tiny CDragon asset used for the reachability probe. */
const PROBE_URL =
  "https://raw.communitydragon.org/latest/content-metadata.json";
const PROBE_TIMEOUT_MS = 3000;
const PROBE_STORAGE_KEY = "lf-cdn-probe";

/** @type {Promise<ImageCdnMode> | null} */
let probePromise = null;

/** Probe CommunityDragon once per session; "cn" when unreachable/slow. */
function probeGlobalReachable() {
  if (probePromise) return probePromise;
  try {
    const cached = sessionStorage.getItem(PROBE_STORAGE_KEY);
    if (cached === "global" || cached === "cn") {
      probePromise = Promise.resolve(/** @type {ImageCdnMode} */ (cached));
      return probePromise;
    }
  } catch {
    /* sessionStorage unavailable — probe every load */
  }
  probePromise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    /** @type {ImageCdnMode} */
    let mode = "global";
    try {
      await fetch(PROBE_URL, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
    } catch {
      mode = "cn";
    } finally {
      clearTimeout(timer);
    }
    try {
      sessionStorage.setItem(PROBE_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    return mode;
  })();
  return probePromise;
}

/**
 * Resolve the effective CDN mode for a user setting.
 * @param {ImageCdnSetting} setting
 * @returns {Promise<ImageCdnMode>}
 */
export function resolveImageCdnMode(setting) {
  if (setting === "global" || setting === "cn") {
    return Promise.resolve(setting);
  }
  return probeGlobalReachable();
}

/* ---------- gtimg URL builders (verified patterns) ---------- */

/** Skin tile / grid thumbnail (~2 KB). */
export function gtimgSkinSmall(instanceId) {
  return `${GTIMG}/skin/small_${instanceId}.jpg`;
}

/** Skin splash (~100 KB). */
export function gtimgSkinBig(instanceId) {
  return `${GTIMG}/skin/big_${instanceId}.jpg`;
}

/** Skin loading screen. */
export function gtimgSkinLoading(instanceId) {
  return `${GTIMG}/skinloading/${instanceId}.jpg`;
}

/** Champion square avatar by alias, e.g. "Annie". */
export function gtimgChampionAvatar(alias) {
  return alias ? `${GTIMG}/champion/${alias}.png` : "";
}

/* ---------- skinId → gtimg instanceId map (published by league-fan-assets) ---------- */

/** @type {Promise<Record<string, string> | null> | null} */
let tencentMapPromise = null;

/**
 * Load the skinId → Tencent instanceId map from the data CDN.
 * Optional data: resolves to null when the file is not published yet.
 * @param {string} assetsBase e.g. https://…workers.dev/latest
 * @returns {Promise<Record<string, string> | null>}
 */
export function loadTencentSkinMap(assetsBase) {
  if (!assetsBase || assetsBase === "cdragon") return Promise.resolve(null);
  if (!tencentMapPromise) {
    tencentMapPromise = fetch(`${assetsBase}/default__tencent-cdn.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => (json && json.skins ? json.skins : null))
      .catch(() => null);
  }
  return tencentMapPromise;
}
