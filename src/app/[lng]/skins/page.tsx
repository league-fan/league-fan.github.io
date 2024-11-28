import { languages } from "@/data/constants";
import SkinGridPage from "./skinGridPage";
import { Suspense } from "react";

export async function generateStaticParams() {
    return languages.map(lng => (
        { lng }
    ));
}

export default async function Page({
    params,
}: {
    params: Promise<{ lng: string }>
}) {
    const { lng } = (await params)
    return (
        <Suspense>
            <SkinGridPage params={{ lng }} />
        </Suspense>
    )
}