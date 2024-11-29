import { LanguageZone } from "@/types";

export const CDRAGON = "https://raw.communitydragon.org";
export const ROOT = "https://www.skinexplorer.lol";

export const ext_languages = [
  LanguageZone.ChineseChina,
  LanguageZone.ChineseTaiwan,
] as const;
export const fallbackLng = LanguageZone.EnglishDefault as const;
export const languages = [fallbackLng, ...ext_languages] as const;

export type allowedLng = (typeof languages)[number];
export type Langs<T> = { [key in allowedLng]: T };
