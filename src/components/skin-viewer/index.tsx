"use client"

import {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import classNames from "classnames";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";
import Image from "@/components/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Info,
  Maximize2,
  Minimize2,
  User,
  Users,
} from "lucide-react";
import {
  useEscapeTo,
  useLocalStorageState,
} from "@/data/helpers";
import styles from "./styles.module.scss";
import { getRarityUrl, asset } from "@/data/server";
import { Skin } from "@/types";

const _supportsPrefetch = () => {
  if (typeof window === "undefined") return false;
  const fakeLink = document.createElement("link");
  try {
    if (fakeLink.relList?.supports) {
      return fakeLink.relList.supports("prefetch");
    }
  } catch (err) {
    return false;
  }
};

const pseudoPrefetch = (skin: Skin, patch = "pbe") => {
  new window.Image().src = asset(skin.splashPath, { patch });
  new window.Image().src = asset(skin.uncenteredSplashPath, { patch });
};

const prefetchLinks = (skin: Skin, patch = "pbe") => {
  return skin.splashVideoPath ? (
    <>
      <link
        rel="prefetch"
        href={asset(skin.splashVideoPath, { patch })}
        as="video"
      />
      <link
        rel="prefetch"
        href={asset(skin.collectionSplashVideoPath ?? "", { patch })}
        as="video"
      />
    </>
  ) : (
    <>
      <link rel="prefetch" as="image" href={asset(skin.splashPath, { patch })} />
      <link
        rel="prefetch"
        as="image"
        href={asset(skin.uncenteredSplashPath, { patch })}
      />
    </>
  );
};

const canPlayWebM = () => {
  return (
    typeof window !== "undefined" &&
    document
      .createElement("video")
      .canPlayType('video/webm; codecs="vp8, vorbis"') === "probably"
  );
};

let draggingOrigin: [number, number] | null = null;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

type Props = {
  skin: Skin;
  skinCollection: Skin[];
  collectionIcon: ReactNode;
  collectionName: string;
  backTo: string;
  linkTo: (skin: Skin) => string;
  popup: ReactNode;
};

