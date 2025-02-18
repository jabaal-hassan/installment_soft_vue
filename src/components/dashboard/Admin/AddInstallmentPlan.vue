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
          <!-- Plan Modal -->
          <div class="mb-3 inputs position-relative">
            <select
              id="plan_modal"
              v-model="formData.plan_modal"
              class="form-control border-0"
              required
            >
              <option value="" disabled selected>Select Plan Modal</option>
              <option value="monthly">Monthly Base</option>
              <option value="weekly">Weekly Base</option>
              <option value="daily">Daily Base</option>
            </select>
            <label for="plan_modal" class="form-label">Plan Modal</label>
          </div>

          <!-- Plan Name -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
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

            <!-- Product Selection with Search -->
            <div class="inputs position-relative w-48">
              <label class="form-label category-label">Product</label>
              <div class="search-select-container">
                <input
                  type="text"
                  v-model="productSearch"
                  class="form-control search-input border-0"
                  placeholder="Search Product..."
                  @focus="showProductDropdown = true"
                />
                <div v-if="showProductDropdown" class="custom-dropdown">
                  <template v-if="filteredProducts.length > 0">
                    <div
                      v-for="product in filteredProducts"
                      :key="product.id"
                      class="dropdown-item"
                      @click="selectProduct(product)"
                    >
                      {{ product.item_name }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="dropdown-item no-results">No products found</div>
                  </template>
                </div>
                <input type="hidden" v-model="formData.product_id" required />
              </div>
            </div>
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
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
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
            <div class="inputs position-relative w-48">
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
          </div>
          <!-- Total Price -->
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

          <!-- Remaining Amount -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="number"
                id="remaining_amount"
                v-model="remainingAmount"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ error: validationErrors.remaining_amount }"
                readonly
              />
              <label for="remaining_amount" class="form-label">Remaining Amount</label>
              <span v-if="validationErrors.remaining_amount" class="error-message">
                {{ validationErrors.remaining_amount[0] }}
              </span>
            </div>

            <!-- Installment Price -->
            <div class="inputs position-relative w-48">
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
          </div>
          <!-- Installment Duration -->
          <div class="mb-3 inputs position-relative">
            <input
              type="number"
              id="installment_duration"
              v-model="installmentDuration"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.installment_duration }"
              readonly
            />
            <label for="installment_duration" class="form-label">
              Installment Duration ({{ planDurationLabel }})
            </label>
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
import { ref, watch, computed, onMounted } from 'vue'
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
    const productSearch = ref('')
    const showProductDropdown = ref(false)
    const products = ref([])

    const formData = ref({
      plan_modal: '',
      plan_name: '',
      product_name: '',
      product_model: '',
      product_price: null,
      advance: null,
      total_price: null,
      remaining_amount: null,
      installment_price: null,
      installment_duration: null,
      product_id: '',
    })

    watch(
      () => formData.value.plan_modal,
      (newVal) => {
        if (newVal === 'monthly') {
          formData.value.plan_name = '12 Months Plan'
        } else if (newVal === 'weekly' || newVal === 'daily') {
          formData.value.plan_name = '6 Months Plan'
        } else {
          formData.value.plan_name = ''
        }
      },
    )

    const filteredProducts = computed(() => {
      if (!productSearch.value) {
        return products.value
      }
      return products.value.filter((product) =>
        product.item_name.toLowerCase().includes(productSearch.value.toLowerCase()),
      )
    })

    const selectProduct = (product) => {
      formData.value.product_id = product.id
      formData.value.product_name = product.item_name
      formData.value.product_model = product.model
      formData.value.product_price = product.price
      productSearch.value = product.item_name
      showProductDropdown.value = false
    }

    const fetchProducts = async () => {
      try {
        const result = await store.dispatch('getAllInventory')
        if (result.success) {
          products.value = result.data.inventory || []
        } else {
          console.error('Failed to load products:', result.message)
        }
      } catch (error) {
        console.error('Error in fetchProducts:', error)
      }
    }

    onMounted(() => {
      fetchProducts()
    })

    const remainingAmount = computed(() => {
      return formData.value.total_price - formData.value.advance
    })

    const installmentDuration = computed(() => {
      if (formData.value.installment_price > 0) {
        return Math.ceil(remainingAmount.value / formData.value.installment_price)
      }
      return 0
    })

    watch(
      () => [formData.value.total_price, formData.value.advance],
      () => {
        formData.value.remaining_amount = remainingAmount.value
      },
    )

    watch(
      () => formData.value.installment_price,
      () => {
        formData.value.installment_duration = installmentDuration.value
      },
    )

    const planDurationLabel = computed(() => {
      if (formData.value.plan_modal === 'monthly') {
        return 'months'
      } else if (formData.value.plan_modal === 'weekly') {
        return 'weeks'
      } else if (formData.value.plan_modal === 'daily') {
        return 'days'
      } else {
        return ''
      }
    })

    const submitForm = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false

        const result = await store.dispatch(
          'installmentPlanStore/addInstallmentPlan',
          formData.value,
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
        plan_modal: '',
        plan_name: '',
        product_name: '',
        product_model: '',
        product_price: null,
        advance: null,
        total_price: null,
        remaining_amount: null,
        installment_price: null,
        installment_duration: null,
        product_id: '',
      }
      productSearch.value = ''
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
      productSearch,
      showProductDropdown,
      filteredProducts,
      selectProduct,
      remainingAmount,
      installmentDuration,
      planDurationLabel,
    }
  },
}
</script>

<style scoped>
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
input:not(:placeholder-shown) + .form-label,
textarea:focus + .form-label,
textarea:not(:placeholder-shown) + .form-label,
select:focus + .form-label,
select:not(:placeholder-shown) + .form-label {
  top: -0rem;
  left: 0.75rem;
  font-size: 0.75rem;
  margin-bottom: 0%;
}
input:focus,
textarea:focus,
select:focus {
  border: none;
  box-shadow: none;
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

.w-48 {
  width: 49%; /* Ensures both fields take up nearly half of the container */
}
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
.category-label {
  position: absolute;
  top: -0rem;
  left: 0.5rem;
  font-size: 0.75rem;
  background-color: white;
  padding: 0 0.25rem;
  color: #000000;
  font-weight: bold;
  z-index: 1;
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
  .d-flex {
    flex-direction: column;
    width: 100%;
  }
  .w-48 {
    width: 100% !important; /* Stack the inputs vertically and take full width */
    margin-bottom: 10px; /* Add some space between inputs */
  }
}

.search-select-container {
  position: relative;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.no-results {
  color: #999;
}

.dropdown-divider {
  height: 1px;
  margin: 0.5rem 0;
  overflow: hidden;
  background-color: #e9ecef;
}
</style>
