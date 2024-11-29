"use client";
import { allowedLng } from "@/data/constants";
import { Champion, Skin } from "@/types";
import styles from "@/styles/collection.module.scss";
import { SkinGrid } from "@/components/skin-grid";
import { useLocalStorageState } from "@/data/helpers";
import { sortSkins } from "@/data/server";

type Props = {
  champSkins: Skin[];
  lng: allowedLng;
  champion: Champion;
};

export function SkinFromChampion({ champSkins, lng, champion }: Props) {
  const [sortBy, setSortBy] = useLocalStorageState(
    "champion__sortBy",
    "release",
  );
  const sortedSkins = sortSkins(sortBy === "rarity", champSkins);
  const linkTo = (skinId: string) =>
    `/${lng}/skins/${skinId}?type=champion&id=${champion.alias}`;
  return (
    <div>
      <h1 className={styles.title}>{champion.name}</h1>
      <div className={styles.controls}>
        <label>
          <span>Sort By</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="release">Release</option>
            <option value="rarity">Rarity</option>
          </select>
        </label>
      </div>
      <SkinGrid skins={sortedSkins} linkTo={linkTo} />
    </div>
  );
}
