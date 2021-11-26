<script>
import Grab from "../scripts/grab.js";
import Pagination from "../components/Pagination.vue";
import * as JsSearch from 'js-search';
import Tooltip from "../components/ImageTooltip.vue";
import ImageTooltip from "../components/ImageTooltip.vue";

var instance = new Grab(`tencent`);
var search = new JsSearch.Search('summonericon');


export default {
    name: "Home",
    data() {
        return {
            info: {},
            iconIndex: [],
            output: [],
            pageSize: 42,
            pageCurr: 10,
            search: {
                keyword: "",
                type: "",
                page: 1
            },

        };
    },
    async mounted() {
        await instance.init(); // 初始化，获取版本和语言信息

        var respSI = await instance.getSummonerIcons();
        var infoSI = respSI.data.data;
        var respSID = await instance.getSummonerIconDescriptions();
        var infoSID = respSID.data;
        for (var key in infoSI) {
            var thekey = "summoner_icon_name_" + key
            var newkey = infoSI[key];
            if (infoSID.hasOwnProperty(thekey)) {
                newkey.description = infoSID[thekey];
            } else {
                newkey.description = "Not Found";
            }
            this.iconIndex.push(newkey);
        }
        this.iconIndex.sort(function (a, b) {
            return parseInt(a.id) - parseInt(b.id);
        });

        search.addIndex('id');
        search.addIndex(['description']);
        console.log(this.iconIndex);
        search.addDocuments(this.iconIndex);

        respSI = null;
        infoSI = null;
        respSID = null;
        infoSID = null;
    },
    methods: {
        getSummonerIcon(id) {
            return instance.getSummonerIcon(id);
        },
        pageChange(page) {
            this.pageCurr = page;
        },
        searchKeyword() {
            console.log(search.search(this.search.keyword));
        },

    },
    components: { Pagination, Tooltip, ImageTooltip }
};
</script>

<template>
    <div class="components components-grid">
        <aside id="menu">
            <h2>Search</h2>
            <div class="search">
                <input
                    type="text"
                    placeholder="Search"
                    v-model="search.keyword"
                    @keyup.enter="searchKeyword"
                />
            </div>

            <h2>Documentation</h2>
            <nav>
                <ul>
                    <li>
                        <a href="#DocVariables">Variables</a>
                    </li>
                    <li>
                        <a href="#DocTypography">Typography</a>
                    </li>
                </ul>
            </nav>
        </aside>
        <main>
            <section>
                <header></header>
                <div class="image-grid">
                    <a
                        href="#"
                        style="border: none;"
                        v-for="(item) in iconIndex.slice((pageCurr - 1) * pageSize, pageCurr * pageSize)"
                    >
                        <ImageTooltip
                            :img-src="getSummonerIcon(item.id)"
                            :item="item" />
                    </a>
                </div>
                <Pagination
                    :current="pageCurr"
                    :total="iconIndex.length"
                    :per-page="pageSize"
                    @page-changed="pageChange"
                    text-before-input
                />
            </section>
        </main>
    </div>
</template>

<style scoped>
.image-grid {
    display: grid;
    grid-template-rows: auto;
    display: grid;
    grid-gap: 1em;
    grid-template-rows: auto;
    grid-template-columns: repeat(
        auto-fit,
        minmax(calc(var(--page-width) / 10), 1fr)
    );
}

.components-grid {
    display: grid;
    grid-column-gap: 1.4em;
    grid-template-columns: auto;
    grid-template-rows: auto;
}

@media only screen and (min-width: 70em) {
    .components-grid {
        grid-template-columns: 3fr 9fr;
    }
}

img {
    width: 100%;
    height: auto;
}
</style>
