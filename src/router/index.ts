import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about/:id',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // 雲端軟體申請單
    {
      path: '/cloudSoft',
      name: 'cloudSoft',
      component: () => import('@/views/cloud-software/cloudSoftList.vue')
    },
    {
      path: '/cloudSoft/creat',
      name: 'cloudSoft-create',
      component: () => import('@/views/cloud-software/cloudSoftCreate.vue')
    }
  ]
})

export default router
