<template>
    <div class="img-tooltip">
        <img
            :src="imgSrc"
            :alt="id"
            :title="id"
            :style="scaleObject"
            @load="$emit('handleImgLoad',1)"
            @mouseover="onHover"
            @mouseout="show = false"
            @mousemove="onMouseMove"
        />
        <div
            class="terminal-card card"
            :style="{ top: `${clientY}px`, left: `${clientX}px`, width: `${divWidth}px` }"
            v-if="show"
        >
            <header>ID: {{ id }}</header>
            <div>
                <p>{{ name }}{{ (description && name) ? '\n' : '' }}{{ description }}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Image Tooltip",
    emits:['handleImgLoad'],
    props: {
        imgSrc: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        divWidth: {
            type: Number,
            default: 200
        },
        popup: {
            type: Boolean,
            default: true
        },
        scale: {
            type: Number,
            default: 1
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
            if (this.popup) {
                this.show = true;
            } else {
                this.show = false;
            }
        },
        onMouseMove(e) {
            const { clientX, clientY } = e;

            if (window.innerWidth - clientX < this.divWidth + 50) {
                this.clientX = clientX - this.divWidth - 20;

            } else {
                this.clientX = clientX + 20;
            }

            this.clientY = clientY;
        },
        getCardContent() {
            if (this.name === "" || typeof (this.name) === "undefined") {
                if (this.description === "" || this.description === " ") {
                    return `Not found`;
                } else {
                    return `${this.description}`;
                }
            } else {
                if (this.description === "" || this.description === " ") {
                    console.log("name: ", this.name, "description: ", this.description);
                    return this.name;
                } else {
                    return this.name + "<br/>" + this.description;
                }
            }
        },
    },
    computed: {
        scaleObject: function () {
            return { '--hover-scale': this.scale };
        }
    }
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

img {
    transition: all 0.2s ease-in-out;
}

img:hover {
    transform: scale(var(--hover-scale));
}

.img-tooltip > img {
    max-width: 100%;
}

@media screen and (max-width: 768px) {
    .card {
        display: none;
    }
}
</style>