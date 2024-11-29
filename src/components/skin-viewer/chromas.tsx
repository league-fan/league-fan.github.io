'use client'
import Image from "../image";
import { asset } from "@/data/server";
import styles from "./styles.module.scss";
import { Skin } from "@/types";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Palette } from "lucide-react";

type Props = {
    skin: Skin;
}
export function Chromas({ skin }: Props) {
    const [showChromas, setShowChromas] = useState(false);
    useEffect(() => {
        setShowChromas(false);
    }, [skin]);

    if (!skin.chromas) return null;
    return (
        <>
            <h3 onClick={() => setShowChromas(!showChromas)}>
                <span>
                    <Palette /> {skin.chromas.length + 1} Chromas
                </span>
                {showChromas ? <ChevronUp /> : <ChevronDown />}
            </h3>
            {showChromas && (
                <div className={styles.chromas}>
                    {[skin, ...skin.chromas].map((chroma) => {
                        if (!chroma.chromaPath) return null;
                        return (
                            <div key={chroma.id}>
                                <a
                                    href={asset(chroma.chromaPath, {})}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Image
                                        loading="eager"
                                        unoptimized
                                        src={asset(chroma.chromaPath, {})}
                                        layout="fill"
                                        objectFit="contain"
                                        alt={skin.name}
                                    />
                                </a>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}