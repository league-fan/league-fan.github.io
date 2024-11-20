'use client';
import Link from "next/link";
import Image from "../image";
import styles from "./style.module.scss";
import { useContext } from "react";
import { PropsContext, SkinWithKey } from "@/app/props";
import { asset } from "@/data/client_helpers";

export default function NewAdditions() {
    const { addedSkins } = useContext(PropsContext);

    if (!addedSkins.length) {
        return null;
    }

    const linkTo = (skin: SkinWithKey) => `/champions/${skin.$$key}/skins/${skin.id}`;

    return (
        (<div className={styles.container}>
            <h3>Recently Added</h3>
            <div className={styles.gridContainer}>
                <div className={styles.grid}>
                    {addedSkins.map((skin) => {
                        return (
                            (<Link
                                key={skin.id}
                                href={linkTo(skin)}
                                as={linkTo(skin)}
                                className={styles.skin}>

                                <span className={styles.imageContainer}>
                                    <Image
                                        className={styles.tile}
                                        unoptimized
                                        loading="eager"
                                        src={asset(skin.tilePath)}
                                        alt={skin.name}
                                        objectFit="cover"
                                        layout="fill"
                                    />
                                </span>
                                <div>{skin.name}</div>

                            </Link>)
                        );
                    })}
                </div>
            </div>
        </div>)
    );
}
