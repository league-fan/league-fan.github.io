import { LanguageZone } from "@/types";

export const CDRAGON = "https://raw.communitydragon.org";
export const ROOT = "https://league-fan.github.io";

export const ext_languages = [
  LanguageZone.ChineseChina,
  LanguageZone.ChineseTaiwan,
  LanguageZone.ChineseMalaysia,
] as const;
export const fallbackLng = LanguageZone.EnglishDefault as const;
export const languages = [fallbackLng, ...ext_languages] as const;

export type allowedLng = (typeof languages)[number];
export type Langs<T> = { [key in allowedLng]: T };
