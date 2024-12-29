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
                <a class="dropdown-item" href="#">
                  <i class="fas fa-users-viewfinder me-2"></i> View Employee
                </a>
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
              <i class="fas fa-building me-2"></i> Company
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
        </ul>

        <form class="d-flex me-4 w-50 position-relative">
          <div class="input-group">
            <input
              class="form-control rounded-5 ps-5 border"
              type="search"
              placeholder="Search for anything"
              aria-label="Search"
            />
            <span
              class="input-group-text position-absolute"
              style="
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                background-color: transparent;
                border: none;
              "
            >
              <span class="material-icons"></span>
            </span>
          </div>
        </form>

        <ul class="navbar-nav">
          <li class="nav-item ms-3">
            <button @click="logout" class="btn btn-outline-danger btn-sm ms-2">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters, useStore } from 'vuex'
import { ref } from 'vue'
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

    const logout = async () => {
      try {
        const response = await store.dispatch('logoutUser')
        console.log('Logout response:', response)

        if (response.success) {
          successMessage.value = response.message || 'Logout successful! Redirecting to login...'
          showSuccessPopup.value = true

          // Immediately redirect to login page without delay
          router.push('/login')
        } else {
          errorMessage.value = response.message || 'Logout failed. Please try again.'
          showErrorPopup.value = true
        }
      } catch (error) {
        console.error('Error during logout:', error)
        errorMessage.value = error.message || 'An error occurred. Please try again.'
        showErrorPopup.value = true
      }
    }

    return {
      successMessage,
      errorMessage,
      showSuccessPopup,
      showErrorPopup,
      logout,
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
  box-shadow: 0 5px 2px -2px rgba(57, 57, 57, 0.2);
  background-color: white;
  width: 100vw;
}

.logo {
  width: 5em;
}

.logo-mobile {
  width: 4em;
}

.nav-link {
  font-size: 90%;
  color: rgb(28, 28, 28);
}

.navbar-nav .dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
}

.navbar-nav .dropdown-menu.show {
  display: block;
}

.navbar-nav .dropdown-menu.wide-dropdown {
  width: 250px;
}

.navbar-nav .dropdown-submenu {
  position: relative;
}

.navbar-nav .dropdown-submenu .dropdown-menu {
  top: 0;
  left: 100%;
  margin-left: 0;
}
</style>
