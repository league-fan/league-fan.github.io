import { LanguageZone } from "@/types";
import { ext_languages } from "@/types/languagezone";

export const fallbackLng = LanguageZone.EnglishDefault;
export const languages = [fallbackLng, ...ext_languages];
export const cookieName = 'i18next'
export const defaultNS = "ui";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
    return {
        // debug: true,
        supportedLngs: languages,
        fallbackLng,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
    };
}