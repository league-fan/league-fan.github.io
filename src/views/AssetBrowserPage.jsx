import { useEffect, useState } from "react";
import AssetBrowser from "../components/asset-browser/AssetBrowser.jsx";
import { CATEGORY_PROPS, loadCategoryList } from "../services/assets.js";
import { useMainStore } from "../store.js";
import { progress } from "../progress.js";

const DEFAULT_PROPS = {
  id: "id",
  src: "imagePath",
  title: "name",
  description: "description",
};

/**
 * Generic gallery page. Loads one asset category and hands it to the browser.
 * Results are cached per (language, imageCdn) because both are baked into the
 * item image URLs at load time.
 */
export default function AssetBrowserPage({ gallery }) {
  const { storeKey, category, scale } = gallery;
  const language = useMainStore((s) => s.settings.language);
  const imageCdn = useMainStore((s) => s.settings.imageCdn);

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${language}|${imageCdn}`;
    const cached =
      useMainStore.getState().galleries[storeKey]?.caches?.[cacheKey];

    if (cached) {
      setItems(cached);
      setStatus("ready");
      return;
    }

    setItems([]);
    setStatus("loading");
    progress.start();

    loadCategoryList(category, language, { imageCdn })
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setStatus("ready");
        useMainStore
          .getState()
          .setGalleryCache({ storeKey, cacheKey, data: list });
        progress.finish();
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`[AssetBrowser] load ${category} failed`, err);
        setStatus("error");
        progress.fail();
      });

    return () => {
      cancelled = true;
    };
  }, [storeKey, category, language, imageCdn, reloadNonce]);

  return (
    <AssetBrowser
      storeKey={storeKey}
      category={category}
      scale={scale}
      items={items}
      status={status}
      assetsProps={CATEGORY_PROPS[category] || DEFAULT_PROPS}
      onRetry={() => setReloadNonce((n) => n + 1)}
    />
  );
}
