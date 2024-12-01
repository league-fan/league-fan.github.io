"use client";
import { allowedLng } from "@/data/constants";
import { Skin, Skinline, Universe } from "@/types";
import styles from "@/styles/collection.module.scss";
import { SkinGrid } from "@/components/skin-grid";
import { useLocalStorageState } from "@/data/helpers";
import { Folder, Globe } from "lucide-react";
import Link from "next/link";
import { sortSkins, sortUniverses } from "@/data/server";

type Props = {
  lng: allowedLng;
  universe: Universe;
  universeSkinlines: Skinline[];
  universeSkinlineSkins: { [skinlineId: string]: Skin[] };
};

export function SkinFromUniverse({
  universeSkinlineSkins,
  lng,
  universe,
  universeSkinlines,
}: Props) {
  const [skinSortBy, setSkinSortBy] = useLocalStorageState(
    "universe__skinSortBy",
    "champion",
  );
  const [skinlineSortBy, setSkinlineSortBy] = useLocalStorageState(
    "universe__skinlineSortBy",
    "",
  );
  const linkTo = (skinId: string, skinlineId: string) =>
    `/${lng}/skins/${skinId}?type=skinline&id=${skinlineId}`;
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
          <span>Skinlines Sort By</span>
          <select
            value={skinlineSortBy}
            onChange={(e) => setSkinlineSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="id">Id</option>
            <option value="">Default</option>
          </select>
        </label>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <label>
          <span>Champions Sort By</span>
          <select
            value={skinSortBy}
            onChange={(e) => setSkinSortBy(e.target.value)}
          >
            <option value="champion">Champion</option>
            <option value="rarity">Rarity</option>
          </select>
        </label>
      </div>
      {sortUniverses(skinlineSortBy, universeSkinlines, lng).map((skinline) => (
        <div key={`${universe.id}__${skinline.id}`}>
          <h2 className={styles.groupTitle}>
            <Link
              href={`/${lng}/skinlines/[skinlineId]`}
              as={`/${lng}/skinlines/${skinline.id}`}
            >
              <Folder />
              {skinline.name}
            </Link>
          </h2>
          <SkinGrid
            skins={sortSkins(
              skinSortBy === "rarity",
              universeSkinlineSkins[skinline.id],
            )}
            linkTo={(skinId) => linkTo(skinId, skinline.id.toString())}
          />
        </div>
      ))}
    </div>
  );
}
