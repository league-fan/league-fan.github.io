import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import classNames from "classnames";
import logo from "@/assets/logo.png";
import { ArrowLeft } from "lucide-react";
import { HeaderMenu, HeaderMenuLanguage } from "./menu";
import { allowedLng } from "@/data/constants";

interface HeaderProps {
  lng: allowedLng;
  flat?: boolean;
  backTo?: string;
}

export function Header({ lng, flat, backTo }: HeaderProps) {
  const back =
    typeof window !== "undefined" ? (localStorage.lastIndex ?? backTo) : backTo;
  return (
    <>
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
        <HeaderMenuLanguage lng={lng} />
        <HeaderMenu />
      </header>
      <div className={styles.headerSpacer} />
    </>
  );
}
