// source: https://medium.com/@Hsu.Yang-Min/i18next-%E8%AE%93%E4%BD%A0%E7%9A%84-next-js-%E5%B0%88%E6%A1%88%E8%BC%95%E9%AC%86%E5%88%87%E6%8F%9B%E8%AA%9E%E7%B3%BB-7e057791d601

import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions } from "./settings";

const initI18next = async (lng: string, ns: string) => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(
            resourcesToBackend(
                (lng: string, ns: string) => import(`./locales/${ns}/${lng}.json`)
            )
        )
        .init(getOptions({lng, ns}));
    return i18nInstance;
};

export async function useTranslation(lng: string, ns: string, options = {}) {
    const i18nextInstance = await initI18next(lng, ns);
    return {
        t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
        i18n: i18nextInstance,
    };
}