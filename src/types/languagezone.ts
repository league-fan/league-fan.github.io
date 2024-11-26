export enum LanguageZone {
    Default = "default",
    Arabic = "ar_ae",
    Czech = "cs_cz",
    German = "de_de",
    Greek = "el_gr",
    EnglishDefault = "en",
    EnglishAustralia = "en_au",
    EnglishGreatBritain = "en_gb",
    EnglishPhilippines = "en_ph",
    EnglishSingapore = "en_sg",
    SpanishArgentina = "es_ar",
    SpanishSpain = "es_es",
    SpanishMexico = "es_mx",
    FrenchFrance = "fr_fr",
    Hungarian = "hu_hu",
    Italian = "it_it",
    Japanese = "ja_jp",
    Korean = "ko_kr",
    Polish = "pl_pl",
    PortugueseBrazil = "pt_br",
    Romanian = "ro_ro",
    Russian = "ru_ru",
    Thai = "th_th",
    Turkish = "tr_tr",
    Vietnamese = "vi_vn",
    ChineseChina = "zh_cn",
    ChineseMalaysia = "zh_my",
    ChineseTaiwan = "zh_tw",
}

export const languageZoneToBCP47: Record<LanguageZone, string> = {
    [LanguageZone.Default]: "und",
    [LanguageZone.Arabic]: "ar-AE",
    [LanguageZone.Czech]: "cs-CZ",
    [LanguageZone.German]: "de-DE",
    [LanguageZone.Greek]: "el-GR",
    [LanguageZone.EnglishDefault]: "en",
    [LanguageZone.EnglishAustralia]: "en-AU",
    [LanguageZone.EnglishGreatBritain]: "en-GB",
    [LanguageZone.EnglishPhilippines]: "en-PH",
    [LanguageZone.EnglishSingapore]: "en-SG",
    [LanguageZone.SpanishArgentina]: "es-AR",
    [LanguageZone.SpanishSpain]: "es-ES",
    [LanguageZone.SpanishMexico]: "es-MX",
    [LanguageZone.FrenchFrance]: "fr-FR",
    [LanguageZone.Hungarian]: "hu-HU",
    [LanguageZone.Italian]: "it-IT",
    [LanguageZone.Japanese]: "ja-JP",
    [LanguageZone.Korean]: "ko-KR",
    [LanguageZone.Polish]: "pl-PL",
    [LanguageZone.PortugueseBrazil]: "pt-BR",
    [LanguageZone.Romanian]: "ro-RO",
    [LanguageZone.Russian]: "ru-RU",
    [LanguageZone.Thai]: "th-TH",
    [LanguageZone.Turkish]: "tr-TR",
    [LanguageZone.Vietnamese]: "vi-VN",
    [LanguageZone.ChineseChina]: "zh-CN",
    [LanguageZone.ChineseMalaysia]: "zh-MY",
    [LanguageZone.ChineseTaiwan]: "zh-TW",
};

// 创建一个字典来映射 BCP47 语言标签到 LanguageZone
export const bcp47ToLanguageZone: Record<string, LanguageZone> = Object.fromEntries(
    Object.entries(languageZoneToBCP47).map(([key, value]) => [value, key as LanguageZone])
);

export type LangAssets<T> = Partial<Record<LanguageZone, T>>;

export const ext_languages = [LanguageZone.ChineseChina, LanguageZone.ChineseTaiwan];