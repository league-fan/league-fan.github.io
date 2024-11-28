'use client';
import { Nav } from "@/components/nav";
import { PropsContext } from "@/data/propsContext";
import styles from "@/styles/index.module.scss";
import Link from "next/link";
import { useContext } from "react";

function SkinlinesList() {
    const { skinlines, lng } = useContext(PropsContext);
    return (
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
    );
}


export default function Skinlines() {
    return (
        <div className={styles.container}>
            <Nav active="skinlines" />
            <main>
                <SkinlinesList />
            </main>
        </div>
    )
}