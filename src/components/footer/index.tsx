import classNames from "classnames";
import styles from "./styles.module.scss";
import { useProps } from "@/data2/contexts";
import getConfig from "next/config";
import { ReactNode } from "react";

const { publicRuntimeConfig } = getConfig();

interface FooterProps {
    flat?: boolean;
}

export function Footer({ flat }: FooterProps = { flat: false }) {
    const { patch } = useProps();
    return (
        <footer className={classNames(styles.footer, { [styles.flat]: flat })}>
            <div>
                <p>
                    In-game data provided by{" "}
                    <a
                        target="_blank"
                        href="https://communitydragon.org"
                        rel="noreferrer"
                    >
                        CommunityDragon
                    </a>{" "}
                    and the{" "}
                    <a
                        target="_blank"
                        href="https://leagueoflegends.fandom.com/"
                        rel="noreferrer"
                    >
                        League of Legends Wiki
                    </a>
                    .
                </p>
                <p>
                    Skin Explorer was created under Riot Games&apos;{" "}
                    <a
                        target="_blank"
                        href="https://www.riotgames.com/en/legal"
                        rel="noreferrer"
                    >
                        &quot;Legal Jibber Jabber&quot;
                    </a>{" "}
                    policy using assets owned by Riot Games. Riot Games does not endorse
                    or sponsor this project.
                </p>
            </div>
            <div>
                {patch && (
                    <p>
                        <a
                            href="https://raw.communitydragon.org/pbe"
                            target="_blank"
                            style={{ textDecoration: "none" }}
                            rel="noreferrer"
                        >
                            <b>Patch {patch}</b>
                        </a>
                    </p>
                )}
                <p>
                    <a
                        target="_blank"
                        href={`https://github.com/preyneyv/lol-skin-explorer/tree/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "main"
                            }`}
                        style={{ textDecoration: "none" }}
                        rel="noreferrer"
                    >
                        Skin Explorer v{publicRuntimeConfig?.version}
                    </a>
                    <br />
                    Built by{" "}
                    <a
                        target="_blank"
                        href="https://github.com/preyneyv"
                        rel="noreferrer"
                    >
                        @preyneyv
                    </a>
                    .{" "}
                    <a
                        target="_blank"
                        href="https://github.com/preyneyv/lol-skin-explorer"
                        rel="noreferrer"
                    >
                        View Source on GitHub
                    </a>
                </p>
            </div>
        </footer>
    );
}

export function FooterContainer({ children }: { children: ReactNode }) {
    return <div className={styles.container}>{children}</div>;
}
