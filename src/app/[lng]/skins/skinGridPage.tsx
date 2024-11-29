'use client'
import { useContext, useMemo } from "react";
import styles from '@/styles/collection.module.scss'
import { PropsContext } from "@/data/propsContext";
import { asset, getChampionByName, useLocalStorageState, sortSkins, getSkinsOfChampionById, getSkinsOfSkinline, getSkinlineById, getSkinlinesOfUniverse, getUniverseById } from "@/data/helpers";
import { Champion, Skin, Skinline, Universe } from "@/types";
import Image from "@/components/image";
import { SkinGrid } from "@/components/skin-grid";
import { Footer, FooterContainer } from "@/components/footer";
import { Header } from "@/components/header";
import { redirect, useSearchParams } from "next/navigation";
import { Folder, Globe } from "lucide-react";
import Link from "next/link";

type skinsGridPageSearchParams = {
    type: 'champion' | 'skinline' | 'universe',
    id: string,
}

export function TitleIcon({ item }: { item: Champion | Skin }) {
    const isChampion = (item: Champion | Skin): item is Champion => {
        return (item as Champion).squarePortraitPath !== undefined;
    };
    if (isChampion(item)) {
        const { skins } = useContext(PropsContext);
        const champSkins = getSkinsOfChampionById(item.id, skins);
        const skin = useMemo(() => champSkins.find(skin => skin.isBase), [skins]);
        if (!skin) { return null; }
        return (
            <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(skin.uncenteredSplashPath)}
                alt={item.name}
            />
        )
    } else {
        return (
            <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(item.uncenteredSplashPath)}
                alt={item.name}
            />
        )
    }
}

export function ChampionPage({ params }: { params: { lng: string, champion: Champion } }) {
    const { skins } = useContext(PropsContext);
    const { lng, champion } = params;
    const [sortBy, setSortBy] = useLocalStorageState(
        "champion__sortBy",
        "release"
    );
    if (!champion) return <div>Champion not found</div>;
    const champSkins = getSkinsOfChampionById(champion.id, skins);

    const linkTo = (skin: Skin) => `/${lng}/skins/${skin.id}?type=champion&id=${champion.alias}`;
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
            />
        </div>
    )
}

export function SkinlinePage({ params }: { params: { lng: string, skinline: Skinline } }) {
    const { lng, skinline } = params;
    const { universes: allUniverses, skins, champions } = useContext(PropsContext);
    const skinsOfSkinline = getSkinsOfSkinline(skinline.id, skins, champions);
    const universes = allUniverses.filter((u) =>
        u.skinSets.includes(skinline.id)
    );
    const linkTo = (skin: Skin) => `/${lng}/skins/${skin.id}?type=skinline&id=${skinline.id}`;
    const [sortBy, setSortBy] = useLocalStorageState(
        "skinline__sortBy",
        "champion"
    );
    const sortedSkins = sortSkins(sortBy === "rarity", skinsOfSkinline);

    return (
        <>
            <h2 className={styles.subtitle}>
                <Folder />
                Skinline
            </h2>
            <h1 className={styles.title}>{skinline.name}</h1>
            {!!universes.length && (
                <div className={styles.parents}>
                    <Link
                        key={universes[0].id}
                        href={`/${lng}/universes/[universeId]`}
                        as={`/${lng}/universes/${universes[0].id}`}
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
            />
        </>
    )
}

export function SkinlineInUniverse({ params }: { params: { lng: string, skinline: Skinline, linkTo: (skin: Skin, skinline: Skinline) => string, sortByRarity: boolean } }) {
    const { skins, champions } = useContext(PropsContext);
    const { lng, skinline, linkTo, sortByRarity } = params;
    const skinsOfSkinline = getSkinsOfSkinline(skinline.id, skins, champions);
    const sortedSkins = sortSkins(sortByRarity, skinsOfSkinline);
    const newLinkTo = (skin: Skin) => linkTo(skin, skinline);
    return (
        <>
            <h2 className={styles.subtitle}>
                <Link href={`/${lng}/skinlines/[skinlineId]`} as={`/${lng}/skinlines/${skinline.id}`}>
                    <Folder />
                    Skinline
                </Link>
            </h2>
            <SkinGrid
                skins={sortedSkins}
                linkTo={newLinkTo}
            />
        </>
    )
}

export function UniversePage({ params }: { params: { lng: string, universe: Universe } }) {
    const { skinlines } = useContext(PropsContext);
    const { lng, universe } = params;
    const universeSkinlines = getSkinlinesOfUniverse(universe, skinlines);
    const [sortBy, setSortBy] = useLocalStorageState(
        "universe__sortBy",
        "champion"
    );
    const linkTo = (skin: Skin, skinline: Skinline) => `/${lng}/skins/${skin.id}?type=skinline&id=${skinline.id}`;
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
                <SkinlineInUniverse key={skinline.id} params={{ lng, skinline, linkTo, sortByRarity: sortBy === 'rarity' }} />
            ))}
        </div>
    )
}

export default function SkinGridPage({ params }: { params: { lng: string } }) {
    const { champions, skins, skinlines, universes } = useContext(PropsContext)
    const { lng } = params
    const searchParams = useSearchParams()
    const type = searchParams.get('type');
    if (!type) return redirect(`/${lng}/skins?type=champion&id=${champions[0].alias.toString()}`);
    let id = searchParams.get('id');
    if (!id) {
        if (type === 'skinline') {
            id = skinlines[0].id.toString()
        } else if (type === 'universe') {
            id = universes[0].id.toString()
        } else {
            id = champions[0].alias.toString()
        }
        redirect(`/${lng}/skins?type=${type}&id=${id}`);
    }
    if (type === 'skinline') {
        const skinline = getSkinlineById(Number(id), skinlines);
        if (!skinline) return <div>Skinline not found</div>;
        const splash = getSkinsOfSkinline(skinline.id, skins, champions)[0];
        if (!splash) return <div>Skin of Skinline not found</div>;

        return (
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        <TitleIcon item={splash} />
                        <Header backTo={`/${lng}/skinlines`} flat />
                        <main>
                            <SkinlinePage params={{ lng, skinline }} />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        )
    } else if (type === 'universe') {
        const universe = getUniverseById(Number(id), universes);
        if (!universe) return <div>Universe not found</div>;
        const skinline0 = getSkinlinesOfUniverse(universe, skinlines)[0];
        const splash = getSkinsOfSkinline(skinline0.id, skins, champions)[0];
        return (
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        <div className={styles.background}>
                            <TitleIcon item={splash} />
                        </div>
                        <Header backTo={`/${lng}/universes`} flat />
                        <main>
                            <UniversePage params={{ lng, universe }} />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        )
    } else {
        const champion = getChampionByName(id, champions);
        if (!champion) return <div>Champion not found</div>;

        return (
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        <div className={styles.background}>
                            <TitleIcon item={champion} />
                        </div>
                        <Header backTo={`/${lng}/champions`} flat />
                        <main>
                            <ChampionPage params={{ lng, champion }} />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        )
    }
}