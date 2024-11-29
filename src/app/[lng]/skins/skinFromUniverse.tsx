'use client'
import { allowedLng } from "@/data/constants";
import { Skin, Skinline, Universe } from "@/types";
import styles from '@/styles/collection.module.scss'
import { SkinGrid } from "@/components/skin-grid";
import { sortSkins, useLocalStorageState } from "@/data/helpers";
import { Folder, Globe } from "lucide-react";
import Link from "next/link";

type Props = {
    lng: allowedLng,
    universe: Universe,
    universeSkinlines: Skinline[]
    universeSkinlineSkins: { [skinlineId: string]: Skin[] },
}

export function SkinFromUniverse({ universeSkinlineSkins, lng, universe, universeSkinlines }: Props) {
    const [sortBy, setSortBy] = useLocalStorageState(
        "universe__sortBy",
        "champion"
    );
    const linkTo = (skinId: string, skinlineId: string) => `/${lng}/skins/${skinId}?type=skinline&id=${skinlineId}`;
    return (
        <div>
            <h2 className={styles.subtitle}>
                <Globe />
                Universe
            </h2>
            <h1 className={styles.title}>{universe.name}</h1>
            {universe.description && (
                <p className={styles.description}>{universe.description}</p>
            )}
            <div className={styles.controls}>
                <label>
                    <span>Sort By</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="champion">Champion</option>
                        <option value="rarity">Rarity</option>
                    </select>
                </label>
            </div>
            {universeSkinlines.map((skinline) => (
                <>
                    <h2 className={styles.subtitle}>
                        <Link href={`/${lng}/skinlines/[skinlineId]`} as={`/${lng}/skinlines/${skinline.id}`}>
                            <Folder />
                            Skinline
                        </Link>
                    </h2>
                    <SkinGrid
                        skins={sortSkins(sortBy === "rarity", universeSkinlineSkins[skinline.id])}
                        linkTo={(skinId) => linkTo(skinId, skinline.id.toString())}
                    /></>
            ))}
        </div>
    )
}