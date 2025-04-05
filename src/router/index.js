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
    path: '/password-setup',
    name: 'password-setup',
    component: () => import('@/components/PasswordSetup.vue'),
    meta: { requiresAuth: false, title: 'Setup Password' },
  },
  {
    path: '/dashboard',
    name: 'home',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'add-employee',
        name: 'add-employee',
        component: AddEmployee,
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/add-company',
        name: 'AddCompany',
        component: () => import('@/components/dashboard/Admin/AddCompany.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: '/dashboard/add-branch',
        name: 'AddBranch',
        component: () => import('@/components/dashboard/Admin/AddBranch.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin'] },
      },
      {
        path: '/dashboard/add-inventory',
        name: 'AddInventory',
        component: () => import('@/components/dashboard/Admin/AddInventory.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/view-inventory',
        name: 'ViewInventory',
        component: () => import('@/components/dashboard/Admin/InventoryView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/view-employees',
        name: 'ViewEmployees',
        component: () => import('@/components/dashboard/Admin/EmployeeView.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'company admin', 'branch admin'],
        },
      },
      {
        path: '/dashboard/add-installment-plan',
        name: 'AddInstallmentPlan',
        component: () => import('@/components/dashboard/Admin/AddInstallmentPlan.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/view-installment-plans',
        name: 'ViewInstallmentPlans',
        component: () => import('@/components/dashboard/Admin/InstallmentPlanView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/rejected-customers',
        name: 'RejectedCustomers',
        component: () => import('@/components/dashboard/Admin/RejectedCustomerView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/view-confirmed-customers',
        name: 'ViewConfirmedCustomers',
        component: () => import('@/components/dashboard/Admin/AllConfirmedCustomerView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/view-customers',
        name: 'ViewCustomers',
        component: () => import('@/components/dashboard/Admin/AllCustomersView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/view-confirmed-customers/:customer_id/:customer_name',
        name: 'CustomerView',
        component: () => import('@/components/dashboard/Admin/CustomerView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin'] },
      },
      {
        path: '/dashboard/add-customer',
        name: 'AddCustomer',
        component: () => import('@/components/dashboard/Admin/AddCustomer.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin', 'employee'] },
      },
      {
        path: '/dashboard/add-guarantor',
        name: 'AddGuarantor',
        component: () => import('@/components/dashboard/Admin/AddGuarantor.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin', 'employee'] },
      },
      {
        path: '/dashboard/customer-without-guarantor',
        name: 'CustomerWithoutGuarantor',
        component: () => import('@/components/dashboard/Admin/CustomerWithoutGuarantorView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin', 'employee'] },
      },
      {
        path: '/dashboard/inquiry-customers',
        name: 'InquiryCustomers',
        component: () => import('@/components/dashboard/Admin/InquiryCustomerView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin', 'employee'] },
      },
      {
        path: '/dashboard/installment-table',
        name: 'InstallmentTable',
        component: () => import('@/components/dashboard/Admin/InstallmentTable.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'company admin', 'branch admin', 'employee'] },
      },
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
  document.title = to.meta.title || 'Installmantsof'

  next()
})

export default router
