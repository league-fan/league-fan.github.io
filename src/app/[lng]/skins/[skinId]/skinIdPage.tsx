'use client'

import { SkinViewer } from "@/components/skin-viewer";
import { ReactNode } from "react";
import { Folder, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Champion, Skin, Skinline } from "@/types";
import NotFound from "@/components/notFound";
import { allowedLng } from "@/data/constants";

type Props = {
    lng: allowedLng,
    skin: Skin,
    skinSkinlines: Skinline[],
    skinSkinlineSkins: { [key: string]: Skin[] },
    skinChamp: Champion,
    skinChampSkins: Skin[],
    popup: ReactNode
}
const allowType = ['champion', 'skinline'];

export default function SkinIdPage({ lng, skin, skinSkinlines, skinSkinlineSkins, skinChamp, skinChampSkins, popup }: Props) {
    const searchParams = useSearchParams()
    const type = searchParams.get('type');
    if (!type || !allowType.includes(type)) return <NotFound title="Type not found" lng={lng} back={`/${lng}/champions`} />;
    let id = searchParams.get('id');
    const validId = (type: string, id: string) => {
        if (type === 'champion') return skinChamp.alias === id;
        if (type === 'skinline') return skinSkinlines.some(s => s.id.toString() === id);
        return false;
    }
    if (!id || !validId(type, id)) return <NotFound title="Id not found" lng={lng} back={`/${lng}/champions`} />;


    const skinSkinline = skinSkinlines.find(s => s.id.toString() === id) as Skinline;
    const collectionName = type === 'champion' ? skinChamp.name : skinSkinline.name;
    const collectionIcon = type === 'champion' ? (<User />) : (<Folder />)
    const backTo = `/${lng}/skins?type=${type}&id=${id}`
    const linkTo = (skin: Skin) => `/${lng}/skins/${skin.id}?type=${type}&id=${id}`
    const skinCollection = type === 'champion' ? skinChampSkins : skinSkinlineSkins[id];
    
    return (
        <SkinViewer
            skin={skin}
            collectionName={collectionName}
            collectionIcon={collectionIcon}
            backTo={backTo}
            linkTo={linkTo}
            skinCollection={skinCollection}
            popup={popup}
        />
    );
}