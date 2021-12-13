<script>
import ImgFrame from "../components/ImgFrame.vue";
import Grab from "../scripts/grab.ts";
const grab = new Grab('chinese');

export default {
    data() {
        return {
            name: 'emotes',
            emotes: [{
                id: 0,
                description: "",
                name: "",
                inventoryIcon: "",
            }],
            assetsProps: {
                id: 'id',
                src: 'inventoryIcon',
                description: 'description',
                title: 'name',
            },
        }
    },
    methods: {
        getEmotes() {
            if (this.$store.state[this.name].caches.hasOwnProperty(this.$store.state.settings.language)) {
                this.emotes = this.$store.state[this.name].caches[this.$store.state.settings.language];
                return;
            } else {
                this.$Progress.start();
                grab.get('summoner-emotes', this.$store.state.settings.language).then(res => {
                    this.emotes = res.data;
                    this.emotes.sort((a, b) => { return a.id - b.id });
                    this.emotes = this.emotes.filter(item => {
                        return !item.inventoryIcon.includes("/lol-game-data/");
                    })
                    this.$store.state[this.name].caches[this.$store.state.settings.language] = this.emotes;
                    this.$Progress.finish();
                    return;
                },err=>{
                    this.$Progress.fail();
                    console.log(err);
                    return;
                });
            }
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