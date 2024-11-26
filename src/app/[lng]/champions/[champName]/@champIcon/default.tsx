import { ChampionIcon } from "../championPage"

export default async function Page({
    params,
}: {
    params: Promise<{ champName: string }>
}) {
    const champName = (await params).champName
    return (
        <ChampionIcon champName={champName} />
    )
}