<script>
import Pagination from "../components/Pagination.vue";
import ImageTooltip from "../components/ImageTooltip.vue";
import {
  DETAIL_FIELDS,
  SORT_OPTIONS,
  deriveSkinFilterOptions,
  buildMediaGroups,
  hasExtraMedia,
  sortItems,
  finalizeList,
} from "../services/assets.js";

/** Density = min card width; grid always auto-fills available space */
const DENSITY_OPTIONS = [
  { id: 1, name: "XS (dense)", minPx: 88 },
  { id: 2, name: "S", minPx: 110 },
  { id: 3, name: "M", minPx: 140 },
  { id: 4, name: "L", minPx: 180 },
  { id: 5, name: "XL", minPx: 240 },
];

const PAGE_SIZE_OPTIONS = [48, 72, 96, 120, 160, 240];

export default {
  name: "ImgFrame",
  components: { Pagination, ImageTooltip },
  props: {
    name: {
      type: String,
      required: true,
    },
    assetsList: {
      type: Array,
      required: true,
    },
    assetsProps: {
      type: Object,
      required: true,
    },
    scale: {
      type: Number,
      default: 1.5,
    },
    /** Route category id, e.g. skins / summoner-icons */
    category: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pageSize: 120,
      pageCurr: 1,
      pageLoaded: 0,
      pageItemNum: 0,
      search: {
        keyword: "",
      },
      /** flat | champion | skinline | role */
      groupMode: "flat",
      /** default | time-asc | time-desc */
      sortMode: "default",
      sortOptions: SORT_OPTIONS,
      /** hide base skins by default for skins category */
      filters: {
        rarities: /** @type {string[]} */ ([]),
        legacy: "all", // all | yes | no
        base: "hide", // all | hide | only
        hasChroma: "all", // all | yes | no
        championId: "",
        skinlineId: "",
      },
      sidebarOpen: true,
      /** Right media drawer */
      mediaOpen: false,
      /** Collapsible panels in sidebar + media groups */
      panelOpen: {
        filters: true,
        details: true,
      },
      mediaGroupOpen: /** @type {Record<string, boolean>} */ ({}),
      densityOptions: DENSITY_OPTIONS,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      densityId: 3,
      gridMod: "repeat(auto-fill, minmax(140px, 1fr))",
      preview: {},
      filterOptions: {
        rarities: [],
        skinlines: [],
        champions: [],
      },
    };
  },
  computed: {
    isSkins() {
      return this.category === "skins" || this.name === "skins";
    },
    isChampions() {
      return this.category === "champions" || this.name === "champions";
    },
    canGroup() {
      return this.isSkins || this.isChampions;
    },
    detailFields() {
      return DETAIL_FIELDS[this.category] || DETAIL_FIELDS[this.name] || [];
    },
    mediaGroups() {
      return buildMediaGroups(this.preview, this.category);
    },
    previewHasMedia() {
      return hasExtraMedia(this.preview, this.category) || this.mediaGroups.length > 0;
    },
    filteredList() {
      const list = Array.isArray(this.assetsList) ? this.assetsList : [];
      const kw = (this.search.keyword || "").trim().toLowerCase();
      const titleKey = this.assetsProps.title;
      const idKey = this.assetsProps.id;
      const descKey = this.assetsProps.description;

      return list.filter((item) => {
        if (kw) {
          const hay = [
            item[titleKey],
            item[idKey],
            item.id,
            item[descKey],
            item.championName,
            item.championAlias,
            item.rarityName,
            item.rarity,
            ...(item.skinlineNames || []),
            item.alias,
            item.key,
            item.title,
            item.name,
          ]
            .filter((v) => v != null && v !== "")
            .map((v) => String(v).toLowerCase())
            .join(" ");
          if (!hay.includes(kw)) return false;
        }

        if (!this.isSkins) return true;

        const f = this.filters;
        if (f.rarities.length && !f.rarities.includes(item.rarity)) {
          return false;
        }
        if (f.legacy === "yes" && !item.isLegacy) return false;
        if (f.legacy === "no" && item.isLegacy) return false;
        if (f.base === "hide" && item.isBase) return false;
        if (f.base === "only" && !item.isBase) return false;
        if (f.hasChroma === "yes" && !(item.chromaCount > 0)) return false;
        if (f.hasChroma === "no" && item.chromaCount > 0) return false;
        if (
          f.championId !== "" &&
          String(item.champId) !== String(f.championId)
        ) {
          return false;
        }
        if (f.skinlineId !== "") {
          const ids = item.skinlineIds || [];
          if (!ids.map(String).includes(String(f.skinlineId))) return false;
        }
        return true;
      });
    },
    /** Sorted list: time/default first, then optional grouping (stable). */
    sortedList() {
      let list = sortItems(
        this.filteredList,
        this.sortMode,
        this.category,
      );
      if (this.groupMode === "flat" || !this.canGroup) {
        return list;
      }
      // Stable sort by group label — preserves time/default order within group
      return [...list].sort((a, b) => {
        const la = this.groupLabel(a);
        const lb = this.groupLabel(b);
        return la.localeCompare(lb, "zh");
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.sortedList.length / this.pageSize) || 1);
    },
    pageItems() {
      const start = (this.pageCurr - 1) * this.pageSize;
      return this.sortedList.slice(start, start + this.pageSize);
    },
    /** Page items with optional group header markers. */
    pageSections() {
      if (!this.canGroup || this.groupMode === "flat") {
        return [{ key: "all", label: null, items: this.pageItems }];
      }
      // Role grouping: one champion may appear under multiple roles
      if (this.groupMode === "role") {
        const map = new Map();
        for (const item of this.pageItems) {
          const roles =
            Array.isArray(item.roles) && item.roles.length
              ? item.roles
              : ["unknown"];
          for (const role of roles) {
            const key = `r:${role}`;
            if (!map.has(key)) {
              map.set(key, {
                key,
                label: this.formatRole(role),
                items: [],
              });
            }
            map.get(key).items.push(item);
          }
        }
        return [...map.values()].sort((a, b) =>
          a.label.localeCompare(b.label, "zh"),
        );
      }
      const sections = [];
      let current = null;
      for (const item of this.pageItems) {
        const key = this.groupKey(item);
        const label = this.groupLabel(item);
        if (!current || current.key !== key) {
          current = { key, label, items: [] };
          sections.push(current);
        }
        current.items.push(item);
      }
      return sections;
    },
    pageRangeLabel() {
      if (!this.sortedList.length) return "0–0";
      const start = (this.pageCurr - 1) * this.pageSize + 1;
      const end = Math.min(
        this.pageCurr * this.pageSize,
        this.sortedList.length,
      );
      return `${start}–${end}`;
    },
    previewRows() {
      if (!this.preview || Object.keys(this.preview).length === 0) return [];
      const rows = [];
      for (const [label, getter, type = "text"] of this.detailFields) {
        let value;
        try {
          value = getter(this.preview);
        } catch {
          value = null;
        }
        if (value == null || value === "" || value === false) {
          if (type === "bool" && value === false) {
            rows.push({ label, value: false, type });
          }
          continue;
        }
        if (type === "bool" && value !== true && value !== false) continue;
        if (type === "chromas" && (!Array.isArray(value) || !value.length)) {
          continue;
        }
        rows.push({ label, value, type });
      }
      return rows;
    },
    previewSrc() {
      const p = this.assetsProps;
      return this.preview?.[p.src] || this.preview?.tilePath || "";
    },
    previewId() {
      if (!this.preview) return null;
      const id = this.preview[this.assetsProps.id] ?? this.preview.id;
      return id != null ? id : null;
    },
    activeFilterCount() {
      if (!this.isSkins) return 0;
      let n = 0;
      const f = this.filters;
      if (f.rarities.length) n++;
      if (f.legacy !== "all") n++;
      if (f.base !== "hide") n++;
      if (f.hasChroma !== "all") n++;
      if (f.championId !== "") n++;
      if (f.skinlineId !== "") n++;
      return n;
    },
  },
  watch: {
    assetsList: {
      immediate: true,
      handler(list) {
        if (Array.isArray(list) && list.length) {
          // Ensure sort keys exist (covers vuex cache from older sessions)
          if (list[0]._loadIndex == null || list[0]._timeSort == null) {
            finalizeList(list, this.category);
          }
          if (this.isSkins) {
            this.filterOptions = deriveSkinFilterOptions(list);
          }
        }
        this.pageCurr = 1;
        this.syncPreview();
      },
    },
    sortedList() {
      const maxPage = this.totalPages;
      if (this.pageCurr > maxPage) this.pageCurr = 1;
      this.syncPreview();
    },
    pageCurr() {
      this.resetPageLoadProgress();
    },
    pageSize() {
      this.pageCurr = 1;
      this.resetPageLoadProgress();
    },
    category() {
      this.resetFilters();
      this.groupMode = "flat";
      this.sortMode = "default";
      this.pageCurr = 1;
      this.mediaOpen = false;
    },
    sortMode() {
      this.pageCurr = 1;
    },
  },
  mounted() {
    if (window.innerWidth < 900) {
      this.sidebarOpen = false;
      this.pageSize = 72;
    } else if (window.innerWidth >= 1600) {
      this.pageSize = 160;
    } else {
      this.pageSize = 120;
    }
    const stored = this.$store.state.settings.sliderVal || 3;
    this.densityId = stored;
    this.onDensityChange(stored);
    this.syncPreview();
  },
  methods: {
    formatRole(role) {
      if (!role) return "Unknown";
      const s = String(role);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    groupKey(item) {
      if (this.groupMode === "champion") return `c:${item.champId}`;
      if (this.groupMode === "skinline") {
        return `l:${(item.skinlineIds && item.skinlineIds[0]) ?? "none"}`;
      }
      if (this.groupMode === "role") {
        return `r:${item.primaryRole || "unknown"}`;
      }
      return "all";
    },
    groupLabel(item) {
      if (this.groupMode === "champion") {
        return item.championName || `Champion ${item.champId}`;
      }
      if (this.groupMode === "skinline") {
        return (
          (item.skinlineNames && item.skinlineNames[0]) || "No Series / Base"
        );
      }
      if (this.groupMode === "role") {
        return this.formatRole(item.primaryRole || "unknown");
      }
      return "";
    },
    resetFilters() {
      this.search.keyword = "";
      this.filters = {
        rarities: [],
        legacy: "all",
        base: this.isSkins ? "hide" : "all",
        hasChroma: "all",
        championId: "",
        skinlineId: "",
      };
      this.pageCurr = 1;
    },
    toggleRarity(value) {
      const idx = this.filters.rarities.indexOf(value);
      if (idx >= 0) this.filters.rarities.splice(idx, 1);
      else this.filters.rarities.push(value);
      this.pageCurr = 1;
    },
    onSearch() {
      this.pageCurr = 1;
    },
    onDensityChange(value) {
      const n = Number(value);
      this.densityId = n;
      this.$store.commit("changeSliderVal", n);
      const opt =
        this.densityOptions.find((o) => o.id === n) || this.densityOptions[2];
      this.gridMod = `repeat(auto-fill, minmax(${opt.minPx}px, 1fr))`;
    },
    onGroupModeChange() {
      this.pageCurr = 1;
    },
    onSortModeChange() {
      this.pageCurr = 1;
    },
    itemKey(item) {
      return item[this.assetsProps.id] ?? item.id;
    },
    updatePreview(item) {
      const id = this.itemKey(item);
      if (this.$store.state[this.name]) {
        // null means unset; allow real id 0
        this.$store.state[this.name].previewIndex = id;
      }
      this.preview = item;
      this.openMediaDrawer(item);
    },
    openMediaDrawer(item) {
      const groups = buildMediaGroups(item, this.category);
      const open = {};
      for (const g of groups) {
        // Expand groups with extra visual content by default
        open[g.key] = ["splash", "chromas", "loadscreen", "ward", "portrait"].includes(
          g.key,
        )
          ? true
          : g.key === "tile" || g.key === "icon" || g.key === "emote"
            ? false
            : true;
      }
      this.mediaGroupOpen = open;
      // Open drawer when there is media beyond a bare single thumb, or always for skins
      this.mediaOpen =
        groups.length > 0 &&
        (hasExtraMedia(item, this.category) ||
          this.isSkins ||
          this.category === "ward-skins");
    },
    closeMediaDrawer() {
      this.mediaOpen = false;
    },
    toggleMediaGroup(key) {
      this.mediaGroupOpen = {
        ...this.mediaGroupOpen,
        [key]: !this.mediaGroupOpen[key],
      };
    },
    isMediaGroupOpen(key) {
      return this.mediaGroupOpen[key] !== false;
    },
    hasExtraMedia(item, cat) {
      return hasExtraMedia(item, cat || this.category);
    },
    syncPreview() {
      const gallery = this.$store.state[this.name];
      const list = this.sortedList;
      if (!list.length) {
        this.preview = {};
        return;
      }
      if (!gallery) {
        this.preview = list[0];
        return;
      }
      const idx = gallery.previewIndex;
      const found =
        idx === null || idx === undefined
          ? null
          : list.find((item) => this.itemKey(item) === idx);
      this.preview = found || list[0];
      if (found == null && this.preview) {
        gallery.previewIndex = this.itemKey(this.preview);
      }
    },
    resetPageLoadProgress() {
      this.$Progress?.set?.(0);
      this.pageItemNum = this.pageItems.length;
      this.pageLoaded = 0;
      this.$nextTick(() => {
        this.$refs.galleryScroll?.scrollTo?.({ top: 0 });
      });
    },
    onPageChange(val) {
      const page = Number(val);
      if (!Number.isFinite(page) || page < 1 || page > this.totalPages) return;
      if (page === this.pageCurr) {
        this.$refs.galleryScroll?.scrollTo?.({ top: 0, behavior: "smooth" });
        return;
      }
      this.pageCurr = page;
    },
    onLangChange() {
      this.$emit("onLangChange");
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    togglePanel(name) {
      this.panelOpen[name] = !this.panelOpen[name];
    },
    handleImgLoad() {
      this.pageLoaded++;
      if (this.pageItemNum > 0) {
        this.$Progress.increase((1 / this.pageItemNum) * 101);
      }
      if (this.pageLoaded >= this.pageItemNum) {
        this.$Progress.finish();
      }
    },
  },
};
</script>

<template>
  <div class="browser" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <!-- Left rail: collapse « / expand » -->
    <aside id="menu" class="sidebar" :aria-expanded="sidebarOpen">
      <button
        type="button"
        class="sidebar-rail-btn"
        :title="sidebarOpen ? '向左隐藏侧栏' : '向右展开侧栏'"
        :aria-label="sidebarOpen ? '向左隐藏侧栏' : '向右展开侧栏'"
        @click="toggleSidebar"
      >
        <span class="rail-icon" aria-hidden="true">{{
          sidebarOpen ? "‹" : "›"
        }}</span>
        <span v-if="!sidebarOpen && activeFilterCount" class="rail-badge">{{
          activeFilterCount
        }}</span>
      </button>

      <div v-show="sidebarOpen" class="sidebar-scroll">
        <div class="search">
          <input
            type="search"
            placeholder="Search name, id, series…"
            v-model="search.keyword"
            @input="onSearch"
            @keyup.enter="onSearch"
          />
          <span class="hint"
            >{{ sortedList.length }} / {{ assetsList.length }} items</span
          >
        </div>

        <div v-if="isSkins" class="panel">
          <header
            class="panel-head panel-head-toggle"
            role="button"
            tabindex="0"
            :aria-expanded="panelOpen.filters"
            @click="togglePanel('filters')"
            @keydown.enter.prevent="togglePanel('filters')"
            @keydown.space.prevent="togglePanel('filters')"
          >
            <span class="panel-head-title">
              <span class="panel-chevron" aria-hidden="true">{{
                panelOpen.filters ? "▾" : "▸"
              }}</span>
              Filters
              <span v-if="activeFilterCount" class="panel-count"
                >({{ activeFilterCount }})</span
              >
            </span>
            <button
              v-if="activeFilterCount"
              type="button"
              class="linkish"
              @click.stop="resetFilters"
            >
              Reset
            </button>
          </header>
          <div v-show="panelOpen.filters" class="panel-body">
            <div class="field">
              <label>Rarity</label>
              <div class="chip-row">
                <button
                  v-for="r in filterOptions.rarities"
                  :key="r.value"
                  type="button"
                  class="chip"
                  :class="{ active: filters.rarities.includes(r.value) }"
                  @click="toggleRarity(r.value)"
                >
                  {{ r.label }}
                </button>
              </div>
            </div>

            <div class="field">
              <label for="legacy-f">Legacy</label>
              <select id="legacy-f" v-model="filters.legacy">
                <option value="all">All</option>
                <option value="yes">Legacy only</option>
                <option value="no">Non-legacy</option>
              </select>
            </div>

            <div class="field">
              <label for="base-f">Base skins</label>
              <select id="base-f" v-model="filters.base">
                <option value="hide">Hide base</option>
                <option value="all">Show all</option>
                <option value="only">Base only</option>
              </select>
            </div>

            <div class="field">
              <label for="chroma-f">Chromas</label>
              <select id="chroma-f" v-model="filters.hasChroma">
                <option value="all">All</option>
                <option value="yes">Has chromas</option>
                <option value="no">No chromas</option>
              </select>
            </div>

            <div class="field">
              <label for="champ-f">Champion</label>
              <select id="champ-f" v-model="filters.championId">
                <option value="">All champions</option>
                <option
                  v-for="c in filterOptions.champions"
                  :key="c.value"
                  :value="c.value"
                >
                  {{ c.label }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="line-f">Series</label>
              <select id="line-f" v-model="filters.skinlineId">
                <option value="">All series</option>
                <option
                  v-for="l in filterOptions.skinlines"
                  :key="l.value"
                  :value="l.value"
                >
                  {{ l.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="panel detail-panel">
          <header
            class="panel-head panel-head-toggle"
            role="button"
            tabindex="0"
            :aria-expanded="panelOpen.details"
            @click="togglePanel('details')"
            @keydown.enter.prevent="togglePanel('details')"
            @keydown.space.prevent="togglePanel('details')"
          >
            <span class="panel-head-title">
              <span class="panel-chevron" aria-hidden="true">{{
                panelOpen.details ? "▾" : "▸"
              }}</span>
              Details
            </span>
            <span v-if="previewId != null" class="muted">#{{ previewId }}</span>
          </header>
          <div v-show="panelOpen.details" class="panel-body">
            <div v-if="previewSrc" class="detail-thumb">
              <img
                :src="previewSrc"
                :alt="String(preview[assetsProps.title] || '')"
              />
            </div>

            <dl v-if="previewRows.length" class="detail-dl">
              <template v-for="(row, idx) in previewRows" :key="idx">
                <dt>{{ row.label }}</dt>
                <dd>
                  <template v-if="row.type === 'bool'">
                    {{ row.value ? "Yes" : "No" }}
                  </template>
                  <template v-else-if="row.type === 'link'">
                    <a :href="String(row.value)" target="_blank" rel="noopener"
                      >Open</a
                    >
                  </template>
                  <template v-else-if="row.type === 'image'">
                    <img class="rarity-gem" :src="String(row.value)" alt="" />
                  </template>
                  <template v-else-if="row.type === 'html'">
                    <div class="html-block" v-html="row.value"></div>
                  </template>
                  <template v-else>
                    <span class="pre-wrap">{{ row.value }}</span>
                  </template>
                </dd>
              </template>
            </dl>
            <p v-else class="muted">Select an item to view properties.</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Right pane: fixed toolbar + scrollable gallery + fixed pagination -->
    <div class="content">
      <div class="content-toolbar">
        <div class="toolbar-fields">
          <div class="toolbar-field">
            <label for="lang-select">Language</label>
            <select
              id="lang-select"
              v-model="$store.state.settings.language"
              @change="onLangChange"
            >
              <option value="chinese">Chinese</option>
              <option value="english">English</option>
            </select>
          </div>

          <div class="toolbar-field">
            <label for="density-select">Card size</label>
            <select
              id="density-select"
              v-model.number="densityId"
              @change="onDensityChange(densityId)"
            >
              <option
                v-for="opt in densityOptions"
                :key="opt.id"
                :value="opt.id"
              >
                {{ opt.name }}
              </option>
            </select>
          </div>

          <div class="toolbar-field">
            <label for="pagesize-select">Per page</label>
            <select id="pagesize-select" v-model.number="pageSize">
              <option v-for="n in pageSizeOptions" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>

          <div class="toolbar-field">
            <label for="sort-select">Sort</label>
            <select
              id="sort-select"
              v-model="sortMode"
              @change="onSortModeChange"
            >
              <option
                v-for="opt in sortOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div v-if="canGroup" class="toolbar-field">
            <label for="group-select">Group by</label>
            <select
              id="group-select"
              v-model="groupMode"
              @change="onGroupModeChange"
            >
              <option value="flat">Flat</option>
              <option v-if="isSkins" value="champion">Hero</option>
              <option v-if="isSkins" value="skinline">Series</option>
              <option v-if="isChampions" value="role">Roles</option>
            </select>
          </div>
        </div>

        <div class="toolbar-meta">
          <span>
            {{ pageRangeLabel }}
            /
            <strong>{{ sortedList.length }}</strong>
            · page
            <strong>{{ pageCurr }}</strong>
            /
            <strong>{{ totalPages }}</strong>
          </span>
        </div>
      </div>

      <div class="gallery-scroll" ref="galleryScroll">
        <section class="gallery">
          <template v-for="section in pageSections" :key="section.key">
            <h3 v-if="section.label" class="group-heading">
              {{ section.label }}
              <span class="muted">({{ section.items.length }})</span>
            </h3>
            <div class="image-grid" :style="{ gridTemplateColumns: gridMod }">
              <div
                v-for="item in section.items"
                :key="itemKey(item)"
                class="grid-cell"
                :class="{ selected: previewId === itemKey(item) }"
                @click="updatePreview(item)"
              >
                <ImageTooltip
                  :img-src="item[assetsProps.src]"
                  :id="item[assetsProps.id]"
                  :description="
                    item[assetsProps.description] || item.rarityName || ''
                  "
                  :name="item[assetsProps.title]"
                  :scale="scale"
                  :popup="false"
                  @handle-img-load="handleImgLoad"
                />
                <div class="cell-meta">
                  <span class="cell-title">{{ item[assetsProps.title] }}</span>
                  <span v-if="isSkins && item.rarityName" class="cell-sub">
                    <img
                      v-if="item.rarityIcon"
                      class="mini-gem"
                      :src="item.rarityIcon"
                      alt=""
                    />
                    {{ item.rarityName }}
                    <template v-if="item.chromaCount"
                      >· {{ item.chromaCount }} chroma</template
                    >
                  </span>
                  <span
                    v-else-if="isChampions && item.rolesLabel"
                    class="cell-sub"
                  >
                    {{ item.rolesLabel }}
                  </span>
                  <span
                    v-else-if="item[assetsProps.description]"
                    class="cell-sub"
                  >
                    {{ item[assetsProps.description] }}
                  </span>
                  <span
                    v-if="hasExtraMedia(item, category)"
                    class="cell-media-hint"
                    >media</span
                  >
                </div>
              </div>
            </div>
          </template>

          <p v-if="!pageItems.length" class="empty">
            No items match your filters.
          </p>
        </section>
      </div>

      <div class="pagination-wrap">
        <Pagination
          :key="`pg-${pageSize}-${sortedList.length}`"
          :current="pageCurr"
          :total="sortedList.length"
          :per-page="pageSize"
          text-before-input="Go to"
          text-after-input="Go"
          @page-changed="onPageChange"
        />
      </div>
    </div>

    <!-- Independent right media drawer (splash / chromas / …) -->
    <aside
      class="media-drawer"
      :class="{ open: mediaOpen && mediaGroups.length }"
      aria-label="Media assets"
    >
      <div class="media-drawer-head">
        <div class="media-drawer-title">
          <strong>{{ preview[assetsProps.title] || "Media" }}</strong>
          <span v-if="previewId != null" class="muted">#{{ previewId }}</span>
        </div>
        <button
          type="button"
          class="media-close"
          title="Close media panel"
          @click="closeMediaDrawer"
        >
          ›
        </button>
      </div>
      <div class="media-drawer-scroll">
        <div
          v-for="group in mediaGroups"
          :key="group.key"
          class="media-group"
        >
          <header
            class="media-group-head"
            role="button"
            tabindex="0"
            :aria-expanded="isMediaGroupOpen(group.key)"
            @click="toggleMediaGroup(group.key)"
            @keydown.enter.prevent="toggleMediaGroup(group.key)"
            @keydown.space.prevent="toggleMediaGroup(group.key)"
          >
            <span>
              <span class="panel-chevron" aria-hidden="true">{{
                isMediaGroupOpen(group.key) ? "▾" : "▸"
              }}</span>
              {{ group.label }}
            </span>
            <span class="muted">{{ group.items.length }}</span>
          </header>
          <div v-show="isMediaGroupOpen(group.key)" class="media-group-body">
            <div
              v-for="m in group.items"
              :key="m.id"
              class="media-card"
            >
              <a
                v-if="m.kind === 'video'"
                :href="m.src"
                target="_blank"
                rel="noopener"
                class="media-video-link"
              >
                ▶ {{ m.title || "Video" }}
              </a>
              <template v-else>
                <a :href="m.src" target="_blank" rel="noopener">
                  <img :src="m.src" :alt="m.title || ''" loading="lazy" />
                </a>
                <div v-if="m.title || m.caption || m.colors" class="media-cap">
                  <strong v-if="m.title">{{ m.title }}</strong>
                  <div
                    v-if="m.colors && m.colors.length"
                    class="chroma-swatches"
                  >
                    <span
                      v-for="(col, ci) in m.colors"
                      :key="ci"
                      class="swatch"
                      :style="{ background: col }"
                    ></span>
                  </div>
                  <p v-if="m.caption">{{ m.caption }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
        <p v-if="!mediaGroups.length" class="muted empty">No media assets.</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Two independent scroll panes under sticky header/footer */
.browser {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.sidebar {
  flex: 0 0 var(--sidebar-width, 300px);
  width: var(--sidebar-width, 300px);
  max-width: 100%;
  border-right: 1px solid var(--secondary-color);
  min-height: 0;
  height: 100%;
  background: var(--background-color);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: flex-basis 0.18s ease, width 0.18s ease;
}

/* Collapsed: thin left rail only, expand › to the right */
.browser.sidebar-collapsed .sidebar {
  flex: 0 0 2rem;
  width: 2rem;
}

.sidebar-rail-btn {
  flex: 0 0 2rem;
  width: 2rem;
  align-self: stretch;
  border: none;
  border-right: 1px solid var(--secondary-color);
  background: color-mix(in srgb, var(--secondary-color) 10%, transparent);
  color: var(--primary-color);
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0.65rem;
  gap: 0.35rem;
  font: inherit;
  line-height: 1;
}

.sidebar-rail-btn:hover {
  background: color-mix(in srgb, var(--primary-color) 12%, transparent);
}

.rail-icon {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1;
  user-select: none;
}

.rail-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.2rem;
  border-radius: 999px;
  background: var(--primary-color);
  color: var(--invert-font-color);
  font-size: 0.65rem;
  font-weight: 600;
}

.sidebar-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 0.65rem 0.75rem 1.25rem;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}

/* Right column: toolbar | scroll gallery | fixed pager */
.content {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.content-toolbar {
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--secondary-color);
  background: var(--background-color);
  z-index: 5;
}

.toolbar-fields {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem 0.75rem;
  min-width: 0;
}

.toolbar-field {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 7rem;
}

.toolbar-field label {
  font-size: 0.72rem;
  color: var(--secondary-color);
  line-height: 1.2;
}

.toolbar-field select {
  min-width: 7.5rem;
  max-width: 12rem;
  margin: 0;
}

.toolbar-meta {
  font-size: 0.82rem;
  color: var(--secondary-color);
  white-space: nowrap;
}

.gallery-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 0.6rem 0.75rem;
}

.gallery {
  min-height: min-content;
}

.image-grid {
  display: grid;
  gap: 0.5rem;
  width: 100%;
  grid-template-rows: auto;
  margin-bottom: 0.75rem;
}

.grid-cell {
  cursor: pointer;
  border: 1px solid transparent;
  padding: 0.25rem;
  transition: border-color 0.15s, background 0.15s;
  min-width: 0;
}

.grid-cell:hover {
  border-color: var(--secondary-color);
  background: color-mix(in srgb, var(--primary-color) 6%, transparent);
}

.grid-cell.selected {
  border-color: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 10%, transparent);
}

.cell-meta {
  margin-top: 0.25rem;
  font-size: 0.72rem;
  line-height: 1.25;
}

.cell-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.cell-sub {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--secondary-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-media-hint {
  display: inline-block;
  margin-top: 0.15rem;
  font-size: 0.65rem;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mini-gem {
  width: 12px;
  height: 12px;
  object-fit: contain;
  flex-shrink: 0;
}

.group-heading {
  margin: 0.75rem 0 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px dashed var(--secondary-color);
  font-size: 1rem;
  font-weight: 600;
}

.group-heading:first-child {
  margin-top: 0.15rem;
}

/* Always docked at bottom of right pane — not sticky inside scroll */
.pagination-wrap {
  flex: 0 0 auto;
  padding: 0.55rem 0.75rem;
  border-top: 1px solid var(--secondary-color);
  background: var(--background-color);
  z-index: 5;
}

/* Sidebar panels */
.search {
  margin-bottom: 0.75rem;
}

.search input {
  width: 100%;
}

.hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--secondary-color);
}

.panel {
  border: 1px solid var(--font-color);
  margin-bottom: 0.75rem;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: var(--font-color);
  color: var(--invert-font-color);
  font-weight: 600;
  font-size: 0.85rem;
}

.panel-head-toggle {
  cursor: pointer;
  user-select: none;
}

.panel-head-toggle:hover {
  filter: brightness(1.08);
}

.panel-head-title {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

.panel-chevron {
  display: inline-block;
  width: 0.85em;
  text-align: center;
  font-size: 0.85em;
  opacity: 0.9;
}

.panel-count {
  font-weight: 500;
  opacity: 0.85;
  font-size: 0.8em;
}

.panel-body {
  padding: 0.5rem;
}

.field {
  margin-bottom: 0.65rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field > label {
  display: block;
  font-size: 0.78rem;
  margin-bottom: 0.2rem;
  color: var(--secondary-color);
}

.field select {
  width: 100%;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.chip {
  border: 1px solid var(--secondary-color);
  background: transparent;
  color: var(--font-color);
  padding: 0.15rem 0.4rem;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
}

.chip.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--invert-font-color);
}

.linkish {
  background: none;
  border: none;
  color: var(--invert-font-color);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  padding: 0;
}

.detail-thumb {
  margin-bottom: 0.5rem;
}

.detail-thumb img {
  width: 100%;
  max-height: 160px;
  object-fit: contain;
  display: block;
  background: color-mix(in srgb, var(--secondary-color) 12%, transparent);
}

.detail-dl {
  margin: 0;
  font-size: 0.78rem;
}

.detail-dl dt {
  margin: 0.45rem 0 0.1rem;
  font-weight: 600;
  color: var(--secondary-color);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.detail-dl dd {
  margin: 0;
  line-height: 1.35;
}

.pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

.html-block {
  font-size: 0.78rem;
}

.html-block :deep(ul) {
  margin: 0.25rem 0;
  padding-left: 1.1rem;
}

.rarity-gem {
  width: 20px;
  height: 20px;
  object-fit: contain;
  vertical-align: middle;
}

/* Right media drawer */
.media-drawer {
  flex: 0 0 0;
  width: 0;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  border-left: 0 solid var(--secondary-color);
  background: var(--background-color);
  display: flex;
  flex-direction: column;
  transition: flex-basis 0.2s ease, width 0.2s ease, border-width 0.2s ease;
}

.media-drawer.open {
  flex: 0 0 min(360px, 38vw);
  width: min(360px, 38vw);
  border-left-width: 1px;
}

.media-drawer-head {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid var(--secondary-color);
}

.media-drawer-title {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.85rem;
}

.media-drawer-title strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-close {
  flex: 0 0 auto;
  border: 1px solid var(--secondary-color);
  background: transparent;
  color: var(--primary-color);
  width: 1.75rem;
  height: 1.75rem;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
}

.media-close:hover {
  background: color-mix(in srgb, var(--primary-color) 12%, transparent);
}

.media-drawer-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0.65rem 1rem;
}

.media-group {
  border: 1px solid var(--font-color);
  margin-bottom: 0.55rem;
}

.media-group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: var(--font-color);
  color: var(--invert-font-color);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  user-select: none;
}

.media-group-head:hover {
  filter: brightness(1.08);
}

.media-group-body {
  padding: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.media-card img {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  display: block;
  background: color-mix(in srgb, var(--secondary-color) 12%, transparent);
}

.media-cap {
  margin-top: 0.3rem;
  font-size: 0.75rem;
}

.media-cap strong {
  display: block;
}

.media-cap p {
  margin: 0.2rem 0 0;
  color: var(--secondary-color);
  font-size: 0.72rem;
  line-height: 1.35;
}

.media-video-link {
  display: block;
  padding: 0.5rem;
  border: 1px dashed var(--secondary-color);
  text-align: center;
}

.chroma-swatches {
  display: flex;
  gap: 2px;
  margin-top: 0.25rem;
}

.swatch {
  width: 12px;
  height: 12px;
  border: 1px solid var(--font-color);
}

.muted {
  color: var(--secondary-color);
  font-weight: 400;
}

.empty {
  padding: 2rem 0;
  text-align: center;
  color: var(--secondary-color);
}

.badge {
  display: inline-block;
  margin-left: 0.35rem;
  background: var(--primary-color);
  color: var(--invert-font-color);
  border-radius: 999px;
  padding: 0 0.4rem;
  font-size: 0.75rem;
}

@media only screen and (max-width: 56em) {
  .browser {
    flex-wrap: wrap;
  }

  .browser:not(.sidebar-collapsed) .sidebar {
    flex: 0 0 auto;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 36%;
    border-right: none;
    border-bottom: 1px solid var(--secondary-color);
  }

  .browser.sidebar-collapsed .sidebar {
    flex: 0 0 2rem;
    width: 2rem;
    height: auto;
    max-height: none;
    border-bottom: 1px solid var(--secondary-color);
  }

  .sidebar-scroll {
    max-height: min(36dvh, 18rem);
  }

  .content {
    flex: 1 1 100%;
    min-height: 40%;
  }

  .media-drawer.open {
    flex: 0 0 100%;
    width: 100%;
    height: 40%;
    max-height: 40%;
    border-left: none;
    border-top: 1px solid var(--secondary-color);
  }

  .toolbar-field {
    min-width: 5.5rem;
  }

  .toolbar-field select {
    min-width: 5.5rem;
  }
}

@media only screen and (min-width: 90em) {
  .browser:not(.sidebar-collapsed) .sidebar {
    flex-basis: 340px;
    width: 340px;
  }
}
</style>
