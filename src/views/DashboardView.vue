<template>
  <div class="dashboard-view">
    <HomeDashboard v-if="$route.path === '/dashboard'" />
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import HomeDashboard from '@/components/dashboard/Home/HomeDashboard.vue'

const store = useStore()
const userRole = computed(() => store.getters.getUserRole)

// Check if the user is admin or branch-admin
const isAdminOrBranchAdmin = computed(() => {
  return (
    userRole.value === 'company admin' ||
    userRole.value === 'branch admin' ||
    userRole.value === 'admin' ||
    userRole.value === 'employee'
  )
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: #f8f9fe;
}
</style>
