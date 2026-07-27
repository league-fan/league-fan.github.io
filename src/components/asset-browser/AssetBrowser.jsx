import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AssetGrid from "./AssetGrid.jsx";
import FilterSidebar from "./FilterSidebar.jsx";
import MediaDrawer from "./MediaDrawer.jsx";
import Toolbar from "./Toolbar.jsx";
import Pagination from "../Pagination.jsx";
import { DENSITY_OPTIONS, INITIAL_FILTERS } from "./constants.js";
import {
  buildMediaGroups,
  deriveSkinFilterOptions,
  finalizeList,
  hasExtraMedia,
  sortItems,
} from "../../services/assets.js";
import { useMainStore } from "../../store.js";
import { progress } from "../../progress.js";

const EMPTY_FILTER_OPTIONS = { rarities: [], skinlines: [], champions: [] };
/** Media groups worth expanding on select — the rest start collapsed. */
const COLLAPSED_BY_DEFAULT = ["tile", "icon", "emote"];

function initialPageSize() {
  if (typeof window === "undefined") return 120;
  if (window.innerWidth < 900) return 72;
  if (window.innerWidth >= 1600) return 160;
  return 120;
}

function formatRole(role) {
  if (!role) return "Unknown";
  const s = String(role);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AssetBrowser({
  storeKey,
  category,
  scale,
  items,
  status,
  assetsProps,
  onRetry,
}) {
  const isSkins = category === "skins";
  const isChampions = category === "champions";
  const canGroup = isSkins || isChampions;

  const language = useMainStore((s) => s.settings.language);
  const imageCdn = useMainStore((s) => s.settings.imageCdn);
  const sliderVal = useMainStore((s) => s.settings.sliderVal);
  const setLanguage = useMainStore((s) => s.setLanguage);
  const setImageCdn = useMainStore((s) => s.setImageCdn);
  const changeSliderVal = useMainStore((s) => s.changeSliderVal);
  const clearGalleryCaches = useMainStore((s) => s.clearGalleryCaches);
  const setPreviewIndex = useMainStore((s) => s.setPreviewIndex);
  const previewIndex = useMainStore(
    (s) => s.galleries[storeKey]?.previewIndex ?? null,
  );

  const [densityId, setDensityId] = useState(() => sliderVal || 3);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageCurr, setPageCurr] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 900,
  );
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortMode, setSortMode] = useState("default");
  const [groupMode, setGroupMode] = useState("flat");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [panelOpen, setPanelOpen] = useState({ filters: true, details: true });
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaGroupOpen, setMediaGroupOpen] = useState({});

  const scrollRef = useRef(null);
  const loadedRef = useRef(0);
  const pageCountRef = useRef(0);

  const itemKey = useCallback(
    (item) => item[assetsProps.id] ?? item.id,
    [assetsProps.id],
  );

  /* --- search debounce: full-list scans only run when typing pauses ------ */
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(searchInput), 180);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /* --- list derivation --------------------------------------------------- */

  // Caches written by an older session may predate the sort/search keys
  const list = useMemo(() => {
    if (
      items.length &&
      (items[0]._loadIndex == null ||
        items[0]._timeSort == null ||
        items[0]._search == null)
    ) {
      return finalizeList(items, category);
    }
    return items;
  }, [items, category]);

  const filterOptions = useMemo(
    () =>
      isSkins && list.length ? deriveSkinFilterOptions(list) : EMPTY_FILTER_OPTIONS,
    [isSkins, list],
  );

  const filteredList = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return list.filter((item) => {
      // _search is precomputed on load (services/assets.js finalizeList)
      if (kw && !(item._search || "").includes(kw)) return false;
      if (!isSkins) return true;

      if (filters.rarities.length && !filters.rarities.includes(item.rarity)) {
        return false;
      }
      if (filters.legacy === "yes" && !item.isLegacy) return false;
      if (filters.legacy === "no" && item.isLegacy) return false;
      if (filters.base === "hide" && item.isBase) return false;
      if (filters.base === "only" && !item.isBase) return false;
      if (filters.hasChroma === "yes" && !(item.chromaCount > 0)) return false;
      if (filters.hasChroma === "no" && item.chromaCount > 0) return false;
      if (
        filters.championId !== "" &&
        String(item.champId) !== String(filters.championId)
      ) {
        return false;
      }
      if (filters.skinlineId !== "") {
        const ids = item.skinlineIds || [];
        if (!ids.map(String).includes(String(filters.skinlineId))) return false;
      }
      return true;
    });
  }, [list, keyword, filters, isSkins]);

  const groupLabel = useCallback(
    (item) => {
      if (groupMode === "champion") {
        return item.championName || `Champion ${item.champId}`;
      }
      if (groupMode === "skinline") {
        return (item.skinlineNames && item.skinlineNames[0]) || "No Series / Base";
      }
      if (groupMode === "role") return formatRole(item.primaryRole || "unknown");
      return "";
    },
    [groupMode],
  );

  const sortedList = useMemo(() => {
    const sorted = sortItems(filteredList, sortMode, category);
    if (groupMode === "flat" || !canGroup) return sorted;
    // Stable sort by group label — preserves time/default order within a group
    return [...sorted].sort((a, b) =>
      groupLabel(a).localeCompare(groupLabel(b), "zh"),
    );
  }, [filteredList, sortMode, category, groupMode, canGroup, groupLabel]);

  const totalPages = Math.max(1, Math.ceil(sortedList.length / pageSize) || 1);

  const pageItems = useMemo(() => {
    const start = (pageCurr - 1) * pageSize;
    return sortedList.slice(start, start + pageSize);
  }, [sortedList, pageCurr, pageSize]);

  pageCountRef.current = pageItems.length;

  const pageSections = useMemo(() => {
    if (!canGroup || groupMode === "flat") {
      return [{ key: "all", label: null, items: pageItems }];
    }
    // One champion can appear under several roles, so role grouping fans out
    if (groupMode === "role") {
      const map = new Map();
      for (const item of pageItems) {
        const roles = item.roles?.length ? item.roles : ["unknown"];
        for (const role of roles) {
          const key = `r:${role}`;
          if (!map.has(key)) {
            map.set(key, { key, label: formatRole(role), items: [] });
          }
          map.get(key).items.push(item);
        }
      }
      return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "zh"));
    }

    const sections = [];
    let current = null;
    for (const item of pageItems) {
      const key =
        groupMode === "champion"
          ? `c:${item.champId}`
          : `l:${(item.skinlineIds && item.skinlineIds[0]) ?? "none"}`;
      if (!current || current.key !== key) {
        current = { key, label: groupLabel(item), items: [] };
        sections.push(current);
      }
      current.items.push(item);
    }
    return sections;
  }, [pageItems, canGroup, groupMode, groupLabel]);

  /* --- paging bookkeeping ------------------------------------------------ */

  // Any change to the result set or page size restarts at page 1
  useEffect(() => {
    setPageCurr(1);
  }, [keyword, filters, sortMode, groupMode, pageSize, list]);

  useEffect(() => {
    if (pageCurr > totalPages) setPageCurr(1);
  }, [pageCurr, totalPages]);

  // Each page reloads its images — restart the load bar and scroll to the top
  useEffect(() => {
    loadedRef.current = 0;
    progress.set(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pageCurr, sortedList]);

  const handleImgLoad = useCallback(() => {
    const total = pageCountRef.current;
    if (total <= 0) return;
    loadedRef.current += 1;
    progress.increase((1 / total) * 101);
    if (loadedRef.current >= total) progress.finish();
  }, []);

  /* --- selection --------------------------------------------------------- */

  const preview = useMemo(() => {
    if (!sortedList.length) return null;
    if (previewIndex == null) return sortedList[0];
    return sortedList.find((i) => itemKey(i) === previewIndex) ?? sortedList[0];
  }, [sortedList, previewIndex, itemKey]);

  // Selection fell out of the current result set — pin it to the new first item
  useEffect(() => {
    if (preview && previewIndex !== itemKey(preview)) {
      setPreviewIndex({ storeKey, id: itemKey(preview) });
    }
  }, [preview, previewIndex, itemKey, setPreviewIndex, storeKey]);

  const previewId = preview ? (itemKey(preview) ?? null) : null;

  const mediaGroups = useMemo(
    () => buildMediaGroups(preview, category),
    [preview, category],
  );

  const selectItem = useCallback(
    (item) => {
      setPreviewIndex({ storeKey, id: itemKey(item) });

      const groups = buildMediaGroups(item, category);
      setMediaGroupOpen(
        Object.fromEntries(
          groups.map((g) => [g.key, !COLLAPSED_BY_DEFAULT.includes(g.key)]),
        ),
      );
      // Open only when there is more than the bare thumbnail already on screen
      setMediaOpen(
        groups.length > 0 &&
          ((item._hasMedia ?? hasExtraMedia(item, category)) ||
            isSkins ||
            category === "ward-skins"),
      );
    },
    [category, isSkins, itemKey, setPreviewIndex, storeKey],
  );

  /* --- control handlers --------------------------------------------------- */

  const onDensityChange = (n) => {
    setDensityId(n);
    changeSliderVal(n);
  };

  const onImageCdnChange = (mode) => {
    // Image URLs are baked into the cached lists — rebuild them
    clearGalleryCaches();
    setImageCdn(mode);
  };

  const onFilterChange = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const toggleRarity = (value) =>
    setFilters((f) => ({
      ...f,
      rarities: f.rarities.includes(value)
        ? f.rarities.filter((r) => r !== value)
        : [...f.rarities, value],
    }));

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchInput("");
    setKeyword("");
  };

  const onPageChange = (page) => {
    if (!Number.isFinite(page) || page < 1 || page > totalPages) return;
    if (page === pageCurr) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setPageCurr(page);
  };

  const activeFilterCount = useMemo(() => {
    if (!isSkins) return 0;
    let n = 0;
    if (filters.rarities.length) n++;
    if (filters.legacy !== "all") n++;
    if (filters.base !== "hide") n++;
    if (filters.hasChroma !== "all") n++;
    if (filters.championId !== "") n++;
    if (filters.skinlineId !== "") n++;
    return n;
  }, [isSkins, filters]);

  const density =
    DENSITY_OPTIONS.find((o) => o.id === densityId) || DENSITY_OPTIONS[2];
  const gridTemplateColumns = `repeat(auto-fill, minmax(${density.minPx}px, 1fr))`;

  const rangeLabel = sortedList.length
    ? `${((pageCurr - 1) * pageSize + 1).toLocaleString()}–${Math.min(
        pageCurr * pageSize,
        sortedList.length,
      ).toLocaleString()}`
    : "0–0";

  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden">
      {/* Below lg the sidebar floats over the grid — click-away to dismiss */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 z-30 cursor-default bg-ink-950/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <FilterSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        searchInput={searchInput}
        onSearchInput={setSearchInput}
        onSearchCommit={() => setKeyword(searchInput)}
        shownCount={sortedList.length}
        totalCount={list.length}
        isSkins={isSkins}
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
        onToggleRarity={toggleRarity}
        onResetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
        panelOpen={panelOpen}
        onTogglePanel={(name) =>
          setPanelOpen((p) => ({ ...p, [name]: !p[name] }))
        }
        preview={preview}
        previewId={previewId}
        category={category}
        assetsProps={assetsProps}
      />

      {/* ml-10 clears the collapsed rail, which is out of flow below lg */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col max-lg:ml-10">
        <Toolbar
          language={language}
          onLanguageChange={setLanguage}
          imageCdn={imageCdn}
          onImageCdnChange={onImageCdnChange}
          densityId={densityId}
          onDensityChange={onDensityChange}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          groupMode={groupMode}
          onGroupModeChange={setGroupMode}
          canGroup={canGroup}
          isSkins={isSkins}
          isChampions={isChampions}
          rangeLabel={rangeLabel}
          shownCount={sortedList.length}
          pageCurr={pageCurr}
          totalPages={totalPages}
        />

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {status === "error" ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-sm font-medium text-parchment/90">
                Couldn&rsquo;t load this collection.
              </p>
              <p className="max-w-sm text-[0.8rem] text-muted">
                Both the release CDN and CommunityDragon failed to respond. Check
                your connection, or try the 中国大陆 image CDN.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg border border-gold-500/50 bg-gold-500/10 px-4 py-1.5 text-[0.8rem] font-medium text-gold-300 transition hover:bg-gold-500/20"
              >
                Retry
              </button>
            </div>
          ) : status === "loading" ? (
            <div className="grid gap-2" style={{ gridTemplateColumns }}>
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-ink-800/70"
                  style={{ animationDelay: `${(i % 8) * 60}ms` }}
                />
              ))}
            </div>
          ) : pageItems.length ? (
            <AssetGrid
              sections={pageSections}
              gridTemplateColumns={gridTemplateColumns}
              itemKey={itemKey}
              assetsProps={assetsProps}
              scale={scale}
              previewId={previewId}
              isSkins={isSkins}
              isChampions={isChampions}
              onSelect={selectItem}
              onImgLoad={handleImgLoad}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <p className="text-sm text-muted">No items match your filters.</p>
              {(activeFilterCount > 0 || keyword) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-ink-600 px-3 py-1.5 text-[0.78rem] text-parchment/85 transition hover:border-gold-600 hover:text-gold-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="z-10 flex-none border-t border-ink-700/80 bg-ink-900/60 px-3 py-2 backdrop-blur-md">
          <Pagination
            current={pageCurr}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </div>
      </div>

      <MediaDrawer
        open={mediaOpen && mediaGroups.length > 0}
        groups={mediaGroups}
        title={preview?.[assetsProps.title]}
        previewId={previewId}
        groupOpen={mediaGroupOpen}
        onToggleGroup={(key) =>
          setMediaGroupOpen((m) => ({ ...m, [key]: m[key] === false }))
        }
        onClose={() => setMediaOpen(false)}
      />
    </div>
  );
}
