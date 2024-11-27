import { LanguageZone } from "@/types";
import { dir } from "i18next";
import { Entry } from "@/components/entry";
import "@/styles/globals.scss";
import styles from "@/styles/static.module.scss";

export default async function RootLayout({
    children
}: { children: React.ReactNode }) {
    const lng = LanguageZone.EnglishDefault
    return (
        <html lang={lng} dir={dir(lng)}>
            <head />
            <body>
                <div className="main-layout">
                    <Entry backTo="/">
                        <main className={styles.main}>{children}</main>
                    </Entry>
                </div>
            </body>
        </html>
    );
}