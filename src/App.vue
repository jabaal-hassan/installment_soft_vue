<template>
  <div :class="pageClass">
    <!-- Navbar Section: Only show if route is not 'login', 'password-setup', 'unauthorized', or 'not-found' -->
    <div v-if="!['login', 'password-setup', 'not-found'].includes(route.name)" class="navbar">
      <Navbar />
    </div>

    <!-- Main Content Section -->
    <div class="main-body">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from '../src/components/NavbarComponent.vue' // Import the Navbar Component
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute() // Use route to check current route

const pageClass = computed(() =>
  ['login', 'password-setup'].includes(route.name) ? 'login-background' : 'default-background',
)
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 10px;
}

/* Gradient background for login page */
.login-background .main-body {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('@/assets/hero-bg.jpg');
  background-size: cover;
  /* background: linear-gradient(-4deg, #01068d 25%, #8600af 50%, #2ecc3e 51%, #1abc9c 80%); */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Default white background for other pages */
.default-background .main-body {
  flex: 1;
}
</style>
