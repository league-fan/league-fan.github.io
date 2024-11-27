import { languages } from "@/data/constants";
import Skinlines from "@/components/skinlines";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

export default async function Page() {
    return (
        <div className="skinlines-page">
            <Skinlines />
        </div>
    )
}