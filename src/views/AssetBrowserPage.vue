<script>
import ImgFrame from "../components/ImgFrame.vue";
import { loadCategoryList, CATEGORY_PROPS } from "../services/assets.js";

/**
 * Generic gallery page driven by route.meta:
 * - storeKey: vuex key (icons | emotes | wards | …)
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
      const lang = this.$store.state.settings.language;
      const key = this.storeKey;
      const cat = this.category;
      if (!key || !cat) return;

      const cache = this.$store.state[key]?.caches?.[lang];
      if (cache) {
        this.items = cache;
        return;
      }

      this.$Progress.start();
      try {
        const list = await loadCategoryList(cat, lang);
        this.items = list;
        this.$store.commit("setGalleryCache", {
          storeKey: key,
          lang,
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
  <img-frame
    v-if="storeKey"
    :name="storeKey"
    :assets-list="items"
    :assets-props="assetsProps"
    :scale="scale"
    @on-lang-change="load()"
  />
</template>
