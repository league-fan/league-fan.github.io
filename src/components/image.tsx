import NextImage from "next/image";
import { useState, useEffect } from "react";
import placeholder from "../assets/placeholder.svg";

interface ImageProps {
    src: string;
    [key: string]: any;
}

export default function Image({ src, ...props }: ImageProps) {
    const [exists, setExists] = useState(true);
    useEffect(() => setExists(true), [src]);

    let actualSrc = exists ? src : placeholder;

    return (
        <NextImage
            alt={""}
            src={actualSrc}
            {...props}
            onError={() => setExists(false)}
            style={exists ? {
                objectFit: 'contain',
            } : {}} />
    );
}
