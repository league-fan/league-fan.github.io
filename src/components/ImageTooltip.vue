<template>
    <div class="img-tooltip">
        <img
            :src="imgSrc"
            :alt="item.id"
            @mouseover="onHover"
            @mouseout="show = false"
            @mousemove="onMouseMove"
        />
        <div
            class="terminal-card card"
            :style="{ top: `${clientY}px`, left: `${clientX}px`, width: `${divWidth}px` }"
            v-if="show"
        >
            <header>ID: {{ item.id }}</header>
            <div>{{ item.description }}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Image Tooltip",
    props: {
        imgSrc: {
            type: String,
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        divWidth: {
            type: Number,
            default: 200
        }
    },
    data() {
        return {
            show: false,
            clientX: 0,
            clientY: 0,
        };
    },
    methods: {
        onHover() {
            this.show = true;
        },
        onMouseMove(e) {
            const { clientX, clientY } = e;

            if (window.innerWidth - clientX < this.divWidth + 50) {
                this.clientX = clientX - this.divWidth -20;

            } else {
                this.clientX = clientX + 20;
            }

            this.clientY = clientY;
        },
    },
};
</script>
<style scoped>
.card {
    position: absolute;
    z-index: 20;
}

.card > div {
    background-color: aliceblue;
    color: black;
}

@media screen and (max-width: 768px) {
    .card {
        display: none;
    }
}
</style>