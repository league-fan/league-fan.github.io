import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import VueProgressBar from "./components/vue3-progressbar";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || "/"),
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

const siteTitle = import.meta.env.VITE_SITE_TITLE || "League Fan";

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${siteTitle} | ${to.meta.title}` : siteTitle;
  next()
})

createApp(App).use(router).use(createPinia()).use(VueProgressBar, progressbarOptions).mount('#app')
