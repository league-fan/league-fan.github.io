'use client';
import { useContext, useMemo } from "react";
import styles from '@/styles/collection.module.scss'
import { PropsContext } from "@/data/propsContext";
import { asset, getChampionByName, useLocalStorageState, sortSkins, getSkinsOfChampionById } from "@/data/helpers";
import { Skin } from "@/types";
import Image from "@/components/image";
import { SkinGrid } from "@/components/skin-grid";

export function ChampionIcon({ champName }: { champName: string }) {
    const { skins } = useContext(PropsContext);

    const base = useMemo(() => Object.values(skins).find(skin => skin.isBase), [skins]);
    if (!base) { return null; }
    return (
        <Image
            unoptimized
            layout="fill"
            objectFit="cover"
            src={asset(base.uncenteredSplashPath)}
            alt={champName}
        />
    )
}

export function ChampionPage({ lng, champName }: { lng: string, champName: string }) {
    const { champions, skins } = useContext(PropsContext);
    const [sortBy, setSortBy] = useLocalStorageState(
        "champion__sortBy",
        "release"
    );
    const champion = getChampionByName(champName, champions);
    if (!champion) return <div>Champion not found</div>;
    const champSkins = getSkinsOfChampionById(champion.id, skins);

    const linkTo = (skin: Skin) => `/${lng}/${champName}/skins/${skin.id}`;
    const sortedSkins = sortSkins(sortBy === "rarity", champSkins);

    return (
        <div>
            <h1 className={styles.title}>{champion.name}</h1>
            <div className={styles.controls}>
                <label>
                    <span>Sort By</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="release">Release</option>
                        <option value="rarity">Rarity</option>
                    </select>
                </label>
            </div>
            <SkinGrid
                skins={sortedSkins}
                linkTo={linkTo}
            // viewerPage="/champions/[key]/skins/[id]"
            />
        </div>
    )
}