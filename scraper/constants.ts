/* URLs */
export const CDRAGON = "https://raw.communitydragon.org";

/* Globals */
/**
 * The lowest patch version that the website supports.
 * This patch was selected since it's the earliest patch that CommunityDragon
 * holds.
 */
export const MIN_SUPPORTED_VERSION = [7, 1];

/* Store Configuration */
/**
 * Minimum interval in between store updates, in seconds.
 */
export const REVALIDATE_INTERVAL = 60;

/* Skin Changes Scraping */
export const ALIASES: Record<string, string> = {
  "Nunu Bot": "Nunu & Willump Bot",
};

export const IGNORED_WARNINGS = [
  // Unmasked Kayle => Transcended Kayle, 9.5
  "Unmasked Kayle",
  // Crimson Akali => Infernal Akali, 8.15
  "Crimson Akali",
];

export const SKIN_SCRAPE_INTERVAL = 3600; // 1 hour

export const SUBSTITUTIONS: Record<string, string> = {
  monkeyking: "wukong",
};

export const WIKI_SUBSTITUTIONS: Record<string, string> = {
  "Nunu & Willump": "Nunu",
};
