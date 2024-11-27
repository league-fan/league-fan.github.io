'use client';
import { Nav } from "@/components/nav";
import { PropsContext } from "@/data/propsContext";
import styles from "@/styles/index.module.scss";
import Link from "next/link";
import { useContext } from "react";


function UniversesList() {
    const { universes, skinlines, lng } = useContext(PropsContext);
    return (
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
                            href={`/${lng}/universes/[universeId]`}
                            as={`/${lng}/universes/${u.id}`}
                            prefetch={false}
                        >
                            {u.name}
                        </Link>
                        {(skinSets.length > 1 || skinSets[0].name !== u.name) && (
                            <ul>
                                {skinSets.map(({ name, id }) => (
                                    <li key={id}>
                                        <Link
                                            href={`/${lng}/skinlines/[skinlineId]`}
                                            as={`/${lng}/skinlines/${id}`}
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
    );
}

export default function Universes() {
    return (
        <div className={styles.container}>
            <Nav active="universes" />
            <main>
                <UniversesList />
            </main>
        </div>
    )
}