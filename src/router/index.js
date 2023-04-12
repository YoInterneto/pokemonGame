import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonList from '../views/PokemonList.vue'
import GuessGame from '../views/GuessGame.vue'
import GuessGameSprite from '../views/GuessGameSprite.vue'
import GetGenerationData from '../views/GetGenerationData.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/guess',
      name: 'guess',
      component: GuessGame
    },
    {
      path: '/guessSprite',
      name: 'guessSprite',
      component: GuessGameSprite
    },
    {
      path: '/list',
      name: 'list',
      component: PokemonList
    },
    {
      path: '/data',
      name: 'data',
      component: GetGenerationData
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
