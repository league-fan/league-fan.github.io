'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "@/data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { Folder, User } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { Skin } from "@/types";
import { getChampionById, splitId } from "@/data/helpers";

type skinsIdPageSearchParams = {
    type: 'champion' | 'skinline',
    id: string,
}

export default function SkinIdPage({
    params,
}: {
    params: { lng: string, skinId: string }
}) {
    const { champions, skins, skinlines } = useContext(PropsContext)
    const { lng, skinId } = params;
    const searchParams = useSearchParams()
    const type = searchParams.get('type');

    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
    if (!skin) return <div>Skin Not found</div>

    if (!type || type !== 'champion' && type !== 'skinline') {
        const defaultChampion = getChampionById(splitId(Number(skinId))[0], champions);
        if (!defaultChampion) return <div>Champion Not found</div>
        return redirect(`/${lng}/skins/${skinId}?type=champion&id=${defaultChampion.alias.toString()}`);
    }
    let id = searchParams.get('id');
    if (!id) {
        if (type === 'champion') {
            const defaultChampion = getChampionById(splitId(Number(skinId))[0], champions);
            if (!defaultChampion) return <div>Champion Not found</div>
            id = defaultChampion.alias.toString()
        }
        if (type === 'skinline') {
            const defaultSkinline = skin.skinLines;
            if (!defaultSkinline) return <div>Skinline Not found</div>
            id = defaultSkinline[0].id.toString()
        }
        redirect(`/${lng}/skins/${skinId}?type=${type}&id=${id}`);
    }

    if (!skin) return <div>Skin Not found</div>

    const collectionIcon = type === 'champion' ? (<User />) : (<Folder />)
    const backTo = `/${lng}/skins?type=${type}&id=${id}`
    const linkTo = (skin: Skin) => `/${lng}/skins/${skin.id}?type=${type}&id=${id}`
    return (
        <SkinProvider value={{ skin }}>
            <SkinViewer
                params={{
                    collectionIcon,
                    backTo,
                    linkTo,
                }}
            /></SkinProvider>
    );
}