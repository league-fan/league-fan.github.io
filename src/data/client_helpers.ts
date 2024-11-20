
'use client'

import { useEffect, useState } from "react";
import { CDRAGON } from "./constants";
import { useRouter } from "next/navigation";

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

interface AssetOptions {
    patch?: string;
    lang?: string;
}

export function asset(path: string, { patch = "pbe", lang = 'default' }: AssetOptions = {}) {
    return path.replace("/lol-game-data/assets", dataRoot({ patch, lang })).toLowerCase();
}

function isTextBox(element: Element | null) {
    if (!element) return false;
    var tagName = element.tagName.toLowerCase();
    if (tagName === "textarea") return true;
    if (tagName !== "input") return false;
    var type = element.getAttribute("type")?.toLowerCase() || "",
        // if any of these input types is not supported by a browser, it will behave as input type text.
        inputTypes = [
            "text",
            "password",
            "number",
            "email",
            "tel",
            "url",
            "search",
            "date",
            "datetime",
            "datetime-local",
            "time",
            "month",
            "week",
        ];
    return inputTypes.indexOf(type) >= 0;
}

export function useEscapeTo(url: string) {
    const router = useRouter();
    useEffect(() => {
        function onKeyDown(e: { code: string; preventDefault: () => void; }) {
            if (isTextBox(document.activeElement)) return; // Ignore events when an input is active.
            if (e.code === "Escape") {
                router.push(url);
                e.preventDefault();
            }
        }

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [router, url]);
}