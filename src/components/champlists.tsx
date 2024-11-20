'use client';
import { useContext, useMemo } from "react";
import { PropsContext } from "../app/props";
import styles from "@/styles/index.module.scss";
import Link from "next/link";
import Image from "@/components/image";
import { asset } from "@/data/client_helpers";

export function ChampionsList({ role }: { role: string }) {
    const { champions, lang } = useContext(PropsContext);
    const filteredChamps = useMemo(() => {
        if (!role) return champions;
        return champions.filter((c) => c.roles.includes(role));
    }, [champions, role]);

    return (<div className={styles.champions}>
        {filteredChamps.map((c) => (
            <Link
                key={c.id}
                href={`champions/[champId]`}
                as={`champions/${c.key}`}
                prefetch={false}
            >
                <Image
                    unoptimized
                    className={styles.img}
                    src={asset(c.squarePortraitPath)}
                    alt={c.name}
                    width={80}
                    height={80}
                    priority
                />
                <div>{c.name}</div>
            </Link>
        ))}
    </div>);

}