import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'cloudSoft' }
    },
    // 雲端軟體申請單
    {
      path: '/cloudSoft',
      name: 'cloudSoft',
      component: () => import('@/views/cloud-software/cloudSoftList.vue')
    },
    {
      path: '/cloudSoft/create',
      name: 'cloudSoft-create',
      component: () => import('@/views/cloud-software/cloudSoftCreate.vue')
    },
    {
      path: '/cloudSoft/sign/:formId/:userId',
      name: 'cloudSoft-sign',
      component: () => import('@/views/cloud-software/cloudSoftSign.vue')
    }
  ]
})

export default router
