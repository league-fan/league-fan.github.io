'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { SkinProvider } from "../../../../../../data/skinContext";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";
import { User } from "lucide-react";

export default function SkinPage({
    params,
}: {
    params: { lng: string, skinId: string }
}) {
    const { lng, skinId } = params;
    const { skins } = useContext(PropsContext);
    const skin = Object.values(skins).find(skin => skin.id.toString() === skinId);
    if (!skin) return null;

    return (
        <SkinProvider value={skin}>
            <SkinViewer
                collectionIcon={<User />}
                lng={lng}
            /></SkinProvider>
    );
}