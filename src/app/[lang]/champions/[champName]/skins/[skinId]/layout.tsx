import { ReactNode } from "react";

export default function SkinNameLayout({ children }: { children: ReactNode }) {
    return (
        <div className="skin-name-layout">
            {children}
        </div>
    )
}