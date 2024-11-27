import { languages } from "@/data/constants";
import Skinlines from "@/components/skinlines";
import { Entry } from "@/components/entry";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

export default async function Page() {
    return (
        <Entry withNew>
            <div className="skinlines-page">
                <Skinlines />
            </div>
        </Entry>
    )
}