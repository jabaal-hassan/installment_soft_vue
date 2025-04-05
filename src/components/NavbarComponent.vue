<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- Mobile View - Navbar Toggle, Logo, Icons -->
      <div class="d-lg-none d-flex align-items-center justify-content-between w-100">
        <button
          class="navbar-toggler me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <a class="navbar-brand mx-auto" href="#">
          <img class="logo" :src="companyLogo" alt="company logo" />
        </a>
      </div>

      <!-- Desktop Logo (Left side) -->
      <a class="navbar-brand d-none d-lg-block" href="#">
        <!-- Use dynamic binding for the logo image -->
        <img class="logo" :src="companyLogo" alt="company logo" />
      </a>

      <!-- Desktop & Tablet View - Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li
            class="nav-item dropdown"
            @mouseenter="openDropdown('customerDropdown')"
            @mouseleave="closeDropdown('customerDropdown')"
          >
            <a class="nav-link" href="#" id="customerDropdown" role="button">
              <i class="fas fa-users me-2"></i> Customer
            </a>
            <ul class="dropdown-menu" :class="{ show: isOpen.customerDropdown }">
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('addCustomerDropdown')"
                @mouseleave="closeDropdown('addCustomerDropdown')"
              >
                <router-link to="/dashboard/add-customer" class="dropdown-item">
                  <i class="fas fa-user-plus me-2"></i> Add Customer
                </router-link>
              </li>
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('addGuarantorDropdown')"
                @mouseleave="closeDropdown('addGuarantorDropdown')"
              >
                <router-link to="/dashboard/customer-without-guarantor" class="dropdown-item">
                  <i class="fas fa-user-plus me-2"></i> Add Guarantor
                </router-link>
              </li>
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('InquiryDropdown')"
                @mouseleave="closeDropdown('InquiryDropdown')"
              >
                <router-link to="/dashboard/inquiry-customers" class="dropdown-item">
                  <i class="fas fa-users-viewfinder me-2"></i> Inquiry Customers
                </router-link>
              </li>
              <li
                v-if="isAdminOrBranchAdmin"
                class="dropdown-submenu"
                @mouseenter="openDropdown('RejectedDropdown')"
                @mouseleave="closeDropdown('RejectedDropdown')"
              >
                <router-link to="/dashboard/rejected-customers" class="dropdown-item">
                  <i class="fas fa-users-viewfinder me-2"></i> Rejected Customers
                </router-link>
              </li>
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewCustomerDropdown')"
                @mouseleave="closeDropdown('viewCustomerDropdown')"
                v-if="isAdminOrBranchAdmin"
              >
                <router-link to="/dashboard/view-confirmed-customers" class="dropdown-item">
                  <i class="fas fa-users-viewfinder me-2"></i> Delivery Table
                </router-link>
              </li>
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('installmentTableDropdown')"
                @mouseleave="closeDropdown('installmentTableDropdown')"
              >
                <router-link to="/dashboard/installment-table" class="dropdown-item">
                  <i class="fas fa-users-viewfinder me-2"></i> Installment Table
                </router-link>
              </li>
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewCustomerDropdown')"
                @mouseleave="closeDropdown('viewCustomerDropdown')"
              >
                <router-link to="/dashboard/view-customers" class="dropdown-item">
                  <i class="fas fa-users-viewfinder me-2"></i> View Customers
                </router-link>
              </li>
            </ul>
          </li>

          <li
            v-if="isAdminOrBranchAdmin"
            class="nav-item dropdown"
            @mouseenter="openDropdown('employeeDropdown')"
            @mouseleave="closeDropdown('employeeDropdown')"
          >
            <a class="nav-link" href="#" id="employeeDropdown" role="button"
              ><i class="fas fa-user me-2"></i> Employee
            </a>
            <ul class="dropdown-menu" :class="{ show: isOpen.employeeDropdown }">
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('addEmployeeDropdown')"
                @mouseleave="closeDropdown('addEmployeeDropdown')"
              >
                <router-link to="/dashboard/add-employee" class="dropdown-item">
                  <i class="fas fa-user-plus me-2"></i> Add New Employee
                </router-link>
              </li>

              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewEmployeeDropdown')"
                @mouseleave="closeDropdown('viewEmployeeDropdown')"
              >
                <router-link to="/dashboard/view-employees" class="dropdown-item">
                  <i class="fas fa-users-viewfinder me-2"></i> View Employee
                </router-link>
              </li>
            </ul>
          </li>

          <li
            v-if="isAdminOrCompanyAdmin"
            class="nav-item dropdown"
            @mouseenter="openDropdown('companyDropdown')"
            @mouseleave="closeDropdown('companyDropdown')"
          >
            <a class="nav-link" href="#" id="companyDropdown" role="button">
              <i class="fas fa-building me-2"></i><span v-if="isAdmin"> Company & </span>Branch
            </a>
            <ul class="dropdown-menu" :class="{ show: isOpen.companyDropdown }">
              <li
                v-if="isAdmin"
                class="dropdown-submenu"
                @mouseenter="openDropdown('addCompanyDropdown')"
                @mouseleave="closeDropdown('addCompanyDropdown')"
              >
                <router-link to="/dashboard/add-company" class="dropdown-item">
                  <i class="fas fa-plus-circle me-2"></i> Add Company
                </router-link>
              </li>

              <li
                v-if="isAdminOrCompanyAdmin"
                class="dropdown-submenu"
                @mouseenter="openDropdown('addBranchDropdown')"
                @mouseleave="closeDropdown('addBranchDropdown')"
              >
                <router-link to="/dashboard/add-branch" class="dropdown-item">
                  <i class="fas fa-code-branch me-2"></i> Add Branch
                </router-link>
              </li>

              <li
                v-if="isAdmin"
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewCompanyDropdown')"
                @mouseleave="closeDropdown('viewCompanyDropdown')"
              >
                <router-link to="/dashboard/view-companies" class="dropdown-item">
                  <i class="fas fa-list me-2"></i> View Companies
                </router-link>
              </li>

              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewBranchDropdown')"
                @mouseleave="closeDropdown('viewBranchDropdown')"
              >
                <router-link to="/dashboard/view-branches" class="dropdown-item">
                  <i class="fas fa-sitemap me-2"></i> View Branches
                </router-link>
              </li>
            </ul>
          </li>

          <li
            class="nav-item dropdown"
            v-if="isAdminOrBranchAdmin"
            @mouseenter="openDropdown('inventoryDropdown')"
            @mouseleave="closeDropdown('inventoryDropdown')"
          >
            <a class="nav-link" href="#" id="inventoryDropdown" role="button">
              <i class="fas fa-box me-2"></i> Inventory
            </a>
            <ul class="dropdown-menu" :class="{ show: isOpen.inventoryDropdown }">
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('addInventoryDropdown')"
                @mouseleave="closeDropdown('addInventoryDropdown')"
              >
                <router-link to="/dashboard/add-inventory" class="dropdown-item">
                  <i class="fas fa-plus-circle me-2"></i> Add Inventory
                </router-link>
              </li>

              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewInventoryDropdown')"
                @mouseleave="closeDropdown('viewInventoryDropdown')"
              >
                <router-link to="/dashboard/view-inventory" class="dropdown-item">
                  <i class="fas fa-list me-2"></i> View Inventory
                </router-link>
              </li>
            </ul>
          </li>

          <!-- New Installment Plan Dropdown -->
          <li
            class="nav-item dropdown"
            v-if="isAdminOrBranchAdmin"
            @mouseenter="openDropdown('installmentPlanDropdown')"
            @mouseleave="closeDropdown('installmentPlanDropdown')"
          >
            <a class="nav-link" href="#" id="installmentPlanDropdown" role="button">
              <i class="fas fa-calendar-alt me-2"></i> Installment Plan
            </a>
            <ul class="dropdown-menu" :class="{ show: isOpen.installmentPlanDropdown }">
              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('addInstallmentPlanDropdown')"
                @mouseleave="closeDropdown('addInstallmentPlanDropdown')"
              >
                <router-link to="/dashboard/add-installment-plan" class="dropdown-item">
                  <i class="fas fa-plus-circle me-2"></i> Add Installment Plan
                </router-link>
              </li>

              <li
                class="dropdown-submenu"
                @mouseenter="openDropdown('viewInstallmentPlanDropdown')"
                @mouseleave="closeDropdown('viewInstallmentPlanDropdown')"
              >
                <router-link to="/dashboard/view-installment-plans" class="dropdown-item">
                  <i class="fas fa-list me-2"></i> View Installment Plans
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <button @click="logout" class="btn btn-outline-danger btn-sm" :disabled="isLoggingOut">
              <span v-if="isLoggingOut" class="spinner">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              <span v-else>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters, useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavbarComponent',
  computed: {
    ...mapGetters(['getLanguageModalState', 'getUserCompanyLogo']),

    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },

    isOpen() {
      return this.$store.state.isOpen
    },

    isAdminOrBranchAdmin() {
      const role = this.$store.getters.getUserRole
      return role === 'admin' || role === 'company admin' || role === 'branch admin'
    },

    isAdmin() {
      const role = this.$store.getters.getUserRole
      return role === 'admin'
    },

    isAdminOrCompanyAdmin() {
      const role = this.$store.getters.getUserRole
      return role === 'admin' || role === 'company admin'
    },

    companyLogo() {
      return this.$store.getters.getUserCompanyLogo
    },
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const successMessage = ref('')
    const errorMessage = ref('')
    const showSuccessPopup = ref(false)
    const showErrorPopup = ref(false)
    const isLoggingOut = ref(false)

    const logout = async () => {
      isLoggingOut.value = true
      try {
        const response = await store.dispatch('logoutUser')
        if (response.success) {
          successMessage.value = response.message || 'Logout successful! Redirecting to login...'
          showSuccessPopup.value = true
          router.push('/login')
        } else {
          errorMessage.value = response.message || 'Logout failed. Please try again.'
          showErrorPopup.value = true
        }
      } catch (error) {
        console.error('Error during logout:', error)
        errorMessage.value = error.message || 'An error occurred. Please try again.'
        showErrorPopup.value = true
      } finally {
        isLoggingOut.value = false
      }
    }

    onMounted(() => {
      store
        .dispatch('getSingleCompany')
        .then((response) => {
          if (response && response.data && response.data.company) {
            store.commit('setUserCompanyLogo', response.data.company.logo)
          }
        })
        .catch((error) => {
          console.error('Error fetching company data:', error)
        })
    })

    return {
      successMessage,
      errorMessage,
      showSuccessPopup,
      showErrorPopup,
      logout,
      isLoggingOut,
    }
  },
  methods: {
    ...mapActions(['openDropdown', 'closeDropdown']),
    toggleDropdown(dropdown) {
      const isOpen = this.isOpen[dropdown]
      if (isOpen) {
        this.closeDropdown(dropdown)
      } else {
        this.openDropdown(dropdown)
      }
    },
    toggleLanguageModal() {
      if (this.isLanguageModalOpen) {
        this.closeLanguageModal()
      } else {
        this.openLanguageModal()
      }
    },
  },
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  width: 100%;
  padding: 0.8rem 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  width: 50px;
  height: 50px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-mobile {
  width: 4em;
}

