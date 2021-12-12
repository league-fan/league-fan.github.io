<script>
import ImgFrame from "../components/ImgFrame.vue";
import Grab from "../scripts/grab.ts";
const grab = new Grab('chinese');

export default {
    data() {
        return {
            emotes: [{
                id: 0,
                description: "",
                name: "",
                inventoryIcon: "",
            }],
            keyval: 0,
        }
    },
    methods: {
        getEmotes() {
            grab.get('summoner-icons', this.$store.state.settings.language).then(res => {
                this.emotes = res.data;
                let newlist = []
                for (const item of this.emotes) {
                    Object.keys(item).forEach(key => {
                        if (key === "title") {
                            var newkey = "name";
                            item[newkey] = item[key];
                            delete item[key];
                        }
                        if (key === "imagePath") {
                            var newkey = "inventoryIcon";
                            item[newkey] = item[key];
                            delete item[key];
                        }
                        if (key === "descriptions") {
                            var newkey = "description";
                            item[newkey] = item[key];
                            delete item[key];
                        }
                        if (item.hasOwnProperty('description') && item.description !== undefined && item.description.length > 0) {
                            item.description = item.description[0].description;
                        }else{
                            item.description = "";
                        }
                    })
                    newlist.push(item);
                }
                newlist.sort((a, b) => { return a.id - b.id });
                this.emotes = newlist.filter(item => {
                    return item.inventoryIcon!==undefined;
                })
                console.log(this.$store.state.settings.language);
                this.keyval += 1;
            });
        },
    },
    mounted() {
        this.getEmotes();
    },
    components: { ImgFrame }
}

</script>

<template>
    <img-frame :assets-list="emotes" :key="keyval" @on-lang-change="getEmotes()" />
</template>