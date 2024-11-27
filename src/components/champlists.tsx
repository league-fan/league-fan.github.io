'use client';
import { useContext, useMemo } from "react";
import { PropsContext } from "../data/propsContext";
import styles from "@/styles/index.module.scss";
import Link from "next/link";
import Image from "@/components/image";
import { asset } from "@/data/helpers";
import { languageZoneToBCP47 } from "@/types/languagezone";

export function ChampionsList({ role, sort }: { role: string, sort?: string }) {
    const { champions, lang } = useContext(PropsContext);
    const filteredChamps = useMemo(() => {
        let sortedChamps = champions;
        if (sort) {
            sortedChamps = champions.slice().sort((a, b) => {
                if (sort === "id") return a.id - b.id;
                if (sort === "id_rev") return b.id - a.id;
                if (sort === "name") return a.name.localeCompare(b.name, languageZoneToBCP47[lang]);
                if (sort === "name_rev") return b.name.localeCompare(a.name, languageZoneToBCP47[lang]);
                if (sort === "alias") return a.alias.localeCompare(b.alias, languageZoneToBCP47[lang]);
                if (sort === "alias_rev") return b.alias.localeCompare(a.alias, languageZoneToBCP47[lang]);
                return 0;
            });
        }
        if (!role) return sortedChamps;
        return sortedChamps.filter((c) => c.roles.includes(role));
    }, [champions, role, sort]);

    return (<div className={styles.champions}>
        {filteredChamps.map((c) => (
            <Link
                key={c.id}
                href={`champions/[champId]`}
                as={`champions/${c.alias}`}
                prefetch={false}
            >
                <Image
                    unoptimized
                    className={styles.img}
                    src={asset(c.squarePortraitPath)}
                    alt={c.name}
                    width={80}
                    height={80}
                    priority
                />
                <div>{c.name}</div>
            </Link>
        ))}
    </div>);

}