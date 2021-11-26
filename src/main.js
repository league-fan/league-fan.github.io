import { createApp } from 'vue'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    base: "/league-fan/",
    routes,
    linkActiveClass: "active",
  })

createApp(App).use(router).mount('#app')
