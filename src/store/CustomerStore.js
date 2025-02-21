import AuthApiServices from '@/services/AuthApiServices'

const state = {
  registrationLoading: false,
  registrationError: null,
}

const mutations = {
  SET_REGISTRATION_LOADING(state, status) {
    state.registrationLoading = status
  },
  SET_REGISTRATION_ERROR(state, error) {
    state.registrationError = error
  },
}

const actions = {
  async registerCustomer({ commit }, customerData) {
    commit('SET_REGISTRATION_LOADING', true)
    commit('SET_REGISTRATION_ERROR', null)

    try {
      const formData = new FormData()

      // Fix the casing for CNIC image field names
      const fieldMappings = {
        cnic_front_image: 'cnic_Front_image',
        cnic_back_image: 'cnic_Back_image',
        customer_image: 'customer_image',
        check_image: 'check_image',
      }

      // Append all customer data to FormData with corrected field names
      Object.keys(customerData).forEach((key) => {
        const apiFieldName = fieldMappings[key] || key

        if (Object.keys(fieldMappings).includes(key) && customerData[key]) {
          // Handle file/blob data
          if (customerData[key] instanceof File || customerData[key] instanceof Blob) {
            const filename = customerData[key].name || `${apiFieldName}_${Date.now()}.jpg`
            formData.append(apiFieldName, customerData[key], filename)
          }
        } else if (customerData[key] !== null && customerData[key] !== undefined) {
          // Handle other fields
          formData.append(apiFieldName, customerData[key])
        }
      })

      const response = await AuthApiServices.PostRequest('/add-customer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Handle validation errors from API
      if (response.message === 'Validation failed' && response.errors) {
        return {
          success: false,
          message: 'Please correct the validation errors',
          errors: response.errors,
        }
      }

      // Check for successful response
      if (response.status === 'success' || response.message === 'Customer created successfully') {
        return {
          success: true,
          message: response.message || 'Customer created successfully',
          data: response.data,
        }
      }

      // If we get here, it's an error response
      throw new Error(response.message || 'Failed to register customer')
    } catch (error) {
      console.error('Registration error:', error)

      return {
        success: false,
        message: error.message || 'Error registering customer',
        errors: error.response?.data?.errors || {},
      }
    } finally {
      commit('SET_REGISTRATION_LOADING', false)
    }
  },
}

const getters = {
  isRegistrationLoading: (state) => state.registrationLoading,
  registrationError: (state) => state.registrationError,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
