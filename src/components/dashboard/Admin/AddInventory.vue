<template>
  <div class="container-fluid d-flex align-items-center justify-content-center bg-white my-4">
    <div class="row w-75 shadow-lg">
      <div class="col-md-12 bg-white p-5">
        <!-- Header with Add Inventory title and Scan button -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="fs-3 fw-bold m-0">Add Inventory</h1>
          <button type="button" class="btn btn-outline-secondary" @click="startScanner">
            <i class="fas fa-qrcode me-2"></i>Scan QR/Barcode
          </button>
        </div>

        <!-- Success and Error Popup Components -->
        <SuccessPopup :show="showSuccess" :message="successMessage" />
        <ErrorPopup :show="showError" :message="errorMessage" />
        <!-- Add scanner modal -->
        <div
          class="modal fade"
          id="scannerModal"
          tabindex="-1"
          aria-labelledby="scannerModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="scannerModalLabel">Scan QR/Barcode</h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="stopScanner"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div id="reader"></div>
              </div>
            </div>
          </div>
        </div>
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

        <!-- Inventory Add Form -->
        <form @submit.prevent="submitForm">
          <!-- Item Name and Model -->
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="item_name"
              v-model="formData.item_name"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ error: validationErrors.item_name }"
            />
            <label for="item_name" class="form-label">Item Name</label>
          </div>
          <!-- Category Selection with Search -->
          <div class="mb-3 inputs position-relative">
            <label class="form-label category-label">Category</label>
            <div class="search-select-container">
              <input
                type="text"
                v-model="categorySearch"
                class="form-control search-input border-0"
                placeholder="Search Category..."
                @focus="showCategoryDropdown = true"
              />
              <div v-if="showCategoryDropdown" class="custom-dropdown">
                <template v-if="filteredCategories.length > 0">
                  <div
                    v-for="category in filteredCategories"
                    :key="category.id"
                    class="dropdown-item"
                    @click="selectCategory(category)"
                  >
                    {{ category.name }}
                  </div>
                </template>
                <template v-else>
                  <div class="dropdown-item no-results">No categories found</div>
                  <div class="dropdown-divider"></div>
                  <div
                    class="dropdown-item"
                    @click="selectCategory(categories.find((c) => c.name === 'Others'))"
                  >
                    {{ categories.find((c) => c.name === 'Others')?.name || 'Others' }}
                  </div>
                </template>
              </div>
              <input type="hidden" v-model="formData.category_id" required />
            </div>
          </div>

          <!-- Brand Selection with Search -->
          <div class="mb-3 inputs position-relative">
            <label class="form-label category-label">Brand</label>
            <div class="search-select-container">
              <input
                type="text"
                v-model="brandSearch"
                class="form-control search-input border-0"
                :placeholder="formData.category_id ? 'Search Brand...' : 'Select Category First'"
                @focus="showBrandDropdown = formData.category_id ? true : false"
                :disabled="!formData.category_id"
              />
              <div v-if="showBrandDropdown && formData.category_id" class="custom-dropdown">
                <template v-if="filteredBrands.length > 0">
                  <div
                    v-for="brand in filteredBrands"
                    :key="brand.id"
                    class="dropdown-item"
                    @click="selectBrand(brand)"
                  >
                    {{ brand.name }}
                  </div>
                </template>
                <template v-else>
                  <div class="dropdown-item no-results">No results found</div>
                  <div class="dropdown-divider"></div>
                  <div
                    class="dropdown-item"
                    @click="
                      selectBrand(
                        brands.find(
                          (b) => b.name === 'Others' && b.category_id === formData.category_id,
                        ),
                      )
                    "
                  >
                    Others
                  </div>
                </template>
              </div>
              <input type="hidden" v-model="formData.brand_id" required />
            </div>
          </div>

          <!-- Description -->
          <div class="mb-3 inputs position-relative">
            <textarea
              id="description"
              v-model="formData.description"
              class="form-control border-0"
              placeholder=" "
              rows="3"
            ></textarea>
            <label for="description" class="form-label">Description (Optional)</label>
          </div>
          <!-- Serial Number and Model -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="model"
                v-model="formData.model"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="model" class="form-label">Model</label>
            </div>

            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="serial_number"
                v-model="formData.serial_number"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="serial_number" class="form-label">Serial Number</label>
            </div>
          </div>
          <div class="mb-3 inputs position-relative">
            <input
              type="text"
              id="color"
              v-model="formData.color"
              class="form-control border-0"
              placeholder=" "
            />
            <label for="color" class="form-label">Color (Optional)</label>
          </div>

          <!-- Quantity and Price -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="number"
                id="quantity"
                v-model="formData.quantity"
                class="form-control border-0"
                placeholder=" "
                min="0"
              />
              <label for="quantity" class="form-label">Quantity (Optional)</label>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="number"
                id="price"
                v-model="formData.price"
                class="form-control border-0"
                required
                placeholder=" "
                min="0"
              />
              <label for="price" class="form-label">Price</label>
            </div>
          </div>

          <!-- Branch Selection - Only show if not branch admin -->
          <div v-if="!isBranchAdmin" class="mb-3 inputs position-relative">
            <select
              id="branch"
              v-model="formData.branch_id"
              class="form-control border-0"
              required
              :disabled="isBranchAdmin"
            >
              <option value="" disabled selected>Select Branch</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
            <label for="branch" class="form-label">Branch</label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn signup-btn w-100 rounded-0 fw-bold" :disabled="loading">
            <span v-if="loading"> <i class="fa fa-spinner fa-spin"></i> Adding... </span>
            <span v-else>Add Inventory</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import SuccessPopup from '@/components/SuccessPopup.vue'
