import { languages, fallbackLng } from "@/data/constants";
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