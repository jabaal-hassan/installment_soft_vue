<template>
  <div class="dashboard-view">
    <!-- Conditionally render based on isAdminOrBranchAdmin -->
    <router-view v-if="isAdminOrBranchAdmin" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'


const store = useStore()
const userRole = computed(() => store.getters.getUserRole)

// Check if the user is admin or branch-admin
const isAdminOrBranchAdmin = computed(() => {
  return (
    userRole.value === 'company admin' ||
    userRole.value === 'branch admin' ||
    userRole.value === 'admin'
  )
})
</script>

<style scoped>
/* Add any specific styles here */
</style>
