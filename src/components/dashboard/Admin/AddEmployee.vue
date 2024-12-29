<template>
  <div class="container-fluid d-flex align-items-center justify-content-center bg-white my-4">
    <div class="row w-75 shadow-lg">
      <!-- Right Side - Add Employee Form -->
      <div class="col-md-12 bg-white p-5">
        <h1 class="mb-4 fs-3 fw-bold">Add Employee</h1>

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

        <!-- Employee Add Form -->
        <form @submit.prevent="submitForm">
          <!-- Full Name and Father Name in one line -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ error: validationErrors.name }"
              />
              <label for="name" class="form-label">Full Name</label>
              <span v-if="validationErrors.name" class="error-message">
                {{ validationErrors.name[0] }}
              </span>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="father-name"
                v-model="formData.father_name"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="father-name" class="form-label">Father Name</label>
              <span v-if="validationErrors.father_name" class="text-danger">{{
                validationErrors.father_name[0]
              }}</span>
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3 inputs position-relative">
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="form-control border-0"
              required
              placeholder=" "
              :class="{ 'error-border': validationErrors.email }"
            />
            <label for="email" class="form-label">Email</label>
          </div>

          <!-- Other fields with validation messages below them -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="phone_number"
                v-model="formData.phone_number"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ 'error-border': validationErrors.phone_number }"
              />
              <label for="phone_number" class="form-label">Phone Number</label>
            </div>
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="id_card_number"
                v-model="formData.id_card_number"
                class="form-control border-0"
                required
                placeholder=" "
                :class="{ 'error-border': validationErrors.id_card_number }"
              />
              <label for="id_card_number" class="form-label">ID Card Number</label>
            </div>
          </div>

          <!-- Address -->
          <div class="mb-3 inputs position-relative">
            <textarea
              id="address"
              v-model="formData.address"
              class="form-control border-0"
              required
              placeholder=" "
            ></textarea>
            <label for="address" class="form-label">Address</label>
          </div>

          <!-- Position and Pay in one line -->
          <div class="mb-3 d-flex justify-content-between">
            <!-- Position -->
            <div class="inputs position-relative w-48">
              <input
                type="text"
                id="position"
                v-model="formData.position"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="position" class="form-label">Position</label>
            </div>

            <!-- Pay -->
            <div class="inputs position-relative w-48">
              <input
                type="number"
                id="pay"
                v-model="formData.pay"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="pay" class="form-label">Pay</label>
            </div>
          </div>

          <!-- Role -->
          <div class="mb-3 inputs position-relative">
            <select
              id="role"
              v-model="formData.role"
              class="form-control border-0"
              required
              :class="{ error: validationErrors.role }"
            >
              <option value="" disabled selected>Select Role</option>
              <!-- Always show Employee option -->
              <option value="employee">Employee</option>

              <!-- Show Branch Admin only for Admin and Company Admin -->
              <template v-if="isAdminOrCompanyAdmin">
                <option value="branch admin">Branch Admin</option>
              </template>

              <!-- Show Company Admin only for Admin -->
              <template v-if="isAdmin">
                <option value="company admin">Company Admin</option>
              </template>
            </select>
            <label for="role" class="form-label">Role</label>
            <span v-if="validationErrors.role" class="error-message">
              {{ validationErrors.role[0] }}
            </span>
          </div>

          <!-- Branch Selection and Date of Joining -->
          <div class="mb-3 d-flex justify-content-between">
            <div v-if="isAdminOrCompanyAdmin" class="inputs position-relative w-48">
              <select
                id="branch"
                v-model="formData.branch_id"
                class="form-control border-0"
                :required="!isAdmin"
                :class="{ error: validationErrors?.branch_id }"
              >
                <option value="" disabled selected>Select Branch</option>
                <option
                  v-for="branch in branches"
                  :key="branch.id"
                  :value="branch.id"
                  style="color: #000000"
                >
                  {{ branch.name }} ({{ branch.city }})
                </option>
              </select>
              <label for="branch" class="form-label">Branch</label>
              <span v-if="validationErrors?.branch_id" class="error-message">
                {{ validationErrors.branch_id[0] }}
              </span>
            </div>
            <div class="inputs position-relative" :class="isAdminOrCompanyAdmin ? 'w-48' : 'w-100'">
              <input
                type="date"
                id="date_of_joining"
                v-model="formData.date_of_joining"
                class="form-control border-0"
                required
                placeholder=" "
              />
              <label for="date_of_joining" class="form-label">Date of Joining</label>
            </div>
          </div>

          <!-- ID Card Image and Check Image -->
          <div class="mb-3 d-flex justify-content-between">
            <div class="inputs position-relative w-48">
              <input
                type="file"
                id="id_card_image"
                @change="handleFileUpload('id_card_image', $event)"
                class="form-control border-0"
              />
              <label for="id_card_image" class="form-label">ID Card Image</label>
            </div>

            <div class="inputs position-relative w-48">
              <input
                type="file"
                id="check_image"
                @change="handleFileUpload('check_image', $event)"
                class="form-control border-0"
              />
              <label for="check_image" class="form-label">Check Image</label>
            </div>
          </div>

          <!-- Company Selection (Only for Admin) -->
          <div v-if="isAdmin" class="mb-3 inputs position-relative">
            <div v-if="companies.length === 0" class="text-muted small">Loading companies...</div>

            <select
              id="company"
              v-model="formData.company_id"
              class="form-control border-0"
              required
              :class="{ error: validationErrors?.company_id }"
            >
              <option value="" disabled selected>Select Company</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
            <label for="company" class="form-label">Company</label>
            <span v-if="validationErrors?.company_id" class="error-message">
              {{ validationErrors.company_id[0] }}
            </span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn signup-btn w-100 rounded-0 fw-bold" :disabled="loading">
            <span v-if="loading"> <i class="fa fa-spinner fa-spin"></i> Submitting... </span>
            <span v-else> Add Employee </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

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
</style>

