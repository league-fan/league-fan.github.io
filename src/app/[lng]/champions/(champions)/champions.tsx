'use client'
import { Nav } from "@/components/nav";
import styles from "@/styles/index.module.scss";
import { useLocalStorageState } from "@/data/helpers";
import { ChampionsList } from "./champlists";

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
                <ChampionsList role={champRole} sort={champSort} />
            </main>
        </div>
    )
}