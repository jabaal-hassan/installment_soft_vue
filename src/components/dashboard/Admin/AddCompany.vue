<template>
  <div class="container-fluid d-flex align-items-center justify-content-center bg-white my-4">
    <div class="row w-75 shadow-lg">
      <div class="col-md-12 bg-white p-5">
        <h1 class="mb-4 fs-3 fw-bold">Add Company</h1>

        <!-- Success and Error Popup Components -->
        <SuccessPopup :show="showSuccess" :message="successMessage" />
        <ErrorPopup :show="showError" :message="errorMessage" />

        <!-- Validation Errors -->
        <div
          v-if="validationErrors && Object.keys(validationErrors).length > 0"
          class="validation-errors-container"
        >
          <div
            v-for="(errors, field) in validationErrors"
            :key="field"
            class="validation-error-item"
          >
            <div v-for="(error, index) in errors" :key="index" class="validation-error-message">
              <i class="fas fa-exclamation-circle"></i>
              <span class="field-name">{{ field.replace('_', ' ') }}:</span>
              {{ error }}
            </div>
          </div>
        </div>

        <!-- Company Add Form -->
        <form @submit.prevent="submitForm">
          <!-- Company Name -->
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.name }"
            />
            <label for="name" class="form-label">Company Name</label>
            <span v-if="validationErrors.name" class="error-message">
              {{ validationErrors.name[0] }}
            </span>
          </div>

          <!-- Company Logo -->
          <div class="mb-3 inputs position-relative">
            <input
              type="file"
              id="logo"
              @change="handleFileUpload('logo', $event)"
              class="form-control border-0"
              accept="image/*"
            />
            <label for="logo" class="form-label">Company Logo</label>
            <span v-if="validationErrors.logo" class="error-message">
              {{ validationErrors.logo[0] }}
            </span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn signup-btn w-100 rounded-0 fw-bold" :disabled="loading">
            <span v-if="loading">
              <i class="fa fa-spinner fa-spin"></i>
            </span>
            <span v-else>Add Company</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorPopup from '@/components/ErrorPopup.vue'

export default {
  components: {
    SuccessPopup,
    ErrorPopup,
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const showSuccess = ref(false)
    const showError = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const validationErrors = ref({})

    const formData = ref({
      name: '',
      logo: null,
    })

    const handleFileUpload = (field, event) => {
      const file = event.target.files[0]
      if (file) {
        formData.value[field] = file
        if (validationErrors.value[field]) {
          validationErrors.value = { ...validationErrors.value, [field]: [] }
        }
      }
    }

    const submitForm = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false

        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.value.name)
        if (formData.value.logo) {
          formDataToSend.append('logo', formData.value.logo)
        }

        const result = await store.dispatch('registerCompany', formDataToSend)

        if (result.success) {
          showSuccess.value = true
          successMessage.value = 'Company added successfully!'
          resetForm()
        } else {
          if (result.errors) {
            validationErrors.value = result.errors
            showError.value = true
            errorMessage.value = 'Please correct the errors below.'
          } else {
            showError.value = true
            errorMessage.value = result.message || 'Failed to add company'
          }
        }
      } catch (error) {
        console.error('Form submission error:', error)
        showError.value = true
        errorMessage.value = 'An unexpected error occurred'
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      formData.value = {
        name: '',
        logo: null,
      }
      validationErrors.value = {}
      const logoInput = document.getElementById('logo')
      if (logoInput) {
        logoInput.value = ''
      }
    }

    return {
      formData,
      loading,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      validationErrors,
      handleFileUpload,
      submitForm,
    }
  },
}
</script>

<style scoped>
/* Reuse the same styles from AddEmployee.vue */
/* Update signup button styles */
.signup-btn {
  position: relative;
  background: linear-gradient(135deg, #8710d8, #7209b7);
  color: white;
  font-weight: 500;
  height: 80px;
  letter-spacing: 1px;
  border-radius: 8px;
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(135, 16, 216, 0.2);
  text-transform: uppercase;
  font-size: 16px;
}

.signup-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.signup-btn:not(:disabled):hover::before {
  left: 100%;
}

.signup-btn:not(:disabled):hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(135, 16, 216, 0.3);
  background: linear-gradient(135deg, #7209b7, #5b0894);
}

.signup-btn:disabled {
  background: linear-gradient(135deg, #a17eb8, #8e6aa3);
  cursor: not-allowed;
  opacity: 0.8;
}

.signup-btn .button-content,
.signup-btn .loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.signup-btn i {
  transition: transform 0.3s ease;
}

.signup-btn:not(:disabled):hover i {
  transform: translateX(5px) scale(1.1);
}

.signup-btn .fa-spinner {
  font-size: 18px;
}

/* Add shine animation */
@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.signup-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.container-fluid {
  background-color: #f9f9f9;
}

.inputs {
  position: relative;
  border: 1px solid black;
  height: 10vh;
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
}

.form-label {
  position: absolute;
  top: 1.3rem;
  left: 0.75rem;
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
}

input:focus + .form-label,
input:not(:placeholder-shown) + .form-label {
  top: -0rem;
  left: 0.75rem;
  font-size: 0.75rem;
  margin-bottom: 0%;
}

input {
  background-color: transparent;
  outline: none;
  box-shadow: none;
  height: 4vh;
}

input:focus {
  border: none;
  box-shadow: none;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Add responsive styles */
@media (max-width: 768px) {
  .container-fluid {
    padding: 20px;
  }

  .row {
    width: 100% !important;
  }

  .col-md-12 {
    padding: 20px;
  }
}
</style>