import ErrorPopup from '@/components/ErrorPopup.vue'
import { Html5Qrcode } from 'html5-qrcode'
import { Modal } from 'bootstrap'

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

    const categories = ref([])
    const brands = ref([])
    const branches = ref([])

    const formData = ref({
      item_name: '',
      branch_id: '',
      category_id: '',
      brand_id: '',
      model: '',
      serial_number: '',
      color: '',
      description: '',
      quantity: '',
      price: '',
    })

    // Add computed properties for role checks
    const userRole = computed(() => store.getters.getUserRole)

    const isAdmin = computed(() => userRole.value === 'admin')

    const isAdminOrCompanyAdmin = computed(() =>
      ['admin', 'company admin'].includes(userRole.value),
    )

    const isBranchAdmin = computed(() => userRole.value === 'branch admin')

    // Fetch necessary data on component mount
    onMounted(async () => {
      await Promise.all([fetchCategories(), fetchBrands(), fetchBranches()])
    })

    const fetchCategories = async () => {
      try {
        const result = await store.dispatch('getAllCategories')
        if (result.success) {
          categories.value = result.categories
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const fetchBrands = async () => {
      try {
        const result = await store.dispatch('getAllBrands')
        if (result.success) {
          brands.value = result.brands
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }

    const fetchBranches = async () => {
      try {
        const result = await store.dispatch('getAllBranches')
        if (result.success) {
          if (isBranchAdmin.value) {
            // For branch admin, filter to only show their branch
            const userBranchId = store.getters.getLoggedUser?.branch_id
            branches.value = result.branches.filter((branch) => branch.id === userBranchId)
            // Automatically set the branch_id in formData
            formData.value.branch_id = userBranchId
          } else {
            // For admin and company admin, show all accessible branches
            branches.value = result.branches
          }
        }
      } catch (error) {
        console.error('Error fetching branches:', error)
      }
    }

    const submitForm = async () => {
      try {
        loading.value = true
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false

        const result = await store.dispatch('addInventory', formData.value)

        if (result.success) {
          showSuccess.value = true
          successMessage.value = result.message
          resetForm()
        } else {
          showError.value = true
          if (result.errors) {
            validationErrors.value = result.errors
            errorMessage.value = 'Please correct the errors below.'
          } else {
            errorMessage.value = result.message
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
        item_name: '',
        branch_id: '',
        category_id: '',
        brand_id: '',
        model: '',
        serial_number: '',
        color: '',
        description: '',
        quantity: '',
        price: '',
      }
      validationErrors.value = {}
    }

    const categorySearch = ref('')
    const showCategoryDropdown = ref(false)
    const selectedCategory = ref(null)

    // Add computed property for filtered categories with "Others" always last
    const filteredCategories = computed(() => {
      let filtered = categories.value

      if (categorySearch.value) {
        const search = categorySearch.value.toLowerCase()
        filtered = filtered.filter((category) => category.name.toLowerCase().includes(search))
      }

      // Sort to ensure "Others" is always last
      return filtered.sort((a, b) => {
        if (a.name === 'Others') return 1
        if (b.name === 'Others') return -1
        return a.name.localeCompare(b.name)
      })
    })

    // Add method to handle category selection
    const selectCategory = (category) => {
      selectedCategory.value = category
      formData.value.category_id = category.id
      categorySearch.value = category.name
      showCategoryDropdown.value = false

      // Reset brand if category changes
      formData.value.brand_id = ''
      brandSearch.value = ''
      selectedBrand.value = null
    }

    // Close dropdown when clicking outside
    onMounted(() => {
      document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.search-select-container')
        if (dropdown && !dropdown.contains(e.target)) {
          showCategoryDropdown.value = false
        }
      })
    })

    const brandSearch = ref('')
    const showBrandDropdown = ref(false)
    const selectedBrand = ref(null)

    // Update filtered brands to include search and always show "Others" last
    const filteredBrands = computed(() => {
      if (!formData.value.category_id) return []

      let filtered = brands.value.filter(
        (brand) => brand.category_id === formData.value.category_id,
      )

      if (brandSearch.value) {
        const search = brandSearch.value.toLowerCase()
        filtered = filtered.filter((brand) => brand.name.toLowerCase().includes(search))
      }

      // Sort to ensure "Others" is always last
      return filtered.sort((a, b) => {
        if (a.name === 'Others') return 1
        if (b.name === 'Others') return -1
        return a.name.localeCompare(b.name)
      })
    })

    // Add method to handle brand selection
    const selectBrand = (brand) => {
      selectedBrand.value = brand
      formData.value.brand_id = brand.id
      brandSearch.value = brand.name
      showBrandDropdown.value = false
    }

    // Reset brand when category changes
    watch(
      () => formData.value.category_id,
      () => {
        formData.value.brand_id = ''
        brandSearch.value = ''
        selectedBrand.value = null
      },
    )

    // Close dropdowns when clicking outside
    onMounted(() => {
      document.addEventListener('click', (e) => {
        const categoryDropdown = document.querySelector('.search-select-container')
        if (categoryDropdown && !categoryDropdown.contains(e.target)) {
          showCategoryDropdown.value = false
        }

        const brandDropdown = document.querySelectorAll('.search-select-container')[1]
        if (brandDropdown && !brandDropdown.contains(e.target)) {
          showBrandDropdown.value = false
        }
      })
    })

    const html5QrCode = ref(null)
    const modal = ref(null)

    onMounted(() => {
      modal.value = new Modal(document.getElementById('scannerModal'))
    })

    const startScanner = async () => {
      try {
        html5QrCode.value = new Html5Qrcode('reader')
        modal.value.show()

        await html5QrCode.value.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          onScanFailure,
        )
      } catch (err) {
        console.error('Error starting scanner:', err)
        showError.value = true
        errorMessage.value = 'Could not start scanner. Please check camera permissions.'
      }
    }

    const stopScanner = async () => {
      if (html5QrCode.value) {
        try {
          await html5QrCode.value.stop()
          html5QrCode.value = null
        } catch (err) {
          console.error('Error stopping scanner:', err)
        }
      }
      modal.value.hide()
    }

    const onScanSuccess = async (decodedText) => {
      try {
        // Stop scanner after successful scan
        await stopScanner()

        // Parse the scanned data
        const scannedData = JSON.parse(decodedText)

        // Update form data with scanned values
        formData.value = {
          ...formData.value,
          ...scannedData,
        }

        showSuccess.value = true
        successMessage.value = 'Data scanned successfully!'
      } catch (err) {
        console.error('QR/Barcode scan error:', err)
        showError.value = true
        errorMessage.value = 'Invalid QR/Barcode format'
      }
    }

    const onScanFailure = (error) => {
      // Handle scan failure silently as it happens frequently
      console.log('Scan failure:', error)
    }

    onBeforeUnmount(() => {
      stopScanner()
    })

    return {
      formData,
      loading,
      showSuccess,
      showError,
      successMessage,
      errorMessage,
      validationErrors,
      categories,
      brands,
      branches,
      submitForm,
      isAdmin,
      isAdminOrCompanyAdmin,
      isBranchAdmin,
      categorySearch,
      showCategoryDropdown,
      filteredCategories,
      selectCategory,
      selectedCategory,
      brandSearch,
      showBrandDropdown,
      filteredBrands,
      selectBrand,
      selectedBrand,
      startScanner,
      stopScanner,
    }
  },
}
</script>

<style scoped>
.signup-btn {
  background-color: #8710d8;
  height: 10vh;
  color: #fff;
  border: none;
}
.w-48 {
  width: 49%; /* Ensures both fields take up nearly half of the container */
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
.error-border {
  border-color: red !important;
}
.inputs.error-border,
.inputs:has(input.error-border),
.inputs:has(select.error-border) {
  border: 1px solid red;
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

input {
  background-color: transparent;
  outline: none;
  box-shadow: none;
  height: 4vh;
}

input:focus,
textarea:focus,
select:focus {
  border: none;
  box-shadow: none;
}

input,
textarea,
select {
  background-color: transparent;
  outline: none;
  box-shadow: none;
}

.form-check-input {
  height: 20px;
  width: 20px;
  border-color: #000000;
}
.form-check-input:checked {
  background-color: black;
  border-color: black;
}

.form-check-input {
  accent-color: black;
}
select {
  background-color: transparent;
  outline: none;
  box-shadow: none;
  border: 1px solid black; /* Optional: Keeps a thin border for the select */
  width: 80%; /* Ensures the select takes up the full width */
  color: #000000;
}

select option:first-child {
  color: #757575;
}

select option {
  color: #000000;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container-fluid {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
  }

  .row {
    flex-direction: column;
    align-items: center;
    width: 100% !important;
  }

  .col-md-7 {
    display: none;
  }

  .col-md-12 {
    width: 100%;
    padding: 20px;
    text-align: center;
  }

  /* Stack inputs vertically and make them full width when the screen is smaller */
  .inputs {
    width: 100% !important; /* Ensure input fields take full width */
    margin-bottom: 10px; /* Add some space between inputs */
  }

  .d-flex {
    flex-direction: column;
    width: 100%;
  }

  .w-48 {
    width: 100% !important; /* Stack the inputs vertically and take full width */
    margin-bottom: 10px; /* Add some space between inputs */
  }

  .form-label {
    font-size: 14px; /* Adjust font size for better readability on small screens */
  }
}

.form-group {
  margin-bottom: 1rem;
}

.error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.07rem;
  display: block;
}

.validation-errors-container {
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-error-item {
  margin-bottom: 8px;
}

.validation-error-item:last-child {
  margin-bottom: 0;
}

.validation-error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.validation-error-message:hover {
  transform: translateX(5px);
}

.validation-error-message i {
  color: #d32f2f;
}

.field-name {
  font-weight: 600;
  text-transform: capitalize;
}

/* Add this if you want to show company logo next to name */
.company-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.company-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.search-select-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 4vh;
  padding: 8px 12px;
  background: transparent;
  margin-top: 1rem;
}

.search-input::placeholder {
  color: #757575;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.no-results {
  color: #666;
  font-style: italic;
}

/* Scrollbar styling */
.custom-dropdown::-webkit-scrollbar {
  width: 6px;
}

.custom-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-dropdown::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.custom-dropdown::-webkit-scrollbar-thumb:hover {
  background: #555;
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

.dropdown-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 0.5rem 0;
}

.others-option {
  color: #8710d8;
  font-weight: 500;
}

.others-option:hover {
  background-color: #f8f2ff;
}

.others-option i {
  font-size: 0.9em;
}

#reader {
  width: 100%;
  min-height: 300px;
}

#reader video {
  width: 100%;
  height: auto;
}
</style>
