<script>
import Pagination from "../components/Pagination.vue";
import Tooltip from "../components/ImageTooltip.vue";
import ImageTooltip from "../components/ImageTooltip.vue";
import VueSlider from 'vue-slider-component'
import '../styles/slider.scss'

export default {
    name: "Img Frame",
    props: {
        name: {
            type: String,
            required: true
        },
        assetsList: {
            type: Object,
            required: true
        },
        assetsProps: {
            id: String,
            src: String,
            description: String,
            title: String,
        },
        scale: {
            type: Number,
            default: 1.5
        },
    },
    watch: {
        assetsList(a, b) {
            if (a.length > 1) {
                this.updateOutPut()
            }
        }
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
            setting: {
                display: "none",
            },
            slider: {
                data: [
                    { id: 2, name: "2" },
                    { id: 3, name: "3" },
                    { id: 4, name: "4" },
                    { id: 5, name: "5" },
                    { id: 6, name: "6" },
                    { id: 1, name: "Auto" }
                ],
                mod: "repeat(auto-fit,minmax(calc(var(--page-width) / 12), 0.5fr))",
            },
            preview: {},
        };
    },
    mounted() {
        this.output = this.assetsList;

        if (window.innerWidth < 768) {
            this.pageSize = 24;
        }
        this.onSliderChange(this.$store.state.slider.val, 0)
    },
    methods: {
        filteredInfo() {
            this.pageCurr = 1;
            console.log("Search: ", this.search.keyword);
            if (this.search.keyword === "" || this.search.keyword === "Search") {
                this.output = this.assetsList;
            } else {
                this.output = this.assetsList.filter(item => {                   
                    return item[this.assetsProps.title].toLowerCase().includes(this.search.keyword.toLowerCase()) ||
                        String(item.id).includes(this.search.keyword.toLowerCase());
                })
            }
        },
        onSliderChange(value, index) {
            // console.log(value, index);
            switch (value) {
                case 1:
                    this.slider.mod = "repeat(auto-fit,minmax(calc(var(--page-width) / 12), 0.3fr))";
                    break;

                default:
                    this.slider.mod = "repeat(" + value + ", 0.5fr)";
                    break;
            }
        },
        updatePreview(item, index) {
            this.$store.state[this.name].previewIndex = item.id;
            this.preview = this.output.filter(item => {
                return item.id === this.$store.state[this.name].previewIndex;
            })[0];
        },
        updateOutPut() {
            this.output = this.assetsList;
            // console.log(this.$store.state[this.name].previewIndex);
            // console.log(this.output);
            this.preview = this.output.filter(item => {
                return item.id === this.$store.state[this.name].previewIndex;
            })[0];
        },
        onPageChange(val) {
            this.$Progress.set(0);
            this.pageItemNum = this.output.slice((this.pageCurr - 1) * this.pageSize, this.pageCurr * this.pageSize).length;
            this.pageLoaded = 0;
            this.pageCurr = val;
        },
        onLangChange(){
            this.$emit('onLangChange')
        },
        handleImgLoad(load) {
            this.pageLoaded++;
            this.$Progress.increase((1 / this.pageItemNum) * 101);
            if (this.pageLoaded === this.pageItemNum) {
                this.$Progress.finish();
            }
        },
    },
    components: { Pagination, Tooltip, ImageTooltip, VueSlider }
};
</script>

<template>
    <div class="components components-grid">
        <aside id="menu">
            <div class="search">
                <input
                    type="text"
                    placeholder="Search"
                    v-model="search.keyword"
                    @keyup.enter="filteredInfo"
                />
                <span>Press Enter to search</span>
            </div>
            <button
                class="collapsible btn btn-default btn-ghost"
                @click="this.$store.commit('toggleSettings')"
            >Settings</button>
            <div class="settings" :style="{ 'display': this.$store.state.settings.display }">
                <div class="language">
                    <label for="select">Language:</label>
                    <select
                        v-model="this.$store.state.settings.language"
                        @change="onLangChange"
                    >
                        <option :value="'chinese'">Chinese</option>
                        <option :value="'english'">English</option>
                    </select>
                </div>
                <label>Col Items:</label>
                <div class="slider">
                    <vue-slider
                        v-model="this.$store.state.settings.sliderVal"
                        :vData="slider.data"
                        :data-value="'id'"
                        :data-label="'name'"
                        :tooltip="'none'"
                        @change="onSliderChange"
                    ></vue-slider>
                </div>
            </div>

            <div class="terminal-card card">
                <header>ID: {{ preview[assetsProps.id] }}</header>
                <div class="break-word">
                    {{ preview[assetsProps.title] }}{{ (preview[assetsProps.description] && preview[assetsProps.title]) ? '\n' : '' }}{{ preview[assetsProps.description] }}
                    <br v-if="(preview[assetsProps.title] || preview[assetsProps.description])" />
                    <a
                        class="newtab"
                        :href="preview[assetsProps.src]"
                        target="_blank"
                    >Open in new tab</a>
                </div>
            </div>
        </aside>
        <div>
            <section>
                <header></header>
                <div class="image-grid" :style="{ 'grid-template-columns': slider.mod }">
                    <div
                        @click.prevent
                        v-for="(item,index) in output.slice((pageCurr - 1) * pageSize, pageCurr * pageSize)"
                    >
                        <ImageTooltip
                            :img-src="item[assetsProps.src]"
                            :id="item[assetsProps.id]"
                            :description="item[assetsProps.description]"
                            :name="item[assetsProps.title]"
                            :scale="scale"
                            :popup="false"
                            @handle-img-load="handleImgLoad"
                            @click="updatePreview(item, index)"
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

.image-grid > a {
    border: none;
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

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
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
