import "@/styles/globals.scss";
import { ReactNode } from "react";
import { dir } from "i18next";
import { fallbackLng, languages } from "@/data/constants";
import { PropsProvider } from "@/data/propsContext";
import { redirect } from "next/navigation";
import { LanguageZone } from "@/types";

type RootLayoutProps = { children: ReactNode; params: Promise<{ lng: string }> };

export default async function RootLayout({
    children,
    params,
}: RootLayoutProps) {
    const { lng } = await params;
    if (!languages.includes(lng as LanguageZone)) {
        redirect(`/${fallbackLng}/champions`);
    }

    return (
        <html lang={lng} dir={dir(lng)}>
            <head />
            <body>
                <PropsProvider value={lng as LanguageZone}>
                    {children}
                </PropsProvider>
            </body>
        </html>
    );
}