import { Entry } from "@/components/entry";

export default function UniverseLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="universe-layout">
            <Entry withNew>
                {children}
            </Entry>
        </div>
    )
}