'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "../../../../../../data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { User } from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ skinId: string }>
}) {
    const { skinId } = await params;
    const { skins } = useContext(PropsContext);
    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
    if (!skin) return null;

    return (
        <SkinProvider value={skin}>
            <SkinViewer
                collectionIcon={<User />}
            /></SkinProvider>
    );
}