.nav-link {
  font-size: 0.95rem;
  color: #2c3e50;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link:hover {
  background: rgba(65, 88, 208, 0.05);
  color: #4158d0;
}

.navbar-nav .dropdown-menu {
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 200px;
}

.dropdown-item {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(65, 88, 208, 0.05);
  color: #4158d0;
}

.btn-outline-danger {
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

/* Responsive Styles */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }

  form.d-flex {
    width: 100% !important;
    margin: 1rem 0 !important;
  }

  .input-group {
    width: 100%;
  }

  .input-group-text {
    left: 15px !important;
  }
}

@media (max-width: 767.98px) {
  .logo-mobile {
    width: 3.5em;
  }

  .btn-outline-danger {
    padding: 0.4rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 575.98px) {
  .navbar {
    padding: 0.5rem;
  }

  .logo-mobile {
    width: 3em;
  }

  .navbar-brand {
    margin-right: 0;
  }

  .nav-link {
    font-size: 0.9rem;
  }

  .dropdown-item {
    font-size: 0.9rem;
  }
}

/* Animation for dropdown */
.dropdown-menu {
  transform-origin: top;
  animation: dropdownFade 0.2s ease;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinner {
  display: inline-block;
  margin-right: 4px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.fa-spinner {
  font-size: 0.9rem;
  color: #dc3545;
}
</style>
