import axios from 'axios'

const baseURL = 'http://192.168.10.4:8000/api'

const AuthApiServices = {
  init() {
    axios.defaults.baseURL = baseURL
  },

  // Fetch the auth headers based on content type
  getAuthHeaders(isMultipart = false) {
    const accessToken = localStorage.getItem('access_token')
    const headers = {
      // Set content type based on request type
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      Accept: 'application/json',
      'ngrok-skip-browser-warning': 'true',
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    return headers
  },

  // Generic POST request
  async PostRequest(endpoint, data, config = {}) {
    try {
      // Check if the data is FormData
      const isMultipart = data instanceof FormData

      const response = await axios.post(`${baseURL}${endpoint}`, data, {
        ...config,
        headers: {
          ...this.getAuthHeaders(isMultipart),
          ...config.headers,
        },
      })
      return response.data
    } catch (error) {
      console.error('POST request error:', error.response?.data || error.message)
      if (error.response?.status === 422) {
        return {
          success: false,
          message: 'Validation failed',
          errors: error.response.data.errors,
        }
      }
      throw error
    }
  },

  // Generic GET request
  async GetRequest(endpoint, params = {}) {
    try {
      const headers = this.getAuthHeaders()
      console.log(`Making GET request to: ${baseURL}${endpoint}`, { params, headers })

      const response = await axios.get(`${baseURL}${endpoint}`, {
        params,
        headers,
      })

      console.log('GET request successful:', response)
      return response.data // Return the response data
    } catch (error) {
      console.error('GET request failed:', error)
      if (error.response) {
        throw new Error(error.response.data.message || 'GET request failed')
      }
      throw error
    }
  },

  // Generic PUT request
  async PutRequest(endpoint, data) {
    try {
      const headers = this.getAuthHeaders()
      console.log(`Making PUT request to: ${baseURL}${endpoint}`, { data, headers })

      const response = await axios.put(`${baseURL}${endpoint}`, data, {
        headers,
      })

      console.log('PUT request successful:', response)
      return response.data // Return the response data
    } catch (error) {
      console.error('PUT request failed:', error)
      if (error.response) {
        throw new Error(error.response.data.message || 'PUT request failed')
      }
      throw error
    }
  },

  // Generic DELETE request
  async DeleteRequest(endpoint, params = {}) {
    try {
      const headers = this.getAuthHeaders()
      console.log(`Making DELETE request to: ${baseURL}${endpoint}`, { params, headers })

      const response = await axios.delete(`${baseURL}${endpoint}`, {
        params,
        headers,
      })

      console.log('DELETE request successful:', response)
      return response.data // Return the response data
    } catch (error) {
      console.error('DELETE request failed:', error)
      if (error.response) {
        throw new Error(error.response.data.message || 'DELETE request failed')
      }
      throw error
    }
  },
}

export default AuthApiServices
