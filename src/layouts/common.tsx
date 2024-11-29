import { Header } from "@/components/header";
import { Footer, FooterContainer } from "@/components/footer";
import { ReactNode } from "react";
import { LanguageZone } from "@/types";

interface LayoutProps {
    children: ReactNode;
    lng: LanguageZone;
    flat?: boolean;
    backTo?: string;
    patch?: string;
    newAddidions?: ReactNode;
}
export function Common({ children, lng, backTo, flat, patch, newAddidions }: LayoutProps) {
    return (
        <FooterContainer>
            <div>
                <Header {...{ lng, flat, backTo }} />
                {newAddidions}
                {children}
            </div>
            <Footer {...{ patch, flat }} />
        </FooterContainer>
    );
}