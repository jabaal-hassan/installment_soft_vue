import AuthApiServices from '@/services/AuthApiServices'

const state = {
  loading: false,
  error: null,
  customers: [],
  registrationLoading: false,
  registrationError: null,
  customersLoading: false,
  customersError: null,
  customersWithoutGuarantors: [],
  inquiryCustomers: [],
  rejectedCustomers: [],
  branchCustomers: [],
  confirmCustomers: [],
  sale: [],
  customerAccount: [],
  guarantors: [],
  installments: [], // <-- add this
}

const mutations = {
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
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
  SET_INQUIRY_CUSTOMERS(state, customers) {
    state.inquiryCustomers = customers
  },
  SET_REJECTED_CUSTOMERS(state, customers) {
    state.rejectedCustomers = customers
  },
  SET_BRANCH_CUSTOMERS(state, customers) {
    state.branchCustomers = customers
  },

  SET_CONFIRM_CUSTOMERS(state, customers) {
    state.confirmCustomers = customers
  },
  SET_INQUIRY_OFFICERS(state, officers) {
    state.inquiryOfficers = officers
  },
  UPDATE_CUSTOMER_STATUS(state, { id, status }) {
    const customer = state.customers.find((c) => c.id === id)
    if (customer) {
      customer.status = status
    }
  },
  SET_CUSTOMER(state, customer) {
    state.customer = customer
  },
  SET_SALE(state, sale) {
    state.sale = sale
  },
  SET_CUSTOMER_ACCOUNT(state, customerAccount) {
    state.customerAccount = customerAccount
  },
  SET_GUARANTORS(state, guarantors) {
    state.guarantors = guarantors
  },
  SET_iNSTALLMENT_TABLE(state, installmentTable) {
    state.installmentTable = installmentTable
  },
  UPDATE_INSTALLMENT_STATUS(state, { id, status }) {
    if (state.installmentTable) {
      const installment = state.installmentTable.find((i) => i.id === id)
      if (installment) {
        installment.status = status
      }
    }
  },
  SET_INSTALLMENTS(state, installments) {
    state.installments = installments
  },
}

