'use client'
import { Nav } from "@/components/nav";
import styles from "@/styles/index.module.scss";
import { useLocalStorageState } from "@/data/client_helpers";
import { ChampionsList } from "./ChampList";

export const classes = {
    assassin: "Assassin",
    fighter: "Fighter",
    mage: "Mage",
    marksman: "Marksman",
    support: "Support",
    tank: "Tank",
};

export default function IndexLayout() {
    const [champRole, setChampRole] = useLocalStorageState(
        "champs_index__champRole",
        ""
    );

    return (
        <>
            <div className={styles.container}>
                <Nav
                    active="champions"
                    filters={
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
                    }
                />
                <main>
                    <ChampionsList role={champRole} />
                </main>
            </div>
        </>
    )
}