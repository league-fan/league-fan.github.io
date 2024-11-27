'use client';

import { asset, skinlineSkins, sortSkins, useLocalStorageState } from "@/data/helpers";
import { PropsContext } from "@/data/propsContext";
import { Skin } from "@/types";
import { useContext } from "react";
import styles from "@/styles/collection.module.scss";
import { Footer, FooterContainer } from "@/components/footer";
import Image from "@/components/image";
import { Header } from "@/components/header";
import { Folder, Globe } from "lucide-react";
import Link from "next/link";
import { SkinGrid } from "@/components/skin-grid";

export default function pageClient({ params }: { params: { lng: string, skinlineId: string } }) {
    const { lng, skinlineId } = params;
    const { skinlines, universes: allUniverses, skins: allSkins, champions } = useContext(PropsContext);

    const skinline = skinlines.find((s) => s.id.toString() === skinlineId) || skinlines[0];
    const [sortBy, setSortBy] = useLocalStorageState(
        "skinline__sortBy",
        "champion"
    );

    const skins = skinlineSkins(skinline.id, allSkins, champions)
    const universes = allUniverses.filter((u) =>
        u.skinSets.includes(skinline.id)
    );
    const linkTo = (skin: Skin) => `/${lng}/skinlines/${skinline.id}/skins/${skin.id}`;
    const sortedSkins = sortSkins(sortBy === "rarity", skins);
    const splash = skins.length > 0 && asset(skins[0].uncenteredSplashPath);

    return (
        <>
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        {splash && (
                            <div className={styles.background}>
                                <Image
                                    unoptimized
                                    layout="fill"
                                    objectFit="cover"
                                    src={splash}
                                    alt={skinline.name}
                                />
                            </div>
                        )}
                        <Header backTo={`/${lng}/skinlines`} flat />
                        <main>
                            <h2 className={styles.subtitle}>
                                <Folder />
                                Skinline
                            </h2>
                            <h1 className={styles.title}>{skinline.name}</h1>
                            {!!universes.length && (
                                <div className={styles.parents}>
                                    <Link
                                        key={universes[0].id}
                                        href="/universes/[universeId]"
                                        as={`/universes/${universes[0].id}`}
                                        prefetch={false}
                                    >

                                        <Globe />

                                        <span>Part of the {universes[0].name} universe.</span>

                                    </Link>
                                </div>
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
                            <SkinGrid
                                skins={sortedSkins}
                                linkTo={linkTo}
                            // viewerPage="/skinlines/[lId]/skins/[sId]"
                            />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        </>
    )
}