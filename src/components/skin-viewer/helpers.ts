import { Champion, Skin, Skinline, Universe } from "@/types";
import { splitId, modelviewerUrl } from "../../data/helpers";
import { store } from "../../data/store";

export interface SkinWithMeta extends Skin {
  $skinExplorer: {
    changes: string[];
    champion: Champion | undefined;
    skinlines: Skinline[] | undefined;
    universes: Universe[] | undefined;
    modelviewerUrl: string;
    skinSpotlightsUrl: string;
  };
}

export async function prepareCollection(collection: SkinWithMeta[], idx: number) {
  const skin = collection[idx];
  skin.$skinExplorer = {
    changes: [],
    champion: undefined,
    skinlines: [],
    universes: [],
    modelviewerUrl: '',
    skinSpotlightsUrl: ''
  };
  const meta = skin.$skinExplorer;

  const { champions, skinlines, universes } = store.patch;
  const { changes } = store;

  meta.changes = changes[skin.id] ?? false;
  const [cId] = splitId(skin.id);
  meta.champion = champions.find((c) => c.id === cId);
  if (!meta.champion) {
    throw new Error(`Champion not found for skin ${skin.id}`);
  }
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

  meta.modelviewerUrl = modelviewerUrl(skin, meta.champion);
  meta.skinSpotlightsUrl = `https://www.youtube.com/c/SkinSpotlights/search?query=${skin.name.slice(
    skin.isBase ? 9 : 0
  )}`;

  let prev = null,
    next = null;
  if (collection.length > 1) {
    prev = collection[(idx === 0 ? collection.length : idx) - 1];
    next = collection[(idx + 1) % collection.length];
  }

  return { skin, prev, next };
}
