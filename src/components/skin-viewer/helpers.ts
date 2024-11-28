'use client'

import { Champion, Skin, Skinline, Universe } from "@/types";
import { splitId, modelviewerUrl } from "@/data/helpers";
import { useContext } from "react";
import { PropsContext } from "@/data/propsContext";

export interface SkinWithMeta extends Skin {
  $skinExplorer: {
    changes: string[];
    champion: Champion;
    skinlines: Skinline[];
    universes: Universe[];
    modelviewerUrl: string;
    skinSpotlightsUrl: string;
  };
}

export function skinToSkinWithMeta(origin_skin: Skin): SkinWithMeta {
  const { champions, skinlines, universes, changes } = useContext(PropsContext);
  let skin: SkinWithMeta = {
    ...origin_skin,
    $skinExplorer: {
      changes: [],
      champion: {} as Champion,
      skinlines: [],
      universes: [],
      modelviewerUrl: "",
      skinSpotlightsUrl: "",
    },
  };
  const meta = skin.$skinExplorer;
  meta.changes = changes[skin.id] ?? [];
  const [cId] = splitId(skin.id);
  meta.champion = champions.find((c) => c.id === cId) ?? meta.champion;
  meta.skinlines = Array.from(
    new Map(
      (skin.skinLines ?? [])
        .map(({ id }) => skinlines.find((l) => l.id === id))
        .filter((item): item is Skinline => item !== undefined)
        .map((item) => [item.id, item])
    ).values()
  );

  meta.universes = Array.from(
    new Map(
      meta.skinlines
        .map(({ id }) => universes.find((u) => u.skinSets.includes(id)))
        .filter((item): item is Universe => item !== undefined)
        .map((item) => [item.id, item])
    ).values()
  );

  meta.modelviewerUrl = modelviewerUrl(skin);
  meta.skinSpotlightsUrl = `https://www.youtube.com/c/SkinSpotlights/search?query=${skin.name.slice(
    skin.isBase ? 9 : 0
  )}`;

  return skin;
}

export function prepareCollection(idx: number, collection: Skin[]) {
  const origin_skin = collection[idx];
  let skin = skinToSkinWithMeta(origin_skin);
  let prev: SkinWithMeta | null = null,
    next: SkinWithMeta | null = null;
  if (collection.length > 1) {
    const prev_skin = collection[(idx === 0 ? collection.length : idx) - 1];
    const next_skin = collection[(idx + 1) % collection.length];
    next = skinToSkinWithMeta(next_skin);
    prev = skinToSkinWithMeta(prev_skin);
  }

  return { skin, prev, next };
}
