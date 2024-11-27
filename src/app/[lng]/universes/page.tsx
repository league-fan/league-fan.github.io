import { Entry } from "@/components/entry";
import Universes from "@/components/universes";
import { languages } from "@/data/constants";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

export default async function Page() {
    return (
        <Entry withNew>
            <div className="skinlines-page">
                <Universes />
            </div>
        </Entry>
    )
}