import NextImage from "next/legacy/image";
import { useState, useEffect } from "react";
import placeholder from "../assets/placeholder.svg";

interface ImageProps {
    src: string;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    [key: string]: any;
}

export default function Image({ src, objectFit, ...props }: ImageProps) {
    const [exists, setExists] = useState(true);
    useEffect(() => setExists(true), [src]);

    let actualSrc = exists ? src : placeholder;

    return (
        <NextImage
            alt={""}
            src={actualSrc}
            {...props}
            objectFit={exists ? objectFit : "contain"}
            onError={() => setExists(false)}
        />
    );
}
