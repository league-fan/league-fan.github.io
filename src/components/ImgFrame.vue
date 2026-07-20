<script>
import Pagination from "../components/Pagination.vue";
import ImageTooltip from "../components/ImageTooltip.vue";
import VueSlider from "vue-slider-component";
import "../styles/slider.scss";

export default {
  name: "ImgFrame",
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
  },
  watch: {
    assetsList(list) {
      if (Array.isArray(list) && list.length) {
        this.updateOutPut();
      }
    },
  },
  data() {
    return {
      output: [],
      pageSize: 42,
      pageCurr: 1,
      pageLoaded: 0,
      pageItemNum: 0,
      search: {
        keyword: "",
      },
      slider: {
        data: [
          { id: 2, name: "2" },
          { id: 3, name: "3" },
          { id: 4, name: "4" },
          { id: 5, name: "5" },
          { id: 6, name: "6" },
          { id: 1, name: "Auto" },
        ],
        mod: "repeat(auto-fit,minmax(calc(var(--page-width) / 12), 0.5fr))",
      },
      preview: {},
    };
  },
  mounted() {
    this.output = this.assetsList || [];
    if (window.innerWidth < 768) {
      this.pageSize = 24;
    }
    this.onImgColumeChange(this.$store.state.slider.val, 0);
  },
  methods: {
    filteredInfo() {
      this.pageCurr = 1;
      const kw = (this.search.keyword || "").trim().toLowerCase();
      if (!kw || kw === "search") {
        this.output = this.assetsList;
      } else {
        const titleKey = this.assetsProps.title;
        this.output = this.assetsList.filter((item) => {
          const title = String(item[titleKey] ?? "").toLowerCase();
          const id = String(item[this.assetsProps.id] ?? item.id ?? "");
          return title.includes(kw) || id.includes(kw);
        });
      }
      this.syncPreview();
    },
    onImgColumeChange(value) {
      switch (value) {
        case 1:
          this.slider.mod =
            "repeat(auto-fit,minmax(calc(var(--page-width) / 12), 0.3fr))";
          break;
        default:
          this.slider.mod = "repeat(" + value + ", 0.5fr)";
          break;
      }
    },
    updatePreview(item) {
      const id = item[this.assetsProps.id] ?? item.id;
      if (this.$store.state[this.name]) {
        this.$store.state[this.name].previewIndex = id;
      }
      this.preview = item;
    },
    syncPreview() {
      const gallery = this.$store.state[this.name];
      if (!gallery) {
        this.preview = this.output[0] || {};
        return;
      }
      const found = this.output.find(
        (item) => (item[this.assetsProps.id] ?? item.id) === gallery.previewIndex,
      );
      this.preview = found || this.output[0] || {};
      if (this.preview && gallery.previewIndex === 0 && this.preview[this.assetsProps.id] != null) {
        gallery.previewIndex = this.preview[this.assetsProps.id];
      }
    },
    updateOutPut() {
      this.output = this.assetsList || [];
      this.syncPreview();
    },
    onPageChange(val) {
      this.pageCurr = val;
      const page = this.pageCurr - 1;
      this.$Progress.set(0);
      this.pageItemNum =
        this.output.length - page * this.pageSize > this.pageSize
          ? this.pageSize
          : Math.max(0, this.output.length - page * this.pageSize);
      this.pageLoaded = 0;
    },
    onLangChange() {
      this.$emit("onLangChange");
    },
    handleImgLoad() {
      this.pageLoaded++;
      if (this.pageItemNum > 0) {
        this.$Progress.increase((1 / this.pageItemNum) * 101);
      }
      if (this.pageLoaded === this.pageItemNum) {
        this.$Progress.finish();
      }
    },
  },
  components: { Pagination, ImageTooltip, VueSlider },
};
</script>

<template>
  <div class="components components-grid">
    <aside id="menu">
      <div class="search">
        <input
          type="text"
          placeholder="Search by name or id"
          v-model="search.keyword"
          @keyup.enter="filteredInfo"
        />
        <span>Press Enter to search · {{ output.length }} items</span>
      </div>
      <button
        class="collapsible btn btn-default btn-ghost"
        @click="$store.commit('toggleSettings')"
      >
        Settings
      </button>
      <div class="settings" :style="{ display: $store.state.settings.display }">
        <div class="language">
          <label for="select">Language:</label>
          <select v-model="$store.state.settings.language" @change="onLangChange">
            <option value="chinese">Chinese</option>
            <option value="english">English</option>
          </select>
        </div>
        <label>Col Items:</label>
        <div class="slider">
          <vue-slider
            v-model="$store.state.settings.sliderVal"
            :vData="slider.data"
            :data-value="'id'"
            :data-label="'name'"
            :tooltip="'none'"
            @change="onImgColumeChange"
          ></vue-slider>
        </div>
      </div>

      <div class="terminal-card card">
        <header>ID: {{ preview[assetsProps.id] }}</header>
        <div class="break-word">
          {{ preview[assetsProps.title] }}
          <br
            v-if="preview[assetsProps.description] && preview[assetsProps.title]"
          />
          {{ preview[assetsProps.description] }}
          <br
            v-if="preview[assetsProps.title] || preview[assetsProps.description]"
          />
          <a
            v-if="preview[assetsProps.src]"
            class="newtab"
            :href="preview[assetsProps.src]"
            target="_blank"
            rel="noopener"
            >Open in new tab</a
          >
        </div>
      </div>
    </aside>
    <div>
      <section>
        <div class="image-grid" :style="{ 'grid-template-columns': slider.mod }">
          <div
            v-for="item in output.slice(
              (pageCurr - 1) * pageSize,
              pageCurr * pageSize,
            )"
            :key="item[assetsProps.id] ?? item.id"
            @click.prevent
          >
            <ImageTooltip
              :img-src="item[assetsProps.src]"
              :id="item[assetsProps.id]"
              :description="item[assetsProps.description]"
              :name="item[assetsProps.title]"
              :scale="scale"
              :popup="false"
              @handle-img-load="handleImgLoad"
              @click="updatePreview(item)"
            />
          </div>
        </div>
        <Pagination
          :current="pageCurr"
          :total="output.length"
          :per-page="pageSize"
          @page-changed="onPageChange"
          text-before-input
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-rows: auto;
  grid-template-columns: repeat(
    auto-fit,
    minmax(calc(var(--page-width) / 12), 0.5fr)
  );
}

.components-grid {
  display: grid;
  grid-column-gap: 1.4em;
  grid-template-columns: auto;
  grid-template-rows: auto;
}

.search {
  margin-bottom: var(--global-line-height);
}

.search > span {
  font-size: calc(var(--global-font-size) * 0.75);
}

.break-word {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

@media only screen and (min-width: 70em) {
  .components-grid {
    grid-template-columns: 3fr 9fr;
  }
}

.newtab {
  display: inline-block;
  margin-top: 8px;
  margin-bottom: 8px;
}

.card {
  margin-bottom: 2em;
  margin-top: 1em;
}

.slider {
  margin-top: 20px;
  display: block;
  padding: 0px 15px 10px 10px;
}

.collapsible {
  width: 100%;
}

.settings {
  border-color: var(--font-color);
  border-style: solid;
  border-width: 1px;
  border-top-width: 0px;
  padding: 8px;
}

.language {
  margin-bottom: 8px;
}
</style>
