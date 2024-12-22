<template>
  <SuccessPopupComponent :show="showSuccess" :message="successMessage" />
  <ErrorPopupComponent :show="showError" :message="errorMessage" />
  <div class="form-wrapper">
    <!-- Success and Error Popup Components -->

    <h2>Sign In</h2>

    <!-- Login Form -->
    <form @submit.prevent="submitForm">
      <div class="form-control">
        <input type="email" id="email" v-model="email" required placeholder="" />
        <label for="email" class="form-label">Email</label>
      </div>
      <div class="form-control">
        <input
          type="password"
          id="password"
          v-model="password"
          required
          minlength="8"
          placeholder=""
        />
        <label for="password" class="form-label">Password</label>
      </div>
      <button type="submit" :disabled="loginDisabled">Sign In</button>

      <div class="form-help">
        <div class="remember-me">
          <input type="checkbox" id="remember-me" />
          <label for="remember-me">Remember me</label>
        </div>
        <a href="#">Need help?</a>
      </div>
    </form>
    <p>If you've forgotten your password, <a href="#">click here to reset it</a></p>
    <small>
      This page is protected by Jabaal Hassan.
      <a href="#">Learn more.</a>
    </small>
  </div>
</template>
<script setup>
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SuccessPopup from '../SuccessPopup.vue'
import ErrorPopup from '../ErrorPopup.vue'

const SuccessPopupComponent = defineComponent(SuccessPopup)
const ErrorPopupComponent = defineComponent(ErrorPopup)

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const router = useRouter()
const store = useStore()

const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const loginDisabled = ref(false)

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

const submitForm = async () => {
  emailError.value = ''
  passwordError.value = ''
  errorMessage.value = ''
  showError.value = false

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address.'
    return
  }

  loginDisabled.value = true // Disable login button during request

  try {
    // Call the Vuex action to perform the login
    const response = await store.dispatch('loginUser', {
      email: email.value,
      password: password.value,
    })

    if (response.success) {
      successMessage.value = response.message || 'Login successful!'
      showSuccess.value = true

      setTimeout(() => {
        showSuccess.value = false
        router.push('/dashboard') // Redirect to dashboard
      }, 1000)
    } else {
      // Backend error message
      errorMessage.value = response.data?.message || 'Invalid email or password.'
      showError.value = true
    }
  } catch (error) {
    // Handle unexpected errors
    errorMessage.value = error.response?.data?.message || 'An unexpected error occurred.'
    showError.value = true
  } finally {
    loginDisabled.value = false // Re-enable login button
    setTimeout(() => {
      showError.value = false
    }, 5000) // Hide error popup after 5 seconds
  }
}
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
}
.form-wrapper form {
  margin: 25px 0 65px;
}
form .form-control {
  height: 50px;
  position: relative;
  margin-bottom: 16px;
}
.form-control input {
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  border-radius: 4px;
  color: #000000;
  font-size: 1rem;
  padding: 0 20px;
}
.form-control input:is(:focus, :valid) {
  padding: 16px 20px 0;
}
.form-control label {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
  color: #000000;
  transition: all 0.1s ease;
}
.form-control input:is(:focus, :valid) ~ label {
  font-size: 0.75rem;
  transform: translateY(-130%);
}
form button {
  width: 100%;
  padding: 16px 0;
  font-size: 1rem;
  background: #095ae5;
  color: #fff;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  outline: none;
  margin: 25px 0 10px;
  cursor: pointer;
  transition: 0.1s ease;
}
form button:hover {
  background: #2108c4;
}
.form-wrapper a {
  text-decoration: none;
}
.form-wrapper a:hover {
  text-decoration: underline;
}
.form-wrapper :where(label, p, small, a) {
  color: #b3b3b3;
}
form .form-help {
  display: flex;
  justify-content: space-between;
}
form .remember-me {
  display: flex;
}
form .remember-me input {
  margin-right: 5px;
  accent-color: #b3b3b3;
}
form .form-help :where(label, a) {
  font-size: 0.9rem;
}
.form-wrapper p a {
  color: #fff;
}
.form-wrapper small {
  display: block;
  margin-top: 15px;
  color: #b3b3b3;
}
.form-wrapper small a {
  color: #0071eb;
}
@media (max-width: 740px) {
  body::before {
    display: none;
  }
  nav,
  .form-wrapper {
    padding: 20px;
  }
  nav a img {
    width: 140px;
  }
  .form-wrapper {
    width: 100%;
    top: 43%;
  }
  .form-wrapper form {
    margin: 25px 0 40px;
  }
}
</style>
