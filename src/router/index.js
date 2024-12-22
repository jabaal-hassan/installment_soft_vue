import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import AddEmployee from '@/components/dashboard/Admin/AddEmployee.vue'
import store from '@/store'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'add-employee',
        name: 'add-employee',
        component: AddEmployee,
        meta: { requiresAuth: true, roles: ['admin', 'branch admin'] }, // Protect route with both 'admin' and 'branch admin' roles
      },
      // Add other child routes here, e.g., AddArticle, ViewArticles
    ],
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
    meta: { title: 'Unauthorized' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn
  const userRole = store.getters.getUserRole

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' })
  }

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next({ name: 'unauthorized' })
  }

  next()
})

export default router
