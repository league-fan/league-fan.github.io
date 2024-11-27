import Universes from "@/components/universes";
import { languages } from "@/data/constants";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

export default async function Page() {
    return (
        <div className="skinlines-page">
            <Universes />
        </div>
    )
}