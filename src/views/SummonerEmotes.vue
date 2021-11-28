<script>
import Grab from "../scripts/grab.js";
import Pagination from "../components/Pagination.vue";
import Tooltip from "../components/ImageTooltip.vue";
import ImageTooltip from "../components/ImageTooltip.vue";
import VueSlider from 'vue-slider-component'
import '../styles/slider.scss'
var instance = new Grab(`tencent`);

function isContains(str, substr) {
    return new RegExp(substr).test(str);
}

export default {
    name: "SummonerEmotes",
    data() {
        return {
            iconIndex: [],
            output: [],
            pageSize: 42,
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

        var respSI = await instance.getSummonerEmotes();
        var infoSI = respSI.data;
        infoSI.splice(0, 1)
        console.log(infoSI);

        for (var i in infoSI) {
            var a = infoSI[i];
            if (!isContains(a.inventoryIcon, `/lol-game-data/`)) {
                var newkey = {};
                newkey.name = a.name;
                newkey.description = a.description;
                newkey.id = a.id;
                newkey.src = a.inventoryIcon;
                this.iconIndex.push(newkey);
            }
        }

        this.iconIndex.sort(function (a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });

        this.output = this.iconIndex;
        this.preview = this.iconIndex[0];

        respSI = null;
        infoSI = null;

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
        }
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
                <div class="break-word">
                    {{ preview.name }}{{ (preview.description && preview.name) ? '\n' : '' }}{{ preview.description }}
                    <br v-if="(preview.name || preview.description)" >
                    <a
                        class="newtab"
                        :href="preview.src"
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
                        v-for="(item) in output.slice((pageCurr - 1) * pageSize, pageCurr * pageSize)"
                    >
                        <ImageTooltip
                            :img-src="item.src"
                            :id="item.id"
                            :description="item.description"
                            :name="item.name"
                            :scale="2.5"
                            :popup="false"
                            @click="preview = item"
                        />
                    </div>
                </div>
                <Pagination
                    :current="pageCurr"
                    :total="output.length"
                    :per-page="pageSize"
                    @page-changed="pageCurr = $event"
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
}

.slider {
    margin: auto;
    display: block;
    padding: 0px 15px 10px 10px;
}
</style>
