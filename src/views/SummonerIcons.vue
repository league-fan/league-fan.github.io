<script>
import ImgFrame from "../components/ImgFrame.vue";
import Grab from "../scripts/grab.ts";
const grab = new Grab('chinese');

export default {
    data() {
        return {
            name: 'icons',
            emotes: [{
                id: 0,
                description: "",
                title: "",
                imagePath: "",
            }],
            assetsProps: {
                id: 'id',
                src: 'imagePath',
                description: 'description',
                title: 'title',
            },
        }
    },
    methods: {
        getEmotes() {
            grab.get('summoner-icons', this.$store.state.settings.language).then(res => {
                this.emotes = res.data;
                let newlist = []
                for (const item of this.emotes) {
                    if (item.hasOwnProperty('descriptions') && item.description !== undefined && item.description.length > 0) {
                        item.description = item.description[0].description;
                    } else {
                        item.description = "";
                    }
                    delete item.descriptions;
                    newlist.push(item);
                }
                newlist.sort((a, b) => { return a.id - b.id });
                this.emotes = newlist.filter(item => {
                    return item[this.assetsProps.src] !== undefined;
                })
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
    <img-frame
        :name="name"
        :assets-list="emotes"
        :assets-props="assetsProps"
        @on-lang-change="getEmotes()"
    />
</template>