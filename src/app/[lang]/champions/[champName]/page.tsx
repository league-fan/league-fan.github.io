
import { useContext } from "react";
import { PropsContext } from "@/app/props";
import ChampionPage from "./championPage";

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
        <ChampionPage champName={champName} />
    )
}