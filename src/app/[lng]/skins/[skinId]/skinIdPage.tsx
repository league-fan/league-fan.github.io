'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "@/data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { Folder, User } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { Skin } from "@/types";

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
    if (!type || type !== 'champion' && type !== 'skinline') return redirect(`/${lng}/skins/${skinId}?type=champion&id=${champions[0].alias.toString()}`);
    let id = searchParams.get('id');
    if (!id) {
        if (type === 'champion') {
            id = champions[0].alias.toString()
        }
        if (type === 'skinline') {
            id = skinlines[0].id.toString()
        }
        redirect(`/${lng}/skins/${skinId}?type=${type}&id=${id}`);
    }

    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
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