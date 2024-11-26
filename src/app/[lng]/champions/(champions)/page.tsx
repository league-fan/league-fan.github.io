import Champions from "@/components/champions"
import { languages } from "@/data/constants";

export async function generateStaticParams() {
    return languages.map(lang => ({ lang }));
}

export default async function Page() {
    return (
        <div className="champions-page">
            <Champions />
        </div>
    )
}