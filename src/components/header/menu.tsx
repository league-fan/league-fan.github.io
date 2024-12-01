"use client";

import classNames from "classnames";
import { useState } from "react";
import styles from "./styles.module.scss";
import { ExternalLink, Languages, Menu } from "lucide-react";
import { languages } from "@/data/constants";
import Link from "next/link";
import { languageZoneToName } from "@/types/languagezone";
import { usePathname, useSearchParams } from "next/navigation";

type Prop = {
  lng: string;
};

export function HeaderMenuLanguage({ lng }: Prop) {
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const langUrl = (l: string) =>
    `${pathname.replace(lng, l)}?${searchParams.toString()}`;
  return (
    <div
      className={classNames(styles.menuIcon, { [styles.open]: langOpen })}
      onClick={() => setLangOpen(!langOpen)}
    >
      <Languages />
      <ul>
        {languages
          .filter((l) => lng !== l)
          .map((l) => {
            return (
              <li key={l}>
                <Link href={langUrl(l)}>{languageZoneToName[l]}</Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export function HeaderMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className={classNames(styles.menuIcon, { [styles.open]: menuOpen })}
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <Menu />
      <ul>
        {/* <li>
                    <Link href="/shortcuts">
                        Keybinds &amp; Gestures
                    </Link>
                </li> 
                <li className={styles.divider} /> */}
        <li>
          <Link href="/changelog" as="/changelog">
            Changelog
          </Link>
        </li>
        {/* <li>
            <Link href="/about" as="/about">
              <a>About</a>
            </Link>
          </li> */}
        {/* <li>
            <Link href="/sponsor" as="/sponsor">
              <a>Sponsor</a>
            </Link>
          </li> */}
        <li className={styles.divider} />
        {/* <li>
            <a href="https://discord.gg" target="_blank" rel="noreferrer">
              Discord <ExternalLink />
            </a>
          </li> */}
        <li>
          <a
            href="https://analytics.skinexplorer.lol/share/JlbPP3v4/Skin%20Explorer"
            target="_blank"
            rel="noreferrer"
          >
            Analytics <ExternalLink />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/preyneyv/lol-skin-explorer/issues/new/choose"
            target="_blank"
            rel="noreferrer"
          >
            Bug Report <ExternalLink />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/preyneyv/lol-skin-explorer/"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub <ExternalLink />
          </a>
        </li>
      </ul>
    </div>
  );
}
