import Champions from "@/components/champions"
import { Entry } from "@/components/entry";
import { languages } from "@/data/constants";

export async function generateStaticParams() {
    return languages.map(lng => ({ lng }));
}

export default async function Page() {
    return (
        <Entry withNew>
            <div className="champions-page">
                <Champions />
            </div>
        </Entry>
    )
}