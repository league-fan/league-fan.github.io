import classNames from "classnames";
import Image from "@/components/image";
import Link from "next/link";
import { asset, getRarityUrl } from "@/data/server";
import styles from "./styles.module.scss";

interface SkinGridProps {
  skins: { id: number; tilePath: string; name: string; rarity: string }[];
  linkTo: (skinId: string) => string;
}

export function SkinGrid({ skins, linkTo }: SkinGridProps) {
  if (skins.length === 0)
    return (
      <div className={styles.grid} style={{ gridTemplateColumns: "1fr" }}>
        <span className={styles.error}>No skins (yet)!</span>
      </div>
    );
  return (
    <div className={styles.grid}>
      {skins.map((skin) => {
        const rarity = getRarityUrl(skin.rarity);
        return (
          <Link
            key={skin.id}
            href={linkTo(skin.id.toString())}
            as={linkTo(skin.id.toString())}
          >
            <Image
              className={styles.tile}
              unoptimized
              src={asset(skin.tilePath, {})}
              alt={skin.name}
              width={300}
              height={300}
            />
            <div>
              {skin.name}
              <div className={classNames({ [styles.rarityBadge]: rarity })}>
                {rarity && (
                  <Image
                    unoptimized
                    src={rarity.imgUrl}
                    title={rarity.name}
                    alt={rarity.name}
                    objectFit="contain"
                    objectPosition="center"
                    layout="fill"
                  />
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
