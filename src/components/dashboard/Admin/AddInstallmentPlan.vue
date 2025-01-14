<template>
  <div class="container-fluid d-flex align-items-center justify-content-center bg-white my-4">
    <div class="row w-75 shadow-lg">
      <div class="col-md-12 bg-white p-5">
        <h1 class="mb-4 fs-3 fw-bold">Add Installment Plan</h1>

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

        <!-- Installment Plan Add Form -->
        <form @submit.prevent="submitForm">
          <!-- Plan Name -->
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="plan_name"
              v-model="formData.plan_name"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.plan_name }"
            />
            <label for="plan_name" class="form-label">Plan Name</label>
            <span v-if="validationErrors.plan_name" class="error-message">
              {{ validationErrors.plan_name[0] }}
            </span>
          </div>

          <!-- Product Name -->
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="product_name"
              v-model="formData.product_name"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.product_name }"
            />
            <label for="product_name" class="form-label">Product Name</label>
            <span v-if="validationErrors.product_name" class="error-message">
              {{ validationErrors.product_name[0] }}
            </span>
          </div>

          <!-- Product Model -->
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="product_model"
              v-model="formData.product_model"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.product_model }"
            />
            <label for="product_model" class="form-label">Product Model</label>
            <span v-if="validationErrors.product_model" class="error-message">
              {{ validationErrors.product_model[0] }}
            </span>
          </div>

          <!-- Product Price -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="product_price"
              v-model="formData.product_price"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.product_price }"
            />
            <label for="product_price" class="form-label">Product Price</label>
            <span v-if="validationErrors.product_price" class="error-message">
              {{ validationErrors.product_price[0] }}
            </span>
          </div>

          <!-- Advance -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="advance"
              v-model="formData.advance"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.advance }"
            />
            <label for="advance" class="form-label">Advance</label>
            <span v-if="validationErrors.advance" class="error-message">
              {{ validationErrors.advance[0] }}
            </span>
          </div>

          <!-- Total Price -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="total_price"
              v-model="formData.total_price"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.total_price }"
            />
            <label for="total_price" class="form-label">Total Price</label>
            <span v-if="validationErrors.total_price" class="error-message">
              {{ validationErrors.total_price[0] }}
            </span>
          </div>

          <!-- Remaining Amount -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="remaining_amount"
              v-model="formData.remaining_amount"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.remaining_amount }"
            />
            <label for="remaining_amount" class="form-label">Remaining Amount</label>
            <span v-if="validationErrors.remaining_amount" class="error-message">
              {{ validationErrors.remaining_amount[0] }}
            </span>
          </div>

          <!-- Installment Price -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="installment_price"
              v-model="formData.installment_price"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.installment_price }"
            />
            <label for="installment_price" class="form-label">Installment Price</label>
            <span v-if="validationErrors.installment_price" class="error-message">
              {{ validationErrors.installment_price[0] }}
            </span>
          </div>

          <!-- Installment Duration -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="installment_duration"
              v-model="formData.installment_duration"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.installment_duration }"
            />
            <label for="installment_duration" class="form-label"
              >Installment Duration (months)</label
            >
            <span v-if="validationErrors.installment_duration" class="error-message">
              {{ validationErrors.installment_duration[0] }}
            </span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn signup-btn w-100 rounded-0 fw-bold" :disabled="loading">
            <span v-if="loading">
              <i class="fa fa-spinner fa-spin"></i>
            </span>
            <span v-else>Add Installment Plan</span>
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
      plan_name: '',
      product_name: '',
      product_model: '',
      product_price: null,
      advance: null,
      total_price: null,
      remaining_amount: null,
      installment_price: null,
      installment_duration: null,
    })

    const submitForm = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false

        const formDataToSend = new FormData()
        for (const key in formData.value) {
          formDataToSend.append(key, formData.value[key])
        }

        const result = await store.dispatch(
          'installmentPlanStore/addInstallmentPlan',
          formDataToSend,
        )

        if (result.success) {
          showSuccess.value = true
          successMessage.value = 'Installment Plan added successfully!'
          resetForm()
        } else {
          if (result.errors) {
            validationErrors.value = result.errors
            showError.value = true
            errorMessage.value = 'Please correct the errors below.'
          } else {
            showError.value = true
            errorMessage.value = result.message || 'Failed to add installment plan'
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
        plan_name: '',
        product_name: '',
        product_model: '',
        product_price: null,
        advance: null,
        total_price: null,
        remaining_amount: null,
        installment_price: null,
        installment_duration: null,
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
      submitForm,
    }
  },
}
</script>

<style scoped>
/* Reuse the same styles from AddCompany.vue */
.signup-btn {
  background-color: #8710d8;
  height: 10vh;
  color: #fff;
  border: none;
}

.signup-btn:hover {
  background-color: #7f0fc9;
  color: white;
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
