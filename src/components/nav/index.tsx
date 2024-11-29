import classNames from "classnames";
import { User, Globe, Folder } from "lucide-react";
import Link from "next/link";
import styles from "@/styles/index.module.scss";
import { allowedLng } from "@/data/constants";

interface NavProps {
  lng: allowedLng;
  active: string;
  filters?: React.ReactNode;
}

export function Nav({ lng, active, filters }: NavProps) {
  return (
    <nav>
      <div className={styles.tabs}>
        <Link
          href={`/${lng}/champions`}
          as={`/${lng}/champions`}
          className={classNames({
            [styles.active]: active === "champions",
          })}
        >
          <User />
          Champions
        </Link>
        <Link
          href={`/${lng}/universes`}
          as={`/${lng}/universes`}
          className={classNames({
            [styles.active]: active === "universes",
          })}
        >
          <Globe />
          Universes
        </Link>
        <Link
          href={`/${lng}/skinlines`}
          as={`/${lng}/skinlines`}
          className={classNames({
            [styles.active]: active === "skinlines",
          })}
        >
          <Folder />
          Skinlines
        </Link>
      </div>
      {filters && <div className={styles.filters}>{filters}</div>}
    </nav>
  );
}
