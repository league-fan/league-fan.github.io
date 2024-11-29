'use client'
import styles from '@/styles/collection.module.scss'
import { getChampionByName, getSkinsOfChampionById, getSkinsOfSkinline, getSkinlineById, getSkinlinesOfUniverse, getUniverseById } from "@/data/helpers";
import { Champion, Skin, Skinline, Universe } from "@/types";
import Image from "@/components/image";
import { Footer, FooterContainer } from "@/components/footer";
import { Header } from "@/components/header";
import { allowedLng } from "@/data/constants";
import { SkinFromSkinline } from "./skinFromSkinline";
import NotFound from "@/components/notFound";
import { SkinFromUniverse } from "./skinFromUniverse";
import { SkinFromChampion } from "./skinFromChampion";
import { asset } from "@/data/server";
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type TitleIconProps = {
    item: Champion | Skin,
    skins: Skin[]
}

export function TitleIcon({ item, skins }: TitleIconProps) {
    const isChampion = (item: Champion | Skin): item is Champion => {
        return (item as Champion).squarePortraitPath !== undefined;
    };
    if (isChampion(item)) {
        const champSkins = getSkinsOfChampionById(item.id, skins);
        const skin = useMemo(() => champSkins.find(skin => skin.isBase), [skins]);
        if (!skin) { return null; }
        return (
            <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(skin.uncenteredSplashPath, {})}
                alt={item.name}
            />
        )
    } else {
        return (
            <Image
                unoptimized
                layout="fill"
                objectFit="cover"
                src={asset(item.uncenteredSplashPath, {})}
                alt={item.name}
            />
        )
    }
}

type Props = {
    lng: allowedLng,
    champions: Champion[],
    skins: Skin[],
    skinlines: Skinline[],
    universes: Universe[],
}

const allowType = ['champion', 'skinline', 'universe'];

export default function SkinGridPage({ lng, champions, skins, skinlines, universes }: Props) {
    const searchParams = useSearchParams()
    const type = searchParams.get('type');
    if (!type || !allowType.includes(type)) return <NotFound title="Type not found" lng={lng} back={`/${lng}/champions`} />;
    let id = searchParams.get('id');
    const validId = (type: string, id: string) => {
        if (type === 'champion') return champions.some(c => c.alias === id);
        if (type === 'skinline') return skinlines.some(s => s.id === Number(id));
        if (type === 'universe') return universes.some(u => u.id === Number(id));
        return false;
    }
    if (!id || !validId(type, id)) return <NotFound title="Id not found" lng={lng} back={`/${lng}/champions`} />;

    if (type === 'skinline') {
        const skinline = getSkinlineById(Number(id), skinlines);
        if (!skinline) return <NotFound title="Skinline not found" lng={lng} back={`/${lng}/skinlines`} />;
        const splash = getSkinsOfSkinline(skinline.id, skins, champions);
        const skinlineSkins = getSkinsOfSkinline(skinline.id, skins, champions);
        const skinlineUniverse = universes.filter(u => u.skinSets.includes(skinline.id)) ?? [];

        return (
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        <div className={styles.background}>
                            {splash.length > 0 && (
                                <TitleIcon item={splash[0]} skins={skins} />
                            )}
                        </div>
                        <Header backTo={`/${lng}/skinlines`} flat lng={lng} />
                        <main>
                            <SkinFromSkinline skinlineSkins={skinlineSkins} lng={lng} skinline={skinline} skinlineUniverse={skinlineUniverse} />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        )
    } else if (type === 'universe') {
        const universe = getUniverseById(Number(id), universes);
        if (!universe) return <NotFound title="Universe not found" lng={lng} back={`/${lng}/universes`} />;
        const universeSkinlines = getSkinlinesOfUniverse(universe, skinlines);
        if (universeSkinlines.length === 0) return <NotFound title="Skinlines not found" lng={lng} back={`/${lng}/universes`} />;
        let universeSkinlineSkins: { [key: number]: Skin[] } = {};
        for (const skinline of universeSkinlines) {
            universeSkinlineSkins[skinline.id] = getSkinsOfSkinline(skinline.id, skins, champions);
        }
        const splash = getSkinsOfSkinline(universeSkinlines[0].id, skins, champions);
        return (
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        <div className={styles.background}>
                            {splash.length > 0 && (
                                <TitleIcon item={splash[0]} skins={skins} />
                            )}
                        </div>
                        <Header backTo={`/${lng}/universes`} flat lng={lng} />
                        <main>
                            <SkinFromUniverse universe={universe} lng={lng} universeSkinlineSkins={universeSkinlineSkins} universeSkinlines={universeSkinlines} />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        )
    } else {
        const champion = getChampionByName(id, champions);
        if (!champion) return <NotFound title="Champion not found" lng={lng} back={`/${lng}/champions`} />;
        const champSkins = getSkinsOfChampionById(champion.id, skins);
        return (
            <div className={styles.container}>
                <FooterContainer>
                    <div>
                        <div className={styles.background}>
                            <TitleIcon item={champion} skins={skins} />
                        </div>
                        <Header backTo={`/${lng}/champions`} flat lng={lng} />
                        <main>
                            <SkinFromChampion champion={champion} lng={lng} champSkins={champSkins} />
                        </main>
                    </div>
                    <Footer flat />
                </FooterContainer>
            </div>
        )
    }
}