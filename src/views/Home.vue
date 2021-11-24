<script>
import Grab from "../scripts/grab.js";
var instance = new Grab(`tencent`);

function spliceDict(dict, minKey, maxKey) {
  var newDict = {};
  for(var i in dict) {
    if(i >= minKey && i <= maxKey) {
      newDict[i] = dict[i];
    }
  }
  return newDict;
}

export default {
    name: "Home",
    data() {
        return {
            info: {},
        };
    },
    async mounted() {
        await instance.init();
        let response = await instance.getSummonerIcons();
        console.log(response);
        this.info = response.data.data;
    },
    methods: {
        getSummonerIcon(id) {
            return instance.getSummonerIcon(id);
        },
        getInfoSlice(length) {
            console.log(this.info.length);
            return spliceDict(this.info,0,length)
        }
    },
};
</script>

<template>
    <div class="components components-grid">
        <aside id="menu">
            <h2>Components</h2>
            <nav>
                <ul>
                    <li>
                        <a href="#GridSystem">Grid System</a>
                    </li>
                    <li>
                        <a href="#Navigation">Navigation</a>
                    </li>
                    <li>
                        <a href="#NavigationList">Navigation List</a>
                    </li>
                    <li>
                        <a href="#Lists">Lists</a>
                    </li>
                    <li>
                        <a href="#Typography">Typography</a>
                    </li>
                    <li>
                        <a href="#Tables">Tables</a>
                    </li>
                    <li>
                        <a href="#SpecialElements">Special Elements</a>
                        <ul>
                            <li>
                                <a href="#Blockquote">Blockquote</a>
                            </li>
                            <li>
                                <a href="#Misc">Misc</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#Forms">Forms</a>
                    </li>
                    <li>
                        <a href="#Progress">Progress Bar</a>
                    </li>
                    <li>
                        <a href="#Buttons">Buttons</a>
                    </li>
                    <li>
                        <a href="#Cards">Cards</a>
                    </li>
                    <li>
                        <a href="#Timeline">Timeline</a>
                    </li>
                    <li>
                        <a href="#Alerts">Alerts</a>
                    </li>
                    <li>
                        <a href="#Media">Media</a>
                    </li>
                    <li>
                        <a href="#Figure">Image with caption</a>
                    </li>
                    <li>
                        <a href="#highlightjs">Supports Highlight.js</a>
                    </li>
                </ul>
            </nav>

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
                    <a href="#" style="border: none;" v-for="(item) in getInfoSlice(40)">
                        <img
                            :src="getSummonerIcon(item.id)"
                            :width="item.image.w"
                            :height="item.image.w"
                            alt="random image"
                        />
                    </a>
                </div>
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
        minmax(calc(var(--page-width) / 12), 1fr)
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
