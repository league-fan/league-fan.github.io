<script>
import { mapStores } from "pinia";
import ImgFrame from "../components/ImgFrame.vue";
import { loadCategoryList, CATEGORY_PROPS } from "../services/assets.js";
import { useMainStore } from "../store.js";

/**
 * Generic gallery page driven by route.meta:
 * - storeKey: store key (icons | emotes | wards | …)
 * - category: assets lib category id
 * - scale?: number
 */
export default {
  name: "AssetBrowserPage",
  components: { ImgFrame },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapStores(useMainStore),
    storeKey() {
      return this.$route.meta.storeKey;
    },
    category() {
      return this.$route.meta.category;
    },
    assetsProps() {
      return (
        CATEGORY_PROPS[this.category] || {
          id: "id",
          src: "imagePath",
          title: "name",
          description: "description",
        }
      );
    },
    scale() {
      return this.$route.meta.scale ?? 1.5;
    },
  },
  watch: {
    "$route.meta.category"() {
      this.items = [];
      this.load();
    },
  },
  methods: {
    async load() {
      const { language: lang, imageCdn } = this.mainStore.settings;
      const key = this.storeKey;
      const cat = this.category;
      if (!key || !cat) return;

      // Image CDN choice is baked into item URLs, so it is part of the key
      const cacheKey = `${lang}|${imageCdn}`;
      const cache = this.mainStore[key]?.caches?.[cacheKey];
      if (cache) {
        this.items = cache;
        return;
      }

      this.$Progress.start();
      try {
        const list = await loadCategoryList(cat, lang, { imageCdn });
        this.items = list;
        this.mainStore.setGalleryCache({
          storeKey: key,
          cacheKey,
          data: list,
        });
        this.$Progress.finish();
      } catch (err) {
        console.error(`[AssetBrowser] load ${cat} failed`, err);
        this.$Progress.fail();
      }
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<template>
  <div class="asset-browser-page">
    <img-frame
      v-if="storeKey"
      :name="storeKey"
      :category="category"
      :assets-list="items"
      :assets-props="assetsProps"
      :scale="scale"
      @on-lang-change="load()"
    />
  </div>
</template>

<style scoped>
.asset-browser-page {
  /* Fill app-main between sticky header/footer; no outer page scroll */
  height: 100%;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.asset-browser-page > * {
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
}
</style>
