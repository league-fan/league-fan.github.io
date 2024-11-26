import { LanguageZone } from "@/types";
import { dir } from "i18next";

export default async function RootLayout({
    children
}: { children: React.ReactNode }) {
    const lng = LanguageZone.EnglishDefault
    return (
        <html lang={lng} dir={dir(lng)}>
            <head />
            <body>
                {children}
            </body>
        </html>
    );
}