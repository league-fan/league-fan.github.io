'use client';
import classNames from "classnames";
import { User, Globe, Folder } from "lucide-react";
import Link from "next/link";
import styles from "@/styles/index.module.scss";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";

interface NavProps {
  active: string;
  filters?: React.ReactNode;
}

export function Nav({ active, filters }: NavProps) {
  const { lng } = useContext(PropsContext);
  return (
    (<nav>
      <div className={styles.tabs}>
        <Link
          href={`/${lng}/champions`}
          as={`/${lng}/champions`}
          className={classNames({
            [styles.active]: active === "champions",
          })}>

          <User />Champions

        </Link>
        <Link
          href={`/${lng}/universes`}
          as={`/${lng}/universes`}
          className={classNames({
            [styles.active]: active === "universes",
          })}>

          <Globe />Universes

        </Link>
        <Link
          href={`/${lng}/skinlines`}
          as={`/${lng}/skinlines`}
          className={classNames({
            [styles.active]: active === "skinlines",
          })}>

          <Folder />Skinlines

        </Link>
      </div>
      {filters && <div className={styles.filters}>{filters}</div>}
    </nav>)
  );
}
