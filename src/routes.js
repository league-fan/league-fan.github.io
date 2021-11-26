import Home from './views/Home.vue'
import License from './views/Licence.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/league-fan/', component: Home, meta: { title: 'Home' } },
  {
    path: '/league-fan/license',
    meta: { title: 'License' },
    component: License,
    // example of route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('./views/About.vue')
  },
  { path: '/league-fan/:path(.*)', component: NotFound },
]