export function SkinViewer({
  skin,
  skinCollection,
  collectionIcon,
  collectionName,
  backTo,
  linkTo,
  popup,
}: Props) {
  const currIdx = skinCollection.findIndex((s) => s.id === skin.id);
  const prev = skinCollection[currIdx - 1];
  const next = skinCollection[currIdx + 1];

  const supportsVideo = useMemo(() => canPlayWebM(), []);
  const supportsPrefetch = useMemo(() => _supportsPrefetch(), []);

  const router = useRouter();
  useEscapeTo(backTo);
  const [centered, setCentered] = useLocalStorageState(
    "viewer__centered",
    false
  );
  const [fill, setFill] = useLocalStorageState("viewer__fill", false);
  const [deltaX, setDeltaX] = useState("0px");
  const [smoothX, setSmoothX] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [position, setPosition] = useState({ top: 0.5, left: 0.5 });
  const [velocity, setVelocity] = useState({ top: 0, left: 0 });
  const [patch, setPatch] = useState("");
  const showUIRef = useRef();
  const dimensions = useRef({ width: 1, height: 1 });

  useEffect(() => {
    setDeltaX("0px");
    setSmoothX(false);
    setExiting(false);
    setLoaded(false);
    setPosition({ top: 0.5, left: 0.5 });
    setPatch("");
    setVelocity({ top: 0, left: 0 });

    if (!supportsPrefetch) {
      pseudoPrefetch(skin);
      prev && pseudoPrefetch(prev);
      next && pseudoPrefetch(next);
    }
  }, [skin, supportsPrefetch, prev, next]);

  useEffect(() => {
    if (Math.abs(velocity.top) < 0.000001 && Math.abs(velocity.left) < 0.000001)
      return;

    const i = requestAnimationFrame(() => {
      setPosition({
        top: clamp(position.top - velocity.top * 18),
        left: clamp(position.left - velocity.left * 18),
      });
      setVelocity({
        top: velocity.top * 0.95,
        left: velocity.left * 0.95,
      });
    });
    return () => cancelAnimationFrame(i);
  }, [position.top, position.left, velocity]);

  useEffect(() => {
    if (showUI) {
      clearTimeout(showUIRef.current);
      setTimeout(() => setShowUI(false), 3000);
    }
  }, [showUI, setShowUI]);

  const vidPath = supportsVideo
    ? centered
      ? skin.splashVideoPath
      : skin.collectionSplashVideoPath
    : false;
  const imgPath = centered ? skin.splashPath : skin.uncenteredSplashPath;
  const objectFit = fill ? "cover" : "contain";
  const objectPosition = fill
    ? `${position.left * 100}% ${position.top * 100}% `
    : "center center";
  const rarity = getRarityUrl(skin.rarity);

  const goPrevious = useCallback(
    (swipe: boolean) => {
      if (!prev || exiting) return;
      setExiting(true);

      if (swipe) {
        setDeltaX(swipe ? "100vw" : "80px");
        router.prefetch(linkTo(prev));
        setTimeout(() => router.replace(linkTo(prev)), 300);
      } else {
        router.replace(linkTo(prev));
      }
    },
    [router, linkTo, prev, setExiting, setDeltaX, exiting]
  );

  const goNext = useCallback(
    (swipe: boolean) => {
      if (!next || exiting) return;
      setExiting(true);

      if (swipe) {
        setDeltaX(swipe ? "-100vw" : "-80px");
        router.prefetch(linkTo(next));
        setTimeout(() => router.replace(linkTo(next)), 300);
      } else {
        router.replace(linkTo(next));
      }
    },
    [router, linkTo, next, setExiting, setDeltaX, exiting]
  );

  const toggleFill = useCallback(() => setFill(!fill), [fill, setFill]);

  const toggleCentered = useCallback(
    () => setCentered(!centered),
    [centered, setCentered]
  );

  /**
   * Download the current image. We have to do it this way because Chrome
   * decided that a[href][download] shouldn't work for CORS stuff.
   */
  const downloadActive = useCallback(async () => {
    const image = await fetch(asset(imgPath, { patch }));
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `${skin.name}${patch ? " - Patch " + patch.replaceAll(".", "_") : ""
      }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(imageURL);
  }, [imgPath, patch, skin]);

  useEffect(() => {
    function onKeyDown(e: { key: string; code: string; }) {
      if (e.key === "ArrowLeft") goPrevious(false);
      if (e.key === "ArrowRight") goNext(false);
      if (e.code === "KeyZ") toggleFill();
      if (e.code === "KeyC") toggleCentered();
      if (e.code === "KeyD") downloadActive();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    goNext,
    goPrevious,
    toggleFill,
    toggleCentered,
    downloadActive,
    patch,
  ]);

  useEffect(() => {
    function onClick() {
      setShowInfoBox(false);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });

  const doPan = (x: number, y: number, isDelta = false) => {
    const delta = (isDelta || !draggingOrigin)
      ? [x, y]
      : [x - draggingOrigin[0], y - draggingOrigin[1]];
    const { width, height } = dimensions.current;
    !isDelta && (draggingOrigin = [x, y]);
    setPosition({
      left: clamp(
        position.left -
        delta[0] / ((width / height) * window.innerHeight - window.innerWidth)
      ),
      top: clamp(
        position.top -
        delta[1] / ((height / width) * window.innerWidth - window.innerHeight)
      ),
    });
  };

  const handlers = useSwipeable({
    onSwipeStart(e) {
      e.event.preventDefault();
      if (fill) {
        draggingOrigin = [e.deltaX, e.deltaY];
      }
    },
    onSwiping(e) {
      e.event.preventDefault();
      if (fill) {
        doPan(e.deltaX, e.deltaY);
      } else {
        if (!prev) return;
        if (e.dir === "Left" || e.dir === "Right") {
          setDeltaX(`${e.deltaX}px`);
          setSmoothX(false);
        }
      }
    },
    onSwiped(e) {
      e.event.preventDefault();
      if (fill) {
        const { width, height } = dimensions.current;
        let left = e.vxvy[0] / (width - window.innerWidth),
          top = e.vxvy[1] / (height - window.innerHeight);
        if (Math.abs(e.vxvy[0]) < 0.8) left = 0;
        if (Math.abs(e.vxvy[1]) < 0.8) top = 0;
        setVelocity({
          left,
          top,
        });
        draggingOrigin = null;
      } else {
        setDeltaX(`0px`);
        setSmoothX(true);
      }
    },
    onSwipedLeft(e) {
      e.event.preventDefault();
      !fill && e.velocity > 0.6 && goNext(true);
    },
    onSwipedRight(e) {
      e.event.preventDefault();
      !fill && e.velocity > 0.6 && goPrevious(true);
    },
    preventScrollOnSwipe: true,
    delta: { left: 3, right: 3, up: 50 },
  });

  return (
    <div
      className={classNames(styles.viewer, {
        [styles.exiting]: exiting,
        [styles.smoothX]: smoothX,
        [styles.loaded]: loaded,
        [styles.fill]: fill,
        [styles.show]: showUI,
      })}
    >
      <div
        className={styles.hitbox}
        {...handlers}
        onTouchStart={() =>
          setVelocity({
            top: 0,
            left: 0,
          })
        }
        onDoubleClick={toggleFill}
        onMouseDown={(e) => {
          if (fill) {
            draggingOrigin = [e.screenX, e.screenY];
          }
        }}
        onMouseMove={(e) => {
          if (fill && draggingOrigin) {
            doPan(e.screenX, e.screenY);
          }
          setShowUI(true);
        }}
        onMouseUp={(e) => {
          draggingOrigin = null;
        }}
        onWheel={(e) => {
          if (fill) {
            doPan(-e.deltaX, -e.deltaY, true);
          }
        }}
      />
      <div className={styles.overlay}>
        <header>
          <Link href={backTo} as={backTo} className={styles.backTo}>

            <ArrowLeft />
            <div>
              {collectionIcon}
              {collectionName}
            </div>

          </Link>
          <div className={styles.controls}>
            <div onClick={toggleFill} title="Fill Screen (Z)">
              {fill ? <Minimize2 /> : <Maximize2 />}
            </div>
            <div onClick={toggleCentered} title="Centered (C)">
              {centered ? <User /> : <Users />}
            </div>
            <div onClick={downloadActive} title="Download (D)">
              <Download />
            </div>
          </div>
        </header>
        {prev && (
          <Link href={usePathname()} as={linkTo(prev)} replace className={styles.prev}>
            <ArrowLeft />
            <div>{prev.name}</div>
          </Link>
        )}
        {next && (
          <Link href={usePathname()} as={linkTo(next)} replace className={styles.next}>
            <div>{next.name}</div>
            <ArrowRight />
          </Link>
        )}
      </div>
      <div
        className={classNames(styles.infoBox, { [styles.show]: showInfoBox })}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.name}
          onClickCapture={(e) => setShowInfoBox(!showInfoBox)}
        >
          <div>
            <span>
              {rarity && (
                <Image
                  unoptimized
                  src={rarity.imgUrl}
                  title={rarity.name}
                  alt={rarity.name}
                  objectFit="contain"
                  objectPosition="center"
                  layout="fixed"
                  width={18}
                  height={18}
                />
              )}
              <h1>{skin.name}</h1>
            </span>
            <Info />
          </div>
        </div>
        {popup}
      </div>
      <div className={styles.letterBox}>
        {vidPath ? (
          <video
            muted
            autoPlay
            loop
            key={vidPath}
            style={{ objectFit: "cover" }}
          >
            <source src={asset(vidPath, { patch })} />
          </video>
        ) : (
          <Image
            unoptimized
            priority
            src={asset(imgPath, { patch })}
            layout="fill"
            alt={skin.name}
            objectFit="cover"
          />
        )}
      </div>

      <main
        className={styles.main}
        style={{ transform: `translateX(${deltaX})` }}
      >
        {vidPath ? (
          <video
            muted
            autoPlay
            loop
            key={vidPath}
            style={{ objectFit, objectPosition }}
            onLoadedData={() => setLoaded(true)}
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement;
              dimensions.current = {
                width: video.videoWidth,
                height: video.videoHeight,
              };
            }}
          >
            <source src={asset(vidPath, { patch })} />
          </video>
        ) : (
          <Image
            priority
            unoptimized
            src={asset(imgPath, { patch })}
            layout="fill"
            alt={skin.name}
            objectFit={objectFit}
            objectPosition={objectPosition}
            onLoadingComplete={({ naturalHeight, naturalWidth }: {
              naturalHeight: number;
              naturalWidth: number;
            }) => {
              dimensions.current = {
                width: naturalWidth,
                height: naturalHeight,
              };
              setLoaded(true);
            }}
          />
        )}
      </main>
    </div>
  );
}