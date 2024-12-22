import { createStore } from 'vuex'
import AuthApiServices from '@/services/AuthApiServices' // Ensure this path is correct

export default createStore({
  state: {
    user: null,
    loggedUser: null,
    loggedIn: false,
    isOpen: {
      employeeDropdown: false,
    },
    isLanguageModalOpen: false,
    logoutMessage: '',
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
          return { success: false, message: 'Unexpected response format' }
        }
      } catch (error) {
        console.error('Error during login:', error)
        return { success: false, message: 'An error occurred. Please try again later.' }
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

    initializeStore({ commit }) {
      const token = localStorage.getItem('access_token')
      const authUser = localStorage.getItem('authUser')
      const loggedUser = JSON.parse(localStorage.getItem('logged_user'))

      if (token && authUser) {
        commit('setUser', JSON.parse(authUser))
        commit('setLoggedUser', loggedUser)
        commit('setLoggedIn', true)
      } else {
        commit('setLoggedIn', false)
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
  },
})
