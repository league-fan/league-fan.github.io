import { ChampionIcon } from "../championPage"

// export async function generateStaticParams() {
//     const { champions, lang } = useContext(PropsContext);
//     return champions.map((champ) => ({
//         lang,
//         champName: champ.alias
//     }))
// }

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