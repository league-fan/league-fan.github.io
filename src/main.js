import { createApp } from 'vue'
import App from './App.vue'
import { routes } from './routes.js'
import {store} from './vuex.js'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  base: "/league-fan/",
  routes,
  linkActiveClass: "active",
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {//如果设置标题，拦截后设置标题
    document.title = `${import.meta.env.VITE_SITE_TITLE} | ${to.meta.title}`
  } else {
    document.title = `${import.meta.env.VITE_SITE_TITLE}`
  }
  next()
})

createApp(App).use(router).use(store).mount('#app')
