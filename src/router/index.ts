import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      component: () => import('@/App.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: '/order',
          component: () => import('@/views/OrderView.vue')
        },
        {
          path: '/setting',
          component: () => import('@/views/SettingView.vue')
        },
        {
          path: '/restaurant/:id',
          component: () => import('@/views/RestaurantView.vue')
        }
      ]
    }
  ]
})

export default router
