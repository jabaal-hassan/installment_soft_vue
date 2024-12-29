import axios from 'axios'
import store from '@/store'

export function setupInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        await store.dispatch('handleTokenExpiration')
      }
      return Promise.reject(error)
    },
  )
}
