import { createRouter, createWebHashHistory } from 'vue-router'

console.log('路由',import.meta.env.BASE_URL)
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
