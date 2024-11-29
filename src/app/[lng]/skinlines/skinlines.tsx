import { Nav } from "@/components/nav";
import { allowedLng } from "@/data/constants";
import styles from "@/styles/index.module.scss";
import { Skinline } from "@/types";
import Link from "next/link";

type Props = {
    skinlines: Skinline[],
    lng: allowedLng
}

export default function Skinlines({ skinlines, lng }: Props) {
    return (
        <div className={styles.container}>
            <Nav active="skinlines" lng={lng} />
            <main>
                <div className={styles.skinlines}>
                    {skinlines.map((l) => (
                        <div key={l.id}>
                            <Link
                                href={`/${lng}/skins`}
                                as={`/${lng}/skins?type=skinline&id=${l.id}`}
                                prefetch={false}
                            >
                                {l.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}