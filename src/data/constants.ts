import { LanguageZone } from "@/types";

export const CDRAGON = "https://raw.communitydragon.org";
export const ROOT = "https://www.skinexplorer.lol";

export const ext_languages = [LanguageZone.ChineseChina, LanguageZone.ChineseTaiwan];
export const fallbackLng = LanguageZone.EnglishDefault;
export const languages = [fallbackLng, ...ext_languages];