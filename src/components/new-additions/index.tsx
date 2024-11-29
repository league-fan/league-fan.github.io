import Link from "next/link";
import Image from "../image";
import styles from "./style.module.scss";
import { asset } from "@/data/server";
import { Skin } from "@/types";

type AddedSkin = Skin & { $$alias: string };

type Props = {
  addedSkins: Array<AddedSkin>;
  lng: string;
};

export default function NewAdditions({ addedSkins, lng }: Props) {
  if (!addedSkins.length) {
    return null;
  }

  const linkTo = (skin: AddedSkin) =>
    `/${lng}/skins/${skin.id}?type=champion&id=${skin.$$alias}`;

  return (
    <div className={styles.container}>
      <h3>Recently Added</h3>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {addedSkins.map((skin) => {
            return (
              <Link
                key={skin.id}
                href={linkTo(skin)}
                as={linkTo(skin)}
                className={styles.skin}
              >
                <span className={styles.imageContainer}>
                  <Image
                    className={styles.tile}
                    unoptimized
                    loading="eager"
                    src={asset(skin.tilePath, {})}
                    alt={skin.name}
                    objectFit="cover"
                    layout="fill"
                  />
                </span>
                <div>{skin.name}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
