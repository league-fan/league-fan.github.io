import {
  Box,
  ExternalLink,
  Folder,
  Globe,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import styles from "./styles.module.scss";
import { Champion, Skin, Skinline, Universe } from "@/types";
import { allowedLng } from "@/data/constants";

type Props = {
  lng: allowedLng
  skin: Skin;
  skinChamp: Champion;
  skinSkinlines: Skinline[],
  skinUniverse: Universe[]
}

export function Popup({ lng, skin, skinChamp, skinSkinlines, skinUniverse }: Props) {
  const skinSpotlightsUrl = (skin: Skin) => {
    const name = skin.name.slice(skin.isBase ? 9 : 0);
    switch (lng) {
      case "en":
        return `https://www.youtube.com/c/SkinSpotlights/search?query=${name}`;
      default:
        return `https://search.bilibili.com/all?keyword=${name}`;
    }
  }

  const modelviewerUrl = (skin: Skin) => {
    return `https://www.modelviewer.lol/en-US/model-viewer?id=${skin.id}`;
  }

  return (
    (<aside className={styles.popup}>
      <nav>
        <div>
          <User />
          <Link href={`/${lng}/skins`} as={`/${lng}/skins?type=champion&id=${skinChamp.alias}`}>
            <span>{skinChamp.name}</span>
          </Link>
        </div>
        {!!skinUniverse.length && (
          <div>
            <Globe />
            {skinUniverse.map((u) => (
              <Link key={u.id} href="/skins" as={`/${lng}/skins?type=universe&id=${u.id}`}>
                <span>{u.name}</span>
              </Link>
            ))}
          </div>
        )}
        {!!skinSkinlines.length && (
          <div>
            <Folder />
            {skinSkinlines.map((l) => (
              <Link key={l.id} href="/skins" as={`/${lng}/skins?type=skinline&id=${l.id}`}>
                <span>{l.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
      {skin.description && (
        <p dangerouslySetInnerHTML={{ __html: skin.description }} />
      )}

      <a href={skinSpotlightsUrl(skin)} target="_blank" rel="noreferrer">
        <h3>
          <span>
            <Video />
            View on SkinSpotlights
          </span>
          <ExternalLink />
        </h3>
      </a>
      <a href={modelviewerUrl(skin)} target="_blank" rel="noreferrer">
        <h3>
          <span>
            <Box />
            View 3D Model on Khada
          </span>
          <ExternalLink />
        </h3>
      </a>
    </aside>)
  );
}
