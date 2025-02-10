import AuthApiServices from '@/services/AuthApiServices'

const state = {
  installmentPlans: [],
}

const getters = {
  allInstallmentPlans: (state) => state.installmentPlans,
}

const actions = {
  async addInstallmentPlan(_, payload) {
    console.log('Payload being sent to API:', payload)
    try {
      const response = await AuthApiServices.PostRequest('/store-installment-plan', {
        plan_name: payload.plan_name,
        plan_modal: payload.plan_modal,
        product_name: payload.product_name,
        product_model: payload.product_model,
        product_price: payload.product_price,
        advance: payload.advance,
        total_price: payload.total_price,
        remaining_amount: payload.remaining_amount,
        installment_price: payload.installment_price,
        installment_duration: payload.installment_duration,
        product_id: payload.product_id,
      })

      if (response.message === 'Installment plan created successfully') {
        return {
          success: true,
          message: 'Installment plan created successfully',
          installmentPlan: response.data.installmentPlan,
        }
      }

      return {
        success: false,
        message: response.message || 'Failed to create installment plan',
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error creating installment plan',
        errors: error.response?.data?.errors,
      }
    }
  },

  async getAllInstallmentPlans({ commit }) {
    try {
      const response = await AuthApiServices.GetRequest('/get-all-installment-plans')
      if (response.message === 'Installment plans retrieved successfully') {
        commit('setInstallmentPlans', response.data.installmentPlans)
        return {
          success: true,
          message: 'Installment plans retrieved successfully',
          plans: response.data.installmentPlans,
        }
      }
      return {
        success: false,
        message: response.message || 'Failed to retrieve installment plans',
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error retrieving installment plans',
      }
    }
  },

  async deleteInstallmentPlan(_, id) {
    try {
      const response = await AuthApiServices.DeleteRequest(`/delete-installment-plan/${id}`)
      if (response.message === 'Installment plan deleted successfully') {
        return {
          success: true,
          message: 'Installment plan deleted successfully',
        }
      }
      return {
        success: false,
        message: response.message || 'Failed to delete installment plan',
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting installment plan',
      }
    }
  },
}

const mutations = {
  setInstallmentPlans(state, plans) {
    state.installmentPlans = plans
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
