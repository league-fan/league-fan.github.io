'use client'
import { ChampionIcon, ChampionPage } from "./championPage";
import styles from '@/styles/collection.module.scss'
import { Footer, FooterContainer } from "@/components/footer";
import { Header } from "@/components/header";
export default function PageClient({ params }: { params: { lng: string, champName: string } }) {
    const { lng, champName } = params

    return (
        <div className={styles.container}>
            <FooterContainer>
                <div>
                    <div className={styles.background}>
                        <ChampionIcon champName={champName} />
                    </div>
                    <Header backTo={`/${lng}/champions`} flat />
                    <main>
                        <ChampionPage lng={lng} champName={champName} />
                    </main>
                </div>
                <Footer flat />
            </FooterContainer>
        </div>
    )
}