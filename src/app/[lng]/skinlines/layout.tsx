import { Entry } from "@/components/entry";

export default function SkinlineLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="skinline-layout">
            <Entry withNew>
                {children}
            </Entry>
        </div>
    )
}