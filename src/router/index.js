import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/workspace' },
    {
      path: '/workspace',
      component: () => import('../views/WorkspaceView.vue'),
      children: [
        { path: '', redirect: 'summary' },
        { path: 'summary', component: () => import('../views/WorkspaceSummary.vue') },
        { path: 'deals', component: () => import('../views/DealsView.vue') },
      ],
    },
    {
      path: '/partners/ibs',
      component: () => import('../views/IBsView.vue'),
    },
  ],
})

export default router
