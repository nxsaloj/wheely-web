import { createRouter, createWebHistory } from 'vue-router'
import ShoppingListsPage from '@/bounded-contexts/shoppingplanning/presentation/pages/ShoppingListsPage.vue'
import ShoppingListDetailPage from '@/bounded-contexts/shoppingplanning/presentation/pages/ShoppingListDetailPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
  ],
})

export default router
