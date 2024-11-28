'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "@/data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getSkinlineById } from "@/data/helpers";

type skinsIdPageSearchParams = {
    type: 'champion' | 'skinline' | 'universe',
    id: string,
}

export default function SkinIdPage({
    params,
}: {
    params: { lng: string, skinId: string }
}) {
    const { champions, skins, skinlines, universes } = useContext(PropsContext)
    const { lng, skinId } = params;
    const searchParams = useSearchParams()
    const type = searchParams.get('type') || 'champion'
    let id = searchParams.get('id');
    if (!id) {
        if (type === 'champion') {
            id = champions[0].id.toString()
        }
        if (type === 'skinline') {
            id = skinlines[0].id.toString()
        }
        if (type === 'universe') {
            id = universes[0].id.toString()
        }
    }

    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
    if (!skin) return null;

    if (type === 'skinline') {
        const skinline = getSkinlineById(Number(id), skinlines)
        
    }

    return (
        <SkinProvider value={{skin}}>
            <SkinViewer
                collectionIcon={<User />}
                lng={lng}
            /></SkinProvider>
    );
}