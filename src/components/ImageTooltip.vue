<template>
  <div class="img-tooltip" :class="{ 'img-error': error }">
    <img
      v-if="!error"
      :src="imgSrc"
      :alt="name || String(id)"
      :title="name || String(id)"
      :style="scaleObject"
      loading="lazy"
      decoding="async"
      @load="$emit('handleImgLoad')"
      @error="onError"
    />
    <div v-else class="img-fallback" :title="name || String(id)">
      <span aria-hidden="true">⚠</span>
      <span class="img-fallback-label">{{ name || id }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "ImageTooltip",
  emits: ["handleImgLoad"],
  props: {
    imgSrc: {
      type: String,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    scale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      error: false,
    };
  },
  watch: {
    imgSrc() {
      this.error = false;
    },
  },
  methods: {
    onError() {
      this.error = true;
      // Count failed images too, so page load progress can complete
      this.$emit("handleImgLoad");
    },
  },
  computed: {
    scaleObject() {
      return { "--hover-scale": this.scale };
    },
  },
};
</script>
<style scoped>
img {
  transition: transform 0.2s ease-in-out;
}

img:hover {
  transform: scale(var(--hover-scale));
}

.img-tooltip > img {
  max-width: 100%;
}

.img-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  aspect-ratio: 1 / 1;
  width: 100%;
  border: 1px dashed var(--secondary-color);
  color: var(--secondary-color);
  font-size: 0.7rem;
  text-align: center;
  padding: 0.25rem;
  overflow: hidden;
}

.img-fallback-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
