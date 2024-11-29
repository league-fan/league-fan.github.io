'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "@/data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { Folder, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Skin } from "@/types";
import NotFound from "@/components/notFound";

type skinsIdPageSearchParams = {
    type: 'champion' | 'skinline',
    id: string, // champion.alias.toString() | skinline.id.toString()
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
    if (!type || (type !== 'champion' && type !== 'skinline')) {
        return <NotFound params={{ title: 'SearchParam `type` is missing or invalid' }} />
    }
    const id = searchParams.get('id');
    if (!id) {
        return <NotFound params={{ title: 'SearchParam `id` is missing' }} />
    }

    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
    if (!skin) return <NotFound params={{ title: `Skin ${skinId} not found` }} />

    const collectionIcon = type === 'champion' ? (<User />) : (<Folder />)
    const backTo = `/${lng}/skins?type=${type}&id=${id}`
    const linkTo = (skin: Skin) => `/${lng}/skins/${skin.id}?type=${type}&id=${id}`
    return (
        <SkinProvider value={{ skin, type, id }}>
            <SkinViewer
                params={{
                    collectionIcon,
                    backTo,
                    linkTo,
                }}
            /></SkinProvider>
    );
}