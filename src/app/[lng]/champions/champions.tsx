'use client'
import { Nav } from "@/components/nav";
import styles from "@/styles/index.module.scss";
import { useLocalStorageState } from "@/data/helpers";
import { useContext, useMemo } from "react";
import { PropsContext } from "@/data/propsContext";
import Link from "next/link";
import Image from "@/components/image";
import { asset } from "@/data/helpers";
import { languageZoneToBCP47 } from "@/types/languagezone";

export const classes = {
    assassin: "Assassin",
    fighter: "Fighter",
    mage: "Mage",
    marksman: "Marksman",
    support: "Support",
    tank: "Tank",
};

export const sortClasses = {
    id: "By ID",
    id_rev: "By ID (Descending)",
    name: "By Name (A-Z)",
    name_rev: "By Name (Z-A)",
    alias: "By Alias (A-Z)",
    alias_rev: "By Alias (Z-A)",
}


export function ChampionsList({ params }: { params: { role: string, sort?: string } }) {
    const { champions, lng } = useContext(PropsContext);
    const { role, sort } = params;
    const filteredChamps = useMemo(() => {
        let sortedChamps = champions;
        if (sort) {
            sortedChamps = champions.slice().sort((a, b) => {
                if (sort === "id") return a.id - b.id;
                if (sort === "id_rev") return b.id - a.id;
                if (sort === "name") return a.name.localeCompare(b.name, languageZoneToBCP47[lng]);
                if (sort === "name_rev") return b.name.localeCompare(a.name, languageZoneToBCP47[lng]);
                if (sort === "alias") return a.alias.localeCompare(b.alias, languageZoneToBCP47[lng]);
                if (sort === "alias_rev") return b.alias.localeCompare(a.alias, languageZoneToBCP47[lng]);
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
                href={`/${lng}/skins`}
                as={`/${lng}/skins?type=champion&id=${c.alias}`}
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

export default function Champions() {
    const [champRole, setChampRole] = useLocalStorageState(
        "champs_index__champRole",
        ""
    );
    const [champSort, setChampSort] = useLocalStorageState(
        "champs_index__champSort",
        "id"
    );

    return (
        <div className={styles.container}>
            <Nav
                active="champions"
                filters={
                    <>
                        <label>
                            <span>Role</span>
                            <select
                                value={champRole}
                                onChange={(e) => setChampRole(e.target.value)}
                            >
                                <option value="">All</option>
                                {Object.entries(classes).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <span> &nbsp; </span>
                        <label>
                            <span>Sort</span>
                            <select
                                value={champSort}
                                onChange={(e) => setChampSort(e.target.value)}
                            >
                                {Object.entries(sortClasses).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </>
                }
            />
            <main>
                <ChampionsList params={{ role: champRole, sort: champSort }} />
            </main>
        </div>
    )
}