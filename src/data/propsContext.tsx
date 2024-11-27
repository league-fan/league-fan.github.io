'use client'
import { getAddedSkins } from '@/data/helpers';
import Patch from '@/data/patch';
import { Champion, Changes, LanguageZone, Skin, Skinline, Skins, Universe } from '@/types';
import { createContext, ReactNode } from 'react'

export interface SkinWithKey extends Skin {
    $$alias: string;
}

export interface PropsContextType {
    skins: Skins;
    champions: Champion[];
    skinlines: Skinline[];
    universes: Universe[];
    changes: Changes;
    addedSkins: SkinWithKey[];
    patch: string;
    lng: LanguageZone;
}
const value: PropsContextType = {
    skins: {},
    champions: [],
    addedSkins: [],
    skinlines: [],
    universes: [],
    changes: {},
    patch: '',
    lng: LanguageZone.EnglishDefault
};

const PropsContext = createContext<PropsContextType>(value);
PropsContext.displayName = "PropsContext";

function PropsProvider({
    children, value
}: {
    children: ReactNode,
    value: LanguageZone
}) {
    const lng = value || LanguageZone.EnglishDefault;
    const patch = new Patch(lng)
    const addedSkins = getAddedSkins(patch.added, patch.skins, patch.champions)
    const props: PropsContextType = {
        skins: patch.skins,
        champions: patch.champions,
        addedSkins: addedSkins,
        skinlines: patch.skinlines,
        universes: patch.universes,
        changes: patch.changes,
        patch: patch.fullVersionString,
        lng
    }
    return <PropsContext.Provider value={props} > {children} </PropsContext.Provider>
}

export { PropsContext, PropsProvider }