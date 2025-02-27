import AuthApiServices from '@/services/AuthApiServices'

const state = {
  registrationLoading: false,
  registrationError: null,
  customersLoading: false,
  customersError: null,
  customersWithoutGuarantors: [],
}

const mutations = {
  SET_REGISTRATION_LOADING(state, status) {
    state.registrationLoading = status
  },
  SET_REGISTRATION_ERROR(state, error) {
    state.registrationError = error
  },
  SET_CUSTOMERS_LOADING(state, status) {
    state.customersLoading = status
  },
  SET_CUSTOMERS_ERROR(state, error) {
    state.customersError = error
  },
  SET_CUSTOMERS_WITHOUT_GUARANTORS(state, customers) {
    state.customersWithoutGuarantors = customers
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

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message,
          errors: error.response?.data?.errors || {},
        }
      }

      return {
        success: false,
        message: error.message || 'Error registering customer',
        errors: error.response?.data?.errors || {},
      }
    } finally {
      commit('SET_REGISTRATION_LOADING', false)
    }
  },

  async registerGuarantor({ commit }, guarantorData) {
    commit('SET_REGISTRATION_LOADING', true)
    commit('SET_REGISTRATION_ERROR', null)

    try {
      const formData = new FormData()

      // Fix the casing for CNIC image field names
      const fieldMappings = {
        cnic_front_image: 'cnic_Front_image',
        cnic_back_image: 'cnic_Back_image',
      }

      // Append all guarantor data to FormData with corrected field names
      Object.keys(guarantorData).forEach((key) => {
        const apiFieldName = fieldMappings[key] || key

        if (Object.keys(fieldMappings).includes(key) && guarantorData[key]) {
          // Handle file/blob data
          if (guarantorData[key] instanceof File || guarantorData[key] instanceof Blob) {
            const filename = guarantorData[key].name || `${apiFieldName}_${Date.now()}.jpg`
            formData.append(apiFieldName, guarantorData[key], filename)
          }
        } else if (guarantorData[key] !== null && guarantorData[key] !== undefined) {
          // Handle other fields
          formData.append(apiFieldName, guarantorData[key])
        }
      })

      const response = await AuthApiServices.PostRequest('/add-guarantor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Check if guarantor limit exceeded
      if (response.message === 'Guarantor can only provide two guarantees') {
        return {
          success: false,
          message: response.message,
          errors: {},
        }
      }

      // Handle validation errors from API
      if (response.message === 'Validation failed' && response.errors) {
        return {
          success: false,
          message: 'Please correct the validation errors',
          errors: response.errors,
        }
      }

      // Check for successful response
      if (response.message === 'Guarantor added successfully') {
        return {
          success: true,
          message: response.message,
          data: response.data,
        }
      }

      // If we get here, it's an error response
      throw new Error(response.message || 'Failed to add guarantor')
    } catch (error) {
      console.error('Guarantor registration error:', error)

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message,
          errors: error.response?.data?.errors || {},
        }
      }

      return {
        success: false,
        message: error.message || 'Error registering guarantor',
        errors: error.response?.data?.errors || {},
      }
    } finally {
      commit('SET_REGISTRATION_LOADING', false)
    }
  },
  // New action for getting customers without guarantors
  async getCustomersWithoutGuarantors({ commit }) {
    commit('SET_CUSTOMERS_LOADING', true)
    commit('SET_CUSTOMERS_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest('/get-customers-without-guarantors')

      if (response.data && response.data.customers) {
        commit('SET_CUSTOMERS_WITHOUT_GUARANTORS', response.data.customers)
        return {
          success: true,
          message: response.message,
          customers: response.data.customers,
        }
      }

      throw new Error('Invalid response structure')
    } catch (error) {
      console.error('Error fetching customers without guarantors:', error)
      commit('SET_CUSTOMERS_ERROR', error.message || 'Failed to fetch customers')
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        customers: [],
      }
    } finally {
      commit('SET_CUSTOMERS_LOADING', false)
    }
  },
}

const getters = {
  isRegistrationLoading: (state) => state.registrationLoading,
  registrationError: (state) => state.registrationError,
  isCustomersLoading: (state) => state.customersLoading,
  customersError: (state) => state.customersError,
  customersWithoutGuarantors: (state) => state.customersWithoutGuarantors,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
