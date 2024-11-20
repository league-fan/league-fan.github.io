import classNames from "classnames";
import { User, Globe, Folder } from "lucide-react";
import Link from "next/link";
import styles from "@/styles/index.module.scss";

interface NavProps {
  active: string;
  filters?: React.ReactNode;
}

export function Nav({ active, filters }: NavProps) {
  return (
    (<nav>
      <div className={styles.tabs}>
        <Link
          href="/"
          as="/"
          className={classNames({
            [styles.active]: active === "champions",
          })}>

          <User />Champions
                    
        </Link>
        <Link
          href="/universes"
          as="/universes"
          className={classNames({
            [styles.active]: active === "universes",
          })}>

          <Globe />Universes
                    
        </Link>
        <Link
          href="/skinlines"
          as="/skinlines"
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
