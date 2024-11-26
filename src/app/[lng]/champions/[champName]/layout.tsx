'use client';
import { Header } from "@/components/header";
import { Footer, FooterContainer } from "@/components/footer";
import { ReactNode, useContext } from "react";
import styles from '@/styles/collection.module.scss'
import { PropsContext } from "@/data/propsContext";

export default function ChampionNameLayout({ children, champIcon }: { children: ReactNode, champIcon: ReactNode }) {
    const {lang} = useContext(PropsContext);
    return (
        <div className={styles.container}>
            <FooterContainer>
                <div>
                    <div className={styles.background}>
                        {champIcon}
                    </div>
                    <Header backTo={`/${lang}/champions`} flat />
                    <main>
                        {children}
                    </main>
                </div>
                <Footer flat />
            </FooterContainer>
        </div>
    )
}