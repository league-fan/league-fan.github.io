<script>
import Grab from "../scripts/grab.js";
import Pagination from "../components/Pagination.vue";
import Tooltip from "../components/ImageTooltip.vue";
import ImageTooltip from "../components/ImageTooltip.vue";

var instance = new Grab(`tencent`);


export default {
    name: "SummonerIcons",
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
            }
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
        }
    },
    components: { Pagination, Tooltip, ImageTooltip }
};
</script>

<template>
    <div class="components components-grid">
        <aside id="menu">
            <h3>Search</h3>
            <div class="search">
                <input
                    type="text"
                    placeholder="Search"
                    v-model="search.keyword"
                    @keyup.enter="filteredInfo"
                />
                <span>Press Enter to search</span>
            </div>

            <div class="terminal-card card">
                <header>ID: {{ preview.id }}</header>
                <div>
                    {{ preview.description }}
                    <br />
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
                <div class="image-grid">
                    <a
                        href="#"
                        @click.prevent
                        v-for="(item) in output.slice((pageCurr - 1) * pageSize, pageCurr * pageSize)"
                    >
                        <ImageTooltip
                            :img-src="getSummonerIcon(item.id)"
                            :item="item"
                            @click="preview = item"
                        />
                    </a>
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
        minmax(calc(var(--page-width) / 12), 1fr)
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
</style>
