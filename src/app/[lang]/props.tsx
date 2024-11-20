'use client'
import { Champion, Skin, Skins } from '@/types';
import { createContext, ReactNode } from 'react'

interface SkinWithKey extends Skin {
    $$key: string;
}

export interface PropsContextType {
    skins: Skins;
    champions: Champion[];
    addedSkins: SkinWithKey[];
    patch: string;
    lang: string;
}
const value: PropsContextType = {
    skins: {},
    champions: [],
    addedSkins: [],
    patch: '',
    lang: 'default'
};

const PropsContext = createContext<PropsContextType>(value);
PropsContext.displayName = "PropsContext";

function PropsProvider({
    children, value
}: {
    children: ReactNode,
    value: PropsContextType
}) {
    return <PropsContext.Provider value={value} > {children} </PropsContext.Provider>
}

export { PropsContext, PropsProvider }