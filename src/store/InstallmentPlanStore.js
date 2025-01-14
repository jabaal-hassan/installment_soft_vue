import AuthApiServices from '@/services/AuthApiServices'

const state = {
  // Define state properties if needed
}

const getters = {
  // Define getters if needed
}

const actions = {
  async addInstallmentPlan(_, payload) {
    try {
      const response = await AuthApiServices.PostRequest('/store-installment-plan', {
        plan_name: payload.plan_name,
        city: payload.city,
        product_name: payload.product_name,
        Product_model: payload.Product_model,
        product_price: payload.product_price,
        advance: payload.advance,
        percentage: payload.percentage || null,
        total_price: payload.total_price,
        remaining_amount: payload.remaining_amount,
        installment_price: payload.installment_price,
        installment_duration: payload.installment_duration,
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
}

const mutations = {
  // Define mutations if needed
}

export default {
  state,
  getters,
  actions,
  mutations,
}
