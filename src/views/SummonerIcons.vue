<script>
import ImgFrame from "../components/ImgFrame.vue";
import Grab from "../scripts/grab.ts";
const grab = new Grab("chinese");

export default {
  data() {
    return {
      name: "icons",
      icons: [
        {
          id: 0,
          description: "",
          title: "",
          imagePath: "",
        },
      ],
      assetsProps: {
        id: "id",
        src: "imagePath",
        description: "description",
        title: "title",
      },
    };
  },
  methods: {
    getIcons() {
      const lang = this.$store.state.settings.language;
      if (Object.prototype.hasOwnProperty.call(this.$store.state[this.name].caches, lang)) {
        this.icons = this.$store.state[this.name].caches[lang];
        return;
      }
      this.$Progress.start();
      grab
        .get("summoner-icons", lang)
        .then(
          (res) => {
            // Lib already flattens description + absolute imagePath + sort
            this.icons = res.data.filter((item) => item.imagePath);
            this.$store.state[this.name].caches[lang] = this.icons;
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
    this.getIcons();
  },
  components: { ImgFrame },
};
</script>

<template>
  <img-frame
    :name="name"
    :assets-list="icons"
    :assets-props="assetsProps"
    @on-lang-change="getIcons()"
  />
</template>
