import { Entry } from "@/components/entry";

export default function ChampionNameLayout({ children }: { children: React.ReactNode }) {
    return (<div className="champion-name-layout"><Entry backTo="/">{children}</Entry></div>)
}