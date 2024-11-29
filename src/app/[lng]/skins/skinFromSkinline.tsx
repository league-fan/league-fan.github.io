'use client'
import { allowedLng } from "@/data/constants";
import { Skin, Skinline, Universe } from "@/types";
import styles from '@/styles/collection.module.scss'
import { SkinGrid } from "@/components/skin-grid";
import {  useLocalStorageState } from "@/data/helpers";
import { Folder, Globe } from "lucide-react";
import Link from "next/link";
import { sortSkins } from "@/data/server";

type Props = {
    skinlineSkins: Skin[],
    lng: allowedLng,
    skinline: Skinline,
    skinlineUniverse: Universe[]
}

export function SkinFromSkinline({ skinlineSkins, lng, skinline, skinlineUniverse }: Props) {
    const [sortBy, setSortBy] = useLocalStorageState(
        "skinline__sortBy",
        "champion"
    );

    const sortedSkins = sortSkins(sortBy === "rarity", skinlineSkins);
    const linkTo = (skinId: string) => `/${lng}/skins/${skinId}?type=skinline&id=${skinline.id}`;
    return (
        <div>
            <h2 className={styles.subtitle}>
                <Folder />
                Skinline
            </h2>
            <h1 className={styles.title}>{skinline.name}</h1>
            {skinlineUniverse.map((u) => (
                <div className={styles.parents} key={`${u.id}__${skinline.id}`}>
                    <Link
                        key={u.id}
                        href={`/${lng}/universes/[universeId]`}
                        as={`/${lng}/universes/${u.id}`}
                        prefetch={false}
                    >
                        <Globe />
                        <span>Part of the {u.name} universe.</span>
                    </Link>
                </div>
            ))}
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
            <SkinGrid
                skins={sortedSkins}
                linkTo={linkTo}
            />
        </div>
    )
}