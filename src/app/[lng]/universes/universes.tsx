import { Nav } from "@/components/nav";
import { allowedLng } from "@/data/constants";
import styles from "@/styles/index.module.scss";
import { Skinline, Universe } from "@/types";
import Link from "next/link";

type Props = {
    universes: Universe[],
    skinlines: Skinline[],
    lng: allowedLng
}

export default function Universes({ universes, skinlines, lng }: Props) {
    return (
        <div className={styles.container}>
            <Nav active="universes" lng={lng} />
            <main>
                <div className={styles.universes}>
                    {universes.map((u) => {
                        const skinSets = u.skinSets
                            .map((id) => ({
                                id,
                                name: skinlines.find((s) => s.id === id)?.name || "Unknown",
                            }))
                            .sort((a, b) => (a.name > b.name ? 1 : -1));
                        return (
                            <div key={u.id}>
                                <Link
                                    href={`/${lng}/skins`}
                                    as={`/${lng}/skins?type=universe&id=${u.id}`}
                                    prefetch={false}
                                >
                                    {u.name}
                                </Link>
                                {(skinSets.length > 1 || skinSets[0].name !== u.name) && (
                                    <ul>
                                        {skinSets.map(({ name, id }) => (
                                            <li key={id}>
                                                <Link
                                                    href={`/${lng}/skins`}
                                                    as={`/${lng}/skins?type=skinline&id=${id}`}
                                                    prefetch={false}
                                                >
                                                    {name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>

            </main>
        </div>
    )
}