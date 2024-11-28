'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "@/data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { Folder, User } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { getSkinlineById } from "@/data/helpers";
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
    if (!type) return redirect(`/${lng}/skins/${skinId}?type=champion&id=${champions[0].id.toString()}`);
    let id = searchParams.get('id');
    if (!id) {
        if (type === 'champion') {
            id = champions[0].id.toString()
        }
        if (type === 'skinline') {
            id = skinlines[0].id.toString()
        }
        redirect(`/${lng}/skins/${skinId}?type=${type}&id=${id}`);
    }

    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
    if (!skin) return <div>Skin Not found</div>

    const collectionIcon = type === 'champion' ? (<User />) : (<Folder />)
    const backTo = type === 'champion' ?
        `/${lng}/champions/${id}/skins` :
        `/${lng}/skinlines/${id}/skins`
    const linkTo = type === 'champion' ?
        (skin: Skin) => `/${lng}/champions/${id}/skins/${skin.id}` :
        (skin: Skin) => `/${lng}/skinlines/${id}/skins/${skin.id}`
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