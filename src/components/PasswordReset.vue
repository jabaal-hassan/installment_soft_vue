<template>
  <div class="form-wrapper">
    <h2>Reset Password</h2>

    <div
      v-if="message"
      :class="messageType === 'success' ? 'success-message' : 'error-message-box'"
    >
      {{ validationErrors.password ? validationErrors.password[0] : message }}
    </div>

    <form v-if="!successMessage" @submit.prevent="setupPassword">
      <div class="form-control">
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
          minlength="8"
          placeholder=" "
        />
        <label for="password" class="form-label">Password</label>
      </div>

      <div class="form-control">
        <input
          type="password"
          id="confirm_password"
          v-model="formData.password_confirmation"
          required
          minlength="8"
          placeholder=" "
          :class="{ error: validationErrors.password_confirmation }"
        />
        <label for="confirm_password" class="form-label">Confirm Password</label>
        <span v-if="validationErrors.password_confirmation" class="error-message">
          {{ validationErrors.password_confirmation[0] }}
        </span>
      </div>

      <button type="submit" :disabled="loading">
        <span v-if="loading">Setting up...</span>
        <span v-else>Set Password</span>
      </button>
    </form>

    <small>
      This page is protected by Jabaal Hassan.
      <a href="#">Learn more.</a>
    </small>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const loading = ref(false)
const validationErrors = ref({})
const message = ref('')
const messageType = ref('')
const successMessage = ref('')

const formData = ref({
  password: '',
  password_confirmation: '',
})

const setupPassword = async () => {
  try {
    loading.value = true
    validationErrors.value = {}
    message.value = ''

    const result = await store.dispatch('resetPassword', {
      email: route.query.email,
      token: route.query.token,
      password: formData.value.password,
      password_confirmation: formData.value.password_confirmation,
    })

    if (result.message === 'Password reset,setup successfull') {
      messageType.value = 'success'
      message.value = 'Password setup successful!'
      successMessage.value = message.value
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      messageType.value = 'error'
      validationErrors.value = result.errors || {}
      message.value = result.message || 'Password setup failed'
    }
  } catch (error) {
    console.error('Setup password error:', error)
    messageType.value = 'error'
    message.value = 'An error occurred while setting up your password'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!route.query.email || !route.query.token) {
    router.push('/login')
  }
})
</script>

<style scoped>
@import './FormStyles.css';
</style>
