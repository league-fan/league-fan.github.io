import { Entry } from "@/components/entry";

export default function ChampionLayout({ children }: { children: React.ReactNode }) {
    return (<div className="champion-layout"><Entry withNew>{children}</Entry></div>)
}