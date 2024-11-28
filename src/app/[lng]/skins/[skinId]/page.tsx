import { languages } from "@/data/constants";
import SkinIdPage from "./skinIdPage";
import { Champion, Skins } from "@/types";

export async function generateStaticParams() {
    const skins = (await import("@/../.cache/skins.json").then((skins) => skins.default)) as { [key: string]: Skins };
    const params = languages.map(lng => (
        Object.keys(skins[lng]).map(skinId => ({ lng, skinId }))
    ).flat(1));
    return params;
}

export default async function Page({
    params,
}: {
    params: Promise<{ lng: string, skinId: string }>
}) {
    const { lng, skinId } = await params;
    return (
        <>
            <SkinIdPage params={{ lng, skinId }} />
        </>
    )
}