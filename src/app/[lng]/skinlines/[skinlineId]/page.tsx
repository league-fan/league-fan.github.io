import { SkinLine } from "@/types/skins";
import PageClient from "./pageClient"
import { languages } from "@/data/constants";

export async function generateStaticParams() {
    const items: {
        [key: string]: SkinLine[]
    } = await import("@/../.cache/skinlines.json").then((item) => item.default)
    return languages.map(lng => (
        items[lng].map(item => ({ skinlineId: item.id.toString(), lng }))
    )).flat(1);
}

export default async function Page({
    params,
}: {
    params: Promise<{ lng: string, skinlineId: string }>
}) {
    const { lng, skinlineId } = (await params)
    return (
        <PageClient params={{ lng, skinlineId }} />
    )
}