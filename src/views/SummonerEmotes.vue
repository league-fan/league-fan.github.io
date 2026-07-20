<script>
import ImgFrame from "../components/ImgFrame.vue";
import Grab from "../scripts/grab.ts";
const grab = new Grab("chinese");

export default {
  data() {
    return {
      name: "emotes",
      emotes: [
        {
          id: 0,
          description: "",
          name: "",
          inventoryIcon: "",
        },
      ],
      assetsProps: {
        id: "id",
        src: "inventoryIcon",
        description: "description",
        title: "name",
      },
    };
  },
  methods: {
    getEmotes() {
      const lang = this.$store.state.settings.language;
      if (Object.prototype.hasOwnProperty.call(this.$store.state[this.name].caches, lang)) {
        this.emotes = this.$store.state[this.name].caches[lang];
        return;
      }
      this.$Progress.start();
      grab
        .get("summoner-emotes", lang)
        .then(
          (res) => {
            this.emotes = res.data
              .filter((item) => item.inventoryIcon && !item.inventoryIcon.includes("/lol-game-data/"))
              .sort((a, b) => b.id - a.id);
            this.$store.state[this.name].caches[lang] = this.emotes;
            this.$Progress.finish();
          },
          (err) => {
            this.$Progress.fail();
            console.log(err);
          },
        );
    },
  },
  mounted() {
    this.getEmotes();
  },
  components: { ImgFrame },
};
</script>

<template>
  <img-frame
    :name="name"
    :assets-list="emotes"
    :assets-props="assetsProps"
    @on-lang-change="getEmotes()"
  />
</template>
