<script>
import Grab from "../scripts/grab.js";
import Pagination from "../components/Pagination.vue";
import Tooltip from "../components/ImageTooltip.vue";
import ImageTooltip from "../components/ImageTooltip.vue";
import VueSlider from 'vue-slider-component'
import '../styles/slider.scss'
import axios from "axios";
var instance = new Grab(`tencent`);


export default {
    name: "SummonerIcons",
    data() {
        return {
            iconIndex: [],
            output: [],
            pageSize: 42,
            pageLoaded: 0,
            pageItemNum: 0,
            pageCurr: 1,
            search: {
                keyword: "",
            },
            preview: {
                id: "",
                description: "",
            },
            slider: {
                val: 1,
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
        };
    },
    async mounted() {
        await instance.init(); // 初始化，获取版本和语言信息

        var respSI = await instance.getSummonerIcons();
        var infoSI = respSI.data.data;
        var respSID = await instance.getSummonerIconDescriptionsTencent();
        var infoSID = respSID.data.cuportrait;

        for (var key in infoSI) {
            var newkey = infoSI[key];
            if (parseInt(key) <= 28) {
                newkey.description = "Not Found";
            } else {

                if (parseInt(key) < 79 && parseInt(key) > 49) {
                    key = key - 50;
                }
                if (infoSID.hasOwnProperty(key)) {
                    if (infoSID[key].name === " ")
                        newkey.description = "Not Found";
                    else
                        newkey.description = infoSID[key].name;
                } else {
                    newkey.description = "Not Found";
                }
            }
            this.iconIndex.push(newkey);
        }
        this.iconIndex.sort(function (a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });

        this.output = this.iconIndex;
        this.preview = this.iconIndex[0];

        respSI = null;
        infoSI = null;
        respSID = null;
        infoSID = null;

        if (window.innerWidth < 768) {
            this.pageSize = 24;
        }
    },
    methods: {
        getSummonerIcon(id) {
            return instance.getSummonerIconHttp(id);
        },
        filteredInfo() {
            this.pageCurr = 1;
            console.log("Search: ", this.search.keyword);
            if (this.search.keyword === "" || this.search.keyword === "Search") {
                this.output = this.iconIndex;
            } else {
                this.output = this.iconIndex.filter(item => {
                    return item.description.toLowerCase().includes(this.search.keyword.toLowerCase()) ||
                        String(item.id).includes(this.search.keyword.toLowerCase());
                })
            }
        },
        onSliderChange(value, index) {
            console.log(value, index);
            switch (value) {
                case 1:
                    this.slider.mod = "repeat(auto-fit,minmax(calc(var(--page-width) / 12), 0.5fr))";
                    break;

                default:
                    this.slider.mod = "repeat(" + value + ", 0.5fr)";
                    break;
            }
        },
        onPageChange(val) {
            this.$Progress.set(0);
            this.pageItemNum = this.output.slice((this.pageCurr - 1) * this.pageSize, this.pageCurr * this.pageSize).length;
            this.pageLoaded = 0;
            this.pageCurr = val;
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
            <div class="slider">
                <vue-slider
                    v-model="slider.val"
                    :vData="slider.data"
                    :data-value="'id'"
                    :data-label="'name'"
                    :tooltip="'none'"
                    @change="onSliderChange"
                ></vue-slider>
            </div>

            <div class="terminal-card card">
                <header>ID: {{ preview.id }}</header>
                <div>
                    {{ preview.name }}{{ (preview.description && preview.name) ? '\n' : '' }}{{ preview.description }}
                    <br v-if="(preview.name || preview.description)" />
                    <a
                        class="newtab"
                        :href="getSummonerIcon(preview.id)"
                        target="_blank"
                    >Open in new tab</a>
                </div>
            </div>
        </aside>
        <div>
            <section>
                <header></header>
                <div class="image-grid" :style="{ 'grid-template-columns': slider.mod }">
                    <a
                        href="#"
                        @click.prevent
                        v-for="(item) in output.slice((pageCurr - 1) * pageSize, pageCurr * pageSize)"
                    >
                        <ImageTooltip
                            :img-src="getSummonerIcon(item.id)"
                            :id="parseInt(item.id)"
                            :description="item.description"
                            :scale="1.5"
                            @handle-img-load="handleImgLoad"
                            @click="preview = item"
                        />
                    </a>
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
}

.slider {
    margin: auto;
    display: block;
    padding: 0px 15px 10px 10px;
}
</style>
