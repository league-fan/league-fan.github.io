<!-- Modified from https://github.com/OCRVblockchain/vue-tailwind-pagination -->

<template>
    <div class="min-w-max">
        <section class="flex justify-between">
            <ul class="flex items-center">
                <li class="pr-6" v-if="hasPrev()">
                    <a href="#" @click.prevent="changePage(prevPage)">
                        <div class="flex items-center justify-center h-6 w-6">
                            <div class="svg-center">
                                <svg
                                    class="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </a>
                </li>
                <li class="pr-6" v-if="hasFirst()">
                    <a href="#" @click.prevent="changePage(1)">
                        <div class="flex h-6 w-6 items-center justify-center p-2">
                            <span class>1</span>
                        </div>
                    </a>
                </li>
                <li class="pr-6" v-if="hasFirst()">...</li>
                <li class="pr-6" v-for="page in pages">
                    <a href="#" @click.prevent="changePage(page)">
                        <div
                            class="flex h-6 w-6 items-center justify-center p-2"
                            :class="{ 'bg-change': current == page }"
                        >
                            <span class>{{ page }}</span>
                        </div>
                    </a>
                </li>
                <li class="pr-6" v-if="hasLast()">...</li>
                <li class="pr-6" v-if="hasLast()">
                    <a href="#" @click.prevent="changePage(totalPages)">
                        <div class="flex h-6 w-6 items-center justify-center p-2">
                            <span class>{{ totalPages }}</span>
                        </div>
                    </a>
                </li>
                <li class="pr-6" v-if="hasNext()">
                    <a href="#" @click.prevent="changePage(nextPage)">
                        <div class="flex items-center justify-center h-6 w-6 p-2">
                            <div class="svg-center">
                                <svg
                                    class="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>

            <div class="flex items-center">
                <div class="pr-2 font-medium">
                    <span id="text-before-input">{{ textBeforeInput }}</span>
                </div>
                <div class="w-14 px-1 py-1">
                    <input v-model.number="input" type="text" />
                </div>
                <div
                    @click.prevent="changePage(input)"
                    class="flex items-center pl-4 font-medium cursor-pointer"
                >
                    <span id="text-after-input">{{ textAfterInput }}</span>
                    <svg
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Vue Tailwind Pagination',
    props: {
        current: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        },
        perPage: {
            type: Number,
            default: 9
        },
        pageRange: {
            type: Number,
            default: 2
        },
        textBeforeInput: {
            type: String,
            default: 'Go to page'
        },
        textAfterInput: {
            type: String,
            default: 'Go'
        }
    },
    data() {
        return {
            input: '',
        }
    },
    methods: {
        hasFirst: function () {
            return this.rangeStart !== 1
        },
        hasLast: function () {
            return this.rangeEnd < this.totalPages
        },
        hasPrev: function () {
            return this.current > 1
        },
        hasNext: function () {
            return this.current < this.totalPages
        },
        changePage: function (page) {
            if (page > 0 && page <= this.totalPages) {
                this.$emit('page-changed', page)
            }
        }
    },
    computed: {
        pages: function () {
            var pages = []
            for (var i = this.rangeStart; i <= this.rangeEnd; i++) {
                pages.push(i)
            }
            return pages
        },
        rangeStart: function () {
            var start = this.current - this.pageRange
            return (start > 0) ? start : 1
        },
        rangeEnd: function () {
            var end = this.current + this.pageRange
            return (end < this.totalPages) ? end : this.totalPages
        },
        totalPages: function () {
            return Math.ceil(this.total / this.perPage)
        },
        nextPage: function () {
            return this.current + 1
        },
        prevPage: function () {
            return this.current - 1
        }
    }
})
</script>

<style lang="scss" scoped>
input {
    :focus {
        outline: none;
    }
}

.min-w-max {
    min-width: max-content;
}

.flex {
    display: flex;
}

.justify-center {
    justify-content: center;
}

.justify-between {
    justify-content: space-between;
}

.items-center {
    align-items: center;
}

.h-6 {
    height: 1.5rem;
}

.h-4 {
    height: 1rem;
}

.w-4 {
    width: 1rem;
}

.w-6 {
    width: 1.5rem;
}

.w-14 {
    width: 3.5rem;
}

.pr-6 {
    padding-right: .5rem;
}
.pr-2 {
    padding-right: 0.25rem;
}

.pl-4 {
    padding-left: .5rem;
}

.px-1 {
    padding-left: .25rem;
    padding-right: .25rem;
}

.px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.py-1 {
    padding-top: .25rem;
    padding-bottom: .25rem;
}

.p-2 {
    padding: 0.5rem;
}

.cursor-pointer {
    cursor: pointer;
}

a {
    cursor: pointer;
    color: var(--primary-color);
    text-decoration: none;

    :hover {
        background-color: var(--primary-color);
        color: var(--invert-font-color);
    }
}

.bg-change {
    font-weight: bold;
    background-color: var(--primary-color);
    color: var(--invert-font-color);
}

.font-medium {
    font-weight: 500;
}

.svg-center svg {
    display: block;
    margin: 0 auto;
}

ul > li::after {
    content: "";
}

li {
    padding-left: .5rem;
}

li::after {
    position: absolute;
}
</style>
