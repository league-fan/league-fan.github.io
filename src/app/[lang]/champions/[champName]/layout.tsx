'use client';
import { Header } from "@/components/header";
import { Footer, FooterContainer } from "@/components/footer";
import { ReactNode } from "react";
import styles from '@/styles/collection.module.scss'

export default function ChampionNameLayout({ children, champIcon }: { children: ReactNode, champIcon: ReactNode }) {
    return (
        <div className={styles.container}>
            <FooterContainer>
                <div>
                    <div className={styles.background}>
                        {champIcon}
                    </div>
                    <Header backTo="/" flat />
                    <main>
                        {children}
                    </main>
                </div>
                <Footer flat />
            </FooterContainer>
        </div>
    )
}