import { LanguageZone } from "@/types";
import { dir } from "i18next";
import "@/styles/globals.scss";
import styles from "@/styles/static.module.scss";
import { Common } from "@/layouts/common";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lng = LanguageZone.EnglishDefault;
  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>
        <Common lng={lng} backTo="/">
          <div className="main-layout">
            <main className={styles.main}>{children}</main>
          </div>
        </Common>
      </body>
    </html>
  );
}
