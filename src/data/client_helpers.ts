
'use client'

import { useEffect, useState } from "react";
import { CDRAGON } from "./constants";

export function useLocalStorageState(name: string, initialValue: any) {
    const [value, _setValue] = useState(initialValue);
    useEffect(() => {
        localStorage[name] && _setValue(JSON.parse(localStorage[name]));
    }, [name]);

    const setValue = (v: any) => {
        _setValue(v);
        localStorage[name] = JSON.stringify(v);
    };
    return [value, setValue];
}

export function dataRoot({ patch = "pbe", lang = 'default' }) {
    return `${CDRAGON}/${patch}/plugins/rcp-be-lol-game-data/global/${lang}`;
}

export function asset(path: string, { patch = "pbe", lang = 'default' }) {
    return path.replace("/lol-game-data/assets", dataRoot({ patch, lang })).toLowerCase();
}