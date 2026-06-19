import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/workspace' },
    { path: '/workspace', component: () => import('../views/WorkspaceView.vue') },
    { path: '/partners/ibs', component: () => import('../views/IBsView.vue') },
  ],
})

export default router
