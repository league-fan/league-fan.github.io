import { languages, fallbackLng } from "@/data/constants";
export const cookieName = "i18next";
export const defaultNS = "ui";

export function getOptions({ lng, ns }: { lng?: string; ns?: string }) {
  lng = lng || fallbackLng;
  ns = ns || defaultNS;
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
