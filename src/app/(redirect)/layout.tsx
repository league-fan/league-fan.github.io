import { LanguageZone } from "@/types";
import "@/styles/globals.scss";
import styles from "@/styles/static.module.scss";
import { Common } from "@/components/layouts/common";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Explore latest Skins, Champions, and more",
    template: "%s | League Fan",
  },
  description:
    "Explore the latest skins, champions, and more in League of Legends. Get the latest news, updates, and more.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lng = LanguageZone.EnglishDefault;
  return (
    <html lang={lng}>
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
