import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/',
    redirect: '/today',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/today',
    name: 'today',
    component: () => import('../pages/TodayPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../pages/ManageHabitsPage.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'today' }
  }
})

export default router
