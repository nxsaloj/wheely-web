import { createRouter, createWebHistory } from 'vue-router'
import ShoppingListDetailPage from '@/bounded-contexts/shoppingplanning/presentation/pages/ShoppingListDetailPage.vue'
import ShoppingListsPage from '@/bounded-contexts/shoppingplanning/presentation/pages/ShoppingListsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/lists',
  },
  {
    path: '/lists',
    name: 'shopping-lists',
    component: ShoppingListsPage,
  },
  {
    path: '/lists/:id',
    name: 'shopping-list-detail',
    component: ShoppingListDetailPage,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/lists',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
