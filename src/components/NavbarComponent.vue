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
          <img class="logo-mobile" src="../assets/udemy-logo.png" alt="logo" />
        </a>
      </div>

      <!-- Desktop Logo (Left side) -->
      <a class="navbar-brand d-none d-lg-block" href="#">
        <img class="logo" src="../assets/udemy-logo.png" alt="logo" />
      </a>

      <!-- Desktop & Tablet View - Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
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
        </ul>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <button @click="goToSearch" class="btn btn-outline-primary search-btn">
              <i class="fas fa-search"></i>
              <span class="ms-2">Search</span>
            </button>
          </li>
          <li class="nav-item ms-3">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavbarComponent',
  computed: {
    ...mapGetters(['getLanguageModalState']),

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
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const successMessage = ref('')
    const errorMessage = ref('')
    const showSuccessPopup = ref(false)
    const showErrorPopup = ref(false)
    const isLoggingOut = ref(false)
    const searchQuery = ref('')
    const searchResults = ref([])
    const showResults = ref(false)
    const searchTimeout = ref(null)

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

    const handleSearchInput = () => {
      if (searchTimeout.value) clearTimeout(searchTimeout.value)

      if (searchQuery.value.length > 2) {
        searchTimeout.value = setTimeout(() => {
          performSearch()
        }, 300)
      } else {
        searchResults.value = []
        showResults.value = false
      }
    }

    const performSearch = async () => {
      // Search in employees
      const employeeResults = store.state.employees
        .filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
        .map((emp) => ({
          ...emp,
          type: 'Employee',
        }))

      // Search in inventory
      const inventoryResults = store.state.inventory
        .filter(
          (item) =>
            item.product_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            item.category_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
        .map((item) => ({
          ...item,
          type: 'Inventory',
        }))

      searchResults.value = [...employeeResults, ...inventoryResults].slice(0, 5)
      showResults.value = true
    }

    const navigateToResult = (result) => {
      searchQuery.value = ''
      showResults.value = false

      if (result.type === 'Employee') {
        router.push({
          name: 'EmployeeView',
          query: { highlight: result.id },
        })
      } else {
        router.push({
          name: 'InventoryView',
          query: { highlight: result.id },
        })
      }
    }

    const getResultIcon = (type) => {
      return type === 'Employee' ? 'fas fa-user' : 'fas fa-box'
    }

    // Close results when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-input')) {
        showResults.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const goToSearch = () => {
      router.push({ name: 'SearchResults' })
    }

    return {
      successMessage,
      errorMessage,
      showSuccessPopup,
      showErrorPopup,
      logout,
      isLoggingOut,
      searchQuery,
      searchResults,
      showResults,
      handleSearchInput,
      performSearch,
      navigateToResult,
      getResultIcon,
      goToSearch,
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
  width: 5em;
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

.search-input {
  width: 100% !important;
  height: 45px;
  padding-left: 1.5rem !important;
  font-size: 0.95rem;
  border-radius: 25px !important;
}

.search-input:focus {
  background: white;
  box-shadow: 0 0 0 4px rgba(65, 88, 208, 0.1);
  border-color: #4158d0;
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

  .search-input {
    width: 100% !important;
    height: 45px;
    font-size: 0.95rem;
    padding-left: 1.5rem !important;
  }

  .input-group-text {
    left: 15px !important;
  }
}

@media (max-width: 767.98px) {
  .logo-mobile {
    width: 3.5em;
  }

  .search-input {
    font-size: 0.9rem;
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

  .search-input {
    font-size: 0.85rem;
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

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-result-item:hover {
  background: rgba(65, 88, 208, 0.05);
}

.search-result-item i {
  color: #4158d0;
  width: 20px;
  text-align: center;
}

.result-info {
  flex: 1;
}

.result-title {
  font-weight: 500;
  color: #2c3e50;
}

.result-type {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Responsive styles */
@media (max-width: 991.98px) {
  .search-results {
    position: fixed;
    top: auto;
    left: 10px;
    right: 10px;
    margin-top: 10px;
  }
}

form.d-flex {
  position: relative;
  width: 40%;
  margin: 0 auto;
}

.input-group {
  width: 100%;
}

.search-input {
  width: 100% !important;
  height: 45px;
  padding-left: 1.5rem !important;
  font-size: 0.95rem;
  border-radius: 25px !important;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  form.d-flex {
    width: 100%;
    margin: 1rem 0;
  }
}

.search-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: transparent;
  border: 2px solid #4158d0;
  color: #4158d0;
}

.search-btn:hover {
  background: #4158d0;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(65, 88, 208, 0.15);
}

@media (max-width: 768px) {
  .search-btn {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .search-btn span {
    display: none;
  }
}
</style>
