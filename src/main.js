import { createApp } from 'vue'
import App from './App.vue'
import { routes } from './routes.js'
import {store} from './vuex.js'
import { createRouter, createWebHistory } from 'vue-router'
import VueProgressBar from "./components/vue3-progressbar";

const router = createRouter({
  history: createWebHistory(),
  base: "/",
  routes,
  linkActiveClass: "active",
})

const progressbarOptions = {
  color: "#1a95e0",
  failedColor: "#874b4b",
  thickness: "12px",
  transition: {
    speed: "0.2s",
    opacity: "0.5s",
    termination: 300,
  },
  autoRevert: true,
  location: "top",
  inverse: false,
};

router.beforeEach((to, from, next) => {
  if (to.meta.title) {//如果设置标题，拦截后设置标题
    document.title = `${import.meta.env.VITE_SITE_TITLE} | ${to.meta.title}`
  } else {
    document.title = `${import.meta.env.VITE_SITE_TITLE}`
  }
  next()
})

createApp(App).use(router).use(store).use(VueProgressBar, progressbarOptions).mount('#app')