const actions = {
  /************************************ register Customer ************************************/

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
          if (customerData[key] instanceof File || customerData[key] instanceof Blob) {
            const filename = customerData[key].name || `${apiFieldName}_${Date.now()}.jpg`
            formData.append(apiFieldName, customerData[key], filename)
          }
        } else if (customerData[key] !== null && customerData[key] !== undefined) {
          formData.append(apiFieldName, customerData[key])
        }
      })

      const response = await AuthApiServices.PostRequest('/add-customer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.message === 'Validation failed' && response.errors) {
        return {
          success: false,
          message: 'Please correct the validation errors',
          errors: response.errors,
        }
      }

      if (response.status === 'success' || response.message === 'Customer created successfully') {
        return {
          success: true,
          message: response.message || 'Customer created successfully',
          data: response.data,
        }
      }

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

  /************************************ store guarantor ************************************/

  async registerGuarantor({ commit }, guarantorData) {
    commit('SET_REGISTRATION_LOADING', true)
    commit('SET_REGISTRATION_ERROR', null)

    try {
      const formData = new FormData()

      const fieldMappings = {
        cnic_front_image: 'cnic_Front_image',
        cnic_back_image: 'cnic_Back_image',
      }

      Object.keys(guarantorData).forEach((key) => {
        const apiFieldName = fieldMappings[key] || key

        if (Object.keys(fieldMappings).includes(key) && guarantorData[key]) {
          if (guarantorData[key] instanceof File || guarantorData[key] instanceof Blob) {
            const filename = guarantorData[key].name || `${apiFieldName}_${Date.now()}.jpg`
            formData.append(apiFieldName, guarantorData[key], filename)
          }
        } else if (guarantorData[key] !== null && guarantorData[key] !== undefined) {
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

  /************************************ New action for getting customers without guarantors ************************************/

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

  /************************************ fetch inquiry Customer ************************************/
  async fetchInquiryCustomers({ commit }) {
    commit('SET_CUSTOMERS_LOADING', true)
    commit('SET_CUSTOMERS_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest('/get-inquiry-customers')

      if (response.data && response.data.customers) {
        commit('SET_INQUIRY_CUSTOMERS', response.data.customers) // Commit the mutation
        return {
          success: true,
          message: response.message,
          customers: response.data.customers,
        }
      }

      throw new Error('Invalid response structure')
    } catch (error) {
      console.error('Error fetching inquiry customers:', error)
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

  /************************************ fetch inquiry Customer ************************************/
  async fetchRejectedCustomers({ commit }) {
    commit('SET_CUSTOMERS_LOADING', true)
    commit('SET_CUSTOMERS_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest('/get-rejected-customers')

      if (response.data && response.data.customers) {
        commit('SET_REJECTED_CUSTOMERS', response.data.customers) // Commit the mutation
        return {
          success: true,
          message: response.message,
          customers: response.data.customers,
        }
      }

      throw new Error('Invalid response structure')
    } catch (error) {
      console.error('Error fetching rejected customers:', error)
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
  /************************************ fetch confired Customer ************************************/
  async fetchConfiredCustomers({ commit }) {
    commit('SET_CUSTOMERS_LOADING', true)
    commit('SET_CUSTOMERS_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest('/get-confirmed-customers')

      if (response.data && response.data.customers) {
        commit('SET_CONFIRM_CUSTOMERS', response.data.customers)
        return {
          success: true,
          message: response.message,
          customers: response.data.customers,
        }
      }

      throw new Error('Invalid response structure')
    } catch (error) {
      console.error('Error fetching confirm customers:', error)
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

  /************************************ fetch inquiry Customer ************************************/
  async fetchBranchCustomers({ commit }) {
    commit('SET_CUSTOMERS_LOADING', true)
    commit('SET_CUSTOMERS_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest('/get-branch-customers')

      if (response.data && response.data.customers) {
        commit('SET_BRANCH_CUSTOMERS', response.data.customers)
        return {
          success: true,
          message: response.message,
          customers: response.data.customers,
        }
      }

      throw new Error('Invalid response structure')
    } catch (error) {
      console.error('Error fetching branch customers:', error)
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

  /************************************ update Customer status ************************************/

  async updateCustomerStatus({ commit }, { id, status, inquiry_officer_id }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      // Prepare the payload
      const payload = {}
      if (status) {
        payload.status = status
      }
      if (inquiry_officer_id) {
        payload.inquiry_officer_id = inquiry_officer_id
      }

      // Make the API request
      const response = await AuthApiServices.PostRequest(`/update-customer/${id}`, payload)

      // Handle the response
      if (response.message === 'Customer updated successfully') {
        return {
          success: true,
          message: response.message || 'Customer updated successfully',
        }
      } else {
        return {
          success: false,
          message: response.message || 'Failed to update customer',
        }
      }
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to update customer status')

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message,
          errors: error.response?.data?.errors || {},
        }
      }

      return {
        success: false,
        message: error.message || 'Error updating customer',
        errors: error.response?.data?.errors || {},
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  /************************************ delete Customer ************************************/
  async deleteCustomer({ commit }, customerId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await AuthApiServices.DeleteRequest(`/delete-customer/${customerId}`)

      if (response.message === 'Customer deleted successfully') {
        return {
          success: true,
          message: response.message,
        }
      } else {
        throw new Error(response.message || 'Failed to delete customer')
      }
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to delete customer')
      return {
        success: false,
        message: error.message,
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  /************************************get Inquiry Officers ************************************/

  async getInquiryOfficers({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest('/get-inquiry-officers')
      if (response.data) {
        return {
          success: true,
          data: response.data,
        }
      } else {
        throw new Error(response.message || 'Failed to fetch inquiry officers')
      }
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to fetch inquiry officers')
      return {
        success: false,
        message: error.message,
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  /************************************ fetch Customer Details ************************************/

  async fetchCustomerDetails({ commit }, customerId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await AuthApiServices.GetRequest(`/get-customer/${customerId}`)

      if (response.message === 'Customer retrieved successfully') {
        commit('SET_CUSTOMER', response.data.customer)
        commit('SET_SALE', response.data.sale)
        commit('SET_CUSTOMER_ACCOUNT', response.data.customerAccount)
        commit('SET_GUARANTORS', response.data.guarantors)
        commit('SET_iNSTALLMENT_TABLE', response.data.installmentTable)
        return {
          success: true,
          message: response.message || 'Customer details fetched successfully',
          data: response.data,
        }
      } else {
        throw new Error(response.message || 'Failed to fetch customer details')
      }
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to fetch customer details')
      return {
        success: false,
        message: error.message,
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  /************************************ Update Installment Status ************************************/
  async updateInstallmentStatus({ commit }, installmentId) {
    commit('SET_LOADING', true)
    try {
      const response = await AuthApiServices.PostRequest(
        `/update-installment-table/${installmentId}`,
        {
          status: 'received',
        },
      )

      if (response.message === 'Installment updated successfully') {
        commit('UPDATE_INSTALLMENT_STATUS', { id: installmentId, status: 'received' })
        return {
          success: true,
          message: response.message,
        }
      }
      throw new Error(response.message || 'Failed to update installment')
    } catch (error) {
      console.error('Error updating installment:', error)

      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message,
          errors: error.response?.data?.errors || {},
        }
      }
      return {
        success: false,
        message: error.message || 'Failed to update installment',
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  /************************************ fetch Pending Installments ************************************/
  async fetchPendingInstallments({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await AuthApiServices.GetRequest('/get-current-month-installments')
      if (response.message === 'Pending installments retrieved successfully' && Array.isArray(response.data)) {
        commit('SET_INSTALLMENTS', response.data)
        return {
          success: true,
          message: response.message,
          installments: response.data,
        }
      }
      throw new Error(response.message || 'Failed to fetch installments')
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to fetch installments')
      return {
        success: false,
        message: error.message,
        installments: [],
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },
}

const getters = {
  customers: (state) => state.customers,
  loading: (state) => state.loading,
  error: (state) => state.error,
  isRegistrationLoading: (state) => state.registrationLoading,
  registrationError: (state) => state.registrationError,
  isCustomersLoading: (state) => state.customersLoading,
  customersError: (state) => state.customersError,
  customersWithoutGuarantors: (state) => state.customersWithoutGuarantors,
  sale: (state) => state.sale,
  customerAccount: (state) => state.customerAccount,
  guarantors: (state) => state.guarantors,
  installments: (state) => state.installments,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
