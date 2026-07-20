import {
  createClient,
  type AssetCategory,
  type CosmeticsCategory,
  type Lang,
} from "@magicwenli/league-fan-assets";

type UiLang = "chinese" | "english";

const langMap: Record<UiLang, Lang> = {
  chinese: "zh_cn",
  english: "default",
};

type LoadableCategory = CosmeticsCategory;

/**
 * Thin adapter for vue@1 views.
 * Loads via CDragon (live) through the shared assets lib.
 * Prefer release source once data-v* snapshots are published.
 */
class Grab {
  public lang: UiLang;

  constructor(lang: UiLang) {
    this.lang = lang;
  }

  private client(uiLang: UiLang = this.lang) {
    return createClient({
      lang: langMap[uiLang] ?? "default",
      // Live until GitHub data releases exist for v2:
      source: { kind: "cdragon", patch: "latest" },
    });
  }

  /**
   * Returns `{ data }` to stay drop-in compatible with former axios usage.
   */
  async get(assets: LoadableCategory | string, lang: UiLang = this.lang) {
    const category = assets as AssetCategory;
    const data = await this.client(lang).load(category);
    return { data };
  }
}

export default Grab;
