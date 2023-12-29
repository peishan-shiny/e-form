import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'soft' }
    },
    // 雲端軟體申請單
    {
      path: '/soft',
      name: 'soft',
      component: () => import('@/views/cloud-software/softList.vue')
    },
    {
      path: '/soft/create',
      name: 'soft-create',
      component: () => import('@/views/cloud-software/softCreate.vue')
    },
    {
      path: '/soft/sign/:formId/:userId',
      name: 'soft-sign',
      component: () => import('@/views/cloud-software/softSign.vue')
    }
  ]
})

export default router
