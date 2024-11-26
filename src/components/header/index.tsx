import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import classNames from "classnames";
import logo from "@/assets/logo.png";
import { useEscapeTo } from "@/data/helpers";
import { ArrowLeft, ExternalLink, Languages, Menu, Search, X } from "lucide-react";
import { useContext, useState } from "react";
import { useTranslation } from "@/i18n/client";
import { PropsContext } from "@/data/propsContext";
import { languages } from "@/data/constants";
import { usePathname, useRouter } from "next/navigation";
import { languageZoneToName } from "@/types/languagezone";

interface HeaderProps {
  flat?: boolean;
  backTo?: string;
}

export function Header({ flat, backTo }: HeaderProps = { flat: false }) {
  const back =
    typeof window !== "undefined" ? localStorage.lastIndex ?? backTo : backTo;
  useEscapeTo(back);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang } = useContext(PropsContext);
  const { t } = useTranslation(lang, "ui");
  const pathname = usePathname();
  return (<>
    <header
      className={classNames(styles.header, {
        [styles.flat]: flat,
      })}
    >
      <Link href={back ?? "/"} as={back ?? "/"} className={styles.logo}>

        {backTo && <ArrowLeft />}
        <Image
          unoptimized
          priority
          src={logo}
          alt="Skin Explorer"
          height={36}
          width={178}
        />

      </Link>
      <div
        className={classNames(styles.menuIcon, { [styles.open]: menuOpen })}
        onClick={() => setLangOpen(!langOpen)}
      >
        <Languages />
        <ul>
          {languages
            .filter((l) => lang !== l)
            .map((l) => {
              return (
                <li key={l}>
                  <Link href={pathname.replace(lang, l)}>
                    {languageZoneToName[l]}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <div
        className={classNames(styles.menuIcon, { [styles.open]: menuOpen })}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu />
        <ul>
          <li>
            <Link href="/shortcuts">
              Keybinds &amp; Gestures
            </Link>
          </li>
          <li className={styles.divider} />
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
    </header>
    <div className={styles.headerSpacer} />
  </>);
};
