import License from './views/Licence.vue'
import NotFound from './views/NotFound.vue'
import Test from './views/Test2.vue'

const baseUrl = import.meta.env.VITE_BASE_URL;

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    path: baseUrl+'/',
    name: 'icons',
    component: () => import('./views/SummonerIcons.vue'),
    meta: { title: 'Summoner Icons' }
  },
  {
    path: baseUrl+'/license',
    name: 'license',
    meta: { title: 'License' },
    component: License,
  },
  {
    path: baseUrl+'/test',
    name: 'test',
    meta: { title: 'Test' },
    component: Test,
  },
  {
    path: baseUrl+'/summoner-emotes',
    name: 'emotes',
    component: () => import('./views/SummonerEmotes.vue'),
    meta: { title: 'Summoner Emotes' }
  },
  {
    path: baseUrl+'/summoner-skins',
    name: 'skins',
    component: NotFound,
    meta: { title: 'Summoner Skins' }
  },
  { path: '/:path(.*)', component: NotFound },
]