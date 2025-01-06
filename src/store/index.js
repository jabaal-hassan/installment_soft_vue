import { createStore } from 'vuex'
import AuthApiServices from '@/services/AuthApiServices' // Ensure this path is correct
import router from '@/router' // Add this import at the top

export default createStore({
  state: {
    user: null,
    loggedUser: null,
    loggedIn: false,
    isOpen: {
      employeeDropdown: false,
      companyDropdown: false,
      addCompanyDropdown: false,
      addBranchDropdown: false,
      viewCompanyDropdown: false,
      viewBranchDropdown: false,
      inventoryDropdown: false,
      addInventoryDropdown: false,
      viewInventoryDropdown: false,
    },
    isLanguageModalOpen: false,
    logoutMessage: '',
    registrationMessage: null,
    passwordSetupStatus: null,
    companies: [],
    branches: [],
  },
  getters: {
    getUser: (state) => state.user,
    getUserRole(state) {
      if (state.user && state.user.roles && state.user.roles.length > 0) {
        return state.user.roles[0]
      }
      return null
    },
    getUserPermissions: (state) => (state.user ? state.user.permissions : []),
    getLoggedUser: (state) => state.loggedUser,
    isLoggedIn: (state) => state.loggedIn,
    getDropdownState: (state) => (dropdown) => state.isOpen[dropdown],
    getLanguageModalState: (state) => state.isLanguageModalOpen,
    getRegistrationMessage: (state) => state.registrationMessage,
    getPasswordSetupStatus: (state) => state.passwordSetupStatus,
    getCompanies: (state) => state.companies,
    getBranches: (state) => state.branches,
  },
  mutations: {
    setUser(state, userData) {
      if (userData && userData.roles) {
        state.user = {
          roles: userData.roles,
          permissions: userData.permissions,
        }
      } else {
        console.error('Roles are missing from user data', userData)
      }
    },
    setLoggedUser(state, loggedUserData) {
      state.loggedUser = loggedUserData
    },
    clearUser(state) {
      state.user = null
      state.loggedUser = null
      state.loggedIn = false
    },
    setLoggedIn(state, status) {
      state.loggedIn = status
    },
    setDropdownState(state, { dropdown, value }) {
      state.isOpen[dropdown] = value
    },
    setRegistrationMessage(state, message) {
      state.registrationMessage = message
    },
    setPasswordSetupStatus(state, status) {
      state.passwordSetupStatus = status
    },
    SET_COMPANIES(state, companies) {
      state.companies = companies
    },
    SET_BRANCH(state, branch) {
      state.branches = [...state.branches, branch]
    },
  },
  actions: {
    async loginUser({ commit }, credentials) {
      try {
        const response = await AuthApiServices.PostRequest('/login', credentials)
        if (response && response.data && response.data.user) {
          const user = response.data.user
          commit('setUser', user)

          const loggedUserData = {
            id: user.id,
            roles: user.roles,
            permissions: user.permissions,
            name: user.name,
            email: user.email,
            token: response.data.token,
          }

          localStorage.setItem('authUser', JSON.stringify(user))
          localStorage.setItem('access_token', response.data.token)
          localStorage.setItem('logged_user', JSON.stringify(loggedUserData))
          commit('setLoggedUser', loggedUserData)
          commit('setLoggedIn', true)

          return { success: true, message: 'Login successful!' }
        } else {
          return { success: false, message: 'Invalid email or password' }
        }
      } catch (error) {
        console.error('Error during login:', error)
        if (error.response?.data?.message === 'Validation failed') {
          return {
            success: false,
            message: 'Invalid email or password',
            errors: error.response.data.errors,
          }
        }
        return {
          success: false,
          message: error.response?.data?.message || 'An error occurred. Please try again later.',
        }
      }
    },

    async logoutUser({ commit }) {
      try {
        const response = await AuthApiServices.PostRequest('/logout')
        if (
          response &&
          response.original &&
          response.original.message === 'User successfully logged out'
        ) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('authUser')
          localStorage.removeItem('logged_user')

          commit('clearUser')
          commit('setLoggedIn', false)

          return { success: true, message: 'Logout successful' }
        } else {
          return {
            success: false,
            message: response.original?.message || 'Unexpected response format',
          }
        }
      } catch (error) {
        console.error('Error logging out:', error)
        const errorMessage = error.response?.data?.message || 'An error occurred while logging out.'
        return { success: false, message: errorMessage }
      }
    },

    async handleTokenExpiration({ dispatch }) {
      await dispatch('logoutUser')
      router.push('/login')
    },

    initializeStore({ commit, dispatch }) {
      const token = localStorage.getItem('access_token')
      const authUser = localStorage.getItem('authUser')
      const loggedUserStr = localStorage.getItem('logged_user')

      if (token && authUser) {
        try {
          // Parse the JWT token
          const payload = JSON.parse(atob(token.split('.')[1]))
          const isExpired = payload.exp * 1000 < Date.now()

          if (isExpired) {
            // If token is expired, logout user
            dispatch('handleTokenExpiration')
          } else {
            // If token is valid, restore user state
            const parsedAuthUser = JSON.parse(authUser)
            const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : null

            commit('setUser', parsedAuthUser)
            commit('setLoggedUser', loggedUser)
            commit('setLoggedIn', true)

            // If user is not on login page, let them stay on current page
            if (router.currentRoute.value.path === '/login') {
              router.push('/') // or your default authenticated route
            }
          }
        } catch (error) {
          console.error('Error initializing store:', error)
          dispatch('handleTokenExpiration')
        }
      } else {
        // No token or user data found
        commit('clearUser')
        commit('setLoggedIn', false)

        // Only redirect to login if on a protected route
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login')
        }
      }
    },

    async fetchUserProfile({ commit }) {
      try {
        const response = await AuthApiServices.GetRequest('/profile')
        if (response && response.message === 'OK') {
          commit('setLoggedUser', response.data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    },

    openDropdown({ commit }, dropdown) {
      commit('setDropdownState', { dropdown, value: true })
    },

    closeDropdown({ commit }, dropdown) {
      commit('setDropdownState', { dropdown, value: false })
    },

    async registerEmployee({ commit, getters }, employeeData) {
      try {
        const formData = new FormData()
        const userRole = getters.getUserRole

        // Add all employee data fields
        Object.keys(employeeData).forEach((key) => {
          // Only include company_id if user is admin
          if (key === 'company_id' && userRole !== 'admin') {
            return // Skip company_id for non-admin users
          }

          if (employeeData[key] !== null && employeeData[key] !== undefined) {
            if (typeof employeeData[key] === 'object' && !(employeeData[key] instanceof File)) {
              formData.append(key, JSON.stringify(employeeData[key]))
            } else {
              formData.append(key, employeeData[key])
            }
          }
        })

        // Debug log
        console.log('User Role:', userRole)
        console.log('Form Data:')
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1])
        }

        const config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }

        const response = await AuthApiServices.PostRequest('/add-employee', formData, config)
        console.log('API Response:', response)

        if (response.message === 'User, Employee registered successfully') {
          commit(
            'setRegistrationMessage',
            'Registration successful! Check email for password setup.',
          )
          return { success: true, data: response.data }
        }

        return {
          success: false,
          message: response.message || 'Registration failed',
          errors: response.errors,
        }
      } catch (error) {
        console.error('Registration error:', error.response?.data || error)
        return {
          success: false,
          message: error.response?.data?.message || 'Registration failed',
          errors: error.response?.data?.errors,
        }
      }
    },

    async setupPassword(_, payload) {
      try {
        const response = await AuthApiServices.PostRequest('/password-setup', {
          email: payload.email,
          token: payload.token,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        })

        // Check for successful response
        if (response.message === 'Password setup successful') {
          return {
            success: true,
            message: 'Password setup successful',
          }
        }

        // Handle error cases
        return {
          success: false,
          message: response.message || 'Password setup failed',
          errors: response.errors,
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Password setup failed',
          errors: error.response?.data?.errors,
        }
      }
    },

    async getAllCompanies({ commit }) {
      try {
        const response = await AuthApiServices.GetRequest('/get-all-company')
        console.log('API Response:', response) // Debug log

        if (response.data && response.data.companies) {
          commit('SET_COMPANIES', response.data.companies)
          return { success: true, companies: response.data.companies }
        }
        return { success: false, message: 'No companies found' }
      } catch (error) {
        console.error('Error fetching companies:', error)
        return { success: false, message: 'Failed to fetch companies' }
      }
    },

    async registerCompany(_, formData) {
      try {
        const response = await AuthApiServices.PostRequest('/add-company', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.message === 'Company created successfully,') {
          return {
            success: true,
            message: response.message,
            company: response.data.company,
          }
        }

        return {
          success: false,
          message: response.message || 'Unexpected response format',
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add company',
          errors: error.response?.data?.errors,
        }
      }
    },

    async registerBranch({ commit, getters }, branchData) {
      try {
        const userRole = getters.getUserRole
        let dataToSend = { ...branchData }

        if (userRole !== 'admin') {
          delete dataToSend.company_id
        }

        const response = await AuthApiServices.PostRequest('/add-branch', dataToSend)

        if (response.message === 'Branch created successfully') {
          commit('SET_BRANCH', response.data.branch)
          return {
            success: true,
            message: response.message,
            branch: response.data.branch,
          }
        }

        if (response.message === 'Validation failed') {
          return {
            success: false,
            message: response.message,
            errors: response.errors,
          }
        }

        return {
          success: false,
          message: response.message || 'Unexpected response format',
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to add branch',
          errors: error.response?.data?.errors,
        }
      }
    },

    async getAllBranches() {
      try {
        const response = await AuthApiServices.GetRequest('/get-all-branches')

        if (response.message === 'Branches fetched successfully') {
          return {
            success: true,
            branches: response.data.branches,
          }
        }

        return {
          success: false,
          message: response.message || 'Failed to fetch branches',
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch branches',
        }
      }
    },

    async sendPasswordResetLink(_, payload) {
      try {
        const response = await AuthApiServices.PostRequest('/send-password-reset-link', payload)
        if (response.message === 'Password reset link sent') {
          return { success: true, message: response.message }
        }
        return { success: false, message: response.message || 'Failed to send password reset link' }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'An error occurred' }
      }
    },

    async getAllCategories() {
      try {
        const response = await AuthApiServices.GetRequest('/get-all-categories')
        if (response.message === 'Categories retrieved successfully') {
          return {
            success: true,
            categories: response.data.Categories,
          }
        }
        return {
          success: false,
          message: 'Failed to fetch categories',
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error fetching categories',
        }
      }
    },

    async getAllBrands() {
      try {
        const response = await AuthApiServices.GetRequest('/get-all-brands')
        if (response.message === 'Brands retrieved successfully') {
          return {
            success: true,
            brands: response.data.Brands,
          }
        }
        return {
          success: false,
          message: 'Failed to fetch brands',
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error fetching brands',
        }
      }
    },

    async addInventory(_, payload) {
      try {
        const response = await AuthApiServices.PostRequest('/store-inventory', {
          item_name: payload.item_name,
          branch_id: payload.branch_id,
          category_id: payload.category_id,
          brand_id: payload.brand_id,
          model: payload.model,
          serial_number: payload.serial_number,
          color: payload.color || null,
          description: payload.description || null,
          quantity: payload.quantity || 1,
          price: payload.price,
        })

        if (response.message === 'Inventory item stored successfully') {
          return {
            success: true,
            message: 'Inventory item added successfully',
            inventory: response.data.Inventory,
          }
        }

        return {
          success: false,
          message: response.message || 'Failed to add inventory item',
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Error adding inventory item',
          errors: error.response?.data?.errors,
        }
      }
    },

    async getAllInventory() {
      try {
        const response = await AuthApiServices.GetRequest('/get-all-inventory')
        return {
          success: true,
          data: response.data,
          message: response.message,
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch inventory',
        }
      }
    },

    async updateInventory(_, { id, data }) {
      try {
        const response = await AuthApiServices.PutRequest(`/update-inventory/${id}`, data)
        return {
          success: true,
          data: response.data,
          message: response.message,
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to update inventory',
        }
      }
    },

    async deleteInventory(_, id) {
      try {
        const response = await AuthApiServices.DeleteRequest(`/delete-inventory/${id}`)
        return {
          success: true,
          message: response.message,
        }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to delete inventory',
        }
      }
    },
  },
})
