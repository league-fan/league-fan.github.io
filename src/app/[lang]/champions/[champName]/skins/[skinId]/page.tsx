import SkinPage from "./skinPage";

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string, skinId: string }>
}) {
    const { skinId } = await params;
    return (
        <>
            <SkinPage params={{ skinId }} />
        </>
    )
}