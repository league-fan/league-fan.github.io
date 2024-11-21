import { CDRAGON, ROOT } from "./constants";
import { useProps } from "./contexts";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import { Champion, Skins } from "@/types";
import { RarityEnum, Skin } from "@/types/skins";
import { Role } from "@/types/champion";
import { Url } from "url";

function isTextBox(element: Element | null) {
  if (!element) return false;
  var tagName = element.tagName.toLowerCase();
  if (tagName === "textarea") return true;
  if (tagName !== "input") return false;
  var type = element.getAttribute("type")?.toLowerCase() || "",
    // if any of these input types is not supported by a browser, it will behave as input type text.
    inputTypes = [
      "text",
      "password",
      "number",
      "email",
      "tel",
      "url",
      "search",
      "date",
      "datetime",
      "datetime-local",
      "time",
      "month",
      "week",
    ];
  return inputTypes.indexOf(type) >= 0;
}

export function dataRoot(patch = "pbe") {
  return `${CDRAGON}/${patch}/plugins/rcp-be-lol-game-data/global/default`;
}

export function asset(path: string, patch = "pbe") {
  return path.replace("/lol-game-data/assets", dataRoot(patch)).toLowerCase();
}

export function splitId(id: number) {
  return [Math.floor(id / 1000), id % 1000];
}

export function championSkins(id: number, skins: Skins) {
  return Object.values(skins).filter((skin) => splitId(skin.id)[0] === id);
}

export function useChampionSkins(id: number) {
  const { skins } = useProps();
  return championSkins(id, skins);
}

export function skinlineSkins(id: number, skins: Skins, champions: Champion[]) {
  return Object.values(skins)
    .filter((skin) => skin.skinLines?.some((line) => line.id === id))
    .sort((a, b) => {
      const aId = splitId(a.id)[0];
      const bId = splitId(b.id)[0];
      const aIndex = champions.findIndex((c) => c.id === aId);
      const bIndex = champions.findIndex((c) => c.id === bId);
      return aIndex - bIndex;
    });
}

export function useSkinlineSkins(id: number) {
  const { skins, champions } = useProps();
  return skinlineSkins(id, skins, champions);
}

export const rarities: Record<RarityEnum, [string, string]> = {
  [RarityEnum.KUltimate]: ["ultimate.png", "Ultimate"],
  [RarityEnum.KMythic]: ["mythic.png", "Mythic"],
  [RarityEnum.KLegendary]: ["legendary.png", "Legendary"],
  [RarityEnum.KEpic]: ["epic.png", "Epic"],
  [RarityEnum.KNoRarity]: ["no-rarity.png", "No Rarity"],
  [RarityEnum.KRare]: ["rare.png", "Rare"],
  [RarityEnum.KTranscendent]: ["transcendent.png", "Transcendent"],
};

export const classes: Record<Role, string> = {
  assassin: "Assassin",
  fighter: "Fighter",
  mage: "Mage",
  marksman: "Marksman",
  support: "Support",
  tank: "Tank",
};

export function rarity(skin: Skin) {
  if (!rarities[skin.rarity]) return null;
  const [imgName, name] = rarities[skin.rarity];
  const imgUrl = `${dataRoot()}/v1/rarity-gem-icons/${imgName}`;
  return {
    imgUrl,
    name,
  }
}

export function modelviewerUrl(skin: Skin, champion: Champion) {
  return `https://www.modelviewer.lol/en-US/model-viewer?id=${skin.id}`;
  // const skinId = splitId(skin.id)[1];
  // return `https://teemo.gg/model-viewer?game=league-of-legends&type=champions&object=${champion.alias.toLowerCase()}&skinid=${champion.alias.toLowerCase()}-${skinId}`;
}

export function useLocalStorageState(name: any, initialValue: any) {
  const [value, _setValue] = useState(initialValue);
  useEffect(() => {
    localStorage[name] && _setValue(JSON.parse(localStorage[name]));
  }, [name]);

  const setValue = (v: any) => {
    _setValue(v);
    localStorage[name] = JSON.stringify(v);
  };
  return [value, setValue];
}

export function useSortedSkins(sortByRarity: boolean, skins: Skin[]) {
  if (sortByRarity) {
    const keys = Object.keys(rarities).reverse();
    return skins
      .slice()
      .sort((a, b) => keys.indexOf(b.rarity) - keys.indexOf(a.rarity));
  }

  return skins;
}

export function useEscapeTo(url: string) {
  const router = useRouter();
  useEffect(() => {
    function onKeyDown(e: { code: string; preventDefault: () => void; }) {
      if (isTextBox(document.activeElement)) return; // Ignore events when an input is active.
      if (e.code === "Escape") {
        router.push(url, url);
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router, url]);
}

export function useArrowNavigation(left: string, right: string) {
  const handlers = useSwipeable({
    delta: 50,
    onSwipedLeft(e) {
      e.event.preventDefault();
      router.push(right, right);
    },
    onSwipedRight(e) {
      e.event.preventDefault();
      router.push(left, left);
    },
  });
  const router = useRouter();
  useEffect(() => {
    function onKeyDown(e: { key: string; preventDefault: () => void; }) {
      if (isTextBox(document.activeElement)) return; // Ignore events when an input is active.
      if (e.key === "ArrowLeft") {
        router.push(left, left);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        router.push(right, right);
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router, left, right]);
  return handlers;
}

export function makeTitle(...pages: string[]) {
  if (!pages) {
    pages = [];
  }
  let t = [...pages, "Skin Explorer"].join(" · ");
  if (pages.length === 0) {
    t = "Skin Explorer · League of Legends";
  }

  return (
    <>
      <title>{t}</title>;
      <meta property="og:title" content={t} />
      <meta name="twitter:site" content="@SkinExplorerLoL" />
    </>
  );
}

export function makeDescription(desc: string | undefined) {
  return (
    <>
      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
    </>
  );
}

export function makeCanonical(url: string) {
  const u = ROOT + url;
  return (
    <>
      <link rel="canonical" href={u} />
      <meta property="og:url" content={u} />
    </>
  );
}

export function makeImage(url: string | undefined, alt: string | null = null) {
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image" content={url} />
      {alt && <meta property="og:image:alt" content={alt} />}
    </>
  );
}
