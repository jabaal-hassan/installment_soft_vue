<template>
  <div class="form-wrapper">
    <h2>Set Up Password</h2>

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

    const result = await store.dispatch('setupPassword', {
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
.form-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 4px;
  padding: 70px;
  width: 450px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
}

.form-wrapper h2 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 25px;
}

.form-wrapper form {
  margin: 25px 0 65px;
}

.form-control {
  height: 50px;
  position: relative;
  margin-bottom: 16px;
}

.form-control input {
  height: 100%;
  width: 100%;
  background: #fff;
  border: none;
  outline: none;
  border-radius: 4px;
  color: #000;
  font-size: 1rem;
  padding: 0 20px;
}

.form-control input:focus + label,
.form-control input:not(:placeholder-shown) + label {
  font-size: 0.75rem;
  transform: translateY(-130%);
}

.form-control label {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
  color: #8c8c8c;
  transition: all 0.1s ease;
}

button {
  width: 100%;
  padding: 16px 0;
  font-size: 1rem;
  background: #0052cc;
  color: #fff;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  outline: none;
  margin: 25px 0 10px;
  cursor: pointer;
  transition: 0.1s ease;
}

button:disabled {
  background: #7e7e7e;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #2108c4;
}

.form-wrapper small {
  display: block;
  color: #b3b3b3;
  margin-top: 15px;
}

.form-wrapper small a {
  color: #0071eb;
  text-decoration: none;
}

.form-wrapper small a:hover {
  text-decoration: underline;
}

@media (max-width: 740px) {
  .form-wrapper {
    width: 100%;
    padding: 20px;
  }
}

.success-message {
  background-color: rgba(40, 167, 69, 0.1);
  border: 1px solid #28a745;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  margin: 20px 0;
}

.error-message-box {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
  margin: 20px 0;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.error {
  border: 1px solid red !important;
}
</style>
