'use client';
import { Header } from "@/components/header";
import { Footer, FooterContainer } from "@/components/footer";
import { ReactNode } from "react";
import NewAdditions from "@/components/new-additions"

interface LayoutProps {
    children: ReactNode;
    flat?: boolean;
    backTo?: string;
    withNew?: boolean;
}


export function Entry({ children, flat = false, backTo, withNew = false }: LayoutProps) {
    return (
        <FooterContainer>
            <div>
                <Header {...{ flat, backTo }} />
                {withNew && <NewAdditions />}
                {children}
            </div>
            <Footer {...{ flat }} />
        </FooterContainer>
    );
}