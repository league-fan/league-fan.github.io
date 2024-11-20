import classNames from "classnames";
import Image from "../image";
import Link from "next/link";
import { asset, rarity } from "@/data2/helpers";
import styles from "./styles.module.scss";
import { Skin } from "@/types";

interface SkinGridProps {
  skins: Skin[];
  linkTo: (skin: Skin) => string;
}

export function SkinGrid({ skins, linkTo }: SkinGridProps) {
  if (skins.length === 0)
    return (
      <div className={styles.grid} style={{ gridTemplateColumns: "1fr" }}>
        <span className={styles.error}>No skins (yet)!</span>
      </div>
    );
  return (
    (<div className={styles.grid}>
      {skins.map((skin) => {
        const r = rarity(skin);
        return (
          (<Link key={skin.id} href={linkTo(skin)} as={linkTo(skin)}>

            <Image
              className={styles.tile}
              unoptimized
              src={asset(skin.tilePath)}
              alt={skin.name}
              width={300}
              height={300}
            />
            <div>
              {skin.name}
              <div className={classNames({ [styles.rarityBadge]: r })}>
                {r && (
                  <Image
                    src={r[0]}
                    title={r[1]}
                    alt={r[1]}
                    objectFit="contain"
                    objectPosition="center"
                    layout="fill"
                  />
                )}
              </div>
            </div>

          </Link>)
        );
      })}
    </div>)
  );
}