<script>
import { ref, computed, onMounted } from 'vue'
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
    const currentUserRole = ref(store.getters.userRole)
    const companies = ref([])
    const branches = ref([])

    const getDefaultRole = () => {
      return 'employee'
    }

    const formData = ref({
      name: '',
      father_name: '',
      email: '',
      phone_number: '',
      id_card_number: '',
      address: '',
      position: '',
      pay: '',
      role: getDefaultRole(),
      date_of_joining: '',
      company_id: '',
      branch_id: '',
      id_card_image: null,
      check_image: null,
    })

    const handleFileUpload = (field, event) => {
      const file = event.target.files[0]
      if (file) {
        formData.value[field] = file
        // Clear validation error for this field if it exists
        if (validationErrors.value[field]) {
          validationErrors.value = { ...validationErrors.value, [field]: [] }
        }
      }
    }

    const fetchCompanies = async () => {
      try {
        console.log('Fetching companies...')
        const result = await store.dispatch('getAllCompanies')
        console.log('API Response:', result)

        if (result.success) {
          companies.value = result.companies
          console.log('Companies loaded:', companies.value)
        } else {
          console.error('Failed to load companies:', result.message)
        }
      } catch (error) {
        console.error('Error in fetchCompanies:', error)
      }
    }

    const fetchBranches = async () => {
      try {
        console.log('Fetching branches...')
        const result = await store.dispatch('getAllBranches')
        console.log('API Response:', result)

        if (result.success) {
          branches.value = result.branches
          console.log('Branches loaded:', branches.value)
        } else {
          console.error('Failed to load branches:', result.message)
        }
      } catch (error) {
        console.error('Error in fetchBranches:', error)
      }
    }

    onMounted(async () => {
      const userRole = store.getters.getUserRole
      console.log('Current user role:', userRole)

      if (userRole === 'admin') {
        await fetchCompanies()
      }
      await fetchBranches()
    })

    const submitForm = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        validationErrors.value = {}
        showSuccess.value = false
        showError.value = false

        // Only include company_id if user is admin
        const submitData = {
          ...formData.value,
          company_id: isAdmin.value ? formData.value.company_id : undefined,
        }

        const result = await store.dispatch('registerEmployee', submitData)

        if (result.success) {
          showSuccess.value = true
          successMessage.value = 'Employee registered successfully! Check email for password setup.'
          resetForm()
        } else {
          if (result.errors) {
            validationErrors.value = result.errors
            showError.value = true
            errorMessage.value = 'Please correct the errors below.'
          } else {
            showError.value = true
            errorMessage.value = result.message || 'Registration failed'
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
        father_name: '',
        email: '',
        phone_number: '',
        id_card_number: '',
        address: '',
        position: '',
        pay: '',
        role: getDefaultRole(),
        date_of_joining: '',
        company_id: '',
        id_card_image: null,
        check_image: null,
      }
      validationErrors.value = {}

      // Reset file inputs
      const fileInputs = ['id_card_image', 'check_image']
      fileInputs.forEach((field) => {
        const input = document.getElementById(field)
        if (input) {
          input.value = ''
        }
      })
    }

    // Computed properties to check user roles
    const userRole = computed(() => store.getters.getUserRole)

    const isAdmin = computed(() => {
      return userRole.value === 'admin'
    })

    const isAdminOrCompanyAdmin = computed(() => {
      return ['admin', 'company admin'].includes(userRole.value)
    })

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
      resetForm,
      currentUserRole,
      isAdmin,
      isAdminOrCompanyAdmin,
      companies,
      branches,
    }
  },
}
</script>
